import type { Tournament } from '../types/tournament'
import { getRounds, roundLabel } from '../lib/tournamentLogic'
import { MatchCard } from './MatchCard'

interface RoundsViewProps {
  tournament: Tournament
  onPickWinner: (matchId: string, winnerId: string) => void
}

export function RoundsView({ tournament, onPickWinner }: RoundsViewProps) {
  const rounds = getRounds(tournament.matches)
  const totalRounds = tournament.totalRounds ?? rounds.length

  return (
    <div className="flex flex-col gap-8">
      {rounds.map((round) => {
        const matches = tournament.matches
          .filter((m) => m.round === round)
          .sort((a, b) => a.index - b.index)

        return (
          <section key={round}>
            <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-forest/60">
              {roundLabel(tournament.format, round, totalRounds)}
              {tournament.format === 'swiss' && totalRounds > 0 && (
                <span className="ml-2 font-normal normal-case tracking-normal text-forest/40">
                  av {totalRounds}
                </span>
              )}
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {matches.map((match) => (
                <MatchCard
                  key={match.id}
                  tournament={tournament}
                  match={match}
                  onPickWinner={onPickWinner}
                />
              ))}
            </div>
          </section>
        )
      })}
    </div>
  )
}
