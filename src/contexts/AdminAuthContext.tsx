import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { isSupabaseConfigured, supabase } from '@/lib/supabaseClient'

const SESSION_KEY = 'salhi.admin.session'

// Used only while Supabase Auth isn't configured, so the admin panel is
// still reachable during development. Swapped out automatically once
// VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set.
const DEMO_EMAIL = 'admin@salhinumbers.mv'
const DEMO_PASSWORD = 'salhi-admin'

interface AdminAuthContextValue {
  isAuthenticated: boolean
  /** Email of the signed-in admin, or null when signed out. */
  userEmail: string | null
  isLoading: boolean
  isDemoMode: boolean
  demoCredentials: { email: string; password: string } | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setIsAuthenticated(Boolean(data.session))
        setUserEmail(data.session?.user.email ?? null)
        setIsLoading(false)
      })
      // Also fires on token refresh and on sign-out in another tab, so the
      // displayed identity tracks the real session rather than whatever was
      // true at sign-in.
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(Boolean(session))
        setUserEmail(session?.user.email ?? null)
      })
      return () => sub.subscription.unsubscribe()
    }
    const signedIn = sessionStorage.getItem(SESSION_KEY) === 'true'
    setIsAuthenticated(signedIn)
    setUserEmail(signedIn ? DEMO_EMAIL : null)
    setIsLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      setIsAuthenticated(true)
      setUserEmail(data.user?.email ?? null)
      return {}
    }
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setIsAuthenticated(true)
      setUserEmail(DEMO_EMAIL)
      return {}
    }
    return { error: 'Incorrect email or password.' }
  }, [])

  const signOut = useCallback(async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut()
    } else {
      sessionStorage.removeItem(SESSION_KEY)
    }
    setIsAuthenticated(false)
    setUserEmail(null)
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      userEmail,
      isLoading,
      isDemoMode: !isSupabaseConfigured,
      demoCredentials: isSupabaseConfigured ? null : { email: DEMO_EMAIL, password: DEMO_PASSWORD },
      signIn,
      signOut,
    }),
    [isAuthenticated, userEmail, isLoading, signIn, signOut],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
