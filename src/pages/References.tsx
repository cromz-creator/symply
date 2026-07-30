import { useTranslation } from 'react-i18next'
import type { Language } from '../data/types'
import PageHeader from '../components/PageHeader'
import referencesData from '../data/references.json'

interface Reference {
  id: string
  title: string
  authors: string
  year: number
  journal: string
  url: string
  topic: string
}

interface Claim {
  hr: string
  en: string
  refIds: string[]
}

const TOPIC_ORDER = [
  'overview',
  'mechanisms',
  'symptoms',
  'foodLists',
  'treatment',
]

export default function References() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language as Language) === 'en' ? 'en' : 'hr'
  const refs = referencesData.references as Reference[]
  const claims = referencesData.claims as Claim[]

  const refById = new Map(refs.map((r) => [r.id, r]))
  const byTopic = TOPIC_ORDER.map((topic) => ({
    topic,
    items: refs.filter((r) => r.topic === topic),
  })).filter((g) => g.items.length > 0)

  return (
    <>
      <PageHeader title={t('references.title')} />
      <div className="space-y-6 p-4">
        <p className="text-sm text-slate-600">{t('references.intro')}</p>

        {/* Dokazi uz tvrdnje */}
        <section>
          <h2 className="font-semibold text-slate-900">
            {t('references.claimsTitle')}
          </h2>
          <p className="mb-3 mt-1 text-xs text-slate-500">
            {t('references.claimsIntro')}
          </p>
          <div className="space-y-3">
            {claims.map((c, i) => (
              <div
                key={i}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
              >
                <p className="text-sm text-slate-800">{c[lang]}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {c.refIds.map((rid) => {
                    const r = refById.get(rid)
                    if (!r) return null
                    return (
                      <a
                        key={rid}
                        href={r.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand"
                      >
                        {r.authors.split(',')[0]} {r.year} ↗
                      </a>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Radovi po temama */}
        <section>
          <h2 className="mb-3 font-semibold text-slate-900">
            {t('references.papersTitle')}
          </h2>
          <div className="space-y-4">
            {byTopic.map((group) => (
              <div key={group.topic}>
                <p className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t(`references.topics.${group.topic}`)}
                </p>
                <div className="space-y-2">
                  {group.items.map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100 active:bg-slate-50"
                    >
                      <p className="font-medium text-slate-900">{r.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {r.authors} · {r.journal} · {r.year}
                      </p>
                      <p className="mt-2 text-sm text-brand underline">
                        {t('references.openLink')} ↗
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  )
}
