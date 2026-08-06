import { useCallback, useState } from 'react'
import type { Match, Tournament } from '../types/tournament'
import { formatPlayerLabel, getPlayerName } from '../lib/tournamentLogic'
import { useLocale } from '../context/LocaleContext'
import { MatchResultFx, type MatchFxPayload } from './MatchResultFx'
import { PlayerHoverName } from './PlayerHoverName'

interface MatchCardProps {
  tournament: Tournament
  match: Match
  onPickWinner: (matchId: string, winnerId: string) => void
}

function PlayerButton({
  tournament,
  playerId,
  selected,
  disabled,
  onClick,
  winnerLabel,
}: {
  tournament: Tournament
  playerId: string | null
  selected: boolean
  disabled: boolean
  onClick: () => void
  winnerLabel: string
}) {
  const label = formatPlayerLabel(tournament, playerId)
  const isTbd = !playerId

  return (
    <button
      type="button"
      disabled={disabled || isTbd}
      onClick={onClick}
      className={[
        'flex w-full items-center justify-between rounded-md px-3 py-2.5 text-left text-sm font-medium transition',
        selected
          ? 'bg-moss text-sand'
          : disabled || isTbd
            ? 'bg-forest/10 text-forest/50'
            : 'bg-cream text-ink hover:bg-lime/50',
      ].join(' ')}
    >
      <span className="min-w-0">
        {isTbd ? (
          label
        ) : (
          <PlayerHoverName
            tournament={tournament}
            playerId={playerId}
            className={selected ? '[&_span]:decoration-mint/50' : undefined}
          />
        )}
      </span>
      {selected && (
        <span className="shrink-0 text-xs uppercase tracking-wide opacity-80">{winnerLabel}</span>
      )}
    </button>
  )
}

export function MatchCard({ tournament, match, onPickWinner }: MatchCardProps) {
  const { t } = useLocale()
  const [fx, setFx] = useState<MatchFxPayload | null>(null)
  const canPick = match.status === 'ready' || match.status === 'completed'
  const bothReady = Boolean(match.player1Id && match.player2Id)

  const clearFx = useCallback(() => setFx(null), [])

  const pick = (winnerId: string) => {
    if (!match.player1Id || !match.player2Id) return
    if (match.winnerId === winnerId) {
      onPickWinner(match.id, winnerId)
      return
    }
    const loserId = winnerId === match.player1Id ? match.player2Id : match.player1Id
    setFx({
      winnerName: getPlayerName(tournament, winnerId),
      loserName: getPlayerName(tournament, loserId),
    })
    onPickWinner(match.id, winnerId)
  }

  if (match.isBye) {
    return (
      <div className="rounded-lg border border-dashed border-forest/15 bg-surface/40 p-3">
        <div className="mb-1 text-xs text-forest/50">{t('bye')}</div>
        <p className="text-sm font-medium text-forest">
          <PlayerHoverName tournament={tournament} playerId={match.player1Id} /> {t('advances')}
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="rounded-lg border border-forest/10 bg-surface/60 p-3 shadow-sm backdrop-blur-sm">
        <div className="mb-2 flex items-center justify-between text-xs text-forest/50">
          <span>
            {t('match')} #{match.index + 1}
          </span>
          <span>
            {match.status === 'completed'
              ? t('done')
              : match.status === 'ready'
                ? t('ready')
                : t('waiting')}
          </span>
        </div>
        <div className="flex flex-col gap-1.5">
          <PlayerButton
            tournament={tournament}
            playerId={match.player1Id}
            selected={match.winnerId === match.player1Id}
            disabled={!canPick || !bothReady}
            onClick={() => match.player1Id && pick(match.player1Id)}
            winnerLabel={t('winnerLabel')}
          />
          <PlayerButton
            tournament={tournament}
            playerId={match.player2Id}
            selected={match.winnerId === match.player2Id}
            disabled={!canPick || !bothReady}
            onClick={() => match.player2Id && pick(match.player2Id)}
            winnerLabel={t('winnerLabel')}
          />
        </div>
      </div>
      <MatchResultFx payload={fx} onDone={clearFx} />
    </>
  )
}
