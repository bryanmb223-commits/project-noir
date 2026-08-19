import { noirSprites, type CharacterState } from "../systems/character/noirSprites";

interface NoirCharacterProps {
  state: CharacterState;
  size?: "small" | "medium" | "large";
  animations?: boolean;
  className?: string;
}

const stateLabels: Record<CharacterState, string> = {
  neutral: "Em espera",
  happy: "Contente",
  confident: "Confiante",
  thinking: "Pensando",
  irritated: "Alerta",
};

export default function NoirCharacter({
  state,
  size = "large",
  animations = true,
  className = "",
}: NoirCharacterProps) {
  return (
    <figure className={`noir-character noir-character--${size} ${className}`}>
      <div className="noir-character__aura" aria-hidden="true" />
      <img
        key={animations ? state : "no-animation"}
        src={noirSprites[state]}
        alt={`Noir — ${stateLabels[state]}`}
        className={animations ? "noir-character__sprite noir-character__sprite--animated" : "noir-character__sprite"}
        draggable={false}
      />
      <figcaption className="noir-character__status">
        <span className={`noir-character__dot noir-character__dot--${state}`} />
        {stateLabels[state]}
      </figcaption>
    </figure>
  );
}
