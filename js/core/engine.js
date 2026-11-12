/* Генерация упражнений и проверка ответов */
(function (IT) {
  var S = IT.store;

  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function uniq(a) { var s = {}; return a.filter(function (x) { var k = IT.norm(x); if (s[k]) return false; s[k] = 1; return true; }); }
  IT.shuffle = shuffle; IT.sample = sample;

  /* ===================== Проверка ответа ===================== */
  function lev(a, b) {
    if (a === b) return 0;
    var m = a.length, n = b.length, d = [];
    for (var i = 0; i <= m; i++) { d[i] = [i]; }
    for (var j = 1; j <= n; j++) d[0][j] = j;
    for (i = 1; i <= m; i++) for (j = 1; j <= n; j++)
      d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return d[m][n];
  }
  /** Возвращает {ok, kind: exact|accent|typo|wrong, best} */
  IT.check = function (input, answers) {
    var n = IT.norm(input), na = IT.stripAcc(n);
    if (!n) return { ok: false, kind: "empty", best: answers[0] };
    var i, a;
    for (i = 0; i < answers.length; i++) if (IT.norm(answers[i]) === n) return { ok: true, kind: "exact", best: answers[i] };
    for (i = 0; i < answers.length; i++) if (IT.stripAcc(IT.norm(answers[i])) === na) return { ok: true, kind: "accent", best: answers[i] };
    // одна опечатка в длинном слове, не в окончании (окончания несут грамматику)
    var uw = na.split(" ");
    for (i = 0; i < answers.length; i++) {
      a = IT.stripAcc(IT.norm(answers[i])).split(" ");
      if (a.length !== uw.length) continue;
      var diffs = [];
      for (var k = 0; k < a.length; k++) if (a[k] !== uw[k]) diffs.push(k);
      if (diffs.length === 1) {
        var x = a[diffs[0]], y = uw[diffs[0]];
        if (x.length >= 5 && lev(x, y) === 1 && x.slice(-1) === y.slice(-1) && x.slice(-2) === y.slice(-2)) return { ok: true, kind: "typo", best: answers[i], word: answers[i].split(" ")[diffs[0]] };
      }
    }
    // ближайший правильный вариант для разбора ошибки
    var best = answers[0], bd = 1e9;
    answers.forEach(function (ans) { var dd = lev(IT.stripAcc(IT.norm(ans)), na); if (dd < bd) { bd = dd; best = ans; } });
    return { ok: false, kind: "wrong", best: best };
  };

  /** Пословное сравнение: какие слова пропущены / лишние / неверные */
  IT.diffWords = function (user, correct) {
    var u = IT.norm(user).split(" ").filter(Boolean), c = IT.norm(correct).split(" ").filter(Boolean);
    var uS = u.map(IT.stripAcc), cS = c.map(IT.stripAcc);
    var m = u.length, n = c.length, L = [];
    for (var i = 0; i <= m; i++) { L[i] = []; for (var j = 0; j <= n; j++) L[i][j] = 0; }
    for (i = m - 1; i >= 0; i--) for (j = n - 1; j >= 0; j--) L[i][j] = uS[i] === cS[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var outU = [], outC = []; i = 0; j = 0;
    while (i < m && j < n) {
      if (uS[i] === cS[j]) { outU.push([u[i], u[i] === c[j] ? "ok" : "acc"]); outC.push([c[j], u[i] === c[j] ? "ok" : "acc"]); i++; j++; }
      else if (L[i + 1][j] >= L[i][j + 1]) { outU.push([u[i], "bad"]); i++; }
      else { outC.push([c[j], "miss"]); j++; }
    }
    while (i < m) outU.push([u[i++], "bad"]);
    while (j < n) outC.push([c[j++], "miss"]);
    return { user: outU, correct: outC };
  };

  /* ===================== Варианты ответа ===================== */
  function wordPool(pos) {
    return Object.keys(IT.vocab).map(function (k) { return IT.vocab[k]; }).filter(function (w) { return !pos || w.pos === pos; });
  }
  /* Похожие слова: отвлекающие варианты подбираются по сходству испанского написания
   * (bueno → bonito, nuevo, buena…), чтобы ответ нельзя было угадать «по внешнему виду». */
  function simKey(s) { return IT.stripAcc(IT.norm(IT.bare(String(s || "")))); }
  function prefixLen(a, b) { var i = 0; while (i < a.length && i < b.length && a[i] === b[i]) i++; return i; }
  function simScore(a, b) {
    var d = lev(a, b), m = Math.max(a.length, b.length) || 1;
    var sc = d / m - Math.min(prefixLen(a, b), 4) * 0.08;
    if (a.slice(-1) === b.slice(-1)) sc -= 0.05;
    if (a.charAt(0) === b.charAt(0)) sc -= 0.05;
    return sc;
  }
  IT.simScore = function (a, b) { return simScore(simKey(a), simKey(b)); };
  // Классические смысловые путаницы: идут первыми, если слова есть в словаре
  var CONFUSE = [["bueno", "bonito", "bien", "mal"], ["ser", "estar", "hay", "haber", "tener"], ["pero", "perro", "caro"], ["saber", "conocer"], ["pedir", "preguntar"], ["llevar", "traer", "ir", "venir"], ["mucho", "muy"], ["por", "para"], ["también", "tampoco"], ["hacer", "poner"], ["calor", "caliente", "frío"], ["tiempo", "hora", "vez"], ["pequeño", "poco"], ["nuevo", "joven"], ["viejo", "mayor"], ["pescado", "pez"]];
  var confIdx = null;
  function confusers(key) {
    if (!confIdx) { confIdx = {}; CONFUSE.forEach(function (g) { g.forEach(function (k) { confIdx[k] = g; }); }); }
    return confIdx[key] || [];
  }
  function lookalikes(word, limit) {
    var key = simKey(word.it), ru = IT.norm(word.ru), multi = /\s/.test(IT.bare(word.it)), conf = confusers(IT.stripAcc(IT.norm(IT.bare(word.it))));
    var hasArt = IT.bare(word.it) !== word.it;
    return wordPool().filter(function (w) {
      if (w.key === word.key) return false;
      var k = simKey(w.it);
      if (!k || k === key || IT.norm(w.ru) === ru) return false;     // не берём синонимы и тот же перевод
      if (k.length <= 2 && key.length > 3) return false;
      return /\s/.test(IT.bare(w.it)) === multi;                     // слово к слову, фраза к фразе
    }).map(function (w) {
      var sc = simScore(key, simKey(w.it));
      if (w.pos !== word.pos && !(String(w.pos).charAt(0) === "n" && String(word.pos).charAt(0) === "n")) sc += 0.35;
      if ((IT.bare(w.it) !== w.it) !== hasArt) sc += 0.2;
      if (conf.map(IT.stripAcc).indexOf(IT.stripAcc(IT.norm(IT.bare(w.it)))) >= 0) sc -= 1;
      return { w: w, sc: sc };
    }).sort(function (a, b) { return a.sc - b.sc; }).slice(0, limit || 8).map(function (x) { return x.w; });
  }
  IT.lookalikes = lookalikes;
  function distractWords(word, field, n, lesson) {
    var top = lookalikes(word, 7), out = [], seen = {};
    seen[IT.norm(word[field])] = 1;
    function add(v) { var k = IT.norm(v); if (!v || seen[k] || out.length >= n) return; seen[k] = 1; out.push(v); }
    // самый похожий — почти всегда, остальные — случайно из ближайших, чтобы попытки отличались
    if (top[0] && Math.random() < 0.85) add(top[0][field]);
    shuffle(top.slice(0, 6)).forEach(function (w) { add(w[field]); });
    var pool = (lesson ? lesson.words : []).filter(function (w) { return w.key !== word.key && IT.norm(w.ru) !== IT.norm(word.ru); });
    shuffle(pool).concat(shuffle(wordPool(word.pos))).forEach(function (w) { if (w.key !== word.key) add(w[field]); });
    return out;
  }
  /* Ошибочные написания: b/v, ll/y, c/z/s, h, ñ, r/rr, ударения */
  var SWAPS = [[/v/, "b"], [/b/, "v"], [/ll/, "y"], [/y(?=[aeiou])/, "ll"], [/z/, "s"], [/c(?=[ei])/, "s"], [/s/, "z"], [/qu/, "c"], [/c(?=[aou])/, "k"], [/^h/, ""], [/^([aeiou])/, "h$1"], [/ñ/, "n"], [/ni(?=[aeiou])/, "ñ"], [/rr/, "r"], [/([aeiou])r([aeiou])/, "$1rr$2"], [/g(?=[ei])/, "j"], [/j(?=[ei])/, "g"], [/x/, "j"], [/([aeiou])\1/, "$1"]];
  var ACC = { a: "á", e: "é", i: "í", o: "ó", u: "ú" };
  function misspell(word) {
    var full = word.it, m = full.match(/^((?:el|la|los|las|un|una|unos|unas)\s+)?(.*)$/i), art = m[1] || "", w = m[2];
    var out = [], real = {};
    wordPool().forEach(function (x) { real[IT.norm(x.it)] = 1; });
    function add(v) { if (v && v !== w && !real[IT.norm(art + v)] && out.indexOf(art + v) < 0) out.push(art + v); }
    SWAPS.forEach(function (sw) { if (sw[0].test(w)) add(w.replace(sw[0], sw[1])); });
    if (/[áéíóú]/.test(w)) {
      add(IT.stripAcc(w));
      var bare = IT.stripAcc(w), vs = []; bare.replace(/[aeiou]/g, function (c, i) { vs.push(i); });
      vs.forEach(function (i) { var c = bare.charAt(i), v = bare.slice(0, i) + ACC[c] + bare.slice(i + 1); if (v !== w) add(v); });
    } else {
      var vs2 = []; w.replace(/[aeiou]/g, function (c, i) { vs2.push(i); });
      sample(vs2, 2).forEach(function (i) { add(w.slice(0, i) + ACC[w.charAt(i)] + w.slice(i + 1)); });
    }
    return shuffle(out);
  }
  IT.misspell = misspell;
  function wordWhy(w) {
    var parts = ["«" + w.it + "» — " + w.ru + "."];
    var g = w.gender === "m" ? "мужской род" : w.gender === "f" ? "женский род" : "";
    var pl = IT.posLabel(w.pos).replace(/\.$/, ""); pl = pl.charAt(0).toUpperCase() + pl.slice(1);
    parts.push(pl + (g ? ", " + g : "") + (w.pron ? ". Произношение: [" + w.pron + "]" : "") + ".");
    if (w.gender && /^(el|la|los|las)\s/i.test(w.it)) parts.push("Учите слово вместе с артиклем — он сразу показывает род.");
    return parts.join(" ");
  }
  IT.wordWhy = wordWhy;

  /* ===================== Конструкторы заданий ===================== */
  var MK = {
    pick: function (w, lesson, dir) {
      dir = dir || "it-ru";
      var field = dir === "it-ru" ? "ru" : "it";
      var opts = shuffle([w[field]].concat(distractWords(w, field, 3, lesson)));
      return { type: "pick", dir: dir, prompt: dir === "it-ru" ? w.it : w.ru, sub: dir === "it-ru" ? w.pron : "", audio: dir === "it-ru" ? w.it : null,
        options: opts, answer: w[field], words: [w.key], why: wordWhy(w), ex: w.ex, tags: (lesson && lesson.tags) || ["lessico"] };
    },
    match: function (words, lesson) {
      return { type: "match", pairs: words.map(function (w) { return [w.it, w.ru, w.key]; }), words: words.map(function (w) { return w.key; }),
        why: "Сопоставление закрепляет связь между словом и значением. Произносите слова вслух, нажимая на них.", tags: (lesson && lesson.tags) || ["lessico"] };
    },
    listen: function (ex, lesson, others) {
      var opts = uniq([ex.it].concat(shuffle(others).map(function (o) { return o.it; }))).slice(0, 3);
      return { type: "listen", audio: ex.it, ru: ex.ru, options: shuffle(opts), answer: ex.it, gloss: ex.gloss, note: ex.note, tags: (lesson && lesson.tags) || [] };
    },
    build: function (ex, lesson, others) {
      var toks = ex.it.split(/\s+/).map(function (t) { return t.replace(/[.,!?;:«»]+$/g, "").replace(/^[«¿¡]+/, ""); }).filter(Boolean);
      var used = {}; toks.forEach(function (t) { used[IT.norm(t)] = 1; });
      var extra = [];
      shuffle(others).forEach(function (o) {
        o.it.split(/\s+/).forEach(function (t) {
          t = t.replace(/[.,!?;:«»]+$/g, ""); var k = IT.norm(t);
          if (t && !used[k] && extra.length < Math.min(3, Math.max(2, Math.ceil(toks.length / 2)))) { used[k] = 1; extra.push(t); }
        });
      });
      return { type: "build", prompt: ex.ru, answers: [ex.it].concat(ex.alts || []), tiles: shuffle(toks.concat(extra)), gloss: ex.gloss, note: ex.note, tags: (lesson && lesson.tags) || [] };
    },
    trans: function (ex, lesson) {
      return { type: "trans", prompt: ex.ru, answers: altsFor(ex), gloss: ex.gloss, note: ex.note, audio: ex.it, tags: (lesson && lesson.tags) || [] };
    },
    trchoice: function (ex, lesson, others) {
      var opts = uniq([ex.ru].concat(shuffle(others).map(function (o) { return o.ru; }))).slice(0, 3);
      return { type: "trchoice", prompt: ex.it, audio: ex.it, options: shuffle(opts), answer: ex.ru, gloss: ex.gloss, note: ex.note, tags: (lesson && lesson.tags) || [] };
    },
    /* «Как правильно пишется?» — правильное слово среди ошибочных написаний и похожего слова */
    spell: function (w, lesson) {
      var wrong = misspell(w).slice(0, 2), look = lookalikes(w, 3).map(function (x) { return x.it; });
      var opts = [w.it].concat(wrong);
      look.forEach(function (v) { if (opts.length < 4 && opts.map(IT.norm).indexOf(IT.norm(v)) < 0) opts.push(v); });
      misspell(w).slice(2).forEach(function (v) { if (opts.length < 4 && opts.indexOf(v) < 0) opts.push(v); });
      if (opts.length < 3) return MK.pick(w, lesson, "ru-it");
      return { type: "pick", dir: "ru-it", spell: true, prompt: w.ru, options: shuffle(opts), answer: w.it, words: [w.key], why: wordWhy(w), ex: w.ex, tags: (lesson && lesson.tags) || ["lessico"] };
    },
    type: function (w, lesson) {
      var ans = [w.it]; var b = IT.bare(w.it); if (b !== w.it) ans.push(b);
      return { type: "type", prompt: w.ru, answers: ans, words: [w.key], why: wordWhy(w), audio: w.it, hint: w.it.charAt(0) + "…", tags: (lesson && lesson.tags) || ["lessico"] };
    },
    dictation: function (ex, lesson) {
      return { type: "dictation", audio: ex.it, ru: ex.ru, answers: [ex.it], gloss: ex.gloss, note: ex.note, tags: (lesson && lesson.tags) || [] };
    },
    custom: function (q, lesson) {
      var tags = (lesson && lesson.tags) || [];
      if (q[0] === "c" || q[0] === "s") {
        var ans = q[2][q[3]];
        return { type: "choice", situation: q[0] === "s", q: q[1], options: shuffle(q[2]), answer: ans, why: q[4], tags: tags };
      }
      if (q[0] === "f") return { type: "fill", q: q[1], answers: q[2].split("/"), why: q[3], hint: q[4] || "", tags: tags };
      if (q[0] === "x") return { type: "fix", q: q[1], answers: q[2].split("/"), why: q[3], tags: tags };
      if (q[0] === "d") return { type: "dlg", lines: q[1], options: shuffle(q[2]), answer: q[2][q[3]], why: q[4], tags: tags };
      return null;
    }
  };
  IT.MK = MK;

  var PRON = /^([¿¡]?)(yo|tú|él|ella|usted|nosotros|nosotras|vosotros|vosotras|ellos|ellas|ustedes)\s+(.*)$/i;
  function altsFor(ex) {
    var a = [ex.it].concat(ex.alts || []);
    var m = ex.it.match(PRON);
    if (m) a.push(m[1] + m[3].charAt(0).toUpperCase() + m[3].slice(1));
    return uniq(a);
  }

  /* ===================== Урок ===================== */
  function prevLessons(lesson) {
    return IT.allLessons.filter(function (l) { return l.order < lesson.order && IT.prog.lessonDone(l.id); });
  }
  function shortEx(list, max) { return list.filter(function (e) { return e.it.split(" ").length <= (max || 8); }); }
  function stage(items, name) { items.forEach(function (it) { if (it) it.stage = name; }); return items.filter(Boolean); }

  /* Сборка урока. Каждая попытка отличается: случайные слова и примеры, случайный тип задания
   * для каждого из них, случайная часть авторских вопросов. То, что было в прошлой попытке,
   * уходит в конец очереди, поэтому при повторе ученик видит в основном новые задания. */
  function sigOf(it) { return it.type + "|" + (it.q || it.prompt || it.audio || (it.pairs && it.pairs.map(function (p) { return p[0]; }).join(",")) || ""); }
  function fresh(list, sigFn, last) {
    var a = shuffle(list), seen = a.filter(function (x) { return last[sigFn(x)]; }), nw = a.filter(function (x) { return !last[sigFn(x)]; });
    return nw.concat(seen);
  }
  function pickType(weights) {
    var tot = 0, k; for (k in weights) tot += weights[k];
    var r = Math.random() * tot; for (k in weights) { r -= weights[k]; if (r < 0) return k; }
    return k;
  }
  IT.buildLesson = function (lesson, preview) {
    var L = lesson, items = [], ex = L.examples, words = L.words;
    var hist = S.state.lessonHist = S.state.lessonHist || {}, last = {};
    (hist[L.id] || []).forEach(function (k) { last[k] = 1; });
    var allEx = IT.allLessons.reduce(function (acc, l) { return acc.concat(l.examples); }, []);
    var otherEx = function (e) { var own = ex.filter(function (o) { return o !== e; }); return own.length >= 3 ? own : own.concat(sample(allEx.filter(function (o) { return o !== e; }), 4)); };
    var wKey = function (w) { return "w|" + w.key; }, eKey = function (e) { return "e|" + e.it; };
    var wS = fresh(words, wKey, last), exS = fresh(ex, eKey, last);
    var customs = (L.q || []).map(function (q) { return MK.custom(q, L); }).filter(Boolean);
    var cf = fresh(customs.filter(function (c) { return c.type === "choice" && !c.situation || c.type === "fill"; }), sigOf, last);
    var life = fresh(customs.filter(function (c) { return c.type === "dlg" || c.situation; }), sigOf, last);
    var fixes = fresh(customs.filter(function (c) { return c.type === "fix"; }), sigOf, last);
    var used = [];

    // 1. Разминка: сопоставление случайных слов или пара быстрых вопросов + слушание
    var warm = [], wi = 0;
    if (wS.length >= 4 && Math.random() < 0.75) {
      var mn = Math.min(wS.length, 4 + Math.floor(Math.random() * 2));
      warm.push(MK.match(shuffle(wS.slice(0, mn)), L)); wi = mn;
    }
    var exI = 0;
    var exTask = function (e, kind) {
      used.push(eKey(e));
      var o = otherEx(e), short = e.it.split(" ").length <= 8;
      if (kind === "listen") return MK.listen(e, L, o);
      if (kind === "build") return short ? MK.build(e, L, o) : MK.trchoice(e, L, o);
      if (kind === "trchoice") return MK.trchoice(e, L, o);
      if (kind === "dictation") return e.it.split(" ").length <= 6 ? MK.dictation(e, L) : MK.listen(e, L, o);
      return MK.trans(e, L);
    };
    if (exS[exI]) warm.push(exTask(exS[exI++], pickType({ listen: 3, trchoice: 2 })));
    items = items.concat(stage(warm, "warm"));

    // 2. Практика: авторские вопросы (случайная часть) + слова и примеры со случайным типом задания
    var nCf = Math.min(cf.length, Math.max(3, Math.round(cf.length * (0.45 + Math.random() * 0.2))));
    var prac = cf.slice(0, nCf), reserved = cf.slice(nCf, nCf + 1);
    var wordTasks = [], spellDone = false, nW = Math.min(wS.length - wi, 3 + (Math.random() < 0.3 ? 1 : 0));
    for (var k = 0; k < nW; k++) {
      var w = wS[wi++]; if (!w) break; used.push(wKey(w));
      var kind = !spellDone && k === nW - 1 ? "spell" : pickType({ pickIt: 3, pickRu: 2, spell: 3, type: 2 });
      if (kind === "spell") spellDone = true;
      wordTasks.push(kind === "pickIt" ? MK.pick(w, L, "ru-it") : kind === "pickRu" ? MK.pick(w, L, "it-ru") : kind === "spell" ? MK.spell(w, L) : MK.type(w, L));
    }
    var exTasks = [];
    for (var j = 0; j < 2 && exS[exI]; j++) exTasks.push(exTask(exS[exI++], pickType({ build: 4, trchoice: 2, dictation: 1, listen: 1 })));
    prac = shuffle(prac.concat(wordTasks, exTasks));
    items = items.concat(stage(prac, "practice"));

    // 3. В жизни: диалоги и ситуации (до двух)
    items = items.concat(stage(life.slice(0, 2), "life"));

    // 4. Повторение прошлого
    var rev = [], prev = prevLessons(L);
    if (prev.length) {
      var pl = sample(prev, 2);
      pl.forEach(function (p, i) {
        if (i === 0 && p.examples.length) { var e = sample(shortEx(p.examples), 1)[0] || p.examples[0]; rev.push(Math.random() < 0.6 ? MK.build(e, p, p.examples.filter(function (o) { return o !== e; })) : MK.trchoice(e, p, p.examples.filter(function (o) { return o !== e; }))); }
        else if (p.words.length) { var pw = sample(p.words, 1)[0]; var r = Math.random(); rev.push(r < 0.35 ? MK.spell(pw, p) : MK.pick(pw, p, r < 0.7 ? "ru-it" : "it-ru")); }
      });
      var due = IT.srs.due().filter(function (k) { return IT.vocab[k] && IT.vocab[k].lesson !== L.id; });
      sample(due, 2).forEach(function (k) { var w = IT.vocab[k]; rev.push(MK.pick(w, IT.lessonById[w.lesson], Math.random() < 0.5 ? "it-ru" : "ru-it")); });
    }
    items = items.concat(stage(rev, "review"));

    // 5. Проверка усвоения: перевод двух ещё не использованных (по возможности) примеров
    var chk = [], rest = exS.slice(exI).concat(exS.slice(0, exI));
    shortEx(rest, 7).slice(0, 2).forEach(function (e) { used.push(eKey(e)); chk.push(MK.trans(e, L)); });
    chk = chk.concat(fixes.slice(0, 1), reserved);
    items = items.concat(stage(shuffle(chk), "check"));

    // запоминаем, что было в этой попытке
    if (!preview) hist[L.id] = used.concat(items.filter(function (it) { return it.type === "choice" || it.type === "fill" || it.type === "fix" || it.type === "dlg"; }).map(sigOf));
    return items;
  };

  /* Контрольная блока: только серьёзные задания, порог 75% */
  IT.buildUnitTest = function (unit) {
    var ls = unit.lessons, items = [];
    var allEx = [], customs = [];
    ls.forEach(function (l) {
      l.examples.forEach(function (e) { allEx.push({ e: e, l: l }); });
      (l.q || []).forEach(function (q) { var c = MK.custom(q, l); if (c && c.type !== "dlg") customs.push(c); });
    });
    var cx = shuffle(customs).slice(0, 6);
    var ex = shuffle(allEx);
    var pick = function (i) { return ex[i % ex.length]; };
    var others = function (x) { return allEx.filter(function (o) { return o !== x; }).map(function (o) { return o.e; }); };
    items = items.concat(cx);
    [0, 1, 2].forEach(function (i) { var x = pick(i); items.push(MK.trans(x.e, x.l)); });
    [3, 4].forEach(function (i) { var x = pick(i); items.push(MK.build(x.e, x.l, others(x))); });
    var d = pick(5); items.push(MK.dictation(d.e, d.l));
    items = shuffle(items);
    items.forEach(function (it) { it.stage = "test"; });
    return items;
  };

  function doneLessons() { return IT.allLessons.filter(function (l) { return IT.prog.lessonDone(l.id); }); }
  function poolLessons() { var d = doneLessons(); return d.length ? d : IT.allLessons.slice(0, 2); }

  /* Тренировка аудирования: диктант и выбор услышанного */
  IT.buildListening = function (n) {
    var ls = poolLessons(), allEx = [];
    ls.forEach(function (l) { l.examples.forEach(function (e) { allEx.push({ e: e, l: l }); }); });
    var pickEx = sample(allEx, n || 8);
    return pickEx.map(function (x, i) {
      var it = i % 3 === 2 ? MK.listen(x.e, x.l, allEx.filter(function (o) { return o !== x; }).map(function (o) { return o.e; })) : MK.dictation(x.e, x.l);
      it.stage = "listen"; return it;
    });
  };

  /* Смешанная тренировка по пройденному */
  IT.buildMixed = function (n) {
    var ls = poolLessons(), items = [];
    for (var i = 0; i < (n || 10); i++) {
      var l = ls[Math.floor(Math.random() * ls.length)], r = Math.random();
      var e = sample(l.examples, 1)[0], w = sample(l.words, 1)[0];
      var others = l.examples.filter(function (o) { return o !== e; });
      var item;
      if (r < .3 && l.q && l.q.length) item = MK.custom(sample(l.q, 1)[0], l);
      else if (r < .45 && w) item = MK.type(w, l);
      else if (r < .6 && e) item = MK.build(e, l, others);
      else if (r < .75 && e) item = MK.trans(e, l);
      else if (r < .87 && w) item = MK.pick(w, l, Math.random() < .5 ? "it-ru" : "ru-it");
      else if (e) item = MK.trchoice(e, l, others);
      if (item) { item.stage = "mixed"; items.push(item); }
    }
    return items;
  };

  /* Тренировка слабых тем */
  IT.buildWeak = function (tag) {
    var ls = poolLessons().filter(function (l) { return (l.tags || []).indexOf(tag) >= 0; });
    if (!ls.length) ls = IT.allLessons.filter(function (l) { return (l.tags || []).indexOf(tag) >= 0; }).slice(0, 2);
    var items = [];
    ls.forEach(function (l) { (l.q || []).forEach(function (q) { var c = MK.custom(q, l); if (c) items.push(c); }); });
    items = sample(items, 8);
    ls.slice(0, 2).forEach(function (l) { var e = sample(l.examples, 1)[0]; if (e) items.push(MK.trans(e, l)); });
    items.forEach(function (i) { i.stage = "weak"; });
    return shuffle(items);
  };

  /* Задания, созданные ИИ-преподавателем */
  IT.fromAI = function (arr) {
    var out = [];
    (arr || []).forEach(function (x) {
      if (!x || typeof x !== "object") return;
      var why = String(x.why || x.explanation || "");
      if (x.type === "choice" && Array.isArray(x.options) && x.options.length >= 2) {
        var idx = typeof x.answer === "number" ? x.answer : x.options.indexOf(x.answer);
        if (idx < 0 || idx >= x.options.length) return;
        out.push({ type: "choice", q: String(x.q || x.question || ""), options: shuffle(x.options.map(String)), answer: String(x.options[idx]), why: why, tags: ["ai"], stage: "ai" });
      } else if ((x.type === "fill" || x.type === "translate" || x.type === "fix") && x.answer) {
        var answers = Array.isArray(x.answer) ? x.answer.map(String) : String(x.answer).split("/");
        out.push({ type: x.type === "translate" ? "trans" : x.type, q: String(x.q || x.question || ""), prompt: String(x.q || x.question || ""), answers: answers, why: why, hint: String(x.hint || ""), tags: ["ai"], stage: "ai", gloss: [] });
      }
    });
    return out;
  };
})(window.IT);
