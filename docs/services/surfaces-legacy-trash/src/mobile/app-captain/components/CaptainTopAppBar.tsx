/**
 * CaptainTopAppBar — Operational Top Bar for Captain
 * §UX-SUPREME-001: Quick + Clear, Zero distraction
 *
 * Features:
 * - Left: GPS/Signal + Online Status
 * - Center: Trip State (Title + Subtitle)
 * - Right: Single Action (Call/Support/Bell/Settings)
 * - Height: 56px
 * - Contextual colors (Issue Mode)
 * - State-aware (Idle/On-Trip/Pickup/Dropoff/Issue)
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';
import { ServiceIcon } from '../../components';
import { CaptainStateChip, CaptainStatus, GPSStatus } from './CaptainStateChip';

export type CaptainTopBarState =
  | 'idle'
  | 'on_trip'
  | 'pickup'
  | 'dropoff'
  | 'issue';
export type RightActionType =
  | 'call'
  | 'message'
  | 'support'
  | 'bell'
  | 'settings'
  | 'account';

interface CaptainTopAppBarProps {
  captainState: CaptainTopBarState;
  captainStatus: CaptainStatus;
  gpsStatus: GPSStatus;
  signalStrength?: number; // 0-4
  /** Smart Status Bar: today's earnings (e.g. from platform API) when idle */
  todayEarnings?: number | null;
  tripInfo?: {
    title: string;
    subtitle?: string; // ETA + منطقة
  };
  rightAction: {
    type: RightActionType;
    onPress: () => void;
    badge?: number; // For bell
  };
  onSOSPress?: () => void; // Only in issue mode
  /** عند true (مثلاً AMN مع شريط توفر) لا نعرض رقاقة التوفر في الشريط لتجنب التكرار */
  hideAvailabilityChip?: boolean;
  /** اسم الكابتن للعرض بجوار "الكابتن" في الوسط (ضروري أن يكون أيضاً في أيقونة البروفايل) */
  captainName?: string | null;
}

const TOP_BAR_HEIGHT = 56;

const RIGHT_ACTION_ICONS: Record<RightActionType, string> = {
  call: 'phone',
  message: 'message',
  support: 'help',
  bell: 'notifications',
  settings: 'settings',
  account: 'person',
};

const getStateBackground = (state: CaptainTopBarState) => {
  switch (state) {
    case 'issue':
      return semanticRoles.captainState.issue.background;
    case 'pickup':
      return semanticRoles.captainState.pickup.background;
    case 'dropoff':
      return semanticRoles.captainState.dropoff.background;
    case 'on_trip':
      return semanticRoles.captainState.on_trip.background;
    default:
      return semanticRoles.surface;
  }
};

const getStateTextColor = (state: CaptainTopBarState) => {
  switch (state) {
    case 'issue':
      return semanticRoles.captainState.issue.text;
    case 'pickup':
      return semanticRoles.captainState.pickup.text;
    case 'dropoff':
      return semanticRoles.captainState.dropoff.text;
    case 'on_trip':
      return semanticRoles.captainState.on_trip.text;
    default:
      return semanticRoles.text;
  }
};

const formatEarnings = (n: number): string => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(Math.round(n));
};

export const CaptainTopAppBar: React.FC<CaptainTopAppBarProps> = ({
  captainState,
  captainStatus,
  gpsStatus,
  signalStrength = 4,
  todayEarnings,
  tripInfo,
  rightAction,
  onSOSPress,
  hideAvailabilityChip = false,
  captainName,
}) => {
  const { rowStyle, t } = useDirection();
  const stateBackground = getStateBackground(captainState);
  const stateTextColor = getStateTextColor(captainState);

  const getTitle = () => {
    if (tripInfo?.title) {
      return tripInfo.title;
    }

    switch (captainState) {
      case 'idle':
        // عند إخفاء رقاقة التوفر (AMN + شريط متاح/غير متاح) لا نكرر "متاح" في الوسط
        if (hideAvailabilityChip) {
          // بجوار "الكابتن" يفضل عرض اسم الكابتن
          return captainName?.trim()
            ? `الكابتن ${captainName.trim()}`
            : t('surfaces.الكابتن');
        }
        return 'متاح';
      case 'on_trip':
        return t('surfaces.مهمة_نشطة');
      case 'pickup':
        return t('surfaces.نقطة_الاستلام');
      case 'dropoff':
        return t('surfaces.نقطة_التسليم');
      case 'issue':
        return t('surfaces.مشكلة');
      default:
        return 'الكابتن';
    }
  };

  return (
    <SafeAreaView edges={['top']} style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: stateBackground,
            height: TOP_BAR_HEIGHT,
          },
        ]}
      >
        {/* Start: Status (أو GPS فقط عند إخفاء التوفر) + أرباح اليوم + إشارة */}
        <View style={[styles.leftSection, rowStyle]}>
          <CaptainStateChip
            status={captainStatus}
            gpsStatus={gpsStatus}
            showGPS={true}
            showStatus={!hideAvailabilityChip}
          />
          {captainState === 'idle' && todayEarnings != null && (
            <Text
              style={[styles.todayEarnings, { color: stateTextColor }]}
              numberOfLines={1}
            >
              أرباح اليوم: {formatEarnings(todayEarnings)}
            </Text>
          )}
          {signalStrength !== undefined && (
            <View style={[styles.signalContainer, rowStyle]}>
              {[0, 1, 2, 3].map(index => (
                <View
                  key={index}
                  style={[
                    styles.signalBar,
                    {
                      backgroundColor:
                        index < signalStrength
                          ? semanticRoles.stateSuccess.icon
                          : semanticRoles.border,
                    },
                  ]}
                />
              ))}
            </View>
          )}
        </View>

        {/* Center: Trip State */}
        <View style={styles.centerSection}>
          <Text
            style={[styles.title, { color: stateTextColor }]}
            numberOfLines={1}
          >
            {getTitle()}
          </Text>
          {tripInfo?.subtitle && (
            <Text
              style={[styles.subtitle, { color: stateTextColor }]}
              numberOfLines={1}
            >
              {tripInfo.subtitle}
            </Text>
          )}
        </View>

        {/* End: Single Action */}
        <View style={[styles.rightSection, rowStyle]}>
          {captainState === 'issue' && onSOSPress && (
            <TouchableOpacity
              style={styles.sosButton}
              onPress={onSOSPress}
              activeOpacity={0.7}
            >
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.rightActionButton}
            onPress={rightAction.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.rightActionIconContainer}>
              <ServiceIcon
                name={RIGHT_ACTION_ICONS[rightAction.type]}
                size={24}
                color={stateTextColor}
              />
              {rightAction.badge !== undefined && rightAction.badge > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {rightAction.badge > 99 ? '99+' : rightAction.badge}
                  </Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticRoles.surface,
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 120,
  },
  signalContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginStart: BTHWANI_SPACING.sm,
    height: 12,
    gap: 2,
  },
  signalBar: {
    width: 3,
    borderRadius: 1.5,
  },
  todayEarnings: {
    fontSize: 10,
    fontWeight: '600',
    marginStart: BTHWANI_SPACING.sm,
    maxWidth: 80,
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    minWidth: 80,
  },
  sosButton: {
    backgroundColor: semanticRoles.stateError.icon,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    marginEnd: BTHWANI_SPACING.xs,
  },
  sosText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 10,
    fontWeight: '700',
  },
  rightActionButton: {
    padding: BTHWANI_SPACING.xs,
  },
  rightActionIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    end: -4,
    backgroundColor: semanticRoles.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: semanticRoles.surface,
  },
  badgeText: {
    color: semanticRoles.surface,
    fontSize: 9,
    fontWeight: '700',
  },
});
