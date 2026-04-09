/**
 * useFirstLaunchSeen - هل المستخدم شاهد شاشة الترحيب الأولى؟
 * يُخزّن في AsyncStorage مرة واحدة لكل تطبيق (app-user, app-partner, ...).
 * بعد الضغط على "تخطي" أو "متابعة" لا تُعرض الشاشة مرة أخرى.
 */

import { useState, useEffect, useCallback } from 'react';

const STORAGE_PREFIX = '@bthwani/first_launch_seen_';

function getStorage(): Promise<{ getItem: (k: string) => Promise<string | null>; setItem: (k: string, v: string) => Promise<void> } | null> {
  try {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    return Promise.resolve(AsyncStorage);
  } catch {
    return Promise.resolve(null);
  }
}

export interface UseFirstLaunchSeenResult {
  /** false حتى نقرأ التخزين؛ ثم true إذا شاهد المستخدم الشاشة من قبل */
  hasSeen: boolean | null;
  /** تأكيد أن المستخدم شاهد الشاشة (يُستدعى عند "تخطي" أو "متابعة") */
  setSeen: () => Promise<void>;
  /** جاري التحقق من التخزين */
  isLoading: boolean;
}

/**
 * @param appKey مفتاح التطبيق، مثلاً: 'app-user' | 'app-partner' | 'app-captain' | 'app-field'
 */
export function useFirstLaunchSeen(appKey: string): UseFirstLaunchSeenResult {
  const [hasSeen, setHasSeen] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const key = `${STORAGE_PREFIX}${appKey}`;

    getStorage().then((storage) => {
      if (cancelled || !storage) {
        setIsLoading(false);
        setHasSeen((prev) => (prev === null ? false : prev));
        return;
      }
      storage.getItem(key).then((value) => {
        if (!cancelled) {
          setHasSeen(value === '1');
          setIsLoading(false);
        }
      });
    });

    return () => {
      cancelled = true;
    };
  }, [appKey]);

  const setSeen = useCallback(async () => {
    const key = `${STORAGE_PREFIX}${appKey}`;
    const storage = await getStorage();
    if (storage) {
      await storage.setItem(key, '1');
    }
    setHasSeen(true);
  }, [appKey]);

  return { hasSeen, setSeen, isLoading };
}
