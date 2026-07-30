import { db } from '../db'
import type { FoodNote } from '../types'
import { newId, now } from './foods'

export async function getNotesForFood(foodId: string): Promise<FoodNote[]> {
  return db.foodNotes.where('foodId').equals(foodId).reverse().sortBy('createdAt')
}

export async function addNote(
  foodId: string,
  text: string,
  symptoms: string[],
): Promise<string> {
  const ts = now()
  const note: FoodNote = {
    id: newId(),
    foodId,
    text: text.trim(),
    symptoms,
    userId: null,
    createdAt: ts,
    updatedAt: ts,
  }
  await db.foodNotes.add(note)
  return note.id
}

export async function updateNote(
  id: string,
  changes: Partial<FoodNote>,
): Promise<void> {
  await db.foodNotes.update(id, { ...changes, updatedAt: now() })
}

export async function deleteNote(id: string): Promise<void> {
  await db.foodNotes.delete(id)
}
