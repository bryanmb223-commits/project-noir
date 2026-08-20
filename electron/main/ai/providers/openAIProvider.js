import { ALLOWED_EMOTIONS } from "../../config.js";
import { noirSystemPrompt } from "./chatCompatibleProvider.js";
const RETRYABLE = new Set([429, 500, 502, 503, 504]);
const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
function friendly(status, detail = "") {
  const error = new Error([401, 403].includes(status) ? "A chave da OpenAI foi recusada." : status === 404 ? "O modelo configurado não foi encontrado ou não está disponível para esta conta." : status === 429 ? "O limite de uso da OpenAI foi atingido. Tente novamente em instantes." : `A OpenAI respondeu com HTTP ${status}${detail ? `: ${detail}` : "."}`);
  error.code = status === 404 ? "model_unavailable" : status === 429 ? "rate_limit" : status >= 500 ? "provider_unavailable" : "http"; error.retryable = RETRYABLE.has(status); return error;
}
export class OpenAIProvider {
  name = "openai";
  constructor({ apiKey, model }) { this.apiKey = apiKey; this.model = model; }
  async request(body, signal, attempts = 3) {
    for (let attempt = 0; attempt < attempts; attempt += 1) {
      try {
        const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", signal, headers: { Authorization: `Bearer ${this.apiKey}`, "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (response.ok) return response;
        const detail = String((await response.json().catch(() => null))?.error?.message ?? "").slice(0, 240);
        if (!RETRYABLE.has(response.status) || attempt === attempts - 1) throw friendly(response.status, detail);
      } catch (error) {
        if (signal?.aborted) throw new DOMException("Geração interrompida.", "AbortError");
        if (attempt === attempts - 1 || error.code) { if (!error.code) { error.code = "provider_unavailable"; error.retryable = true; error.message = "Não foi possível conectar à OpenAI."; } throw error; }
      }
      await wait(350 * 2 ** attempt);
    }
  }
  async stream({ messages, context }, { signal, onDelta }) {
    const instructions = noirSystemPrompt(context);
    const response = await this.request({ model: this.model, instructions, input: messages, stream: true }, signal);
    const reader = response.body?.getReader(); if (!reader) throw new Error("A OpenAI não iniciou o fluxo de resposta.");
    const decoder = new TextDecoder(); let buffer = ""; let message = "";
    while (true) {
      const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split("\n\n"); buffer = blocks.pop() ?? "";
      for (const block of blocks) {
        const line = block.split("\n").find(part => part.startsWith("data:")); if (!line || line === "data: [DONE]") continue;
        const event = JSON.parse(line.slice(5).trim());
        if (event.type === "response.output_text.delta" && typeof event.delta === "string") { message += event.delta; onDelta(event.delta); }
        if (event.type === "error") throw new Error(event.message || "A OpenAI encerrou o fluxo com erro.");
      }
    }
    if (!message.trim()) throw new Error("A resposta da OpenAI não continha texto.");
    const emotion = await this.classifyEmotion(message, signal).catch(() => null);
    return { message, emotion, provider: this.name, model: this.model };
  }
  async classifyEmotion(message, signal) {
    const response = await this.request({ model: this.model, instructions: "Classifique a expressão visual adequada para a resposta.", input: message.slice(0, 4000), text: { format: { type: "json_schema", name: "noir_emotion", strict: true, schema: { type: "object", properties: { emotion: { type: "string", enum: ALLOWED_EMOTIONS } }, required: ["emotion"], additionalProperties: false } } } }, signal, 1);
    const payload = await response.json(); const output = payload.output_text ?? payload.output?.flatMap(x => x.content ?? []).find(x => x.type === "output_text")?.text;
    const emotion = JSON.parse(output || "{}").emotion; return ALLOWED_EMOTIONS.includes(emotion) ? emotion : null;
  }
  async test(signal) { const response = await this.request({ model: this.model, input: "Responda apenas OK.", max_output_tokens: 32 }, signal, 1); await response.json(); return true; }
}
