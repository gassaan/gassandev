import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  BulkNumberLine,
  DataService,
  NewNumberInput,
  NewOrderInput,
  NumberCounts,
} from '@/data/dataService'
import type {
  Category,
  NumberFilters,
  NumberStatus,
  Order,
  OrderStatus,
  PageView,
  PhoneNumber,
  Provider,
} from '@/types'

interface NumberRow {
  id: string
  msisdn: string
  provider: Provider
  category: Category
  pattern_tags: string[]
  price: number | string
  promo_price: number | string | null
  status: NumberStatus
  is_featured: boolean
  created_at: string
}

interface PageViewRow {
  path: string
  referrer_host: string | null
  session_id: string
  created_at: string
}

interface OrderRow {
  id: string
  order_ref: string
  customer_name: string
  customer_contact: string
  items: Order['items']
  total: number | string
  status: OrderStatus
  created_at: string
}

// numeric columns come back as strings from postgrest to avoid float rounding;
// the UI formats and compares them as numbers.
const num = (v: number | string) => (typeof v === 'number' ? v : Number(v))

function toNumber(row: NumberRow): PhoneNumber {
  return {
    id: row.id,
    msisdn: row.msisdn,
    provider: row.provider,
    category: row.category,
    patternTags: row.pattern_tags ?? [],
    price: num(row.price),
    promoPrice: row.promo_price == null ? null : num(row.promo_price),
    status: row.status,
    isFeatured: row.is_featured,
    createdAt: row.created_at,
  }
}

function toOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderRef: row.order_ref,
    customerName: row.customer_name,
    customerContact: row.customer_contact,
    items: row.items,
    total: num(row.total),
    status: row.status,
    createdAt: row.created_at,
  }
}

function toNumberPatch(patch: Partial<NewNumberInput>) {
  const row: Record<string, unknown> = {}
  if (patch.msisdn !== undefined) row.msisdn = patch.msisdn
  if (patch.provider !== undefined) row.provider = patch.provider
  if (patch.category !== undefined) row.category = patch.category
  if (patch.patternTags !== undefined) row.pattern_tags = patch.patternTags
  if (patch.price !== undefined) row.price = patch.price
  if (patch.promoPrice !== undefined) row.promo_price = patch.promoPrice
  if (patch.status !== undefined) row.status = patch.status
  if (patch.isFeatured !== undefined) row.is_featured = patch.isFeatured
  return row
}

/**
 * Turns the search box into a SQL LIKE pattern.
 *
 * Everything except digits and `*` is stripped first. That is not only
 * tidying: `%` and `_` are LIKE wildcards, so passing raw input through would
 * let a stray character silently widen the query.
 */
function likePattern(query: string, mode: 'contains' | 'endsWith'): string | null {
  const cleaned = query.replace(/[^\d*]/g, '')
  if (!cleaned) return null
  if (cleaned.includes('*')) return cleaned.replace(/\*/g, '%')
  return mode === 'endsWith' ? `%${cleaned}` : `%${cleaned}%`
}

export class SupabaseDataService implements DataService {
  // Declared and assigned rather than a constructor parameter property: the
  // project builds with erasableSyntaxOnly, which rejects the shorthand.
  private readonly client: SupabaseClient

  constructor(client: SupabaseClient) {
    this.client = client
  }

  private numbers() {
    return this.client.from('numbers')
  }

  async listNumbers(filters: NumberFilters = {}, options?: { includeSold?: boolean }) {
    let q = this.numbers().select('*')

    if (!options?.includeSold) q = q.neq('status', 'sold')

    if (filters.query) {
      const pattern = likePattern(filters.query, filters.matchMode ?? 'contains')
      if (pattern) q = q.like('msisdn', pattern)
    }
    if (filters.provider && filters.provider !== 'all') q = q.eq('provider', filters.provider)
    if (filters.category && filters.category !== 'all') q = q.eq('category', filters.category)
    // selling_price is generated as coalesce(promo_price, price), so a promo
    // number filters and sorts on what it actually costs.
    if (filters.minPrice != null) q = q.gte('selling_price', filters.minPrice)
    if (filters.maxPrice != null) q = q.lte('selling_price', filters.maxPrice)

    const sort = filters.sort ?? 'newest'
    if (sort === 'price-asc') q = q.order('selling_price', { ascending: true })
    else if (sort === 'price-desc') q = q.order('selling_price', { ascending: false })
    else q = q.order('created_at', { ascending: false })

    const { data, error } = await q
    if (error) throw new Error(error.message)
    return (data as NumberRow[]).map(toNumber)
  }

  async getFeaturedNumbers(limit = 6) {
    const { data, error } = await this.numbers()
      .select('*')
      .eq('status', 'available')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)
    return (data as NumberRow[]).map(toNumber)
  }

  async getLatestNumbers(limit = 8) {
    const { data, error } = await this.numbers()
      .select('*')
      .neq('status', 'sold')
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)
    return (data as NumberRow[]).map(toNumber)
  }

  async getAvailableCount() {
    const { count, error } = await this.numbers()
      .select('*', { count: 'exact', head: true })
      .eq('status', 'available')
    if (error) throw new Error(error.message)
    return count ?? 0
  }

  async getNumberByMsisdn(msisdn: string) {
    const { data, error } = await this.numbers().select('*').eq('msisdn', msisdn).maybeSingle()
    if (error) throw new Error(error.message)
    return data ? toNumber(data as NumberRow) : undefined
  }

  async addNumber(input: NewNumberInput) {
    const { data, error } = await this.numbers()
      .insert(toNumberPatch(input))
      .select()
      .single()
    if (error) {
      // 23505 is the unique violation on msisdn; the admin form expects a
      // message it can show rather than a raw postgres string.
      if (error.code === '23505') {
        throw new Error(`A number with digits ${input.msisdn} already exists.`)
      }
      throw new Error(error.message)
    }
    return toNumber(data as NumberRow)
  }

  async bulkAddNumbers(
    lines: BulkNumberLine[],
    shared: { provider: Provider; category: Category; price: number },
  ) {
    const seen = new Set<string>()
    const skipped: string[] = []
    const rows: Record<string, unknown>[] = []

    for (const line of lines) {
      const digits = line.msisdn.replace(/\D/g, '')
      if (digits.length !== 7 || seen.has(digits)) {
        skipped.push(line.msisdn)
        continue
      }
      seen.add(digits)
      rows.push({
        msisdn: digits,
        provider: shared.provider,
        category: shared.category,
        pattern_tags: [],
        price: line.price ?? shared.price,
        promo_price: null,
        status: 'available',
        is_featured: false,
      })
    }

    if (rows.length === 0) return { added: [], skipped }

    // ignoreDuplicates leaves numbers already in stock untouched instead of
    // failing the whole batch on the first collision.
    const { data, error } = await this.numbers()
      .upsert(rows, { onConflict: 'msisdn', ignoreDuplicates: true })
      .select()
    if (error) throw new Error(error.message)

    const added = (data as NumberRow[]).map(toNumber)
    const addedDigits = new Set(added.map((n) => n.msisdn))
    for (const row of rows) {
      const digits = row.msisdn as string
      if (!addedDigits.has(digits)) skipped.push(digits)
    }
    return { added, skipped }
  }

  async updateNumber(id: string, patch: Partial<NewNumberInput>) {
    const { data, error } = await this.numbers()
      .update(toNumberPatch(patch))
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return toNumber(data as NumberRow)
  }

  async deleteNumber(id: string) {
    const { error } = await this.numbers().delete().eq('id', id)
    if (error) throw new Error(error.message)
  }

  async bulkMarkSold(ids: string[]) {
    if (ids.length === 0) return
    const { error } = await this.numbers().update({ status: 'sold' }).in('id', ids)
    if (error) throw new Error(error.message)
  }

  async bulkDelete(ids: string[]) {
    if (ids.length === 0) return
    const { error } = await this.numbers().delete().in('id', ids)
    if (error) throw new Error(error.message)
  }

  async bulkDiscount(ids: string[], percentOff: number) {
    if (ids.length === 0) return
    // Each row's promo depends on its own list price, so this reads the prices
    // back before writing rather than applying one blanket value.
    const { data, error } = await this.numbers().select('id, price').in('id', ids)
    if (error) throw new Error(error.message)

    const factor = 1 - percentOff / 100
    const results = await Promise.all(
      (data as { id: string; price: number | string }[]).map((row) =>
        this.numbers()
          .update({ promo_price: Math.round(num(row.price) * factor) })
          .eq('id', row.id),
      ),
    )
    const failed = results.find((r) => r.error)
    if (failed?.error) throw new Error(failed.error.message)
  }

  async listAllNumbersForAdmin() {
    const { data, error } = await this.numbers()
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as NumberRow[]).map(toNumber)
  }

  async getCounts(): Promise<NumberCounts> {
    const statuses: NumberStatus[] = ['available', 'reserved', 'sold']
    const results = await Promise.all(
      statuses.map((status) =>
        this.numbers().select('*', { count: 'exact', head: true }).eq('status', status),
      ),
    )
    const failed = results.find((r) => r.error)
    if (failed?.error) throw new Error(failed.error.message)
    return {
      available: results[0].count ?? 0,
      reserved: results[1].count ?? 0,
      sold: results[2].count ?? 0,
    }
  }

  async createOrder(input: NewOrderInput): Promise<Order> {
    const orderRef = input.orderRef ?? `SN-${Math.floor(1000 + Math.random() * 9000)}`
    const row = {
      order_ref: orderRef,
      customer_name: input.customerName,
      customer_contact: input.customerContact,
      items: input.items,
      total: input.total,
    }

    // Deliberately no .select(): the public may insert an order but has no
    // read policy, since orders carry customer names and phone numbers.
    // Asking for the row back would fail RLS on every customer checkout.
    const { error } = await this.client.from('orders').insert(row)
    if (error) throw new Error(error.message)

    return {
      id: orderRef,
      orderRef,
      customerName: input.customerName,
      customerContact: input.customerContact,
      items: input.items,
      total: input.total,
      status: 'new',
      createdAt: new Date().toISOString(),
    }
  }

  async recordPageView(view: Omit<PageView, 'createdAt'>) {
    // No .select(): the public may insert a view but has no read policy, so
    // asking for the row back would fail RLS on every visitor.
    const { error } = await this.client.from('page_views').insert({
      path: view.path,
      referrer_host: view.referrerHost,
      session_id: view.sessionId,
    })
    if (error) throw new Error(error.message)
  }

  async listPageViews(sinceIso: string, limit = 10000) {
    const { data, error } = await this.client
      .from('page_views')
      .select('path, referrer_host, session_id, created_at')
      .gte('created_at', sinceIso)
      .order('created_at', { ascending: false })
      .limit(limit)
    if (error) throw new Error(error.message)
    return (data as PageViewRow[]).map((row) => ({
      path: row.path,
      referrerHost: row.referrer_host,
      sessionId: row.session_id,
      createdAt: row.created_at,
    }))
  }

  async listOrders() {
    const { data, error } = await this.client
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw new Error(error.message)
    return (data as OrderRow[]).map(toOrder)
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    const { data, error } = await this.client
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw new Error(error.message)
    return toOrder(data as OrderRow)
  }
}
