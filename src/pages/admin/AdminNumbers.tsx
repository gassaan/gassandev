import { useEffect, useMemo, useState } from 'react'
import { Plus, Trash2, Upload } from 'lucide-react'
import { dataService } from '@/data'
import type { Category, NumberStatus, PhoneNumber, Provider } from '@/types'
import { formatMsisdn } from '@/utils/format'
import { AddNumberModal } from '@/pages/admin/AddNumberModal'
import { BulkAddModal } from '@/pages/admin/BulkAddModal'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

const cellSelect =
  'h-9 rounded-lg border border-border bg-surface px-2 text-xs font-medium text-ink capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon'
const cellInput =
  'h-9 w-20 rounded-lg border border-border bg-surface px-2 text-xs font-numeric text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon'

export function AdminNumbers() {
  useDocumentMeta('Manage numbers — Salhi Admin')
  const [numbers, setNumbers] = useState<PhoneNumber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [providerFilter, setProviderFilter] = useState<Provider | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [showAdd, setShowAdd] = useState(false)
  const [showBulkAdd, setShowBulkAdd] = useState(false)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [confirmBulkDelete, setConfirmBulkDelete] = useState(false)

  function refresh() {
    dataService.listAllNumbersForAdmin().then((n) => {
      setNumbers(n)
      setLoading(false)
    })
  }

  useEffect(refresh, [])

  const filtered = useMemo(() => {
    const q = search.replace(/\D/g, '')
    return numbers.filter((n) => {
      if (q && !n.msisdn.includes(q)) return false
      if (providerFilter !== 'all' && n.provider !== providerFilter) return false
      if (categoryFilter !== 'all' && n.category !== categoryFilter) return false
      return true
    })
  }, [numbers, search, providerFilter, categoryFilter])

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSelectAll() {
    setSelected((prev) => (prev.size === filtered.length ? new Set() : new Set(filtered.map((n) => n.id))))
  }

  async function handleUpdate(id: string, patch: Partial<PhoneNumber>) {
    setNumbers((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)))
    await dataService.updateNumber(id, patch)
  }

  async function handleDelete(id: string) {
    setNumbers((prev) => prev.filter((n) => n.id !== id))
    setSelected((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
    await dataService.deleteNumber(id)
  }

  async function handleBulkMarkSold() {
    const ids = [...selected]
    setNumbers((prev) => prev.map((n) => (ids.includes(n.id) ? { ...n, status: 'sold' } : n)))
    setSelected(new Set())
    await dataService.bulkMarkSold(ids)
  }

  async function handleBulkDelete() {
    const ids = [...selected]
    setNumbers((prev) => prev.filter((n) => !ids.includes(n.id)))
    setSelected(new Set())
    await dataService.bulkDelete(ids)
  }

  async function handleBulkDiscount() {
    const percent = window.prompt('Discount percentage off list price (e.g. 15)')
    const value = Number(percent)
    if (!percent || Number.isNaN(value) || value <= 0 || value >= 100) return
    const ids = [...selected]
    await dataService.bulkDiscount(ids, value)
    setSelected(new Set())
    refresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search digits…"
          inputMode="numeric"
          className="h-10 flex-1 min-w-[140px] rounded-full border border-border bg-surface px-4 text-sm font-numeric text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
        />
        <select
          value={providerFilter}
          onChange={(e) => setProviderFilter(e.target.value as Provider | 'all')}
          className="h-10 rounded-full border border-border bg-surface px-3 text-sm text-ink capitalize"
        >
          <option value="all">All providers</option>
          <option value="dhiraagu">Dhiraagu</option>
          <option value="ooredoo">Ooredoo</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as Category | 'all')}
          className="h-10 rounded-full border border-border bg-surface px-3 text-sm text-ink capitalize"
        >
          <option value="all">All grades</option>
          <option value="silver">Silver</option>
          <option value="gold">Gold</option>
          <option value="premium">Premium</option>
          <option value="platinum">Platinum</option>
        </select>
        <button
          type="button"
          onClick={() => setShowBulkAdd(true)}
          className="flex h-10 items-center gap-1.5 rounded-full border border-border bg-surface px-3.5 text-sm font-semibold text-ink hover:bg-lagoon-soft"
        >
          <Upload size={15} /> Bulk add
        </button>
        <button
          type="button"
          onClick={() => setShowAdd(true)}
          className="flex h-10 items-center gap-1.5 rounded-full bg-lagoon px-3.5 text-sm font-semibold text-sand hover:bg-lagoon/90"
        >
          <Plus size={15} /> Add number
        </button>
      </div>

      {selected.size > 0 && (
        <div className="flex items-center gap-2 rounded-xl border border-lagoon bg-lagoon-soft px-3 py-2">
          <span className="text-sm font-medium text-ink">{selected.size} selected</span>
          <div className="ml-auto flex gap-2">
            <button type="button" onClick={handleBulkMarkSold} className="h-8 rounded-full bg-surface px-3 text-xs font-semibold text-ink">
              Mark sold
            </button>
            <button type="button" onClick={handleBulkDiscount} className="h-8 rounded-full bg-surface px-3 text-xs font-semibold text-ink">
              Discount %
            </button>
            <button
              type="button"
              onClick={() => setConfirmBulkDelete(true)}
              className="h-8 rounded-full bg-danger px-3 text-xs font-semibold text-sand"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs uppercase text-muted">
              <th className="p-3">
                <input
                  type="checkbox"
                  checked={filtered.length > 0 && selected.size === filtered.length}
                  onChange={toggleSelectAll}
                  className="h-4 w-4 accent-lagoon"
                  aria-label="Select all"
                />
              </th>
              <th className="p-3">Number</th>
              <th className="p-3">Provider</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Promo</th>
              <th className="p-3">Status</th>
              <th className="p-3">Featured</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-muted">
                  Loading…
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={9} className="p-6 text-center text-muted">
                  No numbers match.
                </td>
              </tr>
            ) : (
              filtered.map((n) => (
                <tr key={n.id} className="border-b border-border last:border-0">
                  <td className="p-3">
                    <input
                      type="checkbox"
                      checked={selected.has(n.id)}
                      onChange={() => toggleSelect(n.id)}
                      className="h-4 w-4 accent-lagoon"
                      aria-label={`Select ${formatMsisdn(n.msisdn)}`}
                    />
                  </td>
                  <td className="p-3 font-numeric font-semibold text-ink">{formatMsisdn(n.msisdn)}</td>
                  <td className="p-3">
                    <select
                      value={n.provider}
                      onChange={(e) => handleUpdate(n.id, { provider: e.target.value as Provider })}
                      className={cellSelect}
                    >
                      <option value="dhiraagu">Dhiraagu</option>
                      <option value="ooredoo">Ooredoo</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <select
                      value={n.category}
                      onChange={(e) => handleUpdate(n.id, { category: e.target.value as Category })}
                      className={cellSelect}
                    >
                      <option value="silver">Silver</option>
                      <option value="gold">Gold</option>
                      <option value="premium">Premium</option>
                      <option value="platinum">Platinum</option>
                    </select>
                  </td>
                  <td className="p-3">
                    <input
                      value={n.price}
                      onChange={(e) => handleUpdate(n.id, { price: Number(e.target.value.replace(/\D/g, '')) || 0 })}
                      inputMode="numeric"
                      className={cellInput}
                    />
                  </td>
                  <td className="p-3">
                    <input
                      value={n.promoPrice ?? ''}
                      onChange={(e) =>
                        handleUpdate(n.id, { promoPrice: e.target.value ? Number(e.target.value.replace(/\D/g, '')) : null })
                      }
                      inputMode="numeric"
                      placeholder="—"
                      className={cellInput}
                    />
                  </td>
                  <td className="p-3">
                    <select
                      value={n.status}
                      onChange={(e) => handleUpdate(n.id, { status: e.target.value as NumberStatus })}
                      className={cellSelect}
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                    </select>
                  </td>
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={n.isFeatured}
                      onChange={(e) => handleUpdate(n.id, { isFeatured: e.target.checked })}
                      className="h-4 w-4 accent-gold"
                      aria-label={`Featured: ${formatMsisdn(n.msisdn)}`}
                    />
                  </td>
                  <td className="p-3 text-right">
                    <button
                      type="button"
                      onClick={() => setConfirmDeleteId(n.id)}
                      aria-label={`Delete ${formatMsisdn(n.msisdn)}`}
                      className="flex h-9 w-9 items-center justify-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
                    >
                      <Trash2 size={15} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <AddNumberModal onClose={() => setShowAdd(false)} onAdded={(n) => setNumbers((prev) => [n, ...prev])} />
      )}
      {showBulkAdd && (
        <BulkAddModal onClose={() => setShowBulkAdd(false)} onAdded={(added) => setNumbers((prev) => [...added, ...prev])} />
      )}
      {confirmDeleteId && (
        <ConfirmDialog
          title="Delete number"
          message="This will permanently remove this number from the shop."
          confirmLabel="Delete"
          onConfirm={() => handleDelete(confirmDeleteId)}
          onClose={() => setConfirmDeleteId(null)}
        />
      )}
      {confirmBulkDelete && (
        <ConfirmDialog
          title="Delete selected numbers"
          message={`This will permanently remove ${selected.size} number${selected.size === 1 ? '' : 's'}.`}
          confirmLabel="Delete"
          onConfirm={handleBulkDelete}
          onClose={() => setConfirmBulkDelete(false)}
        />
      )}
    </div>
  )
}
