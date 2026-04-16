import React from 'react';
import { Platform, Pressable, StatusBar, View } from 'react-native';
import { resolveRowDirection } from '../../foundation/direction';
import { useDirection, useTheme } from '../../hooks';
import { BthBox, BthText } from '../../primitives';
import { BthNewsTickerBar, type BthNewsTickerBarProps } from './BthNewsTickerBar';

export type BthUnifiedMobileTopBarAction = {
  id: string;
  icon: React.ReactNode;
  badgeCount?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type BthUnifiedMobileTopBarTicker = BthNewsTickerBarProps;

export type BthUnifiedMobileTopBarProps = {
  title: string;
  subtitle?: string;
  locationLabel?: string;
  locationIcon?: React.ReactNode;
  actions?: BthUnifiedMobileTopBarAction[];
  ticker?: BthUnifiedMobileTopBarTicker;
};

function HeaderAction({ action, badgeSide }: { action: BthUnifiedMobileTopBarAction; badgeSide: { left?: number; right?: number } }) {
  const { theme } = useTheme();
  const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel ?? action.id}
      onPress={action.onPress}
      hitSlop={10}
      style={({ pressed }) => ({
        width: 44,
        height: 44,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? 'rgba(255,255,255,0.16)' : 'transparent',
      })}
    >
      {action.icon}
      {showBadge ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            ...badgeSide,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.warning,
          }}
        >
          <BthText role="caption" tone="inverse">{String(action.badgeCount)}</BthText>
        </View>
      ) : null}
    </Pressable>
  );
}

export function BthUnifiedMobileTopBar({
  title,
  subtitle,
  locationLabel,
  locationIcon,
  actions = [],
  ticker,
}: BthUnifiedMobileTopBarProps) {
  const { direction } = useDirection();
  const rowDirection = resolveRowDirection(direction, true);
  const alignItems = direction === 'rtl' ? 'flex-end' : 'flex-start';
  const badgeSide = direction === 'rtl' ? { left: -2 } : { right: -2 };
  const topInset = Platform.OS === 'android' ? Math.max(StatusBar.currentHeight ?? 0, 12) : 6;

  return (
    <BthBox
      background="brand"
      paddingX={4}
      paddingY={2}
      gap={1}
      style={{
        paddingTop: topInset,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <View
        style={{
          flexDirection: rowDirection,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 6 }}>
          {actions.map((action) => (
            <HeaderAction key={action.id} action={action} badgeSide={badgeSide} />
          ))}
        </View>

        <View style={{ flex: 1, alignItems, marginStart: 6, marginEnd: 6 }}>
          <View style={{ flexDirection: rowDirection, alignItems: 'baseline', gap: 6 }}>
            <BthText role="titleMd" tone="inverse">{title}</BthText>
            {subtitle ? <BthText role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>{subtitle}</BthText> : null}
          </View>

          {locationLabel ? (
            <View style={{ flexDirection: rowDirection, alignItems: 'center', gap: 4, marginTop: 1 }}>
              {locationIcon ?? <BthText role="caption" tone="inverse">•</BthText>}
              <BthText role="caption" tone="inverse" style={{ opacity: 0.9 }}>
                {locationLabel}
              </BthText>
            </View>
          ) : null}
        </View>
      </View>

      {ticker ? <BthNewsTickerBar {...ticker} /> : null}
    </BthBox>
  );
}

export default BthUnifiedMobileTopBar;