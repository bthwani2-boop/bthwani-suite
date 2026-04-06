import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { useTheme } from '../../hooks';
import { BthButton } from '../actions/BthButton';
import { BthText } from '../../primitives';

export type BthStateKind = 'loading' | 'empty' | 'error' | 'success';

export type BthStateViewProps = {
  kind: BthStateKind;
  title: string;
  description?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthStateView({ kind, title, description, actionLabel, onActionPress }: BthStateViewProps) {
  const { theme } = useTheme();
  const tone = kind === 'error' ? 'danger' : kind === 'success' ? 'success' : 'muted';

  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', padding: spacing[6], gap: spacing[3] }}>
      {kind === 'loading' ? <ActivityIndicator color={theme.brand} size="large" /> : null}
      <BthText role="titleSm" align="center">{title}</BthText>
      {description ? <BthText role="bodyMd" tone={tone} align="center">{description}</BthText> : null}
      {actionLabel && onActionPress ? <BthButton label={actionLabel} onPress={onActionPress} fullWidth={false} /> : null}
    </View>
  );
}
