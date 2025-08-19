// /src/utils/fetchWithCache.ts

type CacheEntry<T> = {
  timestamp: number;
  data: T;
};

const CACHE_DURATION = 1000 * 60 * 5; // Cache valid for 5 minutes

const cache = new Map<string, CacheEntry<any>>();

export async function fetchWithCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  cacheDuration = CACHE_DURATION
): Promise<T> {
  const now = Date.now();
  const cached = cache.get(key);

  if (cached && now - cached.timestamp < cacheDuration) {
    console.log(`💾 Returning cached result for: ${key}`);
    return cached.data;
  }

  console.log(`🌐 Fetching fresh data for: ${key}`);
  const data = await fetcher();
  cache.set(key, { timestamp: now, data });
  return data;
}

export function clearCache(key?: string) {
  if (key) {
    cache.delete(key);
    console.log(`🧹 Cache cleared for: ${key}`);
  } else {
    cache.clear();
    console.log(`🧹 All cache cleared`);
  }
}
