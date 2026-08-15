import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Moon, ShoppingCart, Sun } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'
import { useCart } from '@/contexts/CartContext'
import { BrandLogo } from '@/components/BrandLogo'

// Roughly where the landing hero's logo has slid under the sticky header.
// Approximate on purpose: this only gates a fade, so being a few pixels out
// is invisible, and it avoids Home and Header having to share a ref.
const HERO_LOGO_CLEARED = 120

export function Header() {
  const { theme, toggleTheme } = useTheme()
  const { count } = useCart()
  const { pathname } = useLocation()

  // The landing page already shows the logo at full size in the hero, so the
  // header copy stays out of the way until that one has scrolled off. Every
  // other route has no hero, so it shows immediately.
  const isLanding = pathname === '/'
  const [heroScrolledAway, setHeroScrolledAway] = useState(false)

  useEffect(() => {
    if (!isLanding) return
    const sync = () => setHeroScrolledAway(window.scrollY > HERO_LOGO_CLEARED)
    sync() // the browser may have restored a scroll position on entry
    window.addEventListener('scroll', sync, { passive: true })
    return () => window.removeEventListener('scroll', sync)
  }, [isLanding])

  const logoShown = !isLanding || heroScrolledAway

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-sand/90 backdrop-blur supports-[backdrop-filter]:bg-sand/75">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
        {/* visibility, not just opacity: an invisible-but-present link would
            still take focus and be read out, while `invisible` drops it from
            the tab order and the accessibility tree. It keeps its layout box
            either way, so the controls opposite never shift. */}
        <Link
          to="/"
          className={`flex items-center transition-[opacity,visibility] duration-300 ${
            logoShown ? 'visible opacity-100' : 'invisible opacity-0'
          }`}
          aria-label="Salhi Numbers — home"
        >
          <BrandLogo className="h-11" />
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
