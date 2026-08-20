import { ChatCompatibleProvider } from "./chatCompatibleProvider.js";
export class OpenRouterProvider extends ChatCompatibleProvider { constructor(options) { super({ ...options, name: "openrouter", endpoint: "https://openrouter.ai/api/v1/chat/completions", extraHeaders: { "HTTP-Referer": "https://project-noir.local", "X-Title": "Project Noir" } }); } }
