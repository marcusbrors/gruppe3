/** Lett gjennomsiktig sports-/spill-collage bak Kjell Games-logoen. */
export function HeaderGamesBanner() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      <svg
        className="absolute inset-0 h-full w-full opacity-[0.22] dark:opacity-[0.18]"
        viewBox="0 0 800 120"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="hg-fade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="35%" stopColor="white" stopOpacity="0.55" />
            <stop offset="70%" stopColor="white" stopOpacity="0.35" />
            <stop offset="100%" stopColor="white" stopOpacity="0.1" />
          </linearGradient>
          <mask id="hg-mask">
            <rect width="800" height="120" fill="url(#hg-fade)" />
          </mask>
        </defs>

        <g mask="url(#hg-mask)">
          {/* Bowling ball */}
          <g transform="translate(40,18)">
            <circle cx="36" cy="42" r="34" fill="#1f2937" />
            <circle cx="24" cy="30" r="4" fill="#94a3b8" />
            <circle cx="36" cy="24" r="4" fill="#94a3b8" />
            <circle cx="48" cy="30" r="4" fill="#94a3b8" />
            <ellipse cx="50" cy="50" rx="10" ry="6" fill="#334155" opacity="0.5" />
          </g>

          {/* Playing cards */}
          <g transform="translate(130,22) rotate(-12)">
            <rect width="44" height="60" rx="4" fill="#fff" stroke="#e11d48" strokeWidth="2" />
            <text x="8" y="20" fontSize="14" fill="#e11d48" fontFamily="Georgia, serif">A</text>
            <text x="16" y="40" fontSize="18" fill="#e11d48">♥</text>
          </g>
          <g transform="translate(158,28) rotate(8)">
            <rect width="44" height="60" rx="4" fill="#fff" stroke="#0f172a" strokeWidth="2" />
            <text x="8" y="20" fontSize="14" fill="#0f172a" fontFamily="Georgia, serif">K</text>
            <text x="16" y="40" fontSize="18" fill="#0f172a">♠</text>
          </g>

          {/* Dice */}
          <g transform="translate(240,30) rotate(-8)">
            <rect width="40" height="40" rx="6" fill="#f8fafc" stroke="#64748b" strokeWidth="2" />
            <circle cx="12" cy="12" r="3.5" fill="#0f172a" />
            <circle cx="28" cy="12" r="3.5" fill="#0f172a" />
            <circle cx="20" cy="20" r="3.5" fill="#0f172a" />
            <circle cx="12" cy="28" r="3.5" fill="#0f172a" />
            <circle cx="28" cy="28" r="3.5" fill="#0f172a" />
          </g>
          <g transform="translate(278,48) rotate(14)">
            <rect width="32" height="32" rx="5" fill="#e8366f" />
            <circle cx="16" cy="16" r="3" fill="#fff" />
          </g>

          {/* Billiard / pool ball */}
          <g transform="translate(340,22)">
            <circle cx="34" cy="38" r="32" fill="#dc2626" />
            <circle cx="34" cy="38" r="14" fill="#fff" />
            <text
              x="34"
              y="44"
              textAnchor="middle"
              fontSize="16"
              fontWeight="700"
              fill="#0f172a"
              fontFamily="system-ui,sans-serif"
            >
              7
            </text>
          </g>

          {/* Football / soccer */}
          <g transform="translate(430,24)">
            <circle cx="36" cy="36" r="30" fill="#f8fafc" stroke="#334155" strokeWidth="2" />
            <polygon
              points="36,18 44,28 40,40 32,40 28,28"
              fill="#0f172a"
            />
            <path d="M36 18 L52 26 M36 18 L20 26 M40 40 L54 44 M32 40 L18 44" stroke="#0f172a" strokeWidth="2" fill="none" />
          </g>

          {/* Tennis racket suggestion */}
          <g transform="translate(520,16) rotate(20)">
            <ellipse cx="28" cy="30" rx="22" ry="28" fill="none" stroke="#16a34a" strokeWidth="4" />
            <line x1="28" y1="58" x2="28" y2="95" stroke="#854d0e" strokeWidth="4" strokeLinecap="round" />
            <circle cx="40" cy="22" r="5" fill="#facc15" stroke="#ca8a04" strokeWidth="1.5" />
          </g>

          {/* Controller / gamepad */}
          <g transform="translate(600,34)">
            <rect width="90" height="48" rx="16" fill="#312e81" />
            <circle cx="28" cy="24" r="8" fill="#a5b4fc" />
            <rect x="24" y="14" width="8" height="20" rx="2" fill="#e0e7ff" />
            <rect x="18" y="20" width="20" height="8" rx="2" fill="#e0e7ff" />
            <circle cx="68" cy="18" r="4" fill="#f472b6" />
            <circle cx="78" cy="26" r="4" fill="#34d399" />
            <circle cx="62" cy="30" r="4" fill="#fbbf24" />
          </g>

          {/* Chess knight hint */}
          <g transform="translate(720,20)">
            <rect width="50" height="70" rx="6" fill="#1e293b" />
            <text x="10" y="48" fontSize="36" fill="#f8fafc">♞</text>
          </g>
        </g>
      </svg>

      {/* Soft color wash so logo stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-cream/90 via-cream/55 to-cream/80 dark:from-cream/95 dark:via-cream/70 dark:to-cream/90" />
    </div>
  )
}
