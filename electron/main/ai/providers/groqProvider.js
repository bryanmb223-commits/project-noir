import { ChatCompatibleProvider } from "./chatCompatibleProvider.js";
export class GroqProvider extends ChatCompatibleProvider { constructor(options) { super({ ...options, name: "groq", endpoint: "https://api.groq.com/openai/v1/chat/completions" }); } }
