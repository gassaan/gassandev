import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAdminAuth } from '@/contexts/AdminAuthContext'
import { useDocumentMeta } from '@/hooks/useDocumentMeta'

export function AdminLogin() {
  useDocumentMeta('Admin login — Salhi Numbers')
  const { isAuthenticated, isLoading, isDemoMode, demoCredentials, signIn } = useAdminAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) {
      setError(error)
    } else {
      navigate('/admin')
    }
  }

  return (
    <div className="theme-admin mx-auto flex min-h-screen max-w-sm flex-col justify-center bg-sand px-4">
      <h1 className="mb-1 font-display text-2xl font-semibold text-ink">Admin sign in</h1>
      <p className="mb-6 text-sm text-muted">Manage numbers and orders for Salhi Numbers.</p>

      {isDemoMode && demoCredentials && (
        <div className="mb-5 rounded-xl border border-gold/50 bg-gold-soft px-4 py-3 text-xs text-ink">
          Supabase Auth isn't configured yet, so this uses a local demo account:
          <br />
          <span className="font-numeric font-semibold">{demoCredentials.email}</span> /{' '}
          <span className="font-numeric font-semibold">{demoCredentials.password}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Email</span>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
            className="h-12 rounded-xl border border-border bg-surface px-4 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-ink">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="h-12 rounded-xl border border-border bg-surface px-4 text-base text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lagoon"
          />
        </label>

        {error && <p className="text-sm text-danger">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 flex h-12 items-center justify-center rounded-full bg-lagoon text-sm font-semibold text-sand hover:bg-lagoon/90 disabled:opacity-60"
        >
          Sign in
        </button>
      </form>
    </div>
  )
}
