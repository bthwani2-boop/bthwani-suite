import React, { type ReactNode } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { RootProviders, type RootProvidersProps, useTheme } from '../providers';

export type MobileRootProps = RootProvidersProps & {
  children: ReactNode;
};

export type BthMobileRootProps = MobileRootProps;

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

export function MobileRoot({ children, ...rootProps }: MobileRootProps) {
  return (
    <RootProviders {...rootProps}>
      <MobileRootFrame>{children}</MobileRootFrame>
    </RootProviders>
  );
}

export const BthMobileRoot = MobileRoot;
