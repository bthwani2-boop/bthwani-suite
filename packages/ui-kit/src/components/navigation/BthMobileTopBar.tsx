import React from 'react';
import { Platform, Pressable, StatusBar, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { useTheme } from '../../hooks';
import { BthText } from '../../primitives';

export type BthMobileTopBarAction = {
  id: string;
  icon: React.ReactNode;
  badgeCount?: number;
  onPress?: () => void;
  accessibilityLabel?: string;
};

export type BthMobileTopBarProps = {
  title: string;
  subtitle?: string;
  actions?: BthMobileTopBarAction[];
  trailingAction?: BthMobileTopBarAction;
  style?: StyleProp<ViewStyle>;
};

type ActionButtonProps = {
  action: BthMobileTopBarAction;
  tone: 'neutral' | 'accent';
};

function ActionButton({ action, tone }: ActionButtonProps) {
  const { theme } = useTheme();
  const showBadge = typeof action.badgeCount === 'number' && action.badgeCount > 0;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel ?? action.id}
      onPress={action.onPress}
      hitSlop={10}
      style={({ pressed }) => [
        styles.actionButton,
        tone === 'accent' ? styles.actionButtonAccent : styles.actionButtonNeutral,
        {
          backgroundColor: tone === 'accent' ? theme.brandSurface : theme.surfaceRaised,
          borderColor: tone === 'accent' ? theme.brand : theme.line,
          opacity: pressed ? 0.92 : 1,
        },
      ]}
    >
      {action.icon}

      {showBadge ? (
        <View style={[styles.badge, { backgroundColor: theme.warning }]}>
          <BthText role="caption" tone="inverse">
            {String(action.badgeCount)}
          </BthText>
        </View>
      ) : null}
    </Pressable>
  );
}

export function BthMobileTopBar({ title, subtitle, actions = [], trailingAction, style }: BthMobileTopBarProps) {
  const { theme } = useTheme();
  const topInset = Platform.OS === 'android' ? Math.max(StatusBar.currentHeight ?? 0, 10) : 8;

  return (
    <View style={[styles.shell, style]}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.surfaceRaised,
            borderColor: theme.line,
            paddingTop: topInset + spacing[0],
            paddingBottom: spacing[0],
          },
        ]}
      >
        <View style={styles.row}>
          <View style={styles.actionsRow}>
            {actions.map((action) => (
              <ActionButton key={action.id} action={action} tone="neutral" />
            ))}
          </View>

          <View style={styles.titleBlock}>
            <BthText role="titleSm" tone="default" numberOfLines={2} align="center" style={styles.titleText}>
              {title}
            </BthText>
            {subtitle ? (
              <BthText role="bodySm" tone="muted" numberOfLines={1} align="center" style={styles.subtitleText}>
                {subtitle}
              </BthText>
            ) : null}
          </View>

          <View style={styles.trailingSlot}>
            {trailingAction ? <ActionButton action={trailingAction} tone="accent" /> : <View style={styles.trailingSpacer} />}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  shell: {
    width: '100%',
  },
  card: {
    width: '100%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderWidth: 1,
    paddingHorizontal: spacing[3],
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.06,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 3 },
      },
      android: {
        elevation: 3,
      },
    }),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
    minHeight: 56,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    flexShrink: 0,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },
  titleText: {
    fontSize: 17,
    lineHeight: 22,
  },
  subtitleText: {
    marginTop: 1,
    lineHeight: 16,
  },
  trailingSlot: {
    flexShrink: 0,
  },
  trailingSpacer: {
    width: 44,
    height: 44,
  },
  actionButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
    ...Platform.select({
      ios: {
        shadowColor: '#0f172a',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  actionButtonNeutral: {
    shadowColor: '#0f172a',
  },
  actionButtonAccent: {
    shadowColor: '#f97316',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BthMobileTopBar;
