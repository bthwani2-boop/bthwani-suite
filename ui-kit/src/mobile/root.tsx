import React, { type ReactNode } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { getBThwaniAppearanceThemeMode, type BThwaniAppearanceMode } from '../appearance';
import { BThwaniAppearanceProvider, RootProviders, type RootProvidersProps, useTheme } from '../providers';

export type MobileRootProps = RootProvidersProps & {
  children: ReactNode;
  appearanceMode?: BThwaniAppearanceMode;
};

function MobileRootFrame({ children }: { children: ReactNode }) {
  const { mode, theme } = useTheme();

  return (
    <>
      <StatusBar
        animated
        barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {children}
      </SafeAreaView>
    </>
  );
}

export function MobileRoot({ children, appearanceMode, ...rootProps }: MobileRootProps) {
  const resolvedThemeMode = rootProps.themeMode ?? (appearanceMode ? getBThwaniAppearanceThemeMode(appearanceMode) : undefined);
  const content = appearanceMode
    ? (
      <BThwaniAppearanceProvider mode={appearanceMode} syncThemeMode={false}>
        <MobileRootFrame>{children}</MobileRootFrame>
      </BThwaniAppearanceProvider>
    )
    : <MobileRootFrame>{children}</MobileRootFrame>;

  return (
    <RootProviders {...rootProps} themeMode={resolvedThemeMode}>
      {content}
    </RootProviders>
  );
}
