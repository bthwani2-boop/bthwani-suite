import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, View } from 'react-native';
import { BthBox, BthText, useDirection } from '@bthwani/ui-kit';

export type UnifiedMobileTopBarAction = {
  id: string;
  iconName: React.ComponentProps<typeof Ionicons>['name'];
  badgeCount?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type UnifiedMobileTopBarTicker = {
  statusLabel: string;
  message: string;
  onPress?: () => void;
};

export type UnifiedMobileTopBarProps = {
  title: string;
  subtitle?: string;
  locationLabel?: string;
  actions?: UnifiedMobileTopBarAction[];
  ticker?: UnifiedMobileTopBarTicker;
};

function HeaderAction({ action }: { action: UnifiedMobileTopBarAction }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel ?? action.id}
      onPress={action.onPress}
      style={({ pressed }) => ({
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed ? 'rgba(255,255,255,0.16)' : 'transparent',
      })}
    >
      <Ionicons name={action.iconName} size={21} color="#FFFFFF" />
      {typeof action.badgeCount === 'number' && action.badgeCount > 0 ? (
        <View
          style={{
            position: 'absolute',
            top: -2,
            right: -2,
            minWidth: 16,
            height: 16,
            borderRadius: 8,
            paddingHorizontal: 4,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F59E0B',
          }}
        >
          <BthText role="caption" tone="inverse">{String(action.badgeCount)}</BthText>
        </View>
      ) : null}
    </Pressable>
  );
}

export function UnifiedMobileTopBar({ title, subtitle, locationLabel, actions = [], ticker }: UnifiedMobileTopBarProps) {
  const { direction } = useDirection();
  const actionsDirection = direction === 'rtl' ? 'row' : 'row-reverse';

  return (
    <BthBox
      background="brand"
      paddingX={4}
      paddingY={2}
      gap={1}
      style={{
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
      }}
    >
      <View
        style={{
          flexDirection: actionsDirection,
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: 6,
        }}
      >
        <View style={{ flexDirection: actionsDirection, alignItems: 'center', gap: 6 }}>
          {actions.map((action) => (
            <HeaderAction key={action.id} action={action} />
          ))}
        </View>

        <View style={{ flex: 1, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
          <View style={{ flexDirection: actionsDirection, alignItems: 'baseline', gap: 6 }}>
            <BthText role="titleMd" tone="inverse">{title}</BthText>
            {subtitle ? <BthText role="bodySm" tone="inverse" style={{ opacity: 0.92 }}>{subtitle}</BthText> : null}
          </View>

          {locationLabel ? (
            <View style={{ flexDirection: actionsDirection, alignItems: 'center', gap: 4, marginTop: 1 }}>
              <Ionicons name="location-outline" size={14} color="#FFFFFF" />
              <BthText role="caption" tone="inverse" style={{ opacity: 0.9 }}>
                {locationLabel}
              </BthText>
            </View>
          ) : null}
        </View>
      </View>

      {ticker ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={ticker.message}
          onPress={ticker.onPress}
          style={({ pressed }) => ({
            minHeight: 30,
            borderRadius: 15,
            backgroundColor: 'rgba(255,255,255,0.16)',
            paddingHorizontal: 8,
            paddingVertical: 2,
            justifyContent: 'center',
            opacity: pressed ? 0.92 : 1,
          })}
        >
          <View
            style={{
              flexDirection: actionsDirection,
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 8,
            }}
          >
            <View
              style={{
                minWidth: 84,
                borderRadius: 14,
                backgroundColor: '#2563EB',
                paddingHorizontal: 10,
                paddingVertical: 4,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BthText role="caption" tone="inverse">{ticker.statusLabel}</BthText>
            </View>

            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <BthText role="bodySm" tone="inverse" align="center" numberOfLines={1} style={{ opacity: 0.95 }}>
                {ticker.message}
              </BthText>
            </View>
          </View>
        </Pressable>
      ) : null}
    </BthBox>
  );
}

export default UnifiedMobileTopBar;