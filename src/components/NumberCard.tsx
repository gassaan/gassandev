import { useState } from 'react'
import { Check, Copy, ShoppingCart } from 'lucide-react'
import type { PhoneNumber } from '@/types'
import { ProviderLogo } from '@/components/ProviderLogo'
import { formatCurrency, formatMsisdn, getSavePercent, getSellingPrice } from '@/utils/format'
import { TIER, asTier } from '@/utils/tiers'
import { useCart } from '@/contexts/CartContext'
import { useToast } from '@/contexts/ToastContext'

export function NumberCard({ number }: { number: PhoneNumber }) {
  const { isInCart, addItem } = useCart()
  const { showToast } = useToast()
  const [copied, setCopied] = useState(false)

  const tier = TIER[asTier(number.category)]
  const isReserved = number.status === 'reserved'
  const inCart = isInCart(number.msisdn)
  const sellingPrice = getSellingPrice(number)
  const savePercent = getSavePercent(number)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(number.msisdn)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard unavailable */
    }
  }

  function handleAdd() {
    if (isReserved || inCart) return
    addItem({
      msisdn: number.msisdn,
      provider: number.provider,
      category: number.category,
      price: sellingPrice,
    })
    showToast(`${formatMsisdn(number.msisdn)} added to cart`)
  }

  return (
    <div
      className={`animate-fade-in relative flex flex-col gap-2 rounded-2xl border p-3 shadow-sm transition-shadow hover:shadow-md ${tier.card}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide uppercase ${tier.badge}`}
          >
            {tier.label}
          </span>
          {/* ink at 10%, not muted at 20%: a tint mixed from the same colour as
              its own label rises and falls with it, so the chip can never get
              clear of its background. Ink is the card's opposite pole, which
              holds on the light metals and on the black card alike. */}
          {isReserved && (
            <span className="rounded-full bg-ink/10 px-2 py-0.5 text-[10px] font-bold tracking-wide text-ink uppercase">
              Reserved
            </span>
          )}
          {savePercent > 0 && (
            <span className="rounded-full bg-lagoon px-2 py-0.5 text-[10px] font-bold tracking-wide text-sand uppercase">
              Save {savePercent}%
            </span>
          )}
        </div>
        <ProviderLogo provider={number.provider} />
      </div>

      <button
        type="button"
        onClick={handleCopy}
        aria-label={`Copy number ${formatMsisdn(number.msisdn)}`}
        className="group flex items-center gap-2 self-start"
      >
        {/* The metallic fill is on this span, not the button: every grade
            clips a gradient to the text with a transparent colour, which would
            otherwise swallow the copy icon along with it.

            The sizes step around the grid rather than simply growing: cards are
            at their narrowest at sm, where the grid goes to two columns, so the
            number has less room there than on a phone, not more. Every number
            is the same width — seven tabular digits — so these were set against
            a measured worst case rather than guessed.

            All three are the previous sizes scaled by 0.75, which takes the
            card from 192px to 161px on a phone. The ratio is applied evenly so
            the step around the grid survives the change. It does not go
            further: the Add button holds at 44px — the touch-target floor —
            and with padding that already sets a ~68px floor before the number
            is drawn, so shrinking the type alone stops buying much below
            this. Denser than this wants a row layout, not a smaller card. */}
        <span
          className={`font-numbers font-numeric text-[1.95rem] font-extrabold tracking-tight sm:text-[2.05rem] lg:text-[2.45rem] ${tier.number}`}
        >
          {formatMsisdn(number.msisdn)}
        </span>
        <span className="shrink-0 text-muted opacity-0 transition-opacity group-hover:opacity-100">
          {copied ? <Check size={18} className="text-lagoon" /> : <Copy size={18} />}
        </span>
      </button>
      {copied && <span className="-mt-2 text-xs font-medium text-lagoon">Copied</span>}

      {number.patternTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {number.patternTags.map((tag) => (
            <span
              key={tag}
              className="tag-pattern rounded-full bg-lagoon-soft px-2.5 py-1 text-[11px] font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="mt-auto flex items-end justify-between gap-2 pt-1">
        <div className="flex flex-col">
          {number.promoPrice != null && (
            <span className="text-xs text-muted line-through">MVR {formatCurrency(number.price)}</span>
          )}
          <span className={`font-numeric text-lg font-semibold ${tier.price}`}>
            MVR {formatCurrency(sellingPrice)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={isReserved || inCart}
          aria-label={inCart ? 'In cart' : `Add ${formatMsisdn(number.msisdn)} to cart`}
          className={`flex h-11 min-w-[44px] items-center gap-1.5 rounded-full px-4 text-sm font-semibold transition-colors ${
            isReserved
              ? 'cursor-not-allowed bg-muted/15 text-muted'
              : inCart
                ? 'cursor-default bg-lagoon-soft text-lagoon'
                : 'bg-lagoon text-sand hover:bg-lagoon/90 active:bg-lagoon/80'
          }`}
        >
          {inCart ? (
            <>
              <Check size={16} /> In cart
            </>
          ) : (
            <>
              <ShoppingCart size={16} /> Add
            </>
          )}
        </button>
      </div>
    </div>
  )
}
