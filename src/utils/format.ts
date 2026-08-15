import type { PhoneNumber } from '@/types'

export function formatMsisdn(digits: string): string {
  return `${digits.slice(0, 3)} ${digits.slice(3)}`
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(amount)
}

export function getSellingPrice(n: Pick<PhoneNumber, 'price' | 'promoPrice'>): number {
  return n.promoPrice ?? n.price
}

export function getSavePercent(n: Pick<PhoneNumber, 'price' | 'promoPrice'>): number {
  if (!n.promoPrice || n.promoPrice >= n.price) return 0
  return Math.round(((n.price - n.promoPrice) / n.price) * 100)
}
