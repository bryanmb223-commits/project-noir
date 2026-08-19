/// <reference types="vite/client" />

type DataCollection = "projects" | "notes" | "tasks" | "memories" | "conversations" | "messages";
interface NoirSettings {
  showCharacter: boolean; characterAnimations: boolean; automaticExpressions: boolean;
  launchAtLogin: boolean; notifications: boolean; globalShortcut: string; aiProvider: "mock" | "openai";
}
interface Window {
  projectNoir?: {
    getAppInfo: () => Promise<{ name: string; version: string; platform: string }>;
    ai: {
      generate: (request: { messages: Array<{ role: "user" | "ai"; content: string }> }) => Promise<{ message: string; emotion?: string; provider: string }>;
      status: () => Promise<{ selectedProvider: string; activeProvider: string; openAIConfigured: boolean }>;
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
