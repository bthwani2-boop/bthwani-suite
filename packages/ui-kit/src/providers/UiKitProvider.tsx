'use client';

import React from 'react';
import type { BthLanguage, Direction } from '../foundation/direction';
import type { ThemeMode } from '../foundation/themes';
import { DirectionProvider } from './DirectionProvider';
import { ThemeProvider } from './ThemeProvider';
import { BthPortalHost } from '../root/core/BthPortalHost';

export type UiKitProviderProps = {
  direction?: Direction;
  language?: BthLanguage;
  themeMode?: ThemeMode;
  children: React.ReactNode;
};

export function UiKitProvider({ direction, language = 'ar', themeMode = 'light', children }: UiKitProviderProps) {
  return (
    <ThemeProvider mode={themeMode}>
      <DirectionProvider direction={direction} language={language}>
        <BthPortalHost>{children}</BthPortalHost>
      </DirectionProvider>
    </ThemeProvider>
  );
}
