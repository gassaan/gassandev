import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@/index.css'
import App from '@/App'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Applied synchronously, before the first paint: <DirectionSync> in App.tsx
// sets these too, but only once React has mounted, the router has resolved
// a route, and its effect has run. Without this, a returning Dhivehi visitor
// sees a flash of the English ltr layout first. Checks the hash route the
// same way <DirectionSync> checks pathname, so a bookmarked admin URL
// doesn't flash rtl either — admin stays English/LTR regardless of the
// stored language.
const isAdminRoute = location.hash.startsWith('#/admin')
if (!isAdminRoute && localStorage.getItem('salhi.lang.v1') === 'dv') {
  document.documentElement.lang = 'dv'
  document.documentElement.dir = 'rtl'
}

// index.html's inline pre-paint background is the customer-facing page
// colour (see the note there), since that's the overwhelming majority of
// visits. A direct visit to an admin URL needs correcting back to admin's
// own black before the stylesheet arrives, or it flashes the customer
// palette first — same race index.html's own comment describes.
if (isAdminRoute) {
  document.documentElement.style.backgroundColor = '#0a0a0a'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <ToastProvider>
        <CartProvider>
          <AdminAuthProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </AdminAuthProvider>
        </CartProvider>
      </ToastProvider>
    </LanguageProvider>
  </StrictMode>,
)
