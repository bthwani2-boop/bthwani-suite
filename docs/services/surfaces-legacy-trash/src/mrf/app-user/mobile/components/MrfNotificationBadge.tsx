/**
 * MRF Notification Badge - Smart Badge Component
 * Based on ESF Notification Badge design
 * §UX-SUPREME-001: Shows only when there are unread reports
 * 
 * Features:
 * - Only visible when unreadCount > 0
 * - Compact design
 * - Auto-updates
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';

interface MrfNotificationBadgeProps {
  count: number;
  visible?: boolean;
}

export const MrfNotificationBadge: React.FC<MrfNotificationBadgeProps> = ({
  count,
  visible = true,
}) => {
  if (!visible || count <= 0) return null;

  const displayCount = count > 99 ? '99+' : count.toString();

  return (
    <View style={styles.badge}>
      <Text style={styles.badgeText}>{displayCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -4,
    end: -4,
    minWidth: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: semanticRoles.stateError.icon,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.xs,
    borderWidth: 2,
    borderColor: semanticRoles.surface,
  },
  badgeText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    textAlign: 'center',
  },
});
