// Разговорный партнёр: собеседник-носитель, который отвечает по-испански и мягко исправляет ошибки.
// По умолчанию — бесплатная модель Workers AI; если задан ANTHROPIC_API_KEY — Claude.

const WAI_MODELS = ["@cf/meta/llama-3.3-70b-instruct-fp8-fast", "@cf/meta/llama-3.1-8b-instruct"];

export const TOPICS = {
  cafe: "Вы официант в кафе в Мадриде, собеседник делает заказ.",
  amigos: "Вы новый друг-испанец, знакомитесь на языковом обмене и болтаете о жизни, хобби, работе.",
  viaje: "Вы сотрудник туристического офиса, помогаете спланировать поездку по Испании.",
  tienda: "Вы продавец в магазине одежды.",
  medico: "Вы врач на приёме, собеседник описывает самочувствие.",
  libre: "Свободный разговор на любые темы, которые предложит собеседник.",
};

function system(user) {
  const lv = user.level === "A2" ? "A2 (простое прошедшее, будущее, бытовые темы)" : "A1 (простые фразы в настоящем времени, базовая лексика)";
  const dial = user.variant === "lat" ? "латиноамериканский испанский (ustedes, без vosotros; лексика Мексики)" : "испанский Испании (vosotros, лексика Мадрида)";
  return [
    "Ты — живой собеседник-носитель испанского языка в Telegram. Ученик говорит по-русски, уровень " + lv + ".",
    "Роль: " + (TOPICS[user.topic] || TOPICS.amigos),
    "Вариант языка: " + dial + ".",
    "Правила ответа — строго в формате из трёх блоков:",
    "1) Первая часть: твоя реплика по-испански, 1–3 коротких предложения, лексика по уровню ученика, обязательно заканчивай вопросом, чтобы разговор продолжался. Только испанский, без перевода.",
    "2) Строка из трёх дефисов: ---",
    "3) Вторая часть по-русски: «Перевод: …» (перевод твоей реплики), затем, если в последнем сообщении ученика были ошибки, — «Исправления:» и для каждой: неправильно → правильно и короткое объяснение. Если ошибок нет — «Ошибок нет 👍». Если ученик написал по-русски — покажи, как это сказать по-испански.",
    "Не используй Markdown-разметку (звёздочки, решётки). Будь дружелюбным и естественным, как человек, а не учебник.",
  ].join("\n");
}

async function viaClaude(env, sys, messages) {
  const r = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "content-type": "application/json", "x-api-key": env.ANTHROPIC_API_KEY, "anthropic-version": "2023-06-01" },
    body: JSON.stringify({ model: env.ANTHROPIC_MODEL || "claude-haiku-5-5", max_tokens: 600, system: sys, messages }),
  });
  if (!r.ok) throw new Error("claude " + r.status);
  const j = await r.json();
  return (j.content || []).map((c) => c.text || "").join("").trim();
}

async function viaWorkersAI(env, sys, messages) {
  let last;
  for (const m of WAI_MODELS) {
    try {
      const r = await env.AI.run(m, { messages: [{ role: "system", content: sys }, ...messages], max_tokens: 500, temperature: 0.7 });
      const t = String((r && (r.response || (r.result && r.result.response))) || "").trim();
      if (t) return t;
    } catch (e) {
      last = e;
    }
  }
  throw last || new Error("empty");
}

export function splitReply(text) {
  const t = String(text).replace(/\*\*/g, "").replace(/^#+\s*/gm, "");
  const i = t.search(/\n\s*-{3,}\s*\n/);
  if (i < 0) {
    // модель не поставила разделитель — ищем начало русского блока
    const j = t.search(/\n\s*(Перевод|Исправлени)/);
    if (j < 0) return { es: t.trim(), ru: "" };
    return { es: t.slice(0, j).trim(), ru: t.slice(j).trim() };
  }
  return { es: t.slice(0, i).trim(), ru: t.slice(i).replace(/^\s*-{3,}\s*/, "").trim() };
}

// history: [{role:"user"|"assistant", content}]
export async function chatReply(env, user, history) {
  const sys = system(user);
  const msgs = history.slice(-12);
  while (msgs.length && msgs[0].role !== "user") msgs.shift();
  let text;
  if (env.ANTHROPIC_API_KEY) {
    try {
      text = await viaClaude(env, sys, msgs);
    } catch (e) {
      text = await viaWorkersAI(env, sys, msgs);
    }
  } else text = await viaWorkersAI(env, sys, msgs);
  return splitReply(text);
}

export function opener(user) {
  const o = {
    cafe: "¡Buenas tardes! Bienvenido a nuestro café. ¿Qué te pongo?",
    amigos: "¡Hola! Soy Pablo, encantado. ¿Cómo te llamas y de dónde eres?",
    viaje: "¡Hola! ¿En qué puedo ayudarte? ¿Qué ciudad quieres visitar?",
    tienda: "¡Hola! ¿Buscas algo en especial?",
    medico: "Buenos días. Siéntate, por favor. ¿Qué te pasa?",
    libre: "¡Hola! ¿Qué tal tu día? ¿De qué quieres hablar hoy?",
  };
  return o[user.topic] || o.amigos;
}
