/* Облако: вход через Google, синхронизация прогресса между устройствами и связь с Telegram-ботом.
 * Сервер — тот же Cloudflare Worker, что и бот (bot/src/cloud.js). */
(function (IT) {
  var S = IT.store;
  var LS = "vamos-cloud";
  var DEFAULT_URL = "https://vamos-bot.savemikropet.workers.dev";

  function saved() { try { return JSON.parse(localStorage.getItem(LS) || "{}"); } catch (e) { return {}; } }
  function persist() { try { localStorage.setItem(LS, JSON.stringify({ token: C.token, user: C.user, url: C.url, lastSync: C.lastSync, lastEvent: C.lastEvent, bot: C.bot })); } catch (e) { } }
  function weight(st) {
    var lessons = Object.keys(st.lessons || {}).filter(function (k) { return st.lessons[k] && st.lessons[k].done; }).length;
    return { xp: st.xp || 0, lessons: lessons, words: Object.keys(st.words || {}).length, score: (st.xp || 0) + lessons * 50 + Object.keys(st.words || {}).length };
  }
  function a2s(w) { return w.xp + " XP · уроков: " + w.lessons + " · слов: " + w.words; }
  function isNative() { return !!(window.Capacitor && window.Capacitor.isNativePlatform && window.Capacitor.isNativePlatform()); }

  var C = {
    url: DEFAULT_URL, token: "", user: null, status: "off", error: "", lastSync: 0, lastEvent: 0, bot: null,
    signedIn: function () { return !!this.token; },

    api: function (path, opts) {
      opts = opts || {};
      var headers = { authorization: "Bearer " + C.token };
      if (opts.body) headers["content-type"] = "application/json";
      return fetch(C.url + path, { method: opts.method || "GET", headers: headers, body: opts.body }).then(function (r) {
        if (r.status === 401) { C.signOut(true); throw new Error("unauthorized"); }
        return r.json().then(function (j) { j.__status = r.status; return j; });
      });
    },

    // ---------- вход ----------
    signIn: function () {
      var ret = isNative() ? "vamos://auth" : location.origin + location.pathname + "#profile";
      var u = C.url + "/auth/google?return=" + encodeURIComponent(ret);
      if (isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) window.Capacitor.Plugins.Browser.open({ url: u });
      else location.href = u;
    },
    // ?vamos_session=… в адресе (веб) или в ссылке vamos://auth?vamos_session=… (Android)
    takeToken: function (href) {
      var m = /[?&#]vamos_session=([0-9a-f]{48})/.exec(href || "");
      if (!m) return false;
      C.token = m[1]; C.user = null; persist();
      return true;
    },
    signOut: function (silent) {
      if (C.token && !silent) C.api("/api/logout", { method: "POST" }).catch(function () { });
      C.token = ""; C.user = null; C.bot = null; C.status = "off"; persist();
      S.emit("cloud");
    },

    // ---------- синхронизация ----------
    start: function () {
      if (!C.token) { C.status = "off"; S.emit("cloud"); return Promise.resolve(); }
      C.status = "syncing"; S.emit("cloud");
      return C.api("/api/me").then(function (me) {
        C.user = { email: me.email, name: me.name, picture: me.picture };
        C.bot = C.bot || {}; C.bot.username = me.bot; C.bot.linked = me.telegram;
        persist();
        return C.pull();
      }).then(function () { return C.refreshBot(); }).catch(function (e) {
        if (C.token) { C.status = "error"; C.error = e.message; }
        S.emit("cloud");
      });
    },
    pull: function () {
      var first = !C.lastSync;
      return C.api("/api/state").then(function (r) {
        var local = S.state.updatedAt || 0;
        var done = function () { C.status = "synced"; C.lastSync = Date.now(); persist(); S.emit("cloud"); };
        var takeRemote = function () { S.replace(r.state); S.emit("remote-loaded"); done(); };
        var keepLocal = function () { return C.push(true, true).then(done); };
        if (!r.state) return keepLocal();
        if (first) {
          // первый вход на этом устройстве: не затираем облако «пустым» прогрессом
          var a = weight(S.state), b = weight(r.state);
          if (a.score === 0) return takeRemote();
          if (b.score === 0) return keepLocal();
          return new Promise(function (resolve) {
            var chosen = false;
            var m = IT.modal('<h3 class="m-title">Какой прогресс оставить?</h3><p class="sm muted">В аккаунте уже есть сохранённый прогресс, и на этом устройстве тоже.</p>' +
              '<div class="pick-progress"><button class="btn ghost" data-k="remote"><b>☁️ Из аккаунта</b><span>' + a2s(b) + '</span></button><button class="btn ghost" data-k="local"><b>📱 С этого устройства</b><span>' + a2s(a) + "</span></button></div>", {
              onClose: function () { if (!chosen) { C.status = "error"; C.error = "Не выбран прогресс — синхронизация отложена"; S.emit("cloud"); resolve(); } }
            });
            m.onclick = function (e) {
              var k = e.target.closest("[data-k]"); if (!k) return;
              chosen = true; m.close();
              resolve(k.getAttribute("data-k") === "remote" ? takeRemote() : keepLocal());
            };
          });
        }
        if ((r.updatedAt || 0) > local) return takeRemote();
        if (local > (r.updatedAt || 0)) return keepLocal();
        done();
      });
    },
    _t: null, _busy: false, _again: false,
    schedule: function () {
      if (!C.token) return;
      clearTimeout(C._t);
      C._t = setTimeout(function () { C.push(); }, 15000);
    },
    flush: function () { if (C.token && C._t) { clearTimeout(C._t); C._t = null; C.push(); } },
    push: function (now, force) {
      if (!C.token) return Promise.resolve();
      if (C._busy) { C._again = true; return Promise.resolve(); }
      C._busy = true; C._t = null;
      return C.api("/api/state", { method: "PUT", body: JSON.stringify({ state: S.state, force: !!force }) }).then(function (r) {
        if (r.__status === 409) { C._busy = false; return C.pull(); }
        if (r.ok) { C.status = "synced"; C.lastSync = Date.now(); persist(); }
        else { C.status = "error"; C.error = r.error || ""; }
      }).catch(function (e) { C.status = "error"; C.error = e.message; }).then(function () {
        C._busy = false; S.emit("cloud");
        if (C._again) { C._again = false; C.push(); }
      });
    },

    // ---------- Telegram-бот ----------
    refreshBot: function () {
      if (!C.token) return Promise.resolve();
      return C.api("/api/bot?since=" + (C.lastEvent || 0)).then(function (r) {
        C.bot = { username: r.bot, linked: !!r.linked, stats: r.stats || null, weak: r.weak || [], tgName: r.tgName || "" };
        var ev = r.events || [], applied = 0;
        ev.forEach(function (e) {
          if (e.t <= C.lastEvent) return;
          C.lastEvent = Math.max(C.lastEvent, e.t);
          var w = S.state.words[e.k];
          if (!w) return;
          applied++;
          // результат из бота засчитывается как повторение карточки
          if (!e.ok) IT.srs.grade(e.k, 0);
          else if (w.due <= e.t) IT.srs.grade(e.k, 2);
          else IT.srs.soft(e.k, true);
        });
        if (applied) { S.state.cnt.reviews = (S.state.cnt.reviews || 0) + applied; S.save(); }
        persist(); S.emit("cloud");
        return applied;
      }).catch(function () { });
    },
    linkTelegram: function () {
      return C.api("/api/link", { method: "POST" }).then(function (r) {
        if (!r.url) throw new Error(r.error || "no_url");
        if (isNative() && window.Capacitor.Plugins && window.Capacitor.Plugins.Browser) window.Capacitor.Plugins.Browser.open({ url: r.url });
        else window.open(r.url, "_blank") || (location.href = r.url);
        // когда человек вернётся из Telegram — обновим статус
        var tries = 0, iv = setInterval(function () {
          tries++;
          C.refreshBot().then(function () { if ((C.bot && C.bot.linked) || tries > 40) clearInterval(iv); });
        }, 4000);
      });
    },
    unlinkTelegram: function () {
      return C.api("/api/bot", { method: "DELETE" }).then(function () { C.bot = { username: C.bot && C.bot.username, linked: false }; persist(); S.emit("cloud"); });
    },

    init: function () {
      var s = saved();
      C.url = s.url || DEFAULT_URL; C.token = s.token || ""; C.user = s.user || null; C.lastSync = s.lastSync || 0; C.lastEvent = s.lastEvent || 0; C.bot = s.bot || null;
      if (C.takeToken(location.href)) {
        // убираем токен из адресной строки
        try {
          var u = new URL(location.href); u.searchParams.delete("vamos_session");
          history.replaceState(null, "", u.pathname + (u.search || "") + (u.hash || "#profile"));
        } catch (e) { }
        setTimeout(function () { IT.toast(IT.icon("check") + " Вход через Google выполнен", "ok"); if (IT.route !== "profile" && S.state.profile.onboarded) IT.go("profile"); }, 300);
      }
      // Android: возврат из браузера по ссылке vamos://auth?vamos_session=…
      var P = window.Capacitor && window.Capacitor.Plugins;
      if (P && P.App && P.App.addListener) {
        P.App.addListener("appUrlOpen", function (d) {
          if (C.takeToken(d && d.url)) {
            if (P.Browser && P.Browser.close) P.Browser.close().catch(function () { });
            IT.toast(IT.icon("check") + " Вход через Google выполнен", "ok");
            C.start(); if (IT.route === "profile") IT.render(); else IT.go("profile");
          }
        });
        P.App.addListener("appStateChange", function (st) { if (st && st.isActive && C.token) C.refreshBot(); else C.flush(); });
      }
      document.addEventListener("visibilitychange", function () { if (document.hidden) C.flush(); else if (C.token) C.refreshBot(); });
      window.addEventListener("pagehide", function () { C.flush(); });
      S.on(function (ev) { if (ev === "saved") C.schedule(); });
      return C.start();
    },
  };
  IT.cloud = C;
})(window.IT);
