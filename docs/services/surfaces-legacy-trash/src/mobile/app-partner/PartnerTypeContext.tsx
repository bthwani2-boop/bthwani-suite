import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const PARTNER_TYPE_STORAGE_KEY = '@bthwani/partner-type';
export type PartnerType = 'dsh' | 'arb';

type PartnerTypeContextValue = {
  partnerType: PartnerType | null;
  setPartnerType: (t: PartnerType) => Promise<void>;
  clearPartnerType: () => Promise<void>;
  isLoading: boolean;
};

const PartnerTypeContext = createContext<PartnerTypeContextValue | null>(null);

export function PartnerTypeProvider({ children }: { children: React.ReactNode }) {
  const [partnerType, setState] = useState<PartnerType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(PARTNER_TYPE_STORAGE_KEY).then((v) => {
      if (v === 'dsh' || v === 'arb') {
        setState(v);
      } else {
        }
      setIsLoading(false);
    });
  }, []);

  const setPartnerType = useCallback(async (t: PartnerType) => {
    await AsyncStorage.setItem(PARTNER_TYPE_STORAGE_KEY, t);
    setState(t);
  }, []);

  const clearPartnerType = useCallback(async () => {
    await AsyncStorage.removeItem(PARTNER_TYPE_STORAGE_KEY);
    setState(null);
    }, []);

  const value: PartnerTypeContextValue = { partnerType, setPartnerType, clearPartnerType, isLoading };
  return <PartnerTypeContext.Provider value={value}>{children}</PartnerTypeContext.Provider>;
}

export function usePartnerType(): PartnerTypeContextValue {
  const ctx = useContext(PartnerTypeContext);
  if (!ctx) throw new Error('usePartnerType must be used within PartnerTypeProvider');
  return ctx;
}
