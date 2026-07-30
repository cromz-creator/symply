import { db } from '../db'
import type { Food } from '../types'
import { getSettings, saveSettings } from '../repositories/settings'
import seedData from './foods.hr-en.json'

type SeedFood = Omit<
  Food,
  'isCustom' | 'userId' | 'createdAt' | 'updatedAt' | 'seedTolerance'
>

/**
 * Puni/ažurira bazu seed namirnicama.
 * - Nove seed namirnice se dodaju.
 * - Postojeće seed namirnice (ne korisničke) se ažuriraju sadržajem iz seed-a
 *   (nazivi, mehanizmi, napomene, izvori), ali se **čuva osobna izmjena
 *   podnošljivosti** (ako je korisnik promijenio `tolerance` u odnosu na zadano).
 * - Korisničke namirnice (`isCustom`) se ne diraju.
 */
export async function ensureSeeded(): Promise<void> {
  const settings = await getSettings()
  const seedVersion = seedData.seedVersion as number
  if (settings.seedVersion >= seedVersion) return

  const ts = Date.now()
  const seedFoods = seedData.foods as SeedFood[]
  const existing = new Map(
    (await db.foods.toArray()).map((f) => [f.id, f]),
  )

  const toAdd: Food[] = []
  const toPut: Food[] = []

  for (const sf of seedFoods) {
    const prev = existing.get(sf.id)
    if (!prev) {
      toAdd.push({
        ...sf,
        seedTolerance: sf.tolerance,
        isCustom: false,
        userId: null,
        createdAt: ts,
        updatedAt: ts,
      })
      continue
    }
    if (prev.isCustom) continue // ne diramo korisničke

    // Je li korisnik ručno mijenjao podnošljivost?
    const userOverrode =
      prev.seedTolerance != null && prev.tolerance !== prev.seedTolerance

    toPut.push({
      ...prev,
      ...sf,
      // zadrži osobnu izmjenu podnošljivosti ako postoji
      tolerance: userOverrode ? prev.tolerance : sf.tolerance,
      seedTolerance: sf.tolerance,
      isCustom: false,
      userId: prev.userId ?? null,
      createdAt: prev.createdAt,
      updatedAt: ts,
    })
  }

  if (toAdd.length) await db.foods.bulkAdd(toAdd)
  if (toPut.length) await db.foods.bulkPut(toPut)

  await saveSettings({ seedVersion })
}
