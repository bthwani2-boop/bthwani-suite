'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { directionConfig, resolveDirectionFromLanguage, type BthLanguage, type Direction } from '../foundation/direction';

type DirectionContextValue = {
  direction: Direction;
  language: BthLanguage;
  isRtl: boolean;
  usesLogicalStartEnd: boolean;
  setLanguage: (language: BthLanguage) => void;
};

const DirectionContext = createContext<DirectionContextValue>({
  direction: directionConfig.defaultDirection,
  language: directionConfig.defaultLanguage,
  isRtl: directionConfig.defaultDirection === 'rtl',
  usesLogicalStartEnd: directionConfig.useLogicalStartEnd,
  setLanguage: () => undefined,
});

export type DirectionProviderProps = {
  language?: BthLanguage;
  children: React.ReactNode;
};

export function DirectionProvider({ language = directionConfig.defaultLanguage, children }: DirectionProviderProps) {
  const [activeLanguage, setActiveLanguage] = useState<BthLanguage>(language);

  useEffect(() => {
    setActiveLanguage(language);
  }, [language]);

  const resolvedDirection = resolveDirectionFromLanguage(activeLanguage);

  const setLanguage = useCallback((nextLanguage: BthLanguage) => {
    setActiveLanguage(nextLanguage);
  }, []);

  const value = useMemo<DirectionContextValue>(
    () => ({
      direction: resolvedDirection,
      language: activeLanguage,
      isRtl: resolvedDirection === 'rtl',
      usesLogicalStartEnd: directionConfig.useLogicalStartEnd,
      setLanguage,
    }),
    [activeLanguage, resolvedDirection, setLanguage]
  );

  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export function useDirectionContext() {
  return useContext(DirectionContext);
}
