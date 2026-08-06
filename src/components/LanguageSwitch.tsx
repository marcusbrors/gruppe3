import { useLocale } from '../context/LocaleContext'
import type { Locale } from '../i18n/translations'

function FlagNO({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 16" aria-hidden>
      <rect width="22" height="16" fill="#BA0C2F" />
      <rect x="6" width="4" height="16" fill="#fff" />
      <rect y="6" width="22" height="4" fill="#fff" />
      <rect x="7" width="2" height="16" fill="#00205B" />
      <rect y="7" width="22" height="2" fill="#00205B" />
    </svg>
  )
}

function FlagGB({ className = 'h-3.5 w-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 22 16" aria-hidden>
      <rect width="22" height="16" fill="#012169" />
      <path d="M0 0 L22 16 M22 0 L0 16" stroke="#fff" strokeWidth="3" />
      <path d="M0 0 L22 16 M22 0 L0 16" stroke="#C8102E" strokeWidth="1.5" />
      <rect x="9" width="4" height="16" fill="#fff" />
      <rect y="6" width="22" height="4" fill="#fff" />
      <rect x="10" width="2" height="16" fill="#C8102E" />
      <rect y="7" width="22" height="2" fill="#C8102E" />
    </svg>
  )
}

const OPTIONS: { locale: Locale; code: string; Flag: typeof FlagNO }[] = [
  { locale: 'no', code: 'NO', Flag: FlagNO },
  { locale: 'en', code: 'EN', Flag: FlagGB },
]

/** Fast i hjørnet — språkbytte for hele appen. */
export function LanguageSwitch() {
  const { locale, setLocale, t } = useLocale()

  return (
    <div
      className="fixed right-3 top-3 z-[60] flex overflow-hidden rounded-full border border-forest/20 bg-cream/95 shadow-lg backdrop-blur-md sm:right-5 sm:top-4"
      role="group"
      aria-label="Language"
    >
      {OPTIONS.map(({ locale: code, code: label, Flag }) => {
        const active = locale === code
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLocale(code)}
            aria-pressed={active}
            aria-label={code === 'no' ? t('langNo') : t('langEn')}
            title={code === 'no' ? t('langNo') : t('langEn')}
            className={[
              'flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold transition',
              active
                ? 'bg-ink text-cream'
                : 'text-forest/70 hover:bg-surface hover:text-ink',
            ].join(' ')}
          >
            <Flag />
            <span>{label}</span>
          </button>
        )
      })}
    </div>
  )
}
