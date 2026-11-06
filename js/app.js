/* Точка входа */
(function (IT) {
  var S = IT.store;
  function boot() {
    IT.buildIndex();
    S.load();
    IT.applyOverrides();
    IT.applyTheme();
    IT.ensureQuests(); IT.ensureWeekly();
    var r = location.hash.slice(1);
    IT.route = ["path", "practice", "dialogues", "media", "dictionary", "tutor", "stats", "profile"].indexOf(r) >= 0 ? r : "path";
    IT.render();
    if (!S.state.profile.onboarded) IT.onboarding();
    S.initRemote();
    if (IT.cloud) IT.cloud.init();
    if (IT.update) IT.update.init();
    S.on(function (ev) {
      if (ev === "remote-loaded") IT.applyOverrides();
      if (ev === "remote-loaded" && S.state.profile.onboarded && IT.$("#overlay .onb")) IT.closeOverlay();
    });
    if (window.matchMedia) {
      var mq = matchMedia("(prefers-color-scheme: dark)");
      var fn = function () { if (S.state.profile.theme === "auto") IT.applyTheme(); };
      if (mq.addEventListener) mq.addEventListener("change", fn); else if (mq.addListener) mq.addListener(fn);
    }
    window.addEventListener("pagehide", function () { S.save(); });
    document.addEventListener("visibilitychange", function () { if (document.hidden) S.save(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
})(window.IT);
