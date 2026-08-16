import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * Fades page content in on navigation.
 *
 * Keyed on the path so React remounts the wrapper each time the route changes,
 * which is what restarts the animation — without the key the element persists
 * across navigations and the fade would only ever play on first load. Keyed on
 * the path alone, not the query string, so changing a filter on the browse page
 * does not re-fade the whole page under the person using it.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const { pathname } = useLocation()

  return (
    <div key={pathname} className="page-enter">
      {children}
    </div>
  )
}
