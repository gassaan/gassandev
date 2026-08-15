import { useState } from 'react'
import type { Provider } from '@/types'

const LABELS: Record<Provider, string> = {
  dhiraagu: 'Dhiraagu',
  ooredoo: 'Ooredoo',
}

const SRC: Record<Provider, string> = {
  dhiraagu: '/logos/dhiraagu.png',
  ooredoo: '/logos/ooredoo.png',
}

// Sizing is a prop rather than a className so an unrelated utility passed by a
// caller can't silently drop the height and blow the mark up to its natural size.
const SIZES = {
  sm: 'h-5',
  md: 'h-6',
} as const

export function ProviderLogo({
  provider,
  size = 'md',
  className = '',
  showLabel = false,
}: {
  provider: Provider
  size?: keyof typeof SIZES
  className?: string
  showLabel?: boolean
}) {
  const [failed, setFailed] = useState(false)
  const label = LABELS[provider]

  const mark = failed ? null : (
    <img
      src={SRC[provider]}
      // Adjacent text already names the provider, so the mark is decorative there.
      alt={showLabel ? '' : label}
      title={showLabel ? undefined : label}
      className={`w-auto shrink-0 object-contain ${SIZES[size]} ${className}`}
      onError={() => setFailed(true)}
    />
  )

  if (showLabel) {
    return (
      <span className="inline-flex items-center gap-1.5">
        {mark}
        {label}
      </span>
    )
  }

  return (
    mark ?? (
      <span className="inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted">
        {label}
      </span>
    )
  )
}
