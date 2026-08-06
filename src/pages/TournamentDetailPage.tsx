import { Link, useParams } from 'react-router-dom'
import { useTournaments } from '../context/TournamentContext'
import { BracketView } from '../components/BracketView'
import { MatchCard } from '../components/MatchCard'
import { RoundsView } from '../components/RoundsView'
import { StandingsTable } from '../components/StandingsTable'
import { FORMAT_LABELS } from '../types/tournament'
import {
  getLeaderId,
  getPlayerName,
  progressPercent,
  usesBracket,
  usesStandings,
} from '../lib/tournamentLogic'

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getTournament, updateMatchWinner } = useTournaments()
  const tournament = id ? getTournament(id) : undefined

  if (!tournament) {
    return (
      <div className="animate-fade-up text-center">
        <h1 className="font-display text-2xl font-bold">Fant ikke turneringen</h1>
        <Link to="/" className="mt-4 inline-block text-moss underline">
          Tilbake til oversikt
        </Link>
      </div>
    )
  }

  const pct = progressPercent(tournament)
  const onPick = (matchId: string, winnerId: string) => {
    updateMatchWinner(tournament.id, matchId, winnerId)
  }

  const leaderId = getLeaderId(tournament)
  const showStandings = usesStandings(tournament.format)

  return (
    <div className="animate-fade-up">
      <Link to="/" className="text-sm text-forest/50 transition hover:text-forest">
        ← Oversikt
      </Link>

      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-coral">{FORMAT_LABELS[tournament.format]}</p>
          <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
            {tournament.name}
          </h1>
          <p className="mt-1 text-forest/60">
            {tournament.players.length} deltakere ·{' '}
            {tournament.status === 'completed' ? 'Fullført' : 'Pågår'}
            {tournament.format === 'swiss' && tournament.totalRounds
              ? ` · ${tournament.totalRounds} swiss-runder`
              : null}
          </p>
        </div>
        <div className="text-right">
          <p className="font-display text-3xl font-extrabold text-moss">{pct}%</p>
          <p className="text-xs text-forest/50">fremdrift</p>
        </div>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-mint">
        <div
          className="h-full rounded-full bg-moss transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {leaderId && (
        <div className="animate-fade-up-delay-1 mt-6 rounded-lg border border-amber/40 bg-amber/15 px-4 py-3">
          <p className="text-sm text-forest/70">
            {tournament.format === 'cup' ? 'Vinner' : 'Ledelse / vinner'}
          </p>
          <p className="font-display text-2xl font-extrabold text-ink">
            {getPlayerName(tournament, leaderId)}
          </p>
        </div>
      )}

      <p className="mt-8 mb-3 text-sm text-forest/60">
        Klikk på en spiller for å registrere kampresultat.
        {tournament.format === 'swiss'
          ? ' Neste swiss-runde genereres når alle kamper i runden er spilt.'
          : null}
      </p>

      {usesBracket(tournament.format) ? (
        <BracketView tournament={tournament} onPickWinner={onPick} />
      ) : showStandings ? (
        <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            {tournament.format === 'round_robin' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {tournament.matches
                  .slice()
                  .sort((a, b) => a.index - b.index)
                  .map((match) => (
                    <MatchCard
                      key={match.id}
                      tournament={tournament}
                      match={match}
                      onPickWinner={onPick}
                    />
                  ))}
              </div>
            ) : (
              <RoundsView tournament={tournament} onPickWinner={onPick} />
            )}
          </div>
          <div>
            <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-forest/60">
              Tabell
            </h2>
            <StandingsTable tournament={tournament} />
          </div>
        </div>
      ) : null}

      <section className="animate-fade-up-delay-2 mt-10">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-forest/60">
          Seeding
        </h2>
        <ol className="flex flex-col gap-1.5 sm:max-w-md">
          {[...tournament.players]
            .sort((a, b) => a.seed - b.seed)
            .map((p) => (
              <li
                key={p.id}
                className="flex items-center gap-3 rounded-md bg-forest/8 px-3 py-2 text-sm text-forest"
              >
                <span className="w-8 font-display font-bold text-moss">#{p.seed}</span>
                <span className="font-medium">{p.name}</span>
              </li>
            ))}
        </ol>
      </section>
    </div>
  )
}
