const browserDefaults: NoirSettings = {
  showCharacter: true, characterAnimations: true, automaticExpressions: true, launchAtLogin: false,
  notifications: true, globalShortcut: "CommandOrControl+Shift+Space", aiProvider: "local", openAIModel: "gpt-5.2", ollamaModel: "", groqModel: "", openRouterModel: "", automaticFallback: false, webSearchEnabled: true, automaticWebSearch: true, webSearchProvider: "tavily", webSearchFallback: true,
};
export const settingsService = {
  get: () => window.projectNoir?.settings.get() ?? Promise.resolve(browserDefaults),
  update: (changes: Partial<NoirSettings>) => window.projectNoir?.settings.update(changes) ?? Promise.reject(new Error("Configurações disponíveis no aplicativo desktop.")),
};
