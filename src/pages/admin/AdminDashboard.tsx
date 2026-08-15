import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import type { NumberCounts } from '@/data'
import { dataService } from '@/data'
import type { Order } from '@/types'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function AdminDashboard() {
  useDocumentMeta('Dashboard — Salhi Admin')
  const [counts, setCounts] = useState<NumberCounts | null>(null)
  const [recentOrders, setRecentOrders] = useState<Order[]>([])

  useEffect(() => {
    dataService.getCounts().then(setCounts)
    dataService.listOrders().then((orders) => setRecentOrders(orders.slice(0, 5)))
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-3 gap-3">
        <StatCard label="Available" value={counts?.available} color="text-lagoon" />
        <StatCard label="Reserved" value={counts?.reserved} color="text-gold" />
        <StatCard label="Sold" value={counts?.sold} color="text-muted" />
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Recent orders</h2>
          <Link to="/admin/orders" className="text-sm font-medium text-lagoon hover:underline">
            View all
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-8 text-center text-sm text-muted">
            No orders yet.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between rounded-xl border border-border bg-surface p-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {order.customerName} <span className="font-numeric text-muted">· {order.orderRef}</span>
                  </p>
                  <p className="text-xs text-muted">
                    {order.items.length} number{order.items.length === 1 ? '' : 's'} ·{' '}
                    {order.items.map((i) => formatMsisdn(i.msisdn)).join(', ')}
                  </p>
                </div>
                <p className="font-numeric font-semibold text-ink">MVR {formatCurrency(order.total)}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

function StatCard({ label, value, color }: { label: string; value?: number; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4 text-center">
      <p className={`font-numeric text-2xl font-semibold ${color}`}>{value ?? '—'}</p>
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  )
}
