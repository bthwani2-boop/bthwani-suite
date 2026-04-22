'use client';

import React from 'react';
import type { BthLanguage, ThemeMode } from './foundation';
import { DirectionProvider } from './DirectionProvider';
import { ThemeProvider } from './ThemeProvider';
import { BthPortalHost } from './BthPortalHost';

export type UiKitProviderProps = {
  language?: BthLanguage;
  themeMode?: ThemeMode;
  children: React.ReactNode;
};

export function UiKitProvider({ language = 'ar', themeMode = 'light', children }: UiKitProviderProps) {
  return (
    <ThemeProvider mode={themeMode}>
      <DirectionProvider language={language}>
        <BthPortalHost>{children}</BthPortalHost>
      </DirectionProvider>
    </ThemeProvider>
  );
}
