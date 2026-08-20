const domainOf = value => { try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return "Tavily"; } };
function apiError(status, detail = "") { const error = new Error(status === 401 || status === 403 ? "A chave da Tavily foi recusada." : [429, 432, 433].includes(status) ? "O limite da Tavily foi atingido." : `A Tavily está indisponível (HTTP ${status})${detail ? `: ${detail}` : "."}`); error.code = status === 401 || status === 403 ? "invalid_key" : [429, 432, 433].includes(status) ? "rate_limit" : "provider_unavailable"; return error; }
export class TavilySearchProvider {
  name = "tavily";
  constructor({ credentials }) { this.credentials = credentials; }
  async configured() { return this.credentials.hasKey("tavily"); }
  async search(query, signal) {
    const apiKey = await this.credentials.getKey("tavily"); if (!apiKey) { const error = new Error("Configure uma chave da Tavily antes de pesquisar."); error.code = "configuration_required"; throw error; }
    let response; try { response = await fetch("https://api.tavily.com/search", { method: "POST", signal, headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ query, search_depth: "basic", max_results: 8, topic: "general", include_answer: false, include_raw_content: false, include_images: false }) }); } catch (error) { if (signal.aborted) throw error; const safe = new Error("Não foi possível conectar à Tavily."); safe.code = "provider_unavailable"; throw safe; }
    if (!response.ok) { const payload = await response.json().catch(() => null); throw apiError(response.status, String(payload?.detail?.error ?? "").slice(0, 180)); }
    const payload = await response.json(); if (!Array.isArray(payload.results)) { const error = new Error("A Tavily retornou uma resposta inválida."); error.code = "invalid_response"; throw error; }
    return payload.results.map(item => ({ title: String(item.title ?? "").slice(0, 300), url: item.url, snippet: String(item.content ?? "").replace(/\s+/g, " ").trim().slice(0, 700), source: domainOf(item.url), publishedAt: item.published_date ?? null, score: typeof item.score === "number" ? item.score : null })).filter(item => item.title && /^https?:\/\//.test(item.url));
  }
}
