// Shared color-coding for premium tiers across article cards and the article page.
// "none" / non-premium articles are left with the site's normal neutral styling.

export type ArticleTier = 'none' | 'silver' | 'gold' | string | null | undefined

export function tierCardClasses(tier: ArticleTier, isPremium: boolean) {
  if (isPremium && tier === 'gold') {
    return 'border-2 border-amber-400 bg-gradient-to-b from-amber-50/60 to-white transition-colors duration-300 group-hover:border-amber-600'
  }
  if (isPremium && tier === 'silver') {
    return 'border-2 border-slate-400 bg-gradient-to-b from-slate-100/70 to-white transition-colors duration-300 group-hover:border-slate-600'
  }
  return 'border border-zinc-300'
}

export function tierAccentClasses(tier: ArticleTier, isPremium: boolean) {
  // For list items (e.g. Editor's Picks) — a colored wash + left bar so it
  // reads as a matching mini-card rather than a faint line.
  if (isPremium && tier === 'gold') {
    return 'border-l-4 border-amber-400 bg-gradient-to-r from-amber-50 to-transparent pl-3 pr-2 py-2 -mx-1 rounded-r-sm transition-colors duration-300 group-hover:border-amber-600'
  }
  if (isPremium && tier === 'silver') {
    return 'border-l-4 border-slate-400 bg-gradient-to-r from-slate-100 to-transparent pl-3 pr-2 py-2 -mx-1 rounded-r-sm transition-colors duration-300 group-hover:border-slate-600'
  }
  return ''
}

export function tierBadgeClasses(tier: ArticleTier) {
  if (tier === 'gold') return 'bg-amber-100 text-amber-800 border border-amber-300'
  if (tier === 'silver') return 'bg-slate-200 text-slate-800 border border-slate-400'
  return 'bg-amber-50 text-amber-800 border border-amber-200'
}