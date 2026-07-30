// Zajednički tipovi podataka za cijelu aplikaciju.

/** Razina sadržaja histamina u namirnici. `null` = nepoznato. */
export type HistamineLevel = 0 | 1 | 2 | 3 // nema / nizak / srednji / visok

/** Brza vizualna oznaka podnošljivosti. */
export type Tolerance = 'green' | 'yellow' | 'red'

/** Jačina reakcije u dnevniku (1 = blago, 5 = jako). */
export type Severity = 1 | 2 | 3 | 4 | 5

export type Language = 'hr' | 'en'

/**
 * Namirnica. Objedinjuje opći (seed) popis i korisničke unose.
 * `userId` je rezerviran za budući račun + sinkronizaciju (sada uvijek null).
 */
export interface Food {
  id: string
  nameHr: string
  nameEn: string
  category: string
  histamineLevel: HistamineLevel | null // null = nepoznato
  isDaoInhibitor: boolean
  isHistamineLiberator: boolean
  tolerance: Tolerance
  freshnessNote?: string
  generalNotes?: string
  /** Referenca ili URL izvora klasifikacije (kad postoji). */
  source?: string
  /** Izvorna oznaka podnošljivosti iz seed-a; koristi se za "vrati na zadano". */
  seedTolerance?: Tolerance
  isCustom: boolean
  userId?: string | null
  createdAt: number
  updatedAt: number
}

/** Osobna bilješka/komentar vezan uz namirnicu. */
export interface FoodNote {
  id: string
  foodId: string
  text: string
  symptoms: string[]
  userId?: string | null
  createdAt: number
  updatedAt: number
}

/** Unos u dnevniku reakcija. */
export interface Reaction {
  id: string
  /** ISO datum/vrijeme unosa. */
  date: string
  /** Naziv jela/obroka (npr. "Juice vodka", "Pizza kod prijatelja"). */
  mealName?: string
  /** Namirnice iz baze koje su bile u jelu (sastojci). */
  foodIds: string[]
  /** Sastojci koji nisu u bazi (slobodan unos). */
  freeIngredients?: string[]
  symptoms: string[]
  severity: Severity
  /** Vremenski odmak reakcije nakon jela, u minutama (normalizirano). */
  delayMinutes?: number
  notes?: string
  userId?: string | null
  createdAt: number
  updatedAt: number
}

/** Aplikacijske postavke (jedan zapis, id = 'app'). */
export interface AppSettings {
  id: 'app'
  language: Language
  disclaimerAccepted: boolean
  seedVersion: number
}
