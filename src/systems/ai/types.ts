import type { CharacterState } from "../character/noirSprites";
export interface AIMessage { role: "user" | "ai"; content: string }
export interface AIResponse { message: string; emotion: CharacterState; provider: string }
export interface AIStatus { selectedProvider: string; activeProvider: string; openAIConfigured: boolean }
