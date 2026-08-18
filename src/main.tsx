import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@/index.css'
import App from '@/App'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'

// Applied synchronously, before the first paint: LanguageProvider sets these
// too, but only once React has mounted and its effect has run. Without this,
// a returning Dhivehi visitor sees a flash of the English ltr layout first.
if (localStorage.getItem('salhi.lang.v1') === 'dv') {
  document.documentElement.lang = 'dv'
  document.documentElement.dir = 'rtl'
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
