/* Переводчик со сверкой: перевод ИИ + обратный перевод + сопоставление слов со словарём курса.
 * Сверка перевода слов словаря (по одному и пакетом). */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  /* Уточнённые переводы пользователя поверх словаря курса */
  IT.applyOverrides = function () {
    var ov = S.state.trOverrides || {};
    Object.keys(IT.vocab).forEach(function (k) {
      var w = IT.vocab[k];
      if (w.ruOrig == null) w.ruOrig = w.ru;
      w.ru = ov[k] || w.ruOrig; w.refined = !!ov[k];
    });
  };

  function overlap(a, b) {
    var A = IT.stripAcc(IT.norm(a)).split(" ").filter(function (x) { return x.length > 2; }), B = IT.stripAcc(IT.norm(b)).split(" ");
    if (!A.length) return 0;
    var stem = function (x) { return x.slice(0, Math.max(3, x.length - 2)); };
    var hit = A.filter(function (x) { return B.some(function (y) { return stem(y) === stem(x); }); }).length;
    return Math.round(hit / A.length * 100);
  }
  function isSpanish(text) {
    if (/[а-яё]/i.test(text)) return false;
    return true;
  }

  IT.renderTranslator = function (box) {
    var st = S.state, v0 = st.trVariant || "neutral";
    box.innerHTML = '<div class="card tr-card"><div class="row between wrap gap"><div class="seg sm" data-dir>' + [["auto", t("trAuto")], ["ru-es", "RU → ES"], ["es-ru", "ES → RU"]].map(function (d, i) { return '<button data-d="' + d[0] + '" class="' + (i === 0 ? "on" : "") + '">' + d[1] + "</button>"; }).join("") + '</div><label class="sm vsel">' + IT.icon("globe") + " " + t("trVariant") + ' <select data-var>' + [["neutral", t("neutral")], ["es-ES", "Испания"], ["es-MX", "Мексика"], ["es-AR", "Аргентина"], ["es-CO", "Колумбия"]].map(function (o) { return '<option value="' + o[0] + '"' + (o[0] === v0 ? " selected" : "") + ">" + o[1] + "</option>"; }).join("") + "</select></label></div>" +
      '<textarea class="ans-input mt-s" rows="3" data-trsrc placeholder="' + t("trPh") + '"></textarea><div class="row gap wrap mt-s"><button class="btn primary" data-trgo>' + IT.icon("search") + " " + t("trGo") + '</button><span class="muted xs">' + t("trNote") + '</span></div></div><div class="tr-out"></div>';
    var dir = "auto", out = box.querySelector(".tr-out");
    box.querySelector("[data-dir]").onclick = function (e) { var b = e.target.closest("[data-d]"); if (!b) return; dir = b.getAttribute("data-d"); box.querySelectorAll("[data-d]").forEach(function (x) { x.classList.toggle("on", x === b); }); };
    box.querySelector("[data-var]").onchange = function (e) { st.trVariant = e.target.value; S.save(); };
    box.querySelector("[data-trsrc]").onkeydown = function (e) { if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) box.querySelector("[data-trgo]").click(); };
    box.querySelector("[data-trgo]").onclick = function () {
      var src = box.querySelector("[data-trsrc]").value.trim(); if (!src) return;
      var d = dir === "auto" ? (isSpanish(src) ? "es-ru" : "ru-es") : dir, variant = box.querySelector("[data-var]").value;
      st.cnt.translate = (st.cnt.translate || 0) + 1; IT.checkAch(); S.save();
      out.innerHTML = '<div class="card"><span class="typing-dots"><i></i><i></i><i></i></span> ' + t("translating") + "</div>";
      var varTxt = variant === "neutral" ? "нейтральный (понятный везде)" : { "es-ES": "Испания", "es-MX": "Мексика", "es-AR": "Аргентина (voseo)", "es-CO": "Колумбия" }[variant];
      IT.aiJSON("Ты точный переводчик и преподаватель испанского для русскоговорящих. Направление: " + (d === "ru-es" ? "с русского на испанский" : "с испанского на русский") + ". Вариант испанского: " + varTxt + ".\nТекст: «" + src + "»\n" +
        "Сделай перевод и сверку точности. Ответь строго JSON: {\"translation\": \"перевод\", \"back_translation\": \"обратный перевод твоего перевода на исходный язык\", \"alignment\": [{\"es\": \"испанское слово или выражение\", \"ru\": \"соответствие на русском\", \"note\": \"форма, грамматика или почему так (кратко)\"}], \"alternatives\": [{\"text\": \"другой вариант перевода\", \"note\": \"чем отличается (стиль, регион)\"}], \"regional\": [{\"region\": \"страна\", \"text\": \"как скажут там\"}], \"pitfalls\": [\"где легко ошибиться при переводе этого текста\"], \"confidence\": 0-100}")
        .then(function (r) { render(out, src, d, r); })
        .catch(function (e) { offline(out, src, d, e); });
    };
  };

  function dictRows(esText, alignment) {
    var toks = IT.tokens(esText), seen = {}, rows = [];
    toks.forEach(function (tk) {
      if (seen[tk] || tk.length < 2) return; seen[tk] = 1;
      var w = IT.lookupWord(tk), al = (alignment || []).find(function (a) { return IT.tokens(a.es).indexOf(tk) >= 0; });
      var status = "none";
      if (w && al) status = overlap(w.ru, al.ru) > 0 || overlap(al.ru, w.ru) > 0 ? "ok" : "diff";
      else if (w) status = "dict";
      rows.push({ tk: tk, w: w, al: al, status: status });
    });
    return rows;
  }

  function render(out, src, d, r) {
    var esText = d === "ru-es" ? r.translation : src;
    var rows = dictRows(esText, r.alignment);
    var back = r.back_translation || "", sim = overlap(src, back);
    var ok = rows.filter(function (x) { return x.status === "ok"; }).length, diff = rows.filter(function (x) { return x.status === "diff"; }).length;
    out.innerHTML = '<div class="card"><span class="eyebrow">' + t("trResult") + (r.confidence != null ? " · " + t("confidence") + " " + r.confidence + "%" : "") + '</span><div class="tr-main row gap"><div class="grow"><div class="tr-text">' + esc(r.translation) + "</div></div>" + (d === "ru-es" ? IT.sp(r.translation) : "") + '<button class="icon-btn" data-copy title="' + t("copy") + '">' + IT.icon("book") + "</button></div>" +
      '<div class="tr-check"><div class="row between"><span class="sm"><b>' + t("backTr") + '</b> <span class="muted">' + esc(back) + '</span></span><span class="chip ' + (sim >= 60 ? "ok" : "soft") + ' sm">' + sim + "%</span></div><p class=\"xs muted\">" + t("backTrNote") + "</p></div></div>" +
      '<div class="card"><h4>' + t("alignTitle") + ' <span class="muted xs">' + t("alignSub").replace("{ok}", ok).replace("{diff}", diff) + '</span></h4><div class="tbl-wrap"><table class="tbl align"><thead><tr><th>Español</th><th>' + t("aiTr") + "</th><th>" + t("courseDict") + "</th><th></th></tr></thead><tbody>" +
      rows.map(function (x) {
        var badge = x.status === "ok" ? '<span class="chip ok sm">✓</span>' : x.status === "diff" ? '<span class="chip gold sm" title="' + t("diffHint") + '">≠</span>' : x.status === "dict" ? '<span class="chip soft sm">' + t("dictOnly") + "</span>" : '<span class="chip soft sm">—</span>';
        return '<tr><td><button class="say-chip" data-say="' + esc(x.tk) + '">' + esc(x.tk) + IT.icon("speaker") + "</button></td><td>" + (x.al ? esc(x.al.ru) + (x.al.note ? '<div class="xs muted">' + esc(x.al.note) + "</div>" : "") : '<span class="muted">—</span>') + "</td><td>" + (x.w ? esc(x.w.ru) + '<div class="xs muted">' + esc(x.w.it) + "</div>" : '<span class="muted xs">' + t("notInDict") + "</span>") + "</td><td>" + badge + "</td></tr>";
      }).join("") + "</tbody></table></div>" +
      ((r.alignment || []).filter(function (a) { return a.es.indexOf(" ") > 0; }).length ? '<p class="sm mt-s"><b>' + t("phrases") + ":</b> " + r.alignment.filter(function (a) { return a.es.indexOf(" ") > 0; }).map(function (a) { return "<i>" + esc(a.es) + "</i> — " + esc(a.ru); }).join("; ") + "</p>" : "") + "</div>" +
      ((r.alternatives && r.alternatives.length) || (r.regional && r.regional.length) || (r.pitfalls && r.pitfalls.length) ? '<div class="card">' +
        (r.alternatives && r.alternatives.length ? "<h4>" + t("alternatives") + "</h4><ul>" + r.alternatives.map(function (a) { return "<li><b>" + esc(a.text) + "</b> " + (a.note ? '<span class="muted sm">— ' + esc(a.note) + "</span>" : "") + "</li>"; }).join("") + "</ul>" : "") +
        (r.regional && r.regional.length ? "<h4>" + IT.icon("globe") + " " + t("regionalVariants") + "</h4><ul>" + r.regional.map(function (a) { return "<li>" + esc(a.region) + ": <b>" + esc(a.text) + "</b></li>"; }).join("") + "</ul>" : "") +
        (r.pitfalls && r.pitfalls.length ? "<h4>" + IT.icon("bulb") + " " + t("pitfalls") + "</h4><ul>" + r.pitfalls.map(function (p) { return "<li>" + esc(p) + "</li>"; }).join("") + "</ul>" : "") + "</div>" : "");
    out.querySelector("[data-copy]").onclick = function () { (navigator.clipboard ? navigator.clipboard.writeText(r.translation) : Promise.reject()).then(function () { IT.toast(t("copied"), "ok"); }).catch(function () { IT.toast(t("copyManual"), "warn"); }); };
  }

  function offline(out, src, d, e) {
    var html = '<div class="card"><p class="tip sm">' + IT.icon("sparkles") + "<span>" + esc(IT.aiErrorText(e)) + " " + t("trOffline") + "</span></p>";
    if (d === "es-ru") {
      var rows = dictRows(src, null);
      html += '<div class="tbl-wrap"><table class="tbl"><thead><tr><th>Español</th><th>' + t("courseDict") + "</th></tr></thead><tbody>" + rows.map(function (x) { return "<tr><td>" + esc(x.tk) + "</td><td>" + (x.w ? esc(x.w.ru) : '<span class="muted xs">' + t("notInDict") + "</span>") + "</td></tr>"; }).join("") + "</tbody></table></div>";
    } else {
      var words = IT.stripAcc(src.toLowerCase()).split(/[^a-zа-яё]+/i).filter(Boolean), found = [];
      words.forEach(function (wd) {
        Object.keys(IT.vocab).forEach(function (k) { var w = IT.vocab[k]; if (IT.stripAcc(w.ru.toLowerCase()).split(/[^a-zа-яё]+/i).indexOf(wd) >= 0 && found.indexOf(w) < 0) found.push(w); });
      });
      html += found.length ? "<ul>" + found.slice(0, 30).map(function (w) { return "<li><b>" + esc(w.it) + "</b> — " + esc(w.ru) + "</li>"; }).join("") + "</ul>" : '<p class="muted sm">' + t("nothingFound") + "</p>";
    }
    out.innerHTML = html + "</div>";
  }

  /* Сверка перевода одного слова */
  IT.checkWord = function (key, box, onApply) {
    var w = IT.wordInfo(key); if (!w) return;
    box.innerHTML = '<span class="typing-dots"><i></i><i></i><i></i></span> ' + t("checking");
    IT.aiJSON("Ты лексикограф испанского и русского языков. Проверь перевод в учебном словаре: «" + w.it + "» (" + IT.posLabel(w.pos) + ") — «" + (w.ruOrig || w.ru) + "».\n" +
      "Ответь строго JSON: {\"verdict\": \"ok | imprecise | wrong\", \"suggested_ru\": \"лучший краткий перевод для словаря (если verdict ok — тот же)\", \"meanings\": [\"основные значения\"], \"regional\": [{\"region\": \"\", \"note\": \"особенности употребления или синоним в этой стране\"}], \"example\": {\"es\": \"\", \"ru\": \"\"}, \"comment\": \"кратко по-русски, почему так\"}")
      .then(function (r) {
        S.state.cnt.translate = (S.state.cnt.translate || 0) + 1; IT.checkAch(); S.save();
        var cls = r.verdict === "ok" ? "ok" : r.verdict === "wrong" ? "bad" : "mid";
        box.innerHTML = '<div class="verdict ' + cls + '"><b>' + (r.verdict === "ok" ? "✓ " + t("vOk") : r.verdict === "wrong" ? "✗ " + t("vWrong") : "≈ " + t("vImprecise")) + "</b>" + (r.comment ? '<p class="sm">' + esc(r.comment) + "</p>" : "") + "</div>" +
          (r.meanings && r.meanings.length ? '<p class="sm"><b>' + t("meanings") + ":</b> " + r.meanings.map(esc).join("; ") + "</p>" : "") +
          (r.regional && r.regional.length ? '<ul class="sm">' + r.regional.map(function (x) { return "<li>" + esc(x.region) + ": " + esc(x.note) + "</li>"; }).join("") + "</ul>" : "") +
          (r.example && r.example.es ? '<div class="fb-ex">' + IT.sp(r.example.es) + "<div><i>" + esc(r.example.es) + '</i><br><span class="muted sm">' + esc(r.example.ru) + "</span></div></div>" : "") +
          (r.verdict !== "ok" && r.suggested_ru && IT.vocab[key] ? '<button class="btn primary sm" data-apply>' + t("applyTr") + " «" + esc(r.suggested_ru) + "»</button>" : "");
        var ap = box.querySelector("[data-apply]");
        if (ap) ap.onclick = function () { S.state.trOverrides[key] = r.suggested_ru; IT.applyOverrides(); S.save(); IT.toast(t("trApplied"), "ok"); if (onApply) onApply(); };
      }).catch(function (e) { box.innerHTML = '<p class="muted sm">' + esc(IT.aiErrorText(e)) + "</p>"; });
  };

  /* Пакетная сверка словаря */
  IT.checkDictionary = function () {
    var keys = Object.keys(S.state.words).filter(function (k) { return IT.vocab[k]; }).slice(0, 80);
    if (!keys.length) return IT.toast(t("pReviewEmpty"), "warn");
    var m = IT.modal('<h3 class="m-title">' + IT.icon("search") + " " + t("checkDict") + '</h3><p class="muted sm">' + t("checkDictSub").replace("{n}", keys.length) + '</p><div class="cd-out"><span class="typing-dots"><i></i><i></i><i></i></span> ' + t("checking") + "</div>", { wide: true });
    var out = m.querySelector(".cd-out");
    var listTxt = keys.map(function (k) { var w = IT.vocab[k]; return w.it + " — " + (w.ruOrig || w.ru); }).join("\n");
    IT.aiJSON("Ты лексикограф испанского и русского. Проверь переводы в учебном словаре для русскоговорящих (формат: испанское — русский перевод):\n" + listTxt + "\n\nНайди только реальные ошибки и неточности (неверное значение, пропущено главное значение, неверный род в переводе). Ответь строго JSON: {\"issues\": [{\"es\": \"слово как в списке\", \"current\": \"текущий перевод\", \"suggested\": \"лучший краткий перевод\", \"comment\": \"почему\"}]}")
      .then(function (r) {
        var issues = (r.issues || []).filter(function (x) { return IT.vocab[x.es]; });
        S.state.cnt.translate = (S.state.cnt.translate || 0) + keys.length; IT.checkAch(); S.save();
        if (!issues.length) { out.innerHTML = '<p class="tip ok">' + IT.icon("check") + "<span>" + t("dictAllOk") + "</span></p>"; return; }
        out.innerHTML = '<div class="issues">' + issues.map(function (x, i) { return '<label class="issue"><input type="checkbox" data-i="' + i + '" checked><div><b>' + esc(x.es) + '</b>: <s class="muted">' + esc(x.current) + "</s> → <b>" + esc(x.suggested) + '</b><div class="xs muted">' + esc(x.comment || "") + "</div></div></label>"; }).join("") + '</div><div class="row gap end mt"><button class="btn ghost" data-close>' + t("cancel") + '</button><button class="btn primary" data-apply-all>' + t("applySelected") + "</button></div>";
        out.querySelector("[data-apply-all]").onclick = function () {
          out.querySelectorAll("[data-i]").forEach(function (cb) { if (cb.checked) { var x = issues[+cb.getAttribute("data-i")]; S.state.trOverrides[x.es] = x.suggested; } });
          IT.applyOverrides(); S.save(); m.close(); IT.toast(t("trApplied"), "ok"); IT.render();
        };
      }).catch(function (e) { out.innerHTML = '<p class="muted">' + esc(IT.aiErrorText(e)) + "</p>"; });
  };
})(window.IT);
