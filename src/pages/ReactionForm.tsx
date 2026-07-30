import { useMemo, useState, type ReactNode } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import type { Language, Severity } from '../data/types'
import { foodName } from '../lib/foodName'
import { riskMechanisms } from '../lib/foodRisk'
import { severityColor } from '../lib/severity'
import { addReaction } from '../data/repositories/reactions'
import PageHeader from '../components/PageHeader'
import SymptomPicker from '../components/SymptomPicker'

type DelayUnit = 'min' | 'h'

/** Lokalno datetime u formatu za <input type="datetime-local">. */
function nowLocal(): string {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 16)
}

export default function ReactionForm() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const [params] = useSearchParams()

  const foods = useLiveQuery(() => db.foods.toArray(), [])

  const [date, setDate] = useState(nowLocal())
  const [mealName, setMealName] = useState('')
  const [foodIds, setFoodIds] = useState<string[]>(() => {
    const pre = params.get('food')
    return pre ? [pre] : []
  })
  const [freeIngredients, setFreeIngredients] = useState<string[]>([])
  const [freeInput, setFreeInput] = useState('')
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [severity, setSeverity] = useState<Severity>(3)
  const [delay, setDelay] = useState('')
  const [delayUnit, setDelayUnit] = useState<DelayUnit>('min')
  const [notes, setNotes] = useState('')
  const [foodQuery, setFoodQuery] = useState('')

  const sortedFoods = useMemo(() => {
    const q = foodQuery.trim().toLowerCase()
    return (foods ?? [])
      .filter((f) =>
        q ? `${f.nameHr} ${f.nameEn}`.toLowerCase().includes(q) : true,
      )
      .sort((a, b) => foodName(a, lang).localeCompare(foodName(b, lang)))
  }, [foods, foodQuery, lang])

  const toggleFood = (idv: string) =>
    setFoodIds((prev) =>
      prev.includes(idv) ? prev.filter((x) => x !== idv) : [...prev, idv],
    )

  const addFree = () => {
    const v = freeInput.trim()
    if (v && !freeIngredients.includes(v)) setFreeIngredients((p) => [...p, v])
    setFreeInput('')
  }

  const submit = async () => {
    const raw = delay.trim() ? Number(delay) : undefined
    const delayMinutes =
      raw != null && !Number.isNaN(raw)
        ? delayUnit === 'h'
          ? raw * 60
          : raw
        : undefined
    await addReaction({
      date: new Date(date).toISOString(),
      mealName: mealName.trim() || undefined,
      foodIds,
      freeIngredients: freeIngredients.length ? freeIngredients : undefined,
      symptoms,
      severity,
      delayMinutes,
      notes: notes.trim() || undefined,
    })
    navigate('/diary')
  }

  const foodMap = new Map((foods ?? []).map((f) => [f.id, f]))

  return (
    <>
      <PageHeader title={t('diary.add')} back />
      <div className="space-y-5 p-4">
        <Field label={t('diary.mealName')}>
          <input
            value={mealName}
            onChange={(e) => setMealName(e.target.value)}
            placeholder={t('diary.mealNamePlaceholder')}
            className="input"
          />
        </Field>

        <Field label={t('diary.when')}>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input"
          />
        </Field>

        <div>
          <p className="text-sm font-medium text-slate-700">
            {t('diary.ingredients')}
          </p>
          <p className="mb-2 text-xs text-slate-500">{t('diary.ingredientsHint')}</p>

          {(foodIds.length > 0 || freeIngredients.length > 0) && (
            <div className="mb-2 flex flex-wrap gap-1">
              {foodIds.map((fid) => {
                const f = foodMap.get(fid)
                const risky = f ? riskMechanisms(f).length > 0 : false
                return (
                  <button
                    key={fid}
                    onClick={() => toggleFood(fid)}
                    className={`rounded-full px-3 py-1 text-sm ${
                      risky
                        ? 'bg-rose-600 text-white'
                        : 'bg-brand text-brand-contrast'
                    }`}
                  >
                    {f ? foodName(f, lang) : '—'} ✕
                  </button>
                )
              })}
              {freeIngredients.map((s) => (
                <button
                  key={s}
                  onClick={() =>
                    setFreeIngredients((p) => p.filter((x) => x !== s))
                  }
                  className="rounded-full bg-slate-200 px-3 py-1 text-sm text-slate-700"
                >
                  {s} ✕
                </button>
              ))}
            </div>
          )}

          <input
            value={foodQuery}
            onChange={(e) => setFoodQuery(e.target.value)}
            placeholder={t('foods.searchPlaceholder')}
            className="input mb-2"
          />
          <div className="max-h-56 overflow-y-auto rounded-xl border border-slate-200 bg-white">
            {sortedFoods.map((f) => {
              const mechs = riskMechanisms(f)
              return (
                <label
                  key={f.id}
                  className="flex cursor-pointer items-center gap-3 border-b border-slate-100 px-3 py-2 last:border-0"
                >
                  <input
                    type="checkbox"
                    checked={foodIds.includes(f.id)}
                    onChange={() => toggleFood(f.id)}
                    className="h-4 w-4 rounded border-slate-300 text-brand"
                  />
                  <span className="flex-1 text-sm text-slate-800">
                    {foodName(f, lang)}
                  </span>
                  {mechs.length > 0 && (
                    <span className="flex gap-1">
                      {mechs.map((m) => (
                        <span
                          key={m}
                          className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700"
                        >
                          {m}
                        </span>
                      ))}
                    </span>
                  )}
                </label>
              )
            })}
          </div>

          {/* Slobodan unos sastojka koji nije u bazi */}
          <div className="mt-2 flex gap-2">
            <input
              value={freeInput}
              onChange={(e) => setFreeInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  addFree()
                }
              }}
              placeholder={t('diary.customIngredient')}
              className="input flex-1"
            />
            <button
              type="button"
              onClick={addFree}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
            >
              {t('common.add')}
            </button>
          </div>
        </div>

        <div>
          <p className="mb-2 text-sm font-medium text-slate-700">
            {t('diary.symptoms')}
          </p>
          <SymptomPicker value={symptoms} onChange={setSymptoms} />
        </div>

        <Field label={`${t('diary.severity')}: ${t(`severity.${severity}`)}`}>
          <input
            type="range"
            min={1}
            max={5}
            value={severity}
            onChange={(e) => setSeverity(Number(e.target.value) as Severity)}
            className="w-full"
            style={{ accentColor: severityColor(severity) }}
          />
          <div className="mt-2 flex gap-1">
            {([1, 2, 3, 4, 5] as Severity[]).map((i) => (
              <span
                key={i}
                className="h-2 flex-1 rounded-full"
                style={{
                  backgroundColor: i <= severity ? severityColor(i) : '#e2e8f0',
                }}
              />
            ))}
          </div>
        </Field>

        <Field label={`${t('diary.delay')} (${t('common.optional')})`}>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              value={delay}
              onChange={(e) => setDelay(e.target.value)}
              className="input w-28"
            />
            <div className="flex overflow-hidden rounded-lg ring-1 ring-slate-300">
              {(['min', 'h'] as DelayUnit[]).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setDelayUnit(u)}
                  className={`px-3 py-2 text-sm font-medium ${
                    delayUnit === u
                      ? 'bg-brand text-brand-contrast'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  {t(`diary.unit${u === 'min' ? 'Min' : 'Hour'}`)}
                </button>
              ))}
            </div>
          </div>
        </Field>

        <Field label={`${t('diary.notes')} (${t('common.optional')})`}>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="input resize-none"
          />
        </Field>

        <button
          onClick={submit}
          className="w-full rounded-xl bg-brand py-3 font-medium text-brand-contrast"
        >
          {t('common.save')}
        </button>
      </div>
    </>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </span>
      {children}
    </label>
  )
}
