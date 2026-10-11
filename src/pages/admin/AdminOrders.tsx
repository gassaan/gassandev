import { useEffect, useMemo, useState } from 'react'
import { MessageCircle, Plus } from 'lucide-react'
import { dataService } from '@/data'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { SALE_SOURCE, orderSource, sourceLabel } from '@/utils/saleSources'
import { RecordSaleModal } from '@/pages/admin/RecordSaleModal'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const STATUS_OPTIONS: OrderStatus[] = ['new', 'contacted', 'completed', 'cancelled']

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: 'bg-lagoon-soft text-lagoon',
  contacted: 'bg-gold-soft text-gold',
  completed: 'bg-lagoon text-sand',
  cancelled: 'bg-muted/15 text-muted',
}

type Where = 'all' | 'website' | 'offsite'

const WHERE_LABELS: Record<Where, string> = {
  all: 'All',
  website: 'Website',
  offsite: 'Recorded by hand',
}

export function AdminOrders() {
  useDocumentMeta('Orders — Salhi Admin')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [where, setWhere] = useState<Where>('all')
  const [showRecord, setShowRecord] = useState(false)

  useEffect(() => {
    dataService.listOrders().then((o) => {
      setOrders(o)
      setLoading(false)
    })
  }, [])

  async function handleStatusChange(order: Order, status: OrderStatus) {
    setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status } : o)))
    await dataService.updateOrderStatus(order.id, status)
  }

  const visible = useMemo(() => {
    if (where === 'all') return orders
    const wantWebsite = where === 'website'
    return orders.filter((o) => (orderSource(o) === 'website') === wantWebsite)
  }, [orders, where])

  const offsiteCount = orders.filter((o) => orderSource(o) !== 'website').length

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-lg font-semibold text-ink">Orders &amp; sales</h1>
        <button
          type="button"
          onClick={() => setShowRecord(true)}
          className="flex h-11 items-center gap-1.5 rounded-full bg-lagoon px-4 text-sm font-semibold text-sand hover:bg-lagoon/90"
        >
          <Plus size={16} /> Record a sale
        </button>
      </div>

      {/* The filter only earns its place once there is something to separate:
          with no recorded sales every order is a website order. */}
      {offsiteCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {(Object.keys(WHERE_LABELS) as Where[]).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWhere(w)}
              aria-pressed={where === w}
              className={`flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
                where === w
                  ? 'border-lagoon bg-lagoon text-sand'
                  : 'border-border bg-surface text-ink hover:bg-lagoon-soft'
              }`}
            >
              {WHERE_LABELS[w]}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted">Loading orders…</p>
      ) : visible.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-10 text-center text-sm text-muted">
          {orders.length === 0
            ? 'No orders yet. Sold a number on Facebook Marketplace or in person? Record it here.'
            : 'Nothing in this view.'}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((order) => {
            const source = orderSource(order)
            return (
              <div key={order.id} className="rounded-xl border border-border bg-surface p-4">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    {/* A Marketplace buyer who paid in person often leaves no
                        name, and a blank line there reads as a bug. */}
                    {order.customerName ? (
                      <p className="font-semibold text-ink">{order.customerName}</p>
                    ) : (
                      <p className="font-semibold text-muted italic">No buyer name</p>
                    )}
                    {order.customerContact ? (
                      <p className="font-numeric text-sm text-muted">+960 {order.customerContact}</p>
                    ) : (
                      <p className="text-sm text-muted">No contact recorded</p>
                    )}
                  </div>
                  <div className="flex shrink-0 flex-wrap items-center gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold ${SALE_SOURCE[source].badge}`}
                    >
                      {sourceLabel(order)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
                  {order.items.map((item) => (
                    <div key={item.msisdn} className="flex items-center justify-between text-sm">
                      <span className="font-numeric text-ink">{formatMsisdn(item.msisdn)}</span>
                      <span className="text-muted capitalize">
                        {item.provider} · {item.category}
                      </span>
                      <span className="font-numeric text-ink">MVR {formatCurrency(item.price)}</span>
                    </div>
                  ))}
                </div>

                {order.note && (
                  <p className="mt-3 border-t border-border pt-3 text-sm text-muted">{order.note}</p>
                )}

                <div className="mt-3 flex items-center justify-between gap-3 border-t border-border pt-3">
                  <div>
                    <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
                    <p className="font-numeric font-semibold text-ink">
                      Total MVR {formatCurrency(order.total)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order, e.target.value as OrderStatus)}
                      aria-label={`Status for order ${order.orderRef}`}
                      className="h-10 rounded-full border border-border bg-surface px-3 text-sm font-medium text-ink capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="capitalize">
                          {s}
                        </option>
                      ))}
                    </select>
                    {/* No contact, no link: href="https://wa.me/960" opens a
                        dead WhatsApp page rather than doing nothing. */}
                    {order.customerContact && (
                      <a
                        href={`https://wa.me/960${order.customerContact}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Chat with ${order.customerName || 'the buyer'} on WhatsApp`}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-lagoon text-sand hover:bg-lagoon/90"
                      >
                        <MessageCircle size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showRecord && (
        <RecordSaleModal
          onClose={() => setShowRecord(false)}
          onRecorded={(order) =>
            setOrders((prev) =>
              [order, ...prev].sort(
                (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
              ),
            )
          }
        />
      )}
    </div>
  )
}
