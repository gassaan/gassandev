export function NumberCardSkeleton() {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-center justify-between">
        <div className="h-4 w-16 animate-pulse rounded-full bg-border" />
        <div className="h-5 w-14 animate-pulse rounded bg-border" />
      </div>
      <div className="h-9 w-40 animate-pulse rounded bg-border" />
      <div className="flex gap-1.5">
        <div className="h-5 w-16 animate-pulse rounded-full bg-border" />
        <div className="h-5 w-20 animate-pulse rounded-full bg-border" />
      </div>
      <div className="flex items-end justify-between pt-1">
        <div className="h-5 w-20 animate-pulse rounded bg-border" />
        <div className="h-11 w-24 animate-pulse rounded-full bg-border" />
      </div>
    </div>
  )
}

export function NumberGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: count }).map((_, i) => (
        <NumberCardSkeleton key={i} />
      ))}
    </div>
  )
}
