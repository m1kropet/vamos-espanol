/* Справочник диалектов испанского + игра «Угадай диалект» */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  function sayable(x) { return String(x || "").replace(/[«»…]/g, "").split(/ = | вместо /)[0].trim(); }
  IT.openDialects = function (focus) {
    IT.activeActivity = "dialects";
    var o = IT.openOverlay('<div class="player dialects"><header class="pl-top"><button class="icon-btn" data-x>' + IT.icon("close") + '</button><h3 class="grow m0">' + IT.icon("globe") + " " + t("dialectsTitle") + '</h3><button class="btn primary sm" data-quiz>' + IT.icon("target") + " " + t("dialectQuiz") + '</button></header><div class="pl-body"><div class="dl-wrap"></div></div></div>');
    o.querySelector("[data-x]").onclick = IT.closeOverlay;
    var wrap = o.querySelector(".dl-wrap");
    o.querySelector("[data-quiz]").onclick = function () { quiz(wrap); };
    guide(wrap, focus);
  };

  function guide(wrap, focus) {
    var regs = IT.audio.regions();
    var avail = Object.keys(regs).map(function (k) { return regs[k]; });
    wrap.innerHTML = '<p class="muted">' + t("dialectsIntro") + '</p><p class="xs muted">' + IT.icon("speaker") + " " + t("voicesAvail") + " " + (avail.length ? esc(avail.join(", ")) : t("none")) + ". " + t("voicesNote") + "</p>" +
      '<div class="chips dl-tabs">' + IT.dialects.map(function (d) { return '<button class="chip" data-tab="' + d.id + '">' + d.flag + " " + esc(d.short) + "</button>"; }).join("") + '</div><div class="dl-card"></div>' +
      '<div class="card mt"><h3>' + t("vocabCompare") + '</h3><div class="tbl-wrap"><table class="tbl"><thead><tr><th></th>' + IT.dialects.slice(0, 5).map(function (d) { return "<th>" + d.flag + " " + esc(d.short) + "</th>"; }).join("") + "</tr></thead><tbody>" +
      [["машина", ["coche", "coche", "carro", "auto", "carro"]], ["компьютер", ["ordenador", "ordenador", "computadora", "computadora", "computadora"]], ["сок", ["zumo", "zumo", "jugo", "jugo", "jugo"]], ["мобильный", ["móvil", "móvil", "celular", "celular", "celular"]], ["автобус", ["autobús", "autobús", "camión", "colectivo", "guagua"]], ["ок, давай", ["vale", "vale", "órale / sale", "dale", "dale"]], ["круто", ["guay", "guay", "padre / chido", "re bueno / genial", "chévere"]], ["вы (друзьям)", ["vosotros", "ustedes / vosotros", "ustedes", "ustedes", "ustedes"]], ["ты", ["tú", "tú", "tú", "vos", "tú"]]]
        .map(function (r) { return "<tr><td><b>" + r[0] + "</b></td>" + r[1].map(function (x, i) { return '<td><button class="say-chip" data-say="' + esc(x.split(" /")[0]) + '" data-lang="' + IT.dialects[i].voice + '">' + esc(x) + IT.icon("speaker") + "</button></td>"; }).join("") + "</tr>"; }).join("") +
      "</tbody></table></div></div>";
    function show(id) {
      var d = IT.dialects.find(function (x) { return x.id === id; }) || IT.dialects[0];
      wrap.querySelectorAll("[data-tab]").forEach(function (b) { b.classList.toggle("on", b.getAttribute("data-tab") === d.id); });
      var hasV = IT.audio.hasVoice(d.voice);
      wrap.querySelector(".dl-card").innerHTML = '<div class="card dl-main"><div class="row gap"><span class="dl-flag">' + d.flag + '</span><div class="grow"><h2 class="m0">' + esc(d.name) + '</h2><p class="muted sm">' + esc(d.about) + "</p></div></div>" +
        '<p class="xs ' + (hasV ? "ok-t" : "muted") + '">' + IT.icon("speaker") + " " + (hasV ? t("regionalVoiceOn") + " (" + d.voice + ")" : t("regionalVoiceOff").replace("{v}", d.voice)) + "</p>" +
        '<h4>' + t("features") + '</h4><div class="feat-list">' + d.features.map(function (f) {
          return '<div class="feat-row"><b>' + esc(f[0]) + '</b><p class="sm">' + esc(f[1]) + '</p><button class="say-chip" data-say="' + esc(f[2].replace(/«|»/g, "")) + '" data-lang="' + d.voice + '">' + esc(f[2]) + IT.icon("speaker") + "</button></div>";
        }).join("") + "</div>" +
        '<h4 class="mt">' + t("samplePhrases") + "</h4>" + d.samples.map(function (s) { return '<div class="ex-card"><div class="row gap"><div class="grow"><div class="ex-it">' + esc(s[0]) + '</div><div class="ex-ru">' + esc(s[1]) + '</div></div><button class="spk" data-say="' + esc(s[0]) + '" data-lang="' + d.voice + '">' + IT.icon("speaker") + '</button><button class="spk" data-say="' + esc(s[0]) + '" data-lang="' + d.voice + '" data-slow>' + IT.icon("turtle") + "</button></div></div>"; }).join("") +
        '<h4 class="mt">' + t("localWords") + '</h4><div class="tbl-wrap"><table class="tbl"><thead><tr><th>' + t("meaning") + "</th><th>" + esc(d.short) + "</th><th>" + t("inSpain") + "</th></tr></thead><tbody>" + d.vocab.map(function (v) { return "<tr><td>" + esc(v[0]) + "</td><td><b>" + esc(v[1]) + "</b></td><td>" + esc(v[2]) + "</td></tr>"; }).join("") + "</tbody></table></div>" +
        '<div class="row gap wrap mt"><button class="btn ghost sm" data-ask-d>' + IT.icon("tutor") + " " + t("askAboutDialect") + "</button></div></div>";
      wrap.querySelector("[data-ask-d]").onclick = function () { IT.closeOverlay(); IT.tutorAsk("Расскажи подробнее про испанский вариант «" + d.name + "»: произношение, грамматика, сленг, как понимать носителей. Дай примеры с переводом."); };
    }
    wrap.querySelector(".dl-tabs").onclick = function (e) { var b = e.target.closest("[data-tab]"); if (b) show(b.getAttribute("data-tab")); };
    show(focus || IT.dialects[0].id);
  }

  /* Игра: угадай вариант испанского по фразе */
  function quiz(wrap) {
    var pool = [];
    IT.dialects.forEach(function (d) {
      d.samples.forEach(function (s) { pool.push({ text: s[0], ru: s[1], d: d }); });
      d.features.forEach(function (f) { var x = sayable(f[2]); if (x.length > 6 && !/[а-яё]/i.test(x)) pool.push({ text: x, ru: f[0] + ": " + f[1], d: d }); });
    });
    var qs = IT.sample(pool, 10), i = 0, score = 0;
    function draw() {
      if (i >= qs.length) {
        var st = S.state; st.dialectQuiz = st.dialectQuiz || { best: 0 }; st.dialectQuiz.best = Math.max(st.dialectQuiz.best, score);
        IT.addXp(score * 2, "dialects"); IT.checkAch(); S.save(); if (score >= 8) IT.confetti();
        wrap.innerHTML = '<div class="result"><h1>' + (score >= 8 ? "¡Fantástico!" : score >= 5 ? "¡Bien!" : "¡Ánimo!") + '</h1><p class="muted">' + t("quizScore").replace("{s}", score) + '</p><div class="row gap center"><button class="btn ghost" data-again>' + IT.icon("refresh") + " " + t("again") + '</button><button class="btn primary" data-back>' + t("dialectsTitle") + "</button></div></div>";
        wrap.querySelector("[data-again]").onclick = function () { quiz(wrap); };
        wrap.querySelector("[data-back]").onclick = function () { guide(wrap); };
        return;
      }
      var q = qs[i], opts = IT.shuffle([q.d].concat(IT.sample(IT.dialects.filter(function (d) { return d !== q.d; }), 3)));
      wrap.innerHTML = '<div class="ex in"><div class="stage-chip st-life">' + t("dialectQuiz") + " · " + (i + 1) + "/" + qs.length + '</div><h2 class="ex-q">' + t("whereSaid") + '</h2><div class="bubble-it">' + IT.sp(q.text) + "<span>" + esc(q.text) + '</span></div><div class="opts">' + opts.map(function (d, k) { return '<button class="opt" data-d="' + d.id + '"><span class="k">' + (k + 1) + "</span><span>" + d.flag + " " + esc(d.name) + "</span></button>"; }).join("") + '</div><div class="q-fb"></div></div>';
      wrap.querySelectorAll(".opt").forEach(function (b) {
        b.onclick = function () {
          var ok = b.getAttribute("data-d") === q.d.id; if (ok) score++;
          IT.audio.sfx(ok ? "ok" : "bad");
          wrap.querySelectorAll(".opt").forEach(function (x) { x.disabled = true; if (x.getAttribute("data-d") === q.d.id) x.classList.add("right"); else if (x === b) x.classList.add("wrong"); });
          var hits = IT.detectDialect(q.text).filter(function (r) { return r.d === q.d; })[0];
          wrap.querySelector(".q-fb").innerHTML = '<div class="fb-why mt"><span class="lbl">' + t("fbWhy") + "</span><p>" + q.d.flag + " <b>" + esc(q.d.name) + "</b>. " + esc(q.ru) + "</p>" + (hits ? '<p class="xs muted">' + t("foundMarkers") + " " + hits.hits.map(function (h) { return "<code>" + esc(h) + "</code>"; }).join(", ") + "</p>" : "") + '<button class="btn primary mt-s" data-nx>' + t("next") + "</button></div>";
          IT.audio.speak(q.text, { lang: q.d.voice });
          wrap.querySelector("[data-nx]").onclick = function () { i++; draw(); };
        };
      });
    }
    draw();
  }
})(window.IT);
