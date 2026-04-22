// Mobile root: wraps app with all root providers and safe area logic
import { ReactNode } from 'react';
import { SafeAreaView, StatusBar } from 'react-native';
import { useTheme } from './hooks';
import { BthRootProviders, BthRootProvidersProps } from './BthRootProviders';
import { BthMobileProviders } from './BthMobileProviders';

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
      <BthMobileRootFrame>
        <BthMobileProviders>{children}</BthMobileProviders>
      </BthMobileRootFrame>
    </BthRootProviders>
  );
}