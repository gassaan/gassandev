import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import '@/index.css'
import App from '@/App'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { CartProvider } from '@/contexts/CartContext'
import { ToastProvider } from '@/contexts/ToastContext'
import { AdminAuthProvider } from '@/contexts/AdminAuthContext'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <CartProvider>
          <AdminAuthProvider>
            <HashRouter>
              <App />
            </HashRouter>
          </AdminAuthProvider>
        </CartProvider>
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
)
