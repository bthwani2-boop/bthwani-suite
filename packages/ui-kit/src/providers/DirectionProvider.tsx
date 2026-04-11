'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { directionConfig, resolveDirectionFromLanguage, type BthLanguage, type Direction } from '../foundation/direction';

function readStoredLanguage() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const storedLanguage = window.localStorage.getItem(directionConfig.languageStorageKey);
    return storedLanguage === 'ar' || storedLanguage === 'en' ? storedLanguage : null;
  } catch {
    return null;
  }
}

function syncDocumentLanguage(language: BthLanguage, direction: Direction) {
  if (typeof document === 'undefined') {
    return;
  }

  document.documentElement.lang = language;
  document.documentElement.dir = direction;

  try {
    window.localStorage.setItem(directionConfig.languageStorageKey, language);
  } catch {
    // Ignore storage failures and keep the in-memory language active.
  }

  try {
    document.cookie = `${directionConfig.languageStorageKey}=${language}; path=/; max-age=31536000; SameSite=Lax`;
  } catch {
    // Ignore cookie failures in non-standard runtimes.
  }
}

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
  const [activeLanguage, setActiveLanguage] = useState<BthLanguage>(() => readStoredLanguage() ?? language);

  useEffect(() => {
    const storedLanguage = readStoredLanguage();

    if (storedLanguage) {
      setActiveLanguage((currentLanguage) => (currentLanguage === storedLanguage ? currentLanguage : storedLanguage));
      return;
    }

    setActiveLanguage((currentLanguage) => (currentLanguage === language ? currentLanguage : language));
  }, [language]);

  const resolvedDirection = resolveDirectionFromLanguage(activeLanguage);

  useEffect(() => {
    syncDocumentLanguage(activeLanguage, resolvedDirection);
  }, [activeLanguage, resolvedDirection]);

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
