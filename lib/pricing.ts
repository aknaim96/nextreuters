export const TIER_PRICING = {
  silver: { monthly: 1, annual: 10 },
  gold: { monthly: 2, annual: 20 },
} as const

export type TierId = keyof typeof TIER_PRICING