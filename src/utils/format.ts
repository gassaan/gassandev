import type { PhoneNumber } from '@/types'

// U+2066/U+2069 (LRI/PDI) wrap the number in a Unicode directional isolate.
// The formatted string is two digit groups separated by a space with no
// letters to anchor direction, so when it gets embedded in a larger Dhivehi
// phrase (a toast, an aria-label, the WhatsApp message) — anywhere it isn't
// its own DOM element that can take a plain dir="ltr" — the bidi algorithm
// reorders the groups instead of keeping them in source order. The isolate
// marks travel with the string itself, so they protect every call site,
// including ones outside our control like WhatsApp's own renderer.
export function formatMsisdn(digits: string): string {
  return `⁦${digits.slice(0, 3)} ${digits.slice(3)}⁩`
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
