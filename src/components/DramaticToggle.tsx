import { useDramatic } from '../context/DramaticContext'

export function DramaticToggle() {
  const { dramatic, toggleDramatic } = useDramatic()

  return (
    <button
      type="button"
      onClick={toggleDramatic}
      aria-pressed={dramatic}
      aria-label={dramatic ? 'Slå av dramatic mode' : 'Slå på dramatic mode'}
      title="Dramatic mode: STORE BOKSTAVER"
      className={[
        'rounded-md border-2 px-3 py-2 text-xs font-semibold transition',
        dramatic
          ? 'border-coral bg-coral/20 text-coral'
          : 'border-forest/30 bg-surface text-ink hover:border-coral hover:text-coral',
      ].join(' ')}
    >
      Dramatic mode
    </button>
  )
}
