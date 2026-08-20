import type { AIStatus, AIStreamEvent } from "./types";

export const AIService = {
  status(): Promise<AIStatus> { return window.projectNoir?.ai.status() ?? Promise.resolve({ selectedProvider: "local", activeProvider: "unavailable", configured: true, openAIConfigured: false, groqConfigured: false, openRouterConfigured: false, credentialSource: "none", model: "", state: "unavailable", local: null, automaticFallback: false, privacy: "local" }); },
  saveKey(provider: "openai" | "groq" | "openrouter", key: string) { if (!window.projectNoir) return Promise.reject(new Error("Disponível apenas no aplicativo desktop.")); return window.projectNoir.ai.saveKey(provider, key); },
  removeKey(provider: "openai" | "groq" | "openrouter") { if (!window.projectNoir) return Promise.reject(new Error("Disponível apenas no aplicativo desktop.")); return window.projectNoir.ai.removeKey(provider); },
  testConnection(provider: NoirSettings["aiProvider"]) { if (!window.projectNoir) return Promise.reject(new Error("Disponível apenas no aplicativo desktop.")); return window.projectNoir.ai.testConnection(provider); },
  ollamaStatus() { if (!window.projectNoir) return Promise.reject(new Error("Disponível apenas no aplicativo desktop.")); return window.projectNoir.ai.ollamaStatus(); },
  stream(request: { conversationId: string; projectId?: string; message: string }, onEvent: (event: AIStreamEvent) => void) {
    if (!window.projectNoir) throw new Error("Streaming disponível apenas no aplicativo desktop.");
    const requestId = crypto.randomUUID();
    const unsubscribe = window.projectNoir.ai.onStreamEvent(event => { if (event.requestId === requestId) onEvent(event); });
    void window.projectNoir.ai.startStream(requestId, request).catch(error => onEvent({ requestId, type: "error", message: error instanceof Error ? error.message : String(error) }));
    return { requestId, cancel: () => window.projectNoir!.ai.cancelStream(requestId), dispose: unsubscribe };
  },
  onStatusChanged(callback: (status: AIStatus) => void) { return window.projectNoir?.ai.onStatusChanged(callback) ?? (() => {}); },
};
