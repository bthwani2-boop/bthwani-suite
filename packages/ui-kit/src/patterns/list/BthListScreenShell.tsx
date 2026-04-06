import React from 'react';
import { ScrollView, View, type ViewStyle, type StyleProp } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthStateView } from '../../components';
import { BthSurface, BthText } from '../../primitives';

export type BthListScreenShellProps = {
  title: string;
  subtitle?: string;
  state?: 'ready' | 'loading' | 'empty' | 'error';
  stateTitle?: string;
  stateDescription?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BthListScreenShell({
  title,
  subtitle,
  state = 'ready',
  stateTitle,
  stateDescription,
  children,
  style
}: BthListScreenShellProps) {
  return (
    <ScrollView contentContainerStyle={[{ padding: spacing[4], gap: spacing[4] }, style]}>
      <View style={{ gap: spacing[2] }}>
        <BthText role="titleLg">{title}</BthText>
        {subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
      </View>

      {state === 'ready' ? (
        <BthSurface>{children}</BthSurface>
      ) : (
        <BthSurface>
          <BthStateView
            kind={state}
            title={stateTitle ?? title}
            description={stateDescription}
          />
        </BthSurface>
      )}
    </ScrollView>
  );
}
