import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Check, ShoppingBag, Trash2 } from 'lucide-react'
import { tierLabel } from '@/utils/tiers'
import { useCart } from '@/contexts/CartContext'
import { useLanguage } from '@/contexts/LanguageContext'
import { useDhiraaguTerms } from '@/hooks/useDhiraaguTerms'
import { ProviderLogo } from '@/components/ProviderLogo'
import { EmptyState } from '@/components/EmptyState'
import { formatCurrency, formatMsisdn } from '@/utils/format'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function Cart() {
  useDocumentMeta('Your cart — Salhi Numbers')
  const { t } = useLanguage()
  const { items, removeItem, total } = useCart()
  const { required: termsRequired, agreed, accept, blocked } = useDhiraaguTerms()
  const termsRef = useRef<HTMLElement>(null)
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
      {/* The count was "Your cart (3)". A bracketed number is a programmer's
          way of writing a quantity — it reads as an aside rather than as part
          of the design. The pill says the same thing as an object, and the
          heading gets to be a heading.

          The number carries aria-label rather than being left bare: on its own
          "3" announces as a stray digit after the title, where "3 numbers" is
          the sentence a listener needs. aria-hidden on the visible glyph keeps
          it from being read twice. */}
      <div className="mb-4 flex items-center gap-2.5">
        <h1 className="font-display text-2xl font-semibold text-ink">{t.cart.title}</h1>
        <span
          role="status"
          aria-label={t.cart.countAria(items.length)}
          className="flex h-7 min-w-[1.75rem] items-center justify-center rounded-full bg-lagoon px-2.5 font-numeric text-sm font-semibold text-sand"
        >
          <span aria-hidden="true">{items.length}</span>
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.msisdn}
            className="flex items-center gap-3 rounded-xl border border-border bg-surface p-3"
          >
            <ProviderLogo provider={item.provider} />
            <div className="flex-1">
              {/* dir="ltr": a phone number reads left-to-right regardless of
                  page direction (see NumberCard). text-left rtl:text-right
                  pins this paragraph's own alignment to match the
                  provider/tier line below it — dir="ltr" makes this
                  element's own CSS "start" resolve to left, so a bare
                  text-left/text-right pair (not the logical start/end
                  utilities) is what's needed to track the *page's*
                  direction instead of this element's own. */}
              <p dir="ltr" className="text-left rtl:text-right font-numeric text-lg font-semibold text-ink">
                {formatMsisdn(item.msisdn)}
              </p>
              <p className="text-xs text-muted">
                {t.providers[item.provider]} · {tierLabel(item.category, t)}
              </p>
            </div>
            <p className="font-numeric font-semibold text-ink">{t.formatPrice(formatCurrency(item.price))}</p>
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

      {/* Only Dhiraagu numbers carry the ownership-transfer process these terms
          describe, so an Ooredoo-only cart never sees this. */}
      {termsRequired && (
        <section
          ref={termsRef}
          aria-labelledby="dhiraagu-terms-title"
          tabIndex={-1}
          className="mt-5 rounded-xl border border-border bg-surface p-4"
        >
          <h2 id="dhiraagu-terms-title" className="font-display text-base font-semibold text-ink">
            {t.dhiraaguTerms.title}
          </h2>

          <ul className="mt-3 flex list-disc flex-col gap-2 ps-5 text-sm leading-relaxed text-muted">
            {t.dhiraaguTerms.points.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>

          {agreed ? (
            <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-lagoon">
              <Check size={16} aria-hidden="true" />
              {t.dhiraaguTerms.agreed}
            </p>
          ) : (
            <button
              type="button"
              onClick={accept}
              className="mt-4 flex h-11 items-center rounded-full bg-lagoon px-6 text-sm font-semibold text-sand hover:bg-lagoon/90"
            >
              {t.dhiraaguTerms.agree}
            </button>
          )}
        </section>
      )}

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-sand/95 backdrop-blur safe-bottom">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <div>
            <p className="text-xs text-muted">{t.cart.total}</p>
            <p className="font-numeric text-xl font-semibold text-ink">{t.formatPrice(formatCurrency(total))}</p>
            {blocked && (
              <p id="cart-terms-hint" className="mt-0.5 max-w-[20ch] text-xs text-muted">
                {t.dhiraaguTerms.blockedHint}
              </p>
            )}
          </div>
          {/* Deliberately not disabled, nor aria-disabled. Both say "this
              control does nothing", and assistive tech and automation take
              that literally — but the button does do something useful while
              the terms are outstanding: it takes you to them. So it stays a
              live control that is muted rather than dead, and describes why
              via the hint beside it. */}
          <button
            type="button"
            aria-describedby={blocked ? 'cart-terms-hint' : undefined}
            onClick={() => {
              if (blocked) {
                termsRef.current?.scrollIntoView({
                  behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                  block: 'center',
                })
                termsRef.current?.focus({ preventScroll: true })
                return
              }
              navigate('/checkout')
            }}
            className={`flex h-12 shrink-0 items-center gap-2 whitespace-nowrap rounded-full px-6 text-sm font-semibold transition-colors ${
              blocked ? 'bg-muted/20 text-muted hover:bg-muted/25' : 'bg-lagoon text-sand hover:bg-lagoon/90'
            }`}
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
