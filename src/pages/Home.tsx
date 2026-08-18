import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { dataService } from '@/data'
import { BrandLogo } from '@/components/BrandLogo'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

/**
 * Four things and nothing else: the mark, a line, the way in, and the count.
 *
 * With so little on the page, the design has to come from the space between
 * the four rather than from anything added around them — hence the single
 * full-height column, the one hairline, and no card, panel or border anywhere.
 * Anything more would read as decoration, which is the opposite of the effect.
 */
export function Home() {
  useDocumentMeta(
    'Salhi Numbers — Premium mobile numbers in the Maldives',
    'Graded Dhiraagu and Ooredoo mobile numbers in the Maldives. Browse Silver, Gold and Platinum, and order over WhatsApp.',
  )

  const [availableCount, setAvailableCount] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    dataService.getAvailableCount().then((c) => {
      if (active) setAvailableCount(c)
    })
    return () => {
      active = false
    }
  }, [])

  return (
    <div className="hero-wash hero-screen flex flex-col items-center justify-center gap-9 px-6 py-16 text-center">
      {/* The mark carries the brand name, so it is the page heading and its alt
          text is what supplies the h1's text to assistive tech and search. */}
      <h1 className="flex justify-center">
        <BrandLogo className="h-28 sm:h-40" />
      </h1>

      {/* Two even lines on a phone, one line from sm up. text-balance keeps a
          replacement phrase from stranding a single word on its own line — the
          measure is set by the longest sensible headline, not this one. */}
      <p className="max-w-[20ch] text-balance font-serif text-[1.65rem] leading-[1.15] font-light text-ink sm:max-w-[34ch] sm:text-[2.4rem]">
        Some numbers are worth having.
      </p>

      {/* One hairline, fading out at both ends rather than ruling across the
          column: it marks the turn from brand to action without drawing a box. */}
      <span
        className="h-px w-20 bg-gradient-to-r from-transparent via-gold to-transparent"
        aria-hidden="true"
      />

      <Link
        to="/browse"
        className="group inline-flex h-13 items-center gap-2.5 rounded-full bg-lagoon px-9 text-base font-semibold text-sand transition-colors hover:bg-lagoon/90 active:bg-lagoon/80"
      >
        Browse numbers
        <ArrowRight
          size={18}
          aria-hidden="true"
          className="transition-transform group-hover:translate-x-0.5"
        />
      </Link>

      {/* Reserves its line before the count arrives, so the button does not
          jump upward on a slow connection. */}
      <p className="min-h-[1.25rem] text-[0.68rem] font-semibold tracking-[0.28em] text-muted uppercase">
        {availableCount != null && (
          <>
            <span className="font-numeric text-ink">{availableCount}</span> numbers available
          </>
        )}
      </p>
    </div>
  )
}
