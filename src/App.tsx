import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { Header } from '@/components/Header'
import { PageTransition } from '@/components/PageTransition'
import { Home } from '@/pages/Home'
import { Browse } from '@/pages/Browse'
import { Cart } from '@/pages/Cart'
import { Checkout } from '@/pages/Checkout'
import { OrderConfirmation } from '@/pages/OrderConfirmation'
import { AdminLogin } from '@/pages/admin/AdminLogin'
import { AdminLayout } from '@/pages/admin/AdminLayout'
import { AdminDashboard } from '@/pages/admin/AdminDashboard'
import { AdminNumbers } from '@/pages/admin/AdminNumbers'
import { AdminOrders } from '@/pages/admin/AdminOrders'
import { usePageViewTracking } from '@/hooks/usePageViewTracking'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function PageViewTracker() {
  usePageViewTracking()
  return null
}

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-sand">
      <Header />
      <main>
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <PageViewTracker />
      <Routes>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/browse" element={<PublicLayout><Browse /></PublicLayout>} />
        <Route path="/cart" element={<PublicLayout><Cart /></PublicLayout>} />
        <Route path="/checkout" element={<PublicLayout><Checkout /></PublicLayout>} />
        <Route path="/order-confirmation" element={<PublicLayout><OrderConfirmation /></PublicLayout>} />

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="numbers" element={<AdminNumbers />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
