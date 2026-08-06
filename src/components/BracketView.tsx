import type { Match, Tournament } from '../types/tournament'
import { getRounds } from '../lib/tournamentLogic'
import { useLocale } from '../context/LocaleContext'
import { MatchCard } from './MatchCard'

interface BracketViewProps {
  tournament: Tournament
  onPickWinner: (matchId: string, winnerId: string) => void
}

/** Slot-høyde for vertikal sentrering (kort + gap). Hover/FX bruker portal og påvirkes ikke. */
const SLOT = 148
const COL_WIDTH = 272

function matchTop(roundIndex: number, matchIndex: number): number {
  const spacing = SLOT * 2 ** roundIndex
  const offset = (spacing - SLOT) / 2
  return offset + matchIndex * spacing
}

function columnHeight(firstRoundCount: number): number {
  return Math.max(firstRoundCount, 1) * SLOT
}

export function BracketView({ tournament, onPickWinner }: BracketViewProps) {
  const { roundName } = useLocale()
  const rounds = getRounds(tournament.matches)
  const totalRounds = tournament.totalRounds ?? rounds.length
  const firstRoundCount = tournament.matches.filter((m) => m.round === rounds[0]).length
  const height = columnHeight(firstRoundCount)

  return (
    <div className="overflow-x-auto overflow-y-visible pb-4">
      <div
        className="relative mx-auto flex min-w-max justify-center gap-6 px-2"
        style={{ minHeight: height }}
      >
        {rounds.map((round, roundIndex) => {
          const matches = tournament.matches
            .filter((m) => m.round === round)
            .sort((a, b) => a.index - b.index)

          return (
            <section
              key={round}
              className="relative shrink-0"
              style={{ width: COL_WIDTH, height }}
            >
              <h3 className="sticky top-0 z-10 mb-2 bg-cream/90 py-1 font-display text-sm font-bold uppercase tracking-wider text-forest/60 backdrop-blur-sm">
                {roundName(tournament.format, round, totalRounds)}
              </h3>

              <div className="relative" style={{ height: height - 36 }}>
                {/* Connector lines toward next round */}
                {roundIndex < rounds.length - 1 &&
                  matches.map((match, matchIndex) => {
                    const top = matchTop(roundIndex, matchIndex) + SLOT / 2 - 18
                    return (
                      <span
                        key={`line-${match.id}`}
                        aria-hidden
                        className="pointer-events-none absolute right-[-12px] h-px w-3 bg-forest/25"
                        style={{ top }}
                      />
                    )
                  })}

                {matches.map((match, matchIndex) => (
                  <div
                    key={match.id}
                    className="absolute left-0 w-full"
                    style={{
                      top: matchTop(roundIndex, matchIndex),
                      // Hold hover-trigger over nabokort uten å dekke hele kolonnen
                      zIndex: 1,
                    }}
                    onMouseEnter={(e) => {
                      ;(e.currentTarget as HTMLElement).style.zIndex = '20'
                    }}
                    onMouseLeave={(e) => {
                      ;(e.currentTarget as HTMLElement).style.zIndex = '1'
                    }}
                  >
                    <CenteredMatch
                      tournament={tournament}
                      match={match}
                      onPickWinner={onPickWinner}
                    />
                  </div>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}

function CenteredMatch({
  tournament,
  match,
  onPickWinner,
}: {
  tournament: Tournament
  match: Match
  onPickWinner: (matchId: string, winnerId: string) => void
}) {
  return (
    <div className="flex h-[136px] items-center">
      <div className="w-full">
        <MatchCard
          tournament={tournament}
          match={match}
          onPickWinner={onPickWinner}
        />
      </div>
    </div>
  )
}
