/* Android-приложение (Capacitor): системная озвучка, распознавание речи и кнопка «Назад».
 * В браузере этот файл ничего не делает. */
(function (IT) {
  var C = window.Capacitor;
  if (!C || !C.isNativePlatform || !C.isNativePlatform()) return;
  IT.native = true;
  function plugin(name) { return (C.Plugins && C.Plugins[name]) || (C.registerPlugin ? C.registerPlugin(name) : null); }
  var TTS = plugin("TextToSpeech"), SR = plugin("SpeechRecognition"), App = plugin("App");
  var langs = null;
  if (TTS && TTS.getSupportedLanguages) TTS.getSupportedLanguages().then(function (r) { langs = (r && r.languages) || []; }).catch(function () { langs = []; });

  var A = IT.audio;
  A.available = function () { return !!TTS; };
  A.hasSpanish = function () { return !langs || langs.some(function (l) { return /^es/i.test(l); }); };
  A.voiceName = function () { return "Android TTS (" + (IT.store.state.profile.variant || "es-ES") + ")"; };
  A.regions = function () {
    var out = {}, names = { "es-es": "Испания", "es-mx": "Мексика", "es-us": "США", "es-ar": "Аргентина", "es-co": "Колумбия", "es-cl": "Чили" };
    (langs || ["es-ES"]).forEach(function (l) { var k = String(l).replace("_", "-").toLowerCase(); if (/^es/.test(k)) out[k] = names[k] || l; });
    return out;
  };
  A.hasVoice = function (lang) { return !!(langs || []).some(function (l) { return String(l).replace("_", "-").toLowerCase() === String(lang).toLowerCase(); }); };
  A.speak = function (text, opts) {
    opts = opts || {};
    if (!TTS || !text) return Promise.resolve(false);
    var lang = opts.lang || IT.store.state.profile.variant || "es-ES";
    if (langs && langs.length && !A.hasVoice(lang)) lang = (langs.find(function (l) { return /^es/i.test(l); }) || "es-ES");
    var base = IT.speedOverride || IT.store.state.profile.speed || 0.9;
    var rate = Math.max(0.4, Math.min(1.3, (opts.rate || base) * (opts.slow ? 0.65 : 1)));
    return TTS.stop().catch(function () { }).then(function () {
      return TTS.speak({ text: String(text).replace(/_+/g, " "), lang: lang, rate: rate, pitch: 1.0, volume: 1.0, category: "playback" });
    }).then(function () { return true; }, function () { return false; });
  };
  A.stop = function () { if (TTS) TTS.stop().catch(function () { }); };

  A.recognitionSupported = function () { return !!SR; };
  A.listen = function () {
    if (!SR) return Promise.reject({ code: "unsupported" });
    return SR.requestPermissions().then(function (p) {
      if (p && p.speechRecognition && p.speechRecognition !== "granted") throw { code: "not-allowed" };
      return SR.available();
    }).then(function (a) {
      if (a && a.available === false) throw { code: "unsupported" };
      return SR.start({ language: IT.store.state.profile.variant || "es-ES", maxResults: 5, partialResults: false, popup: false });
    }).then(function (r) {
      var m = (r && r.matches) || [];
      if (!m.length) throw { code: "no-speech" };
      return m.map(function (t) { return { t: t, c: 1 }; });
    }, function (e) { throw e && e.code ? e : { code: "no-speech" }; });
  };

  /* Кнопка «Назад»: закрывает окно/урок, затем возвращает на главную, затем выходит */
  if (App && App.addListener) App.addListener("backButton", function () {
    var modal = document.querySelector(".modal-back.show");
    if (modal && modal.close) return modal.close();
    var ov = document.getElementById("overlay");
    if (ov && ov.classList.contains("show")) {
      var x = ov.querySelector("[data-x]");
      if (x) return x.click();
      return;
    }
    if (IT.route !== "path") return IT.go("path");
    App.exitApp();
  });
})(window.IT);
