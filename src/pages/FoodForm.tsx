import { useEffect, useState, type ReactNode } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { db } from '../data/db'
import type { HistamineLevel, Language, Tolerance } from '../data/types'
import { CATEGORY_KEYS } from '../data/categories'
import { TOLERANCES, toleranceChip } from '../lib/tolerance'
import { addCustomFood, updateFood } from '../data/repositories/foods'
import PageHeader from '../components/PageHeader'
import InfoPopover from '../components/InfoPopover'

// Vrijednost "unknown" u selectu za razinu histamina mapira se na null.
type LevelValue = HistamineLevel | 'unknown'

export default function FoodForm() {
  const { id } = useParams()
  const isEdit = Boolean(id)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const [name, setName] = useState('')
  const [nameLang, setNameLang] = useState<Language>('hr')
  const [category, setCategory] = useState<string>('other')
  const [level, setLevel] = useState<LevelValue>('unknown')
  const [isDaoInhibitor, setIsDao] = useState(false)
  const [isHistamineLiberator, setIsLib] = useState(false)
  const [tolerance, setTol] = useState<Tolerance>('yellow')
  const [freshnessNote, setFreshness] = useState('')
  const [generalNotes, setNotes] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!id) return
    db.foods.get(id).then((f) => {
      if (!f) return
      // Odaberi jezik naziva prema tome koji je popunjen.
      if (f.nameHr) {
        setNameLang('hr')
        setName(f.nameHr)
      } else {
        setNameLang('en')
        setName(f.nameEn)
      }
      setCategory(f.category)
      setLevel(f.histamineLevel === null ? 'unknown' : f.histamineLevel)
      setIsDao(f.isDaoInhibitor)
      setIsLib(f.isHistamineLiberator)
      setTol(f.tolerance)
      setFreshness(f.freshnessNote ?? '')
      setNotes(f.generalNotes ?? '')
    })
  }, [id])

  const submit = async () => {
    const trimmed = name.trim()
    if (!trimmed) {
      setError(t('foodForm.required'))
      return
    }
    const histamineLevel: HistamineLevel | null =
      level === 'unknown' ? null : level
    const data = {
      nameHr: nameLang === 'hr' ? trimmed : '',
      nameEn: nameLang === 'en' ? trimmed : '',
      category,
      histamineLevel,
      isDaoInhibitor,
      isHistamineLiberator,
      tolerance,
      freshnessNote: freshnessNote.trim() || undefined,
      generalNotes: generalNotes.trim() || undefined,
    }
    if (isEdit && id) {
      await updateFood(id, data)
      navigate(`/foods/${id}`)
    } else {
      const newIdVal = await addCustomFood(data)
      navigate(`/foods/${newIdVal}`)
    }
  }

  const levelOptions: LevelValue[] = ['unknown', 0, 1, 2, 3]
  const levelLabel = (l: LevelValue) =>
    l === 'unknown' ? t('histamineLevel.unknown') : t(`histamineLevel.${l}`)

  return (
    <>
      <PageHeader
        title={isEdit ? t('foodForm.titleEdit') : t('foodForm.titleNew')}
        back
      />
      <div className="space-y-4 p-4">
        <Field label={t('foodForm.name')}>
          <div className="flex gap-2">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('foodForm.namePlaceholder')}
              className="input flex-1"
            />
            <div className="flex overflow-hidden rounded-lg ring-1 ring-slate-300">
              {(['hr', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setNameLang(l)}
                  className={`px-3 py-2 text-sm font-medium uppercase ${
                    nameLang === l
                      ? 'bg-brand text-brand-contrast'
                      : 'bg-white text-slate-600'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>
        </Field>

        <Field label={t('category.label')}>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="input"
          >
            {CATEGORY_KEYS.map((c) => (
              <option key={c} value={c}>
                {t(`category.${c}`)}
              </option>
            ))}
          </select>
        </Field>

        <Field label={t('histamineLevel.label')}>
          <select
            value={String(level)}
            onChange={(e) => {
              const v = e.target.value
              setLevel(v === 'unknown' ? 'unknown' : (Number(v) as HistamineLevel))
            }}
            className="input"
          >
            {levelOptions.map((l) => (
              <option key={String(l)} value={String(l)}>
                {levelLabel(l)}
              </option>
            ))}
          </select>
          {level === 'unknown' && (
            <p className="mt-1 text-xs text-slate-500">
              {t('foodForm.unknownHint')}
            </p>
          )}
        </Field>

        <div className="space-y-3 rounded-xl bg-white p-3 ring-1 ring-slate-100">
          <CheckboxWithInfo
            checked={isDaoInhibitor}
            onChange={setIsDao}
            label={t('mechanism.daoFull')}
            infoTitle={t('mechanism.daoFull')}
            infoBody={t('mechanism.daoExplain')}
          />
          <CheckboxWithInfo
            checked={isHistamineLiberator}
            onChange={setIsLib}
            label={t('mechanism.liberatorFull')}
            infoTitle={t('mechanism.liberatorFull')}
            infoBody={t('mechanism.liberatorExplain')}
          />
        </div>

        <Field label={t('tolerance.label')}>
          <div className="flex gap-2">
            {TOLERANCES.map((tol) => (
              <button
                key={tol}
                type="button"
                onClick={() => setTol(tol)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm ${
                  tolerance === tol
                    ? toleranceChip[tol] + ' ring-2 ring-slate-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t(`tolerance.${tol}Short`)}
              </button>
            ))}
          </div>
        </Field>

        <Field label={`${t('foodDetail.freshness')} (${t('common.optional')})`}>
          <input
            value={freshnessNote}
            onChange={(e) => setFreshness(e.target.value)}
            placeholder={t('foodForm.freshnessPlaceholder')}
            className="input"
          />
        </Field>

        <Field label={`${t('foodDetail.generalNotes')} (${t('common.optional')})`}>
          <textarea
            value={generalNotes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder={t('foodForm.notesPlaceholder')}
            rows={2}
            className="input resize-none"
          />
        </Field>

        {error && <p className="text-sm text-rose-600">{error}</p>}

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

function CheckboxWithInfo({
  checked,
  onChange,
  label,
  infoTitle,
  infoBody,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  infoTitle: string
  infoBody: string
}) {
  return (
    <div className="flex items-center gap-3">
      <label className="flex flex-1 items-center gap-3">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="h-5 w-5 rounded border-slate-300 text-brand"
        />
        <span className="text-sm text-slate-700">{label}</span>
      </label>
      <InfoPopover title={infoTitle} body={infoBody} label={infoTitle} />
    </div>
  )
}
