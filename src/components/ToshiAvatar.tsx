interface ToshiAvatarProps {
  size?: number;
  showStatus?: boolean;
  className?: string;
}

export default function ToshiAvatar({ size = 40, showStatus = true, className = "" }: ToshiAvatarProps) {
  const statusSize = Math.round(size * 0.22);
  const borderSize = Math.round(size * 0.06);

  return (
    <div className={`relative inline-block flex-shrink-0 ${className}`} style={{ width: size, height: size }}>
      <svg
        viewBox="0 0 100 100"
        width={size}
        height={size}
        xmlns="http://www.w3.org/2000/svg"
        className="rounded-full avatar-glow"
        style={{ display: "block" }}
      >
        <defs>
          <radialGradient id="toshi-bg" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#2a1050" />
            <stop offset="100%" stopColor="#0d0620" />
          </radialGradient>
          <radialGradient id="toshi-iris-l" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#b090ff" />
            <stop offset="60%" stopColor="#7B61FF" />
            <stop offset="100%" stopColor="#4a28c0" />
          </radialGradient>
          <radialGradient id="toshi-iris-r" cx="38%" cy="32%" r="65%">
            <stop offset="0%" stopColor="#b090ff" />
            <stop offset="60%" stopColor="#7B61FF" />
            <stop offset="100%" stopColor="#4a28c0" />
          </radialGradient>
          <radialGradient id="toshi-skin" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#f5e4d0" />
            <stop offset="100%" stopColor="#e8cdb8" />
          </radialGradient>
          <clipPath id="toshi-circle">
            <circle cx="50" cy="50" r="50" />
          </clipPath>
          <filter id="toshi-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <g clipPath="url(#toshi-circle)">
          {/* Background */}
          <circle cx="50" cy="50" r="50" fill="url(#toshi-bg)" />

          {/* Subtle background gradient */}
          <radialGradient id="toshi-bg2" cx="50%" cy="80%" r="50%">
            <stop offset="0%" stopColor="#1e0d40" stopOpacity="0.8" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
          <circle cx="50" cy="50" r="50" fill="url(#toshi-bg2)" />

          {/* Hair back layer */}
          <path d="M16 52 Q14 18 50 10 Q86 18 84 52 Q82 28 50 26 Q18 28 16 52Z" fill="#12062a" />

          {/* Neck */}
          <rect x="43" y="73" width="14" height="16" rx="4" fill="url(#toshi-skin)" />

          {/* Collar / top of outfit */}
          <path d="M18 100 Q26 78 42 76 Q50 74 58 76 Q74 78 82 100Z" fill="#1e0d40" />
          {/* Outfit detail */}
          <path d="M44 76 L50 82 L56 76" fill="none" stroke="#7B61FF" strokeWidth="1.2" />

          {/* Face */}
          <ellipse cx="50" cy="53" rx="23" ry="26" fill="url(#toshi-skin)" />

          {/* Hair front + bangs */}
          <path
            d="M27 44 Q30 24 50 22 Q70 24 73 44
               Q70 30 65 33 Q62 24 57 27 Q54 22 50 24 Q46 22 43 27 Q38 24 35 33 Q30 30 27 44Z"
            fill="#12062a"
          />

          {/* Hair side strands left */}
          <path d="M27 48 Q22 62 24 82 Q28 94 34 96 Q28 76 28 60Z" fill="#12062a" />
          <path d="M29 52 Q25 66 27 80 Q30 88 33 90 Q29 73 30 62Z" fill="#1a0838" />

          {/* Hair side strands right */}
          <path d="M73 48 Q78 62 76 82 Q72 94 66 96 Q72 76 72 60Z" fill="#12062a" />
          <path d="M71 52 Q75 66 73 80 Q70 88 67 90 Q71 73 70 62Z" fill="#1a0838" />

          {/* Hair purple shimmer */}
          <path d="M44 22 Q50 20 56 22 Q52 26 50 25 Q48 26 44 22Z" fill="#5530b0" opacity="0.55" />
          <path d="M38 26 Q41 24 43 26 Q41 28 38 26Z" fill="#5530b0" opacity="0.35" />

          {/* Left eye whites */}
          <ellipse cx="37.5" cy="51" rx="8.5" ry="9" fill="white" />
          {/* Right eye whites */}
          <ellipse cx="62.5" cy="51" rx="8.5" ry="9" fill="white" />

          {/* Left iris */}
          <ellipse cx="37.5" cy="52" rx="6.5" ry="7.5" fill="url(#toshi-iris-l)" />
          {/* Right iris */}
          <ellipse cx="62.5" cy="52" rx="6.5" ry="7.5" fill="url(#toshi-iris-r)" />

          {/* Left pupil */}
          <ellipse cx="37.5" cy="53" rx="3.8" ry="4.8" fill="#080214" />
          {/* Right pupil */}
          <ellipse cx="62.5" cy="53" rx="3.8" ry="4.8" fill="#080214" />

          {/* Eye gleam left */}
          <ellipse cx="40.5" cy="49.5" rx="2" ry="2.4" fill="white" opacity="0.92" />
          <ellipse cx="35.5" cy="54" rx="0.9" ry="1.1" fill="white" opacity="0.4" />

          {/* Eye gleam right */}
          <ellipse cx="65.5" cy="49.5" rx="2" ry="2.4" fill="white" opacity="0.92" />
          <ellipse cx="60.5" cy="54" rx="0.9" ry="1.1" fill="white" opacity="0.4" />

          {/* Upper eyelashes left */}
          <path d="M29 47 Q37.5 43.5 46 47" stroke="#080214" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Upper eyelashes right */}
          <path d="M54 47 Q62.5 43.5 71 47" stroke="#080214" strokeWidth="1.8" fill="none" strokeLinecap="round" />

          {/* Lower lashes */}
          <path d="M31 57 Q37.5 59.5 44 57" stroke="#080214" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />
          <path d="M56 57 Q62.5 59.5 69 57" stroke="#080214" strokeWidth="0.8" fill="none" strokeLinecap="round" opacity="0.6" />

          {/* Eyebrow left */}
          <path d="M30 42 Q37.5 39 45 41.5" stroke="#12062a" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Eyebrow right */}
          <path d="M55 41.5 Q62.5 39 70 42" stroke="#12062a" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Blush left */}
          <ellipse cx="26" cy="59" rx="6" ry="3" fill="#f088a8" opacity="0.22" />
          {/* Blush right */}
          <ellipse cx="74" cy="59" rx="6" ry="3" fill="#f088a8" opacity="0.22" />

          {/* Nose */}
          <path d="M47 62 Q50 64.5 53 62" stroke="#c0967e" strokeWidth="0.9" fill="none" strokeLinecap="round" />

          {/* Mouth */}
          <path d="M44.5 68 Q50 72 55.5 68" stroke="#c87868" strokeWidth="1.4" fill="none" strokeLinecap="round" />

          {/* Small star in hair */}
          <g transform="translate(62, 28) scale(0.55)" opacity="0.85" filter="url(#toshi-glow)">
            <path
              d="M8 0 L9.8 5.6 L16 5.6 L11 9 L12.9 14.6 L8 11.2 L3.1 14.6 L5 9 L0 5.6 L6.2 5.6Z"
              fill="#7B61FF"
            />
          </g>

          {/* Neon accent near collar */}
          <line x1="44" y1="76" x2="56" y2="76" stroke="#00CFFF" strokeWidth="0.6" opacity="0.5" />
        </g>
      </svg>

      {showStatus && (
        <div
          className="absolute rounded-full bg-green-400"
          style={{
            width: statusSize,
            height: statusSize,
            bottom: borderSize,
            right: borderSize,
            border: `${Math.max(1, Math.round(borderSize * 0.6))}px solid #171923`,
            boxShadow: "0 0 6px rgba(52,211,153,0.6)",
          }}
        />
      )}
    </div>
  );
}
