import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { BrandAccentBar } from '../components/BrandDecor'
import { SeedEditor, sampleEntrants, type DraftEntrant } from '../components/SeedEditor'
import { useLocale } from '../context/LocaleContext'
import { useTournaments } from '../context/TournamentContext'
import { suggestTournamentNames } from '../lib/nameSuggestions'
import type { TournamentFormat } from '../types/tournament'
import { FORMAT_ORDER } from '../types/tournament'

export function CreateTournamentPage() {
  const { addTournament } = useTournaments()
  const { t, formatName, formatDesc, locale } = useLocale()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [format, setFormat] = useState<TournamentFormat>('cup')
  const [entrants, setEntrants] = useState<DraftEntrant[]>(() => sampleEntrants())
  const [suggestions, setSuggestions] = useState(() => suggestTournamentNames(3, 'no'))
  const [error, setError] = useState('')

  useEffect(() => {
    setSuggestions(suggestTournamentNames(3, locale))
  }, [locale])

  const refreshSuggestions = () => setSuggestions(suggestTournamentNames(3, locale))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    setError('')
    const players = entrants.map((p) => p.name.trim()).filter(Boolean)

    try {
      const tournament = addTournament(name || t('demoName'), format, players)
      navigate(`/turnering/${tournament.id}`)
    } catch (err) {
      const msg = err instanceof Error ? err.message : t('somethingWrong')
      setError(msg === 'Trenger minst 2 deltakere' ? t('needPlayers') : msg)
    }
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-up">
      <h1 className="font-display text-3xl font-extrabold text-ink sm:text-4xl">{t('createTitle')}</h1>
      <BrandAccentBar className="mt-3 max-w-[10rem]" />
      <p className="mt-3 text-forest/70">{t('createLead')}</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-semibold text-forest">{t('name')}</span>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
              className="rounded-md border border-forest/15 bg-surface/80 px-3 py-2.5 outline-none ring-moss/30 focus:ring-2"
            />
          </label>
          <div className="rounded-md border border-forest/10 bg-surface/50 p-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-forest/50">
                {t('funnyNames')}
              </p>
              <button
                type="button"
                onClick={refreshSuggestions}
                className="text-xs font-semibold text-coral transition hover:text-amber"
              >
                {t('newSuggestions')}
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
          <legend className="mb-3 text-sm font-semibold text-forest">{t('formatLegend')}</legend>
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
                    <span className="block text-sm font-semibold">{formatName(key)}</span>
                    <span className="mt-0.5 block text-xs leading-snug opacity-80">
                      {formatDesc(key)}
                    </span>
                  </span>
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        <SeedEditor entrants={entrants} onChange={setEntrants} />

        {format === 'cup' && <p className="text-xs text-forest/50">{t('cupHint')}</p>}
        {format === 'swiss' && <p className="text-xs text-forest/50">{t('swissHint')}</p>}

        {error && <p className="text-sm font-medium text-coral">{error}</p>}

        <button
          type="submit"
          className="rounded-md bg-coral px-5 py-3 text-sm font-semibold text-sand transition hover:bg-amber hover:text-sand"
        >
          {t('createStart')}
        </button>
      </form>
    </div>
  )
}
