// ¡Vamos! — Telegram-бот для практики испанского (Cloudflare Worker)
// Упражнения из курса приложения, разбор произношения по голосовым, разговорная практика, ежедневная тренировка.
import { tg, esc, kb } from "./tg.js";
import { transcribe, speak } from "./speech.js";
import { align, wordTips, stressView, youglish, forvo, spanishdict, tokens, TIP_NAMES } from "./pron.js";
import { makeExercise, randomType, DAILY_PLAN, render, hint, checkText, checkChoice, feedback, plural } from "./exercises.js";
import { chatReply, opener, TOPICS } from "./chat.js";
import { handleCloud, redeemLink, getAppState, summarize, pushEvents } from "./cloud.js";

const VERSION = "1.0";
const MENU = {
  keyboard: [
    [{ text: "🎯 Упражнение" }, { text: "🎙 Произношение" }],
    [{ text: "💬 Разговор" }, { text: "📅 Тренировка дня" }],
    [{ text: "📊 Прогресс" }, { text: "⚙️ Настройки" }],
  ],
  resize_keyboard: true,
  is_persistent: true,
};
const COMMANDS = [
  ["start", "Начать / меню"],
  ["daily", "Тренировка дня"],
  ["ex", "Случайное упражнение"],
  ["say", "Произношение (можно: /say своя фраза)"],
  ["chat", "Разговор с носителем"],
  ["word", "Как произносится слово: /word palabra"],
  ["stats", "Прогресс"],
  ["app", "Связь с приложением"],
  ["settings", "Настройки"],
  ["help", "Помощь"],
];
const TOPIC_NAMES = { amigos: "👋 Знакомство", cafe: "☕ В кафе", viaje: "✈️ Путешествие", tienda: "🛍 Магазин", medico: "🩺 У врача", libre: "🗣 Свободная тема" };

// ---------- хранилище ----------
async function hashKey(token) {
  const d = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return [...new Uint8Array(d)].map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 32);
}
function freshUser(id, chat, name) {
  return {
    id, chat, name: name || "",
    level: "A1", variant: "esp", hour: 19, tz: 2, daily: true, topic: "amigos",
    mode: "ex", pending: null, plan: null, planPos: 0, hist: [],
    stats: { done: 0, right: 0, say: 0, sayScore: 0, xp: 0, streak: 0, lastDay: "", chat: 0 },
    weak: {}, tips: {}, seen: {}, lastDaily: "", onboarded: false, created: Date.now(),
  };
}
const getUser = async (env, id) => JSON.parse((await env.KV.get("u:" + id)) || "null");
const saveUser = (env, u) => env.KV.put("u:" + u.id, JSON.stringify(u, (k, v) => (k === "ctx" ? undefined : v)));

// Прогресс из приложения (если аккаунт подключён) — для выбора заданий по пройденному материалу
async function loadCtx(env, u) {
  u.ctx = null;
  if (!u.link || !u.link.sub) return;
  try {
    const sum = summarize(await getAppState(env, u.link.sub));
    if (!sum) return;
    u.ctx = { lessonSet: new Set(sum.lessons.concat(sum.dlg)), wordSet: new Set(sum.learned), due: sum.due, weak: sum.weak, sum };
  } catch (e) {
    console.log("ctx error", e.message);
  }
}
async function botName(env) {
  let n = await env.KV.get("botname");
  if (!n && env.TELEGRAM_BOT_TOKEN) {
    const me = await tg(env).call("getMe");
    n = me.ok ? me.result.username : "";
    if (n) await env.KV.put("botname", n);
  }
  return n || "";
}
function appLine(u) {
  if (!u.link) return "";
  const s = u.ctx && u.ctx.sum;
  if (!s) return "\n📱 Приложение подключено" + (u.link.email ? " (" + esc(u.link.email) + ")" : "") + ", но прогресс ещё не синхронизирован — открой приложение.";
  return "\n📱 <b>Приложение</b>: уроков пройдено " + s.lessons.length + ", слов в словаре " + s.learned.length + (s.due.length ? ", к повторению сегодня " + s.due.length : "") + ".";
}
async function userList(env) {
  return JSON.parse((await env.KV.get("users")) || "[]");
}
async function addUser(env, id) {
  const l = await userList(env);
  if (!l.includes(id)) {
    l.push(id);
    await env.KV.put("users", JSON.stringify(l));
  }
}
function localDate(u, ts = Date.now()) {
  return new Date(ts + (u.tz || 0) * 3600e3).toISOString().slice(0, 10);
}
function localHour(u, ts = Date.now()) {
  return new Date(ts + (u.tz || 0) * 3600e3).getUTCHours();
}

// Только владелец (или ALLOWED_USERS) — чтобы чужие люди не тратили лимиты
async function allowed(env, id) {
  if (env.ALLOWED_USERS) return env.ALLOWED_USERS.split(/[,\s]+/).includes(String(id));
  if (env.PUBLIC === "1") return true;
  const owner = await env.KV.get("owner");
  if (!owner) {
    await env.KV.put("owner", String(id));
    return true;
  }
  return owner === String(id);
}

// ---------- прогресс ----------
function addResult(u, ok, xp) {
  const s = u.stats;
  s.done++;
  if (ok) s.right++;
  s.xp += xp;
  const today = localDate(u);
  if (s.lastDay !== today) {
    const y = localDate(u, Date.now() - 864e5);
    s.streak = s.lastDay === y ? s.streak + 1 : 1;
    s.lastDay = today;
  }
}
const stars = (sc) => (sc >= 95 ? "⭐⭐⭐" : sc >= 80 ? "⭐⭐" : sc >= 60 ? "⭐" : "");

// ---------- отправка заданий ----------
async function sendExercise(env, T, u, type) {
  const ex = makeExercise(u, type || randomType());
  u.pending = ex;
  u.mode = "ex";
  const n = u.plan ? u.planPos + 1 + "/" + u.plan.length : null;
  const r = render(ex, u, n);
  await T.send(u.chat, r.text, { reply_markup: kb(r.keyboard) });
  if (r.audio) {
    await T.action(u.chat, "record_voice");
    const a = await speak(env, r.audio, u.variant);
    if (a) await T.voice(u.chat, a, r.audioCaption || "🔊");
    else if (ex.type === "listen") {
      // без озвучки диктант невозможен — меняем на перевод
      return sendExercise(env, T, u, "tr");
    }
  }
}

async function nextOrFinish(env, T, u) {
  if (u.plan) {
    u.planPos++;
    if (u.planPos >= u.plan.length) {
      u.plan = null;
      u.pending = null;
      const s = u.stats;
      await T.send(u.chat, "🎉 <b>Тренировка дня завершена!</b>\n\n🔥 Серия: " + s.streak + " " + plural(s.streak, "день", "дня", "дней") + "\n⚡ Опыт: " + s.xp + " XP\n\nХочешь ещё? Жми «🎯 Упражнение» или поговори с носителем — «💬 Разговор».", { reply_markup: MENU });
      return;
    }
    return sendExercise(env, T, u, u.plan[u.planPos]);
  }
  return sendExercise(env, T, u);
}

const nextKb = (u) => kb([[[u.plan ? "▶️ Дальше (" + (u.planPos + 2 > u.plan.length ? "итоги" : u.planPos + 2 + "/" + u.plan.length) + ")" : "▶️ Следующее", "next"]]]);

async function startDaily(env, T, u, auto) {
  u.plan = DAILY_PLAN(u);
  u.planPos = 0;
  u.lastDaily = localDate(u);
  const s = u.stats;
  const greet = auto
    ? "☀️ <b>¡Hola! Время испанского.</b>\nСегодня " + u.plan.length + " коротких заданий, около 5 минут." + (s.streak ? "\n🔥 Серия: " + s.streak + " " + plural(s.streak, "день", "дня", "дней") + " — не прерывай!" : "") + (u.ctx && u.ctx.due.length ? "\n🔁 Из приложения пора повторить слов: " + u.ctx.due.length + "." : "")
    : "📅 <b>Тренировка дня</b>: " + u.plan.length + " заданий — произношение, слова, грамматика, на слух.";
  await T.send(u.chat, greet, { reply_markup: MENU });
  await sendExercise(env, T, u, u.plan[0]);
}

// ---------- произношение ----------
async function analyzeSpeech(env, T, u, ex, stt) {
  const v = u.variant || "esp";
  if (!stt.text || (stt.noSpeech !== null && stt.noSpeech > 0.8)) {
    await T.send(u.chat, "🤔 Я почти ничего не расслышал. Запиши ещё раз: ближе к микрофону, в тишине, чётко и не спеша.");
    return;
  }
  if (stt.lang && stt.lang !== "es" && stt.lang !== "spanish") {
    await T.send(u.chat, "🤔 Похоже, это было не по-испански (я услышал: «" + esc(stt.text) + "»). Попробуй ещё раз.");
    return;
  }
  const res = align(ex.es, stt.text);
  const bad = res.words.filter((w) => w.st !== "ok");
  let score = res.score;
  if (stt.confidence !== null && stt.confidence < 0.5 && score > 60) score -= 10; // неуверенное распознавание = нечёткая речь
  const lines = res.words.map((w) => (w.st === "ok" ? "✅ " + esc(w.word) : w.st === "close" ? "⚠️ <b>" + esc(w.word) + "</b> → услышано «" + esc(w.heard) + "»" : w.st === "wrong" ? "❌ <b>" + esc(w.word) + "</b> → услышано «" + esc(w.heard) + "»" : "❌ <b>" + esc(w.word) + "</b> → не слышно"));
  let t = "🎙 <b>Произношение: " + score + "/100</b> " + stars(score) + "\n\nЯ услышал: «<i>" + esc(stt.text) + "</i>»\n\n" + lines.join("\n");
  if (res.extra.length) t += "\n➕ Лишнее: " + esc(res.extra.join(", "));

  const tipIds = [];
  const tipsOut = [];
  for (const w of bad.slice(0, 3)) {
    for (const tp of wordTips(w.word, w.heard, v, 2)) {
      if (!tipIds.includes(tp.id)) {
        tipIds.push(tp.id);
        tipsOut.push("• <b>" + esc(w.word) + "</b> [" + esc(stressView(w.word)) + "]: " + tp.text);
      }
    }
  }
  if (bad.length) {
    t += "\n\n<b>Что поправить:</b>\n" + tipsOut.slice(0, 4).join("\n");
    bad.forEach((w) => (u.weak[w.n] = (u.weak[w.n] || 0) + 1));
    tipIds.forEach((id) => (u.tips[id] = (u.tips[id] || 0) + 1));
  } else {
    t += "\n\n🎉 Все слова распознаны верно! " + (score >= 95 ? "Звучит как у носителя." : "");
    res.words.forEach((w) => {
      if (u.weak[w.n]) {
        u.weak[w.n]--;
        if (u.weak[w.n] <= 0) delete u.weak[w.n];
      }
    });
  }
  t += "\n\n<i>Оценка основана на распознавании речи: если слово распознано неверно, его, скорее всего, произнесли неточно.</i>";

  const first = !ex.tries;
  ex.tries = (ex.tries || 0) + 1;
  if (first) {
    addResult(u, bad.length === 0, Math.round(score / 10));
    u.stats.say++;
    u.stats.sayScore += score;
  }

  const rows = [];
  if (bad.length) rows.push([["🔊 Проблемные слова медленно", "badslow"]]);
  const phraseLink = tokens(ex.es).length <= 6 ? ex.es : bad[0] ? bad[0].word : ex.es;
  rows.push([["🎬 Носители: «" + phraseLink.replace(/[¿¡?!.,]/g, "").slice(0, 28) + "»", youglish(phraseLink, v)]]);
  rows.push([[bad.length ? "▶️ Дальше" : "▶️ Следующее", "next"]]);
  u.lastBad = bad.map((w) => w.word);
  await T.send(u.chat, t + (bad.length ? "\n\n🔁 Запиши ещё раз — или переходи дальше." : ""), { reply_markup: kb(rows) });

  if (bad.length) {
    // фрагменты из реальных видео, где носители произносят именно эти слова/фразу
    await sendNative(env, T, u, ex.es, bad.map((w) => w.word));
  }
}

async function sendNative(env, T, u, phrase, words) {
  const v = u.variant || "esp";
  const ws = [...new Set((words && words.length ? words : tokens(phrase).map((t) => t.raw)).map((w) => w.toLowerCase()))].slice(0, 4);
  let t = "🎬 <b>Как это говорят носители</b> — фрагменты реальных видео (фильмы, интервью, блоги) ровно на этом месте:\n";
  if (tokens(phrase).length <= 6) t += "\n▶️ Фраза целиком: <a href=\"" + youglish(phrase, v) + "\">«" + esc(phrase) + "»</a>";
  ws.forEach((w) => (t += "\n▶️ <a href=\"" + youglish(w, v) + "\">" + esc(w) + "</a> · <a href=\"" + forvo(w) + "\">запись носителя (Forvo)</a>"));
  t += "\n\n🔤 <a href=\"" + spanishdict(phrase) + "\">Разбор по звукам и слогам (SpanishDict)</a>";
  t += "\n\n<i>Посмотри 2–3 фрагмента, повтори вслух сразу за говорящим (шэдоуинг) и пришли голосовое ещё раз.</i>";
  await T.send(u.chat, t);
}

// ---------- разговор ----------
async function chatTurn(env, T, u, text, fromVoice) {
  u.hist = (u.hist || []).concat({ role: "user", content: text }).slice(-14);
  await T.action(u.chat, "typing");
  let rep;
  try {
    rep = await chatReply(env, u, u.hist);
  } catch (e) {
    await T.send(u.chat, "⚠️ Собеседник сейчас недоступен (" + esc(e.message) + "). Попробуй через минуту.");
    u.hist.pop();
    return;
  }
  u.hist.push({ role: "assistant", content: rep.es + (rep.ru ? "\n---\n" + rep.ru : "") });
  u.stats.chat++;
  addResult(u, true, 3);
  const audio = await speak(env, rep.es, u.variant);
  if (audio) await T.voice(u.chat, audio, "🗣 " + esc(rep.es).slice(0, 900));
  else await T.send(u.chat, "🗣 <b>" + esc(rep.es) + "</b>");
  if (rep.ru) await T.send(u.chat, esc(rep.ru), { reply_markup: kb([[["🔚 Закончить разговор", "chatend"], ["🔄 Другая тема", "topics"]]]) });
  if (!fromVoice && Math.random() < 0.25) await T.send(u.chat, "💡 Отвечай <b>голосовыми</b> — так тренируется и произношение.");
}

async function startChat(env, T, u, topic) {
  u.mode = "chat";
  u.pending = null;
  u.plan = null;
  if (topic) u.topic = topic;
  const op = opener(u);
  u.hist = [{ role: "user", content: "(начало разговора)" }, { role: "assistant", content: op }];
  await T.send(u.chat, "💬 <b>Разговор: " + (TOPIC_NAMES[u.topic] || "") + "</b>\nОтвечай по-испански голосом 🎤 или текстом. Я отвечу как носитель, озвучу ответ и покажу исправления. Можно писать и по-русски — подскажу, как сказать.", { reply_markup: MENU });
  const audio = await speak(env, op, u.variant);
  if (audio) await T.voice(u.chat, audio, "🗣 " + esc(op));
  else await T.send(u.chat, "🗣 <b>" + esc(op) + "</b>");
}

// ---------- настройки ----------
function settingsView(u) {
  const lv = { A1: "A1 — начинаю", A2: "A2 — продолжаю", all: "Все уровни" }[u.level];
  const va = u.variant === "lat" ? "🌎 Латинская Америка" : "🇪🇸 Испания";
  const tzs = (u.tz >= 0 ? "+" : "") + u.tz;
  return {
    text: "⚙️ <b>Настройки</b>\n\nУровень: <b>" + lv + "</b>\nПроизношение: <b>" + va + "</b>\nТренировка дня: <b>" + (u.daily ? u.hour + ":00" : "выключена") + "</b> (UTC" + tzs + ")\nТема разговора: <b>" + TOPIC_NAMES[u.topic] + "</b>",
    kb: kb([
      [["A1", "lv:A1"], ["A2", "lv:A2"], ["Все", "lv:all"]],
      [["🇪🇸 Испания", "va:esp"], ["🌎 Лат. Америка", "va:lat"]],
      [["⏰ Время тренировки", "hours"], ["🌍 Часовой пояс", "tzs"]],
      [[u.daily ? "🔕 Выключить напоминания" : "🔔 Включить напоминания", "dailytoggle"]],
      [["💬 Тема разговора", "topics"]],
    ]),
  };
}
const hoursKb = () => kb([[["7:00", "hr:7"], ["8:00", "hr:8"], ["9:00", "hr:9"], ["12:00", "hr:12"]], [["13:00", "hr:13"], ["17:00", "hr:17"], ["19:00", "hr:19"], ["20:00", "hr:20"]], [["21:00", "hr:21"], ["22:00", "hr:22"], ["23:00", "hr:23"], ["Выкл", "hr:off"]]]);
const tzKb = () =>
  kb([
    [["Калининград +2", "tz:2"], ["Москва +3", "tz:3"]],
    [["Самара +4", "tz:4"], ["Екатеринбург +5", "tz:5"]],
    [["Омск +6", "tz:6"], ["Новосибирск +7", "tz:7"]],
    [["Иркутск +8", "tz:8"], ["Владивосток +10", "tz:10"]],
    [["Мадрид +1", "tz:1"], ["Мехико −6", "tz:-6"]],
  ]);
const topicsKb = () => kb(Object.entries(TOPIC_NAMES).reduce((rows, [k, n], i) => (i % 2 ? rows[rows.length - 1].push([n, "tp:" + k]) : rows.push([[n, "tp:" + k]]), rows), []));

function statsView(u) {
  const s = u.stats;
  const acc = s.done ? Math.round((100 * s.right) / s.done) : 0;
  const avg = s.say ? Math.round(s.sayScore / s.say) : 0;
  const weak = Object.entries(u.weak || {}).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
  const tips = Object.entries(u.tips || {}).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([id]) => TIP_NAMES[id] || id);
  return (
    "📊 <b>Твой прогресс</b>\n\n⚡ Опыт: <b>" + s.xp + " XP</b>\n🔥 Серия: <b>" + s.streak + " " + plural(s.streak, "день", "дня", "дней") + "</b>\n✅ Заданий: <b>" + s.done + "</b> (верно " + acc + "%)\n🎙 Произношение: <b>" + s.say + "</b> попыток, средний балл <b>" + avg + "/100</b>\n💬 Реплик в разговоре: <b>" + s.chat + "</b>" +
    (tips.length ? "\n\n🎯 Звуки, над которыми стоит поработать: <b>" + esc(tips.join(", ")) + "</b>" : "") +
    (weak.length ? "\n🔁 Трудные слова: " + esc(weak.join(", ")) + "\n<i>Они будут чаще попадаться в заданиях на произношение.</i>" : "") +
    (u.link ? "\n" + appLine(u) : "\n\n📱 Подключи приложение, чтобы задания шли по пройденным урокам: /app")
  );
}

const HELP =
  "🇪🇸 <b>¡Vamos! — практика испанского</b>\n\n" +
  "🎯 <b>Упражнение</b> — задания из курса: произношение, слова, грамматика, перевод, диктант.\n" +
  "🎙 <b>Произношение</b> — фраза + образец. Пришли голосовое: я разберу каждое слово, объясню ошибки и дам ссылки на моменты из реальных видео, где носители говорят именно это.\n" +
  "   Своя фраза: <code>/say ¿Dónde está la estación?</code>\n" +
  "💬 <b>Разговор</b> — болтаешь с «носителем» голосом или текстом, он отвечает голосом и исправляет ошибки.\n" +
  "📅 <b>Тренировка дня</b> — 6 заданий, бот сам присылает её в выбранное время.\n" +
  "🔤 <code>/word palabra</code> — как произносится слово.\n" +
  "📱 /app — связать с приложением: задания по пройденным урокам и повторение слов из твоего словаря.\n\n" +
  "Голосовые принимаются в любой момент: в упражнении — проверка, в разговоре — ответ собеседнику.";

// ---------- обработка сообщений ----------
async function onMessage(env, T, m) {
  const id = m.from.id;
  if (!(await allowed(env, id))) {
    await T.send(m.chat.id, "Это личный бот для изучения испанского. Свой такой же можно развернуть по инструкции: github.com/m1kropet/vamos-espanol/tree/main/bot");
    return;
  }
  let u = await getUser(env, id);
  if (!u) {
    u = freshUser(id, m.chat.id, m.from.first_name);
    await addUser(env, id);
  }
  u.chat = m.chat.id;
  await loadCtx(env, u);
  try {
    await route(env, T, u, m);
  } finally {
    await saveUser(env, u);
  }
}

async function route(env, T, u, m) {
  const voice = m.voice || m.audio || m.video_note;
  if (voice) return onVoice(env, T, u, voice);
  const text = (m.text || "").trim();
  if (!text) return T.send(u.chat, "Я понимаю текст и голосовые сообщения 🙂");
  const [cmd0, ...restArr] = text.split(" ");
  const cmd = cmd0.toLowerCase().replace(/@.*$/, "");
  const rest = restArr.join(" ").trim();

  if (cmd === "/start" && /^L[0-9a-f]{16}$/.test(rest)) {
    const who = await redeemLink(env, rest.slice(1), u.id);
    if (!who) return T.send(u.chat, "⚠️ Ссылка для подключения устарела. В приложении нажми «Подключить Telegram-бота» ещё раз.");
    u.link = { sub: who.sub, email: who.email || "", at: Date.now() };
    await loadCtx(env, u);
    const s0 = u.ctx && u.ctx.sum;
    if (!u.onboarded) {
      u.onboarded = true;
      u.level = s0 && s0.unlocked >= 10 ? "A2" : "A1";
    }
    await T.send(u.chat, "🔗 <b>Приложение подключено!</b> " + (who.email ? "(" + esc(who.email) + ")" : "") + appLine(u) + "\n\nТеперь задания берутся из уроков, которые ты прошёл в приложении, слова для повторения — по графику из твоего словаря, а результаты повторения из бота попадут обратно в приложение.", { reply_markup: MENU });
    return sendExercise(env, T, u, u.ctx && u.ctx.due.length ? "review" : "say");
  }
  if (cmd === "/app") {
    if (u.link) return T.send(u.chat, appLine(u).trim() + "\n\nОтключить: /unlink", { reply_markup: MENU });
    return T.send(u.chat, "📱 <b>Связь с приложением</b>\n\n1. Открой приложение ¡Vamos! → <b>Профиль</b>.\n2. Нажми <b>«Войти через Google»</b>.\n3. Нажми <b>«Подключить Telegram-бота»</b> — откроется этот чат, и всё свяжется само.\n\nПосле этого бот будет давать задания по пройденным урокам и слова на повторение из твоего словаря.", { reply_markup: kb([[["📱 Открыть приложение", "https://m1kropet.github.io/vamos-espanol/#profile"]]]) });
  }
  if (cmd === "/unlink") {
    delete u.link;
    u.ctx = null;
    return T.send(u.chat, "Приложение отключено. Задания снова выбираются по уровню.", { reply_markup: MENU });
  }
  if (cmd === "/start" || !u.onboarded) {
    if (!u.onboarded) {
      await T.send(u.chat, "¡Hola, " + esc(u.name || "amigo") + "! 👋\nЯ помогу практиковать испанский вне приложения: задания каждый день, разбор произношения по твоим голосовым и разговор с «носителем».\n\nДля начала — твой уровень?", {
        reply_markup: kb([[["🌱 A1 — начинаю", "ob:lv:A1"]], [["🌿 A2 — уже знаю основы", "ob:lv:A2"]], [["🌳 Смешанно, все уровни", "ob:lv:all"]]]),
      });
      return;
    }
    return T.send(u.chat, HELP, { reply_markup: MENU });
  }
  if (cmd === "/help") return T.send(u.chat, HELP, { reply_markup: MENU });
  if (cmd === "/stats" || text === "📊 Прогресс") return T.send(u.chat, statsView(u), { reply_markup: MENU });
  if (cmd === "/settings" || text === "⚙️ Настройки") {
    const s = settingsView(u);
    return T.send(u.chat, s.text, { reply_markup: s.kb });
  }
  if (cmd === "/daily" || text === "📅 Тренировка дня") return startDaily(env, T, u, false);
  if (cmd === "/ex" || text === "🎯 Упражнение") {
    u.plan = null;
    const TYPES = { say: "say", tr: "tr", listen: "listen", choice: "choice", fill: "fill", fix: "fix", vocab: "vocab", review: "review" };
    return sendExercise(env, T, u, TYPES[rest] || undefined);
  }
  if (cmd === "/chat" || text === "💬 Разговор") {
    if (rest && TOPICS[rest]) return startChat(env, T, u, rest);
    return T.send(u.chat, "💬 О чём поговорим?", { reply_markup: topicsKb() });
  }
  if (cmd === "/stop") {
    u.mode = "ex";
    u.pending = null;
    u.plan = null;
    return T.send(u.chat, "Остановил. Выбирай, что дальше 👇", { reply_markup: MENU });
  }
  if (cmd === "/say" || text === "🎙 Произношение") {
    u.plan = null;
    if (rest) {
      const ex = { type: "say", es: rest.slice(0, 200), ru: "", custom: true };
      u.pending = ex;
      u.mode = "ex";
      const r = render(ex, u);
      await T.send(u.chat, r.text, { reply_markup: kb(r.keyboard) });
      const a = await speak(env, ex.es, u.variant);
      if (a) await T.voice(u.chat, a, r.audioCaption);
      return;
    }
    return sendExercise(env, T, u, "say");
  }
  if (cmd === "/word") {
    if (!rest) return T.send(u.chat, "Напиши слово после команды: <code>/word perro</code>");
    return wordInfo(env, T, u, rest);
  }
  if (cmd.startsWith("/")) return T.send(u.chat, "Не знаю такую команду. " + HELP, { reply_markup: MENU });

  // свободный текст
  if (u.mode === "chat") return chatTurn(env, T, u, text, false);
  const ex = u.pending;
  if (ex && ["tr", "listen", "fill", "fix"].includes(ex.type)) return answerText(env, T, u, ex, text);
  if (ex && ex.type === "say") return T.send(u.chat, "🎤 Это задание на произношение — пришли <b>голосовое сообщение</b> с фразой:\n<b>" + esc(ex.es) + "</b>", { reply_markup: kb([[["⏭ Пропустить", "skip"]]]) });
  if (ex && (ex.type === "choice" || ex.type === "vocab")) return T.send(u.chat, "Выбери вариант кнопкой под заданием 👆");
  // испанская фраза без задания — предложим потренировать её
  if (/[a-záéíóúñ¿¡]/i.test(text) && !/[а-яё]/i.test(text)) {
    u.pending = { type: "say", es: text.slice(0, 200), ru: "", custom: true };
    const r = render(u.pending, u);
    await T.send(u.chat, r.text, { reply_markup: kb(r.keyboard) });
    const a = await speak(env, u.pending.es, u.variant);
    if (a) await T.voice(u.chat, a, r.audioCaption);
    return;
  }
  return T.send(u.chat, "Выбери, чем займёмся 👇\nИли нажми «💬 Разговор», чтобы поболтать (можно спросить и по-русски).", { reply_markup: MENU });
}

async function answerText(env, T, u, ex, text, heardNote) {
  const acc = ex.type === "listen" ? [ex.es] : ex.ans;
  const res = checkText(text, acc, ex.type === "fix" ? "accents" : ex.type === "fill");
  addResult(u, res.ok, res.ok ? 10 : 2);
  u.pending = null;
  await T.send(u.chat, (heardNote || "") + feedback(ex, res, res.ok && !res.typo ? "" : text), { reply_markup: nextKb(u) });
}

async function onVoice(env, T, u, v) {
  if ((v.duration || 0) > 60) return T.send(u.chat, "Слишком длинное сообщение — до 60 секунд, пожалуйста.");
  await T.action(u.chat, "typing");
  let stt;
  try {
    const buf = await T.download(v.file_id);
    stt = await transcribe(env, buf);
  } catch (e) {
    return T.send(u.chat, "⚠️ Не получилось распознать запись (" + esc(e.message) + "). Попробуй ещё раз.");
  }
  if (u.mode === "chat") {
    if (!stt.text) return T.send(u.chat, "🤔 Не расслышал. Повтори, пожалуйста, чуть громче.");
    await T.send(u.chat, "🎤 Ты сказал: «<i>" + esc(stt.text) + "</i>»");
    return chatTurn(env, T, u, stt.text, true);
  }
  const ex = u.pending;
  if (ex && ex.type === "say") return analyzeSpeech(env, T, u, ex, stt);
  if (ex && ["tr", "listen", "fill", "fix"].includes(ex.type)) {
    if (!stt.text) return T.send(u.chat, "🤔 Не расслышал. Повтори или напиши ответ текстом.");
    return answerText(env, T, u, ex, stt.text, "🎤 Я услышал: «<i>" + esc(stt.text) + "</i>»\n\n");
  }
  // голосовое без задания
  if (!stt.text) return T.send(u.chat, "🤔 Не расслышал. Повтори, пожалуйста.");
  u.lastHeard = stt.text;
  return T.send(u.chat, "🎤 Я услышал: «<i>" + esc(stt.text) + "</i>»\n\nЧтобы я оценил произношение, мне нужна эталонная фраза: нажми «🎙 Произношение» или напиши <code>/say фраза</code>. А можно просто поговорить 👇", {
    reply_markup: kb([[["💬 Ответить в разговоре", "chatheard"]]]),
  });
}

async function wordInfo(env, T, u, word) {
  const w = word.trim().slice(0, 60);
  const v = u.variant || "esp";
  const ws = tokens(w);
  const tips = ws.length === 1 ? wordTips(ws[0].raw, "", v, 3) : [];
  let t = "🔤 <b>" + esc(w) + "</b>\nСлоги и ударение: <code>" + esc(ws.map((x) => stressView(x.raw)).join(" ")) + "</code>";
  if (tips.length) t += "\n\n" + tips.map((x) => "• " + x.text).join("\n");
  t += "\n\n🎬 <a href=\"" + youglish(w, v) + "\">Носители в реальных видео</a> · <a href=\"" + forvo(ws[0] ? ws[0].raw : w) + "\">Forvo</a> · <a href=\"" + spanishdict(w) + "\">SpanishDict</a>";
  u.pending = { type: "say", es: w, ru: "", custom: true };
  u.mode = "ex";
  await T.send(u.chat, t + "\n\nПришли голосовое — проверю, как у тебя получается 🎤", { reply_markup: kb([[["⏭ Пропустить", "skip"]]]) });
  const a = await speak(env, w, v);
  if (a) await T.voice(u.chat, a, "🔊 " + esc(w));
}

// ---------- кнопки ----------
async function onCallback(env, T, q) {
  const id = q.from.id;
  if (!(await allowed(env, id))) return T.answer(q.id, "Личный бот");
  const u = await getUser(env, id);
  if (!u) return T.answer(q.id, "Нажми /start");
  u.chat = q.message.chat.id;
  await loadCtx(env, u);
  try {
    await T.answer(q.id);
    await callback(env, T, u, q.data, q.message);
  } finally {
    await saveUser(env, u);
  }
}

async function callback(env, T, u, data, msg) {
  const [k, a, b] = data.split(":");
  const mid = msg.message_id;
  // онбординг
  if (k === "ob") {
    if (a === "lv") {
      u.level = b;
      return T.edit(u.chat, mid, "Отлично! Какое произношение тренируем?", { reply_markup: kb([[["🇪🇸 Испания (Мадрид)", "ob:va:esp"]], [["🌎 Латинская Америка (Мексика)", "ob:va:lat"]]]) });
    }
    if (a === "va") {
      u.variant = b;
      return T.edit(u.chat, mid, "Во сколько присылать тренировку дня? (время — Калининград, UTC+2; поменять пояс можно в настройках)", { reply_markup: kb([[["8:00", "ob:hr:8"], ["13:00", "ob:hr:13"]], [["19:00", "ob:hr:19"], ["22:00", "ob:hr:22"]], [["Не присылать", "ob:hr:off"]]]) });
    }
    if (a === "hr") {
      if (b === "off") u.daily = false;
      else {
        u.daily = true;
        u.hour = +b;
      }
      u.onboarded = true;
      await T.edit(u.chat, mid, "✅ Готово! " + (u.daily ? "Тренировка будет приходить каждый день в " + u.hour + ":00." : "Напоминания выключены — заходи сам."));
      await T.send(u.chat, HELP, { reply_markup: MENU });
      await T.send(u.chat, "Начнём с первого задания 👇");
      return sendExercise(env, T, u, "say");
    }
  }
  if (k === "lv" || k === "va" || k === "hr" || k === "tz" || k === "dailytoggle") {
    if (k === "lv") u.level = a;
    if (k === "va") u.variant = a;
    if (k === "hr") {
      if (a === "off") u.daily = false;
      else {
        u.daily = true;
        u.hour = +a;
      }
    }
    if (k === "tz") u.tz = +a;
    if (k === "dailytoggle") u.daily = !u.daily;
    const s = settingsView(u);
    return T.edit(u.chat, mid, s.text, { reply_markup: s.kb });
  }
  if (k === "hours") return T.edit(u.chat, mid, "⏰ Во сколько присылать тренировку дня?", { reply_markup: hoursKb() });
  if (k === "tzs") return T.edit(u.chat, mid, "🌍 Твой часовой пояс:", { reply_markup: tzKb() });
  if (k === "topics") return T.send(u.chat, "💬 О чём поговорим?", { reply_markup: topicsKb() });
  if (k === "tp") return startChat(env, T, u, a);
  if (k === "chatend") {
    u.mode = "ex";
    return T.send(u.chat, "¡Hasta luego! 👋 Хороший разговор. Чем займёмся дальше?", { reply_markup: MENU });
  }
  if (k === "chatheard") {
    if (u.mode !== "chat") {
      u.mode = "chat";
      u.hist = [];
    }
    if (u.lastHeard) return chatTurn(env, T, u, u.lastHeard, true);
    return startChat(env, T, u);
  }
  if (k === "next") return nextOrFinish(env, T, u);

  const ex = u.pending;
  if (k === "skip") {
    if (ex) {
      const ans = ex.type === "say" || ex.type === "listen" ? ex.es : ex.type === "choice" || ex.type === "vocab" ? ex.opts[ex.right] : ex.ans && ex.ans[0];
      u.pending = null;
      await T.send(u.chat, "⏭ Пропущено. Ответ: <b>" + esc(ans) + "</b>" + (ex.ru && ex.type !== "tr" ? "\n<i>" + esc(ex.ru) + "</i>" : ""));
    }
    return nextOrFinish(env, T, u);
  }
  if (!ex) return T.send(u.chat, "Это задание уже закрыто. Жми «🎯 Упражнение» 👇", { reply_markup: MENU });

  if (k === "a" && (ex.type === "choice" || ex.type === "vocab")) {
    const res = checkChoice(ex, +a);
    addResult(u, res.ok, res.ok ? 10 : 2);
    u.pending = null;
    if (ex.type === "vocab" && u.link) await pushEvents(env, u.link.sub, [{ k: ex.es, ok: res.ok, t: Date.now() }]);
    const marked = ex.opts.map((o, i) => (i === ex.right ? "✅ " : i === +a ? "❌ " : "▫️ ") + esc(o)).join("\n");
    await T.edit(u.chat, mid, msg.text ? esc(msg.text.split("\n")[0]) + "\n\n" + marked : marked);
    await T.send(u.chat, feedback(ex, res, ""), { reply_markup: nextKb(u) });
    if (ex.type === "vocab") {
      const au = await speak(env, ex.es, u.variant);
      if (au) await T.voice(u.chat, au, "🔊 " + esc(ex.es));
    }
    return;
  }
  if (k === "hint") return T.send(u.chat, "💡 " + esc(hint(ex)));
  if (k === "repeat" && ex.es) {
    const au = await speak(env, ex.es, u.variant);
    if (au) await T.voice(u.chat, au, "🔁");
    return;
  }
  if (k === "slow" && ex.es) {
    const slow = tokens(ex.es).map((t) => t.raw).join(". ... ");
    const au = await speak(env, slow, u.variant);
    if (au) await T.voice(u.chat, au, "🐢 По словам: " + esc(tokens(ex.es).map((t) => stressView(t.raw)).join(" · ")));
    return;
  }
  if (k === "badslow" && u.lastBad && u.lastBad.length) {
    const au = await speak(env, u.lastBad.join(". ... ") + ".", u.variant);
    if (au) await T.voice(u.chat, au, "🐢 " + esc(u.lastBad.map(stressView).join(" · ")));
    return;
  }
  if (k === "native" && ex.es) return sendNative(env, T, u, ex.es);
}

// ---------- ежедневная рассылка ----------
async function cron(env) {
  const T = tg(env);
  const ids = await userList(env);
  for (const id of ids) {
    const u = await getUser(env, id);
    if (!u || !u.daily || !u.onboarded) continue;
    const today = localDate(u);
    if (u.lastDaily === today || localHour(u) !== u.hour) continue;
    await loadCtx(env, u);
    try {
      await startDaily(env, T, u, true);
    } catch (e) {
      console.log("daily error", id, e.message);
    }
    await saveUser(env, u);
  }
}

// ---------- точка входа ----------
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (!env.TELEGRAM_BOT_TOKEN) return new Response("TELEGRAM_BOT_TOKEN не задан", { status: 500 });
    const key = await hashKey(env.TELEGRAM_BOT_TOKEN);
    const T = tg(env);

    if (url.pathname.startsWith("/auth/") || url.pathname.startsWith("/api/")) {
      const r = await handleCloud(request, env, url, await botName(env));
      if (r) return r;
    }
    if (url.pathname === "/setup") {
      if (url.searchParams.get("k") !== key) return new Response("forbidden", { status: 403 });
      const hook = await T.call("setWebhook", { url: url.origin + "/tg", secret_token: key, allowed_updates: ["message", "callback_query"], drop_pending_updates: true });
      const cmds = await T.call("setMyCommands", { commands: COMMANDS.map(([command, description]) => ({ command, description })) });
      await T.call("setMyDescription", { description: "Практика испанского: упражнения каждый день, разбор произношения по голосовым, разговор с носителем." });
      const me = await T.call("getMe");
      if (me.ok) await env.KV.put("botname", me.result.username);
      return Response.json({ ok: hook.ok && cmds.ok, webhook: hook, bot: me.result && me.result.username, version: VERSION });
    }
    if (url.pathname === "/tg" && request.method === "POST") {
      if (request.headers.get("X-Telegram-Bot-Api-Secret-Token") !== key) return new Response("forbidden", { status: 403 });
      const update = await request.json();
      const work = (async () => {
        try {
          if (update.message) await onMessage(env, T, update.message);
          else if (update.callback_query) await onCallback(env, T, update.callback_query);
        } catch (e) {
          console.log("update error", e.stack || e.message);
          const chat = (update.message && update.message.chat.id) || (update.callback_query && update.callback_query.message.chat.id);
          if (chat) await T.send(chat, "⚠️ Что-то пошло не так: " + esc(e.message) + "\nПопробуй ещё раз или нажми /start.");
        }
      })();
      ctx.waitUntil(work);
      return new Response("ok");
    }
    if (url.pathname === "/") return new Response("¡Vamos! bot " + VERSION + " работает. Откройте бота в Telegram.", { headers: { "content-type": "text/plain; charset=utf-8" } });
    return new Response("not found", { status: 404 });
  },
  async scheduled(event, env, ctx) {
    ctx.waitUntil(cron(env));
  },
};
