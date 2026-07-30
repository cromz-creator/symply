import Dexie, { type Table } from 'dexie'
import type { Food, FoodNote, Reaction, AppSettings } from './types'

/**
 * Lokalna baza (IndexedDB preko Dexie). Sav pristup podacima ide kroz
 * repozitorije u ./repositories — tako se kasnije ispod može ubaciti
 * sinkronizacija (premium) bez diranja UI-a.
 */
export class SymplyDB extends Dexie {
  foods!: Table<Food, string>
  foodNotes!: Table<FoodNote, string>
  reactions!: Table<Reaction, string>
  settings!: Table<AppSettings, string>

  constructor() {
    super('symply')
    this.version(1).stores({
      // Indeksirana polja (za pretragu/filtriranje). Ostala polja se pohranjuju,
      // ali nisu indeksirana.
      foods: 'id, category, tolerance, histamineLevel, nameHr, nameEn',
      foodNotes: 'id, foodId, createdAt',
      reactions: 'id, date, createdAt',
      settings: 'id',
    })
  }
}

export const db = new SymplyDB()
