/// <reference types="vite/client" />

type DataCollection = "projects" | "notes" | "tasks" | "memories" | "conversations" | "messages";
interface NoirSettings {
  showCharacter: boolean; characterAnimations: boolean; automaticExpressions: boolean;
  launchAtLogin: boolean; notifications: boolean; globalShortcut: string; aiProvider: "local" | "groq" | "openrouter" | "openai" | "mock";
  openAIModel: string; ollamaModel: string; groqModel: string; openRouterModel: string; automaticFallback: boolean;
  webSearchEnabled: boolean; automaticWebSearch: boolean; webSearchFallback: boolean; webSearchProvider: "tavily" | "serper" | "wikipedia" | "brave";
}
interface Window {
  projectNoir?: {
    getAppInfo: () => Promise<{ name: string; version: string; platform: string }>;
    window: { hide: () => Promise<boolean> };
    ai: {
      status: () => Promise<import("./systems/ai/types").AIStatus>;
      saveKey: (provider: "openai" | "groq" | "openrouter", key: string) => Promise<import("./systems/ai/types").AIStatus>;
      removeKey: (provider: "openai" | "groq" | "openrouter") => Promise<import("./systems/ai/types").AIStatus>;
      testConnection: (provider: NoirSettings["aiProvider"]) => Promise<{ ok: boolean; provider: string; model: string }>;
      ollamaStatus: () => Promise<import("./systems/ai/types").OllamaStatus>;
      startStream: (requestId: string, request: { conversationId: string; projectId?: string; message: string }) => Promise<{ accepted: boolean }>;
      cancelStream: (requestId: string) => Promise<boolean>;
      onStreamEvent: (callback: (event: import("./systems/ai/types").AIStreamEvent) => void) => () => void;
      onStatusChanged: (callback: (status: import("./systems/ai/types").AIStatus) => void) => () => void;
    };
    webSearch: {
      status: () => Promise<{ enabled: boolean; automatic: boolean; fallback: boolean; provider: string; configured: boolean; credentialSource: string; state: string }>;
      saveKey: (provider: "tavily" | "serper" | "brave", key: string) => Promise<boolean>;
      removeKey: (provider: "tavily" | "serper" | "brave") => Promise<boolean>;
      test: (query?: string) => Promise<{ used: boolean; unavailable?: boolean; reason?: string; provider?: string; results: WebSource[] }>;
    };
    data: {
      list: <T>(collection: DataCollection) => Promise<T[]>;
      create: <T>(collection: DataCollection, input: Partial<T>) => Promise<T>;
      update: <T>(collection: DataCollection, id: string, changes: Partial<T>) => Promise<T>;
      remove: (collection: DataCollection, id: string) => Promise<boolean>;
    };
    settings: { get: () => Promise<NoirSettings>; update: (changes: Partial<NoirSettings>) => Promise<NoirSettings> };
    notifications: { show: (options: { title: string; body: string }) => Promise<boolean> };
  };
}
interface WebSource { title: string; url: string; snippet: string; source: string; publishedAt?: string | null }
