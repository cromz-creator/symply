import { useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import type { Food, Language, Tolerance } from '../data/types'
import { foodName } from '../lib/foodName'
import { TOLERANCES, toleranceChip } from '../lib/tolerance'
import { getCategoryContext } from '../data/categoryContext'
import PageHeader from '../components/PageHeader'
import FoodListItem from '../components/FoodListItem'

type Mechanism = 'histamine' | 'dao' | 'liberator'

export default function FoodsList() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language
  const foods = useLiveQuery(() => db.foods.toArray(), [])

  const [query, setQuery] = useState('')
  const [mechanism, setMechanism] = useState<Mechanism | null>(null)
  const [tolerance, setTolerance] = useState<Tolerance | null>(null)
  const [category, setCategory] = useState<string>('')

  const categories = useMemo(() => {
    const set = new Set((foods ?? []).map((f) => f.category))
    return Array.from(set).sort()
  }, [foods])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return (foods ?? [])
      .filter((f) => {
        if (q) {
          const hay = `${f.nameHr} ${f.nameEn}`.toLowerCase()
          if (!hay.includes(q)) return false
        }
        if (tolerance && f.tolerance !== tolerance) return false
        if (category && f.category !== category) return false
        if (
          mechanism === 'histamine' &&
          !(f.histamineLevel != null && f.histamineLevel >= 2)
        )
          return false
        if (mechanism === 'dao' && !f.isDaoInhibitor) return false
        if (mechanism === 'liberator' && !f.isHistamineLiberator) return false
        return true
      })
      .sort((a, b) => foodName(a, lang).localeCompare(foodName(b, lang)))
  }, [foods, query, tolerance, category, mechanism, lang])

  const hasFilters = mechanism || tolerance || category

  const mechanisms: Mechanism[] = ['histamine', 'dao', 'liberator']

  return (
    <>
      <PageHeader
        title={t('foods.title')}
        action={
          <Link
            to="/foods/new"
            className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium text-brand-contrast"
          >
            + {t('common.add')}
          </Link>
        }
      />

      <div className="space-y-3 bg-white px-4 py-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t('foods.searchPlaceholder')}
          className="w-full rounded-xl border border-slate-300 px-4 py-2.5 outline-none focus:border-brand"
        />

        <div className="flex flex-wrap gap-2">
          {mechanisms.map((m) => (
            <FilterChip
              key={m}
              active={mechanism === m}
              onClick={() => setMechanism(mechanism === m ? null : m)}
            >
              {t(`mechanism.${m}`)}
            </FilterChip>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {TOLERANCES.map((tol) => (
            <button
              key={tol}
              onClick={() => setTolerance(tolerance === tol ? null : tol)}
              className={`rounded-full px-3 py-1.5 text-sm ${
                tolerance === tol
                  ? toleranceChip[tol] + ' ring-2 ring-offset-1 ring-slate-300'
                  : toleranceChip[tol] + ' opacity-70'
              }`}
            >
              {t(`tolerance.${tol}`)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-brand"
          >
            <option value="">{t('filter.category')}: {t('common.all')}</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {t(`category.${c}`)}
              </option>
            ))}
          </select>
          {hasFilters && (
            <button
              onClick={() => {
                setMechanism(null)
                setTolerance(null)
                setCategory('')
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-brand"
            >
              {t('filter.clear')}
            </button>
          )}
        </div>
      </div>

      {category && (
        <CategoryBanner
          category={category}
          lang={lang}
          onCrossLink={setCategory}
        />
      )}

      <p className="px-4 py-2 text-xs text-slate-500">
        {t('foods.resultsCount', { count: filtered.length })}
      </p>

      <FoodList foods={filtered} emptyText={t('foods.empty')} />
    </>
  )
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-1.5 text-sm ${
        active ? 'bg-brand text-brand-contrast' : 'bg-slate-100 text-slate-700'
      }`}
    >
      {children}
    </button>
  )
}

function CategoryBanner({
  category,
  lang,
  onCrossLink,
}: {
  category: string
  lang: Language
  onCrossLink: (category: string) => void
}) {
  const ctx = getCategoryContext(category, lang)
  if (!ctx) return null
  return (
    <div className="mx-4 mt-3 space-y-3 rounded-2xl bg-amber-50 p-4 ring-1 ring-amber-200">
      <p className="text-sm text-amber-900">{ctx.note}</p>
      {ctx.crossLinkCategory && (
        <button
          onClick={() => onCrossLink(ctx.crossLinkCategory as string)}
          className="rounded-lg bg-amber-600 px-3 py-1.5 text-sm font-medium text-white"
        >
          {ctx.crossLinkLabel} →
        </button>
      )}
      {ctx.callouts?.map((c) => (
        <div key={c.title} className="rounded-xl bg-white/70 p-3">
          <p className="text-sm font-semibold text-amber-900">{c.title}</p>
          <p className="mt-1 text-sm text-amber-900/90">{c.body}</p>
        </div>
      ))}
    </div>
  )
}

function FoodList({ foods, emptyText }: { foods: Food[]; emptyText: string }) {
  if (foods.length === 0) {
    return <p className="px-4 py-10 text-center text-sm text-slate-400">{emptyText}</p>
  }
  return (
    <div>
      {foods.map((f) => (
        <FoodListItem key={f.id} food={f} />
      ))}
    </div>
  )
}
