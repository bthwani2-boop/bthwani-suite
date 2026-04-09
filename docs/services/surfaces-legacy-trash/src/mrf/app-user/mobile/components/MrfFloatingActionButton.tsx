/**
 * MRF Floating Action Button (FAB)
 * Based on ESF FAB design
 * §UX-SUPREME-001: Modern FAB pattern for quick actions
 * 
 * Features:
 * - Fixed position (bottom-right)
 * - Smooth animations
 * - Accessible touch target
 * - Icon + Label support
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';

interface MrfFloatingActionButtonProps {
  onPress: () => void;
  label?: string;
  icon?: string;
  disabled?: boolean;
}

export const MrfFloatingActionButton: React.FC<MrfFloatingActionButtonProps> = ({
  onPress,
  label: labelProp,
  icon = '🔍',
  disabled = false,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const label = labelProp ?? t('mrf.app-client.mobile.components.MrfFloatingActionButton.missingReport');
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
    borderRadius: 999, // Full radius for pill shape
    backgroundColor: semanticRoles.primaryCTA,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    minHeight: 56,
    gap: BTHWANI_SPACING.xs,
  },
  fabDisabled: {
    opacity: 0.5,
  },
  fabIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  fabLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.primaryCTAText,
  },
});

