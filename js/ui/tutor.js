/* Виртуальный преподаватель: ИИ (возможность «sample» артефакта) + офлайн-режим по материалам курса */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  var sampleP = null;
  function getSample() {
    if (!sampleP) {
      sampleP = IT.api.inClaude() ? window.claude.use("sample").catch(function () { return null; }).then(function (s) { return s || IT.apiSample(); }) : Promise.resolve(IT.apiSample());
    }
    return sampleP;
  }
  IT.resetAI = function () { sampleP = null; };
  IT.aiAvailable = function () { return getSample().then(function (s) { return !!s; }); };
  IT.aiErrorText = function (e) {
    var c = e && e.code;
    if (c === "not_granted") return t("aiNotGranted");
    if (c === "rate_limited") return t("aiRate");
    if (c === "no_key") return "ИИ не подключён: добавьте ключ Anthropic API в Профиле.";
    if (c === "bad_key") return "Ключ API не подошёл — проверьте его в Профиле.";
    if (c === "offline") return "Нет интернета — ИИ заработает, когда появится сеть.";
    if (c === "api_error") return "Ошибка сервиса ИИ" + (e.message ? " (" + e.message + ")" : "") + ". Попробуйте ещё раз.";
    return t("aiError");
  };
  IT.aiJSON = function (prompt) {
    return getSample().then(function (s) {
      if (!s) throw { code: "not_granted" };
      if (typeof s.json === "function") return s.json(prompt, { modelTier: "default" });
      return s(prompt + "\nОтветь только JSON.").then(function (r) { var m = (r.text || "").match(/[\[{][\s\S]*[\]}]/); return JSON.parse(m ? m[0] : r.text); });
    });
  };

  function systemPrompt() {
    var st = S.state, cefr = IT.prog.cefr();
    var done = IT.allLessons.filter(function (l) { return IT.prog.lessonDone(l.id); }).map(function (l) { return l.t; });
    var weak = IT.weakTags().filter(function (w) { return w.acc < 80; }).slice(0, 4).map(function (w) { return IT.TAGS[w.tag] + " (" + w.acc + "%)"; });
    return "Ты — Елена (Profesora Elena), доброжелательный и терпеливый преподаватель испанского языка для русскоговорящих учеников в приложении ¡Vamos!\n" +
      "Уровень ученика: " + cefr + ". Пройденные уроки: " + (done.join("; ") || "пока ни одного — ученик начинает с нуля") + ". Слабые темы: " + (weak.join(", ") || "пока не выявлены") + ".\n" +
      "Правила:\n- Объясняй по-русски" + (/^(A1|A2)$/.test(cefr) ? " (ученик ещё не готов к объяснениям на итальянском)" : ", но можешь добавлять испанские фразы уровня ученика") + ". Простые слова, без лишней терминологии.\n" +
      "- Всегда давай примеры на испанском с переводом, разбирай трудные слова. Если уместно, упоминай различия Испании и Латинской Америки.\n- Если ученик пишет по-испански с ошибками — сначала аккуратно исправь: покажи неверное, верное и объясни почему.\n" +
      "- Указывай типичные ошибки русскоговорящих и исключения, когда это уместно.\n- Если просят упражнения — дай 4–6 заданий, ответы в конце под заголовком «Ответы».\n" +
      "- Подстраивай сложность под уровень " + cefr + ". Будь кратким: короткие абзацы, списки, **жирный** для ключевого. Не используй таблицы.";
  }

  /* Офлайн: поиск по теории курса */
  function searchTheory(q) {
    var toks = IT.stripAcc(q.toLowerCase()).split(/[^a-zа-яё0-9']+/i).filter(function (w) { return w.length >= 3; }).map(function (w) { return w.slice(0, Math.max(3, Math.min(6, w.length - 1))); });
    var res = [];
    IT.allLessons.forEach(function (l) {
      l.th.forEach(function (sec) {
        var head = IT.stripAcc((sec.h + " " + l.t + " " + (l.tags || []).join(" ")).toLowerCase()), bodyT = IT.stripAcc(sec.b.toLowerCase()), sc = 0;
        toks.forEach(function (tk) { if (head.indexOf(tk) >= 0) sc += 3; var m = bodyT.split(tk).length - 1; sc += Math.min(m, 4); });
        if (sc > 0) res.push({ l: l, sec: sec, sc: sc });
      });
    });
    return res.sort(function (a, b) { return b.sc - a.sc; }).slice(0, 2);
  }

  IT.tutorAsk = function (q) { IT._pendingAsk = q; IT.go("tutor"); };

  IT.tutorTab = "chat";
  IT.views.tutor = function (main) {
    var st = S.state;
    var tabs = '<div class="seg tutor-tabs">' + [["chat", IT.icon("tutor") + " " + t("tabTutor")], ["tr", IT.icon("search") + " " + t("tabTranslator")]].map(function (x) { return '<button data-tab="' + x[0] + '" class="' + (IT.tutorTab === x[0] ? "on" : "") + '">' + x[1] + "</button>"; }).join("") + "</div>";
    if (IT.tutorTab === "tr") {
      main.innerHTML = '<div class="tutor">' + tabs + '<div class="tr-box"></div></div>';
      main.querySelector(".tutor-tabs").onclick = function (e) { var b = e.target.closest("[data-tab]"); if (b) { IT.tutorTab = b.getAttribute("data-tab"); IT.views.tutor(main); } };
      IT.renderTranslator(main.querySelector(".tr-box"));
      return;
    }
    main.innerHTML = '<div class="tutor">' + tabs + '<div class="tutor-head card">' + '<span class="avatar big" style="background:#7a5c8a">PE</span><div class="grow"><h1>Profesora Elena</h1><p class="muted sm">' + t("tutorSub") + '</p><div class="ai-badge xs muted">' + t("aiChecking") + '</div></div><button class="btn ghost sm" data-clear>' + IT.icon("refresh") + " " + t("newChat") + '</button></div>' +
      '<div class="tutor-chat card"><div class="chat"></div></div>' +
      '<div class="quick chips">' + [["q1", t("tq1")], ["q2", t("tq2")], ["q3", t("tq3")], ["q4", t("tq4")], ["q5", t("tq5")]].map(function (q) { return '<button class="chip" data-q="' + q[0] + '">' + esc(q[1]) + "</button>"; }).join("") + '<button class="chip gold" data-gen>' + IT.icon("sparkles") + " " + t("genExercises") + "</button></div>" +
      '<div class="composer card"><div class="comp-row"><textarea rows="2" placeholder="' + t("tutorPh") + '"></textarea><button class="btn primary send" data-send>' + IT.icon("send") + "</button></div></div></div>";
    main.querySelector(".tutor-tabs").onclick = function (e) { var b = e.target.closest("[data-tab]"); if (b) { IT.tutorTab = b.getAttribute("data-tab"); IT.views.tutor(main); } };
    var chat = main.querySelector(".chat"), ta = main.querySelector("textarea"), badge = main.querySelector(".ai-badge"), busy = false, aiOn = false;
    var box = main.querySelector(".tutor-chat");
    function scroll() { setTimeout(function () { box.scrollTop = box.scrollHeight; }, 30); }
    function bubble(role, html) { var el = IT.h('<div class="tmsg ' + role + '">' + (role === "assistant" ? '<span class="avatar" style="background:#7a5c8a">PE</span>' : "") + '<div class="tbub">' + html + "</div></div>"); chat.appendChild(el); scroll(); return el; }
    function drawHistory() {
      chat.innerHTML = "";
      bubble("assistant", IT.mdAI(t("tutorHello")));
      st.tutorChat.forEach(function (m) { bubble(m.role, m.role === "assistant" ? IT.mdAI(m.content) : esc(m.content)); });
    }
    drawHistory();
    IT.aiAvailable().then(function (ok) {
      aiOn = ok;
      badge.innerHTML = ok ? IT.icon("sparkles") + " " + t("aiReady") : IT.icon("book") + " " + t("tutorOffline");
      if (IT._pendingAsk) { ta.value = IT._pendingAsk; IT._pendingAsk = null; send(); }
    });

    function send() {
      var q = ta.value.trim(); if (!q || busy) return;
      ta.value = ""; bubble("user", esc(q));
      st.cnt.tutor++; IT.questProgress("tutor", 1); IT.checkAch();
      if (!aiOn) return offline(q);
      busy = true;
      st.tutorChat.push({ role: "user", content: q });
      var msgs = st.tutorChat.slice(-12).map(function (m) { return { role: m.role, content: m.content }; });
      while (msgs.length && msgs[0].role !== "user") msgs.shift();
      msgs[0] = { role: "user", content: systemPrompt() + "\n\n---\nВопрос ученика:\n" + msgs[0].content };
      var el = bubble("assistant", '<span class="typing-dots"><i></i><i></i><i></i></span>'), tb = el.querySelector(".tbub");
      getSample().then(function (s) {
        return s(msgs, { cache: false, onText: function (u) { if (u.text && u.text !== "Thinking...") { tb.innerHTML = IT.mdAI(u.text); scroll(); } } });
      }).then(function (r) {
        tb.innerHTML = IT.mdAI(r.text);
        st.tutorChat.push({ role: "assistant", content: r.text }); S.save();
      }).catch(function (e) {
        st.tutorChat.pop();
        tb.innerHTML = '<p class="bad-t">' + esc(IT.aiErrorText(e) || "") + (e && e.text ? "</p>" + IT.mdAI(e.text) : "</p>");
        if (e && e.code === "not_granted") { aiOn = false; badge.innerHTML = IT.icon("book") + " " + t("tutorOffline"); }
      }).then(function () { busy = false; scroll(); });
    }
    function offline(q) {
      var found = searchTheory(q);
      var html = found.length ? "<p>" + t("offlineFound") + "</p>" + found.map(function (f, i) {
        return '<div class="off-sec"><span class="eyebrow">' + esc(f.l.t) + "</span><h4>" + esc(f.sec.h) + "</h4>" + IT.md(f.sec.b) + '<button class="btn ghost sm" data-open-th="' + f.l.id + '">' + IT.icon("book") + " " + t("openTheory") + "</button></div>";
      }).join("") : "<p>" + t("offlineNone") + "</p>";
      var el = bubble("assistant", html);
      el.querySelectorAll("[data-open-th]").forEach(function (b) { b.onclick = function () { IT.player.showTheory(IT.lessonById[b.getAttribute("data-open-th")], true); }; });
      S.save();
    }
    main.querySelector("[data-send]").onclick = send;
    ta.onkeydown = function (e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } };
    main.querySelector("[data-clear]").onclick = function () { st.tutorChat = []; S.save(); drawHistory(); };
    main.querySelectorAll("[data-q]").forEach(function (b) {
      b.onclick = function () { ta.value = t(b.getAttribute("data-q") + "p"); ta.focus(); ta.setSelectionRange(ta.value.length, ta.value.length); };
    });
    main.querySelector("[data-gen]").onclick = function () { genDialog(aiOn); };
  };

  /* Генерация интерактивных упражнений по теме */
  function genDialog(aiOn) {
    var topics = IT.allLessons.map(function (l) { return l; });
    var next = IT.prog.next(), defId = next && next.lesson ? next.lesson.id : topics[0].id;
    var m = IT.modal('<h3 class="m-title">' + IT.icon("sparkles") + " " + t("genExercises") + '</h3><p class="muted sm">' + (aiOn ? t("genSub") : t("genOffline")) + '</p><label class="form">' + t("topic") + '<select data-topic>' + topics.map(function (l) { return '<option value="' + l.id + '"' + (l.id === defId ? " selected" : "") + ">" + esc(l.level + " · " + l.t) + "</option>"; }).join("") + '</select></label><div class="row gap end mt"><button class="btn ghost" data-close>' + t("cancel") + '</button><button class="btn primary" data-go-gen>' + t("create") + '</button></div><div class="gen-status muted sm"></div>');
    m.querySelector("[data-go-gen]").onclick = function () {
      var l = IT.lessonById[m.querySelector("[data-topic]").value], status = m.querySelector(".gen-status"), btn = this;
      if (!aiOn) {
        m.close();
        var items = IT.buildWeak((l.tags || [])[0]);
        return IT.player.run({ kind: "practice", title: l.t, items: items.length ? items : IT.buildLesson(l).filter(function (i) { return i.stage !== "review"; }) });
      }
      btn.disabled = true; status.textContent = t("generating");
      var prompt = "Создай 6 упражнений по испанскому языку для русскоговорящего ученика уровня " + l.level + " по теме «" + l.t + "» (" + l.goal + ").\n" +
        "Смешай типы: 3 задания type \"choice\" (вопрос по-русски или фраза с пропуском ___, 3–4 варианта, answer — индекс верного с нуля), 2 задания type \"fill\" (фраза на испанском с пропуском ___, answer — пропущенное слово; допустимые варианты через /), 1 задание type \"translate\" (q — фраза по-русски, answer — перевод на испанский; варианты через /).\n" +
        "У каждого задания поле why — объяснение по-русски (1–3 предложения), почему ответ верный, с правилом. Для fill добавь hint — подсказку по-русски.\n" +
        "Ответь строго JSON: {\"items\": [{\"type\": \"choice\", \"q\": \"...\", \"options\": [\"...\"], \"answer\": 0, \"why\": \"...\"}, {\"type\": \"fill\", \"q\": \"...\", \"answer\": \"...\", \"hint\": \"...\", \"why\": \"...\"}]}";
      IT.aiJSON(prompt).then(function (r) {
        var items = IT.fromAI(r && (r.items || r));
        if (!items.length) throw { message: "empty" };
        m.close();
        IT.player.run({ kind: "ai", title: t("aiExercises") + ": " + l.t, items: items });
      }).catch(function (e) { btn.disabled = false; status.textContent = IT.aiErrorText(e); });
    };
  }
})(window.IT);
