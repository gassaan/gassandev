import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { dataService } from '@/data'

const SESSION_KEY = 'salhi.session'

/**
 * Groups one browsing session. Held in sessionStorage rather than
 * localStorage or a cookie, so it dies with the tab and cannot follow anyone
 * between visits — which is why the dashboard reports "visits", not "unique
 * visitors". Nothing here identifies a person.
 */
function sessionId(): string {
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = Math.random().toString(36).slice(2) + Date.now().toString(36)
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

function referrerHost(): string | null {
  if (!document.referrer) return null
  try {
    const host = new URL(document.referrer).hostname
    // Internal navigation is not a referral and would drown out the real
    // sources — the whole point of this field is where visitors arrive from.
    return host === window.location.hostname ? null : host
  } catch {
    return null
  }
}

export function usePageViewTracking() {
  const { pathname } = useLocation()
  // StrictMode double-invokes effects in development, and a re-render must not
  // count twice either; only a genuinely new path is recorded.
  const lastRecorded = useRef<string | null>(null)

  useEffect(() => {
    // Never count staff using the admin panel as shop traffic.
    if (pathname.startsWith('/admin')) return
    if (lastRecorded.current === pathname) return
    lastRecorded.current = pathname

    dataService
      .recordPageView({ path: pathname, referrerHost: referrerHost(), sessionId: sessionId() })
      .catch(() => {
        // Analytics must never surface an error to a customer or block a page.
      })
  }, [pathname])
}
