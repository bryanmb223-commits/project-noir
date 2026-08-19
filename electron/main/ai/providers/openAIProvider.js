import { ALLOWED_EMOTIONS } from "../../config.js";

const VALID_EMOTIONS = new Set(ALLOWED_EMOTIONS);

export class OpenAIProvider {
  name = "openai";

  constructor({ apiKey, model }) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generate({ messages }) {
    if (!this.apiKey) throw new Error("OPENAI_API_KEY não configurada.");
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: this.model,
        instructions: "Você é Noir, uma assistente pessoal concisa. Responda em português do Brasil.",
        input: messages.map(message => ({ role: message.role === "ai" ? "assistant" : message.role, content: message.content })),
      }),
    });
    if (!response.ok) throw new Error(`OpenAI respondeu com HTTP ${response.status}.`);
    const payload = await response.json();
    const message = payload.output_text ?? payload.output?.flatMap(item => item.content ?? []).find(item => item.type === "output_text")?.text;
    if (!message) throw new Error("A resposta da OpenAI não continha texto.");
    const emotion = VALID_EMOTIONS.has(payload.emotion) ? payload.emotion : "happy";
    return { message, emotion, provider: this.name };
  }
}
