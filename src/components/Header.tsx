import { Link } from 'react-router-dom'
import { Moon, ShoppingCart, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart } from '@/contexts/CartContext'

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { count } = useCart()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-sand/90 backdrop-blur supports-[backdrop-filter]:bg-sand/75">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        <Link to="/" className="font-display text-xl font-semibold tracking-tight text-ink">
          Salhi <span className="text-lagoon">Numbers</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-lagoon-soft"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link
            to="/cart"
            aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
            className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-lagoon-soft"
          >
            <ShoppingCart size={20} />
            {count > 0 && (
              <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-lagoon px-1 font-numeric text-[10px] font-bold text-sand">
                {count}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  )
}
