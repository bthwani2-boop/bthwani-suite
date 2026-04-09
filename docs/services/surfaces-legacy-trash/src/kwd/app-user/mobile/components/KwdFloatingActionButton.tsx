/**
 * KWD Floating Action Button (FAB)
 * §UX-SUPREME-001: Modern FAB pattern for quick actions
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * 
 * Features:
 * - Fixed position (bottom-right)
 * - Smooth animations
 * - Accessible touch target
 * - Icon + Label support
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { elevation } from '@bthwani/ui-kit';

interface KwdFloatingActionButtonProps {
  onPress: () => void;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

const NS = 'kwd.app-client.mobile.common';

export const KwdFloatingActionButton: React.FC<KwdFloatingActionButtonProps> = ({
  onPress,
  label: labelProp,
  icon = '➕',
  disabled = false,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const label = labelProp ?? t(`${NS}.newListing`);
  return (
    <TouchableOpacity
      style={[styles.fab, disabled && styles.fabDisabled, { flexDirection: 'row', direction: layoutDirection }]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.8}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <Text style={styles.fabIcon}>{icon}</Text>
      <Text style={styles.fabLabel}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: BTHWANI_SPACING.xl * 2,
    end: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.primaryCTA,
    ...elevation.lg,
    minHeight: 56,
    gap: BTHWANI_SPACING.xs,
  },
  fabDisabled: {
    opacity: 0.5,
  },
  fabIcon: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  fabLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
});

