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
  const frame = noirSprites[state];

  return (
    <figure className={`noir-character noir-character--${size} ${className}`}>
      <div className="noir-character__aura" aria-hidden="true" />
      <div
        key={animations ? state : "no-animation"}
        role="img"
        aria-label={`Noir — ${stateLabels[state]}`}
        className={animations ? "noir-character__viewport noir-character__sprite--animated" : "noir-character__viewport"}
      >
        <img
          src={frame.sheet}
          alt=""
          className="noir-character__sprite"
          style={{
            width: `${frame.scale * 100}%`,
            height: `${frame.scale === 2 ? 100 : 200}%`,
            left: `${-frame.column * 100}%`,
            top: `${-frame.row * 100}%`,
          }}
          draggable={false}
        />
      </div>
      <figcaption className="noir-character__status">
        <span className={`noir-character__dot noir-character__dot--${state}`} />
        {stateLabels[state]}
      </figcaption>
    </figure>
  );
}
