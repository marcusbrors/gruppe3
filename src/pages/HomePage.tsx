import { Link } from 'react-router-dom'
import { useTournaments } from '../context/TournamentContext'
import { FORMAT_LABELS } from '../types/tournament'
import { progressPercent } from '../lib/tournamentLogic'

export function HomePage() {
  const { tournaments, deleteTournament } = useTournaments()

  return (
    <div>
      <section className="animate-fade-up mb-10">
        <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
          Kjell Games AS
        </p>
        <h1 className="font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Turneringshub
        </h1>
        <p className="mt-3 max-w-xl text-base text-forest/70 sm:text-lg">
          Opprett turneringer med cup, liga, alle mot alle eller swiss stage — og oppdater
          fremdriften underveis.
        </p>
        <div className="mt-6">
          <Link
            to="/ny"
            className="inline-flex rounded-md bg-coral px-5 py-3 text-sm font-semibold text-cream transition hover:bg-amber hover:text-ink"
          >
            Start ny turnering
          </Link>
        </div>
      </section>

      <section className="animate-fade-up-delay-1">
        <h2 className="mb-4 font-display text-lg font-bold text-forest">Dine turneringer</h2>

        {tournaments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-forest/20 bg-white/40 px-6 py-12 text-center">
            <p className="text-forest/60">Ingen turneringer ennå. Lag den første for demoen!</p>
            <Link to="/ny" className="mt-4 inline-block text-sm font-semibold text-moss underline">
              Opprett turnering
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {tournaments.map((t) => {
              const pct = progressPercent(t)
              return (
                <li key={t.id}>
                  <Link
                    to={`/turnering/${t.id}`}
                    className="block rounded-lg border border-forest/10 bg-white/70 p-4 transition hover:border-moss/40 hover:bg-white"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold text-ink">{t.name}</h3>
                        <p className="mt-1 text-sm text-forest/60">
                          {FORMAT_LABELS[t.format]} · {t.players.length} deltakere ·{' '}
                          {t.status === 'completed' ? 'Fullført' : 'Aktiv'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-display text-2xl font-bold text-moss">{pct}%</p>
                        <p className="text-xs text-forest/50">fremdrift</p>
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
                      onClick={() => deleteTournament(t.id)}
                      className="text-xs text-forest/40 transition hover:text-coral"
                    >
                      Slett
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
