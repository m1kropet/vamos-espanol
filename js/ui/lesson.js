/* Плеер уроков: теория по шагам → упражнения с разбором → итоги. Используется уроками, контрольными и тренировками */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };
  var overlay = function () { return IT.$("#overlay"); };

  function openOverlay(html) {
    var o = overlay(); o.innerHTML = html; o.classList.add("show"); document.body.classList.add("no-scroll");
    return o;
  }
  function closeOverlay() {
    var o = overlay(); o.classList.remove("show"); document.body.classList.remove("no-scroll");
    IT.activeActivity = null; IT.speedOverride = null; IT.audio.stop(); document.onkeydown = null;
    setTimeout(function () { if (!o.classList.contains("show")) o.innerHTML = ""; }, 250);
    IT.render();
  }
  IT.openOverlay = openOverlay; IT.closeOverlay = closeOverlay;

  var STAGES = { warm: "stWarm", practice: "stPractice", life: "stLife", review: "stReview", check: "stCheck", retry: "stRetry", test: "stTest", listen: "stListen", mixed: "stMixed", weak: "stWeak", mistakes: "stMistakes", ai: "stAI" };
  var PRAISE = ["¡Muy bien!", "¡Perfecto!", "¡Excelente!", "¡Correcto!", "¡Genial!", "¡Eso es!"];

  /* ======================= Теория ======================= */
  function theoryPages(l) {
    var pages = l.th.map(function (s) { return { h: s.h, html: IT.md(s.b) }; });
    pages.push({ h: t("examplesTitle"), html: '<p class="muted">' + t("examplesHint") + "</p>" + l.examples.map(function (e) {
      return '<div class="ex-card"><div class="row gap"><div class="grow"><div class="ex-it">' + esc(e.it) + '</div><div class="ex-ru">' + esc(e.ru) + "</div></div>" + IT.sp(e.it) + '<button class="spk" data-say="' + esc(e.it) + '" data-slow aria-label="Медленно">' + IT.icon("turtle") + "</button></div>" + IT.glossHtml(e.gloss) + (e.note ? '<div class="tip sm">' + IT.icon("bulb") + "<div>" + esc(e.note) + "</div></div>" : "") + "</div>";
    }).join("") });
    if (l.warn && l.warn.length) pages.push({ h: t("mistakesTitle"), html: '<p class="muted">' + t("mistakesHint") + "</p>" + l.warn.map(function (w) {
      return '<div class="warn-card"><div class="w-bad">' + IT.icon("close") + " " + esc(w[0]) + '</div><div class="w-good">' + IT.icon("check") + " " + esc(w[1]) + '</div><p class="sm">' + esc(w[2]) + "</p></div>";
    }).join("") });
    pages.push({ h: t("wordsTitle"), html: '<div class="word-list">' + l.words.map(function (w) {
      return '<div class="wrow"><button class="spk" data-say="' + esc(w.it) + '">' + IT.icon("speaker") + '</button><div class="grow"><b>' + esc(w.it) + '</b> <span class="pron">[' + esc(w.pron) + ']</span><div class="sm muted">' + esc(w.ru) + '</div></div><span class="tag">' + esc(IT.posLabel(w.pos)) + (w.gender ? " · " + (w.gender === "m" ? "м.р." : "ж.р.") : "") + "</span></div>";
    }).join("") + "</div>" });
    return pages;
  }

  IT.player = {};
  IT.player.showTheory = function (l, readOnly, then) {
    var pages = theoryPages(l), i = 0;
    IT.activeActivity = "theory";
    var o = openOverlay('<div class="player theory"><header class="pl-top"><button class="icon-btn" data-x aria-label="Закрыть">' + IT.icon("close") + '</button><div class="dots"></div>' + (readOnly ? "" : '<button class="link" data-skip>' + t("skipToPractice") + "</button>") + '</header><div class="pl-body"><div class="th-page"></div></div><footer class="pl-foot"><button class="btn ghost" data-prev>' + IT.icon("back") + " " + t("back") + '</button><button class="btn ghost hide-sm" data-ask>' + IT.icon("tutor") + " " + t("askTutor") + '</button><button class="btn primary" data-nextp></button></footer></div>');
    function draw() {
      var p = pages[i];
      o.querySelector(".dots").innerHTML = pages.map(function (_, k) { return '<i class="' + (k < i ? "done" : k === i ? "on" : "") + '"></i>'; }).join("");
      var pg = o.querySelector(".th-page");
      pg.innerHTML = (i === 0 ? '<div class="th-intro"><span class="eyebrow">' + esc(l.unit.city) + " · " + esc(IT.tt(l.unit)) + "</span><h1>" + esc(IT.tt(l)) + '</h1><p class="goal">' + IT.icon("target") + " " + esc(l.goal) + "</p></div>" : "") +
        '<article class="th-card"><h2>' + esc(p.h) + "</h2>" + p.html + "</article>";
      pg.classList.remove("in"); void pg.offsetWidth; pg.classList.add("in");
      o.querySelector(".pl-body").scrollTop = 0;
      o.querySelector("[data-prev]").style.visibility = i ? "visible" : "hidden";
      var last = i === pages.length - 1;
      o.querySelector("[data-nextp]").innerHTML = last ? (readOnly ? t("close") : IT.icon("play") + " " + t("startPractice")) : t("gotIt") + " " + IT.icon("chevron");
    }
    o.querySelector("[data-x]").onclick = closeOverlay;
    o.querySelector("[data-prev]").onclick = function () { if (i > 0) { i--; draw(); } };
    o.querySelector("[data-nextp]").onclick = function () {
      if (i < pages.length - 1) { i++; draw(); } else if (readOnly) closeOverlay(); else then();
    };
    o.querySelector("[data-ask]").onclick = function () { closeOverlay(); IT.tutorAsk("Объясни подробнее тему «" + l.t + "» простыми словами, с примерами."); };
    var sk = o.querySelector("[data-skip]"); if (sk) sk.onclick = function () { then(); };
    document.onkeydown = function (e) { if (e.key === "Enter" || e.key === "ArrowRight") o.querySelector("[data-nextp]").click(); if (e.key === "ArrowLeft") o.querySelector("[data-prev]").click(); };
    draw();
  };

  IT.player.startLesson = function (l) {
    IT.player.showTheory(l, false, function () {
      IT.player.run({ kind: "lesson", lesson: l, title: IT.tt(l), items: IT.buildLesson(l) });
    });
  };
  IT.player.startTest = function (u) {
    IT.player.run({ kind: "test", unit: u, title: t("unitTest") + ": " + IT.tt(u), items: IT.buildUnitTest(u) });
  };
  IT.player.resume = function () {
    var r = S.state.resume; if (!r) return;
    var l = IT.lessonById[r.id]; if (!l) { S.state.resume = null; return IT.render(); }
    IT.player.run({ kind: "lesson", lesson: l, title: IT.tt(l), items: r.items, idx: r.idx, stats: r.stats });
  };

  /* ======================= Упражнения ======================= */
  IT.player.run = function (cfg) {
    var items = cfg.items, idx = cfg.idx || 0;
    var stats = cfg.stats || { ok: 0, tot: 0, combo: 0, max: 0, start: Date.now(), wrong: [] };
    if (!items.length) { IT.toast(t("nothingToPractice"), "warn"); return; }
    IT.activeActivity = cfg.kind;
    var o = openOverlay('<div class="player"><header class="pl-top"><button class="icon-btn" data-x aria-label="Закрыть">' + IT.icon("close") + '</button><div class="pl-bar"><i></i></div><span class="combo"></span></header><div class="pl-body"><div class="ex"></div></div><footer class="pl-foot"><button class="btn ghost" data-skip>' + t("cantNow") + '</button><button class="btn primary" data-check disabled>' + t("check") + '</button></footer><div class="pl-fb"></div></div>');
    var exEl = o.querySelector(".ex"), checkBtn = o.querySelector("[data-check]"), fb = o.querySelector(".pl-fb"), skipBtn = o.querySelector("[data-skip]");
    var cur = null, phase = "answer";

    o.querySelector("[data-x]").onclick = function () {
      if (cfg.kind === "lesson") { saveResume(); IT.toast(t("progressSaved"), "ok"); }
      S.save(); closeOverlay();
    };
    function saveResume() {
      if (cfg.kind !== "lesson") return;
      S.state.resume = { kind: "lesson", id: cfg.lesson.id, items: items, idx: idx, stats: stats };
      S.save();
    }
    function bar() {
      o.querySelector(".pl-bar i").style.width = Math.round(idx / items.length * 100) + "%";
      var c = o.querySelector(".combo");
      c.innerHTML = stats.combo >= 3 ? IT.icon("flame") + stats.combo : "";
      c.classList.toggle("on", stats.combo >= 3);
    }

    function show() {
      if (idx >= items.length) return finish();
      phase = "answer"; fb.className = "pl-fb"; fb.innerHTML = "";
      var item = items[idx];
      checkBtn.disabled = true; checkBtn.textContent = t("check"); checkBtn.className = "btn primary";
      skipBtn.style.visibility = item.type === "match" ? "hidden" : "visible";
      cur = R[item.type](item, function (ready) { checkBtn.disabled = !ready; }, function () { evaluate(); });
      var st = item.retry ? "retry" : item.stage;
      exEl.innerHTML = "";
      exEl.appendChild(IT.h('<div class="stage-chip st-' + (st || "x") + '">' + t(STAGES[st] || "stPractice") + "</div>"));
      exEl.appendChild(cur.el);
      exEl.classList.remove("in"); void exEl.offsetWidth; exEl.classList.add("in");
      o.querySelector(".pl-body").scrollTop = 0;
      bar();
      if (cur.focus) setTimeout(cur.focus, 60);
      if (item.audio && S.state.profile.autoplay && (item.type === "listen" || item.type === "dictation" || (item.type === "pick" && item.dir === "it-ru"))) setTimeout(function () { IT.audio.speak(item.audio); }, 250);
    }

    function evaluate(forceWrong) {
      if (phase !== "answer") return next();
      var item = items[idx], res;
      if (forceWrong) res = { ok: false, kind: "skip", user: "", best: correctText(item) };
      else res = cur.evaluate();
      phase = "feedback";
      record(item, res);
      feedback(item, res);
    }
    checkBtn.onclick = function () { if (phase === "answer") evaluate(); else next(); };
    skipBtn.onclick = function () { if (phase === "answer") evaluate(true); };
    document.onkeydown = function (e) {
      if (e.key === "Enter" && !e.shiftKey) {
        if (phase === "feedback") { e.preventDefault(); next(); }
        else if (!checkBtn.disabled && !(document.activeElement && document.activeElement.tagName === "BUTTON" && document.activeElement !== checkBtn)) { e.preventDefault(); evaluate(); }
      } else if (phase === "answer" && /^[1-6]$/.test(e.key) && cur && cur.pickKey && !(document.activeElement && document.activeElement.tagName === "INPUT")) cur.pickKey(+e.key - 1);
    };

    function record(item, res) {
      var first = !item.retry, log = IT.dayLog();
      if (first) {
        stats.tot++; log.tot++;
        if (res.ok) { stats.ok++; log.ok++; }
        IT.recordTag(item.tags, res.ok);
      }
      if (res.ok) {
        stats.combo++; stats.max = Math.max(stats.max, stats.combo);
        S.state.cnt.combo = Math.max(S.state.cnt.combo, stats.combo);
        IT.questProgress("combo", stats.combo, true);
        IT.audio.sfx("ok");
      } else { stats.combo = 0; IT.audio.sfx("bad"); }
      (item.words || []).forEach(function (k) { IT.srs.soft(k, res.ok); });
      if (item.type === "listen" || item.type === "dictation") { S.state.cnt.listen++; IT.questProgress("listen", 1); }
      var sig = item.type + "|" + (item.q || item.prompt || item.audio || (item.pairs && item.pairs[0][0]) || "");
      if (!res.ok) {
        if (first) stats.wrong.push({ q: questionText(item), a: res.best || correctText(item), u: res.user || "" });
        if (cfg.kind === "lesson" && !item.retry) { var copy = JSON.parse(JSON.stringify(item)); copy.retry = true; items.push(copy); }
        if (!S.state.mistakes.some(function (m) { return m.sig === sig; }) && item.type !== "match") {
          var mi = JSON.parse(JSON.stringify(item)); delete mi.retry; mi.sig = sig; mi.stage = "mistakes"; mi.at = Date.now(); S.state.mistakes.push(mi);
        }
      } else if (cfg.kind === "mistakes") {
        S.state.mistakes = S.state.mistakes.filter(function (m) { return m.sig !== sig; });
      }
      bar();
    }

    function feedback(item, res) {
      cur.lock && cur.lock(res);
      var ok = res.ok, h = "";
      var title = ok ? PRAISE[Math.floor(Math.random() * PRAISE.length)] : (res.kind === "skip" ? t("fbSkipped") : t("fbWrong"));
      h += '<div class="fb-head">' + IT.icon(ok ? "check" : "close") + "<b>" + title + "</b>" + (ok && stats.combo >= 3 ? '<span class="chip flame sm">' + IT.icon("flame") + stats.combo + "</span>" : "") + "</div>";
      if (ok && res.kind === "accent") h += '<p class="fb-note">' + IT.icon("bulb") + " " + t("fbAccent") + " <b>" + esc(res.best) + "</b></p>";
      if (ok && res.kind === "typo") h += '<p class="fb-note">' + IT.icon("bulb") + " " + t("fbTypo") + " <b>" + esc(res.word || res.best) + "</b></p>";
      if (ok && item.type === "match" && res.mist) h += '<p class="fb-note">' + t("fbMatchMist").replace("{n}", res.mist) + "</p>";
      var correct = res.best || correctText(item);
      if (!ok || item.type === "build" || item.type === "trans" || item.type === "dictation" || item.type === "fix") {
        if (correct && item.type !== "match") h += '<div class="fb-ans"><span class="lbl">' + (ok ? t("fbAnswer") : t("fbCorrect")) + '</span><div class="row gap"><span class="ans-txt">' + esc(correct) + "</span>" + (isSpanish(item) ? IT.sp(correct) : "") + "</div></div>";
      }
      if (!ok && res.user && typeof res.user === "string" && (item.type === "trans" || item.type === "build" || item.type === "fix" || item.type === "dictation" || item.type === "type" || item.type === "fill")) {
        var d = IT.diffWords(res.user, correct);
        h += '<div class="fb-diff"><span class="lbl">' + t("fbYours") + '</span><div class="diff">' + d.user.map(function (w) { return '<span class="dw ' + w[1] + '">' + esc(w[0]) + "</span>"; }).join(" ") + "</div>" +
          (d.correct.some(function (w) { return w[1] === "miss"; }) ? '<div class="diff-miss sm">' + t("fbMissing") + " " + d.correct.filter(function (w) { return w[1] === "miss"; }).map(function (w) { return "<b>" + esc(w[0]) + "</b>"; }).join(", ") + "</div>" : "") + "</div>";
      } else if (!ok && res.user && (item.type === "choice" || item.type === "pick" || item.type === "trchoice" || item.type === "listen" || item.type === "dlg")) {
        h += '<p class="fb-note">' + t("fbYouChose") + " «" + esc(res.user.replace(/[.!?]$/, "")) + "». " + choiceHint(item, res.user) + "</p>";
      }
      if (item.ru && (item.type === "listen" || item.type === "dictation")) h += '<p class="fb-tr">' + IT.icon("globe") + " " + esc(item.ru) + "</p>";
      if (item.why) h += '<div class="fb-why"><span class="lbl">' + t("fbWhy") + "</span><p>" + esc(item.why) + "</p></div>";
      if (item.ex && item.ex[0]) h += '<div class="fb-ex">' + IT.sp(item.ex[0]) + "<div><i>" + esc(item.ex[0]) + "</i><br><span class=\"muted sm\">" + esc(item.ex[1]) + "</span></div></div>";
      if (item.gloss && item.gloss.length) h += '<div class="fb-gloss"><span class="lbl">' + t("fbGloss") + "</span>" + IT.glossHtml(item.gloss) + "</div>";
      if (item.note) h += '<p class="fb-note">' + IT.icon("bulb") + " " + esc(item.note) + "</p>";
      if (!ok && !item.retry && cfg.kind === "lesson") h += '<p class="muted xs">' + t("fbWillRepeat") + "</p>";
      fb.innerHTML = '<div class="fb-in">' + h + "</div>";
      fb.className = "pl-fb show " + (ok ? "ok" : "bad");
      checkBtn.disabled = false; checkBtn.textContent = t("next"); checkBtn.className = "btn " + (ok ? "success" : "danger");
      skipBtn.style.visibility = "hidden";
      if (!ok && isSpanish(item) && correct && S.state.profile.autoplay) setTimeout(function () { IT.audio.speak(correct); }, 300);
      checkBtn.focus();
    }
    function next() { idx++; saveResume(); show(); }

    function finish() {
      IT.activeActivity = null;
      var st = S.state, acc = stats.tot ? Math.round(stats.ok / stats.tot * 100) : 100, perfect = stats.ok === stats.tot && stats.tot > 0;
      var secs = Math.round((Date.now() - stats.start) / 1000), xp = 0, extra = "", newWords = [];
      var PASS = IT.PASS_PCT, lessonFailed = false;
      if (cfg.kind === "lesson") {
        // Урок засчитывается (и открывает следующий) только при точности от 80%.
        // Пропуски «Не могу сейчас» считаются ошибками, повторы ошибок в точность не входят.
        var l = cfg.lesson, rec = st.lessons[l.id] || {}, passedL = acc >= PASS, first = !rec.done && passedL;
        lessonFailed = !passedL && !rec.done;
        xp = passedL ? 10 + stats.ok + (perfect ? 10 : 0) + (first ? 5 : 0) : Math.ceil(stats.ok / 2);
        st.lessons[l.id] = { done: rec.done || passedL ? 1 : 0, best: Math.max(rec.best || 0, acc), count: (rec.count || 0) + 1, last: Date.now() };
        if (passedL) {
          l.words.forEach(function (w) { if (!st.words[w.key]) newWords.push(w); IT.srs.ensure(w.key, l.id); });
          st.cnt.lessons++; IT.dayLog().les++; IT.questProgress("lesson", 1);
          if (perfect) { st.cnt.perfect++; IT.questProgress("perfect", 1); }
        }
        st.resume = null;
        if (lessonFailed) extra = '<p class="tip">' + IT.icon("lock") + "<span>" + t("lessonFailed").replace("{p}", PASS).replace("{a}", acc) + "</span></p>";
        else if (!passedL) extra = '<p class="tip">' + IT.icon("bulb") + "<span>" + t("lowAccHint").replace("{p}", PASS) + "</span></p>";
      } else if (cfg.kind === "test") {
        var u = cfg.unit, passed = acc >= PASS, tr = st.tests[u.id] || {};
        st.tests[u.id] = { passed: tr.passed || passed, best: Math.max(tr.best || 0, acc) };
        xp = passed ? 15 + stats.ok + 30 : Math.ceil(stats.ok / 2);
        if (passed) { st.unlocked = Math.max(st.unlocked, u.index + 1); st.cnt.tests++; }
        extra = passed ? '<p class="tip ok">' + IT.icon("trophy") + "<span>" + t("testPassed") + "</span></p>" : '<p class="tip">' + IT.icon("bulb") + "<span>" + t("testFailed").replace("{p}", PASS).replace("{a}", acc) + "</span></p>";
      } else {
        xp = stats.ok + (perfect && stats.tot >= 5 ? 5 : 0);
      }
      IT.addXp(xp, cfg.kind);
      var achs = IT.checkAch();
      S.save();
      var failed = lessonFailed || (cfg.kind === "test" && acc < PASS);
      if (acc >= PASS) { IT.confetti(); IT.audio.sfx("win"); }
      var head = acc === 100 ? "¡Perfecto!" : acc >= 90 ? "¡Fantástico!" : acc >= PASS ? "¡Bien!" : "¡Casi!";
      var html = '<div class="result"><div class="res-hero">' + IT.bunting(12) + IT.mascot(acc >= PASS ? "cheer" : "sad", 120) + '</div><h1>' + head + '</h1><p class="muted">' + esc(cfg.title || "") + "</p>" +
        '<div class="res-tiles"><div class="tile xp">' + IT.icon("bolt") + "<b>+" + xp + "</b><span>XP</span></div><div class=\"tile\">" + IT.icon("target") + "<b>" + acc + "%</b><span>" + t("accuracy") + '</span></div><div class="tile">' + IT.icon("clock") + "<b>" + fmtTime(secs) + "</b><span>" + t("time") + '</span></div><div class="tile">' + IT.icon("flame") + "<b>" + stats.max + "</b><span>" + t("bestCombo") + "</span></div></div>" + extra +
        (perfect && cfg.kind === "lesson" ? '<p class="chip gold">' + IT.icon("sparkles") + " " + t("perfectBonus") + "</p>" : "") +
        (newWords.length ? '<div class="res-sec"><h4>' + t("wordsAdded") + " (" + newWords.length + ')</h4><div class="chips">' + newWords.map(function (w) { return '<button class="chip soft" data-say="' + esc(w.it) + '">' + esc(w.it) + " — " + esc(w.ru) + "</button>"; }).join("") + "</div></div>" : "") +
        (stats.wrong.length ? '<div class="res-sec"><h4>' + t("reviewMistakes") + '</h4><div class="mist-list">' + stats.wrong.map(function (w) { return '<div class="mist"><div class="sm muted">' + esc(w.q) + "</div><div>" + (w.u ? '<s class="bad-t">' + esc(w.u) + "</s> → " : "") + "<b>" + esc(w.a) + "</b></div></div>"; }).join("") + "</div></div>" : "") +
        (achs.length ? '<div class="res-sec"><h4>' + t("newAch") + '</h4><div class="chips">' + achs.map(function (a) { return '<span class="chip gold">' + a.i + " " + esc(IT.tt(a)) + "</span>"; }).join("") + "</div></div>" : "") +
        (failed
          ? '<div class="row gap center wrap mt"><button class="btn ghost" data-done>' + t("later") + '</button><button class="btn primary big" data-again>' + IT.icon("refresh") + " " + t("tryAgainLesson") + "</button></div></div>"
          : '<div class="row gap center wrap mt"><button class="btn ghost" data-again>' + IT.icon("refresh") + " " + t("again") + '</button><button class="btn primary big" data-done>' + t("continue") + " " + IT.icon("chevron") + "</button></div></div>");
      o.querySelector(".pl-body").innerHTML = html;
      o.querySelector(".pl-foot").style.display = "none"; fb.className = "pl-fb";
      o.querySelector(".pl-bar i").style.width = "100%";
      o.querySelector("[data-done]").onclick = function () { closeOverlay(); if (cfg.onDone) cfg.onDone(); };
      o.querySelector("[data-again]").onclick = function () {
        if (cfg.kind === "lesson") IT.player.run({ kind: "lesson", lesson: cfg.lesson, title: cfg.title, items: IT.buildLesson(cfg.lesson) });
        else if (cfg.kind === "test") IT.player.startTest(cfg.unit);
        else if (cfg.rebuild) IT.player.run(Object.assign({}, cfg, { items: cfg.rebuild(), idx: 0, stats: null }));
        else closeOverlay();
      };
      document.onkeydown = function (e) { if (e.key === "Enter") o.querySelector(failed ? "[data-again]" : "[data-done]").click(); };
    }
    show();
  };

  function fmtTime(s) { var m = Math.floor(s / 60); return m + ":" + String(s % 60).padStart(2, "0"); }
  function isSpanish(item) { return ["build", "trans", "dictation", "fix", "type", "listen", "fill"].indexOf(item.type) >= 0 || (item.type === "pick" && item.dir === "ru-it"); }
  function correctText(item) {
    if (item.answer) return item.answer;
    if (item.answers) return item.answers[0];
    return "";
  }
  function questionText(item) {
    if (item.type === "match") return t("qMatch");
    if (item.type === "listen" || item.type === "dictation") return "🎧 " + (item.ru || "");
    if (item.type === "dlg") return item.lines.map(function (l) { return l[0] + ": " + l[1]; }).join(" / ");
    return item.q || item.prompt || "";
  }
  function choiceHint(item, chosen) {
    if (item.type === "pick") {
      var w = Object.keys(IT.vocab).map(function (k) { return IT.vocab[k]; }).find(function (v) { return v.ru === chosen || v.it === chosen; });
      if (w) return t("fbThatMeans") + " «" + esc(item.dir === "it-ru" ? w.it : w.ru) + "».";
      if (item.spell) return t("fbMisspelled");
    }
    return "";
  }

  /* ======================= Рендереры заданий ======================= */
  function optionsBlock(opts, onPick, cls) {
    return '<div class="opts ' + (cls || "") + '">' + opts.map(function (o, i) { return '<button class="opt" data-i="' + i + '"><span class="k">' + (i + 1) + "</span><span>" + esc(o) + "</span></button>"; }).join("") + "</div>";
  }
  function makeChoice(el, item, opts, ready, cls) {
    var sel = null;
    var api = {
      el: el,
      pickKey: function (i) { var b = el.querySelectorAll(".opt")[i]; if (b) b.click(); },
      evaluate: function () { return { ok: sel === item.answer, kind: sel === item.answer ? "exact" : "wrong", user: sel, best: item.answer }; },
      lock: function (res) {
        el.querySelectorAll(".opt").forEach(function (b) {
          var v = opts[+b.getAttribute("data-i")]; b.disabled = true;
          if (v === item.answer) b.classList.add("right"); else if (v === sel) b.classList.add("wrong");
        });
      }
    };
    el.addEventListener("click", function (e) {
      var b = e.target.closest(".opt"); if (!b || b.disabled) return;
      el.querySelectorAll(".opt").forEach(function (x) { x.classList.remove("sel"); });
      b.classList.add("sel"); sel = opts[+b.getAttribute("data-i")]; ready(true);
      if (cls === "it-opts") IT.audio.speak(sel);
    });
    return api;
  }
  function specialKeys() { return '<div class="keys">' + ["á", "é", "í", "ó", "ú", "ñ", "ü", "¿", "¡"].map(function (c) { return '<button class="key" data-key="' + c + '" tabindex="-1">' + c + "</button>"; }).join("") + "</div>"; }
  function makeInput(el, item, ready, answers, prefill) {
    var inp = el.querySelector("textarea, input");
    if (prefill) inp.value = prefill;
    inp.addEventListener("input", function () { ready(inp.value.trim().length > 0 && (!prefill || inp.value.trim() !== prefill.trim() || true)); });
    inp.addEventListener("keydown", function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); if (inp.value.trim()) el.dispatchEvent(new CustomEvent("submit-ans")); } });
    el.querySelectorAll("[data-key]").forEach(function (k) {
      k.onmousedown = function (e) { e.preventDefault(); };
      k.onclick = function () {
        var s = inp.selectionStart || inp.value.length, en = inp.selectionEnd || s;
        inp.value = inp.value.slice(0, s) + k.getAttribute("data-key") + inp.value.slice(en);
        inp.selectionStart = inp.selectionEnd = s + 1; inp.focus(); ready(true);
      };
    });
    if (prefill) ready(true);
    return {
      el: el, focus: function () { inp.focus(); if (prefill) inp.setSelectionRange(inp.value.length, inp.value.length); },
      evaluate: function () { var r = IT.check(inp.value, answers); r.user = inp.value.trim(); return r; },
      lock: function (res) { inp.disabled = true; inp.classList.add(res.ok ? "right" : "wrong"); }
    };
  }

  var R = {
    pick: function (item, ready) {
      var el = IT.h('<div><h2 class="ex-q">' + (item.spell ? t("qSpell") : item.dir === "it-ru" ? t("qPickRu") : t("qPickIt")) + '</h2><div class="prompt-word">' + (item.audio ? IT.sp(item.audio, "big") : "") + "<div><b>" + esc(item.prompt) + "</b>" + (item.sub ? '<div class="pron">[' + esc(item.sub) + "]</div>" : "") + "</div></div>" + optionsBlock(item.options, null, item.dir === "ru-it" ? "it-opts" : "") + "</div>");
      return makeChoice(el, item, item.options, ready, item.dir === "ru-it" ? "it-opts" : "");
    },
    choice: function (item, ready) {
      var el = IT.h('<div>' + (item.situation ? '<div class="situ">' + IT.icon("globe") + "<span>" + t("qSituation") + "</span></div>" : "") + '<h2 class="ex-q">' + fmtBlank(item.q) + "</h2>" + optionsBlock(item.options) + "</div>");
      return makeChoice(el, item, item.options, ready);
    },
    trchoice: function (item, ready) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qTrChoice") + '</h2><div class="bubble-it">' + IT.sp(item.audio) + "<span>" + esc(item.prompt) + "</span></div>" + optionsBlock(item.options) + "</div>");
      return makeChoice(el, item, item.options, ready);
    },
    listen: function (item, ready) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qListen") + '</h2><div class="listen-box"><button class="play-big" data-say="' + esc(item.audio) + '">' + IT.icon("speaker") + '</button><button class="play-slow" data-say="' + esc(item.audio) + '" data-slow>' + IT.icon("turtle") + "</button></div>" + optionsBlock(item.options, null, "it-opts") + "</div>");
      var api = makeChoice(el, item, item.options, ready, "noaudio");
      return api;
    },
    dlg: function (item, ready) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qDialog") + '</h2><div class="mini-chat">' + item.lines.map(function (l) { return '<div class="msg npc"><span class="who">' + esc(l[0]) + '</span><div class="bub">' + esc(l[1]) + IT.sp(l[1]) + '<button class="tr-btn" data-tr="' + esc(l[2] || "") + '">' + IT.icon("eye") + "</button></div></div>"; }).join("") + '<div class="msg me"><div class="bub ghost">…</div></div></div>' + optionsBlock(item.options, null, "it-opts") + "</div>");
      el.addEventListener("click", function (e) { var b = e.target.closest("[data-tr]"); if (b) { b.outerHTML = '<div class="tr-reveal">' + esc(b.getAttribute("data-tr")) + "</div>"; } });
      return makeChoice(el, item, item.options, ready, "it-opts");
    },
    match: function (item, ready, submit) {
      var left = IT.shuffle(item.pairs.map(function (p, i) { return { i: i, v: p[0] }; })), right = IT.shuffle(item.pairs.map(function (p, i) { return { i: i, v: p[1] }; }));
      var el = IT.h('<div><h2 class="ex-q">' + t("qMatch") + '</h2><div class="match"><div class="mcol">' + left.map(function (x) { return '<button class="mbtn" data-side="l" data-i="' + x.i + '">' + esc(x.v) + "</button>"; }).join("") + '</div><div class="mcol">' + right.map(function (x) { return '<button class="mbtn" data-side="r" data-i="' + x.i + '">' + esc(x.v) + "</button>"; }).join("") + "</div></div></div>");
      var selL = null, selR = null, done = 0, mist = 0;
      el.addEventListener("click", function (e) {
        var b = e.target.closest(".mbtn"); if (!b || b.disabled) return;
        var side = b.getAttribute("data-side");
        if (side === "l") { IT.audio.speak(b.textContent); if (selL) selL.classList.remove("sel"); selL = b; } else { if (selR) selR.classList.remove("sel"); selR = b; }
        b.classList.add("sel");
        if (selL && selR) {
          var a = selL, c = selR; selL = selR = null;
          if (a.getAttribute("data-i") === c.getAttribute("data-i")) {
            [a, c].forEach(function (x) { x.classList.remove("sel"); x.classList.add("matched"); x.disabled = true; });
            done++; IT.audio.sfx("ok");
            if (done === item.pairs.length) setTimeout(submit, 350);
          } else {
            mist++;
            [a, c].forEach(function (x) { x.classList.remove("sel"); x.classList.add("shake"); setTimeout(function () { x.classList.remove("shake"); }, 450); });
          }
        }
      });
      return { el: el, evaluate: function () { return { ok: mist <= 1, kind: "exact", mist: mist, user: "" }; } };
    },
    build: function (item, ready) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qBuild") + '</h2><div class="bubble-ru">' + esc(item.prompt) + '</div><div class="build-ans" aria-label="Ответ"></div><div class="build-bank">' + item.tiles.map(function (w, i) { return '<button class="tile-w" data-i="' + i + '">' + esc(w) + "</button>"; }).join("") + "</div></div>");
      var ans = el.querySelector(".build-ans"), bank = el.querySelector(".build-bank"), order = [];
      function upd() { ready(order.length > 0); }
      el.addEventListener("click", function (e) {
        var b = e.target.closest(".tile-w"); if (!b || b.disabled || el.classList.contains("locked")) return;
        var i = +b.getAttribute("data-i");
        if (b.parentNode === bank) {
          b.classList.add("used"); b.disabled = true; order.push(i);
          var c = IT.h('<button class="tile-w in-ans" data-i="' + i + '">' + esc(item.tiles[i]) + "</button>"); ans.appendChild(c);
          IT.audio.speak(item.tiles[i]);
        } else {
          order.splice(order.indexOf(i), 1); b.remove();
          var orig = bank.querySelector('[data-i="' + i + '"]'); orig.classList.remove("used"); orig.disabled = false;
        }
        upd();
      });
      return {
        el: el,
        evaluate: function () { var u = order.map(function (i) { return item.tiles[i]; }).join(" "); var r = IT.check(u, item.answers); if (r.kind === "typo") r = { ok: false, kind: "wrong", best: r.best }; r.user = u; return r; },
        lock: function (res) { el.classList.add("locked"); ans.classList.add(res.ok ? "right" : "wrong"); }
      };
    },
    trans: function (item, ready, submit) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qTrans") + '</h2><div class="bubble-ru">' + esc(item.prompt) + '</div><textarea class="ans-input" rows="2" placeholder="' + t("typeItalian") + '" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>' + specialKeys() + "</div>");
      var api = makeInput(el, item, ready, item.answers);
      el.addEventListener("submit-ans", submit);
      return api;
    },
    type: function (item, ready, submit) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qType") + '</h2><div class="bubble-ru big">' + esc(item.prompt) + '</div><input class="ans-input" placeholder="' + t("typeItalian") + '" autocomplete="off" autocapitalize="off" spellcheck="false">' + specialKeys() + '<p class="muted xs">' + t("typeHintArticle") + "</p></div>");
      var api = makeInput(el, item, ready, item.answers);
      el.addEventListener("submit-ans", submit);
      return api;
    },
    fill: function (item, ready, submit) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qFill") + '</h2><div class="fill-q">' + fmtBlank(item.q) + "</div>" + (item.hint ? '<p class="hint">' + IT.icon("bulb") + " " + esc(item.hint) + "</p>" : "") + '<input class="ans-input" placeholder="' + t("missingWord") + '" autocomplete="off" autocapitalize="off" spellcheck="false">' + specialKeys() + "</div>");
      var api = makeInput(el, item, ready, item.answers);
      el.addEventListener("submit-ans", submit);
      return api;
    },
    fix: function (item, ready, submit) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qFix") + '</h2><div class="fix-q">' + IT.icon("pen") + "<span>" + esc(item.q) + '</span></div><textarea class="ans-input" rows="2" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>' + specialKeys() + '<p class="muted xs">' + t("fixHint") + "</p></div>");
      var api = makeInput(el, item, ready, item.answers, item.q);
      var ev = api.evaluate;
      api.evaluate = function () { var r = ev(); if (IT.norm(r.user) === IT.norm(item.q)) { r.ok = false; r.kind = "wrong"; } return r; };
      el.addEventListener("submit-ans", submit);
      return api;
    },
    dictation: function (item, ready, submit) {
      var el = IT.h('<div><h2 class="ex-q">' + t("qDictation") + '</h2><div class="listen-box"><button class="play-big" data-say="' + esc(item.audio) + '">' + IT.icon("speaker") + '</button><button class="play-slow" data-say="' + esc(item.audio) + '" data-slow>' + IT.icon("turtle") + '</button></div><textarea class="ans-input" rows="2" placeholder="' + t("typeHeard") + '" autocomplete="off" autocapitalize="off" spellcheck="false"></textarea>' + specialKeys() + "</div>");
      var api = makeInput(el, item, ready, item.answers);
      el.addEventListener("submit-ans", submit);
      return api;
    }
  };
  function fmtBlank(q) { return esc(q).replace(/_{2,}/g, '<span class="blank">____</span>'); }
})(window.IT);
