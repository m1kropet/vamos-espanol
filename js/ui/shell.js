/* Оболочка приложения: утилиты, иконки, иллюстрации, модальные окна, уведомления, маршрутизация */
(function (IT) {
  var S = IT.store;
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };
  IT.$ = $; IT.$$ = $$;

  IT.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
  var esc = IT.esc;
  IT.t = function (k) { var L = (S.state.profile.ui === "es" ? IT.I18N.es : IT.I18N.ru); return L[k] != null ? L[k] : (IT.I18N.ru[k] != null ? IT.I18N.ru[k] : k); };
  IT.isIt = function () { return S.state.profile.ui === "es"; };
  IT.tt = function (obj) { return IT.isIt() && obj.ti ? obj.ti : obj.t; };
  IT.h = function (html) { var d = document.createElement("div"); d.innerHTML = html.trim(); return d.firstElementChild; };

  /** Кнопка озвучки */
  IT.sp = function (text, cls) { return '<button class="spk ' + (cls || "") + '" data-say="' + esc(text) + '" aria-label="Слушать">' + IT.icon("speaker") + "</button>"; };

  /* ---------- Мини-разметка теории ---------- */
  function inline(s) {
    s = esc(s);
    s = s.replace(/\[\[(.+?)\]\]/g, function (m, w) { return '<button class="say-chip" data-say="' + w + '">' + w + IT.icon("speaker") + "</button>"; });
    s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/~~(.+?)~~/g, "<s>$1</s>").replace(/(^|[\s(])\*(.+?)\*/g, "$1<i>$2</i>");
    return s;
  }
  IT.md = function (text) {
    var blocks = String(text).split(/\n\s*\n/), out = [];
    blocks.forEach(function (b) {
      var lines = b.split("\n").map(function (l) { return l.trim(); }).filter(Boolean);
      if (!lines.length) return;
      if (lines[0].charAt(0) === "|") {
        var rows = lines.map(function (l) { return l.replace(/^\||\|$/g, "").split("|").map(function (c) { return c.trim(); }); });
        var head = rows.shift();
        var hasHead = head.some(function (c) { return c; });
        out.push('<div class="tbl-wrap"><table class="tbl">' + (hasHead ? "<thead><tr>" + head.map(function (c) { return "<th>" + inline(c) + "</th>"; }).join("") + "</tr></thead>" : "") +
          "<tbody>" + (hasHead ? rows : [head].concat(rows)).map(function (r) { return "<tr>" + r.map(function (c) { return "<td>" + inline(c) + "</td>"; }).join("") + "</tr>"; }).join("") + "</tbody></table></div>");
      } else if (lines[0].indexOf("- ") === 0) {
        out.push("<ul>" + lines.map(function (l) { return "<li>" + inline(l.replace(/^- /, "")) + "</li>"; }).join("") + "</ul>");
      } else if (lines[0].indexOf("! ") === 0) {
        out.push('<div class="rule">' + IT.icon("star") + "<div>" + inline(lines.join(" ").replace(/^! /, "")) + "</div></div>");
      } else if (lines[0].indexOf("? ") === 0) {
        out.push('<div class="tip">' + IT.icon("bulb") + "<div>" + inline(lines.join(" ").replace(/^\? /, "")) + "</div></div>");
      } else out.push("<p>" + lines.map(inline).join("<br>") + "</p>");
    });
    return out.join("");
  };

  /** Простой markdown для ответов ИИ */
  IT.mdAI = function (text) {
    var s = esc(text || "");
    s = s.replace(/```([\s\S]*?)```/g, "<pre>$1</pre>");
    s = s.replace(/^### (.*)$/gm, "<h4>$1</h4>").replace(/^## (.*)$/gm, "<h4>$1</h4>").replace(/^# (.*)$/gm, "<h4>$1</h4>");
    s = s.replace(/\*\*(.+?)\*\*/g, "<b>$1</b>").replace(/(^|[\s(])\*([^*\n]+?)\*/g, "$1<i>$2</i>").replace(/`([^`]+)`/g, "<code>$1</code>");
    s = s.replace(/(^|\n)(?:[-•] (.*)(?:\n|$))+/g, function (m) {
      return "\n<ul>" + m.trim().split("\n").map(function (l) { return "<li>" + l.replace(/^[-•] /, "") + "</li>"; }).join("") + "</ul>\n";
    });
    s = s.replace(/(^|\n)(?:\d+[.)] (.*)(?:\n|$))+/g, function (m) {
      return "\n<ol>" + m.trim().split("\n").map(function (l) { return "<li>" + l.replace(/^\d+[.)] /, "") + "</li>"; }).join("") + "</ol>\n";
    });
    return s.split(/\n{2,}/).map(function (p) { return /^\s*<(ul|ol|pre|h4)/.test(p) ? p : "<p>" + p.replace(/\n/g, "<br>") + "</p>"; }).join("");
  };

  /** Разбор фразы по словам */
  IT.glossHtml = function (gloss) {
    if (!gloss || !gloss.length) return "";
    return '<div class="gloss">' + gloss.map(function (g) {
      return '<button class="gw" data-say="' + esc(g[0]) + '"><span class="gw-it">' + esc(g[0]) + '</span><span class="gw-ru">' + esc(g[1]) + "</span></button>";
    }).join("") + "</div>";
  };

  /* ---------- Иконки ---------- */
  var P = {
    path: '<path d="M5 19c3-8 11-6 14-14"/><circle cx="5" cy="19" r="2"/><circle cx="19" cy="5" r="2"/>',
    practice: '<path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"/><path d="M18 3v4h-4M6 21v-4h4"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/>',
    book: '<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-5a1 1 0 0 0-1 1"/><path d="M14 7v13a2 2 0 0 1 2-2h4V4"/>',
    tutor: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4-6 8-6s7 2 8 6"/><path d="M16 3l3-1"/>',
    stats: '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
    user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
    flame: '<path d="M12 22c4 0 7-3 7-7 0-5-5-7-5-12-3 2-4 5-4 7-1-1-2-2-2-4-2 2-3 5-3 9 0 4 3 7 7 7z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
    star: '<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
    lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
    check: '<path d="m5 12 5 5 9-10"/>',
    play: '<path d="M7 4v16l13-8z"/>',
    speaker: '<path d="M4 9v6h4l5 4V5L8 9z"/><path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"/>',
    turtle: '<path d="M4 15c0-4 3-7 7-7s7 3 7 7z"/><path d="M18 13h2a2 2 0 0 0 0-4h-1M6 15l-1 3M16 15l1 3"/>',
    close: '<path d="M6 6l12 12M18 6 6 18"/>',
    mic: '<rect x="9" y="3" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/>',
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6z"/><path d="m9 12 2 2 4-4"/>',
    trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4a3 3 0 0 0 4 4M16 6h4a3 3 0 0 1-4 4M12 13v4M8 21h8M9 17h6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    target: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',
    refresh: '<path d="M20 12a8 8 0 1 1-2.3-5.7L20 8M20 3v5h-5"/>',
    sparkles: '<path d="M12 3l1.8 4.7L18 9l-4.2 1.3L12 15l-1.8-4.7L6 9l4.2-1.3zM19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>',
    chevron: '<path d="m9 6 6 6-6 6"/>',
    back: '<path d="m15 6-6 6 6 6"/>',
    heart: '<path d="M12 20s-8-5-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 9c0 6-8 11-8 11z"/>',
    bulb: '<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-4 10.5c.8.8 1 1.5 1 2.5h6c0-1 .2-1.7 1-2.5A6 6 0 0 0 12 3z"/>',
    ear: '<path d="M7 10a5 5 0 0 1 10 0c0 3-3 4-3 7a3 3 0 0 1-6 0"/><path d="M10 10a2 2 0 0 1 4 0"/>',
    eye: '<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',
    send: '<path d="M4 12 20 4l-6 16-3-7z"/>',
    gear: '<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1"/>',
    moon: '<path d="M20 14A8 8 0 0 1 10 4a8 8 0 1 0 10 10z"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    pen: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
    grid: '<rect x="4" y="4" width="7" height="7" rx="1.5"/><rect x="13" y="4" width="7" height="7" rx="1.5"/><rect x="4" y="13" width="7" height="7" rx="1.5"/><rect x="13" y="13" width="7" height="7" rx="1.5"/>',
    film: '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>',
    gift: '<rect x="3" y="9" width="18" height="12" rx="1"/><path d="M3 13h18M12 9v12M12 9c-2-4-6-4-6-1s6 1 6 1 6 2 6-1-4-3-6 1"/>'
  };
  IT.icon = function (n, cls) {
    return '<svg class="ic ' + (cls || "") + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (P[n] || "") + "</svg>";
  };

  /* ---------- Пейзажи испаноязычного мира (SVG) ---------- */
  var PAL = {
    madrid: ["#f3c58e", "#f7e1bd", "#c98a5a"], plaza: ["#f4be86", "#fde8cf", "#b5603c"], toledo: ["#f0a87d", "#fde2c8", "#a7774f"],
    barcelona: ["#9fc7d9", "#f2efe4", "#c4664a"], valencia: ["#f7c98f", "#fff0d2", "#d08a3f"], sevilla: ["#f2b27c", "#fbe0c0", "#c76a3a"],
    granada: ["#f0a07c", "#fadcc3", "#b0553b"], salamanca: ["#f6c79a", "#fdebd3", "#c99a55"], mexico: ["#f5b26b", "#fde3bf", "#8e5a3c"],
    buenosaires: ["#a9c7e3", "#eef3f6", "#7a8796"], cafe: ["#f6c79a", "#fdebd3", "#9b5b3c"], market: ["#f7cf8f", "#fff0d2", "#c06a3a"],
    station: ["#b8c6d6", "#eef1f2", "#7a6a5a"], beach: ["#8ec5df", "#f3efe2", "#d39a5c"]
  };
  var BLD = {
    arches: function (x, y, w, h, c) { var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"/>'; var n = Math.floor(w / 14); for (var r = 0; r < 2; r++) for (var i = 0; i < n; i++) s += '<path d="M' + (x + 4 + i * 14) + " " + (y + 14 + r * 18) + "v-6a3.5 3.5 0 0 1 7 0v6z\" fill=\"rgba(0,0,0,.22)\"/>"; return s; },
    dome: function (x, y, w, h, c) { return '<rect x="' + x + '" y="' + (y + h * .45) + '" width="' + w + '" height="' + (h * .55) + '" fill="' + c + '"/><path d="M' + (x + w * .1) + " " + (y + h * .47) + "Q" + (x + w / 2) + " " + (y - h * .1) + " " + (x + w * .9) + " " + (y + h * .47) + 'z" fill="' + c + '" opacity=".92"/><rect x="' + (x + w / 2 - 2) + '" y="' + (y + h * .02) + '" width="4" height="' + (h * .12) + '" fill="' + c + '"/>'; },
    tower: function (x, y, w, h, c) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="' + c + '"/><path d="M' + (x - 2) + " " + y + "h" + (w + 4) + "l-" + (w / 2 + 2) + " -" + (w * .7) + 'z" fill="' + c + '"/><rect x="' + (x + w / 2 - 2) + '" y="' + (y + 8) + '" width="4" height="7" fill="rgba(0,0,0,.25)"/>'; },
    houses: function (x, y, w, h, c) { var s = "", cols = ["#e9b383", "#d9895f", "#f1cf9b", "#c96b4b", "#e7a46f"], n = Math.floor(w / 18); for (var i = 0; i < n; i++) { var hh = h * (.6 + ((i * 37) % 10) / 25); s += '<rect x="' + (x + i * 18) + '" y="' + (y + h - hh) + '" width="18" height="' + hh + '" fill="' + cols[i % 5] + '"/><rect x="' + (x + i * 18 + 5) + '" y="' + (y + h - hh + 6) + '" width="4" height="6" fill="rgba(0,0,0,.2)"/><rect x="' + (x + i * 18 + 11) + '" y="' + (y + h - hh + 6) + '" width="4" height="6" fill="rgba(0,0,0,.2)"/>'; } return s; },
    cypress: function (x, y, w, h) { return '<path d="M' + x + " " + (y + h) + "C" + (x - w) + " " + (y + h * .5) + " " + (x - 2) + " " + y + " " + x + " " + y + "C" + (x + 2) + " " + y + " " + (x + w) + " " + (y + h * .5) + " " + x + " " + (y + h) + 'z" fill="#4f6b3a"/>'; },
    water: function (x, y, w, h) { return '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" fill="#5b93ad"/><path d="M' + x + " " + (y + 8) + "q10 -4 20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0t20 0" + '" stroke="rgba(255,255,255,.5)" fill="none" stroke-width="2"/>'; },
    gondola: function (x, y) { return '<path d="M' + x + " " + y + "q40 14 80 0q-6 10 -40 10t-40 -10z\" fill=\"#2a1f1a\"/><path d=\"M" + (x + 66) + " " + (y - 2) + "l4 -26\" stroke=\"#2a1f1a\" stroke-width=\"2\"/>"; },
    volcano: function (x, y, w, h) { return '<path d="M' + x + " " + (y + h) + "L" + (x + w * .42) + " " + y + "h" + (w * .16) + "L" + (x + w) + " " + (y + h) + 'z" fill="#7d8b99"/><path d="M' + (x + w * .45) + " " + (y - 4) + "q6 -12 14 -6" + '" stroke="#ccc" fill="none" stroke-width="3" opacity=".7"/>'; },
    awning: function (x, y, w) { var s = ""; for (var i = 0; i < w / 12; i++) s += '<path d="M' + (x + i * 12) + " " + y + "h12v10a6 6 0 0 1 -12 0z\" fill=\"" + (i % 2 ? "#fff6ea" : "#b8433a") + '"/>'; return s + '<rect x="' + x + '" y="' + (y + 16) + '" width="' + w + '" height="40" fill="#e8c9a0"/><rect x="' + (x + 8) + '" y="' + (y + 24) + '" width="' + (w / 2 - 12) + '" height="26" fill="rgba(60,40,30,.35)"/>'; },
    spires: function (x, y, w, h, c) { var s = ""; [0, .22, .5, .78].forEach(function (f, i) { var hh = h * (i % 2 ? .78 : 1); s += '<path d="M' + (x + w * f) + " " + (y + h) + "v-" + (hh * .75) + "q8 -" + (hh * .25) + " 16 0v" + (hh * .75) + 'z" fill="' + c + '"/>'; }); return s + '<rect x="' + x + '" y="' + (y + h * .7) + '" width="' + (w * .95) + '" height="' + (h * .3) + '" fill="' + c + '"/>'; },
    pyramid: function (x, y, w, h, c) { var s = ""; for (var i = 0; i < 5; i++) { var ww = w - i * w / 6; s += '<rect x="' + (x + (w - ww) / 2) + '" y="' + (y + h - (i + 1) * h / 5) + '" width="' + ww + '" height="' + (h / 5 + 1) + '" fill="' + c + '" opacity="' + (1 - i * .06) + '"/>'; } return s; },
    obelisk: function (x, y, w, h, c) { return '<path d="M' + x + " " + (y + h) + "L" + (x + w * .2) + " " + (y + 10) + "L" + (x + w / 2) + " " + y + "L" + (x + w * .8) + " " + (y + 10) + "L" + (x + w) + " " + (y + h) + 'z" fill="#f4f1ea" stroke="' + c + '"/>'; },
    walls: function (x, y, w, h, c) { var s = '<path d="M' + x + " " + (y + h) + "Q" + (x + w / 2) + " " + (y - 10) + " " + (x + w) + " " + (y + h) + 'z" fill="#8f9b5a" opacity=".6"/>'; s += '<rect x="' + (x + w * .15) + '" y="' + (y + h * .35) + '" width="' + (w * .7) + '" height="' + (h * .4) + '" fill="' + c + '"/>'; for (var i = 0; i < 6; i++) s += '<rect x="' + (x + w * .15 + i * w * .12) + '" y="' + (y + h * .27) + '" width="' + (w * .06) + '" height="' + (h * .1) + '" fill="' + c + '"/>'; return s + '<rect x="' + (x + w * .55) + '" y="' + (y + h * .15) + '" width="' + (w * .12) + '" height="' + (h * .6) + '" fill="' + c + '"/>'; },
    palms: function (x, y, w, h) { var s = ""; for (var i = 0; i < 3; i++) { var px = x + i * w / 3; s += '<path d="M' + px + " " + (y + h) + "q4 -" + (h / 2) + " 2 -" + h + '" stroke="#6b5a3a" stroke-width="3" fill="none"/><path d="M' + (px + 2) + " " + y + "q-14 2 -20 12M" + (px + 2) + " " + y + "q14 2 20 12M" + (px + 2) + " " + y + "q-4 -8 -14 -10M" + (px + 2) + " " + y + 'q6 -8 16 -8" stroke="#4f6b3a" stroke-width="3" fill="none"/>'; } return s; },
    train: function (x, y) { return '<rect x="' + x + '" y="' + y + '" width="140" height="24" rx="10" fill="#b8433a"/><rect x="' + (x + 10) + '" y="' + (y + 5) + '" width="120" height="8" fill="#f4efe6" opacity=".9"/><rect x="' + (x - 10) + '" y="' + (y + 26) + '" width="170" height="3" fill="#555"/>'; }
  };
  var SCN = {
    madrid: [["houses", 0, 66, 140, 44], ["dome", 150, 24, 100, 86], ["houses", 260, 70, 160, 40]],
    plaza: [["houses", 0, 50, 420, 60], ["arches", 120, 70, 180, 40]],
    toledo: [["houses", 0, 74, 420, 36], ["walls", 120, 22, 200, 60], ["tower", 300, 30, 16, 60]],
    barcelona: [["houses", 0, 72, 150, 38], ["spires", 160, 8, 120, 102], ["houses", 300, 74, 120, 36]],
    valencia: [["houses", 0, 70, 120, 40], ["dome", 130, 40, 90, 70], ["arches", 230, 64, 130, 46], ["palms", 360, 60, 60, 50]],
    sevilla: [["houses", 0, 72, 160, 38], ["tower", 180, 6, 26, 104], ["houses", 220, 70, 200, 40], ["palms", 60, 60, 60, 50]],
    granada: [["walls", 60, 18, 300, 70], ["cypress", 40, 40, 10, 60], ["cypress", 380, 46, 10, 56], ["houses", 0, 88, 420, 22]],
    salamanca: [["houses", 0, 70, 130, 40], ["dome", 140, 20, 120, 90], ["tower", 270, 26, 18, 84], ["houses", 300, 72, 120, 38]],
    mexico: [["houses", 0, 74, 120, 36], ["pyramid", 130, 30, 170, 80], ["houses", 320, 74, 100, 36]],
    buenosaires: [["houses", 0, 64, 180, 46], ["obelisk", 196, 4, 28, 106], ["houses", 240, 66, 180, 44]],
    cafe: [["houses", 0, 50, 420, 60], ["awning", 140, 54, 130]],
    market: [["houses", 0, 50, 420, 60], ["awning", 40, 60, 110], ["awning", 250, 60, 120]],
    station: [["houses", 0, 50, 420, 40], ["train", 140, 82]],
    beach: [["houses", 0, 60, 160, 30], ["water", 0, 90, 420, 30], ["palms", 260, 50, 140, 50]]
  };
  IT.scene = function (id, cls) {
    var pal = PAL[id] || PAL.madrid, items = SCN[id] || SCN.madrid, gid = "g" + Math.random().toString(36).slice(2, 7);
    var body = items.map(function (it) { return BLD[it[0]](it[1], it[2], it[3], it[4], pal[2]); }).join("");
    return '<svg class="scene ' + (cls || "") + '" viewBox="0 0 420 120" preserveAspectRatio="xMidYMax slice" aria-hidden="true"><defs><linearGradient id="' + gid + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + pal[0] + '"/><stop offset="1" stop-color="' + pal[1] + '"/></linearGradient></defs>' +
      '<rect width="420" height="120" fill="url(#' + gid + ')"/><circle cx="350" cy="30" r="16" fill="#fff4d6" opacity=".85"/><path d="M0 100 Q80 80 160 96 T420 92 V120 H0z" fill="#9aa86a" opacity=".55"/>' + body + "</svg>";
  };

  /* ---------- Модальные окна ---------- */
  IT.modal = function (html, opts) {
    opts = opts || {};
    var wrap = IT.h('<div class="modal-back' + (opts.wide ? " wide" : "") + '"><div class="modal" role="dialog" aria-modal="true"><button class="modal-x" data-close aria-label="Закрыть">' + IT.icon("close") + '</button><div class="modal-body">' + html + "</div></div></div>");
    document.body.appendChild(wrap);
    requestAnimationFrame(function () { wrap.classList.add("show"); });
    function close() { wrap.classList.remove("show"); setTimeout(function () { wrap.remove(); }, 220); if (opts.onClose) opts.onClose(); }
    wrap.addEventListener("click", function (e) { if (e.target === wrap || e.target.closest("[data-close]")) close(); });
    wrap.close = close;
    return wrap;
  };
  IT.closeModals = function () {
    Array.prototype.forEach.call(document.querySelectorAll(".modal-back"), function (w) { if (w.close) w.close(); else w.remove(); });
  };
  IT.confirm = function (text, okLabel, onOk, danger) {
    var m = IT.modal('<h3 class="m-title">' + esc(text) + '</h3><div class="row gap end mt"><button class="btn ghost" data-close>' + IT.t("cancel") + '</button><button class="btn ' + (danger ? "danger" : "primary") + '" data-ok>' + esc(okLabel) + "</button></div>");
    m.querySelector("[data-ok]").onclick = function () { m.close(); onOk(); };
  };

  IT.toast = function (html, kind) {
    var box = $("#toasts");
    var el = IT.h('<div class="toast ' + (kind || "") + '">' + html + "</div>");
    box.appendChild(el);
    requestAnimationFrame(function () { el.classList.add("show"); });
    setTimeout(function () { el.classList.remove("show"); setTimeout(function () { el.remove(); }, 300); }, 3200);
  };

  /* ---------- Конфетти ---------- */
  IT.confetti = function () {
    var c = document.createElement("canvas"); c.className = "confetti"; document.body.appendChild(c);
    var ctx = c.getContext("2d"), W = c.width = innerWidth, H = c.height = innerHeight;
    var cols = ["#c2572e", "#6f7d3a", "#d9a441", "#2f6f8f", "#f2efe6", "#b8434f"];
    var ps = []; for (var i = 0; i < 140; i++) ps.push({ x: W / 2 + (Math.random() - .5) * 200, y: H * .35, vx: (Math.random() - .5) * 14, vy: -Math.random() * 14 - 4, r: Math.random() * 6 + 3, c: cols[i % cols.length], a: Math.random() * 6 });
    var t = 0;
    (function frame() {
      ctx.clearRect(0, 0, W, H); t++;
      ps.forEach(function (p) { p.x += p.vx; p.y += p.vy; p.vy += .35; p.vx *= .99; p.a += .1; ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.a); ctx.fillStyle = p.c; ctx.fillRect(-p.r / 2, -p.r / 4, p.r, p.r / 2); ctx.restore(); });
      if (t < 150) requestAnimationFrame(frame); else c.remove();
    })();
  };

  /* ---------- Глобальные обработчики ---------- */
  document.addEventListener("click", function (e) {
    var say = e.target.closest("[data-say]");
    if (say) { e.preventDefault(); e.stopPropagation(); say.classList.add("playing"); IT.audio.speak(say.getAttribute("data-say"), { slow: say.hasAttribute("data-slow"), lang: say.getAttribute("data-lang") || undefined }).then(function () { say.classList.remove("playing"); }); noVoiceHint(); return; }
    var nav = e.target.closest("[data-go]");
    if (nav) { e.preventDefault(); IT.go(nav.getAttribute("data-go")); }
  }, true);
  var hinted = false;
  function noVoiceHint() {
    if (hinted) return; hinted = true;
    setTimeout(function () {
      if (!IT.audio.available()) IT.toast(IT.t("noSpeech"), "warn");
      else if (!IT.audio.hasSpanish()) IT.toast(IT.t("noItVoice"), "warn");
    }, 600);
  }

  /* ---------- Маршрутизация ---------- */
  IT.views = {};
  var ROUTES = ["path", "practice", "dialogues", "media", "dictionary", "tutor", "stats", "profile"];
  IT.route = "path";
  IT.go = function (r) {
    if (ROUTES.indexOf(r) < 0) r = "path";
    IT.closeModals();
    if (location.hash !== "#" + r) { try { history.replaceState(null, "", "#" + r); } catch (e) { location.hash = r; } }
    IT.route = r; IT.render();
  };
  IT.render = function () {
    var main = $("#main"); if (!main) return;
    IT.renderChrome();
    var v = IT.views[IT.route];
    main.innerHTML = ""; main.onclick = null;
    main.className = "main view-" + IT.route;
    if (v) v(main);
    main.scrollTop = 0; window.scrollTo(0, 0);
  };
  window.addEventListener("hashchange", function () { var r = location.hash.slice(1); if (r && r !== IT.route) { IT.route = ROUTES.indexOf(r) >= 0 ? r : "path"; IT.render(); } });

  IT.applyTheme = function () {
    var th = S.state.profile.theme;
    var dark = th === "dark" || (th === "auto" && window.matchMedia && matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.setAttribute("data-theme", dark ? "dark" : "light");
    document.documentElement.lang = S.state.profile.ui === "es" ? "es" : "ru";
  };

  /* Боковое меню, верхняя и нижняя панели */
  var NAV = [["path", "path", "navPath"], ["practice", "practice", "navPractice"], ["dialogues", "chat", "navDialogues"], ["media", "film", "navMedia"], ["dictionary", "book", "navDict"], ["tutor", "tutor", "navTutor"], ["stats", "stats", "navStats"], ["profile", "user", "navProfile"]];
  IT.renderChrome = function () {
    var st = S.state, lv = IT.levelFromXp(st.xp), streak = IT.streakAlive();
    var side = $("#side"), top = $("#topbar"), bot = $("#botnav");
    side.innerHTML = '<div class="brand" data-go="path"><span class="logo">' + logoSvg() + '</span><span><b>¡Vamos!</b><small>' + IT.t("tagline") + "</small></span></div>" +
      '<nav class="side-nav">' + NAV.map(function (n) { return '<a href="#' + n[0] + '" data-go="' + n[0] + '" class="' + (IT.route === n[0] ? "on" : "") + '">' + IT.icon(n[1]) + "<span>" + IT.t(n[2]) + "</span></a>"; }).join("") + "</nav>" +
      '<div class="side-foot"><div class="lvl-pill">' + IT.icon("star") + " " + IT.t("level") + " " + lv.level + '<div class="bar"><i style="width:' + lv.pct + '%"></i></div></div></div>';
    top.innerHTML = '<div class="brand sm" data-go="path"><span class="logo">' + logoSvg() + "</span><b>¡Vamos!</b></div>" +
      '<div class="top-stats"><span class="chip flame' + (streak ? "" : " off") + '" title="' + IT.t("streak") + '">' + IT.icon("flame") + streak + '</span><span class="chip xp" title="XP">' + IT.icon("bolt") + st.xp + '</span><button class="chip ghost" data-go="stats" aria-label="' + IT.t("navStats") + '">' + IT.icon("stats") + "</button></div>";
    var MAIN = ["path", "practice", "dialogues", "dictionary"], MORE = NAV.filter(function (n) { return MAIN.indexOf(n[0]) < 0; });
    var lbl = function (n) { var sk = IT.t(n[2] + "Short"); return sk !== n[2] + "Short" ? sk : IT.t(n[2]); };
    bot.innerHTML = NAV.filter(function (n) { return MAIN.indexOf(n[0]) >= 0; }).map(function (n) { return '<a href="#' + n[0] + '" data-go="' + n[0] + '" class="' + (IT.route === n[0] ? "on" : "") + '">' + IT.icon(n[1]) + "<span>" + lbl(n) + "</span></a>"; }).join("") +
      '<button class="' + (MAIN.indexOf(IT.route) < 0 ? "on" : "") + '" data-more>' + IT.icon("grid") + "<span>" + (MAIN.indexOf(IT.route) < 0 ? lbl(NAV.find(function (n) { return n[0] === IT.route; }) || NAV[0]) : IT.t("more")) + "</span></button>";
    bot.querySelector("[data-more]").onclick = function () {
      var m = IT.modal('<h3 class="m-title">' + IT.t("more") + '</h3><div class="more-grid">' + MORE.map(function (n) { return '<button class="more-tile' + (IT.route === n[0] ? " on" : "") + '" data-mgo="' + n[0] + '">' + IT.icon(n[1]) + "<span>" + IT.t(n[2]) + "</span></button>"; }).join("") + "</div>");
      m.querySelectorAll("[data-mgo]").forEach(function (b) { b.onclick = function () { m.close(); IT.go(b.getAttribute("data-mgo")); }; });
    };
  };
  function logoSvg() { return '<img src="icons/icon.svg" alt="" width="40" height="40">'; }


  /* ---------- Учёт времени занятий ---------- */
  IT.activeActivity = null;
  setInterval(function () {
    if (!IT.activeActivity || document.hidden) return;
    IT.addTime(5);
    var mins = Math.floor(IT.dayLog().sec / 60);
    IT.questProgress("minutes", mins, true);
    if (IT.dayLog().sec % 30 === 0) S.save();
  }, 5000);

  /* ---------- Реакции на события игры ---------- */
  S.on(function (ev, d) {
    if (ev === "quest") IT.toast(IT.icon("target") + " <b>" + IT.t("questDone") + "</b> " + esc(IT.tt(d)) + " · +15 XP", "ok");
    if (ev === "chest") IT.toast(IT.icon("gift") + " <b>" + IT.t("allQuests") + "</b> +" + d + " XP", "gold");
    if (ev === "weekly") IT.toast(IT.icon("trophy") + " <b>" + IT.t("weeklyDone") + "</b> +100 XP", "gold");
    if (ev === "ach") IT.toast('<span class="ach-emoji">' + d.i + "</span> <b>" + IT.t("achUnlocked") + "</b> " + esc(IT.tt(d)), "gold");
    if (ev === "levelup") setTimeout(function () { IT.confetti(); IT.modal('<div class="center"><div class="big-badge">' + d + '</div><h2 class="m-title">' + IT.t("levelUp") + '</h2><p class="muted">' + IT.t("levelUpText") + '</p><button class="btn primary mt" data-close>' + IT.t("great") + "</button></div>"); }, 400);
    if (ev === "remote-loaded") { IT.applyTheme(); IT.render(); IT.toast(IT.icon("refresh") + " " + IT.t("syncLoaded"), "ok"); }
  });
})(window.IT);
