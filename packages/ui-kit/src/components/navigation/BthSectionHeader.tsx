import React from 'react';
import { View } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { spacing } from '../../foundation/tokens';
import { BthText } from '../../primitives';
import { useDirection } from '../../hooks';
import { BthBadge, type BthBadgeProps } from '../display';

export type BthSectionHeaderProps = {
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  count?: number | string;
  countTone?: BthBadgeProps['tone'];
  headingOrder?: 'title-first' | 'count-first';
};

export function BthSectionHeader({
  title,
  subtitle,
  trailing,
  count,
  countTone = 'default',
  headingOrder = 'title-first'
}: BthSectionHeaderProps) {
  const { direction } = useDirection();
  const hasCount = count !== undefined && count !== null && String(count).trim().length > 0;

  return (
    <View style={{ width: '100%', flexDirection: resolveRowDirection(direction), justifyContent: 'space-between', alignItems: 'center', gap: spacing[3] }}>
      <View style={{ flex: 1, gap: spacing[1] }}>
        <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', flexWrap: 'wrap', gap: spacing[2] }}>
          {headingOrder === 'count-first' && hasCount ? <BthBadge label={String(count)} tone={countTone} /> : null}
          <BthText role="titleSm">{title}</BthText>
          {headingOrder === 'title-first' && hasCount ? <BthBadge label={String(count)} tone={countTone} /> : null}
        </View>
        {subtitle ? <BthText role="bodySm" tone="muted">{subtitle}</BthText> : null}
      </View>
      {trailing}
    </View>
  );
}
