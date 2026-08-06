import { useTheme } from '../context/ThemeContext'

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="rounded-md border border-forest/15 bg-surface/80 px-2.5 py-2 text-xs font-semibold text-forest transition hover:border-coral/50 hover:text-coral"
      aria-label={isDark ? 'Bytt til lys modus' : 'Bytt til mørk modus'}
      title={isDark ? 'Lys modus' : 'Dark mode (Sopra Steria)'}
    >
      {isDark ? 'Lys' : 'Mørk'}
    </button>
  )
}
