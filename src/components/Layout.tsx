import { Link, Outlet } from 'react-router-dom'
import { useLocale } from '../context/LocaleContext'
import { BrandFooter } from './BrandDecor'
import { DramaticToggle } from './DramaticToggle'
import { ThemeToggle } from './ThemeToggle'

export function Layout() {
  const { t } = useLocale()

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-forest/10 bg-cream/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-4 pr-28 sm:px-6 sm:pr-36">
          <Link to="/" className="group flex min-w-0 items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-ink text-xs font-extrabold text-cream">
              KG
            </span>
            <span className="min-w-0">
              <span className="block font-display text-lg font-extrabold tracking-tight text-forest sm:text-2xl">
                Kjell Games
              </span>
              <span className="block truncate text-[10px] text-forest/50 sm:text-xs">
                {t('tournaments')}
              </span>
            </span>
          </Link>
          <nav className="flex flex-wrap items-center justify-end gap-2 sm:gap-3">
            <DramaticToggle />
            <ThemeToggle />
            <Link
              to="/"
              className="hidden text-sm font-medium text-forest/70 transition hover:text-forest sm:inline"
            >
              {t('overview')}
            </Link>
            <Link
              to="/ny"
              className="rounded-md bg-coral px-3 py-2 text-sm font-semibold text-sand transition hover:bg-amber hover:text-sand"
            >
              {t('newTournament')}
            </Link>
          </nav>
        </div>
      </header>

      <main className="relative mx-auto w-full max-w-5xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>

      <BrandFooter />
    </div>
  )
}
