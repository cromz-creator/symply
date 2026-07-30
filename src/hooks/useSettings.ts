import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../data/db'
import { DEFAULT_SETTINGS } from '../data/repositories/settings'
import type { AppSettings } from '../data/types'

/** Reaktivno čita postavke iz baze (null dok se učitava). */
export function useSettings(): AppSettings | null {
  const settings = useLiveQuery(() => db.settings.get('app'), [])
  if (settings === undefined) return null // još se učitava
  return settings ?? DEFAULT_SETTINGS
}
