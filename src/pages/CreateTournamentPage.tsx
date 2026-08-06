import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandAccentBar } from '../components/BrandDecor'
import { SeedEditor, sampleEntrants, type DraftEntrant } from '../components/SeedEditor'
import { useTournaments } from '../context/TournamentContext'
import { suggestTournamentNames } from '../lib/nameSuggestions'
import type { TournamentFormat } from '../types/tournament'
import { FORMAT_DESCRIPTIONS, FORMAT_LABELS, FORMAT_ORDER } from '../types/tournament'

export function CreateTournamentPage() {
  const { addTournament } = useTournaments()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [format, setFormat] = useState<TournamentFormat>('cup')
  const [entrants, setEntrants] = useState<DraftEntrant[]>(() => sampleEntrants())
  const [suggestions, setSuggestions] = useState(() => suggestTournamentNames(3))
  const [error, setError] = useState('')

  const refreshSuggestions = () => setSuggestions(suggestTournamentNames(3))

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
      <BrandAccentBar className="mt-3 max-w-[10rem]" />
      <p className="mt-3 text-forest/70">
        Velg oppsett, seed deltakere/lag — så genereres kamper automatisk.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-forest">Navn</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="f.eks. Fredags-cup"
              className="rounded-md border border-forest/15 bg-surface/80 px-3 py-2.5 outline-none ring-moss/30 focus:ring-2"
            />
          </label>
          <div className="rounded-md border border-forest/10 bg-surface/50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest/50">
                Morsomme navneforslag
              </p>
              <button
                type="button"
                onClick={refreshSuggestions}
                className="text-xs font-semibold text-coral transition hover:text-amber"
              >
                Nye forslag
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => setName(suggestion)}
                  className="rounded-md border border-forest/15 bg-cream px-2.5 py-1.5 text-left text-xs font-medium text-ink transition hover:border-coral/50 hover:bg-coral/10"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>

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
                    : 'border-forest/15 bg-surface/60 text-forest/70 hover:border-moss/40',
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
          className="rounded-md bg-coral px-5 py-3 text-sm font-semibold text-sand transition hover:bg-amber hover:text-sand"
        >
          Opprett og start
        </button>
      </form>
    </div>
  )
}
