import assert from "node:assert/strict";
import { speak, transcribe } from "../src/speech.js";
const calls = [];
const env = { AI: { run: async (m, i) => { calls.push(m);
  if (m.includes("aura") || m.endsWith("turbo")) throw new Error("model unavailable");
  if (m.includes("melotts")) return { audio: Buffer.from(new Uint8Array(500).fill(0xff)).toString("base64") };
  if (m === "@cf/openai/whisper") { assert.ok(Array.isArray(i.audio)); return { text: "hola", words: [{ word: "hola", start: 0, end: 0.5 }] }; }
} } };
const a = await speak(env, "Hola", "esp"); assert.equal(a.model, "@cf/myshell-ai/melotts"); assert.equal(a.bytes.length, 500);
const t = await transcribe(env, new Uint8Array([1, 2, 3]).buffer); assert.equal(t.text, "hola"); assert.equal(t.model, "@cf/openai/whisper");
console.log("fallbacks OK", calls.join(" → "));

// Вариант «Испания»: перебираются только кастильские голоса, без латиноамериканского голоса по умолчанию
{
  const seen = [];
  const env2 = { AI: { run: async (m, inp) => { seen.push(inp.speaker || m); if (inp.speaker !== "diana") throw new Error("busy"); return Buffer.from(new Uint8Array(400).fill(0xff)); } } };
  const r = await speak(env2, "Hola, ¿qué tal?", "esp");
  assert.equal(r.speaker, "diana");
  const PEN = ["alvaro", "nestor", "diana", "carina"];
  assert.ok(seen.every((s) => PEN.includes(s)), "only peninsular voices: " + seen.join(","));
  const seen2 = []; env2.AI.run = async (m, inp) => { seen2.push(inp.speaker); return Buffer.from(new Uint8Array(400).fill(0xff)); };
  assert.equal((await speak(env2, "Hola", "esp", "chat")).speaker, "nestor");
  assert.equal((await speak(env2, "Hola", null)).speaker, "alvaro"); // вариант не задан → Испания
  console.log("PENINSULAR VOICE TESTS PASSED ✅");
}
