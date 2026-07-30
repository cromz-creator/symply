import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import type { Food, Language } from '../data/types'
import { foodName } from '../lib/foodName'
import { toleranceDot } from '../lib/tolerance'
import MechanismBadges from './MechanismBadges'

export default function FoodListItem({ food }: { food: Food }) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as Language

  return (
    <Link
      to={`/foods/${food.id}`}
      className="flex items-center gap-3 border-b border-slate-100 bg-white px-4 py-3 active:bg-slate-50"
    >
      <span
        className={`h-3 w-3 shrink-0 rounded-full ${toleranceDot[food.tolerance]}`}
        title={t(`tolerance.${food.tolerance}`)}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="truncate font-medium text-slate-900">
            {foodName(food, lang)}
          </span>
          {food.isCustom && (
            <span className="shrink-0 rounded bg-brand-soft px-1.5 py-0.5 text-[10px] font-medium text-brand">
              {t('foods.custom')}
            </span>
          )}
        </div>
        <span className="text-xs text-slate-500">
          {t(`category.${food.category}`)}
        </span>
      </div>
      <MechanismBadges food={food} />
    </Link>
  )
}
