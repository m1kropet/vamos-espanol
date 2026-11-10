/* Практика: интервальное повторение, работа над ошибками, аудирование, произношение, слабые темы */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  IT.weakTags = function () {
    var tags = S.state.tags;
    return Object.keys(tags).filter(function (k) { return tags[k].tot >= 3 && IT.TAGS[k]; })
      .map(function (k) { return { tag: k, acc: Math.round(tags[k].ok / tags[k].tot * 100), tot: tags[k].tot }; })
      .sort(function (a, b) { return a.acc - b.acc; });
  };

  IT.views.practice = function (main) {
    var st = S.state, due = IT.srs.due().length, learned = IT.wordsLearned(), mist = st.mistakes.length;
    var weak = IT.weakTags().filter(function (w) { return w.acc < 85; }).slice(0, 3);
    var spd = st.listenSpeed || 0.85;
    var html = '<div class="page-head"><h1>' + t("navPractice") + '</h1><p class="muted">' + t("practiceSub") + "</p></div><div class=\"grid cards\">";
    html += card("review", "refresh", t("pReview"), due ? t("pReviewDue").replace("{n}", due) : learned ? t("pReviewNone") : t("pReviewEmpty"), due ? '<span class="badge">' + due + "</span>" : "", learned ? t("startShort") : "", "c-terra");
    html += card("mistakes", "target", t("pMistakes"), mist ? t("pMistakesN").replace("{n}", mist) : t("pMistakesNone"), mist ? '<span class="badge">' + mist + "</span>" : "", mist ? t("startShort") : "", "c-rose");
    html += '<div class="card pcard c-sky"><div class="pc-ico">' + IT.icon("ear") + '</div><h3>' + t("pListening") + '</h3><p class="muted sm">' + t("pListeningSub") + '</p><div class="seg" data-speed>' + [[0.7, t("spSlow")], [0.85, t("spMid")], [1.0, t("spNatural")]].map(function (s) { return '<button class="' + (spd === s[0] ? "on" : "") + '" data-sp="' + s[0] + '">' + s[1] + "</button>"; }).join("") + '</div><button class="btn primary mt-s" data-p="listening">' + IT.icon("play") + " " + t("startShort") + "</button></div>";
    html += card("pron", "mic", t("pPron"), t("pPronSub"), "", t("open"), "c-olive");
    html += card("dialects", "globe", t("pDialects"), t("pDialectsSub"), "", t("open"), "c-plum");
    html += card("media", "film", t("navMedia"), t("pMediaSub"), "", t("open"), "c-sky");
    html += card("mixed", "sparkles", t("pMixed"), t("pMixedSub"), "", t("startShort"), "c-gold");
    html += '<div class="card pcard c-plum"><div class="pc-ico">' + IT.icon("stats") + '</div><h3>' + t("pWeak") + "</h3>" + (weak.length ? '<div class="weak-list">' + weak.map(function (w) { return '<button class="weak" data-weak="' + w.tag + '"><span>' + esc(IT.TAGS[w.tag]) + '</span><span class="bar thin"><i style="width:' + w.acc + '%"></i></span><b>' + w.acc + "%</b></button>"; }).join("") + "</div>" : '<p class="muted sm">' + t("pWeakNone") + "</p>") + "</div>";
    html += card("placement", "shield", t("pPlacement"), t("pPlacementSub"), "", t("startShort"), "c-sky");
    html += "</div>";
    main.innerHTML = html;
    main.onclick = function (e) {
      var sp = e.target.closest("[data-sp]");
      if (sp) { st.listenSpeed = +sp.getAttribute("data-sp"); S.save(); main.querySelectorAll("[data-sp]").forEach(function (b) { b.classList.toggle("on", b === sp); }); return; }
      var w = e.target.closest("[data-weak]");
      if (w) { var tag = w.getAttribute("data-weak"); return IT.player.run({ kind: "weak", title: IT.TAGS[tag], items: IT.buildWeak(tag), rebuild: function () { return IT.buildWeak(tag); } }); }
      var b = e.target.closest("[data-p]"); if (!b) return;
      var p = b.getAttribute("data-p");
      if (p === "review") return learned ? IT.startReview() : IT.toast(t("pReviewEmpty"), "warn");
      if (p === "mistakes") return mist ? IT.player.run({ kind: "mistakes", title: t("pMistakes"), items: IT.shuffle(st.mistakes).slice(0, 12).map(function (m) { var c = JSON.parse(JSON.stringify(m)); c.stage = "mistakes"; return c; }) }) : IT.toast(t("pMistakesNone"), "ok");
      if (p === "listening") {
        IT.speedOverride = st.listenSpeed || 0.85;
        var sp0 = IT.speedOverride;
        return IT.player.run({ kind: "listening", title: t("pListening"), items: IT.buildListening(8), rebuild: function () { IT.speedOverride = sp0; return IT.buildListening(8); } });
      }
      if (p === "pron") return IT.openPron();
      if (p === "dialects") return IT.openDialects();
      if (p === "media") return IT.go("media");
      if (p === "mixed") return IT.player.run({ kind: "mixed", title: t("pMixed"), items: IT.buildMixed(10), rebuild: function () { return IT.buildMixed(10); } });
      if (p === "placement") return IT.placementTest(function (unitIdx, score) {
        var cur = S.state.unlocked;
        var msg = t("placementResult").replace("{s}", score).replace("{n}", IT.placement.length).replace("{u}", IT.tt(IT.units[unitIdx]));
        if (unitIdx > cur) {
          IT.confirm(msg + " " + t("placementOpen"), t("openUnits"), function () { S.state.unlocked = unitIdx; S.save(); IT.go("path"); });
        } else IT.modal('<h3 class="m-title">' + esc(msg) + '</h3><p class="muted">' + t("placementKeep") + '</p><button class="btn primary mt" data-close>OK</button>');
      });
    };
  };
  function card(id, ico, title, sub, badge, btn, cls) {
    return '<div class="card pcard ' + cls + '"><div class="pc-ico">' + IT.icon(ico) + badge + "</div><h3>" + title + '</h3><p class="muted sm">' + sub + "</p>" + (btn ? '<button class="btn primary mt-s" data-p="' + id + '">' + IT.icon("play") + " " + btn + "</button>" : "") + "</div>";
  }

  /* ================= Интервальное повторение (карточки) ================= */
  function preview(key, g) {
    var w = JSON.parse(JSON.stringify(S.state.words[key] || { e: 2.5, i: 0, r: 0 }));
    if (g === 0) return "10 " + t("minShort");
    var i;
    if (w.r === 0) i = g === 3 ? 3 : 1; else if (w.r === 1) i = g === 1 ? 3 : g === 2 ? 4 : 6; else i = Math.round(w.i * (g === 1 ? 1.2 : g === 2 ? w.e : w.e * 1.3));
    return i + " " + t("dShort");
  }
  IT.startReview = function (keys, mode) {
    var st = S.state;
    keys = keys || IT.srs.due();
    if (!keys.length) {
      // нет слов к повторению — берём самые слабые
      keys = Object.keys(st.words).filter(function (k) { return IT.wordInfo(k); }).sort(function (a, b) { return IT.srs.strength(a) - IT.srs.strength(b) || st.words[a].due - st.words[b].due; });
    }
    keys = keys.slice(0, 20);
    if (!keys.length) return IT.toast(t("pReviewEmpty"), "warn");
    mode = mode || st.reviewMode || "cards";
    var i = 0, done = 0, okN = 0, flipped = false;
    IT.activeActivity = "review";
    var o = IT.openOverlay('<div class="player review"><header class="pl-top"><button class="icon-btn" data-x>' + IT.icon("close") + '</button><div class="pl-bar"><i></i></div><div class="seg sm" data-mode><button data-m="cards" class="' + (mode === "cards" ? "on" : "") + '">' + t("modeCards") + '</button><button data-m="type" class="' + (mode === "type" ? "on" : "") + '">' + t("modeType") + '</button></div></header><div class="pl-body"><div class="rv"></div></div><footer class="pl-foot rv-foot"></footer></div>');
    var box = o.querySelector(".rv"), foot = o.querySelector(".rv-foot");
    o.querySelector("[data-x]").onclick = function () { S.save(); IT.closeOverlay(); };
    // Анти-списывание: слова, ответ на которые уже был виден в этой сессии (карточка, подсказка),
    // в режиме «Ввод» не могут получить оценку выше «Трудно». Смена режима действует со следующей карточки.
    var now = Date.now(), seen = IT._rvSeen = IT._rvSeen || {}, answered = false, pendingMode = null;
    Object.keys(seen).forEach(function (k) { if (now - seen[k] > 30 * 60000) delete seen[k]; }); // помним «подсмотренное» 30 минут, даже если закрыть и открыть заново
    o.querySelector("[data-mode]").onclick = function (e) {
      var b = e.target.closest("[data-m]"); if (!b) return;
      var m = b.getAttribute("data-m"); st.reviewMode = m;
      o.querySelectorAll("[data-m]").forEach(function (x) { x.classList.toggle("on", x === b); });
      if (m === mode) { pendingMode = null; return; }
      if (answered || i >= keys.length) { mode = m; pendingMode = null; return; }
      pendingMode = m; IT.toast(t("modeNext"));
    };
    function gradeBtns(sugg, max) {
      if (max == null) max = 3;
      return [[0, t("gAgain"), "g0"], [1, t("gHard"), "g1"], [2, t("gGood"), "g2"], [3, t("gEasy"), "g3"]].filter(function (g) { return g[0] <= max; }).map(function (g) {
        return '<button class="btn grade ' + g[2] + (sugg === g[0] ? " sugg" : "") + '" data-g="' + g[0] + '"><b>' + g[1] + "</b><small>" + preview(keys[i], g[0]) + "</small></button>";
      }).join("");
    }
    function back(w) {
      return '<div class="rv-back"><div class="rv-ru">' + esc(w.ru) + '</div><div class="row gap center sm"><span class="tag">' + esc(IT.posLabel(w.pos)) + (w.gender ? " · " + (w.gender === "m" ? t("masc") : t("fem")) : "") + "</span>" + (w.pron ? '<span class="pron">[' + esc(w.pron) + "]</span>" : "") + "</div>" + (w.ex ? '<div class="fb-ex">' + IT.sp(w.ex[0]) + "<div><i>" + esc(w.ex[0]) + '</i><br><span class="muted sm">' + esc(w.ex[1]) + "</span></div></div>" : "") + "</div>";
    }
    function draw() {
      o.querySelector(".pl-bar i").style.width = Math.round(i / keys.length * 100) + "%";
      if (i >= keys.length) return end();
      if (pendingMode) { mode = pendingMode; pendingMode = null; }
      var w = IT.wordInfo(keys[i]); flipped = false; answered = false;
      if (mode === "cards") {
        box.innerHTML = '<div class="flash"><div class="flash-front">' + IT.sp(w.it, "big") + '<div class="rv-it">' + esc(w.it) + "</div></div><div class=\"flash-slot\"></div></div>";
        foot.innerHTML = '<button class="btn primary big" data-flip>' + t("showAnswer") + "</button>";
        foot.querySelector("[data-flip]").onclick = flip;
        seen[keys[i]] = Date.now();
        if (st.profile.autoplay) IT.audio.speak(w.it);
      } else {
        box.innerHTML = '<div class="flash"><div class="flash-front"><div class="muted sm">' + t("typeInSpanish") + '</div><div class="rv-it">' + esc(w.ru) + '</div></div><input class="ans-input" placeholder="' + t("typeItalian") + '" autocomplete="off" autocapitalize="off" spellcheck="false"><div class="flash-slot"></div></div>';
        foot.innerHTML = '<button class="btn primary big" data-chk>' + t("check") + "</button>";
        var inp = box.querySelector("input"); setTimeout(function () { inp.focus(); }, 50);
        var go = function () {
          if (answered) return; answered = true;
          var ans = [w.it, IT.bare(w.it)], r = IT.check(inp.value, ans);
          var peeked = !!seen[keys[i]]; seen[keys[i]] = Date.now();
          // потолок оценки определяется результатом ввода, а не самооценкой
          var max = !r.ok ? 0 : peeked ? 1 : r.kind === "exact" ? 3 : 1;
          inp.disabled = true; inp.classList.add(r.ok ? "right" : "wrong");
          var sugg = Math.min(max, r.ok ? (r.kind === "exact" ? 2 : 1) : 0);
          box.querySelector(".flash-slot").innerHTML = (r.ok ? "" : '<div class="fb-ans"><span class="lbl">' + t("fbCorrect") + '</span><span class="ans-txt">' + esc(w.it) + "</span> " + IT.sp(w.it) + "</div>") + back(w);
          IT.audio.speak(w.it); IT.audio.sfx(r.ok ? "ok" : "bad");
          foot.innerHTML = (peeked && r.ok ? '<div class="muted sm center rv-note">' + t("peekNote") + "</div>" : "") + '<div class="grades">' + gradeBtns(sugg, max) + "</div>";
          bindGrades(r.ok && !peeked);
        };
        foot.querySelector("[data-chk]").onclick = go;
        inp.onkeydown = function (e) { if (e.key === "Enter" && inp.value.trim()) go(); };
      }
    }
    function flip() {
      if (flipped) return; flipped = true; answered = true;
      var w = IT.wordInfo(keys[i]);
      box.querySelector(".flash-slot").innerHTML = back(w);
      box.querySelector(".flash").classList.add("flipped");
      foot.innerHTML = '<div class="grades">' + gradeBtns(-1) + "</div>";
      bindGrades(null);
    }
    function bindGrades(typedOk) {
      foot.querySelectorAll("[data-g]").forEach(function (b) {
        b.onclick = function () {
          var g = +b.getAttribute("data-g");
          IT.srs.grade(keys[i], g);
          done++; if (g > 0) okN++;
          st.cnt.reviews++; IT.dayLog().rev++; IT.questProgress("review", 1);
          IT.addXp(typedOk ? 2 : 1, "review");
          if (g === 0) keys.push(keys[i]);
          i++; S.save(); draw();
        };
      });
    }
    document.onkeydown = function (e) {
      if (e.key === " " && mode === "cards" && !flipped) { e.preventDefault(); flip(); }
      if (/^[1-4]$/.test(e.key) && document.activeElement.tagName !== "INPUT") { var b = foot.querySelector('[data-g="' + (+e.key - 1) + '"]'); if (b) b.click(); }
    };
    function end() {
      IT.checkAch(); S.save(); IT.activeActivity = null;
      IT.confetti();
      box.innerHTML = '<div class="result"><h1>¡Excelente!</h1><p class="muted">' + t("reviewDone") + '</p><div class="res-tiles"><div class="tile">' + IT.icon("refresh") + "<b>" + done + "</b><span>" + t("cards") + '</span></div><div class="tile">' + IT.icon("check") + "<b>" + okN + "</b><span>" + t("remembered") + '</span></div><div class="tile">' + IT.icon("book") + "<b>" + IT.srs.due().length + "</b><span>" + t("stillDue") + "</span></div></div></div>";
      foot.innerHTML = '<button class="btn primary big" data-end>' + t("continue") + "</button>";
      foot.querySelector("[data-end]").onclick = function () { IT.closeOverlay(); };
    }
    draw();
  };

  /* ================= Произношение ================= */
  IT.openPron = function () {
    IT.activeActivity = "pron";
    var o = IT.openOverlay('<div class="player pron"><header class="pl-top"><button class="icon-btn" data-x>' + IT.icon("close") + "</button><h3 class=\"grow\">" + t("pPron") + '</h3></header><div class="pl-body"><div class="pron-wrap"></div></div></div>');
    o.querySelector("[data-x]").onclick = IT.closeOverlay;
    var wrap = o.querySelector(".pron-wrap");
    var recOk = IT.audio.recognitionSupported();
    function list() {
      wrap.innerHTML = '<p class="muted">' + t("pronIntro") + "</p>" + (recOk ? "" : '<p class="tip">' + IT.icon("bulb") + "<span>" + t("pronNoRec") + "</span></p>") +
        '<div class="sound-grid">' + IT.sounds.map(function (s, i) {
          return '<div class="card sound"><h4>' + esc(s.s) + '</h4><p class="sm muted">' + esc(s.r) + '</p><div class="chips">' + s.w.map(function (w) { return '<button class="say-chip" data-say="' + esc(w) + '">' + esc(w) + IT.icon("speaker") + "</button>"; }).join("") + '</div><button class="btn ghost sm mt-s" data-train="' + i + '">' + IT.icon("mic") + " " + t("train") + "</button></div>";
        }).join("") + '</div><div class="card mt"><h4>' + t("shadowing") + '</h4><p class="sm muted">' + t("shadowingSub") + '</p><button class="btn primary" data-shadow>' + IT.icon("play") + " " + t("startShort") + "</button></div>";
    }
    function trainer(words, title) {
      var i = 0;
      function draw() {
        if (i >= words.length) { IT.checkAch(); S.save(); return list(); }
        var w = words[i];
        wrap.innerHTML = '<button class="link" data-back>' + IT.icon("back") + " " + t("back") + '</button><div class="trainer"><span class="eyebrow">' + esc(title) + " · " + (i + 1) + "/" + words.length + '</span><div class="tr-word">' + esc(w) + '</div><div class="row gap center"><button class="btn ghost" data-say="' + esc(w) + '">' + IT.icon("speaker") + " " + t("listen") + '</button><button class="btn ghost" data-say="' + esc(w) + '" data-slow>' + IT.icon("turtle") + " " + t("slowly") + '</button></div><button class="mic-btn" data-mic>' + IT.icon("mic") + '</button><p class="muted sm" data-status>' + (recOk ? t("tapMic") : t("selfCheck")) + '</p><div class="tr-result"></div><div class="row gap center mt"><button class="btn ghost" data-self="0">' + t("tryAgain") + '</button><button class="btn primary" data-self="1">' + t("gotItNext") + "</button></div></div>";
        wrap.querySelector("[data-back]").onclick = list;
        wrap.querySelector("[data-mic]").onclick = function () {
          var btn = this, status = wrap.querySelector("[data-status]");
          S.state.cnt.speak++; IT.questProgress("speak", 1);
          if (!recOk) { status.textContent = t("selfCheck"); IT.audio.speak(w); return; }
          btn.classList.add("rec"); status.textContent = t("speakNow");
          IT.audio.listen().then(function (alts) {
            btn.classList.remove("rec");
            var r = IT.audio.scoreSpeech(alts, w);
            var cls = r.score >= 80 ? "ok" : r.score >= 50 ? "mid" : "bad";
            wrap.querySelector(".tr-result").innerHTML = '<div class="score ' + cls + '"><b>' + r.score + "%</b><span>" + t("heard") + " «" + esc(r.heard) + "»</span></div>" + (r.score < 80 ? '<p class="sm">' + t("pronAdvice") + "</p>" : "");
            status.textContent = "";
            if (r.score >= 80) IT.audio.sfx("ok");
          }).catch(function (e) {
            btn.classList.remove("rec");
            if (e.code === "not-allowed" || e.code === "service-not-allowed" || e.code === "audio-capture") { recOk = false; status.textContent = t("micBlocked"); }
            else status.textContent = t("notHeard");
          });
        };
        wrap.querySelectorAll("[data-self]").forEach(function (b) { b.onclick = function () { if (b.getAttribute("data-self") === "1") { IT.addXp(1, "speak"); i++; } else wrap.querySelector(".tr-result").innerHTML = ""; draw(); }; });
        if (S.state.profile.autoplay) IT.audio.speak(w);
      }
      draw();
    }
    wrap.addEventListener("click", function (e) {
      var tr = e.target.closest("[data-train]");
      if (tr) { var s = IT.sounds[+tr.getAttribute("data-train")]; trainer(s.w, s.s); }
      if (e.target.closest("[data-shadow]")) {
        var ls = IT.allLessons.filter(function (l) { return IT.prog.lessonDone(l.id); }); if (!ls.length) ls = IT.allLessons.slice(0, 3);
        var phrases = IT.sample(ls.reduce(function (a, l) { return a.concat(l.examples.map(function (x) { return x.it; })); }, []), 6);
        trainer(phrases, t("shadowing"));
      }
    });
    list();
  };

  /* ================= Тест уровня ================= */
  IT.placementTest = function (onResult) {
    var qs = IT.placement, i = 0, score = 0;
    var o = IT.openOverlay('<div class="player"><header class="pl-top"><button class="icon-btn" data-x>' + IT.icon("close") + '</button><div class="pl-bar"><i></i></div></header><div class="pl-body"><div class="ex"></div></div></div>');
    o.querySelector("[data-x]").onclick = IT.closeOverlay;
    var ex = o.querySelector(".ex");
    function draw() {
      o.querySelector(".pl-bar i").style.width = Math.round(i / qs.length * 100) + "%";
      if (i >= qs.length) {
        var u = score <= 3 ? 0 : score <= 5 ? 2 : score <= 7 ? 4 : score <= 9 ? 6 : score <= 11 ? 8 : score <= 12 ? 10 : score <= 14 ? 12 : score <= 16 ? 15 : score <= 17 ? 18 : 21;
        u = Math.min(u, IT.units.length - 1);
        IT.closeOverlay(); onResult(u, score); return;
      }
      var q = qs[i], opts = IT.shuffle(q[1]);
      ex.innerHTML = '<div class="stage-chip st-test">' + t("placementTitle") + " · " + (i + 1) + "/" + qs.length + '</div><h2 class="ex-q">' + esc(q[0]).replace(/_{2,}/g, '<span class="blank">____</span>') + '</h2><div class="opts">' + opts.map(function (x, k) { return '<button class="opt" data-v="' + esc(x) + '"><span class="k">' + (k + 1) + "</span><span>" + esc(x) + "</span></button>"; }).join("") + '</div><button class="link mt" data-dk>' + t("dontKnow") + "</button>";
      ex.classList.remove("in"); void ex.offsetWidth; ex.classList.add("in");
    }
    ex.addEventListener("click", function (e) {
      var b = e.target.closest(".opt");
      if (b) { if (b.getAttribute("data-v") === qs[i][1][qs[i][2]]) score++; i++; draw(); }
      if (e.target.closest("[data-dk]")) { i++; draw(); }
    });
    draw();
  };
})(window.IT);
