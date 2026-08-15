import { useState } from 'react'
import type { Provider } from '@/types'

const LABELS: Record<Provider, string> = {
  dhiraagu: 'Dhiraagu',
  ooredoo: 'Ooredoo',
}

const SRC: Record<Provider, string> = {
  dhiraagu: '/logos/dhiraagu.svg',
  ooredoo: '/logos/ooredoo.svg',
}

export function ProviderLogo({ provider, className = '' }: { provider: Provider; className?: string }) {
  const [failed, setFailed] = useState(false)
  const label = LABELS[provider]

  if (failed) {
    return (
      <span
        className={`inline-flex items-center rounded-full border border-border bg-surface px-2 py-0.5 text-[11px] font-semibold text-muted ${className}`}
      >
        {label}
      </span>
    )
  }

  return (
    <img
      src={SRC[provider]}
      alt={label}
      title={label}
      className={`h-5 w-auto object-contain ${className}`}
      onError={() => setFailed(true)}
    />
  )
}
