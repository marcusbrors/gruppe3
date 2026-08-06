import { useDramatic } from '../context/DramaticContext'
import { useLocale } from '../context/LocaleContext'

export function DramaticToggle() {
  const { dramatic, toggleDramatic } = useDramatic()
  const { t } = useLocale()

  return (
    <button
      type="button"
      onClick={toggleDramatic}
      aria-pressed={dramatic}
      aria-label={t('dramaticMode')}
      title={t('dramaticMode')}
      className={[
        'rounded-md border-2 px-3 py-2 text-xs font-semibold transition',
        dramatic
          ? 'border-coral bg-coral/20 text-coral'
          : 'border-forest/30 bg-surface text-ink hover:border-coral hover:text-coral',
      ].join(' ')}
    >
      {t('dramaticMode')}
    </button>
  )
}
