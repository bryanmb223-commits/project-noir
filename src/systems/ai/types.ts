import type { CharacterState } from "../character/noirSprites";
export interface AIMessage { role: "user" | "ai"; content: string }
export interface AIResponse { message: string; emotion: CharacterState; provider: string }
export interface OllamaModel { name: string; size: number; modifiedAt: string }
export interface OllamaStatus { installed: boolean; running: boolean; models: OllamaModel[]; state: "ready" | "no-models" | "server-stopped" | "not-installed" | "unavailable" }
export interface AIStatus { selectedProvider: string; activeProvider: string; configured: boolean; openAIConfigured: boolean; groqConfigured: boolean; openRouterConfigured: boolean; credentialSource: "none" | "environment" | "secure-storage"; model: string; state: string; local: OllamaStatus | null; automaticFallback: boolean; privacy: "local" | "remote" }
export interface AIStreamEvent { requestId: string; type: "delta" | "done" | "error" | "cancelled" | "provider-fallback" | "phase"; delta?: string; message?: string; emotion?: CharacterState; provider?: string; model?: string; from?: string; to?: string; fallbackUsed?: boolean; phase?: "searching" | "responding"; webUsed?: boolean; sources?: WebSource[]; webWarning?: string | null }
