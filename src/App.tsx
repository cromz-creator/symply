import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ensureSeeded } from './data/seed/seed'
import { useSettings } from './hooks/useSettings'
import { acceptDisclaimer } from './data/repositories/settings'
import TabBar from './components/TabBar'

export default function App() {
  const settings = useSettings()
  const { i18n } = useTranslation()

  // Napuni bazu seed namirnicama pri prvom pokretanju.
  useEffect(() => {
    ensureSeeded()
  }, [])

  // Sinkroniziraj jezik sučelja s postavkama.
  useEffect(() => {
    if (settings && i18n.language !== settings.language) {
      i18n.changeLanguage(settings.language)
    }
  }, [settings, i18n])

  if (!settings) {
    return <div className="min-h-full" />
  }

  if (!settings.disclaimerAccepted) {
    return <DisclaimerGate />
  }

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col">
      <main className="flex-1 pb-24">
        <Outlet />
      </main>
      <TabBar />
    </div>
  )
}

function DisclaimerGate() {
  const { t } = useTranslation()
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col justify-center px-6 py-10">
      <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
        <div className="mb-3 text-3xl">⚠️</div>
        <h1 className="mb-3 text-xl font-semibold text-slate-900">
          {t('disclaimer.title')}
        </h1>
        <p className="mb-6 text-sm leading-relaxed text-slate-600">
          {t('disclaimer.body')}
        </p>
        <button
          onClick={() => acceptDisclaimer()}
          className="w-full rounded-xl bg-brand px-4 py-3 font-medium text-brand-contrast active:opacity-90"
        >
          {t('disclaimer.accept')}
        </button>
      </div>
    </div>
  )
}
