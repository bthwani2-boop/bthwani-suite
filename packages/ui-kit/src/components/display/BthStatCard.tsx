import React from 'react';
import { View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthCard } from './BthCard';
import { BthText } from '../../primitives';
import { BthBadge } from './BthBadge';

export type BthStatCardProps = {
  label: string;
  value: string;
  deltaLabel?: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
};

export function BthStatCard({ label, value, deltaLabel, tone = 'default' }: BthStatCardProps) {
  return (
    <BthCard>
      <View style={{ gap: spacing[2] }}>
        <BthText role="label" tone="muted">{label}</BthText>
        <BthText role="hero">{value}</BthText>
        {deltaLabel ? <BthBadge label={deltaLabel} tone={tone} /> : null}
      </View>
    </BthCard>
  );
}
