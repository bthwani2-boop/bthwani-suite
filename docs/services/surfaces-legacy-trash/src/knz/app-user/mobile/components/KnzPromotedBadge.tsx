import React from 'react';
import { Text, StyleSheet, ViewStyle } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface KnzPromotedBadgeProps {
  style?: ViewStyle;
}

export const KnzPromotedBadge: React.FC<KnzPromotedBadgeProps> = ({ style }) => {
  return (
    <Text style={[styles.badge, style]}>
      ممول
    </Text>
  );
};

const styles = StyleSheet.create({
  badge: {
    fontSize: 11,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.xs,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
    overflow: 'hidden',
  },
});

