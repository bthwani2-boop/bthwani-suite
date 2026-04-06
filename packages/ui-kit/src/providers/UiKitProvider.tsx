import React from 'react';
import type { Direction } from '../foundation/direction';
import type { ThemeMode } from '../foundation/themes';
import { DirectionProvider } from './DirectionProvider';
import { ThemeProvider } from './ThemeProvider';

export type UiKitProviderProps = {
  direction?: Direction;
  themeMode?: ThemeMode;
  children: React.ReactNode;
};

export function UiKitProvider({ direction = 'rtl', themeMode = 'light', children }: UiKitProviderProps) {
  return (
    <ThemeProvider mode={themeMode}>
      <DirectionProvider direction={direction}>{children}</DirectionProvider>
    </ThemeProvider>
  );
}
