import { safeStorage } from "electron";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";

const ENV_NAMES = { openai: "OPENAI_API_KEY", groq: "GROQ_API_KEY", openrouter: "OPENROUTER_API_KEY", brave: "BRAVE_SEARCH_API_KEY", tavily: "TAVILY_API_KEY", serper: "SERPER_API_KEY" };
const FIELD_NAMES = { openai: "openAIKey", groq: "groqKey", openrouter: "openRouterKey", brave: "braveSearchKey", tavily: "tavilySearchKey", serper: "serperSearchKey" };

export class CredentialStore {
  constructor(userDataPath) { this.filePath = path.join(userDataPath, "project-noir-secrets.json"); }
  assertProvider(provider) { if (!FIELD_NAMES[provider]) throw new Error("Provider de credencial inválido."); }
  environmentKey(provider) { this.assertProvider(provider); return process.env[ENV_NAMES[provider]]?.trim() || null; }
  source(provider) { return this.environmentKey(provider) ? "environment" : "secure-storage"; }
  async readPayload() { try { return JSON.parse(await readFile(this.filePath, "utf8")); } catch (error) { if (error.code === "ENOENT") return { version: 2 }; throw error; } }
  async hasKey(provider) { this.assertProvider(provider); if (this.environmentKey(provider)) return true; return Boolean((await this.readPayload())[FIELD_NAMES[provider]]); }
  async getKey(provider) {
    const environment = this.environmentKey(provider); if (environment) return environment;
    if (!safeStorage.isEncryptionAvailable()) throw new Error("A criptografia segura do sistema operacional não está disponível.");
    try { const encrypted = (await this.readPayload())[FIELD_NAMES[provider]]; return encrypted ? safeStorage.decryptString(Buffer.from(encrypted, "base64")) : null; }
    catch { throw new Error("Não foi possível ler a credencial protegida."); }
  }
  async saveKey(provider, apiKey) {
    this.assertProvider(provider); if (this.environmentKey(provider)) throw new Error(`${ENV_NAMES[provider]} tem prioridade e não pode ser alterada pelo aplicativo.`);
    if (!safeStorage.isEncryptionAvailable()) throw new Error("A criptografia segura do sistema operacional não está disponível.");
    const value = String(apiKey ?? "").trim(); if (value.length < 20 || value.length > 512) throw new Error("Informe uma chave de API válida.");
    const payload = await this.readPayload(); payload.version = 2; payload[FIELD_NAMES[provider]] = safeStorage.encryptString(value).toString("base64");
    await mkdir(path.dirname(this.filePath), { recursive: true }); const temp = `${this.filePath}.tmp`; await writeFile(temp, JSON.stringify(payload, null, 2), "utf8"); await rename(temp, this.filePath);
  }
  async removeKey(provider) {
    this.assertProvider(provider); if (this.environmentKey(provider)) throw new Error(`Remova ${ENV_NAMES[provider]} do ambiente para desativar essa credencial.`);
    const payload = await this.readPayload(); if (!payload[FIELD_NAMES[provider]]) return false; delete payload[FIELD_NAMES[provider]];
    if (!Object.values(FIELD_NAMES).some(field => payload[field])) { try { await unlink(this.filePath); } catch (error) { if (error.code !== "ENOENT") throw error; } }
    else { const temp = `${this.filePath}.tmp`; await writeFile(temp, JSON.stringify(payload, null, 2), "utf8"); await rename(temp, this.filePath); }
    return true;
  }
  hasOpenAIKey() { return this.hasKey("openai"); }
  getOpenAIKey() { return this.getKey("openai"); }
  saveOpenAIKey(key) { return this.saveKey("openai", key); }
  removeOpenAIKey() { return this.removeKey("openai"); }
}
