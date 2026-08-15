import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { MessageCircle, PhoneCall, Search as SearchIcon } from 'lucide-react'
import { dataService } from '@/data'
import type { PhoneNumber } from '@/types'
import { NumberCard } from '@/components/NumberCard'
import { NumberGridSkeleton } from '@/components/NumberCardSkeleton'
import { SearchBar } from '@/components/SearchBar'
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

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault()
    navigate(query ? `/browse?q=${encodeURIComponent(query)}` : '/browse')
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <section className="flex flex-col items-center gap-5 py-10 text-center sm:py-14">
        <h1 className="max-w-lg font-display text-3xl font-semibold leading-tight tracking-tight text-ink sm:text-4xl">
          Pick a number that's easy to remember
        </h1>
        <p className="max-w-sm text-muted">
          Nice and regular Dhiraagu &amp; Ooredoo numbers, ready to reserve today.
        </p>

        <form onSubmit={handleSearchSubmit} className="w-full max-w-sm">
          <SearchBar value={query} onChange={setQuery} />
        </form>

        {availableCount != null && (
          <p className="text-sm font-medium text-lagoon">
            {availableCount} number{availableCount === 1 ? '' : 's'} available
          </p>
        )}
      </section>

      {loading ? (
        <NumberGridSkeleton count={4} />
      ) : (
        <>
          {featured.length > 0 && (
            <section className="mt-8">
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
