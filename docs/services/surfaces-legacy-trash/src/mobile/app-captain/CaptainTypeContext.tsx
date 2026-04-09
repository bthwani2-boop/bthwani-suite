import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CAPTAIN_TYPE_STORAGE_KEY, type CaptainType } from '../../captain/captainTypes';

type CaptainTypeContextValue = {
  captainType: CaptainType | null;
  setCaptainType: (t: CaptainType) => Promise<void>;
  clearCaptainType: () => Promise<void>;
  isLoading: boolean;
};

const CaptainTypeContext = createContext<CaptainTypeContextValue | null>(null);

export function CaptainTypeProvider({ children }: { children: React.ReactNode }) {
  const [captainType, setState] = useState<CaptainType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CAPTAIN_TYPE_STORAGE_KEY).then((v) => {
      if (v === 'dsh' || v === 'amn') {
        setState(v);
      }
      setIsLoading(false);
    });
  }, []);

  const setCaptainType = useCallback(async (t: CaptainType) => {
    await AsyncStorage.setItem(CAPTAIN_TYPE_STORAGE_KEY, t);
    setState(t);
  }, []);

  const clearCaptainType = useCallback(async () => {
    await AsyncStorage.removeItem(CAPTAIN_TYPE_STORAGE_KEY);
    setState(null);
    }, []);

  const value: CaptainTypeContextValue = { captainType, setCaptainType, clearCaptainType, isLoading };
  return <CaptainTypeContext.Provider value={value}>{children}</CaptainTypeContext.Provider>;
}

export function useCaptainType(): CaptainTypeContextValue {
  const ctx = useContext(CaptainTypeContext);
  if (!ctx) throw new Error('useCaptainType must be used within CaptainTypeProvider');
  return ctx;
}
