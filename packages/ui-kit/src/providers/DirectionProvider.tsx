import React, { createContext, useContext, useMemo } from 'react';
import { directionConfig, resolveDirectionFromLanguage, type BthLanguage, type Direction } from '../foundation/direction';

type DirectionContextValue = {
  direction: Direction;
  language: BthLanguage;
  isRtl: boolean;
  usesLogicalStartEnd: boolean;
};

const DirectionContext = createContext<DirectionContextValue>({
  direction: directionConfig.defaultDirection,
  language: directionConfig.defaultLanguage,
  isRtl: directionConfig.defaultDirection === 'rtl',
  usesLogicalStartEnd: directionConfig.useLogicalStartEnd
});

export type DirectionProviderProps = {
  direction?: Direction;
  language?: BthLanguage;
  children: React.ReactNode;
};

export function DirectionProvider({ direction, language = directionConfig.defaultLanguage, children }: DirectionProviderProps) {
  const resolvedDirection = direction ?? resolveDirectionFromLanguage(language);
  const value = useMemo<DirectionContextValue>(
    () => ({
      direction: resolvedDirection,
      language,
      isRtl: resolvedDirection === 'rtl',
      usesLogicalStartEnd: directionConfig.useLogicalStartEnd
    }),
    [language, resolvedDirection]
  );

  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export function useDirectionContext() {
  return useContext(DirectionContext);
}
