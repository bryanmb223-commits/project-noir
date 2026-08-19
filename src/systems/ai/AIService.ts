import { isCharacterState } from "../character/noirSprites";
import type { AIMessage, AIResponse, AIStatus } from "./types";

export const AIService = {
  async generate(messages: AIMessage[], onDelta?: (text: string) => void): Promise<AIResponse> {
    const response = window.projectNoir
      ? await window.projectNoir.ai.generate({ messages })
      : { message: "MockProvider disponível apenas no aplicativo desktop.", emotion: "neutral", provider: "browser-mock" };
    if (onDelta) {
      for (const part of response.message.split(/(\s+)/)) {
        onDelta(part);
        await new Promise(resolve => setTimeout(resolve, 18));
      }
    }
    return { message: response.message, emotion: isCharacterState(response.emotion) ? response.emotion : "happy", provider: response.provider };
  },
  status(): Promise<AIStatus> {
    return window.projectNoir?.ai.status() ?? Promise.resolve({ selectedProvider: "mock", activeProvider: "browser-mock", openAIConfigured: false });
  },
};
