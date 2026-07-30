import { useState } from 'react'
import { useTranslation } from 'react-i18next'

/**
 * Mala "i" ikonica koja otvara modal s objašnjenjem (naslov + tekst).
 * Koristi se npr. uz "Inhibitor DAO enzima" i "Histamin liberator".
 */
export default function InfoPopover({
  title,
  body,
  label = 'Info',
}: {
  title: string
  body: string
  label?: string
}) {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={(e) => {
          e.preventDefault()
          e.stopPropagation()
          setOpen(true)
        }}
        className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600"
      >
        i
      </button>

      {open && (
        <div
          className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 px-6"
          onClick={() => setOpen(false)}
        >
          <div
            className="max-w-sm rounded-2xl bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="mb-2 text-lg font-semibold text-slate-900">{title}</h3>
            <p className="mb-5 whitespace-pre-line text-sm leading-relaxed text-slate-600">
              {body}
            </p>
            <button
              onClick={() => setOpen(false)}
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
