// A soft metallic sheen that fades in over a tiered card on hover, colored
// to match the tier — gold gets a warm amber glow, silver a cool gray one.
// The parent element needs `relative group` for this to trigger correctly.

export function TierShine({ tier, isPremium }: { tier: string; isPremium: boolean }) {
  if (!isPremium || (tier !== 'gold' && tier !== 'silver')) return null

  const glowClass =
    tier === 'gold'
      ? 'bg-gradient-to-br from-amber-200/40 via-transparent to-transparent'
      : 'bg-gradient-to-br from-slate-200/40 via-transparent to-transparent'

  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out ${glowClass}`}
    />
  )
}