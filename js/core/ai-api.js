/* ИИ в мобильном приложении: вне claude.ai преподаватель, переводчик и разбор видео работают
 * через Anthropic API с вашим ключом. Ключ хранится только на этом устройстве. */
(function (IT) {
  var KEY = "vamos-api-key", MODEL_KEY = "vamos-api-model";
  IT.api = {
    key: function () { try { return localStorage.getItem(KEY) || ""; } catch (e) { return ""; } },
    setKey: function (k) { try { if (k) localStorage.setItem(KEY, k.trim()); else localStorage.removeItem(KEY); } catch (e) { } IT.resetAI && IT.resetAI(); },
    model: function () { try { return localStorage.getItem(MODEL_KEY) || "claude-sonnet-5-5"; } catch (e) { return "claude-sonnet-5-5"; } },
    setModel: function (m) { try { localStorage.setItem(MODEL_KEY, m); } catch (e) { } },
    inClaude: function () { return !!(window.claude && typeof window.claude.use === "function"); }
  };

  function call(messages, maxTokens) {
    var key = IT.api.key();
    if (!key) return Promise.reject({ code: "no_key" });
    if (!navigator.onLine) return Promise.reject({ code: "offline" });
    return fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "content-type": "application/json", "x-api-key": key, "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" },
      body: JSON.stringify({ model: IT.api.model(), max_tokens: maxTokens || 2000, messages: messages })
    }).then(function (r) {
      return r.json().catch(function () { return {}; }).then(function (j) {
        if (r.status === 401 || r.status === 403) throw { code: "bad_key" };
        if (r.status === 429 || r.status === 529) throw { code: "rate_limited" };
        if (!r.ok) throw { code: "api_error", message: (j.error && j.error.message) || r.status };
        return (j.content || []).filter(function (c) { return c.type === "text"; }).map(function (c) { return c.text; }).join("");
      });
    }, function () { throw { code: "offline" }; });
  }
  function toMessages(input) {
    if (typeof input === "string") return [{ role: "user", content: input }];
    return input.map(function (m) { return { role: m.role, content: m.content }; });
  }

  /** Тот же интерфейс, что у возможности «sample» на claude.ai */
  IT.apiSample = function () {
    if (!IT.api.key()) return null;
    var fn = function (input, opts) {
      return call(toMessages(input), 2500).then(function (text) {
        if (opts && opts.onText) opts.onText({ text: text, delta: text });
        return { text: text, truncated: false };
      });
    };
    fn.json = function (prompt) {
      return call([{ role: "user", content: prompt + "\n\nОтветь ТОЛЬКО валидным JSON, без пояснений и без ```." }], 3000).then(function (text) {
        var m = text.match(/[\[{][\s\S]*[\]}]/);
        try { return JSON.parse(m ? m[0] : text); } catch (e) { throw { code: "api_error", message: "JSON" }; }
      });
    };
    return fn;
  };
})(window.IT);
