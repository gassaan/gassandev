import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface/50 px-6 py-14 text-center">
      {/* A heading element, not a styled paragraph: it is the heading of this
          region, so it belongs in the outline a screen reader navigates by.
          It also matters for type — the Dhivehi display face is applied by
          element, so a <p> here would be the one heading on the site that
          silently kept the body font. */}
      <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
      {description && <p className="max-w-xs text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}
