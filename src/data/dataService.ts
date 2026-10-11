import type { NumberFilters, Order, OrderStatus, PageView, PhoneNumber, SaleSource } from '@/types'

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
 * A sale that happened somewhere other than this website — Facebook
 * Marketplace, Viber, a walk-in — written down after the fact by the owner.
 *
 * Deliberately a separate input from NewOrderInput rather than optional fields
 * on it: a website order is submitted by a customer and is always 'new' and
 * always dated now, while a recorded sale is entered by staff, carries the
 * channel it came from, and is usually already completed and often backdated.
 * Letting the public-facing path set any of that would be a way to forge a
 * completed sale.
 */
export interface NewSaleInput {
  source: SaleSource
  /** Free text, only read when `source` is 'other'. */
  sourceDetail?: string
  customerName: string
  /** 7 digits, or empty when the buyer left no number. */
  customerContact: string
  items: Order['items']
  total: number
  status: OrderStatus
  note?: string
  /** ISO timestamp of when the sale happened. Defaults to now. */
  soldAt?: string
  /**
   * Stock rows to flip to `sold`, for the items that were listed on the site.
   * A number sold off-site that was never in the catalogue has no id and
   * simply is not in this list.
   */
  markSoldIds?: string[]
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
  /**
   * Records a sale made off-site and marks the numbers it covers as sold, as
   * one action — the two always belong together, so the orchestration lives
   * here rather than in the admin form.
   */
  recordSale(input: NewSaleInput): Promise<Order>
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
