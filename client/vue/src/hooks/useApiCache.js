import { ref } from 'vue';
import apiClient from '@/api/client';
import performanceLogger from '@/utils/performanceLogger';

const cache = new Map();

export function useApiCache() {
  const isLoading = ref(false);
  const error = ref(null);

  const fetchData = async (endpoint) => {
    const cacheKey = endpoint;
    if (cache.has(cacheKey)) {
      return cache.get(cacheKey);
    }

    isLoading.value = true;
    error.value = null;

    const stop = performanceLogger.start('APIResponseTime');
    try {
      const response = await apiClient.get(endpoint);
      cache.set(cacheKey, response.data);
      stop();
      return response.data;
    } catch (err) {
      stop();
      performanceLogger.logError('APIResponseTime', err);
      error.value = err;
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const invalidateCache = (endpoint) => {
    cache.set(endpoint, undefined);
  };

  return { fetchData, isLoading, error, invalidateCache };
}
