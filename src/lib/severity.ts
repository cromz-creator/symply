import type { Severity } from '../data/types'

/**
 * Boja po jačini reakcije: svijetlo crvena (1) → tamno crvena (5).
 * Vraća HEX (za inline stilove na baru i točkama).
 */
const SEVERITY_COLORS: Record<Severity, string> = {
  1: '#fca5a5', // red-300
  2: '#f87171', // red-400
  3: '#ef4444', // red-500
  4: '#b91c1c', // red-700
  5: '#7f1d1d', // red-900
}

export function severityColor(severity: Severity): string {
  return SEVERITY_COLORS[severity]
}
