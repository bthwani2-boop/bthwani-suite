// ARB UX Design System — ArbCategoryPill
// سلايدر الفئات الأفقي: زر/تبويب لفئة واحدة (فنادق، شاليهات، إلخ)
// ARB_UX_DESIGN_SYSTEM §4.1

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

const MIN_TOUCH_HEIGHT = 44;

export interface ArbCategoryPillProps {
  label: string;
  icon?: string;
  active?: boolean;
  onPress: () => void;
}

export const ArbCategoryPill: React.FC<ArbCategoryPillProps> = ({
  label,
  icon,
  active = false,
  onPress,
}) => {
  const { isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  return (
    <TouchableOpacity
      style={[styles.pill, active && styles.pillActive, { flexDirection: 'row', direction: layoutDirection }]}
      onPress={onPress}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ selected: active }}
    >
      {icon ? <Text style={[styles.icon, active && styles.iconActive]}>{icon}</Text> : null}
      <Text style={[styles.label, active && styles.labelActive]} numberOfLines={1}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surface,
    marginEnd: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    minHeight: MIN_TOUCH_HEIGHT,
  },
  pillActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  icon: {
    fontSize: 16,
    marginStart: BTHWANI_SPACING.xs,
  },
  iconActive: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.textInverse,
  },
  label: {
    fontSize: 13,
    color: semanticRoles.onSurface,
    fontWeight: '500',
  },
  labelActive: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.textInverse,
    fontWeight: '600',
  },
});

export default ArbCategoryPill;
