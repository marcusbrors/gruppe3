import type { Tournament } from '../types/tournament'
import { getRounds, roundLabel } from '../lib/tournamentLogic'
import { MatchCard } from './MatchCard'

interface BracketViewProps {
  tournament: Tournament
  onPickWinner: (matchId: string, winnerId: string) => void
}

export function BracketView({ tournament, onPickWinner }: BracketViewProps) {
  const rounds = getRounds(tournament.matches)
  const totalRounds = tournament.totalRounds ?? rounds.length

  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex min-w-max gap-4">
        {rounds.map((round) => {
          const matches = tournament.matches
            .filter((m) => m.round === round)
            .sort((a, b) => a.index - b.index)

          return (
            <section key={round} className="w-64 shrink-0">
              <h3 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-forest/60">
                {roundLabel(tournament.format, round, totalRounds)}
              </h3>
              <div className="flex flex-col gap-3">
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
    </div>
  )
}
