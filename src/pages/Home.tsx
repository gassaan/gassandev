import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, MessageCircle, PhoneCall, Search as SearchIcon } from 'lucide-react'
import { dataService } from '@/data'
import type { PhoneNumber } from '@/types'
import { NumberCard } from '@/components/NumberCard'
import { NumberGridSkeleton } from '@/components/NumberCardSkeleton'
import { SearchBar } from '@/components/SearchBar'
import { BrandLogo } from '@/components/BrandLogo'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function Home() {
  useDocumentMeta(
    'Salhi Numbers — Nice mobile numbers in the Maldives',
    'Buy nice and regular mobile phone numbers for Dhiraagu and Ooredoo in the Maldives. Browse, pick your number, and order over WhatsApp.',
  )

  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [featured, setFeatured] = useState<PhoneNumber[]>([])
  const [latest, setLatest] = useState<PhoneNumber[]>([])
  const [availableCount, setAvailableCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([dataService.getFeaturedNumbers(4), dataService.getLatestNumbers(6), dataService.getAvailableCount()]).then(
      ([f, l, c]) => {
        if (!active) return
        setFeatured(f)
        setLatest(l)
        setAvailableCount(c)
        setLoading(false)
      },
    )
    return () => {
      active = false
    }
  }, [])

  const browseRef = useRef<HTMLDivElement>(null)

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(query ? `/browse?q=${encodeURIComponent(query)}` : '/browse')
  }

  function scrollToBrowse() {
    // scrollIntoView's smooth behaviour is a script option, so the global
    // reduced-motion CSS rule does not reach it — it has to be asked for here.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    browseRef.current?.scrollIntoView({
      behavior: reduced ? 'auto' : 'smooth',
      block: 'start',
    })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <section className="hero-wash hero-screen -mx-4 flex flex-col px-4">
        <div className="flex flex-1 flex-col items-center justify-center gap-6 py-10 text-center">
          {/* The mark carries the brand name, so it is the page heading; its
              alt text supplies the h1's text for assistive tech and search. */}
          <h1 className="flex justify-center">
            <BrandLogo className="h-32 drop-shadow-sm sm:h-44" />
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

          <form onSubmit={handleSearchSubmit} className="w-full max-w-sm">
            <SearchBar value={query} onChange={setQuery} />
          </form>
        </div>

        {/* A real control, not just a hint: the cue is the obvious thing to
            tap on a phone, so tapping it has to actually take you there. */}
        <button
          type="button"
          onClick={scrollToBrowse}
          className="mx-auto mb-8 flex min-h-11 flex-col items-center gap-1 rounded-2xl px-5 py-2 text-sm font-medium text-muted transition-colors hover:text-lagoon focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
        >
          Scroll to browse numbers
          <ChevronDown size={20} className="animate-scroll-drift" aria-hidden="true" />
        </button>
      </section>

      {/* scroll-mt clears the sticky header so the first card is not tucked
          under it when the cue scrolls here. */}
      <div ref={browseRef} className="scroll-mt-20 pt-8">
        {loading ? (
          <NumberGridSkeleton count={4} />
        ) : (
          <>
            {featured.length > 0 && (
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
            )}

            {latest.length > 0 && (
              <section className="mt-10">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-lg font-semibold text-ink">Latest additions</h2>
                  <Link to="/browse" className="text-sm font-medium text-lagoon hover:underline">
                    See all
                  </Link>
                </div>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {latest.map((n) => (
                    <NumberCard key={n.id} number={n} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>

      <section className="mt-12 rounded-2xl border border-border bg-surface p-5">
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
