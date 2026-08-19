const browserDefaults: NoirSettings = {
  showCharacter: true, characterAnimations: true, automaticExpressions: true, launchAtLogin: false,
  notifications: true, globalShortcut: "CommandOrControl+Shift+Space", aiProvider: "mock",
};
export const settingsService = {
  get: () => window.projectNoir?.settings.get() ?? Promise.resolve(browserDefaults),
  update: (changes: Partial<NoirSettings>) => window.projectNoir?.settings.update(changes) ?? Promise.reject(new Error("Configurações disponíveis no aplicativo desktop.")),
};
