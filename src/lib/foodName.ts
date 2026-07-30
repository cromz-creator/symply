import type { Food, Language } from '../data/types'

/** Vraća naziv namirnice na odabranom jeziku (uz razuman fallback). */
export function foodName(food: Food, lang: Language): string {
  if (lang === 'en') return food.nameEn || food.nameHr
  return food.nameHr || food.nameEn
}
