// Тест связки «приложение ↔ облако ↔ бот»: вход через Google, синхронизация, привязка Telegram, задания по пройденным урокам
import worker from "../src/worker.js";
import C from "../src/content.js";
import assert from "node:assert/strict";

const TOKEN = "123:TEST";
const kv = new Map();
const sent = [];
const env = {
  TELEGRAM_BOT_TOKEN: TOKEN,
  GOOGLE_CLIENT_ID: "cid.apps.googleusercontent.com",
  GOOGLE_CLIENT_SECRET: "GOCSPX-secret",
  KV: { get: async (k) => kv.get(k) ?? null, put: async (k, v) => void kv.set(k, v), delete: async (k) => void kv.delete(k) },
  AI: {
    run: async (m) => {
      if (m.includes("aura")) return { audio: Buffer.from(new Uint8Array(300).fill(0xff)).toString("base64") };
      if (m.includes("whisper")) return { text: "hola" };
      return { response: "Hola\n---\nПеревод: Привет" };
    },
  },
};
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString("base64").replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
globalThis.fetch = async (url, opts = {}) => {
  url = String(url);
  if (url === "https://oauth2.googleapis.com/token") {
    const p = new URLSearchParams(opts.body);
    assert.equal(p.get("client_secret"), "GOCSPX-secret");
    assert.equal(p.get("code"), "GOOD");
    return Response.json({ id_token: "x." + b64u({ aud: env.GOOGLE_CLIENT_ID, iss: "https://accounts.google.com", sub: "g-777", email: "kolya@gmail.com", name: "Kolya" }) + ".sig" });
  }
  const method = url.split("/").pop();
  let body = {};
  if (opts.body instanceof FormData) for (const [k, v] of opts.body.entries()) body[k] = typeof v === "string" ? v : "[blob]";
  else if (opts.body) body = JSON.parse(opts.body);
  sent.push({ method, body });
  if (method === "getMe") return Response.json({ ok: true, result: { username: "Vassago_ES_Bot" } });
  return Response.json({ ok: true, result: { message_id: 1 } });
};
const ctx = () => { const w = []; return { waitUntil: (p) => w.push(p), all: () => Promise.all(w) }; };
const call = async (path, init = {}) => {
  const c = ctx();
  const r = await worker.fetch(new Request("https://bot.example.workers.dev" + path, init), env, c);
  await c.all();
  return r;
};
const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(TOKEN));
const KEY = [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
let uid = 0;
const tgPost = (update) => call("/tg", { method: "POST", headers: { "X-Telegram-Bot-Api-Secret-Token": KEY }, body: JSON.stringify({ update_id: ++uid, ...update }) });
const msg = (text) => tgPost({ message: { message_id: uid, from: { id: 42, first_name: "Kolya" }, chat: { id: 42 }, text } });
const cb = (data) => tgPost({ callback_query: { id: "q", from: { id: 42 }, data, message: { message_id: 5, chat: { id: 42 }, text: "Задание\nx" } } });
const texts = () => sent.filter((s) => s.method === "sendMessage").map((s) => s.body.text);
const user = () => JSON.parse(kv.get("u:42"));

// 1. Вход через Google (веб)
let r = await call("/auth/google?return=" + encodeURIComponent("https://evil.example/"));
assert.match(await r.text(), /Недопустимый адрес/);
const RET = "https://m1kropet.github.io/vamos-espanol/";
r = await call("/auth/google?return=" + encodeURIComponent(RET), { redirect: "manual" });
assert.equal(r.status, 302);
const g = new URL(r.headers.get("location"));
assert.equal(g.host, "accounts.google.com");
assert.equal(g.searchParams.get("redirect_uri"), "https://bot.example.workers.dev/auth/callback");
const state = g.searchParams.get("state");
r = await call("/auth/callback?code=GOOD&state=" + state);
assert.equal(r.status, 302);
const back = new URL(r.headers.get("location"));
assert.ok(back.href.startsWith(RET));
const SESSION = back.searchParams.get("vamos_session");
assert.match(SESSION, /^[0-9a-f]{48}$/);
r = await call("/auth/callback?code=GOOD&state=" + state);
assert.match(await r.text(), /устарела/, "state is single-use");

// 1b. Вход из Android-приложения: страница с intent-ссылкой
r = await call("/auth/google?return=" + encodeURIComponent("vamos://auth"));
const st2 = new URL(r.headers.get("location")).searchParams.get("state");
r = await call("/auth/callback?code=GOOD&state=" + st2);
const html = await r.text();
assert.match(html, /intent:\/\/auth\?vamos_session=[0-9a-f]{48}#Intent;scheme=vamos;package=io\.github\.m1kropet\.vamos;end/);

// 2. API: профиль, сохранение и загрузка прогресса
const auth = { authorization: "Bearer " + SESSION };
r = await call("/api/me");
assert.equal(r.status, 401);
r = await call("/api/me", { method: "OPTIONS" });
assert.equal(r.status, 204);
assert.equal(r.headers.get("access-control-allow-origin"), "*");
r = await call("/api/me", { headers: auth });
let j = await r.json();
assert.equal(j.email, "kolya@gmail.com");
assert.equal(j.bot, "Vassago_ES_Bot");
assert.equal(j.telegram, false);

const now = Date.now();
const doneLessons = ["a1u1l1", "a1u1l2"];
const appState = {
  v: 1, updatedAt: now, xp: 120, unlocked: 1, streak: { n: 3 },
  lessons: Object.fromEntries(doneLessons.map((id) => [id, { done: 1 }])),
  dlg: {},
  words: { hola: { due: now - 1000, ok: 1, bad: 0, r: 1, i: 1, e: 2.5 }, "la casa": { due: now + 864e5, ok: 0, bad: 2, r: 0, i: 0, e: 2.5 } },
};
r = await call("/api/state", { method: "PUT", headers: auth, body: JSON.stringify({ state: appState }) });
assert.equal((await r.json()).ok, true);
r = await call("/api/state", { method: "PUT", headers: auth, body: JSON.stringify({ state: { ...appState, updatedAt: now - 5000 } }) });
assert.equal(r.status, 409, "older state rejected");
r = await call("/api/state", { headers: auth });
j = await r.json();
assert.equal(j.state.xp, 120);

// 3. Привязка Telegram по ссылке из приложения
r = await call("/api/link", { method: "POST", headers: auth });
j = await r.json();
assert.match(j.url, /^https:\/\/t\.me\/Vassago_ES_Bot\?start=L[0-9a-f]{16}$/);
const code = j.url.split("start=")[1];
await msg("/start " + code);
assert.match(texts().join("\n"), /Приложение подключено/);
assert.match(texts().join("\n"), /уроков пройдено 2/);
assert.equal(user().link.sub, "g-777");
assert.ok(!("ctx" in user()), "ctx not persisted");
await msg("/start " + code);
assert.match(texts().slice(-1)[0], /устарела/, "link code single-use");

// 4. Задания — только из пройденных уроков
const allowed = new Set(doneLessons);
for (const [type, li] of [["say", 4], ["tr", 5], ["choice", 5], ["fill", 5], ["fix", 4]]) {
  const avail = C[type].filter((x) => allowed.has(x[li])).length;
  for (let k = 0; k < 6; k++) {
    await msg("/ex " + type);
    const ex = user().pending;
    if (avail >= 4) {
      const src = type === "say" ? C.say[ex.id] : C[type][ex.id];
      assert.ok(allowed.has(src[li]), `${type} from lesson ${src[li]} (allowed ${[...allowed]})`);
    }
  }
}
// повторение: слово, которое по графику приложения пора повторить
sent.length = 0;
await msg("/ex review");
let ex = user().pending;
assert.equal(ex.type, "vocab");
assert.equal(ex.es, "hola");
assert.match(texts().join(), /Повторение из приложения/);
await cb("a:" + ex.right);

// 5. Результат из бота виден приложению
r = await call("/api/bot?since=0", { headers: auth });
j = await r.json();
assert.equal(j.linked, true);
assert.equal(j.events.length, 1);
assert.deepEqual([j.events[0].k, j.events[0].ok], ["hola", true]);
assert.ok(j.stats.done >= 1);
r = await call("/api/bot?since=" + j.events[0].t, { headers: auth });
assert.equal((await r.json()).events.length, 0);

// 6. Тренировка дня учитывает слова на повторение
sent.length = 0;
await msg("📅 Тренировка дня");
assert.ok(user().plan.includes("review"));
await msg("📊 Прогресс");
assert.match(texts().join(), /Приложение<\/b>: уроков пройдено 2, слов в словаре 2/);

// 7. Отключение из приложения и выход
r = await call("/api/bot", { method: "DELETE", headers: auth });
assert.equal((await r.json()).ok, true);
assert.equal(user().link, undefined);
r = await call("/api/logout", { method: "POST", headers: auth });
r = await call("/api/me", { headers: auth });
assert.equal(r.status, 401);

console.log("CLOUD TESTS PASSED ✅");
