// Упражнения из курса приложения: выбор, показ, проверка
import C from "./content.js";
import { norm, stripAcc, lev, stressView, tokens } from "./pron.js";
import { esc } from "./tg.js";

const LV = { esp: "Испания", lat: "Лат. Америка" };

function pool(list, user, lvIdx) {
  if (user.level === "all") return list.map((_, i) => i);
  let ids = list.map((x, i) => [x[lvIdx], i]).filter(([lv]) => lv === user.level).map(([, i]) => i);
  if (user.level === "A2") ids = ids.concat(list.map((x, i) => [x[lvIdx], i]).filter(([lv]) => lv === "A1" && Math.random() < 0.3).map(([, i]) => i));
  return ids.length ? ids : list.map((_, i) => i);
}

function pickFrom(user, type, ids) {
  user.seen = user.seen || {};
  const seen = user.seen[type] || [];
  const keep = Math.min(120, Math.floor(ids.length * 0.7));
  const fresh = ids.filter((i) => !seen.includes(i));
  const src = fresh.length ? fresh : ids;
  const id = src[Math.floor(Math.random() * src.length)];
  user.seen[type] = seen.concat(id).slice(-keep);
  return id;
}

const shuffle = (a) => {
  a = a.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

export function makeExercise(user, type) {
  switch (type) {
    case "say": {
      // иногда — фраза со «слабым» словом, которое раньше не получалось
      const weak = Object.entries(user.weak || {}).sort((a, b) => b[1] - a[1]).map(([w]) => w);
      if (weak.length && Math.random() < 0.35) {
        const w = weak[Math.floor(Math.random() * Math.min(5, weak.length))];
        const hit = C.say.map((s, i) => [s, i]).filter(([s]) => tokens(s[0]).some((t) => t.n === w) && s[0].split(" ").length <= 8);
        if (hit.length) {
          const [s, i] = hit[Math.floor(Math.random() * hit.length)];
          return { type: "say", es: s[0], ru: s[1], src: s[3], id: i, weak: w };
        }
      }
      const id = pickFrom(user, "say", pool(C.say, user, 2));
      const s = C.say[id];
      return { type: "say", es: s[0], ru: s[1], src: s[3], id };
    }
    case "listen": {
      const ids = pool(C.say, user, 2).filter((i) => C.say[i][0].split(" ").length <= 8);
      const id = pickFrom(user, "listen", ids);
      const s = C.say[id];
      return { type: "listen", es: s[0], ru: s[1], id };
    }
    case "tr": {
      const id = pickFrom(user, "tr", pool(C.tr, user, 3));
      const t = C.tr[id];
      return { type: "tr", ru: t[0], ans: [t[1], ...t[2]], note: t[4], id };
    }
    case "choice": {
      const id = pickFrom(user, "choice", pool(C.choice, user, 4));
      const q = C.choice[id];
      const order = shuffle(q[1].map((_, i) => i));
      return { type: "choice", q: q[0], opts: order.map((i) => q[1][i]), right: order.indexOf(q[2]), expl: q[3], id };
    }
    case "fill": {
      const id = pickFrom(user, "fill", pool(C.fill, user, 4));
      const q = C.fill[id];
      return { type: "fill", q: q[0], ans: q[1], expl: q[2], hint: q[3], id };
    }
    case "fix": {
      const id = pickFrom(user, "fix", pool(C.fix, user, 3));
      const q = C.fix[id];
      return { type: "fix", q: q[0], ans: q[1], expl: q[2], id };
    }
    case "vocab": {
      const ids = pool(C.vocab, user, 4);
      const id = pickFrom(user, "vocab", ids);
      const v = C.vocab[id];
      const rev = Math.random() < 0.4;
      const others = shuffle(ids.filter((i) => i !== id && C.vocab[i][1] !== v[1] && C.vocab[i][0] !== v[0])).slice(0, 3);
      const opts = shuffle([id, ...others]);
      return {
        type: "vocab",
        rev,
        word: rev ? v[1] : v[0],
        opts: opts.map((i) => (rev ? C.vocab[i][0] : C.vocab[i][1])),
        right: opts.indexOf(id),
        es: v[0],
        ru: v[1],
        pron: v[2],
        id,
      };
    }
  }
  return makeExercise(user, "say");
}

export function randomType() {
  const r = Math.random();
  return r < 0.34 ? "say" : r < 0.46 ? "vocab" : r < 0.58 ? "choice" : r < 0.68 ? "tr" : r < 0.78 ? "listen" : r < 0.89 ? "fill" : "fix";
}

export const DAILY_PLAN = () => ["say", "vocab", shuffle(["choice", "fill", "fix"])[0], "say", shuffle(["tr", "listen"])[0], "say"];

// Текст задания. Возвращает { text, keyboard, audio: строка для озвучки | null, audioCaption }
export function render(ex, user, n) {
  const head = n ? `<b>Задание ${n}</b> · ` : "";
  const skip = [["⏭ Пропустить", "skip"]];
  switch (ex.type) {
    case "say": {
      const stress = tokens(ex.es).map((t) => stressView(t.raw)).join(" ");
      return {
        text:
          head + "🎙 <b>Произнеси вслух</b>\n\n<b>" + esc(ex.es) + "</b>\n" + (ex.ru ? "<i>" + esc(ex.ru) + "</i>\n" : "") +
          "\nУдарения: <code>" + esc(stress) + "</code>\n" +
          (ex.weak ? "\n🔁 Здесь слово <b>" + esc(ex.weak) + "</b>, которое раньше давалось трудно.\n" : "") +
          "\nПослушай образец ниже и запиши <b>голосовое сообщение</b> 🎤",
        keyboard: [[["🐢 Медленно по словам", "slow"], ["🎬 Как говорят носители", "native"]], skip],
        audio: ex.es,
        audioCaption: "🔊 Образец (" + LV[user.variant || "esp"] + ")",
      };
    }
    case "listen":
      return {
        text: head + "🎧 <b>Диктант</b>\n\nПослушай фразу и напиши её по-испански (знаки ¿¡ и ударения можно не ставить).",
        keyboard: [[["🔁 Ещё раз", "repeat"], ["💡 Подсказка", "hint"]], skip],
        audio: ex.es,
        audioCaption: "🎧 Что здесь сказано?",
      };
    case "tr":
      return { text: head + "✍️ <b>Переведи на испанский</b>\n\n<b>" + esc(ex.ru) + "</b>\n\nНапиши ответ или скажи его голосом 🎤", keyboard: [[["💡 Подсказка", "hint"]], skip] };
    case "choice":
      return { text: head + "❓ <b>" + esc(ex.q) + "</b>", keyboard: ex.opts.map((o, i) => [[o, "a:" + i]]).concat([skip]) };
    case "vocab":
      return {
        text: head + "📚 <b>Что значит " + (ex.rev ? "по-испански" : "") + "</b>\n\n<b>" + esc(ex.word) + "</b>" + (ex.rev ? "" : "\n<i>" + esc(ex.pron) + "</i>"),
        keyboard: ex.opts.map((o, i) => [[o, "a:" + i]]).concat([skip]),
        audio: ex.rev ? null : ex.es,
      };
    case "fill":
      return { text: head + "🧩 <b>Вставь пропущенное слово</b>\n\n<b>" + esc(ex.q) + "</b>" + (ex.hint ? "\n<i>Подсказка: " + esc(ex.hint) + "</i>" : "") + "\n\nНапиши ответ.", keyboard: [skip] };
    case "fix":
      return { text: head + "🛠 <b>Найди и исправь ошибку</b>\n\n<b>" + esc(ex.q) + "</b>\n\nНапиши фразу правильно.", keyboard: [[["💡 Подсказка", "hint"]], skip] };
  }
}

export function hint(ex) {
  const a = (ex.ans && ex.ans[0]) || ex.es || "";
  const ws = a.split(" ");
  if (ex.type === "fix") return "Подсказка: " + ex.expl;
  return "Подсказка: начинается с «" + ws.slice(0, Math.max(1, Math.ceil(ws.length / 3))).join(" ") + " …» (" + ws.length + " " + plural(ws.length, "слово", "слова", "слов") + ")";
}

export function plural(n, a, b, c) {
  const m = n % 10, h = n % 100;
  return m === 1 && h !== 11 ? a : m >= 2 && m <= 4 && (h < 10 || h >= 20) ? b : c;
}

// Проверка текстового ответа
export function checkText(answer, accepted, strict) {
  const a = norm(answer);
  let best = { ok: false, d: 1e9, target: accepted[0] };
  for (const t of accepted) {
    const tn = norm(t);
    if (a === tn) {
      const exactAcc = String(answer).toLowerCase().replace(/[¿¡?!.,;:]/g, "").replace(/\s+/g, " ").trim() === String(t).toLowerCase().replace(/[¿¡?!.,;:]/g, "").replace(/\s+/g, " ").trim();
      if (!exactAcc && strict === "accents") return { ok: false, accentMiss: true, target: t };
      return { ok: true, accent: !exactAcc && /[áéíóúñü]/i.test(t), target: t };
    }
    const d = lev(a, tn);
    if (d < best.d) best = { ok: false, d, target: t };
  }
  const tl = norm(best.target).length;
  if (!strict && best.d <= Math.max(1, Math.floor(tl / 12))) return { ok: true, typo: true, target: best.target };
  return { ok: false, target: best.target };
}

export function checkChoice(ex, idx) {
  return { ok: idx === ex.right, target: ex.opts[ex.right] };
}

export function feedback(ex, res, answer) {
  const tgt = esc(res.target);
  let t;
  if (res.ok) {
    t = "✅ <b>" + (res.typo ? "Верно, но с опечаткой" : res.accent ? "Верно!" : "¡Perfecto! Верно!") + "</b>";
    if (res.typo || res.accent) t += "\nПравильно: <b>" + tgt + "</b>" + (res.accent ? "\n<i>Обрати внимание на знаки ударения — они меняют чтение и иногда смысл.</i>" : "");
  } else {
    t = "❌ <b>" + (res.accentMiss ? "Почти! Проверь знаки ударения." : "Не совсем.") + "</b>" + (answer ? "\nТвой ответ: <s>" + esc(answer) + "</s>" : "") + "\nПравильно: <b>" + tgt + "</b>";
  }
  if (ex.type === "listen" || ex.type === "say") t += ex.ru ? "\n<i>" + esc(ex.ru) + "</i>" : "";
  if (ex.type === "vocab") t += "\n<b>" + esc(ex.es) + "</b> — " + esc(ex.ru) + (ex.pron ? " <i>[" + esc(ex.pron) + "]</i>" : "");
  const ex2 = ex.expl || ex.note;
  if (ex2) t += "\n\n💡 " + esc(ex2);
  return t;
}

export { C as content };
