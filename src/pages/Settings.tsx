import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import type { Language } from '../data/types'
import { useSettings } from '../hooks/useSettings'
import { setLanguage } from '../data/repositories/settings'
import PageHeader from '../components/PageHeader'

export default function Settings() {
  const { t } = useTranslation()
  const settings = useSettings()
  const [showDisclaimer, setShowDisclaimer] = useState(false)

  const langs: { code: Language; label: string }[] = [
    { code: 'hr', label: t('settings.croatian') },
    { code: 'en', label: t('settings.english') },
  ]

  return (
    <>
      <PageHeader title={t('settings.title')} />
      <div className="space-y-6 p-4">
        <section>
          <h2 className="mb-2 px-1 text-sm font-medium text-slate-500">
            {t('settings.language')}
          </h2>
          <div className="flex gap-2">
            {langs.map((l) => (
              <button
                key={l.code}
                onClick={() => setLanguage(l.code)}
                className={`flex-1 rounded-xl py-3 text-sm font-medium ring-1 ${
                  settings?.language === l.code
                    ? 'bg-brand text-brand-contrast ring-brand'
                    : 'bg-white text-slate-700 ring-slate-200'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-2 px-1 text-sm font-medium text-slate-500">
            {t('settings.about')}
          </h2>
          <div className="rounded-2xl bg-white p-4 text-sm text-slate-600 shadow-sm ring-1 ring-slate-100">
            {t('settings.aboutText')}
          </div>
        </section>

        <button
          onClick={() => setShowDisclaimer(true)}
          className="w-full rounded-xl bg-white py-3 text-sm font-medium text-brand ring-1 ring-slate-200"
        >
          {t('settings.showDisclaimer')}
        </button>
      </div>

      {showDisclaimer && (
        <div className="fixed inset-0 z-20 flex items-center justify-center bg-black/40 px-6">
          <div className="max-w-sm rounded-2xl bg-white p-6 shadow-lg">
            <h3 className="mb-2 text-lg font-semibold text-slate-900">
              {t('disclaimer.title')}
            </h3>
            <p className="mb-5 text-sm leading-relaxed text-slate-600">
              {t('disclaimer.body')}
            </p>
            <button
              onClick={() => setShowDisclaimer(false)}
              className="w-full rounded-xl bg-brand py-2.5 text-sm font-medium text-brand-contrast"
            >
              {t('common.close')}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
