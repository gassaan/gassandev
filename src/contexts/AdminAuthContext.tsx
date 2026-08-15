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
  isLoading: boolean
  isDemoMode: boolean
  demoCredentials: { email: string; password: string } | null
  signIn: (email: string, password: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data }) => {
        setIsAuthenticated(Boolean(data.session))
        setIsLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
        setIsAuthenticated(Boolean(session))
      })
      return () => sub.subscription.unsubscribe()
    }
    setIsAuthenticated(sessionStorage.getItem(SESSION_KEY) === 'true')
    setIsLoading(false)
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) return { error: error.message }
      setIsAuthenticated(true)
      return {}
    }
    if (email.trim().toLowerCase() === DEMO_EMAIL && password === DEMO_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, 'true')
      setIsAuthenticated(true)
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
  }, [])

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      isDemoMode: !isSupabaseConfigured,
      demoCredentials: isSupabaseConfigured ? null : { email: DEMO_EMAIL, password: DEMO_PASSWORD },
      signIn,
      signOut,
    }),
    [isAuthenticated, isLoading, signIn, signOut],
  )

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>
}

export function useAdminAuth(): AdminAuthContextValue {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
