import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { dataService } from '@/data'
import type { PhoneNumber } from '@/types'
import { NumberCard } from '@/components/NumberCard'
import { NumberGridSkeleton } from '@/components/NumberCardSkeleton'
import { BrandLogo } from '@/components/BrandLogo'
import { TIER, TIERS, asTier, tierLabel } from '@/utils/tiers'
import { formatCurrency, formatMsisdn, getSellingPrice } from '@/utils/format'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function Home() {
  useDocumentMeta(
    'Salhi Numbers — Premium mobile numbers in the Maldives',
    'Graded Dhiraagu and Ooredoo mobile numbers in the Maldives. Browse Silver, Gold and Platinum, and order over WhatsApp.',
  )

  const [featured, setFeatured] = useState<PhoneNumber[]>([])
  const [showpiece, setShowpiece] = useState<PhoneNumber | null>(null)
  const [availableCount, setAvailableCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([
      dataService.getFeaturedNumbers(2),
      dataService.getAvailableCount(),
      dataService.listNumbers({ sort: 'price-desc' }),
    ]).then(([f, c, byPrice]) => {
      if (!active) return
      setFeatured(f)
      setAvailableCount(c)
      // The dearest number that can actually be bought today. Not pinned to
      // Platinum: a shop with nothing at the top grade yet should still lead
      // with its best piece rather than an empty space.
      setShowpiece(byPrice.find((n) => n.status === 'available') ?? null)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="mx-auto max-w-5xl px-4 pb-24">
      <section className="hero-wash hero-screen -mx-4 flex flex-col items-center justify-center gap-8 px-4 py-16 text-center">
        {/* The mark carries the brand name, so it is the page heading and its
            alt text is what supplies the h1's text to assistive tech. */}
        <h1 className="flex justify-center">
          <BrandLogo className="h-20 sm:h-24" />
        </h1>

        <p className="max-w-[17rem] font-serif text-[2.1rem] leading-[1.1] font-light text-ink sm:max-w-none sm:text-[3rem]">
          Numbers worth remembering.
        </p>

        {/* A single hairline instead of a rule across the page: it separates the
            brand from the merchandise without drawing a box around anything. */}
        <span className="h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" aria-hidden="true" />

        {/* One number, shown large. A shop that sells individual objects should
            lead with its best one rather than describe the category. */}
        {showpiece && (
          <Link to={`/browse?category=${asTier(showpiece.category)}`} className="group block">
            <span className="block text-[0.6rem] font-semibold tracking-[0.32em] text-muted uppercase">
              The showpiece
            </span>
            <span
              className={`font-numbers font-numeric mt-4 block text-[2.9rem] leading-none font-extrabold tracking-tight sm:text-[4.25rem] ${TIER[asTier(showpiece.category)].number}`}
            >
              {formatMsisdn(showpiece.msisdn)}
            </span>
            <span className="mt-4 block text-sm text-muted">
              {tierLabel(showpiece.category)} · MVR {formatCurrency(getSellingPrice(showpiece))}
            </span>
          </Link>
        )}

        <div className="flex flex-col items-center gap-4">
          <Link
            to="/browse"
            className="inline-flex h-12 items-center gap-2 rounded-full bg-lagoon px-8 text-base font-semibold text-sand transition-colors hover:bg-lagoon/90 active:bg-lagoon/80"
          >
            Browse the collection
            <ArrowRight size={18} aria-hidden="true" />
          </Link>

          {availableCount != null && (
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] text-muted uppercase">
              <span className="font-numeric text-ink">{availableCount}</span> available · Dhiraagu &amp; Ooredoo
            </p>
          )}
        </div>
      </section>

      {/* The grades as doorways. Kept to a hairline row rather than three filled
          cards: the cards belong to the numbers, and repeating them here would
          make the grades compete with the merchandise they are meant to sort. */}
      <section className="pt-20">
        <Label>By grade</Label>
        <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
          {TIERS.map((t) => (
            <Link
              key={t}
              to={`/browse?category=${t}`}
              className="group flex items-center justify-center gap-3 bg-sand px-6 py-7 transition-colors hover:bg-surface"
            >
              <span className={`font-numbers text-xl font-extrabold ${TIER[t].number}`}>{TIER[t].label}</span>
              <ArrowRight
                size={15}
                aria-hidden="true"
                className="text-muted transition-transform group-hover:translate-x-0.5"
              />
            </Link>
          ))}
        </div>
      </section>

      {(loading || featured.length > 0) && (
        <section className="pt-20">
          <div className="flex items-baseline justify-between">
            <Label>Featured</Label>
            <Link to="/browse" className="text-sm font-medium text-lagoon hover:underline">
              See everything
            </Link>
          </div>
          <div className="mt-5">
            {loading ? (
              <NumberGridSkeleton count={2} />
            ) : (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {featured.map((n) => (
                  <NumberCard key={n.id} number={n} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      <section className="pt-20">
        <Label>How it works</Label>
        <ol className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-3">
          {[
            ['01', 'Choose', 'Search the collection and add your number to the cart.'],
            ['02', 'Confirm', 'Leave your name and a contact number. Nothing else.'],
            ['03', 'Receive', 'We complete the handover over WhatsApp.'],
          ].map(([step, title, text]) => (
            <li key={step}>
              <p className="font-numbers text-[0.7rem] font-bold tracking-[0.2em] text-gold">{step}</p>
              <p className="mt-2.5 font-serif text-2xl font-normal text-ink">{title}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[0.65rem] font-semibold tracking-[0.3em] text-muted uppercase">{children}</h2>
  )
}
