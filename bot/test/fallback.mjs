import assert from "node:assert/strict";
import { speak, transcribe } from "../src/speech.js";
const calls = [];
const env = { AI: { run: async (m, i) => { calls.push(m);
  if (m.includes("aura") || m.endsWith("turbo")) throw new Error("model unavailable");
  if (m.includes("melotts")) return { audio: Buffer.from(new Uint8Array(500).fill(0xff)).toString("base64") };
  if (m === "@cf/openai/whisper") { assert.ok(Array.isArray(i.audio)); return { text: "hola", words: [{ word: "hola", start: 0, end: 0.5 }] }; }
} } };
const a = await speak(env, "Hola", "esp"); assert.equal(a.model, "@cf/myshell-ai/melotts"); assert.equal(a.bytes.length, 500);
const t = await transcribe(env, new Uint8Array([1, 2, 3]).buffer); assert.equal(t.text, "hola"); assert.equal(t.model, "@cf/openai/whisper");
console.log("fallbacks OK", calls.join(" → "));
