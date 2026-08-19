import { useState } from 'react'
import { Modal } from '@/components/Modal'
import { dataService } from '@/data'
import type { Category, NumberStatus, PhoneNumber, Provider } from '@/types'

const fieldClass =
  'h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon'

export function AddNumberModal({ onClose, onAdded }: { onClose: () => void; onAdded: (n: PhoneNumber) => void }) {
  const [msisdn, setMsisdn] = useState('')
  const [provider, setProvider] = useState<Provider>('dhiraagu')
  const [category, setCategory] = useState<Category>('silver')
  const [patternTags, setPatternTags] = useState('')
  const [patternTagsDv, setPatternTagsDv] = useState('')
  const [price, setPrice] = useState('')
  const [promoPrice, setPromoPrice] = useState('')
  const [status, setStatus] = useState<NumberStatus>('available')
  const [isFeatured, setIsFeatured] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const digits = msisdn.replace(/\D/g, '')
    if (digits.length !== 7) {
      setError('Number must be exactly 7 digits.')
      return
    }
    const priceValue = Number(price)
    if (!price || Number.isNaN(priceValue) || priceValue <= 0) {
      setError('Enter a valid price.')
      return
    }

    setSubmitting(true)
    try {
      const created = await dataService.addNumber({
        msisdn: digits,
        provider,
        category,
        patternTags: patternTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        patternTagsDv: patternTagsDv
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        price: priceValue,
        promoPrice: promoPrice ? Number(promoPrice) : null,
        status,
        isFeatured,
      })
      onAdded(created)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add number.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Modal title="Add a number" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <label className="flex flex-col gap-1 text-sm text-ink">
          Number (7 digits)
          <input
            value={msisdn}
            onChange={(e) => setMsisdn(e.target.value.replace(/\D/g, '').slice(0, 7))}
            inputMode="numeric"
            placeholder="7771234"
            className={`${fieldClass} font-numeric`}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Provider
            <select value={provider} onChange={(e) => setProvider(e.target.value as Provider)} className={fieldClass}>
              <option value="dhiraagu">Dhiraagu</option>
              <option value="ooredoo">Ooredoo</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Grade
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={fieldClass}>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
              <option value="platinum">Platinum</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-ink">
          Pattern tags (comma separated)
          <input
            value={patternTags}
            onChange={(e) => setPatternTags(e.target.value)}
            placeholder="Triple 7, Mirror"
            className={fieldClass}
          />
        </label>

        {/* Same order as the English tags above — the customer-facing card
            pairs them by position, not by matching text, so "Triple 7,
            Mirror" here needs its Dhivehi equivalents in that same order. */}
        <label className="flex flex-col gap-1 text-sm text-ink">
          Pattern tags — Dhivehi (comma separated, same order as above)
          <input
            dir="rtl"
            value={patternTagsDv}
            onChange={(e) => setPatternTagsDv(e.target.value)}
            placeholder="ތިން ހަތެއް, ލޯގަނޑު"
            className={fieldClass}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Price (MVR)
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))}
              inputMode="decimal"
              className={`${fieldClass} font-numeric`}
            />
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Promo price (optional)
            <input
              value={promoPrice}
              onChange={(e) => setPromoPrice(e.target.value.replace(/[^\d.]/g, ''))}
              inputMode="decimal"
              className={`${fieldClass} font-numeric`}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 items-end gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Status
            <select value={status} onChange={(e) => setStatus(e.target.value as NumberStatus)} className={fieldClass}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
            </select>
          </label>
          <label className="flex h-11 items-center gap-2 text-sm text-ink">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="h-5 w-5 rounded border-border accent-lagoon"
            />
            Featured
          </label>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex h-12 items-center justify-center rounded-full bg-lagoon text-sm font-semibold text-sand hover:bg-lagoon/90 disabled:opacity-60"
        >
          Add number
        </button>
      </form>
    </Modal>
  )
}
