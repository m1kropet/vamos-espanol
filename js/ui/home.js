/* Главная: карта обучения (маршрут по испаноязычному миру) и панель целей */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };

  /* Кольцо прогресса */
  IT.ring = function (pct, label, sub, size) {
    size = size || 92; var r = size / 2 - 7, c = 2 * Math.PI * r, off = c * (1 - Math.min(1, pct / 100));
    return '<div class="ring" style="width:' + size + "px;height:" + size + 'px"><svg viewBox="0 0 ' + size + " " + size + '"><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-bg"/><circle cx="' + size / 2 + '" cy="' + size / 2 + '" r="' + r + '" class="ring-fg" stroke-dasharray="' + c + '" stroke-dashoffset="' + off + '"/></svg><div class="ring-lbl"><b>' + label + "</b><small>" + (sub || "") + "</small></div></div>";
  };

  /* Панель: цель дня, задания, испытание недели */
  IT.railHtml = function () {
    var st = S.state, log = IT.dayLog(), mins = Math.floor(log.sec / 60), goal = st.profile.goal;
    var q = IT.ensureQuests(), w = IT.ensureWeekly(), wd = IT.weeklyDef();
    var streak = IT.streakAlive(), lv = IT.levelFromXp(st.xp);
    var html = '<div class="card goal-card"><div class="row gap">' + IT.ring(mins / goal * 100, mins + "/" + goal, t("min")) +
      '<div class="grow"><h4>' + t("dailyGoal") + '</h4><p class="muted sm">' + (mins >= goal ? t("goalDone") : t("goalLeft").replace("{n}", goal - mins)) + "</p>" +
      '<div class="row gap sm mt-s"><span class="chip flame' + (streak ? "" : " off") + '">' + IT.icon("flame") + streak + " " + t("days") + '</span><span class="chip xp">' + IT.icon("bolt") + log.xp + " XP " + t("today") + "</span></div></div></div>" +
      '<div class="lvl-line mt"><span>' + t("level") + " " + lv.level + '</span><div class="bar"><i style="width:' + lv.pct + '%"></i></div><span class="muted sm">' + lv.cur + "/" + lv.need + "</span></div></div>";
    html += '<div class="card"><h4 class="row between">' + t("dailyQuests") + (q.bonus ? '<span class="chip gold sm">' + IT.icon("gift") + "+25</span>" : "") + "</h4>" + q.list.map(function (it) {
      var d = IT.questDef(it.id), target = IT.questTarget(d);
      return '<div class="quest' + (it.done ? " done" : "") + '"><span class="q-ico">' + d.i + '</span><div class="grow"><div class="sm">' + esc(IT.tt(d)) + '</div><div class="bar thin"><i style="width:' + Math.round(it.p / target * 100) + '%"></i></div></div><span class="sm muted">' + (it.done ? IT.icon("check") : it.p + "/" + target) + "</span></div>";
    }).join("") + '<p class="muted xs mt-s">' + t("questHint") + "</p></div>";
    html += '<div class="card weekly"><h4>' + IT.icon("trophy") + " " + t("weeklyChallenge") + '</h4><p class="sm">' + esc(IT.tt(wd)) + '</p><div class="bar"><i style="width:' + Math.round(w.p / wd.n * 100) + '%"></i></div><p class="muted xs mt-s">' + (w.done ? t("weeklyDone") : w.p + " / " + wd.n + " · " + t("reward") + " 100 XP") + "</p></div>";
    return html;
  };

  IT.views.path = function (main) {
    var st = S.state, next = IT.prog.next(), resume = st.resume;
    var hour = new Date().getHours();
    var greet = hour < 13 ? "¡Buenos días" : hour < 20 ? "¡Buenas tardes" : "¡Buenas noches";
    var cefr = IT.prog.cefr();
    var cont = "";
    if (resume && IT.lessonById[resume.id] && resume.kind === "lesson") {
      var rl = IT.lessonById[resume.id];
      cont = '<button class="btn primary big" data-resume>' + IT.icon("play") + " " + t("resumeLesson") + "</button><span class=\"muted sm\">" + esc(IT.tt(rl)) + " · " + t("step") + " " + (resume.idx + 1) + "/" + resume.items.length + "</span>";
    } else if (next) {
      cont = '<button class="btn primary big" data-next>' + IT.icon("play") + " " + (next.kind === "test" ? t("startTest") : (IT.lessonsDoneCount() ? t("continue") : t("startLearning"))) + '</button><span class="muted sm">' + esc(next.kind === "test" ? t("unitTest") + ": " + IT.tt(next.unit) : IT.tt(next.lesson)) + "</span>";
    } else cont = '<span class="muted">' + t("allDone") + "</span>";
    var heroScene = (next ? (next.unit || next.lesson.unit).scene : "madrid");
    var html = '<div class="home-grid"><div class="home-main">' +
      '<section class="hero">' + IT.scene(heroScene, "hero-scene") + '<div class="hero-in"><p class="eyebrow">' + greet + '!</p><h1>' + t("heroTitle") + '</h1><p class="muted">' + t("yourLevel") + " <b>" + cefr + "</b> · " + IT.lessonsDoneCount() + "/" + IT.allLessons.length + " " + t("lessonsShort") + '</p><div class="row gap wrap mt">' + cont + "</div></div></section>";
    html += '<div class="rail-mobile">' + IT.railHtml() + "</div>";
    // Карта по уровням
    IT.levels.forEach(function (L) {
      var units = IT.units.filter(function (u) { return u.level === L.id; });
      var pct = IT.prog.levelPct(L.id);
      html += '<section class="level-sec"><div class="level-head"><span class="lv-badge lv-' + L.id + '">' + L.id + '</span><div class="grow"><h2>' + esc(IT.tt(L)) + '</h2><div class="bar"><i style="width:' + pct + '%"></i></div></div><span class="muted sm">' + (units.length ? pct + "%" : t("soon")) + "</span></div>";
      units.forEach(function (u) { html += unitHtml(u); });
      var road = IT.roadmap[L.id];
      if (road && road.length) {
        html += '<div class="roadmap card"><h4>' + IT.icon("sparkles") + " " + (units.length ? t("comingTopics") : t("levelPlanned")) + '</h4><div class="chips">' + road.map(function (r) { return '<span class="chip soft">' + esc(r) + "</span>"; }).join("") + '</div><p class="muted xs">' + t("roadmapNote") + "</p></div>";
      }
      html += "</section>";
    });
    html += '</div><aside class="home-rail">' + IT.railHtml() + "</aside></div>";
    main.innerHTML = html;

    main.onclick = function (e) {
      var n = e.target.closest("[data-lesson]");
      if (n) return lessonSheet(IT.lessonById[n.getAttribute("data-lesson")]);
      var tst = e.target.closest("[data-test]");
      if (tst) return testSheet(IT.unitById[tst.getAttribute("data-test")]);
      if (e.target.closest("[data-resume]")) return IT.player.resume();
      if (e.target.closest("[data-next]")) {
        if (next.kind === "test") IT.player.startTest(next.unit); else IT.player.startLesson(next.lesson);
      }
    };
    var cur = main.querySelector(".node.current");
    if (cur && IT.lessonsDoneCount()) setTimeout(function () { cur.scrollIntoView({ block: "center", behavior: "smooth" }); }, 250);
  };

  function unitHtml(u) {
    var open = IT.prog.unitOpen(u), pct = IT.prog.unitPct(u), next = IT.prog.next();
    var h = '<div class="unit' + (open ? "" : " locked") + '"><div class="unit-banner">' + IT.scene(u.scene) + '<div class="unit-txt"><span class="eyebrow">' + IT.icon("path") + " " + esc(u.city) + " · " + t("unit") + " " + (u.index + 1) + '</span><h3>' + esc(IT.tt(u)) + '</h3><p class="sm">' + esc(u.d) + '</p></div><div class="unit-pct">' + (open ? pct + "%" : IT.icon("lock")) + "</div></div>";
    h += '<div class="trail">';
    var nodes = u.lessons.map(function (l) { return { l: l }; }).concat([{ test: true }]);
    nodes.forEach(function (n, i) {
      var off = [0, 1, 2, 1, 0, -1, -2, -1][i % 8];
      if (n.test) {
        var tOpen = IT.prog.testOpen(u), passed = IT.prog.testPassed(u), isCur = next && next.kind === "test" && next.unit === u;
        h += '<div class="node-wrap" style="--off:' + off + '"><button class="node test ' + (passed ? "done" : isCur ? "current" : tOpen ? "open" : "lock") + '" data-test="' + u.id + '" aria-label="' + t("unitTest") + '">' + IT.icon(passed ? "trophy" : tOpen ? "shield" : "lock") + "</button>" + (isCur ? '<span class="node-tip">' + t("unitTest") + "</span>" : "") + '<span class="node-lbl">' + t("unitTest") + "</span></div>";
      } else {
        var l = n.l, done = IT.prog.lessonDone(l.id), lo = IT.prog.lessonOpen(l), cur = next && next.kind === "lesson" && next.lesson === l;
        var best = S.state.lessons[l.id] ? S.state.lessons[l.id].best : 0;
        h += '<div class="node-wrap" style="--off:' + off + '"><button class="node ' + (done ? "done" : cur ? "current" : lo ? "open" : "lock") + '" data-lesson="' + l.id + '" aria-label="' + esc(IT.tt(l)) + '">' + (done ? IT.icon("check") : lo ? '<span class="num">' + (l.li + 1) + "</span>" : IT.icon("lock")) +
          (done ? '<span class="stars">' + stars(best) + "</span>" : "") + "</button>" + (cur ? '<span class="node-tip">' + t("start") + "</span>" : "") + '<span class="node-lbl">' + esc(IT.tt(l)) + "</span></div>";
      }
    });
    return h + "</div></div>";
  }
  function stars(best) { var n = best >= 95 ? 3 : best >= 75 ? 2 : 1; return "★★★".slice(0, n) + '<span class="dim">' + "★★★".slice(n) + "</span>"; }

  function lessonSheet(l) {
    var open = IT.prog.lessonOpen(l), rec = S.state.lessons[l.id];
    var html = '<div class="sheet-head">' + IT.scene(l.unit.scene, "sheet-scene") + '</div><span class="eyebrow">' + esc(l.unit.city) + " · " + t("lesson") + " " + (l.li + 1) + '</span><h3 class="m-title">' + esc(IT.tt(l)) + '</h3><p class="muted">' + esc(l.goal) + "</p>" +
      '<div class="row gap wrap sm mt-s"><span class="chip soft">' + IT.icon("book") + " " + l.th.length + " " + t("theoryParts") + '</span><span class="chip soft">' + IT.icon("pen") + " " + l.words.length + " " + t("newWords") + '</span><span class="chip soft">' + IT.icon("target") + " ~" + IT.buildLesson(l).length + " " + t("exercises") + "</span>" + (rec ? '<span class="chip ok">' + t("best") + ": " + rec.best + "%</span>" : "") + "</div>";
    if (!open) html += '<p class="lock-note">' + IT.icon("lock") + " " + t("lockedLesson") + "</p>";
    html += '<div class="row gap end mt wrap"><button class="btn ghost" data-theory>' + IT.icon("book") + " " + t("theory") + "</button>" + (open ? '<button class="btn primary" data-go-lesson>' + IT.icon("play") + " " + (rec ? t("repeat") : t("start")) + "</button>" : "") + "</div>";
    var m = IT.modal(html);
    m.querySelector("[data-theory]").onclick = function () { m.close(); IT.player.showTheory(l, true); };
    var g = m.querySelector("[data-go-lesson]"); if (g) g.onclick = function () { m.close(); IT.player.startLesson(l); };
  }
  function testSheet(u) {
    var open = IT.prog.testOpen(u), rec = S.state.tests[u.id];
    var html = '<div class="center"><div class="test-ico">' + IT.icon("shield") + '</div><span class="eyebrow">' + esc(u.city) + '</span><h3 class="m-title">' + t("unitTest") + ": " + esc(IT.tt(u)) + '</h3><p class="muted">' + t("testDesc") + "</p>" + (rec ? '<p class="chip ' + (rec.passed ? "ok" : "soft") + '">' + t("best") + ": " + rec.best + "%</p>" : "") +
      (open ? "" : '<p class="lock-note">' + IT.icon("lock") + " " + t("lockedTest") + "</p>") + '<div class="row gap center mt">' + (open ? '<button class="btn primary" data-go-test>' + IT.icon("play") + " " + t("startTest") + "</button>" : "") + "</div></div>";
    var m = IT.modal(html);
    var g = m.querySelector("[data-go-test]"); if (g) g.onclick = function () { m.close(); IT.player.startTest(u); };
  }
})(window.IT);
