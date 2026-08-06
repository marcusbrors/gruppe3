import { useState } from 'react'
import type { Tournament } from '../types/tournament'
import {
  downloadTournamentImage,
  type ExportContent,
} from '../lib/exportTournamentImage'

const OPTIONS: { value: ExportContent; label: string; hint: string }[] = [
  {
    value: 'both',
    label: 'Begge',
    hint: 'Resultater 1→sist + brackets',
  },
  {
    value: 'standings',
    label: 'Bare resultater',
    hint: 'Plassering fra første til siste',
  },
  {
    value: 'bracket',
    label: 'Bare brackets',
    hint: 'Kampoppsett / runder',
  },
]

export function ExportImageButton({ tournament }: { tournament: Tournament }) {
  const [open, setOpen] = useState(false)
  const [content, setContent] = useState<ExportContent>('both')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onExport = () => {
    setBusy(true)
    setError('')
    try {
      downloadTournamentImage(tournament, { content })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke eksportere')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="relative flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border-2 border-forest/30 bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-coral hover:text-coral"
        aria-expanded={open}
      >
        Eksporter bilde
      </button>

      {open && (
        <div className="absolute right-0 top-full z-40 mt-2 w-72 rounded-lg border border-forest/15 bg-cream p-3 shadow-xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-forest/50">
            Hva skal med i bildet?
          </p>
          <div className="flex flex-col gap-2">
            {OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={[
                  'cursor-pointer rounded-md border px-3 py-2 transition',
                  content === opt.value
                    ? 'border-coral bg-coral/10'
                    : 'border-forest/15 bg-surface/60 hover:border-coral/40',
                ].join(' ')}
              >
                <span className="flex items-start gap-2">
                  <input
                    type="radio"
                    name="export-content"
                    value={opt.value}
                    checked={content === opt.value}
                    onChange={() => setContent(opt.value)}
                    className="mt-1 accent-coral"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-ink">{opt.label}</span>
                    <span className="block text-xs text-forest/60">{opt.hint}</span>
                  </span>
                </span>
              </label>
            ))}
          </div>

          {error && <p className="mt-2 text-xs text-coral">{error}</p>}

          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-md px-3 py-1.5 text-xs font-semibold text-forest/70 hover:text-ink"
            >
              Avbryt
            </button>
            <button
              type="button"
              onClick={onExport}
              disabled={busy}
              className="rounded-md bg-coral px-3 py-1.5 text-xs font-semibold text-sand transition hover:bg-amber hover:text-sand disabled:opacity-50"
            >
              {busy ? 'Lager…' : 'Last ned PNG'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
