import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { BthButton } from '../actions/BthButton';

export type BthScreenHeaderProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function BthScreenHeader({ title, subtitle, actionLabel, onActionPress }: BthScreenHeaderProps) {
  return (
    <View style={{ width: '100%', gap: spacing[3] }}>
      <View style={{ gap: spacing[1] }}>
        <BthText role="titleLg">{title}</BthText>
        {subtitle ? <BthText role="bodyMd" tone="muted">{subtitle}</BthText> : null}
      </View>
      {actionLabel && onActionPress ? <BthButton label={actionLabel} onPress={onActionPress} fullWidth={false} /> : null}
    </View>
  );
}
