/* Нара — талисман приложения: валенсийский апельсин. Рисуется SVG, без картинок.
 * IT.mascot(mood, size): mood = "hi" | "cheer" | "think" | "sad"
 * IT.bunting(n): гирлянда «папель пикадо» — флажки в цветах фиесты */
(function (IT) {
  var INK = "#1E2240";
  function eyes(mood) {
    if (mood === "cheer") // глаза-дуги от радости
      return '<path d="M38 62q8 -9 16 0M66 62q8 -9 16 0" stroke="' + INK + '" stroke-width="4" fill="none" stroke-linecap="round"/>';
    var dy = mood === "think" ? -3 : mood === "sad" ? 2 : 0, dx = mood === "think" ? 2 : 0;
    var lid = mood === "sad" ? '<path d="M38 57l13 -4M82 57l-13 -4" stroke="' + INK + '" stroke-width="3" stroke-linecap="round"/>' : "";
    return '<ellipse cx="46" cy="64" rx="9" ry="10.5" fill="#fff"/><ellipse cx="74" cy="64" rx="9" ry="10.5" fill="#fff"/>' +
      '<circle cx="' + (47 + dx) + '" cy="' + (66 + dy) + '" r="5.2" fill="' + INK + '"/><circle cx="' + (75 + dx) + '" cy="' + (66 + dy) + '" r="5.2" fill="' + INK + '"/>' +
      '<circle cx="' + (49 + dx) + '" cy="' + (63.5 + dy) + '" r="1.8" fill="#fff"/><circle cx="' + (77 + dx) + '" cy="' + (63.5 + dy) + '" r="1.8" fill="#fff"/>' + lid;
  }
  function mouth(mood) {
    if (mood === "cheer") return '<path d="M49 79q11 15 22 0z" fill="#7A1F2B"/><path d="M54 85q6 4 12 0q-6 -4 -12 0z" fill="#FF6B81"/>';
    if (mood === "think") return '<ellipse cx="62" cy="83" rx="4" ry="3.5" fill="' + INK + '"/>';
    if (mood === "sad") return '<path d="M52 86q8 -7 16 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
    return '<path d="M51 80q9 9 18 0" stroke="' + INK + '" stroke-width="3.5" fill="none" stroke-linecap="round"/>';
  }
  function arms(mood) {
    var a = 'stroke="#F07A0E" stroke-width="8" fill="none" stroke-linecap="round"';
    var hand = function (x, y) { return '<circle cx="' + x + '" cy="' + y + '" r="5.5" fill="#FF9A3A"/>'; };
    if (mood === "cheer") return '<path d="M24 66q-12 -10 -10 -26" ' + a + "/>" + hand(14, 38) + '<path d="M96 66q12 -10 10 -26" ' + a + "/>" + hand(106, 38);
    if (mood === "think") return '<path d="M24 74q-8 6 -6 16" ' + a + "/>" + hand(18, 92) + '<path d="M95 78q-6 10 -22 12" ' + a + "/>" + hand(72, 90);
    if (mood === "sad") return '<path d="M24 74q-8 8 -6 18" ' + a + "/>" + hand(18, 94) + '<path d="M96 74q8 8 6 18" ' + a + "/>" + hand(102, 94);
    return '<path d="M24 74q-8 8 -6 18" ' + a + "/>" + hand(18, 94) + '<path d="M96 66q14 -8 12 -26" ' + a + ' class="wave"/>' + hand(108, 38);
  }
  IT.mascot = function (mood, size, cls) {
    mood = mood || "hi"; size = size || 96;
    return '<svg class="mascot m-' + mood + " " + (cls || "") + '" width="' + size + '" height="' + size + '" viewBox="0 0 120 120" role="img" aria-label="Нара">' +
      '<ellipse cx="60" cy="113" rx="30" ry="5" fill="rgba(30,34,64,.12)"/>' +
      arms(mood) +
      '<circle cx="60" cy="68" r="40" fill="#FF8A1F"/>' +
      '<path d="M60 108a40 40 0 0 1 -38 -28a44 44 0 0 0 76 0a40 40 0 0 1 -38 28z" fill="#F07A0E" opacity=".55"/>' +
      '<ellipse cx="42" cy="44" rx="13" ry="7" transform="rotate(-32 42 44)" fill="#FFC27A" opacity=".9"/>' +
      '<circle cx="83" cy="88" r="1.6" fill="#E06C00" opacity=".6"/><circle cx="90" cy="78" r="1.4" fill="#E06C00" opacity=".6"/><circle cx="33" cy="92" r="1.5" fill="#E06C00" opacity=".6"/>' +
      '<path d="M60 30l-3 -9" stroke="#7A4B1F" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M60 26c5 -13 19 -18 31 -13c-5 12 -19 17 -31 13z" fill="#22B35E"/><path d="M62 25c8 -5 16 -8 25 -10" stroke="#17904A" stroke-width="2" fill="none" stroke-linecap="round"/>' +
      eyes(mood) +
      '<ellipse cx="36" cy="80" rx="6.5" ry="4" fill="#FF5C7A" opacity=".5"/><ellipse cx="84" cy="80" rx="6.5" ry="4" fill="#FF5C7A" opacity=".5"/>' +
      mouth(mood) + "</svg>";
  };

  var FLAGS = ["#2C64F5", "#FFB800", "#D93F9C", "#17B26A", "#FF7A1A", "#12A9C4"];
  IT.bunting = function (n) {
    n = n || 14; var w = 600 / n, s = '<path d="M0 6 Q300 22 600 6" stroke="rgba(30,34,64,.25)" stroke-width="1.5" fill="none"/>';
    for (var i = 0; i < n; i++) {
      var x = i * w + 4, y0 = 6 + 16 * Math.sin(Math.PI * (i + .5) / n) * .9, c = FLAGS[i % FLAGS.length];
      s += '<path d="M' + x + " " + y0 + "h" + (w - 8) + "l-" + ((w - 8) / 2) + " " + (w * .9) + 'z" fill="' + c + '"/>' +
        '<circle cx="' + (x + (w - 8) / 2) + '" cy="' + (y0 + w * .32) + '" r="' + (w * .09) + '" fill="rgba(255,255,255,.55)"/>';
    }
    return '<svg class="bunting" viewBox="0 0 600 ' + Math.ceil(w + 26) + '" preserveAspectRatio="none" aria-hidden="true">' + s + "</svg>";
  };

  // Цвет юнита: каждый юнит — свой цвет, по кругу
  IT.UNIT_COLORS = [["#2C64F5", "#1D47C2"], ["#17B26A", "#0F8A51"], ["#D93F9C", "#A82A76"], ["#FF7A1A", "#D35F06"], ["#12A9C4", "#0B8297"], ["#7B5CF5", "#5A3ED0"]];
  IT.unitColor = function (u) { var c = IT.UNIT_COLORS[(u.index || 0) % IT.UNIT_COLORS.length]; return "--uc:" + c[0] + ";--ucd:" + c[1]; };
})(window.IT);
