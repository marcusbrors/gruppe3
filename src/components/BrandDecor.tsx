import { useLocale } from '../context/LocaleContext'

/** Enkel dekorstripe uten ekstern branding */
export function BrandAccentBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`h-1 w-full overflow-hidden rounded-full bg-forest/15 ${className}`}
      aria-hidden
    >
      <span className="block h-full w-1/3 rounded-full bg-coral" />
    </div>
  )
}

export function BrandCornerOrnament({ className = '' }: { className?: string }) {
  return (
    <div
      className={`pointer-events-none absolute select-none ${className}`}
      aria-hidden
    >
      <div className="relative h-24 w-24">
        <div className="absolute inset-0 rotate-12 rounded-2xl border border-forest/10" />
        <div className="absolute inset-3 -rotate-6 rounded-xl bg-gradient-to-br from-forest/5 to-transparent" />
      </div>
    </div>
  )
}

export function BrandFooter() {
  const { t } = useLocale()

  return (
    <footer className="mt-auto border-t border-forest/10 bg-cream/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-bold text-ink">Kjell Games AS</p>
          <p className="mt-1 text-xs text-forest/55">{t('hubFooter')}</p>
        </div>
        <BrandAccentBar className="w-36" />
      </div>
    </footer>
  )
}
