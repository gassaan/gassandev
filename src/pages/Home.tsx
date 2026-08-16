import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronDown, MessageCircle, PhoneCall, Search as SearchIcon } from 'lucide-react'
import { dataService } from '@/data'
import type { PhoneNumber } from '@/types'
import { NumberCard } from '@/components/NumberCard'
import { NumberGridSkeleton } from '@/components/NumberCardSkeleton'
import { BrandLogo } from '@/components/BrandLogo'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function Home() {
  useDocumentMeta(
    'Salhi Numbers — Nice mobile numbers in the Maldives',
    'Buy nice and regular mobile phone numbers for Dhiraagu and Ooredoo in the Maldives. Browse, pick your number, and order over WhatsApp.',
  )

  const [featured, setFeatured] = useState<PhoneNumber[]>([])
  const [availableCount, setAvailableCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([dataService.getFeaturedNumbers(4), dataService.getAvailableCount()]).then(([f, c]) => {
      if (!active) return
      setFeatured(f)
      setAvailableCount(c)
      setLoading(false)
    })
    return () => {
      active = false
    }
  }, [])

  const howItWorksRef = useRef<HTMLElement>(null)

  function scrollToHowItWorks() {
    // scrollIntoView's smooth behaviour is a script option, so the global
    // reduced-motion CSS rule does not reach it — it has to be asked for here.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    howItWorksRef.current?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <section className="hero-wash hero-screen -mx-4 flex flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        {/* The mark carries the brand name, so it is the page heading, and its
            alt text is what supplies the h1's text to assistive tech and search. */}
        <h1 className="flex justify-center">
          <BrandLogo className="h-32 sm:h-44" />
        </h1>

        <p className="max-w-[19rem] text-[0.95rem] leading-relaxed text-muted sm:max-w-md sm:text-base">
          Easy-to-remember numbers for Dhiraagu and Ooredoo, ready to reserve today.
        </p>

        {availableCount != null && (
          <p className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3.5 py-1.5 text-sm text-ink shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-lagoon" aria-hidden="true" />
            <span className="font-numeric font-semibold">{availableCount}</span>
            number{availableCount === 1 ? '' : 's'} available
          </p>
        )}

        {/* Sits with the content rather than pinned to the bottom edge: it is
            now the page's primary action, not a hint that there is more below. */}
        <Link
          to="/browse"
          className="mt-1 inline-flex h-12 items-center gap-2 rounded-full bg-lagoon px-7 text-base font-semibold text-sand shadow-sm transition-colors hover:bg-lagoon/90 active:bg-lagoon/80"
        >
          Browse numbers
          <ArrowRight size={18} aria-hidden="true" />
        </Link>

        {/* Quiet next to the primary action on purpose: this is the secondary
            path for someone who wants reassurance before they start shopping. */}
        <button
          type="button"
          onClick={scrollToHowItWorks}
          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-muted transition-colors hover:text-lagoon"
        >
          How it works
          <ChevronDown size={16} aria-hidden="true" />
        </button>
      </section>

      <div className="pt-8">
        {loading ? (
          <NumberGridSkeleton count={4} />
        ) : (
          featured.length > 0 && (
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-display text-lg font-semibold text-ink">Premium picks</h2>
                <Link to="/browse?category=nice" className="text-sm font-medium text-lagoon hover:underline">
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {featured.map((n) => (
                  <NumberCard key={n.id} number={n} />
                ))}
              </div>
            </section>
          )
        )}
      </div>

      {/* scroll-mt clears the sticky header so the heading is not tucked
          under it when the cue scrolls here. */}
      <section
        ref={howItWorksRef}
        className="mt-12 scroll-mt-20 rounded-2xl border border-border bg-surface p-5"
      >
        <h2 className="mb-4 text-center font-display text-lg font-semibold text-ink">How it works</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Step icon={<SearchIcon size={20} />} title="Pick your number" text="Search and add it to your cart." />
          <Step icon={<PhoneCall size={20} />} title="Send your details" text="Name and contact number, nothing else." />
          <Step icon={<MessageCircle size={20} />} title="We confirm on WhatsApp" text="Your order opens as a WhatsApp message." />
        </div>
      </section>
    </div>
  )
}

function Step({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="flex flex-col items-center gap-2 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-lagoon-soft text-lagoon">{icon}</div>
      <p className="text-sm font-semibold text-ink">{title}</p>
      <p className="text-xs text-muted">{text}</p>
    </div>
  )
}
