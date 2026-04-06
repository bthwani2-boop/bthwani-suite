import React from 'react';
import { View } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { useDirection } from '../../hooks';

export type BthSectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
};

export function BthSectionHeader({ title, subtitle, trailing }: BthSectionHeaderProps) {
  const { direction } = useDirection();

  return (
    <View style={{ width: '100%', flexDirection: resolveRowDirection(direction), justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="titleSm">{title}</BthText>
        {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
      </View>
      {trailing}
    </View>
  );
}
