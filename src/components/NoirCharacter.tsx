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
  excited: "Animada", surprised: "Surpresa", embarrassed: "Sem graça", sad: "Triste", concerned: "Preocupada", sleepy: "Sonolenta", laughing: "Rindo", flustered: "Corada", deadpan: "Impassível", wink: "Piscando",
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
        aria-label={`Nyra — ${stateLabels[state]}`}
        className={animations ? "noir-character__viewport noir-character__sprite--animated" : "noir-character__viewport"}
        style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
      >
        <img
          src={frame.sheet}
          alt=""
          className="noir-character__sprite"
          style={{
            width: `${(1536 / frame.width) * frame.scale * 100}%`,
            height: `${(1024 / frame.height) * frame.scale * 100}%`,
            left: `${(-frame.x / frame.width + frame.offsetX) * 100}%`,
            top: `${(-frame.y / frame.height + frame.offsetY) * 100}%`,
          }}
          draggable={false}
        />
      </div>
      <figcaption className="noir-character__status">
        <span className={`noir-character__dot noir-character__dot--${state}`} />
        Nyra · {stateLabels[state]}
      </figcaption>
    </figure>
  );
}
