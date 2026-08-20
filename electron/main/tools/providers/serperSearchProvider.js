const domainOf = value => { try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return "Serper"; } };
function apiError(status) { const error = new Error(status === 401 || status === 403 ? "A chave do Serper foi recusada." : status === 429 ? "O limite do Serper foi atingido." : `O Serper está indisponível (HTTP ${status}).`); error.code = status === 401 || status === 403 ? "invalid_key" : status === 429 ? "rate_limit" : "provider_unavailable"; return error; }
export class SerperSearchProvider {
  name = "serper";
  constructor({ credentials }) { this.credentials = credentials; }
  async configured() { return this.credentials.hasKey("serper"); }
  async search(query, signal) {
    const apiKey = await this.credentials.getKey("serper"); if (!apiKey) { const error = new Error("Configure uma chave do Serper antes de pesquisar."); error.code = "configuration_required"; throw error; }
    let response; try { response = await fetch("https://google.serper.dev/search", { method: "POST", signal, headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" }, body: JSON.stringify({ q: query, gl: "br", hl: "pt-br", num: 8 }) }); } catch (error) { if (signal.aborted) throw error; const safe = new Error("Não foi possível conectar ao Serper."); safe.code = "provider_unavailable"; throw safe; }
    if (!response.ok) throw apiError(response.status); const payload = await response.json(); if (!Array.isArray(payload.organic)) { const error = new Error("O Serper retornou uma resposta inválida."); error.code = "invalid_response"; throw error; }
    return payload.organic.map(item => ({ title: String(item.title ?? "").slice(0, 300), url: item.link, snippet: String(item.snippet ?? "").replace(/\s+/g, " ").trim().slice(0, 700), source: domainOf(item.link), publishedAt: item.date ?? null })).filter(item => item.title && /^https?:\/\//.test(item.url));
  }
}
