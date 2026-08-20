import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { GLOBAL_SHORTCUT } from "../config.js";

export const COLLECTIONS = ["projects", "notes", "tasks", "memories", "conversations", "messages"];

const DEFAULT_SETTINGS = {
  showCharacter: true,
  characterAnimations: true,
  automaticExpressions: true,
  launchAtLogin: false,
  notifications: true,
  globalShortcut: GLOBAL_SHORTCUT,
  aiProvider: "local",
  openAIModel: "gpt-5.2",
  ollamaModel: "",
  groqModel: "",
  openRouterModel: "",
  automaticFallback: false,
  webSearchEnabled: true,
  automaticWebSearch: true,
  webSearchProvider: "tavily",
  webSearchFallback: true,
};

export class LocalStore {
  constructor(userDataPath) {
    this.filePath = path.join(userDataPath, "project-noir-data.json");
    this.data = null;
  }

  async initialize() {
    await mkdir(path.dirname(this.filePath), { recursive: true });
    try {
      this.data = JSON.parse(await readFile(this.filePath, "utf8"));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
      this.data = Object.fromEntries(COLLECTIONS.map(collection => [collection, []]));
      this.data.settings = DEFAULT_SETTINGS;
      await this.save();
    }
    this.data.settings = { ...DEFAULT_SETTINGS, ...this.data.settings };
    for (const collection of COLLECTIONS) this.data[collection] ??= [];
  }

  assertCollection(collection) {
    if (!COLLECTIONS.includes(collection)) throw new Error("Coleção inválida.");
  }

  list(collection) {
    this.assertCollection(collection);
    return [...this.data[collection]].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  async create(collection, input) {
    this.assertCollection(collection);
    const now = new Date().toISOString();
    const item = { ...input, id: randomUUID(), createdAt: now, updatedAt: now };
    this.data[collection].push(item);
    await this.save();
    return item;
  }

  async update(collection, id, changes) {
    this.assertCollection(collection);
    const index = this.data[collection].findIndex(item => item.id === id);
    if (index < 0) throw new Error("Registro não encontrado.");
    const { id: ignoredId, createdAt: ignoredCreatedAt, ...safeChanges } = changes;
    this.data[collection][index] = { ...this.data[collection][index], ...safeChanges, updatedAt: new Date().toISOString() };
    await this.save();
    return this.data[collection][index];
  }

  async remove(collection, id) {
    this.assertCollection(collection);
    const previousLength = this.data[collection].length;
    this.data[collection] = this.data[collection].filter(item => item.id !== id);
    if (this.data[collection].length === previousLength) return false;
    await this.save();
    return true;
  }

  getSettings() {
    return { ...this.data.settings };
  }

  async updateSettings(changes) {
    this.data.settings = { ...this.data.settings, ...changes };
    await this.save();
    return this.getSettings();
  }

  async save() {
    const temporaryPath = `${this.filePath}.tmp`;
    await writeFile(temporaryPath, JSON.stringify(this.data, null, 2), "utf8");
    await rename(temporaryPath, this.filePath);
  }
}
