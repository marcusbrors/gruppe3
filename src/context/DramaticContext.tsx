import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react'

interface DramaticContextValue {
  dramatic: boolean
  /** Øker hver gang knappen trykkes — brukes for å restarte animasjon */
  pulse: number
  toggleDramatic: () => void
}

const STORAGE_KEY = 'kjell-games-dramatic'
const DramaticContext = createContext<DramaticContextValue | null>(null)

export function DramaticProvider({ children }: { children: ReactNode }) {
  const [dramatic, setDramatic] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1'
    } catch {
      return false
    }
  })
  const [pulse, setPulse] = useState(0)
  const transitionTimer = useRef<number | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle('dramatic', dramatic)
    localStorage.setItem(STORAGE_KEY, dramatic ? '1' : '0')
  }, [dramatic])

  const toggleDramatic = () => {
    // Tving CSS-animasjon til å restarte hver gang
    const root = document.documentElement
    root.classList.remove('dramatic-transitioning')
    // force reflow
    void root.offsetWidth
    root.classList.add('dramatic-transitioning')

    if (transitionTimer.current) window.clearTimeout(transitionTimer.current)
    transitionTimer.current = window.setTimeout(() => {
      root.classList.remove('dramatic-transitioning')
    }, 900)

    setPulse((p) => p + 1)
    setDramatic((v) => !v)
  }

  return (
    <DramaticContext.Provider value={{ dramatic, pulse, toggleDramatic }}>
      {children}
    </DramaticContext.Provider>
  )
}

export function useDramatic() {
  const ctx = useContext(DramaticContext)
  if (!ctx) throw new Error('useDramatic must be used within DramaticProvider')
  return ctx
}
