import type { NumberFilters, Order, OrderStatus, PageView, PhoneNumber } from '@/types'

export interface NumberCounts {
  available: number
  reserved: number
  sold: number
}

export interface NewNumberInput {
  msisdn: string
  provider: PhoneNumber['provider']
  category: PhoneNumber['category']
  patternTags: string[]
  patternTagsDv: string[]
  price: number
  promoPrice: number | null
  status: PhoneNumber['status']
  isFeatured: boolean
}

export interface BulkNumberLine {
  msisdn: string
  price?: number
}

export interface NewOrderInput {
  orderRef?: string
  customerName: string
  customerContact: string
  items: Order['items']
  total: number
}

/**
 * Storage-agnostic contract for the shop's data. The local implementation
 * (localDataService.ts) backs the app today; a Supabase implementation can
 * satisfy the same interface without touching any component.
 */
export interface DataService {
  listNumbers(filters?: NumberFilters, options?: { includeSold?: boolean }): Promise<PhoneNumber[]>
  getFeaturedNumbers(limit?: number): Promise<PhoneNumber[]>
  getLatestNumbers(limit?: number): Promise<PhoneNumber[]>
  getAvailableCount(): Promise<number>
  getNumberByMsisdn(msisdn: string): Promise<PhoneNumber | undefined>

  addNumber(input: NewNumberInput): Promise<PhoneNumber>
  bulkAddNumbers(
    lines: BulkNumberLine[],
    shared: { provider: PhoneNumber['provider']; category: PhoneNumber['category']; price: number },
  ): Promise<{ added: PhoneNumber[]; skipped: string[] }>
  updateNumber(id: string, patch: Partial<NewNumberInput>): Promise<PhoneNumber>
  deleteNumber(id: string): Promise<void>
  bulkMarkSold(ids: string[]): Promise<void>
  bulkDelete(ids: string[]): Promise<void>
  bulkDiscount(ids: string[], percentOff: number): Promise<void>
  listAllNumbersForAdmin(): Promise<PhoneNumber[]>
  getCounts(): Promise<NumberCounts>

  createOrder(input: NewOrderInput): Promise<Order>
  listOrders(): Promise<Order[]>
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>

  /** Fire-and-forget: a failure here must never affect the page. */
  recordPageView(view: Omit<PageView, 'createdAt'>): Promise<void>
  /**
   * Views since an ISO timestamp, newest first and capped, since the caller
   * aggregates in memory. The cap is what keeps a busy month from pulling
   * every row over the wire; the dashboard says when it has been hit rather
   * than quietly reporting a low number.
   */
  listPageViews(sinceIso: string, limit?: number): Promise<PageView[]>
}
