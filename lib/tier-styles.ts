// lib/tier-styles.ts

export type ArticleTier = 'none' | 'silver' | 'gold' | string | null | undefined

export function tierCardClasses(tier: ArticleTier, isPremium: boolean) {
  if (!isPremium) {
    return 'border border-zinc-200 bg-white hover:border-zinc-400 transition-all duration-700 ease-out'
  }

  if (tier === 'gold') {
    // Rich, luminous brushed-gold gradient designed for high contrast and zero text fade
    return 'border-2 border-amber-400 bg-gradient-to-br from-amber-100/90 via-yellow-50/70 to-amber-200/80 hover:border-amber-500 hover:from-amber-100 hover:via-yellow-100/80 hover:to-amber-300/90 transition-all duration-700 ease-out shadow-xs hover:shadow-md text-zinc-900'
  }

  if (tier === 'silver') {
    // Crisp, bright polished-silver gradient with high text readability
    return 'border-2 border-slate-300 bg-gradient-to-br from-slate-100/95 via-slate-50/80 to-zinc-200/90 hover:border-slate-400 hover:from-slate-200 hover:via-slate-100 hover:to-zinc-300 transition-all duration-700 ease-out shadow-xs hover:shadow-md text-zinc-900'
  }

  return 'border border-zinc-200 bg-white'
}

export function tierAccentClasses(tier: ArticleTier, isPremium: boolean) {
  if (!isPremium) {
    return 'border-l-2 border-transparent pl-3 pr-2 py-2'
  }

  if (tier === 'gold') {
    return '!border-2 !border-amber-400 !border-l-4 !border-l-amber-500 bg-gradient-to-br from-amber-100/90 via-yellow-50/70 to-amber-200/80 pl-3 pr-3 py-3 rounded-r-xs transition-all duration-700 ease-out hover:!border-amber-500 hover:from-amber-100 hover:via-yellow-100/80 hover:to-amber-300/90 shadow-xs hover:shadow-md text-zinc-900'
  }

  if (tier === 'silver') {
    return '!border-2 !border-slate-300 !border-l-4 !border-slate-500 bg-gradient-to-br from-slate-100/95 via-slate-50/80 to-zinc-200/90 pl-3 pr-3 py-3 rounded-r-xs transition-all duration-700 ease-out hover:!border-slate-400 hover:from-slate-200 hover:via-slate-100 hover:to-zinc-300 shadow-xs hover:shadow-md text-zinc-900'
  }

  return 'border-l-2 border-transparent pl-3 pr-2 py-2'
}

export function tierBadgeClasses(tier: ArticleTier) {
  if (tier === 'gold') {
    return 'bg-gradient-to-r from-amber-200 via-yellow-100 to-amber-300 text-amber-950 border border-amber-400 font-bold shadow-2xl'
  }

  if (tier === 'silver') {
    return 'bg-gradient-to-r from-slate-200 via-zinc-100 to-slate-300 text-slate-900 border border-slate-400 font-bold shadow-2xl'
  }

  return 'bg-zinc-100 text-zinc-700 border border-zinc-200 font-medium'
}