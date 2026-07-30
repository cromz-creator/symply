import type { Food } from '../data/types'

export type RiskMechanism = 'H' | 'DAO' | 'L'

/** Vraća oznake mehanizama rizika za namirnicu (H = histamin, DAO, L = liberator). */
export function riskMechanisms(food: Food): RiskMechanism[] {
  const out: RiskMechanism[] = []
  if (food.histamineLevel != null && food.histamineLevel >= 2) out.push('H')
  if (food.isDaoInhibitor) out.push('DAO')
  if (food.isHistamineLiberator) out.push('L')
  return out
}

/** Je li namirnica rizična (barem jedan mehanizam). */
export function isRiskyFood(food: Food): boolean {
  return riskMechanisms(food).length > 0
}

/** Agregira rizične mehanizme preko više namirnica (jedinstveno). */
export function aggregateMechanisms(foods: Food[]): RiskMechanism[] {
  const set = new Set<RiskMechanism>()
  foods.forEach((f) => riskMechanisms(f).forEach((m) => set.add(m)))
  return (['H', 'DAO', 'L'] as RiskMechanism[]).filter((m) => set.has(m))
}
