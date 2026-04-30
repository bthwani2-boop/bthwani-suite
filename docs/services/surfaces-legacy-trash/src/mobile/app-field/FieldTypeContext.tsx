import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const FIELD_TYPE_STORAGE_KEY = '@bthwani/field-type';
export type FieldType = 'dsh' | 'arb';

type FieldTypeContextValue = {
  fieldType: FieldType | null;
  setFieldType: (t: FieldType) => Promise<void>;
  clearFieldType: () => Promise<void>;
  isLoading: boolean;
};

const FieldTypeContext = createContext<FieldTypeContextValue | null>(null);

export function FieldTypeProvider({ children }: { children: React.ReactNode }) {
  const [fieldType, setState] = useState<FieldType | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(FIELD_TYPE_STORAGE_KEY).then((v) => {
      if (v === 'dsh' || v === 'arb') {
        setState(v);
      } else {
        }
      setIsLoading(false);
    });
  }, []);

  const setFieldType = useCallback(async (t: FieldType) => {
    await AsyncStorage.setItem(FIELD_TYPE_STORAGE_KEY, t);
    setState(t);
  }, []);

  const clearFieldType = useCallback(async () => {
    await AsyncStorage.removeItem(FIELD_TYPE_STORAGE_KEY);
    setState(null);
    }, []);

  const value: FieldTypeContextValue = { fieldType, setFieldType, clearFieldType, isLoading };
  return <FieldTypeContext.Provider value={value}>{children}</FieldTypeContext.Provider>;
}

export function useFieldType(): FieldTypeContextValue {
  const ctx = useContext(FieldTypeContext);
  if (!ctx) throw new Error('useFieldType must be used within FieldTypeProvider');
  return ctx;
}
