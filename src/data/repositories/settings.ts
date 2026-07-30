import { db } from '../db'
import type { AppSettings, Language } from '../types'

export const DEFAULT_SETTINGS: AppSettings = {
  id: 'app',
  language: 'hr',
  disclaimerAccepted: false,
  seedVersion: 0,
}

export async function getSettings(): Promise<AppSettings> {
  const s = await db.settings.get('app')
  return s ?? DEFAULT_SETTINGS
}

export async function saveSettings(
  changes: Partial<AppSettings>,
): Promise<void> {
  const current = await getSettings()
  await db.settings.put({ ...current, ...changes, id: 'app' })
}

export async function setLanguage(language: Language): Promise<void> {
  await saveSettings({ language })
}

export async function acceptDisclaimer(): Promise<void> {
  await saveSettings({ disclaimerAccepted: true })
}
