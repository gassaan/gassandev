export type Provider = 'dhiraagu' | 'ooredoo'
/** Grades, ascending. Platinum is the most elite. */
export type Category = 'silver' | 'gold' | 'premium' | 'platinum'
export type NumberStatus = 'available' | 'reserved' | 'sold'
export type OrderStatus = 'new' | 'contacted' | 'completed' | 'cancelled'

export interface PhoneNumber {
  id: string
  msisdn: string
  provider: Provider
  category: Category
  patternTags: string[]
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
  customerName: string
  customerContact: string
  items: OrderItem[]
  total: number
  status: OrderStatus
  createdAt: string
}

export interface PageView {
  path: string
  referrerHost: string | null
  sessionId: string
  createdAt: string
}

export type SortOption = 'price-asc' | 'price-desc' | 'newest'

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
