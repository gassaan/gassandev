import type { Order, SaleSource } from '@/types'

interface SourceMeta {
  label: string
  /** Chip classes (background + text) for the badge in the orders list. */
  badge: string
}

/**
 * The selling channels, website first and `other` last. Order here drives the
 * dropdown in Record a sale and the breakdown on the dashboard.
 *
 * Admin-only, so these labels are English only — the admin panel is
 * deliberately outside the Dhivehi/RTL toggle (see LanguageContext).
 */
// The website is the quiet baseline — most orders are website orders, and its
// badge sat right next to the violet "new" status chip and read as part of it.
// Everything sold off-site wears the gold so it stands out in a long list.
export const SALE_SOURCE: Record<SaleSource, SourceMeta> = {
  website: { label: 'Website', badge: 'bg-muted/15 text-muted' },
  'facebook-marketplace': { label: 'Facebook Marketplace', badge: 'bg-gold-soft text-gold' },
  facebook: { label: 'Facebook', badge: 'bg-gold-soft text-gold' },
  instagram: { label: 'Instagram', badge: 'bg-gold-soft text-gold' },
  tiktok: { label: 'TikTok', badge: 'bg-gold-soft text-gold' },
  viber: { label: 'Viber', badge: 'bg-gold-soft text-gold' },
  whatsapp: { label: 'WhatsApp', badge: 'bg-gold-soft text-gold' },
  'walk-in': { label: 'Walk-in / in person', badge: 'bg-gold-soft text-gold' },
  other: { label: 'Somewhere else', badge: 'bg-gold-soft text-gold' },
}

export const SALE_SOURCES = Object.keys(SALE_SOURCE) as SaleSource[]

/** Every channel except the shop's own checkout — i.e. what you can record. */
export const OFFSITE_SALE_SOURCES = SALE_SOURCES.filter((s) => s !== 'website')

/**
 * The source of an order, defaulting rows that predate the column to
 * 'website'. Every such row *was* a website checkout, since that was the only
 * way an order could exist, so this is a back-fill rather than a guess.
 */
export function orderSource(order: Pick<Order, 'source'>): SaleSource {
  const value = order.source
  return value && value in SALE_SOURCE ? value : 'website'
}

/**
 * What to show as the channel: the owner's own words when they picked
 * "somewhere else" and said where, otherwise the channel's label.
 */
export function sourceLabel(order: Pick<Order, 'source' | 'sourceDetail'>): string {
  const source = orderSource(order)
  const detail = order.sourceDetail?.trim()
  if (source === 'other' && detail) return detail
  return SALE_SOURCE[source].label
}
