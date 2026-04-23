import React, { type ReactNode } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { BthRootProviders, type BthRootProvidersProps, useTheme } from '../providers';

export interface BthMobileRootProps extends BthRootProvidersProps {
  children: ReactNode;
}

function BthMobileRootFrame({ children }: { children: ReactNode }) {
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

export function BthMobileRoot({ children, ...rootProps }: BthMobileRootProps) {
  return (
    <BthRootProviders {...rootProps}>
      <BthMobileRootFrame>{children}</BthMobileRootFrame>
    </BthRootProviders>
  );
}
