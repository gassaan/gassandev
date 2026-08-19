import type { Category } from '@/types'
import type { Translations } from '@/i18n/types'

/** Ascending: Platinum is the most elite. Drives filter order everywhere. */
export const TIERS: readonly Category[] = ['silver', 'gold', 'platinum']

interface Tier {
  label: string
}

// Every grade now shares one flat card style (see NumberCard), so this map
// carries only the English fallback label — asTier() and tierLabel() below
// are still how every lookup goes through, unchanged.
export const TIER: Record<Category, Tier> = {
  silver: { label: 'Silver' },
  gold: { label: 'Gold' },
  platinum: { label: 'Platinum' },
}

// An order stores the grade as it was at the time of purchase, and the grades
// have been reworked twice, so an old row can still read `nice`/`regular` from
// the original two-value scheme or `premium` from the four-grade one. Reading
// one back to render a cart or an order list must not throw, hence every
// lookup goes through here rather than indexing TIER directly.
//
// `premium` maps down to Gold rather than up to Platinum on purpose: Platinum
// is meant to be the rare one, and quietly promoting a batch of numbers into
// it would blunt exactly the signal it exists to send.
const LEGACY: Record<string, Category> = { nice: 'gold', regular: 'silver', premium: 'gold' }

export function asTier(value: string): Category {
  return value in TIER ? (value as Category) : (LEGACY[value] ?? 'silver')
}

export function tierLabel(value: string, t?: Translations): string {
  const tier = asTier(value)
  return t ? t.tiers[tier] : TIER[tier].label
}
