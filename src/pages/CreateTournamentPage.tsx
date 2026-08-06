import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { SeedEditor, sampleEntrants, type DraftEntrant } from '../components/SeedEditor'
import { useTournaments } from '../context/TournamentContext'
import type { TournamentFormat } from '../types/tournament'
import { FORMAT_DESCRIPTIONS, FORMAT_LABELS, FORMAT_ORDER } from '../types/tournament'

export function CreateTournamentPage() {
  const { addTournament } = useTournaments()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [format, setFormat] = useState<TournamentFormat>('cup')
  const [entrants, setEntrants] = useState<DraftEntrant[]>(() => sampleEntrants())
  const [error, setError] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const players = entrants.map((p) => p.name.trim()).filter(Boolean)

    try {
      const t = addTournament(name || 'Demo-turnering', format, players)
      navigate(`/turnering/${t.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Noe gikk galt')
    }
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">Ny turnering</h1>
      <p className="mt-2 text-forest/70">
        Velg oppsett, seed deltakere/lag — så genereres kamper automatisk.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-semibold text-forest">Navn</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="f.eks. Fredags-cup"
            className="rounded-md border border-forest/15 bg-white/80 px-3 py-2.5 outline-none ring-moss/30 focus:ring-2"
          />
        </label>

        <fieldset>
          <legend className="mb-3 text-sm font-semibold text-forest">Turneringsoppsett</legend>
          <div className="grid gap-2 sm:grid-cols-2">
            {FORMAT_ORDER.map((key) => (
              <label
                key={key}
                className={[
                  'cursor-pointer rounded-md border px-3 py-3 transition',
                  format === key
                    ? 'border-moss bg-mint/50 text-forest'
                    : 'border-forest/15 bg-white/60 text-forest/70 hover:border-moss/40',
                ].join(' ')}
              >
                <span className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="format"
                    value={key}
                    checked={format === key}
                    onChange={() => setFormat(key)}
                    className="mt-1 accent-moss"
                  />
                  <span>
                    <span className="block text-sm font-semibold">{FORMAT_LABELS[key]}</span>
                    <span className="mt-0.5 block text-xs leading-snug opacity-80">
                      {FORMAT_DESCRIPTIONS[key]}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <SeedEditor entrants={entrants} onChange={setEntrants} />

        {format === 'cup' && (
          <p className="text-xs text-forest/50">
            Cup: seed 1 møter laveste seed tidligst mulig, og topseeds møtes tidligst i finalen.
          </p>
        )}
        {format === 'swiss' && (
          <p className="text-xs text-forest/50">
            Swiss: seed brukes i runde 1 og som tiebreaker ved lik score.
          </p>
        )}

        {error && <p className="text-sm font-medium text-coral">{error}</p>}

        <button
          type="submit"
          className="rounded-md bg-forest px-5 py-3 text-sm font-semibold text-mint transition hover:bg-moss"
        >
          Opprett og start
        </button>
      </form>
    </div>
  )
}
