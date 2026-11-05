/* Озвучка (Web Speech API) с региональными голосами, распознавание речи и звуковые эффекты */
(function (IT) {
  var synth = window.speechSynthesis || null;
  var all = [];

  function load() {
    if (!synth) return;
    var vs = synth.getVoices() || [];
    all = vs.filter(function (v) { return /^es([-_]|$)/i.test(v.lang); });
  }
  function score(v) {
    var n = (v.name || "").toLowerCase(), s = 0;
    if (/natural|neural|premium|enhanced|google/.test(n)) s += 3;
    if (v.localService) s += 1;
    return s;
  }
  function norm(l) { return String(l || "").replace("_", "-").toLowerCase(); }
  /** Голос для варианта: точное совпадение (es-MX) → для Латинской Америки любой не испанский → любой испанский */
  function voiceFor(lang) {
    if (!all.length) load();
    if (!all.length) return null;
    var want = norm(lang || "es-ES");
    var exact = all.filter(function (v) { return norm(v.lang) === want; }).sort(function (a, b) { return score(b) - score(a); });
    if (exact.length) return { v: exact[0], exact: true };
    if (want !== "es-es") {
      var latam = all.filter(function (v) { return norm(v.lang) !== "es-es"; }).sort(function (a, b) { return score(b) - score(a); });
      if (latam.length) return { v: latam[0], exact: false };
    }
    var any = all.slice().sort(function (a, b) { return (norm(b.lang) === "es-es") - (norm(a.lang) === "es-es") || score(b) - score(a); });
    return { v: any[0], exact: false };
  }
  if (synth) { load(); if (typeof synth.onvoiceschanged !== "undefined") synth.onvoiceschanged = load; }

  var REGION_NAMES = { "es-es": "Испания", "es-mx": "Мексика", "es-us": "США (латиноамериканский)", "es-ar": "Аргентина", "es-co": "Колумбия", "es-cl": "Чили", "es-419": "Латинская Америка", "es-pe": "Перу", "es-ve": "Венесуэла", "es-cu": "Куба" };

  IT.audio = {
    available: function () { return !!synth; },
    hasSpanish: function () { load(); return all.length > 0; },
    voiceName: function () { var r = voiceFor(IT.store.state.profile.variant); return r ? r.v.name + " (" + r.v.lang + ")" : null; },
    /** Какие региональные голоса есть в системе */
    regions: function () {
      load(); var seen = {};
      all.forEach(function (v) { seen[norm(v.lang)] = REGION_NAMES[norm(v.lang)] || v.lang; });
      return seen;
    },
    hasVoice: function (lang) { load(); return all.some(function (v) { return norm(v.lang) === norm(lang); }); },
    /** opts: {slow, rate, lang} — lang задаёт региональный голос (es-MX, es-AR…) */
    speak: function (text, opts) {
      opts = opts || {};
      return new Promise(function (resolve) {
        if (!synth || !text) return resolve(false);
        try {
          synth.cancel();
          var u = new SpeechSynthesisUtterance(String(text).replace(/_+/g, " "));
          var lang = opts.lang || IT.store.state.profile.variant || "es-ES";
          var r = voiceFor(lang);
          u.lang = r ? r.v.lang : lang;
          if (r) u.voice = r.v;
          var base = (IT.speedOverride || IT.store.state.profile.speed || 0.9);
          u.rate = Math.max(0.4, Math.min(1.3, (opts.rate || base) * (opts.slow ? 0.65 : 1)));
          u.onend = function () { resolve(true); };
          u.onerror = function () { resolve(false); };
          synth.speak(u);
          setTimeout(function () { resolve(true); }, 15000);
        } catch (e) { resolve(false); }
      });
    },
    stop: function () { try { synth && synth.cancel(); } catch (e) { } },

    /* --- Распознавание речи --- */
    recognitionSupported: function () { return !!(window.SpeechRecognition || window.webkitSpeechRecognition); },
    listen: function () {
      return new Promise(function (resolve, reject) {
        var R = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!R) return reject({ code: "unsupported" });
        try {
          var r = new R();
          r.lang = IT.store.state.profile.variant || "es-ES"; r.interimResults = false; r.maxAlternatives = 5;
          var done = false;
          r.onresult = function (e) {
            done = true;
            var alts = [];
            for (var i = 0; i < e.results[0].length; i++) alts.push({ t: e.results[0][i].transcript, c: e.results[0][i].confidence });
            resolve(alts);
          };
          r.onerror = function (e) { done = true; reject({ code: e.error || "error" }); };
          r.onend = function () { if (!done) reject({ code: "no-speech" }); };
          r.start();
        } catch (e) { reject({ code: "not-allowed" }); }
      });
    },
    scoreSpeech: function (alts, target) {
      var t = IT.stripAcc(IT.norm(target)), best = 0, heard = alts[0] ? alts[0].t : "";
      alts.forEach(function (a) {
        var h = IT.stripAcc(IT.norm(a.t));
        var tw = t.split(" "), hw = h.split(" "), hit = 0;
        tw.forEach(function (w) { if (hw.indexOf(w) >= 0) hit++; });
        var s = Math.round(hit / tw.length * 100);
        if (h === t) s = 100;
        if (s > best) { best = s; heard = a.t; }
      });
      return { score: best, heard: heard };
    },

    /* --- Звуковые эффекты --- */
    _ctx: null,
    sfx: function (kind) {
      if (!IT.store.state.profile.sfx) return;
      try {
        var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return;
        var ctx = this._ctx || (this._ctx = new AC());
        if (ctx.state === "suspended") ctx.resume();
        var notes = kind === "ok" ? [[660, 0], [880, 0.09]] : kind === "bad" ? [[220, 0], [180, 0.12]] : [[523, 0], [659, 0.1], [784, 0.2], [1046, 0.3]];
        notes.forEach(function (n) {
          var o = ctx.createOscillator(), g = ctx.createGain(), t0 = ctx.currentTime + n[1];
          o.type = kind === "bad" ? "triangle" : "sine"; o.frequency.value = n[0];
          g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(0.12, t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
          o.connect(g); g.connect(ctx.destination); o.start(t0); o.stop(t0 + 0.25);
        });
      } catch (e) { }
    }
  };
})(window.IT);
