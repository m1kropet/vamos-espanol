// Локальная симуляция бота: подставные Telegram, KV и Workers AI. Запуск: node bot/test/sim.mjs
import worker from "../src/worker.js";
import assert from "node:assert/strict";

const TOKEN = "123:TEST";
const sent = [];
let nextHeard = "";
let aiCalls = [];
const kv = new Map();
const env = {
  TELEGRAM_BOT_TOKEN: TOKEN,
  KV: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => void kv.set(k, v) },
  AI: {
    run: async (model, input) => {
      aiCalls.push(model);
      if (model.includes("whisper")) {
        if (model.endsWith("turbo")) assert.equal(typeof input.audio, "string");
        return { text: nextHeard, transcription_info: { language: "es" }, segments: [{ avg_logprob: -0.2, no_speech_prob: 0.01, words: [] }] };
      }
      if (model.includes("aura")) {
        assert.ok(input.text && input.text.length > 0);
        const b = new Uint8Array(400);
        b.set([0x49, 0x44, 0x33]);
        return new ReadableStream({ start(c) { c.enqueue(b); c.close(); } });
      }
      if (model.includes("llama")) return { response: "¡Qué bien! Yo también soy de Madrid. ¿Qué te gusta hacer?\n---\nПеревод: Как здорово! Я тоже из Мадрида. Что ты любишь делать?\nИсправления: «Yo es» → «Yo soy» — глагол ser для «я»." };
      throw new Error("unknown model " + model);
    },
  },
};

globalThis.fetch = async (url, opts = {}) => {
  url = String(url);
  if (url.includes("/file/bot")) return new Response(new Uint8Array([0x4f, 0x67, 0x67, 0x53, 1, 2, 3]));
  const method = url.split("/").pop();
  let body = {};
  if (opts.body instanceof FormData) {
    for (const [k, v] of opts.body.entries()) body[k] = typeof v === "string" ? v : "[blob " + v.size + "]";
  } else if (opts.body) body = JSON.parse(opts.body);
  sent.push({ method, body });
  if (method === "getFile") return Response.json({ ok: true, result: { file_path: "voice/1.oga" } });
  if (method === "getMe") return Response.json({ ok: true, result: { username: "vamos_test_bot" } });
  return Response.json({ ok: true, result: { message_id: 1 } });
};

const crypto = globalThis.crypto;
const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(TOKEN));
const KEY = [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);

let uid = 0;
async function post(update) {
  const waits = [];
  const r = await worker.fetch(
    new Request("https://bot.example.workers.dev/tg", { method: "POST", headers: { "X-Telegram-Bot-Api-Secret-Token": KEY, "content-type": "application/json" }, body: JSON.stringify({ update_id: ++uid, ...update }) }),
    env,
    { waitUntil: (p) => waits.push(p) }
  );
  assert.equal(r.status, 200);
  await Promise.all(waits);
}
const msg = (text, from = 42) => post({ message: { message_id: uid, from: { id: from, first_name: "Kolya" }, chat: { id: from }, text } });
const voice = (heard, from = 42) => { nextHeard = heard; return post({ message: { message_id: uid, from: { id: from, first_name: "Kolya" }, chat: { id: from }, voice: { file_id: "F", duration: 3 } } }); };
const cb = (data, from = 42) => post({ callback_query: { id: "q" + uid, from: { id: from }, data, message: { message_id: 5, chat: { id: from }, text: "Задание\nx" } } });
const texts = () => sent.filter((s) => s.method === "sendMessage" || s.method === "editMessageText").map((s) => s.body.text);
const last = () => texts().slice(-1)[0] || "";
const user = () => JSON.parse(kv.get("u:42"));
const clear = () => (sent.length = 0);
function show(title) {
  console.log("\n=== " + title + " ===");
  sent.forEach((s) => console.log("→", s.method, (s.body.text || s.body.caption || JSON.stringify(s.body).slice(0, 120)).replace(/\n/g, " ⏎ ").slice(0, 400)));
}

// 0. setup и защита
let r = await worker.fetch(new Request("https://bot.example.workers.dev/setup?k=wrong"), env, { waitUntil() {} });
assert.equal(r.status, 403);
r = await worker.fetch(new Request("https://bot.example.workers.dev/setup?k=" + KEY), env, { waitUntil() {} });
const sj = await r.json();
assert.ok(sj.ok, "setup ok");
assert.equal(sent.find((s) => s.method === "setWebhook").body.url, "https://bot.example.workers.dev/tg");
r = await worker.fetch(new Request("https://bot.example.workers.dev/tg", { method: "POST", body: "{}" }), env, { waitUntil() {} });
assert.equal(r.status, 403);
clear();

// 1. онбординг
await msg("/start");
assert.match(last(), /уровень/);
await cb("ob:lv:A1");
await cb("ob:va:esp");
await cb("ob:hr:19");
show("onboarding");
assert.equal(user().onboarded, true);
assert.equal(user().pending.type, "say");
assert.ok(sent.some((s) => s.method === "sendVoice"), "reference audio sent");

// 2. произношение: идеально и с ошибками
const target = user().pending.es;
clear();
await voice(target);
show("say perfect: " + target);
assert.match(last(), /100\/100/);
clear();
await msg("/say El perro corre rápido.");
await voice("el pero core rapido");
show("say with errors");
const fbTxt = texts().find((t) => t.includes("Произношение:"));
assert.match(fbTxt, /perro/);
assert.match(fbTxt, /RR/);
assert.ok(texts().some((t) => t.includes("youglish.com/pronounce/")), "native links");
assert.ok(user().weak.perro >= 1);
clear();
await cb("badslow");
assert.ok(sent.some((s) => s.method === "sendVoice"));
await voice("");
assert.match(last(), /не расслышал/);

// 3. все типы заданий
for (const type of ["tr", "listen", "fill", "fix", "choice", "vocab"]) {
  clear();
  await msg("/ex " + type);
  const ex = user().pending;
  assert.equal(ex.type, type, "got " + type);
  clear();
  if (type === "choice" || type === "vocab") {
    await cb("a:" + ex.right);
    assert.ok(texts().some((t) => /Верно/.test(t)), type + " right");
  } else {
    const right = type === "listen" ? ex.es : ex.ans[0];
    await msg(type === "fix" ? right : right.replace(/[áéíóú]/g, (c) => "aeiou"["áéíóú".indexOf(c)]));
    assert.ok(texts().some((t) => /Верно/.test(t)), type + " right: " + texts().join(" | "));
  }
  show(type);
}
// неверный ответ
await msg("/ex fix");
clear();
await msg("совсем не то");
assert.match(texts().join(), /Не совсем/);
// голосовой ответ на перевод
await msg("/ex tr");
clear();
await voice(user().pending.ans[0]);
assert.match(texts().join(), /Я услышал[\s\S]*Верно/);

// 4. тренировка дня до конца
clear();
await msg("📅 Тренировка дня");
let guard = 0;
while (user().plan && guard++ < 20) {
  const ex = user().pending;
  if (ex.type === "say") await voice(ex.es);
  else if (ex.type === "choice" || ex.type === "vocab") await cb("a:" + ex.right);
  else await msg(ex.type === "listen" ? ex.es : ex.ans[0]);
  await cb("next");
}
show("daily (tail)");
assert.match(texts().join(), /Тренировка дня завершена/);

// 5. разговор
clear();
await msg("💬 Разговор");
await cb("tp:amigos");
await voice("Hola, yo es Kolya y soy de Rusia");
show("chat");
assert.ok(sent.filter((s) => s.method === "sendVoice").length >= 2);
assert.match(texts().join(), /Исправления/);
await msg("Me gusta el fútbol");
assert.equal(user().mode, "chat");
await cb("chatend");
assert.equal(user().mode, "ex");

// 6. настройки, статистика, слово
clear();
await msg("⚙️ Настройки");
await cb("tzs");
await cb("tz:3");
await cb("hours");
await cb("hr:8");
assert.equal(user().tz, 3);
assert.equal(user().hour, 8);
await msg("📊 Прогресс");
await msg("/word guitarra");
show("settings/stats/word");
assert.match(texts().join(), /gui·TA·rra/);

// 7. чужой пользователь
clear();
await msg("/start", 999);
assert.match(last(), /личный бот/);

// 8. рассылка по расписанию
const u = user();
u.lastDaily = "";
u.hour = new Date(Date.now() + u.tz * 3600e3).getUTCHours();
u.plan = null;
kv.set("u:42", JSON.stringify(u));
clear();
const w = [];
await worker.scheduled({}, env, { waitUntil: (p) => w.push(p) });
await Promise.all(w);
show("cron");
assert.match(texts().join(), /Время испанского/);
clear();
await worker.scheduled({}, env, { waitUntil: (p) => w.push(p) });
await Promise.all(w);
assert.equal(texts().length, 0, "no duplicate daily");

// 9. невалидный HTML в ответах: все теги закрыты
for (const s of texts()) {
  const open = (s.match(/<(b|i|code|s|u|a)[ >]/g) || []).length, close = (s.match(/<\/(b|i|code|s|u|a)>/g) || []).length;
  assert.equal(open, close, "tags in: " + s);
}
console.log("\nALL TESTS PASSED ✅  AI calls:", [...new Set(aiCalls)].join(", "));
