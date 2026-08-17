// The mark is a single ink colour and the site is dark throughout, so it ships
// as one pre-coloured file rather than an asset plus a CSS filter or mask.
// Vector, because the hero draws it far larger than any bitmap we have could
// cover without softening.
import logoCream from '@/assets/brand/salhi-logo-cream.svg'

export function BrandLogo({ className = 'h-11' }: { className?: string }) {
  return (
    <img
      src={logoCream}
      // Carries the brand name, so it stays the accessible name and the
      // visible fallback if the image ever fails to load.
      alt="Salhi Numbers"
      className={`w-auto object-contain ${className}`}
    />
  )
}
