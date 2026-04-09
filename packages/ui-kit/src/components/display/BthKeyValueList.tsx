import React from 'react';
import { View } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthDivider, BthText } from '../../primitives';

export type BthKeyValueItem = {
  label: string;
  value: React.ReactNode;
  tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
  helperText?: string;
};

export type BthKeyValueListProps = {
  items: readonly BthKeyValueItem[];
  dense?: boolean;
  dividers?: boolean;
};

export function BthKeyValueList({ items, dense = false, dividers = true }: BthKeyValueListProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();

  return (
    <View style={{ width: '100%', gap: dense ? spacing[2] : spacing[3] }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <View key={`${item.label}-${index}`} style={{ gap: spacing[2] }}>
            <View
              style={{
                width: '100%',
                flexDirection: resolveRowDirection(direction),
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: spacing[3]
              }}
            >
              <BthText role={dense ? 'caption' : 'label'} tone="muted">{item.label}</BthText>
              <View style={{ flex: 1, gap: spacing[1], alignItems: direction === 'rtl' ? 'flex-start' : 'flex-end' }}>
                {typeof item.value === 'string' || typeof item.value === 'number' ? (
                  <BthText role={dense ? 'bodySm' : 'bodyStrong'} tone={item.tone ?? 'default'}>
                    {String(item.value)}
                  </BthText>
                ) : (
                  item.value
                )}
                {item.helperText ? <BthText role="caption" tone="soft">{item.helperText}</BthText> : null}
              </View>
            </View>
            {dividers && !isLast ? <BthDivider color={theme.line} /> : null}
          </View>
        );
      })}
    </View>
  );
}