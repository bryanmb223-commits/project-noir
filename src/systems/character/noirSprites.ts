import spriteSheet from "../../assets/noir/noir-sprite-sheet.png";

export const CHARACTER_STATES = [
  "neutral",
  "happy",
  "confident",
  "thinking",
  "irritated",
] as const;

export type CharacterState = (typeof CHARACTER_STATES)[number];

interface SpriteFrame {
  sheet: string;
  column: 0 | 2 | 3;
  row: 0 | 1;
  scale: 2 | 4;
}

// A folha tem um quadro grande à esquerda e quatro quadrantes à direita.
export const noirSprites: Record<CharacterState, SpriteFrame> = {
  neutral: { sheet: spriteSheet, column: 0, row: 0, scale: 2 },
  thinking: { sheet: spriteSheet, column: 2, row: 0, scale: 4 },
  happy: { sheet: spriteSheet, column: 3, row: 0, scale: 4 },
  confident: { sheet: spriteSheet, column: 2, row: 1, scale: 4 },
  irritated: { sheet: spriteSheet, column: 3, row: 1, scale: 4 },
};

export function isCharacterState(value: unknown): value is CharacterState {
  return typeof value === "string" && CHARACTER_STATES.includes(value as CharacterState);
}
