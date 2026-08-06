import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { useDramatic } from '../context/DramaticContext'

/** Fullskjerms dramatisk flash når dramatic mode toggles. */
export function DramaticTransition() {
  const { dramatic } = useDramatic()
  const [flash, setFlash] = useState<'on' | 'off' | null>(null)
  const [prev, setPrev] = useState(dramatic)

  useEffect(() => {
    if (dramatic === prev) return
    setPrev(dramatic)
    setFlash(dramatic ? 'on' : 'off')
    const t = window.setTimeout(() => setFlash(null), 900)
    return () => window.clearTimeout(t)
  }, [dramatic, prev])

  if (!flash) return null

  return createPortal(
    <div
      className={`dramatic-flash dramatic-flash-${flash}`}
      role="status"
      aria-live="polite"
      aria-label={flash === 'on' ? 'Dramatic mode på' : 'Dramatic mode av'}
    >
      <p className="dramatic-flash-text">
        {flash === 'on' ? 'DRAMATIC MODE' : 'chill mode'}
      </p>
    </div>,
    document.body,
  )
}
