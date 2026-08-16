import type { CSSProperties } from 'react'
import { useTheme } from '@/contexts/ThemeContext'
// Imported rather than referenced by path: the site is served from a project
// subpath, so only Vite can write a URL that resolves in production.
import logoInk from '@/assets/brand/salhi-logo-ink.png'
import logoCream from '@/assets/brand/salhi-logo-cream.png'

// The slab is built from copies of the mark stacked along Z. CSS has no real
// extrusion, so thickness has to be faked by stacking — but because each copy
// keeps the artwork's own alpha, the thickness follows the script lettering
// instead of a bounding box, which is what makes it read as a milled object.
//
// Twelve slices keeps the gap under a pixel even at the angle where the edge
// band is widest (~45deg), so the side never shows as stripes. Each slice
// costs a composited layer, which is why this is not simply cranked higher.
const SLICES = 12

// Front (+0.5) to back (-0.5) as a fraction of the slab depth. Depth itself
// lives in CSS so it can grow with the mark at the sm breakpoint.
const OFFSETS = Array.from({ length: SLICES }, (_, i) => 0.5 - i / (SLICES - 1))

const atDepth = (fraction: number) => `translateZ(calc(var(--logo-depth) * ${fraction.toFixed(4)}))`

export function HeroLogo() {
  const { theme } = useTheme()
  const src = theme === 'dark' ? logoCream : logoInk

  return (
    <span className="logo3d" style={{ '--logo': `url(${src})` } as CSSProperties}>
      <span className="logo3d-tilt">
        <span className="logo3d-body">
          {/* The front slice is the one real image. It carries the heading text
              for assistive tech, it is the visible fallback if the asset fails
              to load, and being the only in-flow child it sizes the stack. */}
          <img src={src} alt="Salhi Numbers" className="logo3d-front h-32 w-auto sm:h-44" style={{ transform: atDepth(OFFSETS[0]) }} />

          {OFFSETS.slice(1).map((fraction) => (
            <span key={`f${fraction}`} className="logo3d-slice" style={{ transform: atDepth(fraction) }} aria-hidden="true" />
          ))}

          {/* Seen from behind, every slice would show the mark mirrored and the
              brand name would read backwards through half of each turn. So each
              depth carries a second copy already turned to face the other way;
              backface-visibility means exactly one of the pair is ever drawn. */}
          {OFFSETS.map((fraction) => (
            <span
              key={`b${fraction}`}
              className="logo3d-slice"
              style={{ transform: `${atDepth(fraction)} rotateY(180deg)` }}
              aria-hidden="true"
            />
          ))}

          {/* Highlight sweeps, clipped to the mark's own silhouette and phased
              so each fires as its face turns through the light. */}
          <span className="logo3d-shine logo3d-shine--front" aria-hidden="true" />
          <span className="logo3d-shine logo3d-shine--back" aria-hidden="true" />
        </span>
      </span>
    </span>
  )
}
