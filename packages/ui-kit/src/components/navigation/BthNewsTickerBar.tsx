import React from 'react';
import { Pressable, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthNewsTickerBarProps = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
};

export function BthNewsTickerBar({ statusLabel, message, onPress }: BthNewsTickerBarProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const barDirection = direction === 'rtl' ? 'row' : 'row-reverse';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={message}
      onPress={onPress}
      style={({ pressed }) => ({
        minHeight: 30,
        borderRadius: 15,
        borderWidth: 0,
        backgroundColor: 'rgba(255,255,255,0.16)',
        paddingHorizontal: spacing[1],
        paddingVertical: 1,
        justifyContent: 'center',
        opacity: pressed ? 0.92 : 1,
      })}
    >
      <View
        style={{
          flexDirection: barDirection,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: spacing[2],
        }}
      >
        <View
          style={{
            minWidth: 70,
            borderRadius: 12,
            backgroundColor: theme.info,
            paddingHorizontal: spacing[2],
            paddingVertical: 4,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <BthText role="caption" tone="inverse">{statusLabel}</BthText>
        </View>

        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <BthText role="bodySm" tone="inverse" align="center" numberOfLines={1} style={{ opacity: 0.95 }}>
            {message}
          </BthText>
        </View>
      </View>
    </Pressable>
  );
}
