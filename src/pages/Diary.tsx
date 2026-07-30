import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import type { Food, Language, Reaction } from '../data/types'
import { foodName } from '../lib/foodName'
import { aggregateMechanisms, riskMechanisms } from '../lib/foodRisk'
import { severityColor } from '../lib/severity'
import { SYMPTOM_KEYS } from '../data/symptoms'
import { deleteReaction } from '../data/repositories/reactions'
import PageHeader from '../components/PageHeader'

export default function Diary() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language

  const reactions = useLiveQuery(
    () => db.reactions.orderBy('date').reverse().toArray(),
    [],
  )
  const foods = useLiveQuery(() => db.foods.toArray(), [])

  const foodMap = useMemo(
    () => new Map((foods ?? []).map((f) => [f.id, f])),
    [foods],
  )

  const symptomLabel = (s: string) =>
    (SYMPTOM_KEYS as readonly string[]).includes(s) ? t(`symptoms.${s}`) : s

  const formatDelay = (min?: number): string | null => {
    if (min == null) return null
    if (min < 60) return `~${min} ${t('diary.unitMin')}`
    const h = Math.floor(min / 60)
    const m = min % 60
    return m === 0
      ? `~${h} ${t('diary.unitHour')}`
      : `~${h} ${t('diary.unitHour')} ${m} ${t('diary.unitMin')}`
  }

  return (
    <>
      <PageHeader
        title={t('diary.title')}
        action={
          <Link
            to="/diary/new"
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-contrast"
          >
            + {t('common.add')}
          </Link>
        }
      />

      <div className="space-y-3 p-4">
        <Culprits reactions={reactions ?? []} foodMap={foodMap} lang={lang} />

        {(reactions ?? []).length === 0 && (
          <p className="py-10 text-center text-sm text-slate-400">
            {t('diary.empty')}
          </p>
        )}

        {(reactions ?? []).map((r) => {
          const reactionFoods = r.foodIds
            .map((fid) => foodMap.get(fid))
            .filter((f): f is Food => Boolean(f))
          const mechs = aggregateMechanisms(reactionFoods)
          const delayText = formatDelay(r.delayMinutes)
          const ingredientNames = [
            ...reactionFoods.map((f) => foodName(f, lang)),
            ...(r.freeIngredients ?? []),
          ]

          return (
            <div
              key={r.id}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  {r.mealName && (
                    <p className="truncate font-semibold text-slate-900">
                      {r.mealName}
                    </p>
                  )}
                  <span className="text-xs text-slate-500">
                    {new Date(r.date).toLocaleString(lang)}
                  </span>
                </div>
                <button
                  onClick={() => deleteReaction(r.id)}
                  className="shrink-0 text-xs text-slate-400"
                >
                  {t('common.delete')}
                </button>
              </div>

              {delayText && (
                <div className="mb-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  ⏱ {t('diary.timeToReaction')}: {delayText}
                </div>
              )}

              {mechs.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1">
                  {mechs.map((m) => (
                    <span
                      key={m}
                      className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold text-rose-700"
                      title={t(
                        m === 'H'
                          ? 'mechanism.histamineFull'
                          : m === 'DAO'
                            ? 'mechanism.daoFull'
                            : 'mechanism.liberatorFull',
                      )}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}

              {ingredientNames.length > 0 && (
                <p className="mb-2 text-sm text-slate-700">
                  {ingredientNames.join(', ')}
                </p>
              )}

              {/* Jačina */}
              <div className="mb-2 flex items-center gap-2">
                <div className="flex flex-1 gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <span
                      key={i}
                      className="h-2 flex-1 rounded-full"
                      style={{
                        backgroundColor:
                          i <= r.severity ? severityColor(r.severity) : '#e2e8f0',
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-slate-500">
                  {t(`severity.${r.severity}`)}
                </span>
              </div>

              {r.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {r.symptoms.map((s) => (
                    <span
                      key={s}
                      className="rounded bg-rose-50 px-1.5 py-0.5 text-xs text-rose-700"
                    >
                      {symptomLabel(s)}
                    </span>
                  ))}
                </div>
              )}

              {r.notes && (
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-600">
                  {r.notes}
                </p>
              )}
            </div>
          )
        })}
      </div>
    </>
  )
}

/**
 * Osnovna deterministička analiza: rangira sastojke po učestalosti u zabilježenim
 * reakcijama; rizični (H/DAO/L) su naglašeni. Temelj za buduću premium analitiku.
 */
function Culprits({
  reactions,
  foodMap,
  lang,
}: {
  reactions: Reaction[]
  foodMap: Map<string, Food>
  lang: Language
}) {
  const { t } = useTranslation()

  const ranked = useMemo(() => {
    const counts = new Map<
      string,
      { label: string; count: number; risky: boolean }
    >()
    for (const r of reactions) {
      for (const fid of r.foodIds) {
        const f = foodMap.get(fid)
        if (!f) continue
        const key = `food:${fid}`
        const prev = counts.get(key)
        counts.set(key, {
          label: foodName(f, lang),
          count: (prev?.count ?? 0) + 1,
          risky: riskMechanisms(f).length > 0,
        })
      }
      for (const s of r.freeIngredients ?? []) {
        const key = `free:${s.toLowerCase()}`
        const prev = counts.get(key)
        counts.set(key, {
          label: s,
          count: (prev?.count ?? 0) + 1,
          risky: prev?.risky ?? false,
        })
      }
    }
    return Array.from(counts.values())
      .filter((c) => c.count >= 2)
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [reactions, foodMap, lang])

  if (reactions.length === 0) return null

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
      <h2 className="font-semibold text-slate-900">{t('diary.culpritsTitle')}</h2>
      <p className="mb-3 mt-1 text-xs text-slate-500">{t('diary.culpritsHint')}</p>
      {ranked.length === 0 ? (
        <p className="text-sm text-slate-400">{t('diary.culpritsEmpty')}</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {ranked.map((c) => (
            <span
              key={c.label}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm ${
                c.risky
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-slate-100 text-slate-700'
              }`}
            >
              {c.label}
              <span className="text-xs opacity-70">
                {t('diary.occurrences', { count: c.count })}
              </span>
            </span>
          ))}
        </div>
      )}
    </section>
  )
}
