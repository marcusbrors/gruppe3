import {
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'
import type { Tournament } from '../types/tournament'
import { getPlayerStats } from '../lib/playerStats'
import { formatPlayerLabel } from '../lib/tournamentLogic'

interface PlayerHoverNameProps {
  tournament: Tournament
  playerId: string | null
  /** Vis seed-prefix (#1 Navn) */
  showSeed?: boolean
  className?: string
  children?: ReactNode
}

interface TipPos {
  top: number
  left: number
}

export function PlayerHoverName({
  tournament,
  playerId,
  showSeed = true,
  className = '',
  children,
}: PlayerHoverNameProps) {
  const tipId = useId()
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<TipPos>({ top: 0, left: 0 })

  const label = showSeed
    ? formatPlayerLabel(tournament, playerId)
    : tournament.players.find((p) => p.id === playerId)?.name ?? 'TBD'
  const stats = playerId ? getPlayerStats(tournament, playerId) : null

  useLayoutEffect(() => {
    if (!open || !triggerRef.current) return

    const place = () => {
      const rect = triggerRef.current!.getBoundingClientRect()
      const tipWidth = 224
      const gap = 8
      const left = Math.min(
        Math.max(8, rect.left),
        window.innerWidth - tipWidth - 8,
      )
      const below = rect.bottom + gap
      const tipHeight = 220
      const top =
        below + tipHeight > window.innerHeight
          ? Math.max(8, rect.top - tipHeight - gap)
          : below
      setPos({ top, left })
    }

    place()
    window.addEventListener('scroll', place, true)
    window.addEventListener('resize', place)
    return () => {
      window.removeEventListener('scroll', place, true)
      window.removeEventListener('resize', place)
    }
  }, [open])

  if (!playerId || !stats) {
    return <span className={className}>{children ?? label}</span>
  }

  return (
    <span
      ref={triggerRef}
      className={`inline-flex ${className}`}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <span
        aria-describedby={open ? tipId : undefined}
        className="cursor-help underline decoration-coral/40 decoration-dotted underline-offset-4"
      >
        {children ?? label}
      </span>

      {open &&
        createPortal(
          <div
            id={tipId}
            role="tooltip"
            style={{ top: pos.top, left: pos.left }}
            className="pointer-events-none fixed z-[9999] w-56 rounded-lg border border-coral/40 bg-cream p-3 text-left shadow-xl shadow-sand/50"
          >
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="font-display text-sm font-bold text-ink">{stats.name}</span>
              <span className="rounded bg-coral/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-coral">
                Seed #{stats.seed}
              </span>
            </div>

            <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-mint">
              <div
                className="h-full rounded-full bg-coral transition-all"
                style={{ width: `${stats.winRate}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-forest/80">
              <Stat label="Win %" value={`${stats.winRate}%`} accent />
              <Stat label="Plass" value={`#${stats.rank}`} />
              <Stat label="Kamper" value={String(stats.played)} />
              <Stat label="S–T" value={`${stats.wins}–${stats.losses}`} />
              <Stat label="Poeng" value={String(stats.points)} />
              <Stat
                label="Streak"
                value={
                  stats.streakType
                    ? `${stats.streakType === 'W' ? 'W' : 'L'}${stats.streak}`
                    : '—'
                }
              />
            </div>

            <div className="mt-2 flex items-center gap-1">
              <span className="text-[10px] uppercase tracking-wide text-forest/45">Form</span>
              {stats.form.length === 0 ? (
                <span className="text-xs text-forest/40">Ingen kamper</span>
              ) : (
                stats.form.map((r, i) => (
                  <span
                    key={`${r}-${i}`}
                    className={[
                      'inline-flex h-5 w-5 items-center justify-center rounded text-[10px] font-bold',
                      r === 'W'
                        ? 'bg-moss/20 text-moss'
                        : r === 'L'
                          ? 'bg-coral/15 text-coral'
                          : 'bg-forest/10 text-forest/60',
                    ].join(' ')}
                  >
                    {r}
                  </span>
                ))
              )}
            </div>

            {stats.nextOpponentName && (
              <p className="mt-2 text-[11px] text-forest/55">
                Neste: <span className="font-medium text-ink">{stats.nextOpponentName}</span>
              </p>
            )}
          </div>,
          document.body,
        )}
    </span>
  )
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <span className="flex items-baseline justify-between gap-2">
      <span className="text-forest/45">{label}</span>
      <span className={`font-semibold ${accent ? 'text-coral' : 'text-ink'}`}>{value}</span>
    </span>
  )
}
