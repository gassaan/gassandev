import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, ShoppingBag, Trash2 } from 'lucide-react'
import { tierLabel } from '@/utils/tiers'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { ProviderLogo } from '@/components/ProviderLogo'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function Cart() {
  useDocumentMeta('Your cart — Salhi Numbers')
  const { t } = useLanguage()
  const { items, removeItem, total } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-8">
        <EmptyState
          title={t.cart.emptyTitle}
          description={t.cart.emptyDescription}
          action={
            <Link
              to="/browse"
              className="mt-1 flex h-11 items-center rounded-full bg-lagoon px-5 text-sm font-semibold text-sand hover:bg-lagoon/90"
            >
              {t.cart.browseNumbers}
            </Link>
          }
        />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-32 pt-6">
      <h1 className="mb-4 font-display text-2xl font-semibold text-ink">{t.cart.heading(items.length)}</h1>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.msisdn}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
          >
            <ProviderLogo provider={item.provider} />
            <div className="flex-1">
              {/* dir="ltr" isolates the digit groups from the surrounding RTL
                  paragraph so they stay in source order (see NumberCard for
                  the full explanation); text-right pins its own alignment
                  back to match the provider/tier line below it, which is
                  still right-aligned by inheriting the page's RTL default. */}
              <p dir="ltr" className="text-right font-numeric text-lg font-semibold text-ink">
                {formatMsisdn(item.msisdn)}
              </p>
              <p className="text-xs capitalize text-muted">
                {item.provider} · {tierLabel(item.category, t)}
              </p>
            </div>
            <p className="font-numeric font-semibold text-ink">MVR {formatCurrency(item.price)}</p>
            <button
              type="button"
              onClick={() => removeItem(item.msisdn)}
              aria-label={t.cart.removeAria(formatMsisdn(item.msisdn))}
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
            <p className="text-xs text-muted">{t.cart.total}</p>
            <p className="font-numeric text-xl font-semibold text-ink">MVR {formatCurrency(total)}</p>
          </div>
          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="flex h-12 items-center gap-2 rounded-full bg-lagoon px-6 text-sm font-semibold text-sand hover:bg-lagoon/90"
          >
            <ShoppingBag size={18} />
            {t.cart.continueToOrder}
            <ArrowRight size={16} className="rtl:rotate-180" />
          </button>
        </div>
      </div>
    </div>
  )
}
