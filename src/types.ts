export type Provider = 'dhiraagu' | 'ooredoo'
/** Grades, ascending. Platinum is the most elite. */
export type Category = 'silver' | 'gold' | 'platinum'
export type NumberStatus = 'available' | 'reserved' | 'sold'
export type OrderStatus = 'new' | 'contacted' | 'completed' | 'cancelled'

/**
 * Where a sale came from. `website` is the shop's own checkout and is the only
 * value the public can produce; every other value is a sale that happened
 * somewhere else and was written down in the admin panel afterwards.
 *
 * Stored as text with a check constraint rather than a Postgres enum: enum
 * labels cannot be dropped, and this list will be edited as the owner's
 * selling channels change. See supabase/sale-source.sql.
 */
export type SaleSource =
  | 'website'
  | 'facebook-marketplace'
  | 'facebook'
  | 'instagram'
  | 'tiktok'
  | 'viber'
  | 'whatsapp'
  | 'walk-in'
  | 'other'

export interface PhoneNumber {
  id: string
  msisdn: string
  provider: Provider
  category: Category
  patternTags: string[]
  /** Dhivehi versions of patternTags, same order. Optional: numbers created
   * before this field existed (including the seed data) simply lack it, and
   * the customer-facing display falls back to patternTags when it's absent
   * or empty. */
  patternTagsDv?: string[]
  price: number
  promoPrice: number | null
  status: NumberStatus
  isFeatured: boolean
  createdAt: string
}

export interface OrderItem {
  msisdn: string
  provider: Provider
  category: Category
  price: number
}

export interface Order {
  id: string
  orderRef: string
  /** May be empty on a sale recorded by hand: a Marketplace buyer who paid in
   * person does not always leave a name behind. */
  customerName: string
  /** 7 digits, or empty — same reason. */
  customerContact: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  /** Optional only for rows written before off-site sales existed; treat a
   * missing value as 'website', which is what those rows all were. */
  source?: SaleSource
  /** Which site or place, in the owner's own words. Only meaningful when
   * `source` is 'other' — the point of the free-text escape is that the list
   * above will never cover every e-commerce site. */
  sourceDetail?: string | null
  /** Anything the owner wants to remember about the sale. */
  note?: string | null
  /** When the sale happened. For a recorded sale this is backdated to the day
   * it actually took place, not the day it was typed in, so the dashboard's
   * periods stay truthful. */
  createdAt: string
}

export interface PageView {
  path: string
  referrerHost: string | null
  sessionId: string
  createdAt: string
}

export type SortOption = 'number-asc' | 'price-asc' | 'price-desc' | 'newest'

export interface NumberFilters {
  query?: string
  matchMode?: 'contains' | 'endsWith'
  provider?: Provider | 'all'
  category?: Category | 'all'
  minPrice?: number
  maxPrice?: number
  sort?: SortOption
}

export interface CartItem {
  msisdn: string
  provider: Provider
  category: Category
  price: number
}
