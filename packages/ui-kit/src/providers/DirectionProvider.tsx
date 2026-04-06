import React, { createContext, useContext, useMemo } from 'react';
import { directionConfig, type Direction } from '../foundation/direction';

type DirectionContextValue = {
  direction: Direction;
  isRtl: boolean;
};

const DirectionContext = createContext<DirectionContextValue>({
  direction: directionConfig.defaultDirection,
  isRtl: directionConfig.defaultDirection === 'rtl'
});

export type DirectionProviderProps = {
  direction?: Direction;
  children: React.ReactNode;
};

export function DirectionProvider({ direction = directionConfig.defaultDirection, children }: DirectionProviderProps) {
  const value = useMemo<DirectionContextValue>(() => ({ direction, isRtl: direction === 'rtl' }), [direction]);
  return <DirectionContext.Provider value={value}>{children}</DirectionContext.Provider>;
}

export function useDirectionContext() {
  return useContext(DirectionContext);
}
