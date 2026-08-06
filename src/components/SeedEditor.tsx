import { useState, type FormEvent, type KeyboardEvent } from 'react'
import { shuffleInPlace } from '../lib/seeding'

export interface DraftEntrant {
  key: string
  name: string
}

interface SeedEditorProps {
  entrants: DraftEntrant[]
  onChange: (entrants: DraftEntrant[]) => void
}

function newKey(): string {
  return `e_${Math.random().toString(36).slice(2, 9)}`
}

export function SeedEditor({ entrants, onChange }: SeedEditorProps) {
  const [draftName, setDraftName] = useState('')
  const [bulkOpen, setBulkOpen] = useState(false)
  const [bulkText, setBulkText] = useState('')

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction
    if (target < 0 || target >= entrants.length) return
    const next = [...entrants]
    ;[next[index], next[target]] = [next[target], next[index]]
    onChange(next)
  }

  const remove = (index: number) => {
    onChange(entrants.filter((_, i) => i !== index))
  }

  const rename = (index: number, name: string) => {
    onChange(entrants.map((e, i) => (i === index ? { ...e, name } : e)))
  }

  const addOne = (e?: FormEvent) => {
    e?.preventDefault()
    const name = draftName.trim()
    if (!name) return
    onChange([...entrants, { key: newKey(), name }])
    setDraftName('')
  }

  const onDraftKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addOne()
    }
  }

  const applyBulk = () => {
    const names = bulkText
      .split(/\n|,/)
      .map((n) => n.trim())
      .filter(Boolean)
    if (names.length === 0) return
    onChange(names.map((name) => ({ key: newKey(), name })))
    setBulkOpen(false)
  }

  const shuffleSeeds = () => {
    onChange(shuffleInPlace([...entrants]))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-forest">Deltakere / lag</p>
          <p className="text-xs text-forest/50">
            Rekkefølgen = seeding. Seed 1 er høyest (favoritt).
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={shuffleSeeds}
            disabled={entrants.length < 2}
            className="rounded-md border border-forest/15 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-forest/70 transition hover:border-moss/40 disabled:opacity-40"
          >
            Tilfeldig seed
          </button>
          <button
            type="button"
            onClick={() => {
              setBulkText(entrants.map((e) => e.name).join('\n'))
              setBulkOpen((v) => !v)
            }}
            className="rounded-md border border-forest/15 bg-white/70 px-2.5 py-1.5 text-xs font-medium text-forest/70 transition hover:border-moss/40"
          >
            {bulkOpen ? 'Skjul lim inn' : 'Lim inn liste'}
          </button>
        </div>
      </div>

      {bulkOpen && (
        <div className="rounded-md border border-forest/10 bg-white/50 p-3">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            rows={6}
            placeholder="Én deltaker per linje. Første linje blir seed 1."
            className="w-full rounded-md border border-forest/15 bg-white/80 px-3 py-2 font-mono text-sm outline-none ring-moss/30 focus:ring-2"
          />
          <button
            type="button"
            onClick={applyBulk}
            className="mt-2 rounded-md bg-forest/90 px-3 py-1.5 text-xs font-semibold text-mint"
          >
            Bruk liste (erstatter)
          </button>
        </div>
      )}

      <ul className="flex flex-col gap-1.5">
        {entrants.map((entrant, index) => (
          <li
            key={entrant.key}
            className="flex items-center gap-2 rounded-md border border-forest/10 bg-white/70 px-2 py-1.5"
          >
            <span className="w-10 shrink-0 text-center font-display text-sm font-bold text-moss">
              #{index + 1}
            </span>
            <input
              value={entrant.name}
              onChange={(e) => rename(index, e.target.value)}
              className="min-w-0 flex-1 rounded border border-transparent bg-transparent px-2 py-1 text-sm outline-none focus:border-forest/15 focus:bg-white"
              aria-label={`Seed ${index + 1} navn`}
            />
            <div className="flex shrink-0 gap-1">
              <button
                type="button"
                onClick={() => move(index, -1)}
                disabled={index === 0}
                className="rounded px-2 py-1 text-xs text-forest/60 hover:bg-mint/50 disabled:opacity-30"
                aria-label="Flytt opp (bedre seed)"
                title="Bedre seed"
              >
                ↑
              </button>
              <button
                type="button"
                onClick={() => move(index, 1)}
                disabled={index === entrants.length - 1}
                className="rounded px-2 py-1 text-xs text-forest/60 hover:bg-mint/50 disabled:opacity-30"
                aria-label="Flytt ned (dårligere seed)"
                title="Dårligere seed"
              >
                ↓
              </button>
              <button
                type="button"
                onClick={() => remove(index)}
                className="rounded px-2 py-1 text-xs text-coral/80 hover:bg-coral/10"
                aria-label="Fjern"
              >
                ✕
              </button>
            </div>
          </li>
        ))}
      </ul>

      {entrants.length === 0 && (
        <p className="rounded-md border border-dashed border-forest/20 px-3 py-4 text-center text-sm text-forest/50">
          Legg til minst 2 deltakere eller lag.
        </p>
      )}

      <div className="flex gap-2">
        <input
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onKeyDown={onDraftKey}
          placeholder="Legg til navn / lag…"
          className="min-w-0 flex-1 rounded-md border border-forest/15 bg-white/80 px-3 py-2 text-sm outline-none ring-moss/30 focus:ring-2"
        />
        <button
          type="button"
          onClick={() => addOne()}
          className="rounded-md border border-forest/15 bg-mint/40 px-3 py-2 text-sm font-semibold text-forest transition hover:bg-mint"
        >
          Legg til
        </button>
      </div>
    </div>
  )
}

export function sampleEntrants(): DraftEntrant[] {
  return ['Alex', 'Sam', 'Jordan', 'Casey', 'Riley', 'Morgan', 'Quinn', 'Avery'].map(
    (name) => ({ key: newKey(), name }),
  )
}
