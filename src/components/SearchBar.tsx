import { Search, X } from 'lucide-react'

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search a number… try 7777',
  autoFocus = false,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  autoFocus?: boolean
}) {
  return (
    <div className="relative">
      <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        inputMode="numeric"
        autoFocus={autoFocus}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label="Search phone numbers"
        className="w-full rounded-full border border-border bg-surface py-3.5 pl-11 pr-11 font-numeric text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-muted hover:bg-lagoon-soft hover:text-ink"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
