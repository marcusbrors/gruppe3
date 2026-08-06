import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDramatic } from '../context/DramaticContext'

/** Fullskjerms dramatisk flash — trigges på hvert knappetrykk. */
export function DramaticTransition() {
  const { dramatic, pulse } = useDramatic()
  const [flash, setFlash] = useState<'on' | 'off' | null>(null)
  const [flashKey, setFlashKey] = useState(0)

  useEffect(() => {
    // Hopp over første mount (pulse === 0) — bare faktiske klikk
    if (pulse === 0) return

    setFlash(dramatic ? 'on' : 'off')
    setFlashKey(pulse)
    const t = window.setTimeout(() => setFlash(null), 900)
    return () => window.clearTimeout(t)
  }, [pulse, dramatic])

  if (!flash) return null

  return createPortal(
    <div
      key={flashKey}
      className={`dramatic-flash dramatic-flash-${flash}`}
      role="status"
      aria-live="polite"
      aria-label={flash === 'on' ? 'Dramatic mode på' : 'Dramatic mode av'}
    >
      <p className="dramatic-flash-text" key={`text-${flashKey}`}>
        {flash === 'on' ? 'DRAMATIC MODE' : 'chill mode'}
      </p>
    </div>,
    document.body,
  )
}
