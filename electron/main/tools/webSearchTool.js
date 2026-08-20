const stripHtml = value => String(value ?? "").replace(/<[^>]*>/g, " ").replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const domainOf = value => { try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return ""; } };
const authorityScore = domain => /(^|\.)(gov|edu)(\.|$)/.test(domain) || /^(who|un|fifa|nodejs|microsoft|apple|google)\./.test(domain) ? 5 : /wikipedia\.org$/.test(domain) ? 3 : 0;

export class WebSearchTool {
  constructor({ credentials }) { this.credentials = credentials; this.providers = { tavily: new TavilySearchProvider({ credentials }), serper: new SerperSearchProvider({ credentials }) }; }
  sanitizeQuery(value) {
    return String(value ?? "").replace(/^\s*\/web\s*/i, "").replace(/\b(com base|considerando)\s+(n[oa]s?|em)\s+(meu|minha)\s+(projeto|nota|mem[oó]ria)\s+[\p{L}\p{N}_-]+[,;:]?/giu, "").replace(/\s+/g, " ").trim().slice(0, 300);
  }
  async search({ provider, query, signal }) {
    const safeQuery = this.sanitizeQuery(query); if (!safeQuery) throw new Error("A consulta de pesquisa ficou vazia após a proteção de privacidade.");
    const results = provider === "tavily" || provider === "serper" ? await this.providers[provider].search(safeQuery, signal) : provider === "brave" ? await this.searchBrave(safeQuery, signal) : await this.searchWikipedia(safeQuery, signal);
    if (!results.length) { const error = new Error("A pesquisa não encontrou resultados relevantes."); error.code = "no_results"; throw error; }
    return { query: safeQuery, provider, results: this.rank(results).slice(0, 5) };
  }
  async isConfigured(provider) { return provider === "wikipedia" || this.credentials.hasKey(provider); }
  rank(results) {
    const seen = new Set();
    return results.map((item, index) => ({ ...item, _score: 20 - index + authorityScore(domainOf(item.url)) })).sort((a, b) => b._score - a._score).filter(item => { const domain = domainOf(item.url); if (seen.has(domain)) return false; seen.add(domain); return true; }).map(({ _score, ...item }) => item);
  }
  async searchWikipedia(query, signal) {
    const url = new URL("https://pt.wikipedia.org/w/api.php"); url.search = new URLSearchParams({ action: "query", list: "search", srsearch: query, srlimit: "5", srprop: "snippet|timestamp", utf8: "1", format: "json", origin: "*" }).toString();
    const response = await fetch(url, { signal, headers: { "User-Agent": "Project-Noir/1.0" } }); if (!response.ok) throw this.httpError("Wikipedia", response.status);
    const payload = await response.json(); return (payload.query?.search ?? []).map(item => ({ title: item.title, url: `https://pt.wikipedia.org/wiki/${encodeURIComponent(item.title.replace(/ /g, "_"))}`, snippet: stripHtml(item.snippet).slice(0, 700), source: "Wikipedia", publishedAt: item.timestamp ?? null }));
  }
  async searchBrave(query, signal) {
    const apiKey = await this.credentials.getKey("brave"); if (!apiKey) { const error = new Error("Configure uma chave da Brave Search antes de pesquisar."); error.code = "configuration_required"; throw error; }
    const url = new URL("https://api.search.brave.com/res/v1/web/search"); url.search = new URLSearchParams({ q: query, count: "8", country: "BR", search_lang: "pt-br", ui_lang: "pt-BR", safesearch: "moderate", text_decorations: "false" }).toString();
    const response = await fetch(url, { signal, headers: { Accept: "application/json", "X-Subscription-Token": apiKey } }); if (!response.ok) throw this.httpError("Brave Search", response.status);
    const payload = await response.json(); return (payload.web?.results ?? []).map(item => ({ title: String(item.title ?? "").slice(0, 300), url: item.url, snippet: stripHtml(item.description).slice(0, 700), source: domainOf(item.url), publishedAt: item.page_age ?? item.age ?? null })).filter(item => item.title && /^https?:\/\//.test(item.url));
  }
  httpError(provider, status) { const error = new Error(status === 401 || status === 403 ? `A chave da ${provider} foi recusada.` : status === 429 ? `O limite da ${provider} foi atingido.` : `${provider} está indisponível (HTTP ${status}).`); error.code = status === 429 ? "rate_limit" : status === 401 || status === 403 ? "invalid_key" : "provider_unavailable"; return error; }
}
import { TavilySearchProvider } from "./providers/tavilySearchProvider.js";
import { SerperSearchProvider } from "./providers/serperSearchProvider.js";
