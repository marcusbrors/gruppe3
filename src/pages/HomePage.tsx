import { Link } from 'react-router-dom'
import { BrandAccentBar, BrandCornerOrnament, BrandPartnerBadge } from '../components/BrandDecor'
import { SopraLogo } from '../components/SopraLogo'
import { useTournaments } from '../context/TournamentContext'
import { FORMAT_LABELS } from '../types/tournament'
import { progressPercent } from '../lib/tournamentLogic'

export function HomePage() {
  const { tournaments, deleteTournament } = useTournaments()

  return (
    <div>
      <section className="animate-fade-up relative mb-10 overflow-hidden rounded-2xl border border-forest/10 bg-surface/50 px-5 py-8 sm:px-8 sm:py-10">
        <BrandCornerOrnament className="-right-4 -top-4 opacity-80" />
        <BrandPartnerBadge className="mb-5" />
        <p className="mb-2 font-display text-sm font-bold uppercase tracking-[0.2em] text-coral">
          Kjell Games AS
        </p>
        <h1 className="max-w-xl font-display text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Turneringshub
        </h1>
        <BrandAccentBar className="mt-4 max-w-[12rem]" />
        <p className="mt-4 max-w-xl text-base text-forest/70 sm:text-lg">
          Opprett turneringer med cup, liga, alle mot alle eller swiss stage — og oppdater
          fremdriften underveis. Bygget med Sopra Steria-design.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-4">
          <Link
            to="/ny"
            className="inline-flex rounded-md bg-coral px-5 py-3 text-sm font-semibold text-sand transition hover:bg-amber hover:text-ink"
          >
            Start ny turnering
          </Link>
          <SopraLogo className="h-5 w-auto text-ink/70" />
        </div>
      </section>

      <section className="animate-fade-up-delay-1">
        <div className="mb-4 flex items-end justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-forest">Dine turneringer</h2>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-coral/80">
            Sopra Live Ops
          </span>
        </div>

        {tournaments.length === 0 ? (
          <div className="rounded-lg border border-dashed border-forest/20 bg-surface/40 px-6 py-12 text-center">
            <SopraLogo className="mx-auto mb-4 h-5 w-auto text-ink/50" />
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
                    className="block overflow-hidden rounded-lg border border-forest/10 bg-surface/70 transition hover:border-coral/40 hover:bg-surface"
                  >
                    <BrandAccentBar className="rounded-none opacity-80" />
                    <div className="p-4">
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
