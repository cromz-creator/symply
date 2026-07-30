import { useTranslation } from 'react-i18next'
import type { Language } from '../data/types'
import { INFO_CONTENT } from '../data/info'
import PageHeader from '../components/PageHeader'

export default function Info() {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language as Language) === 'en' ? 'en' : 'hr'
  const sections = INFO_CONTENT[lang]

  return (
    <>
      <PageHeader title={t('info.title')} />
      <div className="space-y-4 p-4">
        {sections.map((section) => (
          <section
            key={section.heading}
            className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
          >
            <h2 className="mb-2 font-semibold text-slate-900">
              {section.heading}
            </h2>
            <div className="space-y-2">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-sm leading-relaxed text-slate-700">
                  {p}
                </p>
              ))}
            </div>
            {section.links && section.links.length > 0 && (
              <div className="mt-3 space-y-1 border-t border-slate-100 pt-3">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t('info.sources')}
                </p>
                {section.links.map((l) => (
                  <a
                    key={l.url}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    className="block text-sm text-brand underline"
                  >
                    {l.label} ↗
                  </a>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>
    </>
  )
}
