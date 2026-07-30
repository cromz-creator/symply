import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SYMPTOM_KEYS } from '../data/symptoms'

/**
 * Odabir simptoma iz kontroliranog popisa (toggle chip) + slobodan unos.
 * `value` je polje stringova (ključevi poznatih simptoma ili slobodan tekst).
 */
export default function SymptomPicker({
  value,
  onChange,
}: {
  value: string[]
  onChange: (next: string[]) => void
}) {
  const { t } = useTranslation()
  const [custom, setCustom] = useState('')

  const toggle = (key: string) => {
    onChange(
      value.includes(key) ? value.filter((s) => s !== key) : [...value, key],
    )
  }

  const addCustom = () => {
    const val = custom.trim()
    if (val && !value.includes(val)) onChange([...value, val])
    setCustom('')
  }

  const label = (s: string) =>
    (SYMPTOM_KEYS as readonly string[]).includes(s) ? t(`symptoms.${s}`) : s

  const customSelected = value.filter(
    (s) => !(SYMPTOM_KEYS as readonly string[]).includes(s),
  )

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {SYMPTOM_KEYS.map((key) => {
          const active = value.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => toggle(key)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                active
                  ? 'bg-brand text-brand-contrast'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {t(`symptoms.${key}`)}
            </button>
          )
        })}
      </div>

      {customSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {customSelected.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(s)}
              className="rounded-full bg-brand px-3 py-1.5 text-sm text-brand-contrast"
            >
              {label(s)} ✕
            </button>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addCustom()
            }
          }}
          placeholder={t('diary.customSymptom')}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
        />
        <button
          type="button"
          onClick={addCustom}
          className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
        >
          {t('common.add')}
        </button>
      </div>
    </div>
  )
}
