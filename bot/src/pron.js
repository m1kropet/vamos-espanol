// Анализ произношения: сравнение того, что сказано (распознано), с эталонной фразой,
// слоги и ударение, подсказки по испанской фонетике для русскоговорящих.

export const stripAcc = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").normalize("NFC");
export const norm = (s) => stripAcc(String(s).toLowerCase()).replace(/[^a-zñ0-9\s]/g, " ").replace(/\s+/g, " ").trim();

// Слова с сохранением исходного написания (для показа) и нормализованной формой (для сравнения)
export function tokens(s) {
  return String(s)
    .replace(/[¿¡?!.,;:«»"“”()…—–]/g, " ")
    .split(/\s+/)
    .map((w) => w.replace(/^[-']+|[-']+$/g, ""))
    .filter(Boolean)
    .map((w) => ({ raw: w, n: norm(w).replace(/\s/g, "") }))
    .filter((t) => t.n);
}

export function lev(a, b) {
  if (a === b) return 0;
  const m = a.length, n = b.length;
  if (!m) return n;
  if (!n) return m;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    prev = cur;
  }
  return prev[n];
}
export const sim = (a, b) => (a === b ? 1 : 1 - lev(a, b) / Math.max(a.length, b.length, 1));

// Числа, которые распознавание часто пишет цифрами
const NUM = { 0: "cero", 1: "uno", 2: "dos", 3: "tres", 4: "cuatro", 5: "cinco", 6: "seis", 7: "siete", 8: "ocho", 9: "nueve", 10: "diez", 11: "once", 12: "doce", 15: "quince", 20: "veinte", 100: "cien" };
function expandNums(toks) {
  return toks.map((t) => (/^\d+$/.test(t.n) && NUM[+t.n] ? { raw: NUM[+t.n], n: NUM[+t.n] } : t));
}

// Выравнивание слов эталона и распознанного (динамическое программирование).
// Возвращает для каждого слова эталона: ok | close | wrong | missing, и что услышано.
export function align(targetText, heardText) {
  const T = tokens(targetText), H = expandNums(tokens(heardText));
  const m = T.length, n = H.length;
  const cost = (i, j) => {
    const s = sim(T[i].n, H[j].n);
    return s >= 0.999 ? 0 : s >= 0.6 ? 1 - s : 1.2;
  };
  const D = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  const P = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(""));
  for (let i = 1; i <= m; i++) { D[i][0] = i; P[i][0] = "u"; }
  for (let j = 1; j <= n; j++) { D[0][j] = j * 0.7; P[0][j] = "l"; }
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++) {
      const d = D[i - 1][j - 1] + cost(i - 1, j - 1), u = D[i - 1][j] + 1, l = D[i][j - 1] + 0.7;
      if (d <= u && d <= l) { D[i][j] = d; P[i][j] = "d"; } else if (u <= l) { D[i][j] = u; P[i][j] = "u"; } else { D[i][j] = l; P[i][j] = "l"; }
    }
  const res = [], extra = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    const p = P[i][j];
    if (p === "d") {
      const t = T[i - 1], h = H[j - 1], s = sim(t.n, h.n);
      res.unshift({ word: t.raw, n: t.n, heard: h.raw, sim: s, st: s >= 0.999 ? "ok" : s >= 0.75 ? "close" : "wrong" });
      i--; j--;
    } else if (p === "u") {
      const t = T[i - 1];
      res.unshift({ word: t.raw, n: t.n, heard: "", sim: 0, st: "missing" });
      i--;
    } else {
      extra.unshift(H[j - 1].raw);
      j--;
    }
  }
  // Склейки и разрывы: «porfavor» vs «por favor» — засчитываем
  for (let k = 0; k < res.length - 1; k++) {
    const a = res[k], b = res[k + 1];
    const glued = a.n + b.n;
    if (a.st !== "ok" && b.st === "missing" && norm(a.heard).replace(/\s/g, "") === glued) { a.st = b.st = "ok"; a.sim = b.sim = 1; b.heard = a.heard; }
    else if (a.st === "missing" && b.st !== "ok" && norm(b.heard).replace(/\s/g, "") === glued) { a.st = b.st = "ok"; a.sim = b.sim = 1; a.heard = b.heard; }
  }
  const score0 = m ? Math.round((100 * res.reduce((acc, r) => acc + (r.st === "ok" ? 1 : r.st === "close" ? 0.4 : 0), 0)) / m - Math.min(15, extra.length * 5)) : 0;
  return { words: res, extra, score: Math.max(0, Math.min(100, score0)) };
}

// ---------- Слоги и ударение ----------
const V = "aeiouáéíóúü";
const STRONG = "aeoáéó";
const isV = (c) => V.includes(c);
const ACC = "áéíóú";
const INSEP = ["qu", "gu", "pl", "pr", "bl", "br", "cl", "cr", "dr", "tr", "fl", "fr", "gl", "gr", "ch", "ll", "rr", "kl", "kr"];

export function syllables(word) {
  const w = word.toLowerCase();
  if (!/[a-záéíóúüñ]/.test(w)) return [word];
  // ядра: группы гласных, разбиваем зияния (две сильные или ударная слабая)
  const groups = [];
  let i = 0;
  while (i < w.length) {
    if (isV(w[i])) {
      let j = i + 1;
      while (j < w.length && isV(w[j])) j++;
      // u в que/qui/gue/gui — не гласная
      let seq = w.slice(i, j), start = i;
      if ((w[i - 1] === "q" || (w[i - 1] === "g" && "eiéí".includes(w[i + 1] || ""))) && w[i] === "u" && seq.length > 1) { start = i + 1; seq = seq.slice(1); }
      // разбиение на ядра
      let k = 0, cur = start;
      const parts = [];
      let chunk = seq[0];
      for (k = 1; k < seq.length; k++) {
        const a = seq[k - 1], b = seq[k];
        const hiatus = (STRONG.includes(a) && STRONG.includes(b)) || "íú".includes(a) || "íú".includes(b);
        if (hiatus) { parts.push([cur, chunk]); cur += chunk.length; chunk = b; } else chunk += b;
      }
      parts.push([cur, chunk]);
      parts.forEach((p) => groups.push({ s: p[0], e: p[0] + p[1].length }));
      i = j;
    } else i++;
  }
  if (!groups.length) return [word];
  const cuts = [];
  for (let g = 1; g < groups.length; g++) {
    const a = groups[g - 1].e, b = groups[g].s, cons = w.slice(a, b);
    let cut;
    if (cons.length === 0) cut = a;
    else if (cons.length === 1) cut = a;
    else if (cons.length === 2) cut = INSEP.includes(cons) ? a : a + 1;
    else if (cons.length === 3) cut = INSEP.includes(cons.slice(1)) ? a + 1 : a + 2;
    else cut = INSEP.includes(cons.slice(2)) ? a + 2 : a + 3;
    cuts.push(cut);
  }
  const out = [];
  let p = 0;
  cuts.forEach((c) => { out.push(word.slice(p, c)); p = c; });
  out.push(word.slice(p));
  return out;
}

export function stressIndex(word) {
  const syl = syllables(word);
  const ai = syl.findIndex((s) => /[áéíóú]/i.test(s));
  if (ai >= 0) return ai;
  if (syl.length === 1) return 0;
  return /[aeiouns]$/i.test(word) ? syl.length - 2 : syl.length - 1;
}

// «teléfono» → «te·LÉ·fo·no»
export function stressView(word) {
  const syl = syllables(word);
  if (syl.length < 2) return word;
  const si = stressIndex(word);
  return syl.map((s, i) => (i === si ? s.toUpperCase() : s)).join("·");
}

// ---------- Подсказки по звукам ----------
// Каждая: id, проверка на слово, текст (русский). esp/lat — варианты для Испании / Лат. Америки.
const TIPS = [
  { id: "rr", re: /rr|^r|[nls]r/, t: "<b>RR / R в начале слова</b> — раскатистое «р-р-р» (3–4 удара кончика языка). <i>perro</i> ≠ <i>pero</i>: от этого зависит смысл (собака / но)." },
  { id: "r", re: /[aeiouáéíóú]r[aeiouáéíóú]|r$/, t: "<b>Одиночное R</b> между гласными и в конце — один короткий удар, как «р» в слове «пора». Не тяните и не раскатывайте." },
  { id: "j", re: /j|g[eiéí]/, t: "<b>J, G перед e/i</b> — звук [х]. В Испании глубже и с хрипотцой (как «х» в «хор», но из горла), в Латинской Америке мягче, почти как английское h." },
  { id: "ll", re: /ll|y[aeiouáéíóú]/, esp: "<b>LL и Y</b> — почти как русское «й», но чуть плотнее (язык прижат сильнее): <i>calle</i> ≈ «кайе», <i>yo</i> ≈ «йо».", lat: "<b>LL и Y</b> — «й» (Мексика, Колумбия); в Аргентине и Уругвае — как «ш/ж»: <i>calle</i> ≈ «каше»." },
  { id: "n", re: /ñ/, t: "<b>Ñ</b> — мягкое «нь» одним звуком, как в «няня»: <i>España</i> ≈ «Эспанья», без отдельного «й»." },
  { id: "z", re: /z|c[eiéí]/, esp: "<b>Z, C перед e/i (Испания)</b> — межзубный звук [θ], как английское <i>th</i> в <i>think</i>: кончик языка между зубами. <i>gracias</i> ≈ «грáθьяс».", lat: "<b>Z, C перед e/i (Лат. Америка)</b> — обычное [с]: <i>gracias</i> ≈ «грáсьяс», <i>zapato</i> ≈ «сапáто»." },
  { id: "h", re: /h/, notRe: /ch/, t: "<b>H</b> не произносится никогда: <i>hola</i> = «óла», <i>hablar</i> = «аблáр»." },
  { id: "bv", re: /v|b/, t: "<b>B и V</b> звучат одинаково. В начале фразы и после m/n — как «б»; между гласными — мягкое [β]: губы почти смыкаются, но не до конца. Звука «в» в испанском нет." },
  { id: "d", re: /[aeiouáéíóú]d[aeiouáéíóú]|d$|[aeiouáéíóú]d[rl]/, t: "<b>D между гласными и в конце</b> — мягкое [ð], как английское <i>th</i> в <i>this</i>: <i>todo</i> ≈ «тóðо», <i>Madrid</i> — конечное d почти не слышно." },
  { id: "qu", re: /qu|gu[eiéí]/, t: "<b>QU, GUE, GUI</b> — буква u не читается: <i>queso</i> = «кéсо», <i>guitarra</i> = «гитáрра». Читается только с точками: <i>pingüino</i>." },
  { id: "o", re: /o/, t: "<b>Безударное O</b> — всегда чистое «о», не «а»! Русская привычка «акать» (<i>como</i> → «кама») сразу выдаёт акцент. Округляйте губы на каждом o." },
  { id: "e", re: /[^aeiouáéíóú]e|^e/, t: "<b>E</b> — открытое «э», и согласный перед ним <u>не смягчается</u>: <i>te</i> = «тэ», не «тье»; <i>mesa</i> = «мэса»." },
  { id: "ch", re: /ch/, t: "<b>CH</b> — твёрдое «ч», как в «чай», но без смягчения следующей гласной." },
  { id: "x", re: /x/, t: "<b>X</b> — обычно [кс] (<i>taxi</i>), а в мексиканских названиях — [х]: <i>México</i> = «Мéхико»." },
  { id: "l", re: /l(?!l)/, t: "<b>L</b> — светлое, ближе к мягкому, но не «ль»: среднее между «л» и «ль», как в немецком/французском." },
  { id: "p", re: /^[ptk]|[aeiou][ptk]/, t: "<b>P, T, K</b> — без придыхания, а <b>T и D</b> — зубные: кончик языка касается верхних зубов, а не дёсен." },
  { id: "dip", re: /[aeo][iu]|[iu][aeo]|ue|ie/, t: "<b>Дифтонги</b> (ie, ue, ai, au…) — одним слогом и слитно: <i>bueno</i> = «буэ-но» (2 слога), <i>tiene</i> = «тьé-нэ»." },
  { id: "s", re: /s/, t: "<b>S</b> — чёткое, не «з» даже между гласными: <i>casa</i> = «кáса», <i>mesa</i> = «мэса»." },
];

function tipFor(id, variant) {
  const t = TIPS.find((x) => x.id === id);
  if (!t) return "";
  return t.t || (variant === "lat" ? t.lat : t.esp);
}

// Какие места слова расходятся с услышанным (позиции в нормализованном эталоне)
function diffPositions(target, heard) {
  const a = target, b = heard;
  const m = a.length, n = b.length;
  const D = Array.from({ length: m + 1 }, (_, i) => [i, ...new Array(n).fill(0)]);
  for (let j = 1; j <= n; j++) D[0][j] = j;
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  const pos = new Set();
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (D[i][j] === D[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)) { if (a[i - 1] !== b[j - 1]) pos.add(i - 1); i--; j--; }
    else if (D[i][j] === D[i - 1][j] + 1) { pos.add(i - 1); i--; }
    else { pos.add(Math.max(0, i - 1)); pos.add(Math.min(m - 1, i)); j--; }
  }
  while (i > 0) { pos.add(i - 1); i--; }
  return pos;
}

// Подсказки для слова: сначала те, что объясняют конкретное расхождение, затем общие «опасные» места.
export function wordTips(word, heard, variant, max = 2) {
  const w = word.toLowerCase();
  const wn = stripAcc(w).replace(/[^a-zñ]/g, "");
  const hn = stripAcc(String(heard || "").toLowerCase()).replace(/[^a-zñ]/g, "");
  const out = [];
  const add = (id) => { if (!out.includes(id) && out.length < max) out.push(id); };
  if (hn) {
    const pos = diffPositions(wn, hn);
    for (const t of TIPS) {
      if (t.notRe && t.notRe.test(wn)) continue;
      const g = new RegExp(t.re.source, "g");
      let mm;
      while ((mm = g.exec(wn))) {
        for (let k = mm.index; k < mm.index + Math.max(1, mm[0].length); k++) if (pos.has(k)) { add(t.id); break; }
        if (mm[0].length === 0) g.lastIndex++;
      }
    }
    // типичная «русская» подмена: o → a
    if (/o/.test(wn) && /a/.test(hn) && hn.split("a").length > wn.split("a").length) add("o");
  }
  // самые частые трудности, если конкретная причина не найдена
  for (const id of ["rr", "j", "z", "ll", "n", "h", "qu", "d", "bv", "r", "o", "e", "dip"]) {
    const t = TIPS.find((x) => x.id === id);
    if (t.re.test(wn) && !(t.notRe && t.notRe.test(wn))) add(id);
  }
  return out.map((id) => ({ id, text: tipFor(id, variant) }));
}

export function tipText(id, variant) {
  return tipFor(id, variant);
}

export const TIP_NAMES = { rr: "RR", r: "R", j: "J/G", ll: "LL/Y", n: "Ñ", z: "Z/C", h: "H", bv: "B/V", d: "D", qu: "QU/GU", o: "безударное O", e: "E", ch: "CH", x: "X", l: "L", p: "P/T/K", dip: "дифтонги", s: "S" };

// Ссылки на живое произношение носителей
export function youglish(phrase, variant) {
  const q = encodeURIComponent(String(phrase).replace(/[¿¡?!.,;:«»"]/g, "").trim().toLowerCase());
  return "https://youglish.com/pronounce/" + q + "/spanish";
}
export function spanishdict(phrase) {
  return "https://www.spanishdict.com/pronunciation/" + encodeURIComponent(String(phrase).replace(/[¿¡?!.,;:«»"]/g, "").trim().toLowerCase());
}
export function forvo(word) {
  return "https://forvo.com/word/" + encodeURIComponent(String(word).toLowerCase().replace(/[¿¡?!.,;:]/g, "")) + "/#es";
}
