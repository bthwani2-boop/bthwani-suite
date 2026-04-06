import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';

export type BthSectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
};

export function BthSectionHeader({ title, subtitle, trailing }: BthSectionHeaderProps) {
  return (
    <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <BthText role="titleSm">{title}</BthText>
        {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
      </View>
      {trailing}
    </View>
  );
}
