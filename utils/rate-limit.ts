import { LRUCache } from 'lru-cache'

type Options = {
  uniqueTokenPerInterval?: number
  interval?: number
}

export function rateLimit(options?: Options) {
  const tokenCache = new LRUCache({
    max: options?.uniqueTokenPerInterval || 500,
    ttl: options?.interval || 60000, // 1 minute default window
  })

  return {
    check: (limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount = (tokenCache.get(token) as number[]) || [0]
        if (tokenCount[0] === 0) {
          tokenCache.set(token, [1])
        } else {
          tokenCount[0] += 1
          tokenCache.set(token, tokenCount)
        }
        const currentUsage = tokenCount[0]
        const isRateLimited = currentUsage >= limit
        return isRateLimited ? reject(new Error('Rate limit exceeded')) : resolve()
      }),
  }
}

// Global rate limiter instance: max 5 requests per 60 seconds per IP
export const limiter = rateLimit({
  interval: 60 * 1000,
  uniqueTokenPerInterval: 500,
})