import { useEffect, useState } from 'react'
import { MessageCircle } from 'lucide-react'
import { dataService } from '@/data'
import type { Order, OrderStatus } from '@/types'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const STATUS_OPTIONS: OrderStatus[] = ['new', 'contacted', 'completed', 'cancelled']

const STATUS_STYLES: Record<OrderStatus, string> = {
  new: 'bg-lagoon-soft text-lagoon',
  contacted: 'bg-gold-soft text-gold',
  completed: 'bg-lagoon text-sand',
  cancelled: 'bg-muted/15 text-muted',
}

export function AdminOrders() {
  useDocumentMeta('Orders — Salhi Admin')
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

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

  if (loading) return <p className="text-sm text-muted">Loading orders…</p>

  if (orders.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-10 text-center text-sm text-muted">
        No orders submitted yet.
      </p>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <div key={order.id} className="rounded-xl border border-border bg-surface p-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-ink">{order.customerName}</p>
              <p className="font-numeric text-sm text-muted">+960 {order.customerContact}</p>
            </div>
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${STATUS_STYLES[order.status]}`}>
              {order.status}
            </span>
          </div>

          <div className="mt-3 flex flex-col gap-1 border-t border-border pt-3">
            {order.items.map((item) => (
              <div key={item.msisdn} className="flex items-center justify-between text-sm">
                <span className="font-numeric text-ink">{formatMsisdn(item.msisdn)}</span>
                <span className="text-muted capitalize">{item.provider} · {item.category}</span>
                <span className="font-numeric text-ink">MVR {formatCurrency(item.price)}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
            <div>
              <p className="text-xs text-muted">{new Date(order.createdAt).toLocaleString()}</p>
              <p className="font-numeric font-semibold text-ink">Total MVR {formatCurrency(order.total)}</p>
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
              <a
                href={`https://wa.me/960${order.customerContact}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`Chat with ${order.customerName} on WhatsApp`}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-lagoon text-sand hover:bg-lagoon/90"
              >
                <MessageCircle size={16} />
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
