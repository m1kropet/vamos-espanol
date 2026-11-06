/* Service worker: приложение работает офлайн. При обновлении файлов увеличьте VERSION. */
const VERSION = "vamos-v5";
const FILES = ["./", "index.html", "manifest.webmanifest", "css/app.css", "js/app.js", "js/core/ai-api.js", "js/core/audio.js", "js/core/course.js", "js/core/engine.js", "js/core/game.js", "js/core/i18n-es.js", "js/core/i18n.js", "js/core/store.js",
  "js/core/cloud.js", "js/data/a1-part1.js", "js/data/a1-part2.js", "js/data/a2.js", "js/data/dialogues.js", "js/data/extras.js", "js/data/word-examples.js", "js/native.js", "js/pwa.js", "js/ui/dialects.js", "js/ui/dialogues.js", "js/ui/dictionary.js", "js/ui/home.js", "js/ui/lesson.js", "js/ui/media.js", "js/ui/practice.js", "js/ui/profile.js", "js/ui/shell.js", "js/ui/stats.js", "js/ui/translate.js", "js/ui/tutor.js", "icons/apple-180.png", "icons/favicon-32.png", "icons/icon-192.png", "icons/icon-512.png", "icons/icon.svg", "icons/maskable-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION && k !== "vamos-fonts").map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (e.request.method !== "GET") return;
  if (url.hostname === "api.anthropic.com") return; // запросы к ИИ — всегда в сеть
  if (url.hostname.indexOf("fonts.g") === 0) {
    e.respondWith(caches.open("vamos-fonts").then(c => c.match(e.request).then(r => r || fetch(e.request).then(res => { c.put(e.request, res.clone()); return res; }).catch(() => r))));
    return;
  }
  if (url.origin === location.origin) {
    e.respondWith(caches.match(e.request, { ignoreSearch: true }).then(r => r || fetch(e.request).then(res => { const copy = res.clone(); caches.open(VERSION).then(c => c.put(e.request, copy)); return res; })).catch(() => caches.match("index.html")));
  }
});
