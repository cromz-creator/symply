import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import type { Language, Tolerance } from '../data/types'
import { foodName } from '../lib/foodName'
import { TOLERANCES, toleranceChip, toleranceDot } from '../lib/tolerance'
import { setTolerance, deleteFood } from '../data/repositories/foods'
import { addNote, deleteNote } from '../data/repositories/foodNotes'
import { SYMPTOM_KEYS } from '../data/symptoms'
import PageHeader from '../components/PageHeader'
import MechanismBadges from '../components/MechanismBadges'
import SymptomPicker from '../components/SymptomPicker'
import InfoPopover from '../components/InfoPopover'

export default function FoodDetail() {
  const { id = '' } = useParams()
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language

  const food = useLiveQuery(() => db.foods.get(id), [id])
  const notes = useLiveQuery(
    () => db.foodNotes.where('foodId').equals(id).reverse().sortBy('createdAt'),
    [id],
  )
  const diaryReactions = useLiveQuery(async () => {
    const all = await db.reactions.orderBy('date').reverse().toArray()
    return all.filter((r) => r.foodIds.includes(id))
  }, [id])

  const [noteText, setNoteText] = useState('')
  const [noteSymptoms, setNoteSymptoms] = useState<string[]>([])

  // useLiveQuery vraća undefined dok se učitava (i ako namirnica ne postoji).
  if (!food) return <PageHeader title="…" back />

  const saveNote = async () => {
    if (!noteText.trim() && noteSymptoms.length === 0) return
    await addNote(id, noteText, noteSymptoms)
    setNoteText('')
    setNoteSymptoms([])
  }

  const remove = async () => {
    if (confirm(t('common.confirmDelete'))) {
      await deleteFood(id)
      navigate('/foods')
    }
  }

  return (
    <>
      <PageHeader
        title={foodName(food, lang)}
        back
        action={
          food.isCustom ? (
            <Link
              to={`/foods/${id}/edit`}
              className="text-sm font-medium text-brand"
            >
              {t('common.edit')}
            </Link>
          ) : undefined
        }
      />

      <div className="space-y-4 p-4">
        {/* Podnošljivost */}
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="mb-2 flex items-center gap-2">
            <span className={`h-4 w-4 rounded-full ${toleranceDot[food.tolerance]}`} />
            <span className="font-medium text-slate-900">
              {t(`tolerance.${food.tolerance}`)}
            </span>
            {food.seedTolerance && food.tolerance !== food.seedTolerance && (
              <span className="rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand">
                {t('tolerance.personal')}
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {TOLERANCES.map((tol) => (
              <button
                key={tol}
                onClick={() => setTolerance(id, tol)}
                className={`rounded-full px-3 py-1.5 text-sm ${
                  food.tolerance === tol
                    ? toleranceChip[tol] + ' ring-2 ring-slate-300'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {t(`tolerance.${tol}Short`)}
              </button>
            ))}
            {food.seedTolerance && food.tolerance !== food.seedTolerance && (
              <button
                onClick={() => setTolerance(id, food.seedTolerance as Tolerance)}
                className="rounded-full px-3 py-1.5 text-sm text-brand"
              >
                {t('tolerance.reset')}
              </button>
            )}
          </div>
        </section>

        {/* Mehanizmi + kategorija + razina */}
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-slate-500">{t('category.label')}</span>
            <span className="text-sm font-medium text-slate-800">
              {t(`category.${food.category}`)}
            </span>
          </div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm text-slate-500">
              {t('histamineLevel.label')}
            </span>
            <span className="text-sm font-medium text-slate-800">
              {food.histamineLevel == null
                ? t('histamineLevel.unknown')
                : t(`histamineLevel.${food.histamineLevel}`)}
            </span>
          </div>
          <MechanismBadges food={food} size="md" />
          {(food.isDaoInhibitor || food.isHistamineLiberator) && (
            <div className="mt-3 space-y-2 border-t border-slate-100 pt-3">
              {food.isDaoInhibitor && (
                <div className="flex items-center gap-2">
                  <InfoPopover
                    title={t('mechanism.daoFull')}
                    body={t('mechanism.daoExplain')}
                  />
                  <span className="text-sm text-slate-600">
                    {t('mechanism.daoFull')}
                  </span>
                </div>
              )}
              {food.isHistamineLiberator && (
                <div className="flex items-center gap-2">
                  <InfoPopover
                    title={t('mechanism.liberatorFull')}
                    body={t('mechanism.liberatorExplain')}
                  />
                  <span className="text-sm text-slate-600">
                    {t('mechanism.liberatorFull')}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        {(food.freshnessNote || food.generalNotes || food.source) && (
          <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            {food.freshnessNote && (
              <Info label={t('foodDetail.freshness')} value={food.freshnessNote} />
            )}
            {food.generalNotes && (
              <Info label={t('foodDetail.generalNotes')} value={food.generalNotes} />
            )}
            {food.source && (
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  {t('foodDetail.source')}
                </p>
                {food.source.startsWith('http') ? (
                  <a
                    href={food.source}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-brand underline"
                  >
                    {food.source}
                  </a>
                ) : (
                  <p className="text-sm text-slate-700">{food.source}</p>
                )}
              </div>
            )}
          </section>
        )}

        <Link
          to={`/diary/new?food=${id}`}
          className="block rounded-xl border border-brand py-3 text-center font-medium text-brand"
        >
          {t('foodDetail.logReaction')}
        </Link>

        {/* Reakcije iz dnevnika koje uključuju ovu namirnicu */}
        <section>
          <h2 className="mb-2 px-1 font-semibold text-slate-900">
            {t('foodDetail.diaryReactions')}
          </h2>
          {(diaryReactions ?? []).length === 0 ? (
            <p className="px-1 text-sm text-slate-400">
              {t('foodDetail.diaryReactionsEmpty')}
            </p>
          ) : (
            <div className="space-y-2">
              {(diaryReactions ?? []).map((r) => (
                <div
                  key={r.id}
                  className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">
                      {new Date(r.date).toLocaleString(lang)}
                    </span>
                    <span className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <span
                          key={i}
                          className={`h-2 w-2 rounded-full ${
                            i <= r.severity ? 'bg-rose-500' : 'bg-slate-200'
                          }`}
                        />
                      ))}
                    </span>
                  </div>
                  {r.mealName && (
                    <p className="mt-1 text-sm font-medium text-slate-800">
                      {r.mealName}
                    </p>
                  )}
                  {r.symptoms.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.symptoms.map((s) => (
                        <span
                          key={s}
                          className="rounded bg-rose-50 px-1.5 py-0.5 text-xs text-rose-700"
                        >
                          {(SYMPTOM_KEYS as readonly string[]).includes(s)
                            ? t(`symptoms.${s}`)
                            : s}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Osobne bilješke */}
        <section>
          <h2 className="mb-2 px-1 font-semibold text-slate-900">
            {t('foodDetail.notes')}
          </h2>

          <div className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder={t('foodDetail.notePlaceholder')}
              rows={2}
              className="w-full resize-none rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-brand"
            />
            <p className="text-xs text-slate-500">{t('foodDetail.symptomsLabel')}</p>
            <SymptomPicker value={noteSymptoms} onChange={setNoteSymptoms} />
            <button
              onClick={saveNote}
              className="w-full rounded-lg bg-brand py-2.5 text-sm font-medium text-brand-contrast"
            >
              {t('foodDetail.addNote')}
            </button>
          </div>

          <div className="mt-3 space-y-2">
            {(notes ?? []).length === 0 && (
              <p className="px-1 text-sm text-slate-400">
                {t('foodDetail.noNotes')}
              </p>
            )}
            {(notes ?? []).map((n) => (
              <div
                key={n.id}
                className="rounded-xl bg-white p-3 shadow-sm ring-1 ring-slate-100"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="whitespace-pre-wrap text-sm text-slate-800">
                    {n.text}
                  </p>
                  <button
                    onClick={() => deleteNote(n.id)}
                    className="shrink-0 text-xs text-slate-400"
                  >
                    {t('common.delete')}
                  </button>
                </div>
                {n.symptoms.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {n.symptoms.map((s) => (
                      <span
                        key={s}
                        className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600"
                      >
                        {(SYMPTOM_KEYS as readonly string[]).includes(s)
                          ? t(`symptoms.${s}`)
                          : s}
                      </span>
                    ))}
                  </div>
                )}
                <p className="mt-1 text-[10px] text-slate-400">
                  {new Date(n.createdAt).toLocaleString(lang)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {food.isCustom && (
          <button
            onClick={remove}
            className="w-full rounded-xl py-3 text-sm font-medium text-rose-600"
          >
            {t('common.delete')}
          </button>
        )}
      </div>
    </>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <p className="text-sm text-slate-700">{value}</p>
    </div>
  )
}
