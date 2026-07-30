# Symply

PWA (mobile-first) za praćenje **histaminske intolerancije**: opći popis namirnica s
klasifikacijom (visok histamin / DAO inhibitor / oslobađatelj), osobne namirnice i bilješke te
dnevnik reakcija za prepoznavanje obrazaca.

> ⚠️ Edukativni alat, **nije medicinski savjet**. Klasifikacije su okvirne i uredive.

## Tehnologija

- **Vite + React + TypeScript** — mobile-first UI
- **Dexie (IndexedDB)** — lokalna pohrana (local-first, radi offline)
- **Tailwind CSS** — stil (tema preko CSS varijabli u `src/index.css`)
- **i18next** — hrvatski / engleski
- **vite-plugin-pwa** — instalabilna offline aplikacija

## Pokretanje

Potreban je **Node.js (LTS)** — https://nodejs.org

```bash
npm install
npm run dev
```

Otvori adresu koju ispiše Vite (npr. http://localhost:5173).

### Ostale naredbe

```bash
npm run build     # produkcijski build
npm run preview   # pregled builda (uklj. PWA/offline)
```

## Struktura

```
src/
  data/
    db.ts                 # Dexie shema
    types.ts              # tipovi
    categories.ts         # kategorije namirnica
    symptoms.ts           # kontrolirani popis simptoma
    references.json       # znanstveni izvori (ekran "Izvori")
    repositories/         # pristup podacima (foods, foodNotes, reactions, settings)
    seed/                 # kurirani popis namirnica + loader
  i18n/                   # hr/en prijevodi
  components/             # dijeljene UI komponente
  pages/                  # ekrani (Foods, Diary, References, Settings…)
  lib/                    # pomoćne funkcije (nazivi, boje podnošljivosti)
```

## Podaci i budućnost

Sav pristup podacima ide kroz `src/data/repositories/*`, a zapisi već imaju `userId` i
`updatedAt`. Time je pripremljen **local-first** put ka kasnijem dodavanju računa +
sinkronizacije + premium značajki (npr. napredna analitika dnevnika) bez prepisivanja UI-a.

Vizualni identitet (ime, boje, logo) je zasad generičan; dorađuje se kasnije kroz Claude Design
mijenjanjem CSS varijabli u `src/index.css`.
