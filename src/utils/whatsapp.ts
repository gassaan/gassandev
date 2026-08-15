import type { CartItem } from '@/types'
import { formatCurrency, formatMsisdn } from '@/utils/format'

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
}): string {
  const { name, contact, items, total, orderRef } = params
  const lines = items
    .map(
      (n, i) =>
        `${i + 1}. ${formatMsisdn(n.msisdn)} — ${capitalize(n.provider)} — ${capitalize(n.category)} — MVR ${formatCurrency(n.price)}`,
    )
    .join('\n')

  return `*New Order — Salhi Numbers*\n\n*Name:* ${name}\n*Contact:* +960 ${contact}\n\n*Numbers:*\n${lines}\n\n*Total:* MVR ${formatCurrency(total)}\n*Order ref:* ${orderRef}`
}

export function buildWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
