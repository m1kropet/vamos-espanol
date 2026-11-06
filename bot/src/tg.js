// Тонкая обёртка над Telegram Bot API
export function tg(env) {
  const base = "https://api.telegram.org/bot" + env.TELEGRAM_BOT_TOKEN + "/";
  async function call(method, params) {
    const r = await fetch(base + method, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(params || {}) });
    const j = await r.json().catch(() => ({ ok: false, description: "bad json" }));
    if (!j.ok) console.log("TG error", method, j.description);
    return j;
  }
  async function upload(method, field, params, bytes, filename, mime) {
    const fd = new FormData();
    for (const [k, v] of Object.entries(params)) if (v !== undefined && v !== null) fd.append(k, typeof v === "object" ? JSON.stringify(v) : String(v));
    fd.append(field, new Blob([bytes], { type: mime }), filename);
    const r = await fetch(base + method, { method: "POST", body: fd });
    const j = await r.json().catch(() => ({ ok: false }));
    if (!j.ok) console.log("TG upload error", method, j.description);
    return j;
  }
  return {
    call,
    send(chat_id, text, extra = {}) {
      return call("sendMessage", { chat_id, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });
    },
    edit(chat_id, message_id, text, extra = {}) {
      return call("editMessageText", { chat_id, message_id, text, parse_mode: "HTML", disable_web_page_preview: true, ...extra });
    },
    answer(id, text) {
      return call("answerCallbackQuery", { callback_query_id: id, text });
    },
    action(chat_id, action) {
      return call("sendChatAction", { chat_id, action });
    },
    async voice(chat_id, audio, caption, extra = {}) {
      if (!audio) return null;
      const k = audio.kind || { ext: "mp3", mime: "audio/mpeg", voice: true };
      const p = { chat_id, caption, parse_mode: "HTML", ...extra };
      if (k.voice) {
        const r = await upload("sendVoice", "voice", p, audio.bytes, "voice." + k.ext, k.mime);
        if (r.ok) return r;
      }
      return upload("sendAudio", "audio", { ...p, title: "Español" }, audio.bytes, "audio." + k.ext, k.mime);
    },
    async download(file_id) {
      const f = await call("getFile", { file_id });
      if (!f.ok) throw new Error("getFile failed");
      const r = await fetch("https://api.telegram.org/file/bot" + env.TELEGRAM_BOT_TOKEN + "/" + f.result.file_path);
      if (!r.ok) throw new Error("download failed " + r.status);
      return r.arrayBuffer();
    },
  };
}

export const esc = (s) => String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const kb = (rows) => ({ inline_keyboard: rows.map((r) => r.map(([text, data]) => (/^https?:/.test(data) ? { text, url: data } : { text, callback_data: data }))) });
