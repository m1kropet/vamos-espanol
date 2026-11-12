/* Реестр курса: уровни, блоки, уроки, словарь. Данные подключаются файлами js/data/*.js */
window.IT = window.IT || {};
(function (IT) {
  IT.levels = [
    { id: "A1", t: "Начальный", ti: "Principiante" },
    { id: "A2", t: "Элементарный", ti: "Elemental" },
    { id: "B1", t: "Средний", ti: "Intermedio" },
    { id: "B2", t: "Выше среднего", ti: "Intermedio alto" },
    { id: "C1", t: "Продвинутый", ti: "Avanzado" }
  ];
  IT.units = [];
  IT.addUnits = function (level, units) {
    units.forEach(function (u) { u.level = level; IT.units.push(u); });
  };

  var ARTICLES = /^(?:el|la|los|las|un|una|unos|unas)\s+/i;
  IT.bare = function (w) { return w.replace(ARTICLES, "").trim(); };

  var POS = {
    "n.m": ["сущ.", "m"], "n.f": ["сущ.", "f"], "n.m.pl": ["сущ. мн.", "m"], "n.f.pl": ["сущ. мн.", "f"],
    v: ["глагол"], adj: ["прил."], adv: ["нареч."], prep: ["предлог"], pron: ["местоим."], phr: ["выражение"],
    num: ["числ."], int: ["междом."], art: ["артикль"], conj: ["союз"]
  };
  IT.posLabel = function (p) { return (POS[p] || [p])[0]; };

  function parseWord(s, lesson) {
    var p = s.split("|");
    var pos = p[3] || "";
    return {
      key: p[0], it: p[0], ru: p[1] || "", pron: p[2] || "", pos: pos,
      gender: (POS[pos] || [])[1] || null,
      ex: p[4] ? [p[4], p[5] || ""] : null,
      lesson: lesson ? lesson.id : null, level: lesson ? lesson.level : null
    };
  }
  IT.parseWord = parseWord;

  function parseEx(e) {
    return {
      it: e[0], ru: e[1],
      gloss: (e[2] || "").split("|").filter(Boolean).map(function (g) {
        var i = g.indexOf("="); return i < 0 ? [g, ""] : [g.slice(0, i), g.slice(i + 1)];
      }),
      note: e[3] || "", alts: e[4] || []
    };
  }

  /** Строит индексы после загрузки всех файлов данных */
  IT.buildIndex = function () {
    IT.lessonById = {}; IT.unitById = {}; IT.vocab = {}; IT.allLessons = [];
    IT.units.forEach(function (u, ui) {
      u.index = ui; IT.unitById[u.id] = u;
      u.lessons.forEach(function (l, li) {
        l.unit = u; l.li = li; l.level = u.level; l.order = IT.allLessons.length;
        l.examples = (l.ex || []).map(parseEx);
        l.words = (l.voc || []).map(function (s) { return parseWord(s, l); });
        l.words.forEach(function (w) { if (!IT.vocab[w.key]) IT.vocab[w.key] = w; });
        IT.lessonById[l.id] = l; IT.allLessons.push(l);
      });
    });
    // Пример использования для слов без своего примера: ищем в примерах курса, диалогах и упражнениях
    var src = [];
    IT.allLessons.forEach(function (l) { l.examples.forEach(function (e) { src.push({ it: e.it, ru: e.ru, l: l.id, p: 3 }); }); });
    (IT.dialogues || []).forEach(function (d) { d.steps.forEach(function (st) { src.push({ it: st.npc, ru: st.ru, l: null, p: 2 }); if (st.model) src.push({ it: st.model, ru: "", l: null, p: 1 }); }); });
    IT.allLessons.forEach(function (l) { (l.q || []).forEach(function (q) {
      if (q[0] === "f") src.push({ it: q[1].replace(/_{2,}/, q[2].split("/")[0]).replace(/\s*\(.*?\)\s*$/, ""), ru: "", l: l.id, p: 1 });
      if (q[0] === "x") src.push({ it: q[2].split("/")[0], ru: "", l: l.id, p: 1 });
    }); });
    src.forEach(function (x) { x.toks = IT.tokens(x.it); x.n = IT.norm(x.it); });
    Object.keys(IT.vocab).forEach(function (k) {
      var w = IT.vocab[k];
      if (!w.ex && IT.wordExamples && IT.wordExamples[k]) w.ex = IT.wordExamples[k];
      if (w.ex) return;
      var b = IT.bare(w.it).toLowerCase(), multi = b.indexOf(" ") > 0, stem = null;
      var m = b.match(/^(.*?)(arse|erse|irse|ar|er|ir)$/);
      if (w.pos === "v" && m && m[1].length >= 2) stem = m[1];
      else if (!multi && b.length >= 4 && /[aeiouáéíóú]$/.test(b)) stem = b.slice(0, -1);
      var best = null, bs = -1;
      src.forEach(function (x) {
        var hit = multi ? x.n.indexOf(IT.norm(b)) >= 0 : x.toks.some(function (tk) {
          if (tk === b) return true;
          return stem && tk.indexOf(stem) === 0 && tk.length <= stem.length + (w.pos === "v" ? 6 : 2);
        });
        if (!hit) return;
        var sc = x.p * 10 + (x.l === w.lesson ? 5 : 0) - Math.abs(x.toks.length - 5) * .3;
        if (sc > bs) { bs = sc; best = x; }
      });
      if (best) w.ex = [best.it, best.ru];
    });
  };

  IT.tokens = function (s) {
    return IT.norm(s).split(" ").filter(Boolean);
  };
  /** Нормализация для сравнения ответов */
  IT.norm = function (s) {
    return String(s || "").toLowerCase()
      .replace(/[’`´ʼ]/g, "'")
      .replace(/[.,!?;:"«»()¡¿…—–]/g, " ")
      .replace(/\s*'\s*/g, "' ")
      .replace(/-/g, " ")
      .replace(/\s+/g, " ").trim();
  };
  IT.stripAcc = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, ""); };
})(window.IT);
