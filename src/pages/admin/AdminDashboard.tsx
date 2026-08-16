import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import type { NumberCounts } from '@/data'
import { dataService } from '@/data'
import type { Order, PageView } from '@/types'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

type Period = 'today' | 'month' | 'all'

const PERIOD_LABELS: Record<Period, string> = {
  today: 'Today',
  month: 'This month',
  all: 'All time',
}

// Traffic is aggregated in memory, so the query is capped. If a period ever
// hits the cap the figures are a floor, not a total, and the UI says so.
const VIEW_CAP = 10000

function periodStart(period: Period): Date {
  const now = new Date()
  if (period === 'today') return new Date(now.getFullYear(), now.getMonth(), now.getDate())
  if (period === 'month') return new Date(now.getFullYear(), now.getMonth(), 1)
  return new Date(0)
}

export function AdminDashboard() {
  useDocumentMeta('Dashboard — Salhi Admin')
  const [counts, setCounts] = useState<NumberCounts | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [views, setViews] = useState<PageView[]>([])
  const [period, setPeriod] = useState<Period>('today')
  const [trafficFailed, setTrafficFailed] = useState(false)

  useEffect(() => {
    dataService.getCounts().then(setCounts)
    dataService.listOrders().then(setOrders)
  }, [])

  useEffect(() => {
    let active = true
    setTrafficFailed(false)
    dataService
      .listPageViews(periodStart(period).toISOString(), VIEW_CAP)
      .then((v) => active && setViews(v))
      .catch(() => {
        // Most likely the analytics table has not been created yet. Traffic is
        // an extra, so it degrades on its own without taking sales with it.
        if (active) {
          setViews([])
          setTrafficFailed(true)
        }
      })
    return () => {
      active = false
    }
  }, [period])

  const sales = useMemo(() => {
    const since = periodStart(period).toISOString()
    const inPeriod = orders.filter((o) => o.createdAt >= since)
    const completed = inPeriod.filter((o) => o.status === 'completed')
    // Money not yet confirmed. Shown separately so revenue never silently
    // counts an order that was only ever placed, or one since cancelled.
    const pending = inPeriod.filter((o) => o.status === 'new' || o.status === 'contacted')
    return {
      revenue: completed.reduce((sum, o) => sum + o.total, 0),
      completedCount: completed.length,
      placedCount: inPeriod.length,
      pendingValue: pending.reduce((sum, o) => sum + o.total, 0),
      pendingCount: pending.length,
    }
  }, [orders, period])

  const traffic = useMemo(() => {
    const sessions = new Set(views.map((v) => v.sessionId))
    const byPath = new Map<string, number>()
    const byReferrer = new Map<string, number>()
    for (const v of views) {
      byPath.set(v.path, (byPath.get(v.path) ?? 0) + 1)
      if (v.referrerHost) byReferrer.set(v.referrerHost, (byReferrer.get(v.referrerHost) ?? 0) + 1)
    }
    const top = (m: Map<string, number>) =>
      [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    return {
      pageViews: views.length,
      visits: sessions.size,
      topPaths: top(byPath),
      topReferrers: top(byReferrer),
      capped: views.length >= VIEW_CAP,
    }
  }, [views])

  const recentOrders = orders.slice(0, 5)

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2">
        {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPeriod(p)}
            className={`flex h-10 items-center rounded-full border px-4 text-sm font-medium transition-colors ${
              period === p
                ? 'border-lagoon bg-lagoon text-sand'
                : 'border-border bg-surface text-ink hover:bg-lagoon-soft'
            }`}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          Sales <span className="font-sans text-sm font-normal text-muted">· {PERIOD_LABELS[period]}</span>
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Stat
            label="Revenue"
            value={`MVR ${formatCurrency(sales.revenue)}`}
            hint={`${sales.completedCount} completed`}
            tone="text-lagoon"
          />
          <Stat
            label="Awaiting confirmation"
            value={`MVR ${formatCurrency(sales.pendingValue)}`}
            hint={`${sales.pendingCount} new or contacted`}
            tone="text-gold"
          />
          <Stat label="Orders placed" value={String(sales.placedCount)} tone="text-ink" />
          <Stat
            label="Numbers sold"
            value={counts ? String(counts.sold) : '—'}
            hint="all time"
            tone="text-ink"
          />
        </div>
        <p className="mt-2 text-xs text-muted">
          Revenue counts orders you have marked <strong className="text-ink">completed</strong>. Mark
          them off in Orders as you confirm each one on WhatsApp, or this stays at zero.
        </p>
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">
          Traffic <span className="font-sans text-sm font-normal text-muted">· {PERIOD_LABELS[period]}</span>
        </h2>

        {trafficFailed ? (
          <p className="rounded-xl border border-dashed border-border bg-surface/50 px-4 py-6 text-center text-sm text-muted">
            Traffic is not set up yet. Run <span className="font-numeric text-ink">supabase/analytics.sql</span>{' '}
            in the Supabase SQL editor to start recording visits.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <Stat label="Visits" value={String(traffic.visits)} hint="browsing sessions" tone="text-lagoon" />
              <Stat label="Page views" value={String(traffic.pageViews)} tone="text-ink" />
            </div>

            {traffic.capped && (
              <p className="mt-2 text-xs text-muted">
                Showing the most recent {VIEW_CAP.toLocaleString()} views — the real totals are higher.
              </p>
            )}

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Breakdown title="Most visited" rows={traffic.topPaths} empty="No visits recorded yet." />
              <Breakdown
                title="Coming from"
                rows={traffic.topReferrers}
                empty="No external referrers yet."
              />
            </div>
          </>
        )}
      </section>

      <section>
        <h2 className="mb-3 font-display text-lg font-semibold text-ink">Stock</h2>
        <div className="grid grid-cols-3 gap-3">
          <Stat label="Available" value={counts ? String(counts.available) : '—'} tone="text-lagoon" />
          <Stat label="Reserved" value={counts ? String(counts.reserved) : '—'} tone="text-gold" />
          <Stat label="Sold" value={counts ? String(counts.sold) : '—'} tone="text-muted" />
        </div>
      </section>

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

function Stat({
  label,
  value,
  hint,
  tone,
}: {
  label: string
  value: string
  hint?: string
  tone: string
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className={`font-numeric text-xl font-semibold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs font-medium text-ink">{label}</p>
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  )
}

function Breakdown({
  title,
  rows,
  empty,
}: {
  title: string
  rows: [string, number][]
  empty: string
}) {
  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{title}</p>
      {rows.length === 0 ? (
        <p className="text-sm text-muted">{empty}</p>
      ) : (
        <ul className="flex flex-col gap-1.5">
          {rows.map(([key, count]) => (
            <li key={key} className="flex items-center justify-between gap-3 text-sm">
              <span className="truncate text-ink">{key}</span>
              <span className="font-numeric shrink-0 text-muted">{count}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
