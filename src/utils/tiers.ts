import type { Category } from '@/types'

/** Ascending: Platinum is the most elite. Drives filter order everywhere. */
export const TIERS: readonly Category[] = ['silver', 'gold', 'premium', 'platinum']

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
  premium: { label: 'Premium', card: 'tier-premium', number: 'num-premium', badge: 'badge-premium', price: 'price-premium' },
  platinum: { label: 'Platinum', card: 'tier-platinum', number: 'num-platinum', badge: 'badge-platinum', price: 'price-platinum' },
}

// An order stores the grade as it was at the time of purchase, so rows placed
// before this change still carry the old two-value scheme. Reading one back to
// render a cart or an order list must not throw, hence every lookup goes
// through here rather than indexing TIER directly.
const LEGACY: Record<string, Category> = { nice: 'gold', regular: 'silver' }

export function asTier(value: string): Category {
  return value in TIER ? (value as Category) : (LEGACY[value] ?? 'silver')
}

export function tierLabel(value: string): string {
  return TIER[asTier(value)].label
}
