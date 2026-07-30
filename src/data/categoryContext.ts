import type { Language } from './types'

export interface CategoryCallout {
  title: string
  body: string
}

export interface CategoryContext {
  /** Kratka napomena (banner iznad popisa). */
  note: string
  /** Prečac na drugu kategoriju (npr. Napitci → Voće). */
  crossLinkCategory?: string
  crossLinkLabel?: string
  /** Dodatna objašnjenja (npr. alkohol, kombinacije). */
  callouts?: CategoryCallout[]
}

const CONTEXT: Record<Language, Record<string, CategoryContext>> = {
  hr: {
    beverages: {
      note: 'Pića su često kombinacija sastojaka. Koktel može sadržavati voće (npr. citrus), a citrus je liberator histamina — pogledaj i popis voća.',
      crossLinkCategory: 'fruit',
      crossLinkLabel: 'Pogledaj Voće',
      callouts: [
        {
          title: 'Kako alkohol utječe?',
          body: 'Alkohol djeluje na tri načina: smanjuje razgradnju/aktivnost DAO enzima, potiče oslobađanje tjelesnog histamina, a neka pića (crno vino, pivo, pjenušac) sama sadrže histamin.',
        },
        {
          title: 'Kombinacije = veći rizik',
          body: '"Juice vodka" spaja alkohol (inhibicija DAO + oslobađanje histamina) i citrus (liberator) — učinci se zbrajaju, pa reakcija može biti jača nego od svakog sastojka posebno.',
        },
      ],
    },
    fruit: {
      note: 'Neko voće (citrus, jagode, ananas, papaja) su liberatori histamina — potiču oslobađanje tjelesnog histamina iako sama ne sadrže puno histamina.',
    },
    fermented: {
      note: 'Fermentirana hrana tipično ima visok histamin (nastaje tijekom fermentacije/zrenja).',
    },
    fish: {
      note: 'Kod ribe je ključna svježina: histamin brzo raste ako riba stoji. Odmah smrznuta riba obično se bolje podnosi od odstajale ili konzervirane.',
    },
  },
  en: {
    beverages: {
      note: 'Drinks are often a mix of ingredients. A cocktail may contain fruit (e.g. citrus), and citrus is a histamine liberator — check the fruit list too.',
      crossLinkCategory: 'fruit',
      crossLinkLabel: 'View Fruit',
      callouts: [
        {
          title: 'How does alcohol affect it?',
          body: 'Alcohol acts in three ways: it reduces DAO breakdown/activity, triggers release of the body’s own histamine, and some drinks (red wine, beer, sparkling wine) contain histamine themselves.',
        },
        {
          title: 'Combinations = higher risk',
          body: '"Juice vodka" combines alcohol (DAO inhibition + histamine release) and citrus (liberator) — the effects add up, so the reaction can be stronger than from either ingredient alone.',
        },
      ],
    },
    fruit: {
      note: 'Some fruit (citrus, strawberries, pineapple, papaya) are histamine liberators — they trigger release of the body’s histamine even though they are not high in histamine themselves.',
    },
    fermented: {
      note: 'Fermented foods are typically high in histamine (produced during fermentation/ageing).',
    },
    fish: {
      note: 'With fish, freshness is key: histamine rises quickly when fish sits. Fish frozen immediately is usually tolerated better than non-fresh or canned.',
    },
  },
}

export function getCategoryContext(
  category: string,
  lang: Language,
): CategoryContext | undefined {
  return CONTEXT[lang]?.[category]
}
