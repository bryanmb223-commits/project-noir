import { MockProvider } from "./providers/mockProvider.js";
import { OpenAIProvider } from "./providers/openAIProvider.js";

export class AIService {
  constructor(getSettings) {
    this.getSettings = getSettings;
  }

  async generate(request) {
    const settings = this.getSettings();
    const wantsOpenAI = settings.aiProvider === "openai";
    const apiKey = process.env.OPENAI_API_KEY;
    const provider = wantsOpenAI && apiKey
      ? new OpenAIProvider({ apiKey, model: process.env.OPENAI_MODEL || "gpt-5.2" })
      : new MockProvider();
    return provider.generate(request);
  }

  status() {
    const settings = this.getSettings();
    return {
      selectedProvider: settings.aiProvider,
      activeProvider: settings.aiProvider === "openai" && process.env.OPENAI_API_KEY ? "openai" : "mock",
      openAIConfigured: Boolean(process.env.OPENAI_API_KEY),
    };
  }
}
