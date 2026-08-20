import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { ALLOWED_EMOTIONS } from "../../config.js";
import { noirSystemPrompt } from "./chatCompatibleProvider.js";
const execFileAsync = promisify(execFile);
const BASE_URL = "http://127.0.0.1:11434";

export async function inspectOllama(signal) {
  let installed = false;
  try { await execFileAsync(process.platform === "win32" ? "where.exe" : "which", ["ollama"], { timeout: 3000, windowsHide: true }); installed = true; } catch {}
  try {
    const response = await fetch(`${BASE_URL}/api/tags`, { signal }); if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const payload = await response.json(); const models = (payload.models ?? []).map(item => ({ name: item.name, size: item.size, modifiedAt: item.modified_at }));
    return { installed: true, running: true, models, state: models.length ? "ready" : "no-models" };
  } catch (error) {
    if (signal?.aborted) throw error;
    return { installed, running: false, models: [], state: installed ? "server-stopped" : "not-installed" };
  }
}

export class OllamaProvider {
  name = "local";
  constructor({ model }) { this.model = model; }
  async stream({ messages, context }, { signal, onDelta }) {
    if (!this.model) { const error = new Error("Selecione um modelo instalado no Ollama."); error.code = "model_unavailable"; throw error; }
    let response;
    try { response = await fetch(`${BASE_URL}/api/chat`, { method: "POST", signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: this.model, messages: [{ role: "system", content: noirSystemPrompt(context) }, ...messages], stream: true }) }); }
    catch (cause) { if (signal.aborted) throw new DOMException("Geração interrompida.", "AbortError"); const error = new Error("O servidor do Ollama não está ativo."); error.code = "provider_unavailable"; error.cause = cause; throw error; }
    if (!response.ok) { const detail = String((await response.json().catch(() => null))?.error ?? ""); const error = new Error(response.status === 404 ? "O modelo selecionado não está instalado no Ollama." : /memory|ram|cuda/i.test(detail) ? "O Ollama não tem memória suficiente para carregar este modelo." : `Ollama respondeu com HTTP ${response.status}${detail ? `: ${detail.slice(0, 180)}` : "."}`); error.code = response.status === 404 ? "model_unavailable" : "provider_unavailable"; throw error; }
    const reader = response.body?.getReader(); if (!reader) throw new Error("O Ollama não iniciou o streaming."); const decoder = new TextDecoder(); let buffer = ""; let message = "";
    while (true) { const { value, done } = await reader.read(); if (done) break; buffer += decoder.decode(value, { stream: true }); const lines = buffer.split("\n"); buffer = lines.pop() ?? ""; for (const line of lines) { if (!line.trim()) continue; const chunk = JSON.parse(line); if (chunk.error) throw new Error(String(chunk.error).slice(0, 240)); const delta = chunk.message?.content; if (typeof delta === "string") { message += delta; onDelta(delta); } } }
    if (!message.trim()) { const error = new Error("O Ollama retornou uma resposta vazia."); error.code = "empty_response"; throw error; }
    const emotion = await this.classifyEmotion(message, signal).catch(() => null); return { message, emotion, provider: this.name, model: this.model };
  }
  async classifyEmotion(message, signal) { const response = await fetch(`${BASE_URL}/api/chat`, { method: "POST", signal, headers: { "Content-Type": "application/json" }, body: JSON.stringify({ model: this.model, messages: [{ role: "system", content: `Classifique a emoção em ${ALLOWED_EMOTIONS.join(", ")}.` }, { role: "user", content: message.slice(0, 3000) }], stream: false, format: { type: "object", properties: { emotion: { type: "string", enum: ALLOWED_EMOTIONS } }, required: ["emotion"] } }) }); if (!response.ok) return null; const value = JSON.parse((await response.json()).message?.content || "{}").emotion; return ALLOWED_EMOTIONS.includes(value) ? value : null; }
  async test(signal) { let text = ""; await this.stream({ messages: [{ role: "user", content: "Responda apenas OK." }], context: "" }, { signal, onDelta: delta => { text += delta; } }); return Boolean(text); }
}
