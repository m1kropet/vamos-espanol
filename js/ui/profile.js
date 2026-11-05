/* Профиль и настройки, достижения, данные; первый запуск (онбординг) */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  function seg(name, opts, val) {
    return '<div class="seg" data-set="' + name + '">' + opts.map(function (o) { return '<button data-v="' + o[0] + '" class="' + (String(val) === String(o[0]) ? "on" : "") + '">' + o[1] + "</button>"; }).join("") + "</div>";
  }

  IT.views.profile = function (main) {
    var st = S.state, p = st.profile, lv = IT.levelFromXp(st.xp);
    var got = IT.ACH.filter(IT.achGot).length;
    var sync = S.remote ? (S.remoteStatus === "synced" ? t("syncOn") : t("syncErr")) : t("syncLocal");
    var voice = !IT.audio.available() ? t("noSpeech") : IT.audio.hasSpanish() ? t("voiceOk") + " " + IT.audio.voiceName() : t("noItVoice");
    var html = '<div class="page-head"><h1>' + t("navProfile") + "</h1></div>" +
      '<div class="card prof-head"><div class="big-badge">' + lv.level + '</div><div class="grow"><h3>' + t("level") + " " + lv.level + " · " + IT.prog.cefr() + '</h3><div class="bar"><i style="width:' + lv.pct + '%"></i></div><p class="muted sm">' + st.xp + " XP · " + t("toNext") + " " + (lv.need - lv.cur) + ' XP</p></div><div class="row gap"><span class="chip flame">' + IT.icon("flame") + IT.streakAlive() + '</span><span class="chip gold">' + IT.icon("trophy") + got + "/" + IT.ACH.length + "</span></div></div>";
    html += '<div class="grid two"><div class="card settings"><h3>' + IT.icon("gear") + " " + t("settings") + "</h3>" +
      row(t("uiLang"), seg("ui", [["ru", "Русский"], ["es", "Español"]], p.ui)) +
      row(t("theme"), seg("theme", [["light", IT.icon("sun") + " " + t("light")], ["dark", IT.icon("moon") + " " + t("dark")], ["auto", t("auto")]], p.theme)) +
      row(t("dailyGoal"), seg("goal", [[10, "10 " + t("min")], [15, "15"], [20, "20"], [30, "30"]], p.goal)) +
      row(t("speechSpeed"), seg("speed", [[0.7, t("spSlow")], [0.9, t("spMid")], [1.05, t("spNatural")]], p.speed) + '<button class="link sm" data-say="¡Hola! ¿Qué tal? Bienvenido al curso de español.">' + IT.icon("speaker") + " " + t("testVoice") + "</button>") +
      row(t("variant"), seg("variant", [["es-ES", "🇪🇸 " + t("varSpain")], ["es-MX", "🇲🇽 " + t("varLatam")]], p.variant || "es-ES") + '<span class="xs muted">' + t("variantNote") + "</span>") +
      row(t("sfx"), seg("sfx", [["true", t("on")], ["false", t("off")]], p.sfx)) +
      row(t("autoplay"), seg("autoplay", [["true", t("on")], ["false", t("off")]], p.autoplay)) +
      '<p class="muted xs">' + IT.icon("speaker") + " " + esc(voice) + "</p></div>";
    html += '<div class="card"><h3>' + IT.icon("refresh") + " " + t("data") + '</h3><p class="sm">' + IT.icon("globe") + " " + esc(sync) + '</p><p class="muted xs">' + t("dataNote") + '</p><div class="row gap wrap mt-s"><button class="btn ghost sm" data-export>' + t("exportBtn") + '</button><button class="btn ghost sm" data-import>' + t("importBtn") + '</button><button class="btn ghost sm" data-placement>' + t("pPlacement") + '</button><button class="btn danger sm" data-reset>' + t("resetBtn") + "</button></div>" +
      '<h3 class="mt">' + IT.icon("sparkles") + " " + t("connections") + '</h3><div class="conn"><p class="sm"><b>' + t("connAI") + '</b> — <span class="ai-st muted">' + t("aiChecking") + '</span></p><p class="muted xs">' + t("connAINote") + '</p><p class="sm"><b>' + t("connVoice") + "</b> — " + (IT.audio.available() ? t("on") : t("off")) + '</p><p class="muted xs">' + t("connVoiceNote") + '</p><p class="sm"><b>' + t("connRec") + "</b> — " + (IT.audio.recognitionSupported() ? t("connRecMaybe") : t("off")) + '</p><p class="muted xs">' + t("connRecNote") + "</p></div></div></div>";
    html += appCard();
    html += '<div class="card"><h3>' + IT.icon("trophy") + " " + t("achievements") + " · " + got + "/" + IT.ACH.length + '</h3><div class="ach-grid">' + IT.ACH.map(function (a) {
      var g = IT.achGot(a);
      return '<div class="ach' + (g ? " got" : "") + '"><span class="ach-ico">' + (g ? a.i : IT.icon("lock")) + "</span><b>" + esc(IT.tt(a)) + '</b><span class="xs muted">' + esc(a.d) + "</span></div>";
    }).join("") + "</div></div>";
    main.innerHTML = html;
    IT.aiAvailable().then(function (ok) { var el = main.querySelector(".ai-st"); if (el) el.textContent = ok ? t("aiReady") : t("aiUnavailable"); });
    var ms = main.querySelector("[data-model]"); if (ms) ms.onchange = function () { IT.api.setModel(ms.value); IT.resetAI(); IT.toast("Модель: " + ms.value, "ok"); };
    main.onclick = function (e) {
      if (e.target.closest("[data-model]")) return;
      var b = e.target.closest("[data-set] [data-v]");
      if (b) {
        var key = b.parentNode.getAttribute("data-set"), v = b.getAttribute("data-v");
        if (key === "goal") v = +v; else if (key === "speed") v = +v; else if (key === "sfx" || key === "autoplay") v = v === "true";
        p[key] = v; S.save(); IT.applyTheme();
        if (key === "speed" || key === "variant") IT.audio.speak("¡Hola! ¿Qué tal? Me llamo Elena.");
        return IT.render();
      }
      if (e.target.closest("[data-export]")) {
        var txt = S.exportJSON();
        var m = IT.modal('<h3 class="m-title">' + t("exportBtn") + '</h3><p class="muted sm">' + t("exportNote") + '</p><textarea class="code" readonly rows="6">' + esc(txt) + '</textarea><div class="row gap end mt"><button class="btn primary" data-copy>' + t("copy") + "</button></div>");
        m.querySelector("[data-copy]").onclick = function () {
          var ta = m.querySelector("textarea"); ta.select();
          (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(function () { IT.toast(t("copied"), "ok"); }).catch(function () { try { document.execCommand("copy"); IT.toast(t("copied"), "ok"); } catch (er) { IT.toast(t("copyManual"), "warn"); } });
        };
      }
      if (e.target.closest("[data-import]")) {
        var m2 = IT.modal('<h3 class="m-title">' + t("importBtn") + '</h3><p class="muted sm">' + t("importNote") + '</p><textarea class="code" rows="6" placeholder="{...}"></textarea><div class="row gap end mt"><button class="btn ghost" data-close>' + t("cancel") + '</button><button class="btn primary" data-do>' + t("importBtn") + "</button></div>");
        m2.querySelector("[data-do]").onclick = function () {
          try { S.importJSON(m2.querySelector("textarea").value); m2.close(); IT.applyTheme(); IT.render(); IT.toast(t("imported"), "ok"); }
          catch (er) { IT.toast(t("importErr"), "warn"); }
        };
      }
      if (e.target.closest("[data-install]")) return IT.pwa.install();
      if (e.target.closest("[data-savekey]")) { var v = main.querySelector("[data-apikey]").value.trim(); if (!v || v.indexOf("••") === 0) return IT.toast("Вставьте ключ целиком", "warn"); IT.api.setKey(v); IT.toast(IT.icon("check") + " Ключ сохранён на устройстве", "ok"); return IT.render(); }
      if (e.target.closest("[data-delkey]")) { IT.api.setKey(""); IT.toast("Ключ удалён", "ok"); return IT.render(); }
      if (e.target.closest("[data-testkey]")) { IT.toast("Проверяю…"); return IT.aiJSON('Ответь JSON {"ok": true}').then(function () { IT.toast(IT.icon("check") + " ИИ подключён и работает", "ok"); }).catch(function (er) { IT.toast(IT.aiErrorText(er), "warn"); }); }
      if (e.target.closest("[data-reset]")) IT.confirm(t("resetConfirm"), t("resetBtn"), function () { S.reset(); IT.applyTheme(); IT.onboarding(); }, true);
      if (e.target.closest("[data-placement]")) { IT.go("practice"); setTimeout(function () { var b2 = IT.$('[data-p="placement"]'); if (b2) b2.click(); }, 50); }
    };
  };
  function appCard() {
    var inClaude = IT.api.inClaude(), key = IT.api.key();
    var h = '<div class="card app-card"><h3>' + IT.icon("globe") + ' Приложение на телефоне</h3>';
    if (IT.pwa && IT.pwa.standalone) h += '<p class="sm ok-t">' + IT.icon("check") + (IT.native ? ' Android-приложение: работает без браузера и без интернета.</p>' : ' Приложение установлено и работает офлайн.</p>');
    else h += '<p class="sm muted">Установите ¡Vamos! на главный экран: откроется как обычное приложение, без адресной строки, и будет работать без интернета.</p><button class="btn primary" data-install>' + IT.icon("plus") + ' Установить приложение</button>';
    if (!inClaude) {
      h += '<h4 class="mt">' + IT.icon("sparkles") + ' ИИ: преподаватель, переводчик, разбор видео</h4><p class="sm muted">Вне claude.ai ИИ работает через Anthropic API. Нужен ваш ключ из console.anthropic.com (оплата по факту использования). Ключ хранится только на этом устройстве и отправляется только на api.anthropic.com.</p>' +
        '<div class="row gap wrap"><input class="key-in" type="password" data-apikey placeholder="sk-ant-…" value="' + (key ? "••••••••" + IT.esc(key.slice(-4)) : "") + '" autocomplete="off"><button class="btn ghost sm" data-savekey>Сохранить</button>' + (key ? '<button class="btn ghost sm" data-testkey>Проверить</button><button class="link sm danger-t" data-delkey>Удалить ключ</button>' : "") + "</div>" +
        '<label class="sm vsel mt-s">Модель <select data-model>' + [["claude-sonnet-5-5", "Sonnet — лучше качество"], ["claude-haiku-5-5", "Haiku — быстрее и дешевле"]].map(function (m) { return '<option value="' + m[0] + '"' + (IT.api.model() === m[0] ? " selected" : "") + ">" + m[1] + "</option>"; }).join("") + "</select></label>" +
        '<p class="xs muted mt-s">Прогресс хранится на телефоне. Чтобы перенести его с claude.ai или на другое устройство, используйте «Экспорт» и «Импорт» выше.</p>';
    }
    return h + "</div>";
  }
  function row(label, ctl) { return '<div class="set-row"><span>' + label + "</span><div>" + ctl + "</div></div>"; }

  /* ===================== Онбординг ===================== */
  IT.onboarding = function () {
    var st = S.state, p = st.profile, step = 0, choice = p.start || "never";
    var o = IT.openOverlay('<div class="player onb"><div class="pl-body"><div class="onb-in"></div></div></div>');
    var box = o.querySelector(".onb-in");
    var levels = [["never", "🌱", t("onbNever"), t("onbNeverSub")], ["few", "👋", t("onbFew"), t("onbFewSub")], ["simple", "🧩", t("onbSimple"), t("onbSimpleSub")], ["talk", "💬", t("onbTalk"), t("onbTalkSub")], ["test", "🎯", t("onbTest"), t("onbTestSub")]];
    var MAP = { never: 0, few: 2, simple: 4, talk: 7 };
    function draw() {
      if (step === 0) {
        box.innerHTML = IT.scene("madrid", "onb-scene") + '<h1>¡Bienvenido! <span class="muted">·</span> Добро пожаловать!</h1><p class="lead">' + t("onbWelcome") + '</p><div class="onb-feats">' +
          [["book", t("onbF1")], ["chat", t("onbF2")], ["refresh", t("onbF3")], ["tutor", t("onbF4")]].map(function (f) { return '<div class="feat">' + IT.icon(f[0]) + "<span>" + f[1] + "</span></div>"; }).join("") +
          '</div><p class="muted sm">' + t("uiLang") + ':</p><div>' + seg("ui", [["ru", "Русский"], ["es", "Español"]], p.ui) + '</div><button class="btn primary big mt" data-n>' + t("onbStart") + " " + IT.icon("chevron") + "</button>";
      } else if (step === 1) {
        box.innerHTML = '<h2>' + t("onbLevelQ") + '</h2><div class="onb-opts">' + levels.map(function (l) { return '<button class="onb-opt' + (choice === l[0] ? " on" : "") + '" data-c="' + l[0] + '"><span class="e">' + l[1] + "</span><span><b>" + l[2] + "</b><small>" + l[3] + "</small></span></button>"; }).join("") + '</div><div class="row gap between mt"><button class="btn ghost" data-b>' + IT.icon("back") + " " + t("back") + '</button><button class="btn primary" data-n>' + t("next") + "</button></div>";
      } else if (step === 2) {
        box.innerHTML = '<h2>' + t("onbGoalQ") + '</h2><p class="muted">' + t("onbGoalSub") + '</p><div class="onb-opts goals">' + [[10, t("g10")], [15, t("g15")], [20, t("g20")], [30, t("g30")]].map(function (g) { return '<button class="onb-opt' + (p.goal === g[0] ? " on" : "") + '" data-g="' + g[0] + '"><span class="e">' + g[0] + "</span><span><b>" + g[0] + " " + t("minPerDay") + "</b><small>" + g[1] + "</small></span></button>"; }).join("") + '</div><div class="row gap between mt"><button class="btn ghost" data-b>' + IT.icon("back") + " " + t("back") + '</button><button class="btn primary" data-n>' + t("next") + "</button></div>";
      } else {
        var u = IT.units[st.unlocked] || IT.units[0];
        box.innerHTML = IT.scene(u.scene, "onb-scene") + "<h2>" + t("onbPlan") + '</h2><div class="plan">' +
          '<div class="plan-row">' + IT.icon("path") + "<span>" + t("onbPlanStart") + " <b>" + esc(IT.tt(u)) + "</b> (" + u.level + ", " + esc(u.city) + ")</span></div>" +
          '<div class="plan-row">' + IT.icon("clock") + "<span>" + t("onbPlanGoal").replace("{n}", p.goal) + "</span></div>" +
          '<div class="plan-row">' + IT.icon("book") + "<span>" + t("onbPlanFlow") + "</span></div>" +
          '<div class="plan-row">' + IT.icon("refresh") + "<span>" + t("onbPlanSrs") + "</span></div>" +
          (st.unlocked > 0 ? '<div class="plan-row">' + IT.icon("bulb") + "<span>" + t("onbPlanSkip") + "</span></div>" : "") +
          '</div><button class="btn primary big mt" data-fin>' + IT.icon("play") + " ¡Vamos!</button>";
      }
      box.classList.remove("in"); void box.offsetWidth; box.classList.add("in");
      var pb = box.closest(".pl-body"); if (pb) pb.scrollTop = 0;
    }
    function onClick(e) {
      var u = e.target.closest('[data-set="ui"] [data-v]');
      if (u) { p.ui = u.getAttribute("data-v"); IT.applyTheme(); S.save(); IT.renderChrome(); return draw(); }
      var c = e.target.closest("[data-c]"); if (c) { choice = c.getAttribute("data-c"); return draw(); }
      var g = e.target.closest("[data-g]"); if (g) { p.goal = +g.getAttribute("data-g"); return draw(); }
      if (e.target.closest("[data-b]")) { step--; return draw(); }
      if (e.target.closest("[data-n]")) {
        if (step === 1) {
          p.start = choice;
          if (choice === "test") {
            return IT.placementTest(function (unitIdx) {
              st.unlocked = unitIdx; S.save();
              // тест закрыл оверлей — открываем онбординг снова и продолжаем с выбора цели
              var o2 = IT.openOverlay('<div class="player onb"><div class="pl-body"><div class="onb-in"></div></div></div>');
              box = o2.querySelector(".onb-in"); box.addEventListener("click", onClick);
              step = 2; draw();
            });
          }
          st.unlocked = MAP[choice] || 0;
        }
        step++; return draw();
      }
      if (e.target.closest("[data-fin]")) {
        p.onboarded = true; S.save(); IT.closeOverlay();
        IT.toast(IT.icon("sparkles") + " " + t("onbReady"), "ok");
      }
    }
    box.addEventListener("click", onClick);
    draw();
  };
})(window.IT);
