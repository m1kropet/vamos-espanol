// Распознавание речи и синтез через Cloudflare Workers AI (бесплатный дневной лимит).

const STT_MODELS = ["@cf/openai/whisper-large-v3-turbo", "@cf/openai/whisper"];

export function toBase64(buf) {
  const bytes = new Uint8Array(buf);
  let bin = "";
  const CH = 0x8000;
  for (let i = 0; i < bytes.length; i += CH) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + CH));
  return btoa(bin);
}
export function fromBase64(b64) {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

// → { text, words:[{word,start,end}], confidence (0..1|null), noSpeech (0..1|null), model }
export async function transcribe(env, audioBuf) {
  let lastErr;
  for (const model of STT_MODELS) {
    try {
      const input = model.endsWith("turbo")
        ? { audio: toBase64(audioBuf), language: "es", task: "transcribe", vad_filter: true }
        : { audio: [...new Uint8Array(audioBuf)] };
      const r = await env.AI.run(model, input);
      const text = String((r && (r.text || (r.result && r.result.text))) || "").trim();
      const segs = (r && r.segments) || [];
      let words = [];
      segs.forEach((s) => (s.words || []).forEach((w) => words.push({ word: String(w.word || "").trim(), start: w.start, end: w.end })));
      if (!words.length && r && Array.isArray(r.words)) words = r.words.map((w) => ({ word: String(w.word || "").trim(), start: w.start, end: w.end }));
      const lp = segs.map((s) => s.avg_logprob).filter((x) => typeof x === "number");
      const ns = segs.map((s) => s.no_speech_prob).filter((x) => typeof x === "number");
      const confidence = lp.length ? Math.exp(lp.reduce((a, b) => a + b, 0) / lp.length) : null;
      const noSpeech = ns.length ? Math.max(...ns) : null;
      const lang = r && r.transcription_info && r.transcription_info.language;
      return { text, words, confidence, noSpeech, lang, model };
    } catch (e) {
      lastErr = e;
    }
  }
  throw new Error("stt_failed: " + (lastErr && lastErr.message));
}

// Приводим любой ответ модели синтеза к байтам
async function audioBytes(r) {
  if (!r) return null;
  if (r instanceof Uint8Array) return r;
  if (r instanceof ArrayBuffer) return new Uint8Array(r);
  if (typeof ReadableStream !== "undefined" && r instanceof ReadableStream) return new Uint8Array(await new Response(r).arrayBuffer());
  if (r instanceof Response) return new Uint8Array(await r.arrayBuffer());
  if (typeof r.audio === "string") return fromBase64(r.audio);
  if (r.result && typeof r.result.audio === "string") return fromBase64(r.result.audio);
  return null;
}

export function audioKind(b) {
  if (!b || b.length < 4) return null;
  if (b[0] === 0x4f && b[1] === 0x67 && b[2] === 0x67 && b[3] === 0x53) return { ext: "ogg", mime: "audio/ogg", voice: true };
  if (b[0] === 0x49 && b[1] === 0x44 && b[2] === 0x33) return { ext: "mp3", mime: "audio/mpeg", voice: true };
  if (b[0] === 0xff && (b[1] & 0xe0) === 0xe0) return { ext: "mp3", mime: "audio/mpeg", voice: true };
  if (b[0] === 0x52 && b[1] === 0x49 && b[2] === 0x46 && b[3] === 0x46) return { ext: "wav", mime: "audio/wav", voice: false };
  return { ext: "mp3", mime: "audio/mpeg", voice: true };
}

// Испанская озвучка: Deepgram Aura‑2 (естественные испанские голоса), запасной вариант — MeloTTS.
const VOICES = { esp: "alvaro", lat: "celeste" };
export async function speak(env, text, variant = "esp") {
  const clean = String(text).replace(/<[^>]+>/g, "").trim().slice(0, 600);
  if (!clean) return null;
  const tries = [
    ["@cf/deepgram/aura-2-es", { text: clean, speaker: VOICES[variant] || "celeste", encoding: "mp3" }],
    ["@cf/deepgram/aura-2-es", { text: clean }],
    ["@cf/myshell-ai/melotts", { prompt: clean, lang: "es" }],
  ];
  for (const [model, input] of tries) {
    try {
      const b = await audioBytes(await env.AI.run(model, input));
      if (b && b.length > 200) return { bytes: b, kind: audioKind(b), model };
    } catch (e) {
      /* пробуем следующую модель */
    }
  }
  return null;
}
