// Облако приложения: вход через Google, синхронизация прогресса, связка с Telegram-ботом.
// Хранение в KV:
//   s:<token>        — сессия {sub,email,name,picture} (180 дней)
//   st:<state>       — адрес возврата после входа (10 минут)
//   g:<sub>:state    — прогресс приложения {state, updatedAt}
//   g:<sub>:bot      — связка с ботом {tg, linkedAt, events:[{k,ok,t}]}
//   lk:<code>        — одноразовый код для привязки Telegram (15 минут)

const SESSION_TTL = 180 * 86400;
const DEFAULT_RETURNS = ["https://m1kropet.github.io/", "https://localhost", "http://localhost", "http://127.0.0.1", "vamos://"];
export const ANDROID_PACKAGE = "io.github.m1kropet.vamos";

const rand = (n = 24) => [...crypto.getRandomValues(new Uint8Array(n))].map((b) => b.toString(16).padStart(2, "0")).join("");
const cors = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, PUT, POST, DELETE, OPTIONS",
  "access-control-allow-headers": "authorization, content-type",
  "access-control-max-age": "86400",
};
const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json; charset=utf-8", ...cors } });

function allowedReturn(env, url) {
  const list = (env.APP_RETURN_URLS ? env.APP_RETURN_URLS.split(/[,\s]+/) : []).concat(DEFAULT_RETURNS).filter(Boolean);
  return typeof url === "string" && url.length < 500 && list.some((p) => url.startsWith(p));
}

function b64urlJSON(part) {
  const s = part.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(s + "===".slice((s.length + 3) % 4));
  const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
}

function page(title, body) {
  return new Response(
    `<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title}</title>
<style>body{font-family:system-ui,sans-serif;background:#f6efe4;color:#2b2118;display:grid;place-items:center;min-height:100vh;margin:0;padding:20px;box-sizing:border-box}
.c{background:#fffaf2;border-radius:20px;padding:28px;max-width:420px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,.08)}
a.b{display:inline-block;margin-top:16px;background:#c4572c;color:#fff;text-decoration:none;padding:14px 22px;border-radius:14px;font-weight:700}
p{color:#6b5a4a}</style></head><body><div class="c">${body}</div></body></html>`,
    { headers: { "content-type": "text/html; charset=utf-8" } }
  );
}

export async function session(env, request) {
  const h = request.headers.get("authorization") || "";
  const tok = h.startsWith("Bearer ") ? h.slice(7).trim() : "";
  if (!/^[0-9a-f]{48}$/.test(tok)) return null;
  const s = await env.KV.get("s:" + tok);
  return s ? { token: tok, ...JSON.parse(s) } : null;
}

export async function getAppState(env, sub) {
  const raw = await env.KV.get("g:" + sub + ":state");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch (e) {
    return null;
  }
}
export async function getBotLink(env, sub) {
  return JSON.parse((await env.KV.get("g:" + sub + ":bot")) || "null");
}
export async function saveBotLink(env, sub, link) {
  await env.KV.put("g:" + sub + ":bot", JSON.stringify(link));
}

// Сводка прогресса приложения для бота
export function summarize(appState) {
  const st = appState && appState.state;
  if (!st) return null;
  const now = Date.now();
  const lessons = Object.keys(st.lessons || {}).filter((k) => st.lessons[k] && st.lessons[k].done);
  const dlg = Object.keys(st.dlg || {}).filter((k) => st.dlg[k] && st.dlg[k].done).map((k) => "dlg:" + k);
  const words = st.words || {};
  const learned = Object.keys(words);
  const due = learned.filter((k) => words[k] && words[k].due <= now).sort((a, b) => words[a].due - words[b].due);
  const weak = learned.filter((k) => words[k] && words[k].bad > words[k].ok).slice(0, 30);
  return { lessons, dlg, learned, due, weak, xp: st.xp || 0, streak: (st.streak && st.streak.n) || 0, unlocked: st.unlocked || 0, updatedAt: appState.updatedAt || 0 };
}

export async function handleCloud(request, env, url, botUsername) {
  const p = url.pathname;
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });

  // ---------- вход через Google ----------
  if (p === "/auth/google") {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) return page("Вход недоступен", "<h2>Вход через Google ещё не настроен</h2><p>Добавьте GOOGLE_CLIENT_ID и GOOGLE_CLIENT_SECRET в секреты репозитория (инструкция в bot/README.md).</p>");
    const ret = url.searchParams.get("return") || "";
    if (!allowedReturn(env, ret)) return page("Ошибка", "<h2>Недопустимый адрес возврата</h2>");
    const state = rand(16);
    await env.KV.put("st:" + state, ret, { expirationTtl: 600 });
    const q = new URLSearchParams({
      client_id: env.GOOGLE_CLIENT_ID,
      redirect_uri: url.origin + "/auth/callback",
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });
    return Response.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + q, 302);
  }
  if (p === "/auth/callback") {
    const state = url.searchParams.get("state") || "";
    const ret = /^[0-9a-f]{32}$/.test(state) ? await env.KV.get("st:" + state) : null;
    if (!ret) return page("Ошибка входа", "<h2>Ссылка для входа устарела</h2><p>Вернитесь в приложение и нажмите «Войти через Google» ещё раз.</p>");
    await env.KV.delete("st:" + state);
    if (url.searchParams.get("error")) return page("Вход отменён", "<h2>Вход отменён</h2><p>Можно закрыть эту страницу.</p>");
    const r = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code: url.searchParams.get("code") || "", client_id: env.GOOGLE_CLIENT_ID, client_secret: env.GOOGLE_CLIENT_SECRET, redirect_uri: url.origin + "/auth/callback", grant_type: "authorization_code" }),
    });
    const tj = await r.json().catch(() => ({}));
    if (!tj.id_token) return page("Ошибка входа", "<h2>Google не подтвердил вход</h2><p>" + String(tj.error_description || tj.error || r.status).replace(/</g, "&lt;") + "</p>");
    // id_token получен напрямую от Google по TLS — подпись можно не проверять (OpenID Connect, п. 3.1.3.7)
    const c = b64urlJSON(tj.id_token.split(".")[1]);
    if (c.aud !== env.GOOGLE_CLIENT_ID || !/accounts\.google\.com$/.test(c.iss || "") || !c.sub) return page("Ошибка входа", "<h2>Неверный ответ Google</h2>");
    const token = rand(24);
    await env.KV.put("s:" + token, JSON.stringify({ sub: c.sub, email: c.email || "", name: c.name || c.given_name || "", picture: c.picture || "" }), { expirationTtl: SESSION_TTL });
    if (ret.startsWith("vamos://")) {
      const intent = "intent://auth?vamos_session=" + token + "#Intent;scheme=vamos;package=" + ANDROID_PACKAGE + ";end";
      return page(
        "Вход выполнен",
        `<h2>✅ Вход выполнен</h2><p>${(c.email || "").replace(/</g, "&lt;")}</p><a class="b" href="${intent}">Вернуться в приложение</a>
<script>setTimeout(function(){location.href=${JSON.stringify(intent)}},300)</script>`
      );
    }
    const back = new URL(ret);
    back.searchParams.set("vamos_session", token);
    return Response.redirect(back.toString(), 302);
  }

  // ---------- API приложения ----------
  if (!p.startsWith("/api/")) return null;
  const s = await session(env, request);
  if (!s) return json({ error: "unauthorized" }, 401);

  if (p === "/api/me") {
    const link = await getBotLink(env, s.sub);
    return json({ sub: s.sub, email: s.email, name: s.name, picture: s.picture, bot: botUsername || null, telegram: !!(link && link.tg) });
  }
  if (p === "/api/state" && request.method === "GET") {
    const st = await getAppState(env, s.sub);
    return json(st || { state: null, updatedAt: 0 });
  }
  if (p === "/api/state" && request.method === "PUT") {
    const body = await request.text();
    if (body.length > 3_000_000) return json({ error: "too_large" }, 413);
    let obj;
    try {
      obj = JSON.parse(body);
    } catch (e) {
      return json({ error: "bad_json" }, 400);
    }
    if (!obj || !obj.state || typeof obj.state !== "object") return json({ error: "bad_state" }, 400);
    const updatedAt = +obj.state.updatedAt || Date.now();
    const cur = await getAppState(env, s.sub);
    if (cur && cur.updatedAt > updatedAt && !obj.force) return json({ ok: false, conflict: true, updatedAt: cur.updatedAt }, 409);
    await env.KV.put("g:" + s.sub + ":state", JSON.stringify({ state: obj.state, updatedAt }));
    return json({ ok: true, updatedAt });
  }
  if (p === "/api/link" && request.method === "POST") {
    if (!botUsername) return json({ error: "bot_unknown" }, 503);
    const code = rand(8);
    await env.KV.put("lk:" + code, JSON.stringify({ sub: s.sub, email: s.email, name: s.name }), { expirationTtl: 900 });
    return json({ code, url: "https://t.me/" + botUsername + "?start=L" + code });
  }
  if (p === "/api/bot" && request.method === "GET") {
    const link = await getBotLink(env, s.sub);
    if (!link || !link.tg) return json({ linked: false, bot: botUsername || null });
    const since = +url.searchParams.get("since") || 0;
    const u = JSON.parse((await env.KV.get("u:" + link.tg)) || "null");
    return json({
      linked: true,
      bot: botUsername || null,
      tgName: (u && u.name) || "",
      stats: u ? u.stats : null,
      weak: u ? Object.keys(u.weak || {}).slice(0, 20) : [],
      events: (link.events || []).filter((e) => e.t > since),
    });
  }
  if (p === "/api/bot" && request.method === "DELETE") {
    const link = await getBotLink(env, s.sub);
    if (link && link.tg) {
      const u = JSON.parse((await env.KV.get("u:" + link.tg)) || "null");
      if (u) {
        delete u.link;
        await env.KV.put("u:" + link.tg, JSON.stringify(u));
      }
    }
    await env.KV.delete("g:" + s.sub + ":bot");
    return json({ ok: true });
  }
  if (p === "/api/logout" && request.method === "POST") {
    await env.KV.delete("s:" + s.token);
    return json({ ok: true });
  }
  return json({ error: "not_found" }, 404);
}

// Привязка Telegram по коду из приложения
export async function redeemLink(env, code, tgId) {
  if (!/^[0-9a-f]{16}$/.test(code)) return null;
  const raw = await env.KV.get("lk:" + code);
  if (!raw) return null;
  await env.KV.delete("lk:" + code);
  const who = JSON.parse(raw);
  const sub = who.sub;
  // если этот Google-аккаунт раньше был привязан к другому Telegram — отвязываем старый
  const prev = await getBotLink(env, sub);
  if (prev && prev.tg && prev.tg !== tgId) {
    const old = JSON.parse((await env.KV.get("u:" + prev.tg)) || "null");
    if (old) {
      delete old.link;
      await env.KV.put("u:" + prev.tg, JSON.stringify(old));
    }
  }
  const link = (await getBotLink(env, sub)) || { events: [] };
  link.tg = tgId;
  link.linkedAt = Date.now();
  link.events = link.events || [];
  await saveBotLink(env, sub, link);
  return who;
}

// Результат по слову из бота → приложение применит к интервальному повторению
export async function pushEvents(env, sub, events) {
  if (!sub || !events.length) return;
  const link = (await getBotLink(env, sub)) || { events: [] };
  link.events = (link.events || []).concat(events).slice(-300);
  await saveBotLink(env, sub, link);
}
