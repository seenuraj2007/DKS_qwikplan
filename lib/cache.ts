import { unstable_cache } from 'next/cache'
import { getCacheConfig } from './env'

export interface CacheConfig {
  revalidate?: number
  tags?: string[]
}

export class CacheManager {
  private static instance: CacheManager
  private cacheStore: Map<string, { data: unknown; expires: number }> = new Map()
  private cacheEnabled: boolean

  private constructor() {
    const config = getCacheConfig()
    this.cacheEnabled = config.enabled
  }

  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  generateCacheKey(prefix: string, params: Record<string, unknown>): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}:${String(params[key])}`)
      .join('|')
    return `${prefix}:${sortedParams}`
  }

  get<T>(key: string): T | null {
    if (!this.cacheEnabled) return null

    const cached = this.cacheStore.get(key)
    if (!cached) return null

    if (Date.now() > cached.expires) {
      this.cacheStore.delete(key)
      return null
    }

    return cached.data as T
  }

  set<T>(key: string, data: T, ttl: number = 3600000): void {
    if (!this.cacheEnabled) return

    const config = getCacheConfig()
    const adjustedTtl = ttl * config.ttlMultiplier
    const expires = Date.now() + adjustedTtl
    this.cacheStore.set(key, { data, expires })
  }

  delete(key: string): void {
    this.cacheStore.delete(key)
  }

  clear(): void {
    this.cacheStore.clear()
  }

  clearByPrefix(prefix: string): void {
    const keys = Array.from(this.cacheStore.keys())
    keys.forEach(key => {
      if (key.startsWith(prefix)) {
        this.cacheStore.delete(key)
      }
    })
  }
}

export const cacheManager = CacheManager.getInstance()

export const CACHE_CONFIG = {
  AI_RESPONSE_TTL: 60 * 60 * 1000, // 1 hour in milliseconds
  USER_DATA_TTL: 5 * 60 * 1000, // 5 minutes
  STRATEGY_TTL: 10 * 60 * 1000, // 10 minutes
  STREAK_TTL: 60 * 60 * 1000, // 1 hour
} as const

export function createCachedFunction<T extends (...args: unknown[]) => Promise<unknown>>(
  fn: T,
  options: {
    keyPrefix: string
    ttl?: number
    getKey?: (...args: Parameters<T>) => string
    skipCache?: (...args: Parameters<T>) => boolean
  }
): T {
  const { keyPrefix, ttl = CACHE_CONFIG.AI_RESPONSE_TTL, getKey, skipCache } = options
  const config = getCacheConfig()

  return (async (...args: Parameters<T>) => {
    if (!config.enabled || (skipCache && skipCache(...args))) {
      return await fn(...args)
    }

    const cacheKey = getKey ? getKey(...args) : cacheManager.generateCacheKey(keyPrefix, args[0] as Record<string, unknown>)

    const cached = cacheManager.get<Awaited<ReturnType<T>>>(cacheKey)
    if (cached !== null) {
      console.log(`[Cache HIT] ${cacheKey}`)
      return cached
    }

    console.log(`[Cache MISS] ${cacheKey}`)
    const result = await fn(...args)

    cacheManager.set(cacheKey, result, ttl)
    return result
  }) as T
}

export const cachedFetch = unstable_cache
