import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { BthSurface } from '../../primitives';
import { BthButton } from '../actions/BthButton';

export type BthOptionRowProps = {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BthOptionRow({ title, subtitle, actionLabel, onAction, style }: BthOptionRowProps) {
  return (
    <BthSurface tone="inset" gap={2} style={style}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' as const }}>
        <View style={{ flex: 1, gap: spacing[1] }}>
          <BthText role="bodyStrong">{title}</BthText>
          {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
        </View>

        {actionLabel ? <BthButton label={actionLabel} onPress={onAction} /> : null}
      </View>
    </BthSurface>
  );
}
