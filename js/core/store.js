/* Состояние пользователя, сохранение (localStorage + облачная база артефакта), интервальное повторение */
(function (IT) {
  var LS_KEY = "espanol-app-v1";
  var DAY = 86400000;

  function today(d) {
    d = d || new Date();
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  function weekKey(d) {
    d = new Date(d || Date.now()); d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7));
    var w1 = new Date(d.getFullYear(), 0, 4);
    var n = 1 + Math.round(((d - w1) / DAY - 3 + ((w1.getDay() + 6) % 7)) / 7);
    return d.getFullYear() + "-W" + n;
  }
  IT.today = today; IT.weekKey = weekKey; IT.DAY = DAY;

  function fresh() {
    return {
      v: 1, created: Date.now(), updatedAt: 0,
      profile: { onboarded: false, ui: "ru", theme: "light", goal: 15, speed: 0.9, start: "never", sfx: true, autoplay: true, variant: "es-ES" },
      unlocked: 0, lessons: {}, tests: {}, words: {}, custom: [], xp: 0, log: {},
      streak: { n: 0, best: 0, last: "" }, quests: { day: "", list: [], bonus: false }, weekly: { wk: "", id: "", p: 0, done: false },
      ach: {}, tags: {}, mistakes: [], resume: null, dlg: {}, trOverrides: {}, media: null, dialectQuiz: { best: 0 },
      cnt: { perfect: 0, reviews: 0, listen: 0, tutor: 0, combo: 0, dlg: 0, speak: 0, lessons: 0, tests: 0, media: 0, translate: 0 },
      tutorChat: []
    };
  }

  function merge(base, saved) {
    if (!saved || typeof saved !== "object") return base;
    Object.keys(saved).forEach(function (k) {
      if (base[k] && typeof base[k] === "object" && !Array.isArray(base[k]) && saved[k] && typeof saved[k] === "object" && !Array.isArray(saved[k])) {
        base[k] = merge(base[k], saved[k]);
      } else base[k] = saved[k];
    });
    return base;
  }

  var S = {
    state: fresh(),
    remote: null, remoteStatus: "local", listeners: [],
    load: function () {
      try {
        var raw = localStorage.getItem(LS_KEY);
        if (raw) this.state = merge(fresh(), JSON.parse(raw));
      } catch (e) { /* хранилище недоступно — работаем в памяти */ }
      return this.state;
    },
    on: function (fn) { this.listeners.push(fn); },
    emit: function (ev, data) { this.listeners.forEach(function (f) { try { f(ev, data); } catch (e) { console.error(e); } }); },
    _t: null,
    save: function () {
      var st = this.state; st.updatedAt = Date.now();
      // ограничиваем размер
      if (st.mistakes.length > 60) st.mistakes = st.mistakes.slice(-60);
      if (st.tutorChat.length > 40) st.tutorChat = st.tutorChat.slice(-40);
      var days = Object.keys(st.log).sort();
      if (days.length > 400) days.slice(0, days.length - 400).forEach(function (d) { delete st.log[d]; });
      try { localStorage.setItem(LS_KEY, JSON.stringify(st)); } catch (e) { }
      var self = this;
      clearTimeout(this._t);
      this._t = setTimeout(function () { self.pushRemote(); }, 2500);
    },
    _writing: false, _again: false,
    pushRemote: function () {
      var self = this;
      if (!this.remote) return;
      if (this._writing) { this._again = true; return; }
      this._writing = true;
      var body = JSON.parse(JSON.stringify(this.state));
      this.remote.set({ json: JSON.stringify(body), updatedAt: body.updatedAt }).then(function () {
        self.remoteStatus = "synced"; self.emit("sync");
      }).catch(function (e) {
        self.remoteStatus = (e && (e.code === "revoked" || e.code === "invalid_argument" || e.code === "not_granted")) ? "local" : "error";
        if (self.remoteStatus === "local") self.remote = null;
        self.emit("sync");
      }).then(function () {
        self._writing = false;
        if (self._again) { self._again = false; self.pushRemote(); }
      });
    },
    /** Подключение к базе артефакта: прогресс сохраняется между устройствами */
    initRemote: function () {
      var self = this;
      if (!window.claude || typeof window.claude.use !== "function") return;
      Promise.all([window.claude.use("db"), window.claude.use("user")]).then(function (r) {
        var db = r[0], user = r[1];
        if (!db || !user) return;
        return user.id().then(function (id) {
          if (!id) return;
          var ref = db.doc("data/users/" + id + "/progress");
          var timer = setTimeout(function () { self.remoteStatus = "error"; self.emit("sync"); }, 10000);
          return ref.get().then(function (snap) {
            clearTimeout(timer);
            self.remote = ref; self.remoteStatus = "synced";
            if (snap.exists) {
              var d = snap.data();
              var remoteState = null;
              try { remoteState = JSON.parse(d.json); } catch (e) { }
              if (remoteState && (remoteState.updatedAt || 0) > (self.state.updatedAt || 0)) {
                self.state = merge(fresh(), remoteState);
                try { localStorage.setItem(LS_KEY, JSON.stringify(self.state)); } catch (e) { }
                self.emit("remote-loaded");
              } else if ((self.state.updatedAt || 0) > (d.updatedAt || 0)) self.pushRemote();
            } else if (self.state.updatedAt) self.pushRemote();
            self.emit("sync");
          }).catch(function () { clearTimeout(timer); self.remoteStatus = "error"; self.emit("sync"); });
        });
      }).catch(function () { });
    },
    reset: function () {
      var keep = { ui: this.state.profile.ui, theme: this.state.profile.theme };
      this.state = fresh();
      this.state.profile.ui = keep.ui; this.state.profile.theme = keep.theme;
      this.save();
    },
    exportJSON: function () { return JSON.stringify(this.state); },
    importJSON: function (txt) {
      var obj = JSON.parse(txt);
      if (!obj || obj.v !== 1 || !obj.profile) throw new Error("bad");
      this.state = merge(fresh(), obj); this.save();
    }
  };
  IT.store = S;

  /* ===== Учёт активности ===== */
  IT.dayLog = function (d) {
    var st = S.state, k = d || today();
    if (!st.log[k]) st.log[k] = { xp: 0, sec: 0, les: 0, ok: 0, tot: 0, rev: 0 };
    return st.log[k];
  };
  IT.addTime = function (sec) {
    if (sec <= 0 || sec > 120) return;
    IT.dayLog().sec += sec;
  };

  /* ===== Интервальное повторение (вариант SM-2) =====
   * grade: 0 — снова, 1 — трудно, 2 — хорошо, 3 — легко */
  IT.srs = {
    ensure: function (key, lessonId) {
      var w = S.state.words[key];
      if (!w) {
        w = S.state.words[key] = { e: 2.5, i: 0, due: Date.now() + 6 * 3600000, r: 0, l: 0, fav: false, seen: Date.now(), ok: 0, bad: 0, src: lessonId || null };
      }
      return w;
    },
    grade: function (key, g) {
      var w = this.ensure(key), now = Date.now();
      if (g === 0) {
        w.l++; w.r = 0; w.i = 0; w.e = Math.max(1.3, w.e - 0.2); w.due = now + 10 * 60000; w.bad++;
      } else {
        w.ok++;
        if (w.r === 0) w.i = g === 1 ? 1 : g === 2 ? 1 : 3;
        else if (w.r === 1) w.i = g === 1 ? 3 : g === 2 ? 4 : 6;
        else w.i = Math.round(w.i * (g === 1 ? 1.2 : g === 2 ? w.e : w.e * 1.3));
        w.e = Math.max(1.3, w.e + (g === 1 ? -0.15 : g === 3 ? 0.15 : 0));
        w.r++; w.due = now + w.i * DAY;
      }
      return w;
    },
    /** Мягкая отметка из упражнений урока: верно — слово крепнет, ошибка — в ближайшее повторение */
    soft: function (key, ok) {
      var w = S.state.words[key]; if (!w) return;
      if (ok) { w.ok++; } else { w.bad++; w.due = Math.min(w.due, Date.now()); if (w.r > 0) w.r = Math.max(0, w.r - 1); }
    },
    due: function () {
      var now = Date.now(), st = S.state.words;
      return Object.keys(st).filter(function (k) { return st[k].due <= now && IT.wordInfo(k); })
        .sort(function (a, b) { return st[a].due - st[b].due; });
    },
    strength: function (key) {
      var w = S.state.words[key]; if (!w) return 0;
      if (w.r === 0) return w.ok > 0 ? 1 : 0;
      return Math.min(4, w.i >= 21 ? 4 : w.i >= 7 ? 3 : 2);
    }
  };

  IT.wordInfo = function (key) {
    if (IT.vocab[key]) return IT.vocab[key];
    var c = S.state.custom.find(function (w) { return w.key === key; });
    return c || null;
  };
})(window.IT);
