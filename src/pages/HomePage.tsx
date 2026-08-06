import { Link } from 'react-router-dom'
import { BrandAccentBar, BrandCornerOrnament } from '../components/BrandDecor'
import { useLocale } from '../context/LocaleContext'
import { useTournaments } from '../context/TournamentContext'
import { progressPercent } from '../lib/tournamentLogic'

export function HomePage() {
  const { tournaments, deleteTournament } = useTournaments()
  const { t, formatName } = useLocale()

  return (
    <div>
      <section className="animate-fade-up relative mb-10 overflow-hidden rounded-2xl border border-forest/10 bg-surface/50 px-5 py-8 sm:px-8 sm:py-10">
        <BrandCornerOrnament className="-right-4 -top-4 opacity-80" />
        <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-forest/60">
          Kjell Games AS
        </p>
        <h1 className="max-w-xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          {t('hubTitle')}
        </h1>
        <BrandAccentBar className="mt-4 max-w-[12rem]" />
        <p className="mt-4 max-w-xl text-base text-forest/70 sm:text-lg">{t('hubLead')}</p>
        <div className="mt-6">
          <Link
            to="/ny"
            className="inline-flex rounded-md bg-coral px-5 py-3 text-sm font-semibold text-sand transition hover:bg-amber hover:text-sand"
          >
            {t('startNew')}
          </Link>
        </div>
      </section>

      <section className="animate-fade-up-delay-1">
        <h2 className="mb-4 font-display text-lg font-bold text-forest">{t('yourTournaments')}</h2>

        {tournaments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-forest/20 bg-surface/40 px-6 py-12 text-center">
            <p className="text-forest/60">{t('noTournaments')}</p>
            <Link to="/ny" className="mt-4 inline-block text-sm font-semibold text-moss underline">
              {t('createTournament')}
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {tournaments.map((tour) => {
              const pct = progressPercent(tour)
              return (
                <li key={tour.id}>
                  <Link
                    to={`/turnering/${tour.id}`}
                    className="block rounded-lg border border-forest/10 bg-surface/70 p-4 transition hover:border-coral/40 hover:bg-surface"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink">{tour.name}</h3>
                        <p className="mt-1 text-sm text-forest/60">
                          {formatName(tour.format)} · {tour.players.length} {t('participants')} ·{' '}
                          {tour.status === 'completed' ? t('completed') : t('active')}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl font-bold text-moss">{pct}%</p>
                        <p className="text-xs text-forest/50">{t('progress')}</p>
                      </div>
                    </div>
                    <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-mint">
                      <div
                        className="h-full rounded-full bg-moss transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </Link>
                  <div className="mt-1 flex justify-end">
                    <button
                      type="button"
                      onClick={() => deleteTournament(tour.id)}
                      className="text-xs text-forest/40 transition hover:text-coral"
                    >
                      {t('delete')}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>
    </div>
  )
}
