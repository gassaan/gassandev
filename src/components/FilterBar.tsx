import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { Category, NumberFilters, Provider, SortOption } from '@/types'
import { ProviderLogo } from '@/components/ProviderLogo'

const SORT_LABELS: Record<SortOption, string> = {
  'price-asc': 'Price: low to high',
  'price-desc': 'Price: high to low',
  newest: 'Newest',
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors ${
        active
          ? 'border-lagoon bg-lagoon text-sand'
          : 'border-border bg-surface text-ink hover:bg-lagoon-soft'
      }`}
    >
      {children}
    </button>
  )
}

export function FilterBar({
  filters,
  onChange,
}: {
  filters: NumberFilters
  onChange: (filters: NumberFilters) => void
}) {
  const [showPriceRange, setShowPriceRange] = useState(false)

  function setProvider(provider: Provider | 'all') {
    onChange({ ...filters, provider })
  }
  function setCategory(category: Category | 'all') {
    onChange({ ...filters, category })
  }

  return (
    <div className="-mx-4 border-b border-border bg-sand/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-sand/85">
      <div className="flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Chip active={!filters.provider || filters.provider === 'all'} onClick={() => setProvider('all')}>
          All
        </Chip>
        <Chip active={filters.provider === 'dhiraagu'} onClick={() => setProvider('dhiraagu')}>
          <ProviderLogo provider="dhiraagu" className="h-4" />
        </Chip>
        <Chip active={filters.provider === 'ooredoo'} onClick={() => setProvider('ooredoo')}>
          <ProviderLogo provider="ooredoo" className="h-4" />
        </Chip>

        <div className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden="true" />

        <Chip active={!filters.category || filters.category === 'all'} onClick={() => setCategory('all')}>
          All types
        </Chip>
        <Chip active={filters.category === 'nice'} onClick={() => setCategory('nice')}>
          Nice
        </Chip>
        <Chip active={filters.category === 'regular'} onClick={() => setCategory('regular')}>
          Regular
        </Chip>

        <div className="mx-1 h-5 w-px shrink-0 bg-border" aria-hidden="true" />

        <button
          type="button"
          onClick={() => setShowPriceRange((s) => !s)}
          aria-expanded={showPriceRange}
          className={`flex h-11 shrink-0 items-center gap-1.5 rounded-full border px-3.5 text-sm font-medium transition-colors ${
            showPriceRange || filters.minPrice != null || filters.maxPrice != null
              ? 'border-lagoon bg-lagoon text-sand'
              : 'border-border bg-surface text-ink hover:bg-lagoon-soft'
          }`}
        >
          <SlidersHorizontal size={14} /> Price
        </button>

        <select
          value={filters.sort ?? 'newest'}
          onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
          aria-label="Sort numbers"
          className="ml-auto h-11 shrink-0 rounded-full border border-border bg-surface px-3 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
        >
          {Object.entries(SORT_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {showPriceRange && (
        <div className="mt-3 flex items-center gap-3">
          <label className="flex-1 text-xs text-muted">
            Min (MVR)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={filters.minPrice ?? ''}
              onChange={(e) =>
                onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
            />
          </label>
          <label className="flex-1 text-xs text-muted">
            Max (MVR)
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={filters.maxPrice ?? ''}
              onChange={(e) =>
                onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
            />
          </label>
        </div>
      )}
    </div>
  )
}
