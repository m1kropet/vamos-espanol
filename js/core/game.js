/* Игровая система: опыт, уровни, серии, задания, достижения, открытие уроков */
(function (IT) {
  var S = IT.store;
  function st() { return S.state; }

  /* ---------- Уровень пользователя ---------- */
  IT.levelFromXp = function (xp) {
    var L = 1; while (xp >= 50 * (L + 1) * L) L++;
    var cur = 50 * L * (L - 1), next = 50 * (L + 1) * L;
    return { level: L, cur: xp - cur, need: next - cur, pct: Math.round((xp - cur) / (next - cur) * 100) };
  };

  /* ---------- Открытие уроков ---------- */
  IT.prog = {
    unitOpen: function (u) { return u.index <= st().unlocked; },
    lessonDone: function (id) { return !!(st().lessons[id] && st().lessons[id].done); },
    lessonOpen: function (l) {
      var u = l.unit;
      if (!this.unitOpen(u)) return false;
      if (u.index < st().unlocked) return true;
      return l.li === 0 || this.lessonDone(u.lessons[l.li - 1].id);
    },
    unitLessonsDone: function (u) { var self = this; return u.lessons.every(function (l) { return self.lessonDone(l.id); }); },
    testOpen: function (u) { return this.unitOpen(u) && (this.unitLessonsDone(u) || u.index < st().unlocked); },
    testPassed: function (u) { return !!(st().tests[u.id] && st().tests[u.id].passed); },
    unitPct: function (u) {
      var self = this, n = u.lessons.filter(function (l) { return self.lessonDone(l.id); }).length + (this.testPassed(u) ? 1 : 0);
      return Math.round(n / (u.lessons.length + 1) * 100);
    },
    levelPct: function (lv) {
      var self = this, ls = IT.allLessons.filter(function (l) { return l.level === lv; });
      if (!ls.length) return 0;
      return Math.round(ls.filter(function (l) { return self.lessonDone(l.id); }).length / ls.length * 100);
    },
    /** Следующая цель на карте */
    next: function () {
      for (var i = 0; i < IT.units.length; i++) {
        var u = IT.units[i];
        if (!this.unitOpen(u)) break;
        for (var j = 0; j < u.lessons.length; j++) {
          var l = u.lessons[j];
          if (!this.lessonDone(l.id) && this.lessonOpen(l)) return { kind: "lesson", lesson: l, unit: u };
        }
        if (!this.testPassed(u) && this.testOpen(u)) return { kind: "test", unit: u };
      }
      return null;
    },
    cefr: function () {
      var lv = "A1";
      IT.levels.forEach(function (L) { if (IT.prog.levelPct(L.id) >= 100) lv = L.id; });
      var cur = IT.units[Math.min(st().unlocked, IT.units.length - 1)];
      return cur ? cur.level : lv;
    }
  };

  /* ---------- Опыт и серия ---------- */
  IT.addXp = function (n, reason) {
    if (!n) return;
    st().xp += n; IT.dayLog().xp += n;
    var before = IT.levelFromXp(st().xp - n).level, after = IT.levelFromXp(st().xp).level;
    IT.questProgress("xp", n);
    touchStreak();
    S.emit("xp", { n: n, reason: reason });
    if (after > before) S.emit("levelup", after);
  };
  function touchStreak() {
    var s = st().streak, t = IT.today();
    if (s.last === t) return;
    var y = IT.today(new Date(Date.now() - IT.DAY));
    s.n = s.last === y ? s.n + 1 : 1;
    s.last = t; s.best = Math.max(s.best, s.n);
    S.emit("streak", s.n);
  }
  IT.streakAlive = function () {
    var s = st().streak, t = IT.today(), y = IT.today(new Date(Date.now() - IT.DAY));
    return s.last === t || s.last === y ? s.n : 0;
  };

  /* ---------- Ежедневные задания ---------- */
  var QUESTS = [
    { id: "xp50", m: "xp", n: 50, t: "Наберите 50 XP", ti: "Gana 50 XP", i: "⚡" },
    { id: "les2", m: "lesson", n: 2, t: "Пройдите 2 урока", ti: "Completa 2 lecciones", i: "📘" },
    { id: "rev10", m: "review", n: 10, t: "Повторите 10 слов", ti: "Repasa 10 palabras", i: "🔁" },
    { id: "dlg1", m: "dialogue", n: 1, t: "Завершите диалог", ti: "Completa un diálogo", i: "💬" },
    { id: "combo8", m: "combo", n: 8, t: "8 верных ответов подряд", ti: "8 respuestas correctas seguidas", i: "🔥" },
    { id: "perf1", m: "perfect", n: 1, t: "Урок без единой ошибки", ti: "Una lección perfecta", i: "💎" },
    { id: "lis5", m: "listen", n: 5, t: "5 заданий на аудирование", ti: "5 ejercicios de escucha", i: "🎧" },
    { id: "min", m: "minutes", n: 0, t: "Выполните цель по времени", ti: "Cumple tu meta de tiempo", i: "⏱" },
    { id: "speak5", m: "speak", n: 5, t: "Произнесите 5 слов в тренажёре", ti: "Pronuncia 5 palabras", i: "🎙" },
    { id: "xp100", m: "xp", n: 100, t: "Наберите 100 XP", ti: "Gana 100 XP", i: "🏆" }
  ];
  IT.QUESTS = QUESTS;
  function hash(s) { var h = 0; for (var i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0; return Math.abs(h); }
  IT.ensureQuests = function () {
    var q = st().quests, t = IT.today();
    if (q.day === t && q.list.length) return q;
    var pool = QUESTS.slice(), list = [], h = hash(t);
    while (list.length < 3) { var i = h % pool.length; list.push({ id: pool[i].id, p: 0, done: false }); pool.splice(i, 1); h = hash(h + "x"); }
    st().quests = { day: t, list: list, bonus: false };
    return st().quests;
  };
  IT.questDef = function (id) { return QUESTS.find(function (q) { return q.id === id; }); };
  IT.questTarget = function (def) { return def.m === "minutes" ? st().profile.goal : def.n; };
  IT.questProgress = function (metric, amount, absolute) {
    var q = IT.ensureQuests(), changed = false;
    q.list.forEach(function (it) {
      var def = IT.questDef(it.id); if (!def || it.done || def.m !== metric) return;
      it.p = absolute ? Math.max(it.p, amount) : it.p + amount;
      var target = IT.questTarget(def);
      if (it.p >= target) {
        it.p = target; it.done = true; changed = true;
        st().xp += 15; IT.dayLog().xp += 15;
        S.emit("quest", def);
      }
    });
    if (changed && !q.bonus && q.list.every(function (i) { return i.done; })) {
      q.bonus = true; st().xp += 25; IT.dayLog().xp += 25; S.emit("chest", 25);
    }
    IT.weeklyProgress(metric, amount, absolute);
  };

  /* ---------- Еженедельное испытание ---------- */
  var WEEKLY = [
    { id: "wxp", m: "xp", n: 400, t: "Наберите 400 XP за неделю", ti: "Gana 400 XP esta semana" },
    { id: "wles", m: "lesson", n: 6, t: "Пройдите 6 уроков за неделю", ti: "Completa 6 lecciones esta semana" },
    { id: "wrev", m: "review", n: 60, t: "Повторите 60 слов за неделю", ti: "Repasa 60 palabras esta semana" },
    { id: "wdlg", m: "dialogue", n: 3, t: "Завершите 3 диалога за неделю", ti: "Completa 3 diálogos esta semana" },
    { id: "wlis", m: "listen", n: 30, t: "30 заданий на аудирование за неделю", ti: "30 ejercicios de escucha esta semana" }
  ];
  IT.ensureWeekly = function () {
    var w = st().weekly, k = IT.weekKey();
    if (w.wk === k) return w;
    st().weekly = { wk: k, id: WEEKLY[hash(k) % WEEKLY.length].id, p: 0, done: false };
    return st().weekly;
  };
  IT.weeklyDef = function () { var w = IT.ensureWeekly(); return WEEKLY.find(function (x) { return x.id === w.id; }); };
  IT.weeklyProgress = function (metric, amount, absolute) {
    var w = IT.ensureWeekly(), def = IT.weeklyDef();
    if (w.done || def.m !== metric || absolute) return;
    w.p += amount;
    if (w.p >= def.n) { w.p = def.n; w.done = true; st().xp += 100; IT.dayLog().xp += 100; st().ach.weekly = st().ach.weekly || Date.now(); S.emit("weekly", def); }
  };

  /* ---------- Достижения ---------- */
  function wordsLearned() { return Object.keys(st().words).length; }
  function lessonsDone() { return Object.keys(st().lessons).filter(function (k) { return st().lessons[k].done; }).length; }
  IT.wordsLearned = wordsLearned; IT.lessonsDoneCount = lessonsDone;
  IT.ACH = [
    { id: "first", i: "🌱", t: "Первый шаг", ti: "El primer paso", d: "Пройдите первый урок", f: function () { return lessonsDone() >= 1; } },
    { id: "les5", i: "📚", t: "Прилежный ученик", ti: "Estudiante aplicado", d: "Пройдите 5 уроков", f: function () { return lessonsDone() >= 5; } },
    { id: "les15", i: "🎓", t: "Знаток грамматики", ti: "Experto en gramática", d: "Пройдите 15 уроков", f: function () { return lessonsDone() >= 15; } },
    { id: "a1", i: "🏛", t: "Уровень A1 пройден", ti: "Nivel A1 completado", d: "Завершите все уроки A1", f: function () { return IT.prog.levelPct("A1") >= 100; } },
    { id: "test1", i: "🛡", t: "Проверка пройдена", ti: "Examen aprobado", d: "Сдайте первую контрольную юнита", f: function () { return st().cnt.tests >= 1; } },
    { id: "str3", i: "🔥", t: "Разогрев", ti: "Calentamiento", d: "Серия 3 дня", f: function () { return st().streak.best >= 3; } },
    { id: "str7", i: "🌋", t: "Неделя без перерыва", ti: "Una semana seguida", d: "Серия 7 дней", f: function () { return st().streak.best >= 7; } },
    { id: "str30", i: "☀️", t: "Испанское лето", ti: "Verano español", d: "Серия 30 дней", f: function () { return st().streak.best >= 30; } },
    { id: "perf1", i: "💎", t: "Без ошибок", ti: "Perfecto", d: "Пройдите урок без единой ошибки", f: function () { return st().cnt.perfect >= 1; } },
    { id: "perf5", i: "👑", t: "Перфекционист", ti: "Perfeccionista", d: "5 уроков без ошибок", f: function () { return st().cnt.perfect >= 5; } },
    { id: "w50", i: "🗂", t: "Словарный запас", ti: "Vocabulario", d: "Выучите 50 слов", f: function () { return wordsLearned() >= 50; } },
    { id: "w150", i: "📖", t: "Ходячий словарь", ti: "Diccionario andante", d: "Выучите 150 слов", f: function () { return wordsLearned() >= 150; } },
    { id: "dlg1", i: "💬", t: "Первый разговор", ti: "La primera conversación", d: "Завершите диалог", f: function () { return st().cnt.dlg >= 1; } },
    { id: "dlgall", i: "🗣", t: "Душа компании", ti: "El alma de la fiesta", d: "Завершите все диалоги", f: function () { return IT.dialogues.every(function (d) { return st().dlg[d.id] && st().dlg[d.id].done; }); } },
    { id: "xp500", i: "⚡", t: "500 XP", ti: "500 XP", d: "Наберите 500 опыта", f: function () { return st().xp >= 500; } },
    { id: "xp2000", i: "🚀", t: "2000 XP", ti: "2000 XP", d: "Наберите 2000 опыта", f: function () { return st().xp >= 2000; } },
    { id: "rev100", i: "🔁", t: "Память как сталь", ti: "Memoria de acero", d: "Повторите 100 карточек", f: function () { return st().cnt.reviews >= 100; } },
    { id: "lis25", i: "🎧", t: "Чуткое ухо", ti: "Buen oído", d: "25 заданий на аудирование", f: function () { return st().cnt.listen >= 25; } },
    { id: "tutor", i: "👩‍🏫", t: "Любознательность", ti: "Curiosidad", d: "Задайте вопрос преподавателю", f: function () { return st().cnt.tutor >= 1; } },
    { id: "combo15", i: "🎯", t: "Снайпер", ti: "Francotirador", d: "15 верных ответов подряд", f: function () { return st().cnt.combo >= 15; } },
    { id: "weekly", i: "🏅", t: "Победитель недели", ti: "Campeón de la semana", d: "Выполните еженедельное испытание", f: function () { return !!st().ach.weekly; } },
    { id: "night", i: "🌙", t: "Ночная сова", ti: "Noctámbulo", d: "Позанимайтесь после 22:00", f: function () { return !!st().ach.night; } },
    { id: "early", i: "🌅", t: "Ранняя пташка", ti: "Madrugador", d: "Позанимайтесь до 8:00", f: function () { return !!st().ach.early; } },
    { id: "cine", i: "🎬", t: "Киноман", ti: "Cinéfilo", d: "Разберите сцену из фильма или видео", f: function () { return st().cnt.media >= 1; } },
    { id: "trad", i: "🔎", t: "Точный перевод", ti: "Traducción exacta", d: "Сверьте 5 переводов", f: function () { return st().cnt.translate >= 5; } },
    { id: "dial", i: "🌎", t: "Знаток диалектов", ti: "Experto en dialectos", d: "Наберите 8 из 10 в игре «Угадай диалект»", f: function () { return (st().dialectQuiz || {}).best >= 8; } },
    { id: "lvl5", i: "⭐", t: "Уровень 5", ti: "Nivel 5", d: "Достигните 5-го уровня", f: function () { return IT.levelFromXp(st().xp).level >= 5; } }
  ];
  IT.checkAch = function () {
    var h = new Date().getHours();
    if (h >= 22 && !st().ach.night) st().ach.night = Date.now();
    if (h < 8 && !st().ach.early) st().ach.early = Date.now();
    var got = [];
    IT.ACH.forEach(function (a) {
      var key = "a_" + a.id;
      if (!st().ach[key] && a.f()) { st().ach[key] = Date.now(); got.push(a); }
    });
    got.forEach(function (a) { S.emit("ach", a); });
    return got;
  };
  IT.achGot = function (a) { return !!st().ach["a_" + a.id]; };

  /* ---------- Статистика по темам ---------- */
  IT.recordTag = function (tags, ok) {
    (tags || []).forEach(function (t) {
      var r = st().tags[t] || (st().tags[t] = { ok: 0, tot: 0 });
      r.tot++; if (ok) r.ok++;
    });
  };
  IT.TAGS = {
    pronunciacion: "Произношение", saludos: "Приветствия", ser: "Глагол ser", estar: "Глагол estar", usted: "Tú и usted", genero: "Род существительных",
    plural: "Множественное число", articulos: "Артикли", pronombres: "Местоимения", tener: "Tener и hay", numeros: "Числа", hora: "Время",
    presente: "Настоящее время", irregulares: "Неправильные глаголы", comida: "Еда и бар", adjetivos: "Прилагательные", posesivos: "Притяжательные",
    gustar: "Глагол gustar", preposiciones: "Предлоги", pasado: "Прошедшее время", reflexivos: "Возвратные глаголы", futuro: "Будущее время", lessico: "Лексика",
    imperfecto: "Pretérito imperfecto", gerundio: "Estar + gerundio и перифразы", comparativos: "Сравнения", complementos: "Местоимения-дополнения",
    compras: "Покупки и одежда", salud: "Здоровье", imperativo: "Повелительное наклонение", tiempo: "Погода и путешествия", porpara: "Por и para",
    condicional: "Condicional и вежливость", casa: "Дом", trabajo: "Работа"
  };
})(window.IT);
