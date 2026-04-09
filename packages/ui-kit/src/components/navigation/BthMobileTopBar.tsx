import React from 'react';
import { Pressable, View } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { resolveRowDirection } from '../../foundation/direction';
import { useDirection, useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthMobileTopBarProps = {
  title: string;
  subtitle?: string;
  locationLabel?: string;
  locationIcon?: React.ReactNode;
  accountBadgeCount?: number;
  accountIcon?: React.ReactNode;
  notificationsIcon?: React.ReactNode;
  cartIcon?: React.ReactNode;
  searchIcon?: React.ReactNode;
  onPressAccount?: () => void;
  onPressNotifications?: () => void;
  onPressCart?: () => void;
  onPressSearch?: () => void;
};

type IconButtonProps = {
  icon?: React.ReactNode;
  label: string;
  badgeCount?: number;
  onPress?: () => void;
};

function IconButton({ icon, label, badgeCount, onPress }: IconButtonProps) {
  const { theme } = useTheme();
  const showBadge = typeof badgeCount === 'number' && badgeCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => ({
        width: 30,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? theme.overlaySoft : 'transparent',
      })}
    >
      {icon ?? <BthText role="titleMd" tone="inverse">○</BthText>}
      {showBadge ? (
        <View
          style={{
            position: 'absolute',
            top: -4,
            right: -4,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.warning,
          }}
        >
          <BthText role="caption" tone="inverse">{String(badgeCount)}</BthText>
        </View>
      ) : null}
    </Pressable>
  );
}

export function BthMobileTopBar({
  title,
  subtitle,
  locationLabel,
  locationIcon,
  accountBadgeCount,
  accountIcon,
  notificationsIcon,
  cartIcon,
  searchIcon,
  onPressAccount,
  onPressNotifications,
  onPressCart,
  onPressSearch,
}: BthMobileTopBarProps) {
  const { direction } = useDirection();

  return (
    <View style={{ width: '100%', gap: 2, paddingTop: spacing[2] }}>
      <View style={{ flexDirection: resolveRowDirection(direction, true), justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: direction === 'rtl' ? 'row' : 'row-reverse', gap: spacing[1] }}>
          <IconButton icon={accountIcon} label="Account" onPress={onPressAccount} />
          <IconButton
            icon={notificationsIcon}
            label="Notifications"
            badgeCount={accountBadgeCount}
            onPress={onPressNotifications}
          />
          <IconButton icon={cartIcon} label="Cart" onPress={onPressCart} />
          <IconButton icon={searchIcon} label="Search" onPress={onPressSearch} />
        </View>

        <View style={{ flex: 1, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start', marginStart: spacing[1], marginEnd: spacing[1] }}>
          <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'baseline', gap: spacing[1] }}>
            <BthText role="titleMd" tone="inverse">{title}</BthText>
            {subtitle ? <BthText role="caption" tone="inverse" style={{ opacity: 0.92 }}>{subtitle}</BthText> : null}
          </View>

          {locationLabel ? (
            <View style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: 4, marginTop: 1 }}>
              {locationIcon ?? <BthText role="caption" tone="inverse">•</BthText>}
              <BthText role="caption" tone="inverse" style={{ opacity: 0.9 }}>{locationLabel}</BthText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
}
