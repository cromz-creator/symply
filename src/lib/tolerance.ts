import type { Tolerance } from '../data/types'

/** Tailwind klase za pozadinu/tekst po razini podnošljivosti. */
export const toleranceChip: Record<Tolerance, string> = {
  green: 'bg-green-100 text-green-800',
  yellow: 'bg-amber-100 text-amber-800',
  red: 'bg-rose-100 text-rose-800',
}

/** Boja pune točke/trake po podnošljivosti. */
export const toleranceDot: Record<Tolerance, string> = {
  green: 'bg-tol-green',
  yellow: 'bg-tol-yellow',
  red: 'bg-tol-red',
}

export const TOLERANCES: Tolerance[] = ['green', 'yellow', 'red']
