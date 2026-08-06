import { useId, useState, type ReactNode } from 'react'
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

export function PlayerHoverName({
  tournament,
  playerId,
  showSeed = true,
  className = '',
  children,
}: PlayerHoverNameProps) {
  const tipId = useId()
  const [open, setOpen] = useState(false)
  const label = showSeed
    ? formatPlayerLabel(tournament, playerId)
    : tournament.players.find((p) => p.id === playerId)?.name ?? 'TBD'
  const stats = playerId ? getPlayerStats(tournament, playerId) : null

  if (!playerId || !stats) {
    return <span className={className}>{children ?? label}</span>
  }

  return (
    <span
      className={`relative inline-flex ${className}`}
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

      {open && (
        <span
          id={tipId}
          role="tooltip"
          className="pointer-events-none absolute left-0 top-full z-50 mt-2 w-56 animate-fade-up rounded-lg border border-coral/30 bg-cream p-3 text-left shadow-lg shadow-sand/40"
        >
          <span className="mb-2 flex items-center justify-between gap-2">
            <span className="font-display text-sm font-bold text-ink">{stats.name}</span>
            <span className="rounded bg-coral/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-coral">
              Seed #{stats.seed}
            </span>
          </span>

          <span className="mb-2 block h-1.5 overflow-hidden rounded-full bg-mint">
            <span
              className="block h-full rounded-full bg-coral transition-all"
              style={{ width: `${stats.winRate}%` }}
            />
          </span>

          <span className="grid grid-cols-2 gap-x-3 gap-y-1 text-xs text-forest/80">
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
          </span>

          <span className="mt-2 flex items-center gap-1">
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
          </span>

          {stats.nextOpponentName && (
            <span className="mt-2 block text-[11px] text-forest/55">
              Neste: <span className="font-medium text-ink">{stats.nextOpponentName}</span>
            </span>
          )}
        </span>
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
