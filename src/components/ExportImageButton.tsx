import { useState } from 'react'
import type { Tournament } from '../types/tournament'
import { downloadTournamentImage } from '../lib/exportTournamentImage'

export function ExportImageButton({ tournament }: { tournament: Tournament }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onExport = () => {
    setBusy(true)
    setError('')
    try {
      downloadTournamentImage(tournament)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kunne ikke eksportere')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={onExport}
        disabled={busy}
        className="rounded-md border-2 border-forest/30 bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-coral hover:text-coral disabled:opacity-50"
      >
        {busy ? 'Eksporterer…' : 'Eksporter bilde'}
      </button>
      {error && <p className="text-xs text-coral">{error}</p>}
    </div>
  )
}
