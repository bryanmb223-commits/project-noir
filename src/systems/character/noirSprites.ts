import spriteSheet from "../../assets/noir/nyra-expression-sheet.png";
export const CHARACTER_STATES = ["neutral", "happy", "confident", "thinking", "excited", "surprised", "embarrassed", "sad", "irritated", "concerned", "sleepy", "laughing", "flustered", "deadpan", "wink"] as const;
export type CharacterState = (typeof CHARACTER_STATES)[number];
export const TEMPORARY_CHARACTER_STATES = new Set<CharacterState>(["surprised", "embarrassed", "laughing", "wink", "flustered"]);
export interface SpriteFrame { sheet: string; x: number; y: number; width: number; height: number; offsetX: number; offsetY: number; scale: number }
const frame = (x: number, y: number, width: number, height: number, offsetX = 0, offsetY = 0, scale = 1): SpriteFrame => ({ sheet: spriteSheet, x, y, width, height, offsetX, offsetY, scale });
// Coordenadas medidas na folha 1536×1024. Cada região inclui sua margem e respeita os gutters reais.
export const noirSprites: Record<CharacterState, SpriteFrame> = {
  neutral: frame(7, 7, 326, 329), happy: frame(342, 7, 306, 329), confident: frame(656, 7, 279, 329), thinking: frame(944, 7, 281, 329), excited: frame(1234, 7, 294, 329),
  surprised: frame(7, 344, 326, 324), embarrassed: frame(342, 344, 306, 324), sad: frame(656, 344, 279, 324), irritated: frame(944, 344, 281, 324), concerned: frame(1234, 344, 294, 324),
  sleepy: frame(7, 677, 326, 329), laughing: frame(342, 677, 306, 329), flustered: frame(656, 677, 279, 329), deadpan: frame(944, 677, 281, 329), wink: frame(1234, 677, 294, 329),
};
export function isCharacterState(value: unknown): value is CharacterState { return typeof value === "string" && CHARACTER_STATES.includes(value as CharacterState); }
