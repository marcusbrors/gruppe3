import { SopraLogo } from './SopraLogo'

/** Dekorativ oransje/navy-stripe i Sopra-stil */
export function BrandAccentBar({ className = '' }: { className?: string }) {
  return (
    <div
      className={`flex h-1.5 w-full overflow-hidden rounded-full ${className}`}
      aria-hidden
    >
      <span className="w-[18%] bg-[#DE1823]" />
      <span className="w-[28%] bg-[#F67200]" />
      <span className="flex-1 bg-[#0a1628] dark:bg-[#9db7e0]/40" />
    </div>
  )
}

export function BrandPartnerBadge({ className = '' }: { className?: string }) {
  return (
    <div
      className={`inline-flex items-center gap-3 rounded-md border border-forest/10 bg-surface/70 px-3 py-2 ${className}`}
    >
      <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-forest/45">
        Partner
      </span>
      <SopraLogo className="h-4 w-auto text-ink sm:h-5" />
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
        <div className="absolute inset-0 rotate-12 rounded-2xl border border-coral/25" />
        <div className="absolute inset-3 -rotate-6 rounded-xl bg-gradient-to-br from-[#F67200]/25 to-[#0a1628]/10 dark:to-[#9db7e0]/15" />
        <div className="absolute bottom-3 right-3 h-3 w-3 rounded-sm bg-[#DE1823]" />
      </div>
    </div>
  )
}

export function BrandFooter() {
  return (
    <footer className="mt-auto border-t border-forest/10 bg-cream/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-sm font-bold text-ink">Kjell Games AS</p>
          <p className="mt-1 text-xs text-forest/55">
            Turneringsplattform utviklet i samarbeid med Sopra Steria
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 sm:items-end">
          <SopraLogo className="h-5 w-auto text-ink opacity-90" />
          <BrandAccentBar className="w-40" />
        </div>
      </div>
    </footer>
  )
}
