import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import {
  formatDescription,
  formatLabel,
  localizedRoundLabel,
  translate,
  type Locale,
} from '../i18n/translations'
import type { TournamentFormat } from '../types/tournament'

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: string, vars?: Record<string, string | number>) => string
  formatName: (format: TournamentFormat) => string
  formatDesc: (format: TournamentFormat) => string
  roundName: (format: TournamentFormat, round: number, totalRounds: number) => string
}

const STORAGE_KEY = 'kjell-games-locale'
const LocaleContext = createContext<LocaleContextValue | null>(null)

function getInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'no' || saved === 'en') return saved
  } catch {
    /* ignore */
  }
  return 'no'
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getInitialLocale)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, locale)
    document.documentElement.lang = locale === 'no' ? 'nb' : 'en'
  }, [locale])

  const setLocale = (next: Locale) => setLocaleState(next)

  const value: LocaleContextValue = {
    locale,
    setLocale,
    t: (key, vars) => translate(locale, key, vars),
    formatName: (format) => formatLabel(locale, format),
    formatDesc: (format) => formatDescription(locale, format),
    roundName: (format, round, totalRounds) =>
      localizedRoundLabel(locale, format, round, totalRounds),
  }

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
}

export function useLocale() {
  const ctx = useContext(LocaleContext)
  if (!ctx) throw new Error('useLocale must be used within LocaleProvider')
  return ctx
}
