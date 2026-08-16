import { useTheme } from '@/contexts/ThemeContext'
// The mark is a single ink colour, so it ships as two pre-coloured cutouts
// rather than one asset plus a CSS filter or mask: only the active theme's
// file is ever requested, and each is exactly the palette's ink or cream.
import logoInk from '@/assets/brand/salhi-logo-ink.png'
import logoCream from '@/assets/brand/salhi-logo-cream.png'

export function BrandLogo({ className = 'h-11' }: { className?: string }) {
  const { theme } = useTheme()

  return (
    <img
      src={theme === 'dark' ? logoCream : logoInk}
      // Carries the brand name, so it stays the accessible name and the
      // visible fallback if the image ever fails to load.
      alt="Salhi Numbers"
      className={`w-auto object-contain ${className}`}
    />
  )
}
