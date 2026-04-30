/**
 * FieldTopAppBar — Operational Top Bar for Field
 * §UX-SUPREME-001: Quick + Clear, Zero distraction
 *
 * Features:
 * - Left: GPS/Signal + Online Status
 * - Center: Task State (Title + Subtitle)
 * - Right: Single Action (Call/Support/Bell/Settings)
 * - Height: 56px
 * - Contextual colors (Issue Mode)
 * - State-aware (Idle/On-Task/Issue)
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
import { FieldStateChip, FieldStatus, GPSStatus } from './FieldStateChip';

export type FieldTopBarState = 'idle' | 'on_task' | 'issue';
export type RightActionType =
  | 'call'
  | 'message'
  | 'support'
  | 'bell'
  | 'settings';

interface FieldTopAppBarProps {
  fieldState: FieldTopBarState;
  fieldStatus: FieldStatus;
  gpsStatus: GPSStatus;
  signalStrength?: number; // 0-4
  taskInfo?: {
    title: string;
    subtitle?: string; // ETA + منطقة
  };
  rightAction: {
    type: RightActionType;
    onPress: () => void;
    badge?: number; // For bell
  };
  onSOSPress?: () => void; // Only in issue mode
}

const TOP_BAR_HEIGHT = 56;

const RIGHT_ACTION_ICONS: Record<RightActionType, string> = {
  call: 'phone',
  message: 'message',
  support: 'help',
  bell: 'notifications',
  settings: 'settings',
};

const getStateBackground = (state: FieldTopBarState) => {
  switch (state) {
    case 'issue':
      return (
        semanticRoles.captainState?.issue?.background ||
        semanticRoles.stateError.background
      );
    case 'on_task':
      return (
        semanticRoles.captainState?.pickup?.background ||
        semanticRoles.stateInfo.background
      );
    case 'idle':
    default:
      return semanticRoles.surface;
  }
};

export const FieldTopAppBar: React.FC<FieldTopAppBarProps> = ({
  fieldState,
  fieldStatus,
  gpsStatus,
  signalStrength = 4,
  taskInfo,
  rightAction,
  onSOSPress,
}) => {
  const { rowStyle, t } = useDirection();
  const backgroundColor = getStateBackground(fieldState);
  const isIssueMode = fieldState === 'issue';

  return (
    <SafeAreaView
      edges={['top']}
      style={[styles.container, { backgroundColor }]}
    >
      <View style={[styles.content, rowStyle]}>
        {/* Start: Status + GPS */}
        <View style={styles.leftSection}>
          <FieldStateChip status={fieldStatus} gpsStatus={gpsStatus} />
        </View>

        {/* Center: Task Info */}
        <View style={styles.centerSection}>
          {taskInfo ? (
            <>
              <Text
                style={[styles.taskTitle, isIssueMode && styles.taskTitleIssue]}
                numberOfLines={1}
              >
                {taskInfo.title}
              </Text>
              {taskInfo.subtitle && (
                <Text
                  style={[
                    styles.taskSubtitle,
                    isIssueMode && styles.taskSubtitleIssue,
                  ]}
                  numberOfLines={1}
                >
                  {taskInfo.subtitle}
                </Text>
              )}
            </>
          ) : (
            <Text
              style={[styles.taskTitle, isIssueMode && styles.taskTitleIssue]}
            >
              {fieldState === 'idle' ? t('surfaces.جاهز_للمهام') : 'في مهمة'}
            </Text>
          )}
        </View>

        {/* End: Action Button */}
        <View style={styles.rightSection}>
          {isIssueMode && onSOSPress ? (
            <TouchableOpacity
              style={styles.sosButton}
              onPress={onSOSPress}
              activeOpacity={0.7}
            >
              <Text style={styles.sosText}>SOS</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.actionButton}
              onPress={rightAction.onPress}
              activeOpacity={0.7}
            >
              <View style={styles.actionIconContainer}>
                <ServiceIcon
                  name={RIGHT_ACTION_ICONS[rightAction.type]}
                  size={20}
                  color={
                    isIssueMode
                      ? semanticRoles.primaryCTAText
                      : semanticRoles.text
                  }
                />
                {rightAction.badge && rightAction.badge > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>
                      {rightAction.badge > 9 ? '9+' : rightAction.badge}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: TOP_BAR_HEIGHT,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    height: TOP_BAR_HEIGHT,
  },
  leftSection: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerSection: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.sm,
  },
  rightSection: {
    flex: 1,
    alignItems: 'flex-end',
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  taskTitleIssue: {
    color: semanticRoles.primaryCTAText,
  },
  taskSubtitle: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginTop: BTHWANI_SPACING.xs / 2,
  },
  taskSubtitleIssue: {
    color: semanticRoles.primaryCTAText,
    opacity: 0.9,
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  actionIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -6,
    end: -6,
    backgroundColor: semanticRoles.accent,
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 2,
    borderColor: semanticRoles.surface,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  sosButton: {
    backgroundColor: semanticRoles.stateError.icon,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  sosText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '700',
  },
});
