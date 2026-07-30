import { db } from '../db'
import type { Food, Tolerance } from '../types'

/** Generira jedinstveni id (dostupan u svim modernim preglednicima). */
export const newId = () => crypto.randomUUID()
export const now = () => Date.now()

export async function getAllFoods(): Promise<Food[]> {
  return db.foods.toArray()
}

export async function getFood(id: string): Promise<Food | undefined> {
  return db.foods.get(id)
}

export type NewFoodInput = Omit<
  Food,
  'id' | 'createdAt' | 'updatedAt' | 'isCustom' | 'userId' | 'seedTolerance'
>

/** Dodaje korisničku namirnicu (isCustom = true). */
export async function addCustomFood(input: NewFoodInput): Promise<string> {
  const ts = now()
  const food: Food = {
    ...input,
    id: newId(),
    isCustom: true,
    userId: null,
    createdAt: ts,
    updatedAt: ts,
  }
  await db.foods.add(food)
  return food.id
}

export async function updateFood(
  id: string,
  changes: Partial<Food>,
): Promise<void> {
  await db.foods.update(id, { ...changes, updatedAt: now() })
}

/** Postavlja osobnu oznaku podnošljivosti (nadjačava seed vrijednost). */
export async function setTolerance(
  id: string,
  tolerance: Tolerance,
): Promise<void> {
  await db.foods.update(id, { tolerance, updatedAt: now() })
}

export async function deleteFood(id: string): Promise<void> {
  await db.foods.delete(id)
}
