import { useState } from 'react'
import { Modal } from '@/components/Modal'
import { dataService } from '@/data'
import type { Category, PhoneNumber, Provider } from '@/types'

const fieldClass =
  'h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon'

export function BulkAddModal({ onClose, onAdded }: { onClose: () => void; onAdded: (numbers: PhoneNumber[]) => void }) {
  const [text, setText] = useState('')
  const [provider, setProvider] = useState<Provider>('dhiraagu')
  const [category, setCategory] = useState<Category>('regular')
  const [defaultPrice, setDefaultPrice] = useState('')
  const [result, setResult] = useState<{ added: number; skipped: string[] } | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const lines = text
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)
      .map((line) => {
        const [num, price] = line.split(',').map((p) => p.trim())
        return { msisdn: num, price: price ? Number(price) : undefined }
      })

    if (lines.length === 0) return

    setSubmitting(true)
    const { added, skipped } = await dataService.bulkAddNumbers(lines, {
      provider,
      category,
      price: Number(defaultPrice) || 0,
    })
    setSubmitting(false)
    setResult({ added: added.length, skipped })
    if (added.length > 0) onAdded(added)
  }

  return (
    <Modal title="Bulk add numbers" onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <p className="text-xs text-muted">
          One number per line. Optionally add a price after a comma, e.g. <span className="font-numeric">7771234, 500</span>.
          Lines without a price use the default price below.
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={6}
          placeholder={'7771234, 350\n9611234\n7823456, 420'}
          className={`${fieldClass} h-auto resize-y py-2 font-numeric`}
        />

        <div className="grid grid-cols-2 gap-3">
          <label className="flex flex-col gap-1 text-sm text-ink">
            Provider
            <select value={provider} onChange={(e) => setProvider(e.target.value as Provider)} className={fieldClass}>
              <option value="dhiraagu">Dhiraagu</option>
              <option value="ooredoo">Ooredoo</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm text-ink">
            Category
            <select value={category} onChange={(e) => setCategory(e.target.value as Category)} className={fieldClass}>
              <option value="regular">Regular</option>
              <option value="nice">Nice</option>
            </select>
          </label>
        </div>

        <label className="flex flex-col gap-1 text-sm text-ink">
          Default price (MVR)
          <input
            value={defaultPrice}
            onChange={(e) => setDefaultPrice(e.target.value.replace(/[^\d.]/g, ''))}
            inputMode="decimal"
            className={`${fieldClass} font-numeric`}
          />
        </label>

        {result && (
          <p className="text-sm text-ink">
            Added {result.added}.{' '}
            {result.skipped.length > 0 && (
              <span className="text-muted">Skipped {result.skipped.length} (duplicate or invalid): {result.skipped.join(', ')}</span>
            )}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="mt-1 flex h-12 items-center justify-center rounded-full bg-lagoon text-sm font-semibold text-sand hover:bg-lagoon/90 disabled:opacity-60"
        >
          Import numbers
        </button>
      </form>
    </Modal>
  )
}
