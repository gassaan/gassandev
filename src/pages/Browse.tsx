import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { dataService } from '@/data'
import type { NumberFilters, PhoneNumber } from '@/types'
import { NumberCard } from '@/components/NumberCard'
import { NumberGridSkeleton } from '@/components/NumberCardSkeleton'
import { SearchBar } from '@/components/SearchBar'
import { FilterBar } from '@/components/FilterBar'
import { EmptyState } from '@/components/EmptyState'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'
import { useLanguage } from '@/contexts/LanguageContext'

const PAGE_SIZE = 12

export function Browse() {
  useDocumentMeta('Browse numbers — Salhi Numbers', 'Search and filter Dhiraagu and Ooredoo mobile numbers by price, type and pattern.')
  const { t } = useLanguage()

  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<NumberFilters>(() => ({
    query: searchParams.get('q') ?? '',
    provider: (searchParams.get('provider') as NumberFilters['provider']) ?? 'all',
    category: (searchParams.get('category') as NumberFilters['category']) ?? 'all',
    sort: 'newest',
  }))
  const [results, setResults] = useState<PhoneNumber[] | null>(null)
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    let active = true
    dataService.listNumbers(filters).then((numbers) => {
      if (!active) return
      setResults(numbers)
      setVisibleCount(PAGE_SIZE)
      setInitialLoading(false)
    })
    return () => {
      active = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.query, filters.matchMode, filters.provider, filters.category, filters.minPrice, filters.maxPrice, filters.sort])

  const visible = useMemo(() => (results ?? []).slice(0, visibleCount), [results, visibleCount])
  const hasMore = (results?.length ?? 0) > visibleCount

  function clearFilters() {
    setFilters({ query: '', provider: 'all', category: 'all', sort: 'newest' })
  }

  return (
    <div className="mx-auto max-w-5xl px-4 pb-16">
      <div className="sticky top-16 z-40 -mx-4 bg-sand px-4 pt-4">
        <SearchBar value={filters.query ?? ''} onChange={(query) => setFilters((f) => ({ ...f, query }))} />
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="mt-4">
        {initialLoading ? (
          <NumberGridSkeleton count={6} />
        ) : results && results.length === 0 ? (
          <EmptyState
            title={t.browse.emptyTitle}
            description={t.browse.emptyDescription}
            action={
              <button
                type="button"
                onClick={clearFilters}
                className="mt-1 flex h-11 items-center rounded-full bg-lagoon px-5 text-sm font-semibold text-sand hover:bg-lagoon/90"
              >
                {t.browse.clearFilters}
              </button>
            }
          />
        ) : (
          <>
            <p className="mb-3 text-sm text-muted">{t.browse.resultsCount(results?.length ?? 0)}</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {visible.map((n) => (
                <NumberCard key={n.id} number={n} />
              ))}
            </div>
            {hasMore && (
              <div className="mt-6 flex justify-center">
                <button
                  type="button"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="flex h-11 items-center rounded-full border border-border bg-surface px-6 text-sm font-semibold text-ink hover:bg-lagoon-soft"
                >
                  {t.browse.loadMore}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
