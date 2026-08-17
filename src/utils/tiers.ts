import type { Category } from '@/types'

/** Ascending: Platinum is the most elite. Drives filter order everywhere. */
export const TIERS: readonly Category[] = ['silver', 'gold', 'platinum']

interface Tier {
  label: string
  /** Card surface, border, and — on the dark grades — local ink and muted values. */
  card: string
  /** The metallic treatment on the number itself. */
  number: string
  /** The grade chip in the card corner. */
  badge: string
  /** Accent for the price, matched to the grade's metal. */
  price: string
}

export const TIER: Record<Category, Tier> = {
  silver: { label: 'Silver', card: 'tier-silver', number: 'num-silver', badge: 'badge-silver', price: 'price-silver' },
  gold: { label: 'Gold', card: 'tier-gold', number: 'num-gold', badge: 'badge-gold', price: 'price-gold' },
  platinum: { label: 'Platinum', card: 'tier-platinum', number: 'num-platinum', badge: 'badge-platinum', price: 'price-platinum' },
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

export function tierLabel(value: string): string {
  return TIER[asTier(value)].label
}
