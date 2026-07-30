/** Kategorije namirnica (ključevi; prijevod u i18n pod category.<key>). */
export const CATEGORY_KEYS = [
  'dairy',
  'fish',
  'meat',
  'vegetables',
  'fruit',
  'grains',
  'legumes',
  'nuts_seeds',
  'beverages',
  'fermented',
  'condiments',
  'sweets',
  'herbs_spices',
  'other',
] as const

export type CategoryKey = (typeof CATEGORY_KEYS)[number]
