import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { useCart } from '@/contexts/CartContext'
import { ProviderLogo } from '@/components/ProviderLogo'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function Cart() {
  useDocumentMeta('Your cart — Salhi Numbers')
  const { items, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <EmptyState
          title="Your cart is empty"
          description="Browse available numbers and add the ones you like."
          action={
            <Link
              to="/browse"
              className="mt-1 flex h-11 items-center rounded-full bg-lagoon px-5 text-sm font-semibold text-sand hover:bg-lagoon/90"
            >
              Browse numbers
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-32 pt-6">
      <h1 className="mb-4 font-display text-2xl font-semibold text-ink">
        Your cart <span className="text-muted">({items.length})</span>
      </h1>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.msisdn}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
          >
            <ProviderLogo provider={item.provider} />
            <div className="flex-1">
              <p className="font-numeric text-lg font-semibold text-ink">{formatMsisdn(item.msisdn)}</p>
              <p className="text-xs capitalize text-muted">{item.category} number</p>
            </div>
            <p className="font-numeric font-semibold text-ink">MVR {formatCurrency(item.price)}</p>
            <button
              type="button"
              onClick={() => removeItem(item.msisdn)}
              aria-label={`Remove ${formatMsisdn(item.msisdn)} from cart`}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-muted hover:bg-danger/10 hover:text-danger"
            >
              <Trash2 size={18} />
            </button>
          </div>
        ))}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-sand/95 backdrop-blur safe-bottom">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs text-muted">Total</p>
            <p className="font-numeric text-xl font-semibold text-ink">MVR {formatCurrency(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="flex h-12 items-center gap-2 rounded-full bg-lagoon px-6 text-sm font-semibold text-sand hover:bg-lagoon/90"
          >
            <ShoppingBag size={18} />
            Continue to order
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
