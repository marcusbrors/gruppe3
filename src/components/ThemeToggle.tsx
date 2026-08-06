import { useTheme } from '../context/ThemeContext'
import { useLocale } from '../context/LocaleContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLocale()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? t('switchToLight') : t('switchToDark')}
      title={isDark ? t('lightMode') : t('darkMode')}
      className="rounded-md border-2 border-forest/30 bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-coral hover:text-coral"
    >
      {isDark ? t('lightMode') : t('darkMode')}
    </button>
  )
}
