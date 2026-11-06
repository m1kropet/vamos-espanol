// Проверка всего контента: каждое задание рендерится, правильный ответ засчитывается, HTML сбалансирован
import assert from "node:assert/strict";
import C from "../src/content.js";
import { render, checkText, feedback } from "../src/exercises.js";
import { align, stressView, tokens } from "../src/pron.js";
const u = { variant: "esp", level: "all" };
const bal = (s) => { for (const t of ["b", "i", "code", "s", "a"]) assert.equal((s.match(new RegExp("<" + t + "[ >]", "g")) || []).length, (s.match(new RegExp("</" + t + ">", "g")) || []).length, s); };
let n = 0;
C.say.forEach((s) => { const ex = { type: "say", es: s[0], ru: s[1] }; bal(render(ex, u).text); assert.equal(align(s[0], s[0]).score, 100, s[0]); n++; });
C.tr.forEach((t) => { assert.ok(checkText(t[1], [t[1], ...t[2]]).ok); bal(feedback({ type: "tr", note: t[4] }, { ok: false, target: t[1] }, "x<y")); n++; });
C.fill.forEach((q) => { q[1].forEach((a) => assert.ok(checkText(a, q[1], true).ok, a)); bal(render({ type: "fill", q: q[0], hint: q[3] }, u).text); n++; });
C.fix.forEach((q) => { assert.ok(checkText(q[1][0], q[1], "accents").ok); assert.ok(!checkText(q[0], q[1], "accents").ok, "broken == fixed? " + q[0]); n++; });
C.choice.forEach((q) => { assert.ok(q[2] >= 0 && q[2] < q[1].length, q[0]); q[1].forEach((o) => assert.ok(o.length <= 60, "long option " + o)); n++; });
C.vocab.forEach((v) => { assert.ok(v[0] && v[1]); n++; });
// без падений на редких словах
for (const s of C.say) for (const t of tokens(s[0])) stressView(t.raw);
console.log("content OK:", n, "items");
