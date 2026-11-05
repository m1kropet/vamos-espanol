/* Видео и фильмы: субтитры + видео, повтор реплик, замедление, разбор произношения и диалекта */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  /* ---------- Субтитры ---------- */
  function toSec(s) {
    var m = s.trim().replace(",", ".").split(":").map(parseFloat);
    if (m.length === 3) return m[0] * 3600 + m[1] * 60 + m[2];
    if (m.length === 2) return m[0] * 60 + m[1];
    return m[0] || 0;
  }
  IT.parseSubs = function (txt) {
    txt = String(txt || "").replace(/\r/g, "").replace(/^WEBVTT[^\n]*\n/, "");
    var cues = [], re = /(\d{1,2}:\d{2}(?::\d{2})?[.,]\d{1,3})\s*-->\s*(\d{1,2}:\d{2}(?::\d{2})?[.,]\d{1,3})[^\n]*\n([\s\S]*?)(?=\n\s*\n|$)/g, m;
    while ((m = re.exec(txt))) {
      var text = m[3].replace(/<[^>]+>/g, "").replace(/\{[^}]+\}/g, "").replace(/\n+/g, " ").trim();
      if (text) cues.push({ s: toSec(m[1]), e: toSec(m[2]), t: text });
    }
    if (!cues.length) {
      txt.split(/\n+/).map(function (l) { return l.replace(/^\s*[-–—]\s*/, "").trim(); }).filter(function (l) { return l && !/^\d+$/.test(l); })
        .forEach(function (l) { cues.push({ s: null, e: null, t: l }); });
    }
    return cues.slice(0, 600);
  };
  function fmt(s) { if (s == null) return ""; var m = Math.floor(s / 60), x = Math.floor(s % 60); return m + ":" + String(x).padStart(2, "0"); }

  /* ---------- Офлайн-анализ: диалект и слова ---------- */
  IT.detectDialect = function (text) {
    var n = " " + IT.norm(text).replace(/'/g, " ") + " ", res = [];
    IT.dialects.forEach(function (d) {
      var hits = [];
      d.markers.forEach(function (mk) {
        var k = " " + IT.norm(mk).trim() + " ";
        if (n.indexOf(k) >= 0) hits.push(mk.trim());
      });
      if (hits.length) res.push({ d: d, score: hits.length, hits: hits });
    });
    return res.sort(function (a, b) { return b.score - a.score; });
  };
  var lookupIdx = null;
  function buildLookup() {
    lookupIdx = {};
    Object.keys(IT.vocab).forEach(function (k) {
      var w = IT.vocab[k], ex = IT.bare(w.it).toLowerCase(), b = IT.stripAcc(ex);
      if (ex.indexOf(" ") < 0) { lookupIdx["=" + ex] = lookupIdx["=" + ex] || w; lookupIdx[b] = lookupIdx[b] || w; }
    });
  }
  var FUNC = { el: "(артикль м.р.)", la: "(артикль ж.р.); её", los: "(артикль мн. м.р.); их", las: "(артикль мн. ж.р.); их", un: "(неопр. артикль); один", una: "(неопр. артикль); одна", y: "и", o: "или", de: "из; (родительный падеж)", del: "(de + el)", al: "(a + el)", que: "что; который (союз)", en: "в, на", a: "в, к", con: "с", por: "через, по; из-за", para: "для; чтобы", se: "себя; (возвратная частица)", me: "мне, меня", te: "тебе, тебя", lo: "его; это", le: "ему, ей, Вам", les: "им", nos: "нам, нас", os: "вам, вас", mi: "мой", tu: "твой", su: "его, её, их, Ваш", no: "не; нет", si: "если", ya: "уже", muy: "очень", pero: "но", como: "как; (я) ем", cuando: "когда (союз)", donde: "где (союз)", mas: "но (книжн.)" };
  IT.lookupWord = function (tok) {
    if (!lookupIdx) buildLookup();
    var low = tok.toLowerCase();
    if (FUNC[low]) return { it: low, ru: FUNC[low], pos: "" };
    if (lookupIdx["=" + low]) return lookupIdx["=" + low];
    var x = IT.stripAcc(low);
    if (x !== low && lookupIdx[x] && !lookupIdx["=" + x]) return lookupIdx[x];
    if (x === low && lookupIdx[x] && IT.stripAcc(IT.bare(lookupIdx[x].it).toLowerCase()) === IT.bare(lookupIdx[x].it).toLowerCase()) return lookupIdx[x];
    // множественное число и формы глаголов
    var dip = /ie(?=[a-z]+$)/.test(x) ? x.replace(/ie(?=[a-z]+$)/, "e") : x.replace(/ue(?=[a-z]+$)/, "o");
    var cands = [x.replace(/es$/, ""), x.replace(/s$/, ""), dip.replace(/(o|as|a|an|es|e|en)$/, "ar"), dip.replace(/(o|es|e|en)$/, "er"), dip.replace(/(o|es|e|en)$/, "ir"), x.replace(/(o|as|a|amos|ais|an)$/, "arse"), dip.replace(/(o|as|a|an)$/, "arse"), dip.replace(/(o|es|e|en)$/, "irse"), x.replace(/(o|as|a|amos|ais|an|es|e|emos|eis|en|imos|is|o)$/, "ar"), x.replace(/(o|es|e|emos|eis|en)$/, "er"), x.replace(/(o|es|e|imos|is|en)$/, "ir")];
    for (var i = 0; i < cands.length; i++) if (lookupIdx[cands[i]]) return lookupIdx[cands[i]];
    return null;
  };

  /* ---------- Примеры сцен ---------- */
  var SAMPLES = [
    { title: "Мадрид: встреча в баре", cues: [
      "—¡Hola, tío! ¿Qué tal estáis?", "—¡Muy bien! ¿Qué queréis tomar?", "—Para mí una caña, porfa.", "—Vale. Oye, ¿habéis visto la peli nueva?",
      "—Sí, ayer. ¡Mola mucho! Es superguay.", "—Venga, pues mañana vamos al cine, ¿vale?" ] },
    { title: "Буэнос-Айрес: разговор друзей", cues: [
      "—Che, ¿vos sabés dónde queda el bar?", "—Sí, boludo, acá a dos cuadras.", "—Dale. ¿Querés tomar algo antes del laburo?",
      "—Re bien. Vení, te invito un cafecito.", "—Mirá qué lindo está el día." ] },
    { title: "Мехико: в такерии", cues: [
      "—¿Qué onda, güey? ¿Ya pediste?", "—Ahorita, déjame ver el menú.", "—Los tacos al pastor están bien padres.",
      "—¡Órale! Pues pídeme tres y un jugo de naranja.", "—¿Mande? No te escuché." ] }
  ];

  var cur = { title: "", cues: [], videoUrl: null, isAudio: false, idx: -1, stopAt: null, loop: false };

  IT.views.media = function (main) {
    IT.activeActivity = null;
    var saved = S.state.media;
    main.innerHTML = '<div class="page-head"><h1>' + t("navMedia") + '</h1><p class="muted">' + t("mediaSub") + "</p></div>" +
      '<div class="grid two media-load"><div class="card"><h3>' + IT.icon("film") + " " + t("mediaLoad") + '</h3>' +
      '<label class="file-btn">' + IT.icon("play") + " <span>" + t("chooseVideo") + '</span><input type="file" accept="video/*,audio/*" data-video hidden></label><span class="xs muted" data-vname>' + (cur.videoUrl ? t("videoLoaded") : t("videoOptional")) + "</span>" +
      '<label class="file-btn mt-s">' + IT.icon("book") + " <span>" + t("chooseSubs") + '</span><input type="file" accept=".srt,.vtt,.txt,text/plain" data-subs hidden></label><span class="xs muted" data-sname></span>' +
      '<textarea class="code mt-s" rows="5" data-paste placeholder="' + t("pasteSubs") + '"></textarea>' +
      '<div class="row gap wrap mt-s"><button class="btn primary" data-open>' + IT.icon("play") + " " + t("openScene") + "</button>" + (saved && saved.cues && saved.cues.length ? '<button class="btn ghost" data-resume>' + IT.icon("refresh") + " " + t("continue") + ": " + esc(saved.title) + "</button>" : "") + '</div><p class="muted xs mt-s">' + t("mediaNote") + "</p></div>" +
      '<div class="card"><h3>' + IT.icon("sparkles") + " " + t("mediaSamples") + '</h3><p class="muted sm">' + t("mediaSamplesSub") + '</p><div class="sample-list">' +
      SAMPLES.map(function (sm, i) { return '<button class="sample" data-sample="' + i + '"><b>' + esc(sm.title) + '</b><span class="xs muted">' + esc(sm.cues[0]) + "</span></button>"; }).join("") +
      '</div><h4 class="mt">' + t("whereSubs") + '</h4><p class="muted xs">' + t("whereSubsText") + "</p></div></div>" +
      '<div class="workspace"></div>';
    var subsText = "";
    main.querySelector("[data-video]").onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      if (cur.videoUrl) URL.revokeObjectURL(cur.videoUrl);
      cur.videoUrl = URL.createObjectURL(f); cur.isAudio = /^audio/.test(f.type);
      main.querySelector("[data-vname]").textContent = f.name;
      if (!cur.title) cur.title = f.name.replace(/\.[^.]+$/, "");
    };
    main.querySelector("[data-subs]").onchange = function (e) {
      var f = e.target.files[0]; if (!f) return;
      var r = new FileReader(); r.onload = function () { subsText = r.result; main.querySelector("[data-sname]").textContent = f.name + " · " + IT.parseSubs(subsText).length + " " + t("lines"); cur.title = cur.title || f.name.replace(/\.[^.]+$/, ""); }; r.readAsText(f);
    };
    main.querySelector("[data-open]").onclick = function () {
      var txt = subsText || main.querySelector("[data-paste]").value;
      var cues = IT.parseSubs(txt);
      if (!cues.length) return IT.toast(t("needSubs"), "warn");
      cur.cues = cues; cur.title = cur.title || t("myScene");
      persist(); workspace(main);
    };
    var rs = main.querySelector("[data-resume]");
    if (rs) rs.onclick = function () { cur.cues = saved.cues; cur.title = saved.title; workspace(main); if (saved.hasVideo && !cur.videoUrl) IT.toast(t("reselectVideo"), "warn"); };
    main.querySelectorAll("[data-sample]").forEach(function (b) {
      b.onclick = function () {
        var sm = SAMPLES[+b.getAttribute("data-sample")];
        if (cur.videoUrl) { URL.revokeObjectURL(cur.videoUrl); cur.videoUrl = null; }
        cur.title = sm.title; cur.cues = sm.cues.map(function (c) { return { s: null, e: null, t: c.replace(/^—/, "") }; });
        persist(); workspace(main);
      };
    });
    if (cur.cues.length) workspace(main);
  };

  function persist() {
    S.state.media = { title: cur.title, cues: cur.cues.slice(0, 400), hasVideo: !!cur.videoUrl };
    S.state.cnt.media = (S.state.cnt.media || 0) + 1; IT.checkAch(); S.save();
  }

  function voiceSelect() {
    var regs = IT.audio.regions(), cur0 = S.state.mediaVoice || S.state.profile.variant || "es-ES";
    var opts = [["es-ES", "Испания"], ["es-MX", "Мексика"], ["es-AR", "Аргентина"], ["es-US", "США/Лат. Ам."], ["es-CO", "Колумбия"], ["es-CL", "Чили"]];
    return '<label class="sm vsel">' + IT.icon("speaker") + " " + t("ttsVoice") + ' <select data-voice>' + opts.map(function (o) { var has = regs[o[0].toLowerCase()]; return '<option value="' + o[0] + '"' + (o[0] === cur0 ? " selected" : "") + ">" + o[1] + (has ? "" : " — " + t("noVoiceShort")) + "</option>"; }).join("") + "</select></label>";
  }

  function workspace(main) {
    var ws = main.querySelector(".workspace");
    IT.activeActivity = "media";
    var hasV = !!cur.videoUrl, timed = cur.cues.some(function (c) { return c.s != null; });
    ws.innerHTML = '<div class="card ws-head"><div class="row between wrap gap"><div><span class="eyebrow">' + IT.icon("film") + " " + t("scene") + '</span><h2 class="m0">' + esc(cur.title) + '</h2><span class="muted xs">' + cur.cues.length + " " + t("lines") + (hasV ? "" : " · " + t("noVideoMode")) + "</span></div>" +
      '<div class="row gap wrap"><button class="btn ghost sm" data-dialect>' + IT.icon("globe") + " " + t("detectDialect") + '</button><button class="btn primary sm" data-analyze>' + IT.icon("sparkles") + " " + t("analyzeScene") + "</button></div></div></div>" +
      '<div class="media-grid"><div class="media-left">' +
      (hasV ? (cur.isAudio ? '<audio class="vid" controls src="' + cur.videoUrl + '"></audio>' : '<video class="vid" controls playsinline src="' + cur.videoUrl + '"></video>') + '<div class="cur-sub" data-cursub></div>' : "") +
      '<div class="ctrl row gap wrap"><div class="seg sm" data-rate>' + [[0.6, "0.6×"], [0.8, "0.8×"], [1, "1×"]].map(function (r) { return '<button data-r="' + r[0] + '" class="' + (r[0] === (cur.rate || 1) ? "on" : "") + '">' + r[1] + "</button>"; }).join("") + '</div><label class="sm chk"><input type="checkbox" data-loop ' + (cur.loop ? "checked" : "") + "> " + t("loopLine") + "</label>" + voiceSelect() + "</div>" +
      (hasV && !timed ? '<p class="tip sm">' + IT.icon("bulb") + "<span>" + t("noTimes") + "</span></p>" : "") +
      '<div class="cues">' + cur.cues.map(function (c, i) {
        return '<div class="cue" data-i="' + i + '"><span class="ct">' + (c.s != null ? fmt(c.s) : i + 1) + '</span><div class="cx">' + c.t.split(/(\s+)/).map(function (w) { return /\S/.test(w) ? '<span class="cw">' + esc(w) + "</span>" : w; }).join("") + '</div><div class="cb"><button class="icon-btn sm" data-play title="' + t("playLine") + '">' + IT.icon("play") + '</button><button class="icon-btn sm" data-slowp title="' + t("slowly") + '">' + IT.icon("turtle") + '</button><button class="icon-btn sm" data-rec title="' + t("repeatAfter") + '">' + IT.icon("mic") + '</button><button class="icon-btn sm" data-an title="' + t("analyzeLine") + '">' + IT.icon("search") + "</button></div></div>";
      }).join("") + '</div></div><div class="media-right"><div class="card an-panel"><div class="an-empty muted sm">' + IT.icon("search") + " " + t("anHint") + "</div></div></div></div>";
    var vid = ws.querySelector(".vid"), deskPanel = ws.querySelector(".an-panel");
    var narrow = function () { return window.matchMedia && matchMedia("(max-width: 1000px)").matches; };
    var getPanel = function () {
      if (!narrow()) return deskPanel;
      var m = IT.modal('<div class="an-panel sheet-panel"></div>', { wide: true });
      return m.querySelector(".an-panel");
    };
    if (vid) {
      vid.playbackRate = cur.rate || 1;
      vid.ontimeupdate = function () {
        var tm = vid.currentTime;
        if (cur.stopAt != null && tm >= cur.stopAt) {
          if (cur.loop && cur.idx >= 0) { vid.currentTime = cur.cues[cur.idx].s; } else { vid.pause(); cur.stopAt = null; }
        }
        if (!timed) return;
        var i = -1; cur.cues.forEach(function (c, k) { if (c.s != null && tm >= c.s && tm <= c.e + 0.15) i = k; });
        if (i !== cur.idx && i >= 0) highlight(i, true);
        ws.querySelector("[data-cursub]").textContent = i >= 0 ? cur.cues[i].t : "";
      };
    }
    function highlight(i, scroll) {
      cur.idx = i;
      ws.querySelectorAll(".cue").forEach(function (el, k) { el.classList.toggle("on", k === i); });
      var el = ws.querySelector('.cue[data-i="' + i + '"]');
      if (scroll && el) { var box = ws.querySelector(".cues"); box.scrollTop = el.offsetTop - box.offsetTop - 60; }
    }
    function playLine(i, slow) {
      var c = cur.cues[i]; highlight(i);
      if (vid && c.s != null) {
        vid.playbackRate = slow ? 0.6 : (cur.rate || 1);
        vid.currentTime = Math.max(0, c.s - 0.05); cur.stopAt = c.e + 0.1; vid.play().catch(function () { });
      } else {
        var lang = S.state.mediaVoice || S.state.profile.variant;
        (function say(n) { IT.audio.speak(c.t, { slow: slow, lang: lang, rate: slow ? null : (cur.rate || 1) * 0.95 }).then(function () { if (cur.loop && n < 2 && cur.idx === i) say(n + 1); }); })(0);
      }
      S.state.cnt.listen++; IT.questProgress("listen", 1);
    }
    ws.querySelector("[data-rate]").onclick = function (e) { var b = e.target.closest("[data-r]"); if (!b) return; cur.rate = +b.getAttribute("data-r"); if (vid) vid.playbackRate = cur.rate; ws.querySelectorAll("[data-r]").forEach(function (x) { x.classList.toggle("on", x === b); }); };
    ws.querySelector("[data-loop]").onchange = function (e) { cur.loop = e.target.checked; };
    ws.querySelector("[data-voice]").onchange = function (e) { S.state.mediaVoice = e.target.value; S.save(); IT.audio.speak(cur.cues[0] ? cur.cues[0].t : "Hola, ¿qué tal?", { lang: e.target.value }); };
    ws.querySelector(".cues").onclick = function (e) {
      var row = e.target.closest(".cue"); if (!row) return; var i = +row.getAttribute("data-i");
      if (e.target.closest("[data-play]")) return playLine(i, false);
      if (e.target.closest("[data-slowp]")) return playLine(i, true);
      if (e.target.closest("[data-an]")) { highlight(i); return analyzeLine(i, getPanel()); }
      if (e.target.closest("[data-rec]")) return shadow(i, row);
      var w = e.target.closest(".cw");
      if (w) { highlight(i); return wordInfo(w.textContent, cur.cues[i].t, getPanel()); }
      playLine(i, false);
    };
    ws.querySelector("[data-dialect]").onclick = function () { dialectReport(getPanel()); };
    ws.querySelector("[data-analyze]").onclick = function () { analyzeScene(getPanel()); };
    ws.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  /* Повтори за актёром: распознавание речи или самопроверка */
  function shadow(i, row) {
    var c = cur.cues[i], btn = row.querySelector("[data-rec]");
    S.state.cnt.speak++; IT.questProgress("speak", 1);
    if (!IT.audio.recognitionSupported()) return IT.toast(t("selfCheck"), "warn");
    btn.classList.add("rec");
    IT.audio.listen().then(function (alts) {
      btn.classList.remove("rec");
      var r = IT.audio.scoreSpeech(alts, c.t);
      IT.toast((r.score >= 80 ? "✅ " : r.score >= 50 ? "🟡 " : "🔴 ") + r.score + "% · " + t("heard") + " «" + esc(r.heard) + "»", r.score >= 80 ? "ok" : "warn");
    }).catch(function (e) { btn.classList.remove("rec"); IT.toast(e.code === "not-allowed" || e.code === "service-not-allowed" ? t("micBlocked") : t("notHeard"), "warn"); });
  }

  function loading(panel, txt) { panel.innerHTML = '<div class="an-load"><span class="typing-dots"><i></i><i></i><i></i></span> ' + esc(txt) + "</div>"; }
  function list(arr, fn) { return arr && arr.length ? "<ul>" + arr.map(fn).join("") + "</ul>" : ""; }
  function addWordBtn(es, ru) { return '<button class="link xs" data-addw="' + esc(es) + '" data-ru="' + esc(ru) + '">' + IT.icon("plus") + " " + t("toDict") + "</button>"; }
  function bindAdd(panel) {
    panel.querySelectorAll("[data-addw]").forEach(function (b) {
      b.onclick = function () {
        var es = b.getAttribute("data-addw"), ru = b.getAttribute("data-ru"), key = "custom:" + es.toLowerCase();
        var w = IT.parseWord([es, ru, "", "phr", "", ""].join("|"), null); w.key = key; w.custom = true;
        var src = cur.cues[cur.idx >= 0 ? cur.idx : 0];
        if (src) w.ex = [src.t, ""];
        S.state.custom = S.state.custom.filter(function (c) { return c.key !== key; }).concat([w]);
        IT.srs.ensure(key, null); S.save(); b.outerHTML = '<span class="chip ok sm">' + IT.icon("check") + "</span>";
      };
    });
  }

  /* Слово из субтитров: словарь курса + разбор ИИ */
  function wordInfo(word, line, panel) {
    var clean = word.replace(/[¿¡.,!?;:"«»()—–-]/g, "");
    var w = IT.lookupWord(clean);
    var html = '<span class="eyebrow">' + t("wordFromScene") + '</span><h3 class="row gap">' + esc(clean) + " " + IT.sp(clean) + "</h3>" +
      (w ? '<div class="fb-ex"><div><b>' + esc(w.it) + "</b> — " + esc(w.ru) + '<br><span class="xs muted">' + t("fromCourseDict") + "</span></div></div>" : '<p class="muted sm">' + t("notInDict") + "</p>") +
      '<button class="btn ghost sm" data-ai-word>' + IT.icon("sparkles") + " " + t("explainWord") + '</button><div class="ai-word"></div>';
    panel.innerHTML = html;
    panel.querySelector("[data-ai-word]").onclick = function () {
      var box = panel.querySelector(".ai-word"); loading(box, t("thinking"));
      IT.aiJSON("Ты преподаватель испанского для русскоговорящих. Объясни слово «" + clean + "» в контексте фразы из фильма: «" + line + "». Ответь JSON: {\"lemma\": \"начальная форма\", \"ru\": \"перевод в этом контексте\", \"form\": \"какая это форма (время, лицо, число) по-русски\", \"pronunciation\": \"как произносится, на что обратить внимание\", \"region\": \"если слово региональное или сленговое — где так говорят, иначе null\", \"example\": {\"es\": \"\", \"ru\": \"\"}}")
        .then(function (r) {
          box.innerHTML = '<div class="kv"><span>' + t("lemma") + "</span><b>" + esc(r.lemma || "") + "</b><span>" + t("translation") + "</span><b>" + esc(r.ru || "") + "</b><span>" + t("form") + "</span><b>" + esc(r.form || "—") + "</b><span>" + t("pronShort") + "</span><b>" + esc(r.pronunciation || "—") + "</b>" + (r.region ? "<span>" + t("region") + "</span><b>" + esc(r.region) + "</b>" : "") + "</div>" +
            (r.example && r.example.es ? '<div class="fb-ex">' + IT.sp(r.example.es) + "<div><i>" + esc(r.example.es) + '</i><br><span class="muted sm">' + esc(r.example.ru) + "</span></div></div>" : "") + addWordBtn(r.lemma || clean, r.ru || "");
          bindAdd(box);
        }).catch(function (e) { box.innerHTML = '<p class="bad-t sm">' + esc(IT.aiErrorText(e)) + "</p>"; });
    };
  }

  /* Разбор одной реплики */
  function analyzeLine(i, panel) {
    var c = cur.cues[i], ctx = cur.cues.slice(Math.max(0, i - 2), i + 3).map(function (x) { return x.t; }).join(" / ");
    var off = IT.detectDialect(c.t + " " + ctx);
    var toks = IT.tokens(c.t);
    var offline = '<div class="an-sec"><h4>' + t("wordByWord") + '</h4><div class="gloss">' + toks.map(function (tk) { var w = IT.lookupWord(tk); return '<button class="gw" data-say="' + esc(tk) + '"><span class="gw-it">' + esc(tk) + '</span><span class="gw-ru">' + esc(w ? w.ru : "?") + "</span></button>"; }).join("") + "</div></div>" +
      (off.length ? '<div class="an-sec"><h4>' + t("dialectHints") + "</h4>" + off.slice(0, 2).map(function (o) { return "<p class=\"sm\">" + o.d.flag + " <b>" + esc(o.d.short) + "</b>: " + o.hits.map(function (h) { return "<code>" + esc(h) + "</code>"; }).join(", ") + "</p>"; }).join("") + "</div>" : "");
    panel.innerHTML = '<span class="eyebrow">' + t("lineAnalysis") + '</span><h3 class="row gap">' + esc(c.t) + " " + IT.sp(c.t) + "</h3>" + offline + '<div class="ai-line"></div>';
    var box = panel.querySelector(".ai-line"); loading(box, t("aiAnalyzing"));
    IT.aiJSON("Ты преподаватель испанского для русскоговорящих (уровень ученика " + IT.prog.cefr() + "). Разбери реплику из фильма или видео: «" + c.t + "». Соседние реплики: " + ctx + ".\n" +
      "Ответь строго JSON: {\"translation\": \"естественный перевод на русский\", \"words\": [{\"es\": \"слово или выражение\", \"ru\": \"перевод\", \"note\": \"грамматика/форма, кратко\"}], \"pronunciation\": [{\"feature\": \"что происходит со звуком (связывание слов, придыхание s, шейсмо, выпадение d и т.п.)\", \"how\": \"как это звучит у носителя, русскими буквами при необходимости\"}], \"dialect\": {\"variant\": \"вариант испанского или 'нейтральный'\", \"confidence\": 0-100, \"evidence\": [\"признаки\"]}, \"slang\": [{\"es\": \"\", \"ru\": \"\", \"region\": \"\"}], \"tip\": \"совет, как повторить фразу как носитель\"}")
      .then(function (r) {
        box.innerHTML = '<div class="an-sec"><h4>' + t("translation") + "</h4><p>" + esc(r.translation || "") + "</p></div>" +
          (r.words && r.words.length ? '<div class="an-sec"><h4>' + t("wordsAI") + "</h4>" + list(r.words, function (w) { return "<li><b>" + esc(w.es) + "</b> — " + esc(w.ru) + (w.note ? ' <span class="muted xs">(' + esc(w.note) + ")</span>" : "") + " " + addWordBtn(w.es, w.ru) + "</li>"; }) + "</div>" : "") +
          (r.pronunciation && r.pronunciation.length ? '<div class="an-sec"><h4>' + IT.icon("ear") + " " + t("pronAI") + "</h4>" + list(r.pronunciation, function (p) { return "<li><b>" + esc(p.feature) + "</b>: " + esc(p.how) + "</li>"; }) + "</div>" : "") +
          (r.dialect ? '<div class="an-sec"><h4>' + IT.icon("globe") + " " + t("dialectAI") + "</h4><p><b>" + esc(r.dialect.variant || "") + "</b>" + (r.dialect.confidence != null ? ' <span class="muted xs">' + r.dialect.confidence + "%</span>" : "") + "</p>" + list(r.dialect.evidence, function (x) { return "<li>" + esc(x) + "</li>"; }) + "</div>" : "") +
          (r.slang && r.slang.length ? '<div class="an-sec"><h4>' + t("slang") + "</h4>" + list(r.slang, function (s) { return "<li><b>" + esc(s.es) + "</b> — " + esc(s.ru) + (s.region ? ' <span class="chip soft sm">' + esc(s.region) + "</span>" : "") + "</li>"; }) + "</div>" : "") +
          (r.tip ? '<p class="tip sm">' + IT.icon("bulb") + "<span>" + esc(r.tip) + "</span></p>" : "");
        bindAdd(box);
      }).catch(function (e) { box.innerHTML = '<p class="muted xs">' + IT.icon("sparkles") + " " + esc(IT.aiErrorText(e)) + " " + t("offlineShown") + "</p>"; });
  }

  /* Определение диалекта по всей сцене */
  function dialectReport(panel) {
    var text = cur.cues.map(function (c) { return c.t; }).join("\n"), res = IT.detectDialect(text);
    var html = '<span class="eyebrow">' + t("detectDialect") + "</span>";
    if (!res.length) html += '<p class="sm">' + t("noMarkers") + "</p>";
    else {
      var total = res.reduce(function (a, r) { return a + r.score; }, 0);
      html += res.slice(0, 3).map(function (r, k) {
        var pct = Math.round(r.score / total * 100);
        return '<div class="dl-res' + (k === 0 ? " top" : "") + '"><div class="row between"><b>' + r.d.flag + " " + esc(r.d.name) + "</b><span>" + pct + '%</span></div><div class="bar thin"><i style="width:' + pct + '%"></i></div><p class="xs muted">' + t("foundMarkers") + " " + r.hits.map(function (h) { return "<code>" + esc(h) + "</code>"; }).join(", ") + "</p>" +
          (k === 0 ? '<p class="sm">' + esc(r.d.about) + '</p><ul class="sm">' + r.d.features.slice(0, 3).map(function (f) { return "<li><b>" + esc(f[0]) + "</b>: " + esc(f[1]) + "</li>"; }).join("") + "</ul>" : "") + "</div>";
      }).join("");
    }
    html += '<button class="btn ghost sm mt-s" data-open-dialects>' + IT.icon("globe") + " " + t("dialectGuide") + "</button>";
    panel.innerHTML = html;
    panel.querySelector("[data-open-dialects]").onclick = function () { var mb = panel.closest(".modal-back"); if (mb && mb.close) mb.close(); IT.openDialects(res[0] && res[0].d.id); };
  }

  /* Полный разбор сцены ИИ */
  function analyzeScene(panel) {
    var lines = cur.cues.slice(0, 150).map(function (c, i) { return (i + 1) + ". " + c.t; }).join("\n");
    loading(panel, t("aiAnalyzing"));
    IT.aiJSON("Ты преподаватель испанского для русскоговорящих (уровень ученика " + IT.prog.cefr() + "). Ниже субтитры сцены из фильма или видео (номер. реплика).\n" + lines + "\n\n" +
      "Сделай учебный разбор. Ответь строго JSON: {\"summary\": \"о чём сцена, 1–2 предложения по-русски\", \"dialect\": {\"variant\": \"какой вариант испанского\", \"confidence\": 0-100, \"evidence\": [{\"line\": номер, \"feature\": \"какой признак (лексика, voseo, vosotros, сленг...)\"}]}, \"listen_for\": [{\"feature\": \"особенность произношения, которую стоит услышать у актёров этого региона\", \"explanation\": \"по-русски\", \"lines\": [номера]}], \"vocabulary\": [{\"es\": \"\", \"ru\": \"\", \"line\": номер}], \"slang\": [{\"es\": \"\", \"ru\": \"\", \"region\": \"\"}], \"grammar\": [\"короткое объяснение грамматики из сцены\"], \"practice\": \"задание: какие 2–3 реплики повторить вслух и почему\"}")
      .then(function (r) {
        panel.innerHTML = '<span class="eyebrow">' + t("sceneAnalysis") + "</span><p>" + esc(r.summary || "") + "</p>" +
          (r.dialect ? '<div class="an-sec"><h4>' + IT.icon("globe") + " " + esc(r.dialect.variant || "") + (r.dialect.confidence != null ? ' <span class="muted xs">' + r.dialect.confidence + "%</span>" : "") + "</h4>" + list(r.dialect.evidence, function (x) { return '<li><button class="link xs" data-goline="' + ((x.line || 1) - 1) + '">#' + esc(x.line) + "</button> " + esc(x.feature) + "</li>"; }) + "</div>" : "") +
          (r.listen_for && r.listen_for.length ? '<div class="an-sec"><h4>' + IT.icon("ear") + " " + t("listenFor") + "</h4>" + list(r.listen_for, function (x) { return "<li><b>" + esc(x.feature) + "</b>: " + esc(x.explanation) + " " + (x.lines || []).map(function (n) { return '<button class="link xs" data-goline="' + (n - 1) + '">#' + n + "</button>"; }).join(" ") + "</li>"; }) + "</div>" : "") +
          (r.vocabulary && r.vocabulary.length ? '<div class="an-sec"><h4>' + t("wordsAI") + "</h4>" + list(r.vocabulary, function (w) { return "<li><b>" + esc(w.es) + "</b> — " + esc(w.ru) + " " + addWordBtn(w.es, w.ru) + "</li>"; }) + "</div>" : "") +
          (r.slang && r.slang.length ? '<div class="an-sec"><h4>' + t("slang") + "</h4>" + list(r.slang, function (s) { return "<li><b>" + esc(s.es) + "</b> — " + esc(s.ru) + (s.region ? ' <span class="chip soft sm">' + esc(s.region) + "</span>" : "") + "</li>"; }) + "</div>" : "") +
          (r.grammar && r.grammar.length ? '<div class="an-sec"><h4>' + t("grammar") + "</h4>" + list(r.grammar, function (g) { return "<li>" + esc(g) + "</li>"; }) + "</div>" : "") +
          (r.practice ? '<p class="tip sm">' + IT.icon("mic") + "<span>" + esc(r.practice) + "</span></p>" : "");
        bindAdd(panel);
        panel.querySelectorAll("[data-goline]").forEach(function (b) { b.onclick = function () { var mb = panel.closest(".modal-back"); if (mb && mb.close) mb.close(); var row = document.querySelector('.cue[data-i="' + b.getAttribute("data-goline") + '"]'); if (row) { row.scrollIntoView({ block: "center", behavior: "smooth" }); row.classList.add("flash-row"); setTimeout(function () { row.classList.remove("flash-row"); }, 1200); } }; });
        IT.addXp(5, "media");
      }).catch(function (e) {
        dialectReport(panel);
        panel.insertAdjacentHTML("afterbegin", '<p class="tip sm">' + IT.icon("sparkles") + "<span>" + esc(IT.aiErrorText(e)) + " " + t("offlineDialect") + "</span></p>");
      });
  }
})(window.IT);
