import neutral from "../../assets/noir/neutral.png";
import happy from "../../assets/noir/happy.png";
import confident from "../../assets/noir/confident.png";
import thinking from "../../assets/noir/thinking.png";
import irritated from "../../assets/noir/irritated.png";

export const CHARACTER_STATES = [
  "neutral",
  "happy",
  "confident",
  "thinking",
  "irritated",
] as const;

export type CharacterState = (typeof CHARACTER_STATES)[number];

export const noirSprites: Record<CharacterState, string> = {
  neutral,
  happy,
  confident,
  thinking,
  irritated,
};

export function isCharacterState(value: unknown): value is CharacterState {
  return typeof value === "string" && CHARACTER_STATES.includes(value as CharacterState);
}
