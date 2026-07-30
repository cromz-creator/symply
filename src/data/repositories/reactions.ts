import { db } from '../db'
import type { Reaction, Severity } from '../types'
import { newId, now } from './foods'

export async function getAllReactions(): Promise<Reaction[]> {
  // Najnovije prvo.
  return db.reactions.orderBy('date').reverse().toArray()
}

export async function getReaction(id: string): Promise<Reaction | undefined> {
  return db.reactions.get(id)
}

/** Reakcije iz dnevnika koje uključuju zadanu namirnicu (najnovije prvo). */
export async function getReactionsForFood(
  foodId: string,
): Promise<Reaction[]> {
  const all = await db.reactions.orderBy('date').reverse().toArray()
  return all.filter((r) => r.foodIds.includes(foodId))
}

export interface NewReactionInput {
  date: string
  mealName?: string
  foodIds: string[]
  freeIngredients?: string[]
  symptoms: string[]
  severity: Severity
  delayMinutes?: number
  notes?: string
}

export async function addReaction(input: NewReactionInput): Promise<string> {
  const ts = now()
  const reaction: Reaction = {
    ...input,
    id: newId(),
    userId: null,
    createdAt: ts,
    updatedAt: ts,
  }
  await db.reactions.add(reaction)
  return reaction.id
}

export async function updateReaction(
  id: string,
  changes: Partial<Reaction>,
): Promise<void> {
  await db.reactions.update(id, { ...changes, updatedAt: now() })
}

export async function deleteReaction(id: string): Promise<void> {
  await db.reactions.delete(id)
}
