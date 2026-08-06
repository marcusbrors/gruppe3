import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { useLocale } from '../context/LocaleContext'

export interface MatchFxPayload {
  winnerName: string
  loserName: string
}

interface MatchResultFxProps {
  payload: MatchFxPayload | null
  onDone: () => void
}

function particles(count: number, seed: string) {
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + seed.length * 0.01
    const dist = 40 + ((i * 37) % 80)
    return {
      id: `${seed}-${i}`,
      x: Math.cos(angle) * dist,
      y: Math.sin(angle) * dist,
      delay: (i % 8) * 0.03,
      rot: (i * 47) % 360,
      hue: (i * 41) % 360,
    }
  })
}

export function MatchResultFx({ payload, onDone }: MatchResultFxProps) {
  const { t } = useLocale()
  const confetti = useMemo(
    () => (payload ? particles(18, payload.winnerName) : []),
    [payload],
  )
  const boom = useMemo(
    () => (payload ? particles(12, payload.loserName) : []),
    [payload],
  )

  useEffect(() => {
    if (!payload) return
    const timer = window.setTimeout(onDone, 3500)
    return () => window.clearTimeout(timer)
  }, [payload, onDone])

  if (!payload) return null

  return createPortal(
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center bg-sand/40 backdrop-blur-[2px]"
      role="status"
      aria-live="polite"
    >
      <div className="relative mx-4 flex w-full max-w-md flex-col gap-4">
        <button
          type="button"
          onClick={onDone}
          aria-label="Lukk animasjon"
          title="Lukk"
          className="absolute -right-1 -top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-forest/20 bg-cream text-lg font-bold leading-none text-ink shadow-md transition hover:border-coral hover:text-coral sm:-right-2 sm:-top-4"
        >
          ×
        </button>

        {/* Winner card */}
        <div className="fx-winner pointer-events-none relative overflow-hidden rounded-2xl border-2 border-amber bg-cream px-5 py-6 text-center shadow-2xl">
          {confetti.map((p) => (
            <span
              key={p.id}
              className="fx-confetti absolute left-1/2 top-1/2 h-2.5 w-2.5 rounded-sm"
              style={{
                ['--dx' as string]: `${p.x}px`,
                ['--dy' as string]: `${p.y}px`,
                ['--rot' as string]: `${p.rot}deg`,
                animationDelay: `${p.delay}s`,
                background: `hsl(${p.hue} 85% 55%)`,
              }}
            />
          ))}
          <p className="relative z-10 text-4xl" aria-hidden>
            🏆
          </p>
          <p className="relative z-10 mt-2 font-display text-xs font-bold tracking-[0.2em] text-coral">
            {t('applause')}
          </p>
          <p className="relative z-10 mt-1 font-display text-2xl font-extrabold text-ink">
            {payload.winnerName}
          </p>
          <p className="relative z-10 text-sm text-forest/70">{t('takesWin')}</p>
        </div>

        {/* Loser card */}
        <div className="fx-loser relative overflow-hidden rounded-2xl border border-forest/20 bg-surface/90 px-5 py-4 text-center shadow-lg">
          {boom.map((p) => (
            <span
              key={p.id}
              className="fx-boom absolute left-1/2 top-1/2 text-lg"
              style={{
                ['--dx' as string]: `${p.x * 0.8}px`,
                ['--dy' as string]: `${p.y * 0.8}px`,
                animationDelay: `${p.delay}s`,
              }}
              aria-hidden
            >
              💥
            </span>
          ))}
          <p className="relative z-10 text-2xl" aria-hidden>
            💥
          </p>
          <p className="relative z-10 mt-1 text-xs font-bold tracking-wide text-forest/50">
            {t('explosion')}
          </p>
          <p className="relative z-10 font-display text-lg font-bold text-ink">
            {payload.loserName}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  )
}
