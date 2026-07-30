import { useTranslation } from 'react-i18next'
import type { Food } from '../data/types'

/**
 * Prikazuje oznake tri mehanizma: visok histamin (H), DAO inhibitor (DAO),
 * oslobađatelj (L). Prikazuju se samo oni koji vrijede za namirnicu.
 */
export default function MechanismBadges({
  food,
  size = 'sm',
}: {
  food: Food
  size?: 'sm' | 'md'
}) {
  const { t } = useTranslation()
  const cls =
    size === 'md'
      ? 'px-2 py-0.5 text-xs'
      : 'px-1.5 py-0.5 text-[10px]'

  const badges: { show: boolean; label: string; color: string; title: string }[] =
    [
      {
        show: food.histamineLevel != null && food.histamineLevel >= 2,
        label: t('mechanism.histamineShort'),
        color: 'bg-rose-100 text-rose-700',
        title: t('mechanism.histamineFull'),
      },
      {
        show: food.isDaoInhibitor,
        label: t('mechanism.daoShort'),
        color: 'bg-amber-100 text-amber-700',
        title: t('mechanism.daoFull'),
      },
      {
        show: food.isHistamineLiberator,
        label: t('mechanism.liberatorShort'),
        color: 'bg-violet-100 text-violet-700',
        title: t('mechanism.liberatorFull'),
      },
    ]

  const visible = badges.filter((b) => b.show)
  if (visible.length === 0) return null

  return (
    <div className="flex flex-wrap gap-1">
      {visible.map((b) => (
        <span
          key={b.label}
          title={b.title}
          className={`rounded font-semibold ${cls} ${b.color}`}
        >
          {b.label}
        </span>
      ))}
    </div>
  )
}
