/* Статистика: итоги, динамика, точность по темам, история занятий */
(function (IT) {
  var S = IT.store, esc = IT.esc, t = function (k) { return IT.t(k); };
  var range = 14;

  function days(n) {
    var out = [];
    for (var i = n - 1; i >= 0; i--) { var d = new Date(Date.now() - i * IT.DAY); out.push({ k: IT.today(d), d: d }); }
    return out;
  }
  function barChart(data, key, color, fmt) {
    var W = 640, H = 170, pad = 26, max = Math.max(1, Math.max.apply(null, data.map(function (x) { return x.v; })));
    var bw = (W - pad * 2) / data.length;
    var nice = Math.ceil(max / 5) * 5 || 5;
    var grid = [0, .5, 1].map(function (f) { var y = H - pad - f * (H - pad * 2); return '<line x1="' + pad + '" x2="' + (W - 4) + '" y1="' + y + '" y2="' + y + '" class="grid"/><text x="' + (pad - 6) + '" y="' + (y + 4) + '" class="axis" text-anchor="end">' + Math.round(nice * f) + "</text>"; }).join("");
    var bars = data.map(function (x, i) {
      var h = x.v / nice * (H - pad * 2), xx = pad + i * bw + bw * .18, y = H - pad - h;
      var lbl = (i % Math.ceil(data.length / 7) === 0 || i === data.length - 1) ? '<text x="' + (xx + bw * .32) + '" y="' + (H - 8) + '" class="axis" text-anchor="middle">' + x.l + "</text>" : "";
      return '<rect x="' + xx + '" y="' + y + '" width="' + bw * .64 + '" height="' + Math.max(h, x.v ? 2 : 0) + '" rx="3" fill="' + color + '"><title>' + x.l + ": " + (fmt ? fmt(x.v) : x.v) + "</title></rect>" + lbl;
    }).join("");
    return '<svg class="chart" viewBox="0 0 ' + W + " " + H + '" role="img">' + grid + bars + "</svg>";
  }

  IT.views.stats = function (main) {
    var st = S.state, lv = IT.levelFromXp(st.xp), logs = st.log;
    var totSec = 0, totOk = 0, totAll = 0;
    Object.keys(logs).forEach(function (k) { totSec += logs[k].sec; totOk += logs[k].ok; totAll += logs[k].tot; });
    var acc = totAll ? Math.round(totOk / totAll * 100) : 0;
    var dd = days(range), loc = IT.isIt() ? "es-ES" : "ru-RU";
    var xpData = dd.map(function (x) { return { v: (logs[x.k] || {}).xp || 0, l: x.d.toLocaleDateString(loc, { day: "numeric", month: "short" }) }; });
    var minData = dd.map(function (x) { return { v: Math.round(((logs[x.k] || {}).sec || 0) / 60), l: x.d.toLocaleDateString(loc, { day: "numeric", month: "short" }) }; });
    var activeDays = Object.keys(logs).filter(function (k) { return logs[k].xp > 0 || logs[k].sec > 60; }).length;
    var weak = IT.weakTags();
    var html = '<div class="page-head"><h1>' + t("navStats") + '</h1><p class="muted">' + t("statsSub") + "</p></div>";
    html += '<div class="grid tiles6">' +
      tile("book", IT.wordsLearned(), t("sWords")) + tile("check", IT.lessonsDoneCount() + "/" + IT.allLessons.length, t("sLessons")) + tile("bolt", st.xp, t("sXp")) +
      tile("clock", fmtDur(totSec), t("sTime")) + tile("star", t("level") + " " + lv.level + " · " + IT.prog.cefr(), t("sLevel")) + tile("target", acc + "%", t("sAcc")) +
      tile("flame", st.streak.best, t("sBestStreak")) + tile("chat", st.cnt.dlg, t("sDialogs")) + tile("refresh", st.cnt.reviews, t("sReviews")) + "</div>";
    html += '<div class="card"><div class="row between wrap gap"><h3>' + t("sDynamics") + '</h3><div class="seg sm">' + [7, 14, 30].map(function (n) { return '<button data-r="' + n + '" class="' + (range === n ? "on" : "") + '">' + n + " " + t("dShort") + "</button>"; }).join("") + "</div></div>" +
      '<div class="chart-lbl"><span class="dot" style="background:var(--gold)"></span>XP</div>' + barChart(xpData, "xp", "var(--gold)") +
      '<div class="chart-lbl"><span class="dot" style="background:var(--sky)"></span>' + t("minutes") + "</div>" + barChart(minData, "min", "var(--sky)", function (v) { return v + " " + t("min"); }) +
      '<p class="muted xs">' + t("activeDays") + ": " + activeDays + "</p></div>";
    // CEFR
    html += '<div class="card"><h3>' + t("sCefr") + '</h3><div class="cefr">' + IT.levels.map(function (L) {
      var has = IT.allLessons.some(function (l) { return l.level === L.id; }), p = IT.prog.levelPct(L.id);
      return '<div class="cefr-row"><span class="lv-badge lv-' + L.id + '">' + L.id + '</span><span class="grow">' + esc(IT.tt(L)) + '</span><div class="bar"><i style="width:' + p + '%"></i></div><b>' + (has ? p + "%" : "—") + "</b></div>";
    }).join("") + "</div></div>";
    // Темы
    html += '<div class="card"><h3>' + t("sTopics") + "</h3>" + (weak.length ? '<div class="topics">' + weak.map(function (w) {
      var cls = w.acc < 60 ? "bad" : w.acc < 80 ? "mid" : "ok";
      return '<div class="topic ' + cls + '"><span class="grow">' + esc(IT.TAGS[w.tag]) + ' <span class="muted xs">(' + w.tot + ')</span></span><div class="bar"><i style="width:' + w.acc + '%"></i></div><b>' + w.acc + "%</b>" + (w.acc < 80 ? '<button class="btn ghost sm" data-weak="' + w.tag + '">' + t("trainIt") + "</button>" : '<span class="chip ok sm">' + IT.icon("check") + "</span>") + "</div>";
    }).join("") + "</div>" : '<p class="muted">' + t("sNoTopics") + "</p>") + "</div>";
    // История
    var hist = Object.keys(logs).sort().reverse().slice(0, 21).filter(function (k) { return logs[k].xp || logs[k].sec; });
    html += '<div class="card"><h3>' + t("sHistory") + "</h3>" + (hist.length ? '<div class="tbl-wrap"><table class="tbl hist"><thead><tr><th>' + t("date") + "</th><th>XP</th><th>" + t("minutes") + "</th><th>" + t("sLessons") + "</th><th>" + t("sAcc") + "</th><th>" + t("sReviews") + "</th></tr></thead><tbody>" + hist.map(function (k) {
      var l = logs[k], d = new Date(k + "T12:00:00");
      return "<tr><td>" + d.toLocaleDateString(loc, { weekday: "short", day: "numeric", month: "short" }) + "</td><td>" + l.xp + "</td><td>" + Math.round(l.sec / 60) + "</td><td>" + l.les + "</td><td>" + (l.tot ? Math.round(l.ok / l.tot * 100) + "%" : "—") + "</td><td>" + l.rev + "</td></tr>";
    }).join("") + "</tbody></table></div>" : '<p class="muted">' + t("sNoHistory") + "</p>") + "</div>";
    main.innerHTML = html;
    main.onclick = function (e) {
      var r = e.target.closest("[data-r]"); if (r) { range = +r.getAttribute("data-r"); return IT.views.stats(main); }
      var w = e.target.closest("[data-weak]"); if (w) { var tag = w.getAttribute("data-weak"); IT.player.run({ kind: "weak", title: IT.TAGS[tag], items: IT.buildWeak(tag) }); }
    };
  };
  function tile(ic, v, l) { return '<div class="card stat-tile">' + IT.icon(ic) + "<b>" + esc(v) + "</b><span>" + esc(l) + "</span></div>"; }
  function fmtDur(s) { var h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60); return h ? h + " " + t("hShort") + " " + m + " " + t("minShort") : m + " " + t("minShort"); }
})(window.IT);
