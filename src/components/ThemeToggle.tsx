import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={isDark}
      aria-label={isDark ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
      title={isDark ? 'Lys modus' : 'Mørk modus'}
      className="rounded-md border-2 border-forest/30 bg-surface px-3 py-2 text-xs font-semibold text-ink transition hover:border-coral hover:text-coral"
    >
      {isDark ? 'Lys modus' : 'Mørk modus'}
    </button>
  )
}
