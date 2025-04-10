import { useState, useCallback } from 'react';

import apiClient from '../api/client';

import performanceLogger from '../utils/performanceLogger';

type CacheKey = string;
type CacheValue = any;

const cache = new Map<CacheKey, CacheValue>();

export const useApiCache = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async <T>(endpoint: string): Promise<T> => {
    const cacheKey = endpoint;

    if (cache.has(cacheKey)) {
      return cache.get(cacheKey) as T;
    }

    setLoading(true);
    setError(null);

    const stop = performanceLogger.start('APIResponseTime');
    try {
      const response = await apiClient.get(endpoint);
      cache.set(cacheKey, response.data);
      stop();
      return response.data as T;
    } catch (err) {
      stop();
      performanceLogger.logError(
        'APIResponseTime',
        err instanceof Error ? err : new Error('Unknown error')
      );
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const invalidateCache = useCallback((endpoint: string) => {
    cache.set(endpoint, undefined);
  }, []);

  return { fetchData, isLoading, error, invalidateCache };
};
