/* Персональный словарь: поиск, фильтры, избранное, карточка слова, свои слова */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };
  var filter = "mine", query = "";

  function allKeys() {
    var keys = Object.keys(IT.vocab);
    S.state.custom.forEach(function (c) { keys.push(c.key); });
    return keys;
  }
  function strengthDots(k) {
    var s = IT.srs.strength(k);
    return '<span class="str s' + s + '" title="' + t("strength") + '">' + [1, 2, 3, 4].map(function (i) { return "<i class=\"" + (i <= s ? "on" : "") + "\"></i>"; }).join("") + "</span>";
  }

  IT.views.dictionary = function (main) {
    var st = S.state, learned = IT.wordsLearned(), due = IT.srs.due().length, favs = Object.keys(st.words).filter(function (k) { return st.words[k].fav; }).length;
    main.innerHTML = '<div class="page-head row between wrap gap"><div><h1>' + t("navDict") + '</h1><p class="muted">' + t("dictSub").replace("{n}", learned).replace("{all}", Object.keys(IT.vocab).length) + '</p></div><div class="row gap wrap"><button class="btn ghost" data-checkall ' + (learned ? "" : "disabled") + '>' + IT.icon("search") + " " + t("checkDict") + '</button><button class="btn ghost" data-add>' + IT.icon("plus") + " " + t("addWord") + '</button><button class="btn primary" data-rev ' + (learned ? "" : "disabled") + ">" + IT.icon("refresh") + " " + t("reviewNow") + (due ? ' <span class="badge in">' + due + "</span>" : "") + "</button></div></div>" +
      '<div class="dict-tools"><label class="search">' + IT.icon("search") + '<input placeholder="' + t("searchWord") + '" value="' + esc(query) + '"></label><div class="chips filt">' +
      [["mine", t("fMine") + " · " + learned], ["all", t("fAll")], ["fav", "★ " + t("fFav") + " · " + favs], ["due", t("fDue") + " · " + due], ["n", t("fNouns")], ["v", t("fVerbs")], ["adj", t("fAdj")], ["custom", t("fCustom")]].map(function (f) { return '<button class="chip ' + (filter === f[0] ? "on" : "") + '" data-f="' + f[0] + '">' + f[1] + "</button>"; }).join("") + '</div></div><div class="dict-list"></div>';
    var listEl = main.querySelector(".dict-list");
    function draw() {
      var now = Date.now(), q = IT.stripAcc(query.toLowerCase().trim());
      var keys = allKeys().filter(function (k) {
        var w = IT.wordInfo(k), s = st.words[k]; if (!w) return false;
        if (filter === "mine" && !s) return false;
        if (filter === "fav" && !(s && s.fav)) return false;
        if (filter === "due" && !(s && s.due <= now)) return false;
        if (filter === "n" && w.pos.indexOf("n.") !== 0) return false;
        if (filter === "v" && w.pos !== "v") return false;
        if (filter === "adj" && w.pos !== "adj") return false;
        if (filter === "custom" && !w.custom) return false;
        if (q && IT.stripAcc((w.it + " " + w.ru).toLowerCase()).indexOf(q) < 0) return false;
        return true;
      });
      if (!keys.length) {
        listEl.innerHTML = '<div class="empty card">' + IT.icon("book") + "<p>" + (filter === "mine" && !learned ? t("dictEmpty") : t("nothingFound")) + "</p>" + (filter === "mine" && !learned ? '<button class="btn primary" data-go="path">' + t("toLessons") + "</button>" : "") + "</div>";
        return;
      }
      listEl.innerHTML = keys.slice(0, 400).map(function (k) {
        var w = IT.wordInfo(k), s = st.words[k];
        return '<div class="wcard' + (s ? "" : " unseen") + '" data-w="' + esc(k) + '"><button class="spk" data-say="' + esc(w.it) + '">' + IT.icon("speaker") + '</button><div class="grow"><div><b>' + esc(w.it) + '</b></div><div class="sm muted">' + esc(w.ru) + (w.pron ? ' · <span class="pron">[' + esc(w.pron) + "]</span>" : "") + '</div></div><span class="tag">' + esc(IT.posLabel(w.pos)) + (w.gender ? " · " + (w.gender === "m" ? "m" : "f") : "") + "</span>" + (s ? strengthDots(k) : '<span class="tag dim">' + t("notLearned") + "</span>") + '<button class="fav' + (s && s.fav ? " on" : "") + '" data-fav="' + esc(k) + '" aria-label="' + t("fFav") + '">' + IT.icon("star") + "</button></div>";
      }).join("");
    }
    draw();
    main.querySelector(".search input").addEventListener("input", function (e) { query = e.target.value; draw(); });
    main.onclick = function (e) {
      var f = e.target.closest("[data-f]"); if (f) { filter = f.getAttribute("data-f"); return IT.views.dictionary(main); }
      var fav = e.target.closest("[data-fav]"); if (fav) { e.stopPropagation(); return toggleFav(fav.getAttribute("data-fav"), function () { draw(); IT.$$(".filt [data-f=fav]", main).forEach(function () { }); }); }
      if (e.target.closest("[data-rev]")) return IT.startReview();
      if (e.target.closest("[data-checkall]")) return IT.aiAvailable().then(function (ok) { if (ok) IT.checkDictionary(); else IT.toast(t("aiUnavailable"), "warn"); });
      if (e.target.closest("[data-add]")) return addWord(function () { IT.views.dictionary(main); });
      var w = e.target.closest("[data-w]"); if (w && !e.target.closest("[data-say]")) wordModal(w.getAttribute("data-w"), draw);
    };
  };

  function toggleFav(k, cb) {
    var s = S.state.words[k] || IT.srs.ensure(k, IT.wordInfo(k) && IT.wordInfo(k).lesson);
    s.fav = !s.fav; S.save(); cb && cb();
  }

  function wordModal(k, cb) {
    var w = IT.wordInfo(k), s = S.state.words[k], l = w.lesson && IT.lessonById[w.lesson];
    var html = '<div class="word-modal"><div class="row gap"><button class="spk big" data-say="' + esc(w.it) + '">' + IT.icon("speaker") + '</button><div class="grow"><h2 class="m-title">' + esc(w.it) + '</h2><div class="pron">' + (w.pron ? "[" + esc(w.pron) + "]" : "") + ' <button class="link sm" data-say="' + esc(w.it) + '" data-slow>' + IT.icon("turtle") + " " + t("slowly") + "</button></div></div></div>" +
      '<div class="wm-ru">' + esc(w.ru) + (w.refined ? ' <span class="chip ok sm">' + t("refined") + "</span>" : "") + '</div><div class="kv"><span>' + t("partOfSpeech") + "</span><b>" + esc(IT.posLabel(w.pos)) + "</b>" + (w.gender ? "<span>" + t("gender") + "</span><b>" + (w.gender === "m" ? t("masc") : t("fem")) + "</b>" : "") + (l ? "<span>" + t("fromLesson") + "</span><b>" + esc(IT.tt(l)) + "</b>" : "") +
      (s ? "<span>" + t("strength") + "</span><b>" + strengthDots(k) + "</b><span>" + t("nextReview") + "</span><b>" + (s.due <= Date.now() ? t("now") : new Date(s.due).toLocaleDateString(IT.isIt() ? "es-ES" : "ru-RU")) + "</b><span>" + t("answers") + "</span><b>✓ " + s.ok + " · ✗ " + s.bad + "</b>" : "") + "</div>" +
      (w.ex ? '<div class="fb-ex">' + IT.sp(w.ex[0]) + "<div><i>" + esc(w.ex[0]) + '</i><br><span class="muted sm">' + esc(w.ex[1]) + "</span></div></div>" : "") +
      (w.gender && /^(el|la|los|las)\s/i.test(w.it) ? '<p class="tip sm">' + IT.icon("bulb") + "<span>" + t("articleTip") + "</span></p>" : "") +
      '<div class="wm-check"></div><div class="row gap end wrap mt"><button class="btn ghost" data-chk>' + IT.icon("search") + " " + t("checkTr") + '</button><button class="btn ghost" data-fv>' + IT.icon("star") + " " + (s && s.fav ? t("unfav") : t("toFav")) + "</button>" + (w.custom ? '<button class="btn ghost danger-t" data-del>' + t("delete") + "</button>" : "") + '<button class="btn primary" data-learn>' + IT.icon("refresh") + " " + t("reviewThis") + "</button></div></div>";
    var m = IT.modal(html);
    m.querySelector("[data-fv]").onclick = function () { toggleFav(k); m.close(); cb && cb(); };
    m.querySelector("[data-chk]").onclick = function () { IT.checkWord(k, m.querySelector(".wm-check"), function () { m.close(); IT.render(); }); };
    m.querySelector("[data-learn]").onclick = function () { m.close(); IT.srs.ensure(k, w.lesson); S.save(); IT.startReview([k]); };
    var del = m.querySelector("[data-del]");
    if (del) del.onclick = function () { S.state.custom = S.state.custom.filter(function (c) { return c.key !== k; }); delete S.state.words[k]; S.save(); m.close(); IT.render(); };
  }
  IT.wordModal = wordModal;

  function addWord(cb) {
    var pos = [["n.m", t("nounM")], ["n.f", t("nounF")], ["v", t("fVerbs")], ["adj", t("fAdj")], ["adv", IT.posLabel("adv")], ["phr", IT.posLabel("phr")]];
    var m = IT.modal('<h3 class="m-title">' + t("addWord") + '</h3><form class="form" data-form><label>' + t("spanishWord") + '<input name="it" required placeholder="el gato"></label><label>' + t("translation") + '<input name="ru" required placeholder="кот"></label><label>' + t("pronHint") + '<input name="pron" placeholder="эль гАто"></label><label>' + t("partOfSpeech") + '<select name="pos">' + pos.map(function (p) { return '<option value="' + p[0] + '">' + p[1] + "</option>"; }).join("") + '</select></label><label>' + t("example") + '<input name="ex" placeholder="El gato duerme."></label><label>' + t("exampleTr") + '<input name="exru" placeholder="Кот спит."></label><div class="row gap end"><button type="button" class="btn ghost" data-close>' + t("cancel") + '</button><button class="btn primary">' + t("save") + "</button></div></form>");
    m.querySelector("[data-form]").onsubmit = function (e) {
      e.preventDefault();
      var f = e.target, it = f.it.value.trim(), ru = f.ru.value.trim();
      if (!it || !ru) return;
      var key = "custom:" + it.toLowerCase();
      var w = IT.parseWord([it, ru, f.pron.value.trim(), f.pos.value, f.ex.value.trim(), f.exru.value.trim()].join("|"), null);
      w.key = key; w.custom = true;
      S.state.custom = S.state.custom.filter(function (c) { return c.key !== key; }).concat([w]);
      IT.srs.ensure(key, null); S.save(); m.close(); IT.toast(IT.icon("check") + " " + t("wordAdded"), "ok"); cb && cb();
    };
  }
})(window.IT);
