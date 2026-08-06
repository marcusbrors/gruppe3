import type { Match, Tournament } from '../types/tournament'
import { formatPlayerLabel } from '../lib/tournamentLogic'

interface MatchCardProps {
  tournament: Tournament
  match: Match
  onPickWinner: (matchId: string, winnerId: string) => void
}

function PlayerButton({
  name,
  selected,
  disabled,
  onClick,
}: {
  name: string
  selected: boolean
  disabled: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      disabled={disabled || name === 'TBD'}
      onClick={onClick}
      className={[
        'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition',
        selected
          ? 'bg-moss text-mint'
          : disabled || name === 'TBD'
            ? 'bg-forest/5 text-forest/40'
            : 'bg-cream text-ink hover:bg-lime/40',
      ].join(' ')}
    >
      <span>{name}</span>
      {selected && <span className="text-xs uppercase tracking-wide opacity-80">Vinner</span>}
    </button>
  )
}

export function MatchCard({ tournament, match, onPickWinner }: MatchCardProps) {
  const p1 = formatPlayerLabel(tournament, match.player1Id)
  const p2 = formatPlayerLabel(tournament, match.player2Id)
  const canPick = match.status === 'ready' || match.status === 'completed'
  const bothReady = Boolean(match.player1Id && match.player2Id)

  if (match.isBye) {
    return (
      <div className="rounded-lg border border-dashed border-forest/15 bg-surface/40 p-3">
        <div className="mb-1 text-xs text-forest/50">Bye</div>
        <p className="text-sm font-medium text-forest">{p1} går videre</p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-forest/10 bg-surface/60 p-3 shadow-sm backdrop-blur-sm">
      <div className="mb-2 flex items-center justify-between text-xs text-forest/50">
        <span>Kamp #{match.index + 1}</span>
        <span>
          {match.status === 'completed'
            ? 'Ferdig'
            : match.status === 'ready'
              ? 'Klar'
              : 'Venter'}
        </span>
      </div>
      <div className="flex flex-col gap-1.5">
        <PlayerButton
          name={p1}
          selected={match.winnerId === match.player1Id}
          disabled={!canPick || !bothReady}
          onClick={() => match.player1Id && onPickWinner(match.id, match.player1Id)}
        />
        <PlayerButton
          name={p2}
          selected={match.winnerId === match.player2Id}
          disabled={!canPick || !bothReady}
          onClick={() => match.player2Id && onPickWinner(match.id, match.player2Id)}
        />
      </div>
    </div>
  )
}
