/* Интерактивные диалоги с персонажами + свободный разговор с ИИ */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  function dnorm(s) { return " " + IT.stripAcc(IT.norm(s)).replace(/'/g, " ").replace(/\s+/g, " ").trim() + " "; }
  IT.dlgMatch = function (ans, groups) {
    var a = dnorm(ans);
    var missing = [];
    groups.forEach(function (g) { if (!g.some(function (alt) { return a.indexOf(dnorm(alt)) >= 0; })) missing.push(g[0]); });
    return { ok: !missing.length, missing: missing };
  };
  function avatar(ch, size) {
    var ini = ch.name.split(" ").map(function (p) { return p.charAt(0); }).join("").slice(0, 2);
    return '<span class="avatar" style="background:' + ch.color + (size ? ";width:" + size + "px;height:" + size + "px;font-size:" + size * .38 + "px" : "") + '">' + esc(ini) + "</span>";
  }
  function unlocked(d) { return !d.unlock || IT.prog.lessonDone(d.unlock); }

  IT.views.dialogues = function (main) {
    var st = S.state;
    var html = '<div class="page-head"><h1>' + t("navDialogues") + '</h1><p class="muted">' + t("dlgSub") + "</p></div>";
    html += '<div class="card ai-card" data-ai-card><div class="row gap">' + '<span class="avatar ai">' + IT.icon("sparkles") + '</span><div class="grow"><h3>' + t("aiTalk") + '</h3><p class="muted sm">' + t("aiTalkSub") + '</p></div></div><label class="sm vsel mt-s">' + IT.icon("globe") + " " + t("aiDialect") + ' <select data-aidial><option value="neutral">' + t("neutral") + "</option>" + IT.dialects.map(function (d) { return '<option value="' + d.id + '"' + (S.state.aiDialect === d.id ? " selected" : "") + ">" + d.flag + " " + esc(d.short) + "</option>"; }).join("") + '</select></label><div class="chips mt-s">' +
      ["En el bar", "En el tren", "En el mercado", "En el médico", "Una entrevista de trabajo", "Tema libre"].map(function (s) { return '<button class="chip" data-ai="' + esc(s) + '">' + esc(s) + "</button>"; }).join("") + '</div><div class="ai-status muted xs mt-s"></div></div>';
    html += '<div class="grid dlg-grid">' + IT.dialogues.map(function (d, i) {
      var ok = unlocked(d), rec = st.dlg[d.id];
      var lockL = d.unlock && IT.lessonById[d.unlock];
      return '<div class="card dlg-card' + (ok ? "" : " locked") + '" data-dlg="' + d.id + '">' + IT.scene(d.scene, "dlg-scene") + '<div class="dlg-info"><div class="row gap">' + avatar(d.char) + '<div class="grow"><span class="eyebrow">' + d.level + " · " + t("difficulty") + " " + "●".repeat(Math.min(5, Math.ceil((i + 1) / 2))) + '</span><h3>' + esc(IT.tt(d)) + '</h3></div></div><p class="sm muted">' + esc(d.char.name) + ", " + esc(d.char.role) + " · " + esc(d.place) + "</p>" +
        (ok ? (rec ? '<span class="chip ok sm">' + t("best") + ": " + rec.best + "%</span>" : '<span class="chip soft sm">' + t("newDlg") + "</span>") : '<span class="lock-note sm">' + IT.icon("lock") + " " + t("unlockAfter") + " «" + esc(lockL ? IT.tt(lockL) : "") + "»</span>") + "</div></div>";
    }).join("") + "</div>";
    main.innerHTML = html;
    main.querySelector("[data-aidial]").onchange = function (e) { S.state.aiDialect = e.target.value; S.save(); };
    var status = main.querySelector(".ai-status");
    status.textContent = t("aiChecking");
    IT.aiAvailable().then(function (ok) { status.textContent = ok ? t("aiReady") : t("aiUnavailable"); main.querySelector("[data-ai-card]").classList.toggle("disabled", !ok); });
    main.onclick = function (e) {
      var a = e.target.closest("[data-ai]");
      if (a) return IT.aiAvailable().then(function (ok) { if (ok) aiRoleplay(a.getAttribute("data-ai")); else IT.toast(t("aiUnavailable"), "warn"); });
      var c = e.target.closest("[data-dlg]"); if (!c) return;
      var d = IT.dialogues.find(function (x) { return x.id === c.getAttribute("data-dlg"); });
      if (!unlocked(d)) return IT.toast(IT.icon("lock") + " " + t("dlgLocked"), "warn");
      playDialogue(d);
    };
  };

  /* ===================== Сценарный диалог ===================== */
  function playDialogue(d) {
    var i = 0, points = 0, max = 0, hintUsed = false, tries = 0;
    IT.activeActivity = "dialogue";
    var o = IT.openOverlay('<div class="player chat-player"><header class="pl-top"><button class="icon-btn" data-x>' + IT.icon("close") + "</button>" + avatar(d.char, 36) + '<div class="grow"><b>' + esc(d.char.name) + '</b><div class="xs muted">' + esc(d.place) + '</div></div><div class="pl-bar sm"><i></i></div></header><div class="pl-body chat-body"><div class="chat"></div></div><footer class="composer"></footer></div>');
    var chat = o.querySelector(".chat"), comp = o.querySelector(".composer"), body = o.querySelector(".chat-body");
    o.querySelector("[data-x]").onclick = IT.closeOverlay;
    function scroll() { setTimeout(function () { body.scrollTop = body.scrollHeight; }, 30); }
    function npc(step) {
      var g = (step.gloss || []);
      var el = IT.h('<div class="msg npc">' + avatar(d.char) + '<div class="bub-wrap"><div class="bub">' + esc(step.npc) + '<div class="bub-tools">' + '<button class="spk" data-say="' + esc(step.npc) + '" data-lang="' + (d.voice || "") + '">' + IT.icon("speaker") + '</button><button class="spk" data-say="' + esc(step.npc) + '" data-lang="' + (d.voice || "") + '" data-slow>' + IT.icon("turtle") + '</button><button class="spk" data-trn>' + IT.icon("eye") + '</button></div><div class="tr-reveal hidden">' + esc(step.ru) + "</div></div>" +
        (g.length ? '<div class="gloss-mini">' + g.map(function (x) { return '<button class="gm" data-gm="' + esc(x[1]) + '">' + esc(x[0]) + "</button>"; }).join("") + "</div>" : "") + "</div></div>");
      el.querySelector("[data-trn]").onclick = function () { el.querySelector(".tr-reveal").classList.toggle("hidden"); hintUsed = true; };
      el.querySelectorAll("[data-gm]").forEach(function (b) { b.onclick = function () { b.classList.toggle("open"); if (!b.querySelector("small")) b.insertAdjacentHTML("beforeend", "<small>" + esc(b.getAttribute("data-gm")) + "</small>"); }; });
      chat.appendChild(el); scroll();
      if (S.state.profile.autoplay) IT.audio.speak(step.npc, { lang: d.voice });
    }
    function me(text, ok) { chat.appendChild(IT.h('<div class="msg me"><div class="bub ' + (ok ? "ok" : "bad") + '">' + esc(text) + IT.icon(ok ? "check" : "close") + "</div></div>")); scroll(); }
    function coach(html, kind) { chat.appendChild(IT.h('<div class="coach ' + (kind || "") + '">' + IT.icon("tutor") + "<div>" + html + "</div></div>")); scroll(); }
    function step() {
      o.querySelector(".pl-bar i").style.width = Math.round(i / (d.steps.length - 1) * 100) + "%";
      var s = d.steps[i];
      npc(s);
      if (!s.task) return end();
      hintUsed = false; tries = 0; max += 2;
      composer(s);
    }
    function composer(s) {
      comp.innerHTML = '<div class="task">' + IT.icon("target") + "<span>" + esc(s.task) + '</span></div><div class="comp-row"><textarea rows="1" placeholder="' + t("answerItalian") + '" autocapitalize="off" spellcheck="false"></textarea><button class="btn primary send" data-send aria-label="' + t("send") + '">' + IT.icon("send") + '</button></div><div class="comp-tools"><button class="link sm" data-hint>' + IT.icon("bulb") + " " + t("hint") + '</button><button class="link sm" data-opts>' + IT.icon("chat") + " " + t("showOptions") + '</button><span class="keys inline">' + ["á", "é", "í", "ó", "ú", "ñ", "¿", "¡"].map(function (c) { return '<button class="key" data-key="' + c + '">' + c + "</button>"; }).join("") + '</span></div><div class="opt-slot"></div>';
      var ta = comp.querySelector("textarea");
      setTimeout(function () { ta.focus(); }, 80);
      ta.onkeydown = function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
      comp.querySelectorAll("[data-key]").forEach(function (k) { k.onmousedown = function (e) { e.preventDefault(); }; k.onclick = function () { ta.value += k.getAttribute("data-key"); ta.focus(); }; });
      comp.querySelector("[data-send]").onclick = send;
      comp.querySelector("[data-hint]").onclick = function () {
        hintUsed = true;
        var words = s.model.split(" ");
        coach(t("hintStart") + " <b>" + esc(words.slice(0, Math.max(1, Math.ceil(words.length / 3))).join(" ")) + " …</b>" + (s.tip ? '<br><span class="sm">' + esc(s.tip) + "</span>" : ""));
      };
      comp.querySelector("[data-opts]").onclick = function () {
        hintUsed = true;
        var slot = comp.querySelector(".opt-slot");
        slot.innerHTML = '<div class="opts compact">' + IT.shuffle(s.opts).map(function (x) { return '<button class="opt" data-v="' + esc(x) + '">' + esc(x) + "</button>"; }).join("") + "</div>";
        slot.querySelectorAll(".opt").forEach(function (b) { b.onclick = function () { ta.value = b.getAttribute("data-v"); send(); }; });
      };
      function send() {
        var v = ta.value.trim(); if (!v) return;
        var r = IT.dlgMatch(v, s.accept);
        // выбор неверного готового варианта — тоже ошибка
        if (r.ok && s.opts.indexOf(v) > 0) r = { ok: false, missing: [] };
        me(v, r.ok);
        if (r.ok) {
          var p = hintUsed ? 1 : 2; points += p; IT.audio.sfx("ok");
          coach("<b>" + (p === 2 ? "¡Perfecto!" : "¡Bien!") + "</b> " + (IT.norm(v) !== IT.norm(s.model) ? t("alsoSay") + " <i>" + esc(s.model) + "</i>" + IT.sp(s.model) : "") + (s.tip ? '<br><span class="sm">' + esc(s.tip) + "</span>" : ""), "ok");
          comp.innerHTML = ""; i++; setTimeout(step, 900);
        } else {
          tries++; IT.audio.sfx("bad");
          coach("<b>" + t("notQuite") + "</b> " + (r.missing.length ? t("missingKey") + " <b>" + r.missing.map(esc).join(", ") + "</b>. " : "") + t("modelAnswer") + " <i>" + esc(s.model) + "</i>" + IT.sp(s.model) + (s.tip ? '<br><span class="sm">' + esc(s.tip) + "</span>" : "") +
            '<div class="row gap mt-s"><button class="btn ghost sm" data-retry>' + t("tryAgain") + '</button><button class="btn primary sm" data-useit>' + t("useAndGo") + "</button></div>", "bad");
          var last = chat.lastElementChild;
          last.querySelector("[data-retry]").onclick = function () { last.querySelector(".row").remove(); hintUsed = true; ta.value = ""; ta.focus(); };
          last.querySelector("[data-useit]").onclick = function () { last.querySelector(".row").remove(); me(s.model, true); comp.innerHTML = ""; i++; setTimeout(step, 600); };
        }
      }
    }
    function end() {
      IT.activeActivity = null;
      var pct = max ? Math.round(points / max * 100) : 100, st = S.state, rec = st.dlg[d.id] || {};
      st.dlg[d.id] = { best: Math.max(rec.best || 0, pct), done: (rec.done || 0) + 1 };
      st.cnt.dlg++; IT.questProgress("dialogue", 1);
      var xp = points + 5; IT.addXp(xp, "dialogue"); IT.checkAch(); S.save();
      if (pct >= 80) IT.confetti();
      comp.innerHTML = '<div class="dlg-end"><div><b>' + (pct >= 80 ? "¡Fantástico!" : "¡Bien!") + "</b> " + t("dlgScore") + " " + pct + "% · +" + xp + ' XP</div><div class="row gap"><button class="btn ghost" data-again>' + IT.icon("refresh") + " " + t("again") + '</button><button class="btn primary" data-fin>' + t("continue") + "</button></div></div>";
      comp.querySelector("[data-again]").onclick = function () { playDialogue(d); };
      comp.querySelector("[data-fin]").onclick = IT.closeOverlay;
    }
    step();
  }

  /* ===================== Свободный разговор с ИИ ===================== */
  function aiVoice() { var d = IT.dialects.find(function (x) { return x.id === S.state.aiDialect; }); return d ? d.voice : (S.state.profile.variant || "es-ES"); }
  function aiRoleplay(scenario) {
    var st = S.state, cefr = IT.prog.cefr(), history = [];
    IT.activeActivity = "ai-dialogue";
    var o = IT.openOverlay('<div class="player chat-player"><header class="pl-top"><button class="icon-btn" data-x>' + IT.icon("close") + '</button><span class="avatar ai">' + IT.icon("sparkles") + '</span><div class="grow"><b>' + esc(scenario) + '</b><div class="xs muted">' + t("aiTalk") + " · " + cefr + '</div></div></header><div class="pl-body chat-body"><div class="chat"></div></div><footer class="composer"><div class="comp-row"><textarea rows="1" placeholder="' + t("answerItalian") + '" spellcheck="false"></textarea><button class="btn primary send" data-send>' + IT.icon("send") + '</button></div><div class="comp-tools"><button class="link sm" data-help>' + IT.icon("bulb") + " " + t("helpReply") + "</button></div></footer></div>");
    var chat = o.querySelector(".chat"), ta = o.querySelector("textarea"), body = o.querySelector(".chat-body"), busy = false, lastHint = "";
    o.querySelector("[data-x]").onclick = IT.closeOverlay;
    function scroll() { setTimeout(function () { body.scrollTop = body.scrollHeight; }, 30); }
    var known = IT.allLessons.filter(function (l) { return IT.prog.lessonDone(l.id); }).map(function (l) { return l.t; }).join("; ") || "только начинает";
    function prompt(userMsg) {
      var convo = history.map(function (h) { return (h.r === "u" ? "Ученик: " : "Персонаж: ") + h.c; }).join("\n");
      var dv = S.state.aiDialect || "neutral", dvTxt = dv === "neutral" ? "нейтральный испанский" : (IT.dialects.find(function (d) { return d.id === dv; }) || {}).name;
      return "Ты — персонаж ролевой игры для изучения испанского языка. Вариант речи персонажа: " + dvTxt + " (используй характерную лексику и грамматику этого варианта, но умеренно, и объясняй местные слова в поле correction или hint). Сценарий: «" + scenario + "». Ученик — русскоговорящий, уровень " + cefr + ". Пройденные темы: " + known + ".\n" +
        "Правила: говори ТОЛЬКО по-испански в реплике персонажа, короткими фразами (1–2 предложения) уровня " + cefr + ", веди сцену вперёд и задавай вопрос, чтобы ученик ответил. Если в последней реплике ученика есть ошибки — кратко объясни их по-русски в поле correction (иначе null). В hint дай пример возможного ответа ученика на итальянском.\n" +
        "Ответь строго JSON-объектом: {\"it\": \"реплика персонажа\", \"ru\": \"перевод реплики на русский\", \"correction\": \"разбор ошибок по-русски или null\", \"hint\": \"пример ответа ученика\"}.\n\nРазговор:\n" + (convo || "(начало сцены — начни разговор первым)") + (userMsg ? "\nУченик: " + userMsg : "");
    }
    function botMsg(r) {
      var el = IT.h('<div class="msg npc"><span class="avatar ai">' + IT.icon("sparkles") + '</span><div class="bub-wrap"><div class="bub">' + esc(r.it) + '<div class="bub-tools">' + '<button class="spk" data-say="' + esc(r.it) + '" data-lang="' + aiVoice() + '">' + IT.icon("speaker") + '</button><button class="spk" data-trn>' + IT.icon("eye") + '</button></div><div class="tr-reveal hidden">' + esc(r.ru || "") + "</div></div></div></div>");
      el.querySelector("[data-trn]").onclick = function () { el.querySelector(".tr-reveal").classList.toggle("hidden"); };
      chat.appendChild(el); scroll();
      if (st.profile.autoplay) IT.audio.speak(r.it, { lang: aiVoice() });
    }
    function ask(userMsg) {
      busy = true;
      var typing = IT.h('<div class="msg npc typing"><span class="avatar ai">' + IT.icon("sparkles") + '</span><div class="bub"><i></i><i></i><i></i></div></div>');
      chat.appendChild(typing); scroll();
      IT.aiJSON(prompt(userMsg)).then(function (r) {
        typing.remove();
        if (!r || !r.it) throw { message: "format" };
        if (r.correction && userMsg) chat.appendChild(IT.h('<div class="coach">' + IT.icon("tutor") + "<div>" + esc(r.correction) + "</div></div>"));
        if (userMsg) history.push({ r: "u", c: userMsg });
        history.push({ r: "a", c: r.it }); lastHint = r.hint || "";
        botMsg(r);
        IT.addXp(userMsg ? 2 : 0, "ai");
      }).catch(function (e) {
        typing.remove();
        chat.appendChild(IT.h('<div class="coach bad">' + IT.icon("close") + "<div>" + esc(IT.aiErrorText(e)) + "</div></div>"));
      }).then(function () { busy = false; scroll(); });
    }
    function send() {
      var v = ta.value.trim(); if (!v || busy) return;
      chat.appendChild(IT.h('<div class="msg me"><div class="bub">' + esc(v) + "</div></div>")); ta.value = ""; scroll();
      ask(v);
    }
    o.querySelector("[data-send]").onclick = send;
    ta.onkeydown = function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
    o.querySelector("[data-help]").onclick = function () {
      if (lastHint) chat.appendChild(IT.h('<div class="coach">' + IT.icon("bulb") + "<div>" + t("youCanSay") + " <i>" + esc(lastHint) + "</i></div></div>")); scroll();
    };
    ask(null);
  }
})(window.IT);
