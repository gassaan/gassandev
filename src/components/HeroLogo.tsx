import type { CSSProperties } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
// Imported rather than referenced by path: the site is served from a project
// subpath, so only Vite can write a URL that resolves in production.
import logoInk from '@/assets/brand/salhi-logo-ink.svg'
import logoCream from '@/assets/brand/salhi-logo-cream.svg'

export function HeroLogo() {
  const { theme } = useTheme()
  const src = theme === 'dark' ? logoCream : logoInk

  return (
    <span className="logo3d" style={{ '--logo': `url(${src})` } as CSSProperties}>
      {/* The extruded body and the cast shadow are filters on the image itself,
          so they follow the artwork's own alpha and the depth traces the script
          lettering rather than a bounding box. */}
      <img src={src} alt="Salhi Numbers" className="logo3d-face h-44 w-auto sm:h-56" />
      {/* The bevel: a lit band along the top-left of every stroke and a shaded
          one along the bottom-right. Between them they are what make the face
          read as a rounded, struck surface rather than a flat cutout. */}
      <span className="logo3d-edge logo3d-edge--lit" aria-hidden="true" />
      <span className="logo3d-edge logo3d-edge--shade" aria-hidden="true" />
    </span>
  )
}
