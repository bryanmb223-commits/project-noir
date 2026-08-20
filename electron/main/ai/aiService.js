import { MockProvider } from "./providers/mockProvider.js";
import { OpenAIProvider } from "./providers/openAIProvider.js";
import { OllamaProvider, inspectOllama } from "./providers/ollamaProvider.js";
import { GroqProvider } from "./providers/groqProvider.js";
import { OpenRouterProvider } from "./providers/openRouterProvider.js";
import { buildAIContext } from "./contextBuilder.js";
import { ALLOWED_EMOTIONS, inferEmotion } from "../config.js";
const REMOTE = new Set(["openai", "groq", "openrouter"]);
const FALLBACK_ERRORS = new Set(["provider_unavailable", "model_unavailable", "rate_limit"]);

export class AIService {
  constructor({ getSettings, store, credentials, toolService, onStatusChange }) { this.getSettings = getSettings; this.store = store; this.credentials = credentials; this.toolService = toolService; this.onStatusChange = onStatusChange; this.controllers = new Map(); }
  modelFor(provider, settings = this.getSettings()) { return provider === "local" ? settings.ollamaModel : provider === "groq" ? settings.groqModel : provider === "openrouter" ? settings.openRouterModel : provider === "openai" ? settings.openAIModel : "local-mock"; }
  async isConfigured(provider) { return provider === "local" || provider === "mock" || this.credentials.hasKey(provider); }
  async status({ inspectLocal = false } = {}) {
    const settings = this.getSettings(); const selected = settings.aiProvider; const configured = await this.isConfigured(selected);
    const local = inspectLocal || selected === "local" ? await inspectOllama(AbortSignal.timeout(3500)).catch(() => ({ installed: false, running: false, models: [], state: "unavailable" })) : null;
    const model = this.modelFor(selected, settings); const localReady = selected !== "local" || (local?.running && Boolean(model) && local.models.some(item => item.name === model)); const modelReady = selected === "mock" || Boolean(model);
    return { selectedProvider: selected, activeProvider: configured && localReady && modelReady ? selected : "unavailable", configured, openAIConfigured: await this.credentials.hasKey("openai"), groqConfigured: await this.credentials.hasKey("groq"), openRouterConfigured: await this.credentials.hasKey("openrouter"), credentialSource: REMOTE.has(selected) && configured ? this.credentials.source(selected) : "none", model, state: !configured || !modelReady ? "configuration-required" : !localReady ? local?.state ?? "unavailable" : "ready", local, automaticFallback: Boolean(settings.automaticFallback), privacy: selected === "local" ? "local" : "remote" };
  }
  async provider(providerName) {
    const settings = this.getSettings(); const model = this.modelFor(providerName, settings); if (providerName !== "mock" && !model) { const error = new Error(`Selecione um modelo para ${providerName}.`); error.code = "model_unavailable"; throw error; }
    if (providerName === "local") return new OllamaProvider({ model });
    if (providerName === "groq") return new GroqProvider({ apiKey: await this.credentials.getKey("groq"), model });
    if (providerName === "openrouter") return new OpenRouterProvider({ apiKey: await this.credentials.getKey("openrouter"), model });
    if (providerName === "openai") return new OpenAIProvider({ apiKey: await this.credentials.getKey("openai"), model });
    return new MockProvider();
  }
  async providerOrder() {
    const settings = this.getSettings(); if (!settings.automaticFallback) return [settings.aiProvider];
    const order = [settings.aiProvider, ...["local", "groq", "openrouter", "mock"].filter(value => value !== settings.aiProvider)];
    const available = []; for (const name of order) if (await this.isConfigured(name)) available.push(name); return available;
  }
  async stream(requestId, request, send) {
    if (this.controllers.size) throw new Error("Já existe uma resposta em andamento."); if (!/^[a-zA-Z0-9-]{8,80}$/.test(requestId)) throw new Error("Identificador de requisição inválido.");
    const query = String(request?.message ?? "").trim(); if (!query || query.length > 12000) throw new Error("A mensagem deve ter entre 1 e 12000 caracteres.");
    const controller = new AbortController(); this.controllers.set(requestId, controller);
    try {
      const built = buildAIContext(this.store, { conversationId: request.conversationId, projectId: request.projectId, query });
      let web = built.reusedSources.length ? { used: true, reused: true, results: built.reusedSources, context: built.reusableWebContext } : { used: false, results: [], context: "" };
      if (this.toolService && !web.reused) { if (this.toolService.willSearch(query)) send({ requestId, type: "phase", phase: "searching" }); web = await this.toolService.prepareWebContext(query, controller.signal); }
      send({ requestId, type: "phase", phase: "responding", webUsed: web.used, webReused: Boolean(web.reused) });
      const externalContext = web.used ? web.context : web.unavailable ? `AVISO DE ATUALIDADE: ${web.reason}\nInforme claramente ao usuário que não foi possível verificar a informação atual.` : "";
      const context = [built.context, externalContext].filter(Boolean).join("\n\n"); const providers = await this.providerOrder(); let finalError;
      for (let index = 0; index < providers.length; index += 1) {
        const name = providers[index]; let emitted = false;
        try { const provider = await this.provider(name); const result = await provider.stream({ messages: built.history, context }, { signal: controller.signal, onDelta: delta => { emitted = true; send({ requestId, type: "delta", delta }); } }); const emotion = ALLOWED_EMOTIONS.includes(result.emotion) ? result.emotion : inferEmotion(result.message); send({ requestId, type: "done", ...result, emotion, fallbackUsed: index > 0, webUsed: web.used, webReused: Boolean(web.reused), sources: web.results, webWarning: web.unavailable ? web.reason : null }); return; }
        catch (error) { finalError = error; if (controller.signal.aborted || emitted || index === providers.length - 1 || (!error.retryable && !FALLBACK_ERRORS.has(error.code))) throw error; send({ requestId, type: "provider-fallback", from: name, to: providers[index + 1] }); }
      }
      throw finalError;
    } catch (error) { send({ requestId, type: controller.signal.aborted || error?.name === "AbortError" ? "cancelled" : "error", message: error instanceof Error ? error.message : "Falha ao gerar resposta." }); }
    finally { this.controllers.delete(requestId); if (this.getSettings().aiProvider === "local") await this.onStatusChange(); }
  }
  cancel(id) { const controller = this.controllers.get(id); if (!controller) return false; controller.abort(); return true; }
  async testConnection(providerName = this.getSettings().aiProvider) { const provider = await this.provider(providerName); if (REMOTE.has(providerName) && !await this.isConfigured(providerName)) throw new Error(`Configure uma chave do ${providerName} antes de testar.`); const controller = new AbortController(); const timeout = setTimeout(() => controller.abort(), 30000); try { await provider.test(controller.signal); return { ok: true, provider: providerName, model: provider.model }; } finally { clearTimeout(timeout); } }
  async saveKey(provider, key) { if (!REMOTE.has(provider)) throw new Error("Este provider não usa chave de API."); await this.credentials.saveKey(provider, key); await this.onStatusChange(); return this.status(); }
  async removeKey(provider) { if (!REMOTE.has(provider)) throw new Error("Este provider não usa chave de API."); await this.credentials.removeKey(provider); await this.onStatusChange(); return this.status(); }
  async ollamaStatus() { return inspectOllama(AbortSignal.timeout(5000)); }
}
