// Собирает упражнения для бота из данных курса приложения (js/data/*.js) → bot/src/content.js
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const ctx = { IT: {}, console };
ctx.window = ctx;
vm.createContext(ctx);
for (const f of ["js/core/course.js", "js/data/a1-part1.js", "js/data/a1-part2.js", "js/data/a2.js", "js/data/dialogues.js", "js/data/extras.js", "js/data/word-examples.js"]) {
  vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f });
}
const IT = ctx.IT;
const words = (s) => s.replace(/[¿¡?!.,;:«»"()…—–-]/g, " ").trim().split(/\s+/).filter(Boolean).length;
const clean = (s) => String(s || "").replace(/\*\*/g, "").replace(/\[\[|\]\]/g, "").trim();
const hasCyr = (s) => /[а-яё]/i.test(s);

const say = [], tr = [], choice = [], fill = [], fix = [], vocab = [];
const seenSay = new Set();
function addSay(es, ru, lv, src, lid) {
  es = clean(es); ru = clean(ru);
  if (!es || hasCyr(es) || es.includes("___")) return;
  const n = words(es);
  if (n < 1 || n > 12) return;
  const k = es.toLowerCase();
  if (seenSay.has(k)) return;
  seenSay.add(k);
  say.push([es, ru, lv, src, lid || ""]);
}

IT.units.forEach((u, ui) => {
  const lv = u.level || "A1";
  u.lessons.forEach((l, li) => {
    const src = (u.t || "") + " · " + (l.t || "");
    (l.ex || []).forEach((e) => {
      addSay(e[0], e[1], lv, src, l.id);
      if (e[0] && e[1] && !hasCyr(e[0]) && words(e[0]) <= 10) tr.push([clean(e[1]), clean(e[0]), (e[4] || []).map(clean), lv, clean(e[3] || ""), l.id]);
    });
    (l.voc || []).forEach((v) => {
      const p = String(v).split("|");
      if (p[0] && p[1]) vocab.push([p[0], p[1], p[2] || "", p[3] || "", lv, l.id]);
      if (p[4]) addSay(p[4], p[5] || "", lv, src, l.id);
    });
    (l.q || []).forEach((q) => {
      if (q[0] === "c" && Array.isArray(q[2]) && q[2].length >= 2 && q[2].length <= 4) choice.push([clean(q[1]), q[2].map(clean), q[3], clean(q[4]), lv, l.id]);
      else if (q[0] === "f") fill.push([clean(q[1]), String(q[2]).split("/").map(clean), clean(q[3]), clean(q[4] || ""), lv, l.id]);
      else if (q[0] === "x") fix.push([clean(q[1]), String(q[2]).split("/").map(clean), clean(q[3]), lv, l.id]);
    });
  });
});
(IT.dialogues || []).forEach((d) => {
  const lv = d.level || "A1";
  (d.steps || []).forEach((s) => {
    addSay(s.npc, s.ru, lv, "Диалог: " + (d.t || ""), "dlg:" + d.id);
    addSay(s.model, "", lv, "Диалог: " + (d.t || ""), "dlg:" + d.id);
  });
});
Object.entries(IT.wordExamples || {}).forEach(([, e]) => addSay(e[0], e[1], "A1", "Словарь"));

const sounds = (IT.sounds || []).map((s) => ({ s: clean(s.s), r: clean(s.r), w: s.w || [] }));
const out = { say, tr, choice, fill, fix, vocab, sounds };
const counts = Object.fromEntries(Object.entries(out).map(([k, v]) => [k, v.length]));
fs.writeFileSync(
  path.join(root, "bot/src/content.js"),
  "// Автоматически собрано из курса приложения: npm run content\n// " + JSON.stringify(counts) + "\nexport default " + JSON.stringify(out) + ";\n"
);
console.log("content:", counts);
