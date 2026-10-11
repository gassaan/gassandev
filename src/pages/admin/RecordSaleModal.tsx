import { useState } from 'react'
import { Check, Plus, Search, X } from 'lucide-react'
import { Modal } from '@/components/Modal'
import { dataService } from '@/data'
import type { Category, Order, OrderStatus, Provider, SaleSource } from '@/types'
import { formatCurrency } from '@/utils/format'
import { OFFSITE_SALE_SOURCES, SALE_SOURCE } from '@/utils/saleSources'
import { TIER, TIERS } from '@/utils/tiers'

// Split so the two inputs that share a row can set their own width. Appending
// a `w-*` utility to the full-width class would not reliably win: Tailwind
// orders the generated CSS, not the class attribute.
const fieldBase =
  'h-11 rounded-xl border border-border bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon'
const fieldClass = `${fieldBase} w-full`

const STATUS_OPTIONS: OrderStatus[] = ['completed', 'new', 'contacted']

/** One number in the sale. */
interface SaleRow {
  key: number
  msisdn: string
  provider: Provider
  category: Category
  price: string
  /**
   * The catalogue row these digits matched, once looked up. `null` once the
   * lookup has run and found nothing — a number sold off-site that was never
   * listed here, which is recorded as a one-off and changes no stock.
   */
  stock: { id: string; status: string } | null
  lookedUp: boolean
  looking: boolean
}

let nextKey = 1

function blankRow(): SaleRow {
  return {
    key: nextKey++,
    msisdn: '',
    provider: 'dhiraagu',
    category: 'silver',
    price: '',
    stock: null,
    lookedUp: false,
    looking: false,
  }
}

function todayLocal(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}

/**
 * A date picked in the form, as an instant.
 *
 * Today keeps the real clock time so several sales recorded on the same day
 * still order correctly; any other day is pinned to local noon, which is far
 * enough from both midnights that the date cannot slide into the day either
 * side once it is stored as UTC.
 */
function toIso(day: string): string {
  if (day === todayLocal()) return new Date().toISOString()
  return new Date(`${day}T12:00:00`).toISOString()
}

/**
 * Writes down a sale that happened somewhere other than this website.
 *
 * Numbers typed in here are looked up in the catalogue: a match fills in its
 * grade and price and will be marked sold, and a number that was never listed
 * is recorded as a one-off. That is the whole reason this is not just "mark
 * sold" in Numbers — the sale needs a buyer, a price actually paid, the day it
 * happened and, above all, the channel it came from.
 */
export function RecordSaleModal({
  onClose,
  onRecorded,
}: {
  onClose: () => void
  onRecorded: (order: Order) => void
}) {
  const [source, setSource] = useState<SaleSource>('facebook-marketplace')
  const [sourceDetail, setSourceDetail] = useState('')
  const [rows, setRows] = useState<SaleRow[]>([blankRow()])
  const [customerName, setCustomerName] = useState('')
  const [customerContact, setCustomerContact] = useState('')
  const [status, setStatus] = useState<OrderStatus>('completed')
  const [soldOn, setSoldOn] = useState(todayLocal())
  const [note, setNote] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const total = rows.reduce((sum, row) => sum + (Number(row.price) || 0), 0)

  function patchRow(key: number, patch: Partial<SaleRow>) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, ...patch } : row)))
  }

  async function handleDigits(key: number, raw: string) {
    const digits = raw.replace(/\D/g, '').slice(0, 7)
    // Editing the digits invalidates whatever the last lookup said.
    patchRow(key, { msisdn: digits, stock: null, lookedUp: false, looking: digits.length === 7 })
    if (digits.length !== 7) return

    try {
      const found = await dataService.getNumberByMsisdn(digits)
      setRows((prev) =>
        prev.map((row) => {
          // The field may have moved on while the lookup was in flight, in
          // which case this answer is about digits that are no longer there.
          if (row.key !== key || row.msisdn !== digits) return row
          if (!found) return { ...row, stock: null, lookedUp: true, looking: false }
          return {
            ...row,
            provider: found.provider,
            category: found.category,
            // The price asked for, as a starting point — it stays editable,
            // because an off-site sale is usually a haggled one.
            price: String(found.promoPrice ?? found.price),
            stock: { id: found.id, status: found.status },
            lookedUp: true,
            looking: false,
          }
        }),
      )
    } catch {
      patchRow(key, { lookedUp: false, looking: false })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (source === 'other' && !sourceDetail.trim()) {
      setError('Say where the sale came from.')
      return
    }
    const filled = rows.filter((row) => row.msisdn || row.price)
    if (filled.length === 0) {
      setError('Add at least one number.')
      return
    }
    if (filled.some((row) => row.msisdn.length !== 7)) {
      setError('Every number must be exactly 7 digits.')
      return
    }
    if (new Set(filled.map((row) => row.msisdn)).size !== filled.length) {
      setError('The same number is listed twice.')
      return
    }
    if (filled.some((row) => !row.price || !(Number(row.price) > 0))) {
      setError('Enter the price paid for every number.')
      return
    }
    if (customerContact && customerContact.length !== 7) {
      setError('A contact number must be exactly 7 digits, or left empty.')
      return
    }
    if (soldOn > todayLocal()) {
      setError('The sale date cannot be in the future.')
      return
    }

    setSubmitting(true)
    try {
      const recorded = await dataService.recordSale({
        source,
        sourceDetail: source === 'other' ? sourceDetail : undefined,
        customerName: customerName.trim(),
        customerContact,
        items: filled.map((row) => ({
          msisdn: row.msisdn,
          provider: row.provider,
          category: row.category,
          price: Number(row.price),
        })),
        total: filled.reduce((sum, row) => sum + Number(row.price), 0),
        status,
        note,
        soldAt: toIso(soldOn),
        // Only numbers that are actually in the catalogue, and only ones not
        // already sold — re-flagging a sold number is a no-op, but leaving it
        // out keeps the write to exactly what it needs to touch.
        markSoldIds: filled
          .filter((row) => row.stock && row.stock.status !== 'sold')
          .map((row) => row.stock!.id),
      })
      onRecorded(recorded)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not record the sale.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Record a sale" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p className="text-xs leading-relaxed text-muted">
          For numbers sold away from the website — Facebook Marketplace, Viber, in person. Numbers
          already in your stock are marked <strong className="text-ink">sold</strong> for you.
        </p>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Where was it sold?
            <select
              value={source}
              onChange={(e) => setSource(e.target.value as SaleSource)}
              className={fieldClass}
            >
              {OFFSITE_SALE_SOURCES.map((s) => (
                <option key={s} value={s}>
                  {SALE_SOURCE[s].label}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm text-ink">
            Date of sale
            <input
              type="date"
              value={soldOn}
              max={todayLocal()}
              onChange={(e) => setSoldOn(e.target.value)}
              className={`${fieldClass} font-numeric`}
            />
          </label>
        </div>

        {source === 'other' && (
          <label className="flex flex-col gap-1 text-sm text-ink">
            Which site or place?
            <input
              value={sourceDetail}
              onChange={(e) => setSourceDetail(e.target.value)}
              placeholder="Dhoni Mart, a classifieds group, a referral…"
              className={fieldClass}
            />
          </label>
        )}

        <fieldset className="flex flex-col gap-2 rounded-xl border border-border p-3">
          <legend className="px-1 text-sm text-ink">Numbers sold</legend>

          {rows.map((row, index) => (
            <div key={row.key} className="flex flex-col gap-2 rounded-lg bg-surface/60 p-2.5">
              <div className="flex items-center gap-2">
                <input
                  value={row.msisdn}
                  onChange={(e) => handleDigits(row.key, e.target.value)}
                  inputMode="numeric"
                  placeholder="7771234"
                  aria-label={`Number ${index + 1}`}
                  className={`${fieldBase} font-numeric min-w-0 flex-1`}
                />
                <input
                  value={row.price}
                  onChange={(e) => patchRow(row.key, { price: e.target.value.replace(/[^\d.]/g, '') })}
                  inputMode="decimal"
                  placeholder="Price"
                  aria-label={`Price paid for number ${index + 1}`}
                  className={`${fieldBase} font-numeric w-24 shrink-0`}
                />
                {/* The last remaining row has nothing to remove — a single
                    empty row is the form's resting state, not an entry. */}
                {rows.length > 1 && (
                  <button
                    type="button"
                    onClick={() => setRows((prev) => prev.filter((r) => r.key !== row.key))}
                    aria-label={`Remove number ${index + 1}`}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2">
                <select
                  value={row.provider}
                  onChange={(e) => patchRow(row.key, { provider: e.target.value as Provider })}
                  aria-label={`Provider for number ${index + 1}`}
                  className={`${fieldClass} h-10`}
                >
                  <option value="dhiraagu">Dhiraagu</option>
                  <option value="ooredoo">Ooredoo</option>
                </select>
                <select
                  value={row.category}
                  onChange={(e) => patchRow(row.key, { category: e.target.value as Category })}
                  aria-label={`Grade for number ${index + 1}`}
                  className={`${fieldClass} h-10`}
                >
                  {TIERS.map((tier) => (
                    <option key={tier} value={tier}>
                      {TIER[tier].label}
                    </option>
                  ))}
                </select>
              </div>

              {/* What the lookup found, so the owner can see the sale is about
                  to be joined up with their stock — or knowingly is not. */}
              {row.msisdn.length === 7 && (
                <p className="flex items-center gap-1.5 text-xs" aria-live="polite">
                  {row.looking ? (
                    <span className="text-muted">Checking stock…</span>
                  ) : row.stock ? (
                    row.stock.status === 'sold' ? (
                      <span className="text-gold">Already marked sold in Numbers.</span>
                    ) : (
                      <>
                        <Check size={13} aria-hidden="true" className="text-lagoon" />
                        <span className="text-lagoon">In stock — will be marked sold.</span>
                      </>
                    )
                  ) : row.lookedUp ? (
                    <>
                      <Search size={13} aria-hidden="true" className="text-muted" />
                      <span className="text-muted">
                        Not in your stock — recorded as a one-off sale.
                      </span>
                    </>
                  ) : null}
                </p>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => setRows((prev) => [...prev, blankRow()])}
            className="flex h-11 items-center justify-center gap-1.5 rounded-full border border-border text-sm font-medium text-ink hover:bg-lagoon-soft"
          >
            <Plus size={15} /> Add another number
          </button>
        </fieldset>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {/* The label text and its "(optional)" are one span, or the column
              flex lays them out as two stacked rows. */}
          <label className="flex flex-col gap-1 text-sm text-ink">
            <span>
              Buyer name <span className="text-xs text-muted">(optional)</span>
            </span>
            <input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className={fieldClass}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            <span>
              Buyer contact <span className="text-xs text-muted">(optional)</span>
            </span>
            <input
              value={customerContact}
              onChange={(e) => setCustomerContact(e.target.value.replace(/\D/g, '').slice(0, 7))}
              inputMode="numeric"
              placeholder="7771234"
              className={`${fieldClass} font-numeric`}
            />
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-ink">
          Status
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as OrderStatus)}
            className={`${fieldClass} capitalize`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s} className="capitalize">
                {s}
              </option>
            ))}
          </select>
          {/* Completed is the default because a sale is normally written down
              after the money has changed hands, and only completed sales count
              toward revenue on the dashboard. */}
          <span className="text-xs text-muted">
            Only <strong className="text-ink">completed</strong> sales count toward revenue.
          </span>
        </label>

        <label className="flex flex-col gap-1 text-sm text-ink">
          <span>
            Note <span className="text-xs text-muted">(optional)</span>
          </span>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Paid by transfer, handed over at the shop…"
            className={fieldClass}
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <div className="mt-1 flex items-center justify-between border-t border-border pt-3">
          <span className="text-sm text-muted">Total</span>
          <span className="font-numeric text-lg font-semibold text-ink">
            MVR {formatCurrency(total)}
          </span>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 items-center justify-center rounded-full bg-lagoon text-sm font-semibold text-sand hover:bg-lagoon/90 disabled:opacity-60"
        >
          {submitting ? 'Recording…' : 'Record sale'}
        </button>
      </form>
    </Modal>
  )
}
