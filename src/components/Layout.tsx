import { Link, Outlet } from 'react-router-dom'

export function Layout() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-forest/10 bg-cream/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="group flex items-baseline gap-2">
            <span className="font-display text-xl font-extrabold tracking-tight text-forest sm:text-2xl">
              Kjell Games
            </span>
            <span className="hidden text-sm text-forest/50 sm:inline">Turneringer</span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm font-medium text-forest/70 transition hover:text-forest"
            >
              Oversikt
            </Link>
            <Link
              to="/ny"
              className="rounded-md bg-forest px-3 py-2 text-sm font-semibold text-mint transition hover:bg-moss"
            >
              Ny turnering
            </Link>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        <Outlet />
      </main>
    </div>
  )
}
