import { Link, useParams } from 'react-router-dom'
import { BrandAccentBar } from '../components/BrandDecor'
import { BracketView } from '../components/BracketView'
import { ExportImageButton } from '../components/ExportImageButton'
import { MatchCard } from '../components/MatchCard'
import { PlayerHoverName } from '../components/PlayerHoverName'
import { RoundsView } from '../components/RoundsView'
import { StandingsTable } from '../components/StandingsTable'
import { useLocale } from '../context/LocaleContext'
import { useTournaments } from '../context/TournamentContext'
import {
  getLeaderId,
  progressPercent,
  usesBracket,
  usesStandings,
} from '../lib/tournamentLogic'

export function TournamentDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { getTournament, updateMatchWinner } = useTournaments()
  const { t, formatName } = useLocale()
  const tournament = id ? getTournament(id) : undefined

  if (!tournament) {
    return (
      <div className="animate-fade-up text-center">
        <h1 className="font-display text-2xl font-bold">{t('notFound')}</h1>
        <Link to="/" className="mt-4 inline-block text-moss underline">
          {t('backHome')}
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/" className="text-sm text-forest/50 transition hover:text-forest">
          {t('back')}
        </Link>
        <ExportImageButton tournament={tournament} />
      </div>

      <div className="rounded-2xl border border-forest/10 bg-surface/40 p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-coral">{formatName(tournament.format)}</p>
            <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">
              {tournament.name}
            </h1>
            <BrandAccentBar className="mt-3 max-w-[10rem]" />
            <p className="mt-3 text-forest/60">
              {tournament.players.length} {t('participants')} ·{' '}
              {tournament.status === 'completed' ? t('completed') : t('inProgress')}
              {tournament.format === 'swiss' && tournament.totalRounds
                ? ` · ${tournament.totalRounds} ${t('swissRounds')}`
                : null}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-3xl font-extrabold text-moss">{pct}%</p>
            <p className="text-xs text-forest/50">{t('progress')}</p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-mint">
          <div
            className="h-full rounded-full bg-moss transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {leaderId && (
        <div className="animate-fade-up-delay-1 mt-6 rounded-lg border border-amber/40 bg-amber/15 px-4 py-3">
          <p className="text-sm text-forest/70">
            {tournament.format === 'cup' ? t('winner') : t('leader')}
          </p>
          <p className="font-display text-2xl font-extrabold text-ink">
            <PlayerHoverName tournament={tournament} playerId={leaderId} showSeed={false} />
          </p>
        </div>
      )}

      <p className="mt-8 mb-3 text-sm text-forest/60">
        {t('clickResult')}
        {tournament.format === 'swiss' ? t('swissNext') : null}
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
              {t('table')}
            </h2>
            <StandingsTable tournament={tournament} />
          </div>
        </div>
      ) : null}

      <section className="animate-fade-up-delay-2 mt-10">
        <h2 className="mb-3 font-display text-sm font-bold uppercase tracking-wider text-forest/60">
          {t('seeding')}
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
                <PlayerHoverName
                  tournament={tournament}
                  playerId={p.id}
                  showSeed={false}
                  className="font-medium"
                />
              </li>
            ))}
        </ol>
      </section>
    </div>
  )
}
