import { numbersSeed } from '@/data/numbers.seed'
import type {
  BulkNumberLine,
  DataService,
  NewNumberInput,
  NewOrderInput,
  NumberCounts,
} from '@/data/dataService'
import type { NumberFilters, Order, OrderStatus, PhoneNumber } from '@/types'
import { getSellingPrice } from '@/utils/format'

const NUMBERS_KEY = 'salhi.numbers.v1'
const ORDERS_KEY = 'salhi.orders.v1'

function readNumbers(): PhoneNumber[] {
  const raw = localStorage.getItem(NUMBERS_KEY)
  if (!raw) {
    localStorage.setItem(NUMBERS_KEY, JSON.stringify(numbersSeed))
    return [...numbersSeed]
  }
  try {
    return JSON.parse(raw) as PhoneNumber[]
  } catch {
    return [...numbersSeed]
  }
}

function writeNumbers(numbers: PhoneNumber[]) {
  localStorage.setItem(NUMBERS_KEY, JSON.stringify(numbers))
}

function readOrders(): Order[] {
  const raw = localStorage.getItem(ORDERS_KEY)
  if (!raw) return []
  try {
    return JSON.parse(raw) as Order[]
  } catch {
    return []
  }
}

function writeOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders))
}

function matchesQuery(digits: string, query: string, mode: 'contains' | 'endsWith'): boolean {
  const q = query.replace(/\s+/g, '')
  if (!q) return true
  if (q.includes('*')) {
    const escaped = q.split('*').map((part) => part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    const pattern = new RegExp(`^${escaped.join('.*')}$`)
    return pattern.test(digits)
  }
  return mode === 'endsWith' ? digits.endsWith(q) : digits.includes(q)
}

function applyFilters(numbers: PhoneNumber[], filters: NumberFilters = {}): PhoneNumber[] {
  let result = numbers

  if (filters.query) {
    result = result.filter((n) => matchesQuery(n.msisdn, filters.query!, filters.matchMode ?? 'contains'))
  }
  if (filters.provider && filters.provider !== 'all') {
    result = result.filter((n) => n.provider === filters.provider)
  }
  if (filters.category && filters.category !== 'all') {
    result = result.filter((n) => n.category === filters.category)
  }
  if (filters.minPrice != null) {
    result = result.filter((n) => getSellingPrice(n) >= filters.minPrice!)
  }
  if (filters.maxPrice != null) {
    result = result.filter((n) => getSellingPrice(n) <= filters.maxPrice!)
  }

  const sort = filters.sort ?? 'newest'
  result = [...result].sort((a, b) => {
    if (sort === 'price-asc') return getSellingPrice(a) - getSellingPrice(b)
    if (sort === 'price-desc') return getSellingPrice(b) - getSellingPrice(a)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return result
}

function makeId(): string {
  return `n-${Math.random().toString(36).slice(2, 10)}`
}

function makeOrderRef(): string {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `SN-${n}`
}

export class LocalDataService implements DataService {
  async listNumbers(filters?: NumberFilters, options?: { includeSold?: boolean }): Promise<PhoneNumber[]> {
    const all = readNumbers()
    const visible = options?.includeSold ? all : all.filter((n) => n.status !== 'sold')
    return applyFilters(visible, filters)
  }

  async getFeaturedNumbers(limit = 6): Promise<PhoneNumber[]> {
    const all = readNumbers().filter((n) => n.status === 'available' && n.isFeatured)
    return all
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  async getLatestNumbers(limit = 8): Promise<PhoneNumber[]> {
    const all = readNumbers().filter((n) => n.status !== 'sold')
    return all
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit)
  }

  async getAvailableCount(): Promise<number> {
    return readNumbers().filter((n) => n.status === 'available').length
  }

  async getNumberByMsisdn(msisdn: string): Promise<PhoneNumber | undefined> {
    return readNumbers().find((n) => n.msisdn === msisdn)
  }

  async addNumber(input: NewNumberInput): Promise<PhoneNumber> {
    const numbers = readNumbers()
    if (numbers.some((n) => n.msisdn === input.msisdn)) {
      throw new Error(`A number with digits ${input.msisdn} already exists.`)
    }
    const created: PhoneNumber = {
      ...input,
      id: makeId(),
      createdAt: new Date().toISOString(),
    }
    numbers.push(created)
    writeNumbers(numbers)
    return created
  }

  async bulkAddNumbers(
    lines: BulkNumberLine[],
    shared: { provider: PhoneNumber['provider']; category: PhoneNumber['category']; price: number },
  ): Promise<{ added: PhoneNumber[]; skipped: string[] }> {
    const numbers = readNumbers()
    const existing = new Set(numbers.map((n) => n.msisdn))
    const added: PhoneNumber[] = []
    const skipped: string[] = []
    const seenInBatch = new Set<string>()

    for (const line of lines) {
      const digits = line.msisdn.replace(/\D/g, '')
      if (digits.length !== 7 || existing.has(digits) || seenInBatch.has(digits)) {
        skipped.push(line.msisdn)
        continue
      }
      seenInBatch.add(digits)
      const created: PhoneNumber = {
        id: makeId(),
        msisdn: digits,
        provider: shared.provider,
        category: shared.category,
        patternTags: [],
        price: line.price ?? shared.price,
        promoPrice: null,
        status: 'available',
        isFeatured: false,
        createdAt: new Date().toISOString(),
      }
      numbers.push(created)
      added.push(created)
    }

    writeNumbers(numbers)
    return { added, skipped }
  }

  async updateNumber(id: string, patch: Partial<NewNumberInput>): Promise<PhoneNumber> {
    const numbers = readNumbers()
    const idx = numbers.findIndex((n) => n.id === id)
    if (idx === -1) throw new Error('Number not found')
    numbers[idx] = { ...numbers[idx], ...patch }
    writeNumbers(numbers)
    return numbers[idx]
  }

  async deleteNumber(id: string): Promise<void> {
    writeNumbers(readNumbers().filter((n) => n.id !== id))
  }

  async bulkMarkSold(ids: string[]): Promise<void> {
    const idSet = new Set(ids)
    writeNumbers(readNumbers().map((n) => (idSet.has(n.id) ? { ...n, status: 'sold' } : n)))
  }

  async bulkDelete(ids: string[]): Promise<void> {
    const idSet = new Set(ids)
    writeNumbers(readNumbers().filter((n) => !idSet.has(n.id)))
  }

  async bulkDiscount(ids: string[], percentOff: number): Promise<void> {
    const idSet = new Set(ids)
    writeNumbers(
      readNumbers().map((n) =>
        idSet.has(n.id)
          ? { ...n, promoPrice: Math.round(n.price * (1 - percentOff / 100)) }
          : n,
      ),
    )
  }

  async listAllNumbersForAdmin(): Promise<PhoneNumber[]> {
    return readNumbers().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async getCounts(): Promise<NumberCounts> {
    const numbers = readNumbers()
    return {
      available: numbers.filter((n) => n.status === 'available').length,
      reserved: numbers.filter((n) => n.status === 'reserved').length,
      sold: numbers.filter((n) => n.status === 'sold').length,
    }
  }

  async createOrder(input: NewOrderInput): Promise<Order> {
    const orders = readOrders()
    const order: Order = {
      id: makeId(),
      orderRef: input.orderRef ?? makeOrderRef(),
      customerName: input.customerName,
      customerContact: input.customerContact,
      items: input.items,
      total: input.total,
      status: 'new',
      createdAt: new Date().toISOString(),
    }
    orders.push(order)
    writeOrders(orders)
    return order
  }

  async listOrders(): Promise<Order[]> {
    return readOrders().sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const orders = readOrders()
    const idx = orders.findIndex((o) => o.id === id)
    if (idx === -1) throw new Error('Order not found')
    orders[idx] = { ...orders[idx], status }
    writeOrders(orders)
    return orders[idx]
  }
}
