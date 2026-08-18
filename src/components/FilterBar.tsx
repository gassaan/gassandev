import { useState } from 'react'
import { SlidersHorizontal } from 'lucide-react'
import type { Category, NumberFilters, Provider, SortOption } from '@/types'
import { ProviderLogo } from '@/components/ProviderLogo'
import { TIERS, tierLabel } from '@/utils/tiers'
import { useLanguage } from '@/contexts/LanguageContext'

const PANEL_ID = 'browse-filters'

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
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const sortLabels: Record<SortOption, string> = {
    'price-asc': t.filters.sortPriceAsc,
    'price-desc': t.filters.sortPriceDesc,
    newest: t.filters.sortNewest,
  }

  function setProvider(provider: Provider | 'all') {
    onChange({ ...filters, provider })
  }
  function setCategory(category: Category | 'all') {
    onChange({ ...filters, category })
  }

  // Counts only things that actually narrow the results. Sort is in the panel
  // too, but it reorders rather than hides, and its effect is already visible
  // in the list — badging it would overstate what is being filtered out.
  const hasCategory = Boolean(filters.category && filters.category !== 'all')
  const hasPrice = filters.minPrice != null || filters.maxPrice != null
  const activeCount = (hasCategory ? 1 : 0) + (hasPrice ? 1 : 0)
  const isSorted = Boolean(filters.sort && filters.sort !== 'newest')

  function resetPanel() {
    onChange({
      ...filters,
      category: 'all',
      minPrice: undefined,
      maxPrice: undefined,
      sort: 'newest',
    })
  }

  return (
    <div className="-mx-4 border-b border-border bg-sand/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-sand/85">
      <div className="flex items-center gap-2">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <Chip active={!filters.provider || filters.provider === 'all'} onClick={() => setProvider('all')}>
            {t.filters.all}
          </Chip>
          <Chip active={filters.provider === 'dhiraagu'} onClick={() => setProvider('dhiraagu')}>
            <ProviderLogo provider="dhiraagu" size="sm" showLabel />
          </Chip>
          <Chip active={filters.provider === 'ooredoo'} onClick={() => setProvider('ooredoo')}>
            <ProviderLogo provider="ooredoo" size="sm" showLabel />
          </Chip>
        </div>

        {/* The badge matters because these filters are now hidden: without it
            a narrowed list looks like there is simply nothing in stock. */}
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={PANEL_ID}
          aria-label={activeCount > 0 ? t.filters.filtersAndSortActive(activeCount) : t.filters.filtersAndSort}
          className={`relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border transition-colors ${
            open || activeCount > 0
              ? 'border-lagoon bg-lagoon text-sand'
              : 'border-border bg-surface text-ink hover:bg-lagoon-soft'
          }`}
        >
          <SlidersHorizontal size={18} />
          {activeCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-sand bg-ink px-1 font-numeric text-[10px] font-bold text-sand">
              {activeCount}
            </span>
          )}
        </button>
      </div>

      {open && (
        <div id={PANEL_ID} className="mt-4 flex flex-col gap-4">
          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">{t.filters.grade}</legend>
            <div className="flex flex-wrap gap-2">
              <Chip active={!filters.category || filters.category === 'all'} onClick={() => setCategory('all')}>
                {t.filters.allGrades}
              </Chip>
              {/* Generated from the shared list, so the grades and their order
                  can never drift from the model. */}
              {TIERS.map((tier) => (
                <Chip key={tier} active={filters.category === tier} onClick={() => setCategory(tier)}>
                  {tierLabel(tier, t)}
                </Chip>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
              {t.filters.priceRange}
            </legend>
            <div className="flex items-center gap-3">
              <label className="flex-1 text-xs text-muted">
                {t.filters.min}
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={filters.minPrice ?? ''}
                  onChange={(e) =>
                    onChange({ ...filters, minPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-surface px-3 font-numeric text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
                />
              </label>
              <label className="flex-1 text-xs text-muted">
                {t.filters.max}
                <input
                  type="number"
                  inputMode="numeric"
                  min={0}
                  value={filters.maxPrice ?? ''}
                  onChange={(e) =>
                    onChange({ ...filters, maxPrice: e.target.value ? Number(e.target.value) : undefined })
                  }
                  className="mt-1 h-11 w-full rounded-xl border border-border bg-surface px-3 font-numeric text-sm text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
                />
              </label>
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="browse-sort"
              className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted"
            >
              {t.filters.sort}
            </label>
            <select
              id="browse-sort"
              value={filters.sort ?? 'newest'}
              onChange={(e) => onChange({ ...filters, sort: e.target.value as SortOption })}
              className="h-11 w-full rounded-xl border border-border bg-surface px-3 text-sm font-medium text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
            >
              {Object.entries(sortLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {(activeCount > 0 || isSorted) && (
            <button
              type="button"
              onClick={resetPanel}
              className="h-11 self-start rounded-full border border-border bg-surface px-4 text-sm font-semibold text-ink hover:bg-lagoon-soft"
            >
              {t.filters.resetFilters}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
