/**
 * KWD Favorites — تخزين محلي لمعرفات الوظائف المفضلة
 * يستخدم نفس آلية التخزين مثل useKwdMyFile (AsyncStorage / localStorage)
 */

import { useCallback, useEffect, useState } from 'react';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
};

const STORAGE_KEY = '@bthwani_kwd_favorites_v1';

const getStorage = async (): Promise<StorageLike | null> => {
  if (typeof require !== 'undefined' && typeof window === 'undefined') {
    try {
      const AsyncStorage = require('@react-native-async-storage/async-storage').default as StorageLike;
      if (AsyncStorage?.getItem && AsyncStorage?.setItem) return AsyncStorage;
    } catch {
      return null;
    }
  }
  const ls = typeof globalThis !== 'undefined' && (globalThis as any)?.localStorage;
  if (ls) {
    return {
      getItem: async (key: string) => ls.getItem(key),
      setItem: async (key: string, value: string) => { ls.setItem(key, value); },
    };
  }
  return null;
};

export function useKwdFavorites(): {
  favoriteJobIds: string[];
  isFavorite: (jobId: string) => boolean;
  toggleFavorite: (jobId: string) => Promise<void>;
} {
  const [favoriteJobIds, setFavoriteJobIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      try {
        const storage = await getStorage();
        const raw = storage ? await storage.getItem(STORAGE_KEY) : null;
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const ids = Array.isArray(parsed) ? parsed.filter((id: unknown) => typeof id === 'string') : [];
        if (isMounted) setFavoriteJobIds(ids);
      } catch {
        if (isMounted) setFavoriteJobIds([]);
      }
    };
    void load();
    return () => { isMounted = false; };
  }, []);

  const persist = useCallback(async (ids: string[]) => {
    try {
      const storage = await getStorage();
      if (storage) await storage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch {
      // ignore
    }
  }, []);

  const isFavorite = useCallback(
    (jobId: string) => favoriteJobIds.includes(jobId),
    [favoriteJobIds]
  );

  const toggleFavorite = useCallback(
    async (jobId: string) => {
      const next = favoriteJobIds.includes(jobId)
        ? favoriteJobIds.filter((id) => id !== jobId)
        : [...favoriteJobIds, jobId];
      setFavoriteJobIds(next);
      await persist(next);
    },
    [favoriteJobIds, persist]
  );

  return { favoriteJobIds, isFavorite, toggleFavorite };
}
