import { useCallback, useEffect, useState } from 'react';
import {
  DEFAULT_KWD_MY_FILE,
  type KwdMyFile,
} from '../types';

type StorageLike = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

const STORAGE_KEY = '@bthwani_kwd_my_file_v1';

const createMemoryStorage = (): StorageLike => {
  const storage: Record<string, string> = {};
  return {
    getItem: async (key: string) => storage[key] ?? null,
    setItem: async (key: string, value: string) => {
      storage[key] = value;
    },
    removeItem: async (key: string) => {
      delete storage[key];
    },
  };
};

const getStorage = async (): Promise<StorageLike> => {
  // React Native (AsyncStorage) – same pattern used in UserPreferencesService
  if (typeof require !== 'undefined' && typeof window === 'undefined') {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const AsyncStorage = require('@react-native-async-storage/async-storage')
        .default as StorageLike;
      if (AsyncStorage?.getItem && AsyncStorage?.setItem && AsyncStorage?.removeItem) {
        return AsyncStorage;
      }
    } catch {
      return createMemoryStorage();
    }
  }

  // Web – localStorage
  const ls =
    typeof globalThis !== 'undefined' &&
    (globalThis as any)?.localStorage &&
    (globalThis as any).localStorage;

  if (ls) {
    return {
      getItem: async (key: string) => {
        try {
          return ls.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          ls.setItem(key, value);
        } catch {
          // ignore
        }
      },
      removeItem: async (key: string) => {
        try {
          ls.removeItem(key);
        } catch {
          // ignore
        }
      },
    };
  }

  return createMemoryStorage();
};

interface UseKwdMyFileResult {
  myFile: KwdMyFile;
  isLoading: boolean;
  isSaving: boolean;
  saveMyFile: (next: KwdMyFile) => Promise<void>;
  updateMyFile: (partial: Partial<KwdMyFile>) => Promise<void>;
  resetMyFile: () => Promise<void>;
}

export const useKwdMyFile = (): UseKwdMyFileResult => {
  const [myFile, setMyFile] = useState<KwdMyFile>(DEFAULT_KWD_MY_FILE);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        const storage = await getStorage();
        const raw = await storage.getItem(STORAGE_KEY);
        if (!raw) {
          if (isMounted) {
            setMyFile(DEFAULT_KWD_MY_FILE);
          }
          return;
        }

        const parsed = JSON.parse(raw) as Partial<KwdMyFile>;
        const merged: KwdMyFile = {
          ...DEFAULT_KWD_MY_FILE,
          ...parsed,
          portfolioImageUris: Array.isArray(parsed.portfolioImageUris)
            ? parsed.portfolioImageUris
            : DEFAULT_KWD_MY_FILE.portfolioImageUris,
          categoryIds: Array.isArray(parsed.categoryIds) ? parsed.categoryIds : DEFAULT_KWD_MY_FILE.categoryIds ?? [],
        };

        if (isMounted) {
          setMyFile(merged);
        }
      } catch {
        if (isMounted) {
          setMyFile(DEFAULT_KWD_MY_FILE);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  const persist = useCallback(async (next: KwdMyFile) => {
    setIsSaving(true);
    try {
      const storage = await getStorage();
      await storage.setItem(STORAGE_KEY, JSON.stringify(next));
      // Backend sync can be added here later (GET/PUT /api/kwd/me/file).
    } catch {
      // ignore storage failures – UX should stay smooth
    } finally {
      setIsSaving(false);
    }
  }, []);

  const saveMyFile = useCallback(
    async (next: KwdMyFile) => {
      setMyFile(next);
      await persist(next);
    },
    [persist]
  );

  const updateMyFile = useCallback(
    async (partial: Partial<KwdMyFile>) => {
      const next: KwdMyFile = {
        ...myFile,
        ...partial,
        portfolioImageUris: Array.isArray(partial.portfolioImageUris)
          ? partial.portfolioImageUris
          : myFile.portfolioImageUris,
        categoryIds: partial.categoryIds !== undefined
          ? partial.categoryIds
          : myFile.categoryIds,
      };
      await saveMyFile(next);
    },
    [myFile, saveMyFile]
  );

  const resetMyFile = useCallback(async () => {
    setMyFile(DEFAULT_KWD_MY_FILE);
    try {
      const storage = await getStorage();
      await storage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return {
    myFile,
    isLoading,
    isSaving,
    saveMyFile,
    updateMyFile,
    resetMyFile,
  };
};

