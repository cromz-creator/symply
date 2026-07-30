/**
 * Kontrolirani popis simptoma. Pohranjuje se kao ključ (stabilan string),
 * a prikazuje prevedeno preko i18n (symptoms.<key>). Slobodan unos je
 * dozvoljen u UI-u i pohranjuje se doslovno.
 */
export const SYMPTOM_KEYS = [
  // Koža
  'itching',
  'eczemaFlare',
  'hives',
  'flushing',
  // Probava
  'digestive',
  'abdominalPain',
  'flatulence',
  'diarrhea',
  'nausea',
  // Ostalo
  'headache',
  'nasalCongestion',
  'rapidHeartbeat',
  'fatigue',
  'dizziness',
] as const

export type SymptomKey = (typeof SYMPTOM_KEYS)[number]

/** i18n ključ za prijevod simptoma (radi i za slobodan unos — vrati original). */
export function symptomLabelKey(key: string): string {
  return (SYMPTOM_KEYS as readonly string[]).includes(key)
    ? `symptoms.${key}`
    : ''
}
