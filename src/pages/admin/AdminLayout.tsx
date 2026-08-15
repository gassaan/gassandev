import { NavLink, Navigate, Outlet } from 'react-router-dom'
import { LayoutDashboard, ListOrdered, LogOut, Phone } from 'lucide-react'
import { useAdminAuth } from '@/contexts/AdminAuthContext'

const NAV = [
  { to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/numbers', end: false, label: 'Numbers', icon: Phone },
  { to: '/admin/orders', end: false, label: 'Orders', icon: ListOrdered },
]

export function AdminLayout() {
  const { isAuthenticated, isLoading, signOut } = useAdminAuth()

  if (isLoading) return null
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />

  return (
    <div className="min-h-screen bg-sand">
      <header className="sticky top-0 z-40 border-b border-border bg-sand/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <span className="font-display text-lg font-semibold text-ink">
            Salhi <span className="text-lagoon">Admin</span>
          </span>
          <button
            type="button"
            onClick={() => signOut()}
            className="flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted hover:bg-lagoon-soft hover:text-ink"
          >
            <LogOut size={16} /> Sign out
          </button>
        </div>
        <nav className="mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {NAV.map(({ to, end, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                `flex h-9 items-center gap-1.5 rounded-full px-3.5 text-sm font-medium transition-colors ${
                  isActive ? 'bg-lagoon text-sand' : 'text-ink hover:bg-lagoon-soft'
                }`
              }
            >
              <Icon size={15} /> {label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
