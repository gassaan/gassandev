import type { CartItem } from '@/types'
import type { Translations } from '@/i18n/types'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { tierLabel } from '@/utils/tiers'

export const WHATSAPP_NUMBER = '9607669999'

export function generateOrderRef(): string {
  const n = Math.floor(1000 + Math.random() * 9000)
  return `SN-${n}`
}

export function buildOrderMessage(params: {
  name: string
  contact: string
  items: CartItem[]
  total: number
  orderRef: string
  t: Translations
}): string {
  const { name, contact, items, total, orderRef, t } = params
  const lines = items
    .map(
      (n, i) =>
        `${i + 1}. ${formatMsisdn(n.msisdn)} — ${t.providers[n.provider]} — ${tierLabel(n.category, t)} — MVR ${formatCurrency(n.price)}`,
    )
    .join('\n')

  return `*${t.whatsapp.heading} — Salhi Numbers*\n\n*${t.whatsapp.name}:* ${name}\n*${t.whatsapp.contact}:* +960 ${contact}\n\n*${t.whatsapp.numbers}:*\n${lines}\n\n*${t.whatsapp.total}:* MVR ${formatCurrency(total)}\n*${t.whatsapp.orderRef}:* ${orderRef}`
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}
