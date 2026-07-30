import type { Language } from './types'

export interface InfoLink {
  label: string
  url: string
}

export interface InfoSection {
  heading: string
  paragraphs: string[]
  links?: InfoLink[]
}

/**
 * Sadržaj "Info kutka" o histaminskoj intoleranciji (HR/EN).
 * Edukativno, temeljeno na provjerenim izvorima — NIJE medicinski savjet.
 */
export const INFO_CONTENT: Record<Language, InfoSection[]> = {
  hr: [
    {
      heading: 'Što je histaminska intolerancija?',
      paragraphs: [
        'Histaminska intolerancija (HIT) nije klasična alergija, nego neravnoteža između količine histamina koji unesemo ili nakupimo i sposobnosti tijela da ga razgradi. Kad se histamin nakuplja brže nego što se uklanja, javljaju se simptomi.',
        'Glavni "razgrađivač" histamina iz hrane u crijevima je enzim diaminooksidaza (DAO). Kad je njegova aktivnost smanjena, i uobičajena hrana može izazvati tegobe.',
        'Procjenjuje se da pogađa otprilike 1–3% populacije, a žene približno dvostruko češće od muškaraca.',
      ],
    },
    {
      heading: 'Kako nastaje i može li samostalno?',
      paragraphs: [
        'Postoji primarni oblik (nasljedno smanjena aktivnost DAO) — on je uglavnom doživotna sklonost, iako jačina varira ovisno o prehrani, stresu, hormonima i zdravlju crijeva. U tom smislu HIT može postojati i samostalno.',
        'Češće je sekundaran, tj. posljedica nečeg drugog što oštećuje crijeva ili smanjuje DAO: celijakija, SIBO (prekomjeran rast bakterija), stanje nakon crijevne infekcije, neki lijekovi te manjak vitamina C i bakra. Kad se osnovni uzrok liječi, tolerancija se često popravi.',
      ],
      links: [
        {
          label: 'Histamine Intolerance — The More We Know the Less We Know (2021)',
          url: 'https://pubmed.ncbi.nlm.nih.gov/34209583/',
        },
      ],
    },
    {
      heading: 'Tri načina na koja hrana pogoršava simptome',
      paragraphs: [
        '1) Visok sadržaj histamina — namirnica sama sadrži puno histamina (zreli sirevi, fermentirano, suhomesnato, odstajala riba).',
        '2) Inhibitori DAO — tvari koje smanjuju aktivnost DAO enzima (npr. alkohol), pa se histamin sporije razgrađuje.',
        '3) Liberatori histamina — potiču oslobađanje tjelesnog histamina iz vlastitih stanica (mastocita), neovisno o tome koliko histamina namirnica sadrži (npr. citrus, jagode).',
        'Zato je npr. "juice vodka" nezgodna kombinacija: alkohol smanjuje razgradnju i oslobađa histamin, a citrus dodatno oslobađa tjelesni histamin — učinci se zbrajaju.',
      ],
      links: [
        {
          label: 'Alcohol–histamine interactions',
          url: 'https://pubmed.ncbi.nlm.nih.gov/10344773/',
        },
      ],
    },
    {
      heading: 'Simptomi',
      paragraphs: [
        'Simptomi se često jave unutar ~30 minuta nakon jela i vrlo su individualni. Koža: svrbež, crvenilo (flushing), koprivnjača (urtikarija), pogoršanje ekcema/atopijskog dermatitisa. Probava: nadutost i vjetrovi, grčevi i bol u trbuhu, proljev, mučnina.',
        'Ostalo: glavobolja/migrena, začepljen nos, ubrzan puls, umor, vrtoglavica. Simptomi se preklapaju s drugim stanjima (npr. IBS), pa je dijagnoza složena i postavlja se isključivanjem.',
      ],
      links: [
        {
          label: 'Histamine Intolerance: Symptoms, Diagnosis, and Beyond (2024)',
          url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11054089/',
        },
      ],
    },
    {
      heading: 'Povezana stanja',
      paragraphs: [
        'U literaturi se s histaminskom intolerancijom povezuju: alergijske bolesti, kronične crijevne bolesti i IBS, atopijski dermatitis i kronična koprivnjača, mastocitoza, disbioza crijevne flore te manjak vitamina C i bakra.',
        'Napomena: povezanost ne znači uzrok. Ovaj popis je informativan i ne zamjenjuje obradu kod liječnika.',
      ],
    },
    {
      heading: 'Važna napomena',
      paragraphs: [
        'Ovaj sadržaj je edukativan i ne predstavlja medicinski savjet, dijagnozu ni liječenje. Za sumnju na histaminsku intoleranciju obrati se liječniku ili nutricionistu.',
      ],
    },
  ],
  en: [
    {
      heading: 'What is histamine intolerance?',
      paragraphs: [
        'Histamine intolerance (HIT) is not a classic allergy but an imbalance between the histamine we take in or accumulate and the body’s ability to break it down. When histamine builds up faster than it is cleared, symptoms appear.',
        'The main enzyme that breaks down dietary histamine in the gut is diamine oxidase (DAO). When its activity is reduced, even ordinary foods can trigger symptoms.',
        'It is estimated to affect roughly 1–3% of the population, with women affected about twice as often as men.',
      ],
    },
    {
      heading: 'How does it arise — can it stand alone?',
      paragraphs: [
        'There is a primary form (genetically reduced DAO activity) — largely a lifelong tendency, though severity varies with diet, stress, hormones and gut health. In that sense HIT can exist on its own.',
        'More often it is secondary — a consequence of something else that damages the gut or lowers DAO: coeliac disease, SIBO, a post-infectious state, certain medications, and vitamin C or copper deficiency. Treating the underlying cause often improves tolerance.',
      ],
      links: [
        {
          label: 'Histamine Intolerance — The More We Know the Less We Know (2021)',
          url: 'https://pubmed.ncbi.nlm.nih.gov/34209583/',
        },
      ],
    },
    {
      heading: 'Three ways food worsens symptoms',
      paragraphs: [
        '1) High histamine content — the food itself is rich in histamine (aged cheese, fermented foods, cured meats, non-fresh fish).',
        '2) DAO inhibitors — substances that reduce DAO enzyme activity (e.g. alcohol), so histamine is cleared more slowly.',
        '3) Histamine liberators — trigger release of the body’s own histamine from mast cells, regardless of the food’s histamine content (e.g. citrus, strawberries).',
        'That is why "juice vodka" is a tricky mix: alcohol slows breakdown and releases histamine, while citrus additionally liberates the body’s histamine — the effects add up.',
      ],
      links: [
        {
          label: 'Alcohol–histamine interactions',
          url: 'https://pubmed.ncbi.nlm.nih.gov/10344773/',
        },
      ],
    },
    {
      heading: 'Symptoms',
      paragraphs: [
        'Symptoms often appear within ~30 minutes of eating and are highly individual. Skin: itching, flushing, hives (urticaria), eczema/atopic dermatitis flare-ups. Digestive: bloating and flatulence, cramps and abdominal pain, diarrhea, nausea.',
        'Other: headache/migraine, nasal congestion, rapid heartbeat, fatigue, dizziness. Symptoms overlap with other conditions (e.g. IBS), so diagnosis is complex and made by exclusion.',
      ],
      links: [
        {
          label: 'Histamine Intolerance: Symptoms, Diagnosis, and Beyond (2024)',
          url: 'https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11054089/',
        },
      ],
    },
    {
      heading: 'Associated conditions',
      paragraphs: [
        'The literature associates histamine intolerance with: allergic diseases, chronic bowel disease and IBS, atopic dermatitis and chronic urticaria, mastocytosis, gut dysbiosis, and vitamin C or copper deficiency.',
        'Note: association does not mean cause. This list is informational and does not replace evaluation by a doctor.',
      ],
    },
    {
      heading: 'Important notice',
      paragraphs: [
        'This content is educational and does not constitute medical advice, diagnosis, or treatment. If you suspect histamine intolerance, consult a doctor or dietitian.',
      ],
    },
  ],
}
