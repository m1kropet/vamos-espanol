/* Обновления приложения.
 * Сайт/PWA: новая версия загружается через service worker и применяется перезагрузкой.
 * Android: обновление интерфейса скачивается и ставится прямо в приложении (без переустановки);
 *          если нужна новая сборка APK — приложение само скачивает её, Android ставит поверх старой (данные сохраняются). */
(function (IT) {
  var BASE = "https://m1kropet.github.io/vamos-espanol/";
  var REL = "https://github.com/m1kropet/vamos-espanol/releases/download/latest/";
  var P = function () { return (window.Capacitor && window.Capacitor.Plugins) || {}; };
  var native = function () { return !!IT.native; };

  function cmp(a, b) {
    var x = String(a || "0").split("."), y = String(b || "0").split(".");
    for (var i = 0; i < Math.max(x.length, y.length); i++) {
      var d = (parseInt(x[i], 10) || 0) - (parseInt(y[i], 10) || 0);
      if (d) return d > 0 ? 1 : -1;
    }
    return 0;
  }

  var U = {
    current: IT.VERSION || "0",
    apkInstalled: null, // версия установленного APK (Android)
    remote: null,
    state: "idle", // idle | checking | none | web | apk | downloading | error
    progress: 0,
    cmp: cmp,

    check: function (manual) {
      U.state = "checking"; U.emit();
      var url = (native() ? BASE + "version.json" : new URL("version.json", location.href).href) + "?t=" + Date.now();
      var info = native() && P().App && P().App.getInfo ? P().App.getInfo().catch(function () { return null; }) : Promise.resolve(null);
      return Promise.all([fetch(url, { cache: "no-store" }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); }), info]).then(function (res) {
        var v = res[0], appInfo = res[1];
        U.remote = v;
        if (appInfo && appInfo.version) U.apkInstalled = appInfo.version;
        if (cmp(v.version, U.current) <= 0) U.state = "none";
        else if (native() && v.apk && cmp(v.apk, U.apkInstalled || "0") > 0) U.state = "apk";
        else U.state = "web";
        U.emit();
        if (U.state !== "none") U.announce(manual);
        else if (manual) IT.toast(IT.icon("check") + " У вас последняя версия " + U.current, "ok");
        return U.state;
      }).catch(function (e) {
        U.state = "error"; U.emit();
        if (manual) IT.toast("Не удалось проверить обновления (нет интернета?)", "warn");
      });
    },

    // Объявление о новой версии
    announce: function (manual) {
      var v = U.remote;
      var key = "vamos-upd-seen-" + v.version;
      if (!manual) { try { if (sessionStorage.getItem(key)) return; sessionStorage.setItem(key, "1"); } catch (e) { } }
      var notes = (v.notes || []).map(function (n) { return "<li>" + IT.esc(n) + "</li>"; }).join("");
      var apk = U.state === "apk";
      var m = IT.modal('<div class="upd"><div class="upd-ico">' + IT.icon("sparkles") + '</div><h3 class="m-title">Доступно обновление ' + IT.esc(v.version) + "</h3>" +
        '<p class="muted sm">У вас версия ' + IT.esc(U.current) + ". " + (apk ? "Нужна новая сборка приложения — она скачается и установится поверх текущей, прогресс сохранится." : "Обновление займёт несколько секунд, прогресс сохранится.") + "</p>" +
        (notes ? '<ul class="upd-notes sm">' + notes + "</ul>" : "") +
        '<div class="upd-bar" hidden><i></i></div><p class="sm upd-err" hidden></p>' +
        '<div class="row gap end mt"><button class="btn ghost" data-close>Позже</button><button class="btn primary" data-upd>' + IT.icon("refresh") + " " + (apk ? "Скачать и установить" : "Обновить") + "</button></div></div>");
      m.querySelector("[data-upd]").onclick = function () { U.apply(m); };
    },

    apply: function (m) {
      if (U.state === "apk") return U.installApk(m);
      if (native()) return U.applyNativeWeb(m);
      return U.applyWeb();
    },

    // Сайт/PWA: новый service worker + перезагрузка
    applyWeb: function () {
      IT.toast("Обновляю…");
      var reload = function () { location.reload(); };
      if (!("serviceWorker" in navigator)) return reload();
      var done = false, go = function () { if (!done) { done = true; reload(); } };
      navigator.serviceWorker.addEventListener("controllerchange", go);
      navigator.serviceWorker.getRegistration().then(function (r) { return r && r.update(); }).catch(function () { }).then(function () { setTimeout(go, 2500); });
    },

    // Android: обновление интерфейса без переустановки (плагин @capgo/capacitor-updater)
    applyNativeWeb: function (m) {
      var CU = P().CapacitorUpdater;
      if (!CU || !CU.download) { U.state = "apk"; return U.installApk(m); }
      var v = U.remote.version;
      var bar = m && m.querySelector(".upd-bar"), btn = m && m.querySelector("[data-upd]"), note = m && m.querySelector(".upd-err");
      if (bar) bar.hidden = false;
      if (note) note.hidden = true;
      if (btn) { btn.disabled = true; btn.textContent = "Скачиваю…"; }
      U.state = "downloading"; U.emit();
      if (IT.store) IT.store.save();
      if (IT.cloud && IT.cloud.flush) IT.cloud.flush();
      var lst = null;
      try { lst = CU.addListener("download", function (e) { if (bar && e && e.percent != null) bar.querySelector("i").style.width = Math.max(5, e.percent) + "%"; }); } catch (e) { }
      var finished = false;
      var fail = function (msg) {
        if (finished) return; finished = true;
        U.state = "web"; U.emit();
        if (bar) bar.hidden = true;
        if (btn) { btn.disabled = false; btn.textContent = "Повторить"; }
        if (note) {
          note.hidden = false;
          note.innerHTML = "Не получилось скачать обновление" + (msg ? " (" + IT.esc(String(msg).slice(0, 120)) + ")" : "") + '. Можно установить новую версию файлом — прогресс сохранится. <button class="link" data-upd-apk>Скачать установочный файл</button>';
          note.querySelector("[data-upd-apk]").onclick = function () { U.installApk(m); };
        }
      };
      var timer = setTimeout(function () { fail("нет ответа 90 с"); }, 90000);
      return CU.download({ url: REL + "web-" + v + ".zip", version: v }).then(function (bundle) {
        if (finished) return;
        finished = true; clearTimeout(timer);
        if (btn) btn.textContent = "Перезапуск…";
        return CU.set({ id: bundle.id }); // приложение перезапустится уже с новой версией
      }).catch(function (e) {
        clearTimeout(timer); console.warn("OTA", e);
        fail(e && (e.message || e.errorMessage || e));
      }).then(function () { if (lst && lst.then) lst.then(function (h) { h && h.remove && h.remove(); }); });
    },

    // Android: новая сборка APK — скачивается и открывается установщик (ставится поверх, данные сохраняются)
    installApk: function (m) {
      var url = REL + "Vamos.apk?v=" + encodeURIComponent((U.remote && U.remote.apk) || Date.now());
      if (m && m.close) m.close();
      IT.modal('<h3 class="m-title">Установка новой версии</h3><ol class="sm upd-steps"><li>Сейчас начнётся загрузка файла <b>Vamos.apk</b> (~5 МБ).</li><li>Когда загрузка закончится, нажмите на уведомление <b>«Vamos.apk»</b> (или откройте его в «Загрузках»).</li><li>Нажмите <b>«Обновить»</b>. Прогресс и настройки сохранятся.</li></ol><p class="xs muted">Если Android спросит разрешение на установку из этого источника — разрешите один раз.</p><p class="xs muted">Если Android пишет «Приложение не установлено», у вас стоит самая первая сборка со старой подписью: войдите через Google (Профиль), удалите приложение и установите файл заново — прогресс вернётся после входа.</p><div class="row gap end mt"><button class="btn primary" data-close>Понятно</button></div>');
      if (P().Browser && P().Browser.open) P().Browser.open({ url: url });
      else window.open(url, "_blank");
    },

    emit: function () { if (IT.store) IT.store.emit("update"); },

    // карточка в профиле
    card: function () {
      var s = U.state, v = U.remote;
      var line = s === "checking" ? "Проверяю…" : s === "none" ? IT.icon("check") + " Установлена последняя версия" : (s === "web" || s === "apk") && v ? '<b class="ok-t">Доступна версия ' + IT.esc(v.version) + "</b>" : s === "downloading" ? "Загружаю обновление…" : s === "error" ? "Не удалось проверить (нет интернета?)" : "";
      return "<h3>" + IT.icon("refresh") + ' Обновления</h3><p class="sm">Версия <b>' + IT.esc(U.current) + "</b>" + (U.apkInstalled ? ' · сборка Android <span class="muted">' + IT.esc(U.apkInstalled) + "</span>" : "") + '</p><p class="sm upd-line">' + line + "</p>" +
        '<div class="row gap wrap mt-s">' + ((s === "web" || s === "apk") ? '<button class="btn primary sm" data-upd-now>' + IT.icon("refresh") + " Обновить</button>" : '<button class="btn ghost sm" data-upd-check>Проверить обновления</button>') + "</div>" +
        '<p class="xs muted mt-s">' + (native() ? 'Приложение само проверяет обновления при запуске. Обычно обновление ставится за несколько секунд без переустановки. Если не получается — <button class="link" data-upd-apk>скачайте установочный файл</button>: он встанет поверх, прогресс сохранится.' : "Сайт обновляется сам; если вышла новая версия, появится уведомление.") + "</p>";
    },

    init: function () {
      if (location.protocol === "file:") return;
      var CU = P().CapacitorUpdater;
      if (CU && CU.notifyAppReady) CU.notifyAppReady().catch(function () { }); // подтверждаем, что новая версия запустилась
      setTimeout(function () { U.check(false); }, 2500);
      setInterval(function () { if (!document.hidden) U.check(false); }, 6 * 3600 * 1000);
      if (P().App && P().App.addListener) P().App.addListener("resume", function () { if (Date.now() - (U._last || 0) > 3600e3) { U._last = Date.now(); U.check(false); } });
      if (IT.store) IT.store.on(function (ev) { if (ev === "update") { var el = IT.$(".upd-card"); if (el) el.innerHTML = U.card(); } });
      document.addEventListener("click", function (e) { if (e.target.closest && e.target.closest(".upd-card [data-upd-apk]")) U.installApk(); });
    },
  };
  IT.update = U;
})(window.IT);
