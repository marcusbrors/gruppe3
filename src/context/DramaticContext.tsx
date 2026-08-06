import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

interface DramaticContextValue {
  dramatic: boolean
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

  useEffect(() => {
    document.documentElement.classList.toggle('dramatic', dramatic)
    localStorage.setItem(STORAGE_KEY, dramatic ? '1' : '0')
  }, [dramatic])

  const toggleDramatic = () => {
    document.documentElement.classList.add('dramatic-transitioning')
    window.setTimeout(() => {
      document.documentElement.classList.remove('dramatic-transitioning')
    }, 900)
    setDramatic((v) => !v)
  }

  return (
    <DramaticContext.Provider value={{ dramatic, toggleDramatic }}>
      {children}
    </DramaticContext.Provider>
  )
}

export function useDramatic() {
  const ctx = useContext(DramaticContext)
  if (!ctx) throw new Error('useDramatic must be used within DramaticProvider')
  return ctx
}
