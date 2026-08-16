import { useTheme } from '@/contexts/ThemeContext'
// The mark is a single ink colour, so it ships as two pre-coloured cutouts
// rather than one asset plus a CSS filter or mask: only the active theme's
// file is ever requested, and each is exactly the palette's ink or cream.
import logoInk from '@/assets/brand/salhi-logo-ink.png'
import logoCream from '@/assets/brand/salhi-logo-cream.png'

interface BrandLogoProps {
  className?: string
  /**
   * Renders a second, purely visual copy — the back face of the rotating
   * landing mark. Without this the duplicate would announce the brand name
   * twice and give the h1 a stuttering accessible name.
   */
  decorative?: boolean
}

export function BrandLogo({ className = 'h-11', decorative = false }: BrandLogoProps) {
  const { theme } = useTheme()

  return (
    <img
      src={theme === 'dark' ? logoCream : logoInk}
      // Carries the brand name, so it stays the accessible name and the
      // visible fallback if the image ever fails to load.
      alt={decorative ? '' : 'Salhi Numbers'}
      aria-hidden={decorative || undefined}
      className={`w-auto object-contain ${className}`}
    />
  )
}
