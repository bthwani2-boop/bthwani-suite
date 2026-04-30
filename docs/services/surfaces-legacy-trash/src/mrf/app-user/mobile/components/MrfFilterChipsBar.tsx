/**
 * MRF Filter Chips Bar
 * Based on ESF FilterChipsBar design
 * §UX-SUPREME-001: Sticky horizontal filter bar, instant filters
 * 
 * Features:
 * - Horizontal scrollable chips
 * - Instant filter application
 * - Visual feedback for active filters
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';

interface FilterChip {
  id: string;
  label: string;
  icon?: string;
  isActive: boolean;
  isLocked?: boolean;
  onPress: () => void;
}

interface MrfFilterChipsBarProps {
  reportType?: 'missing' | 'found' | 'all';
  location?: string;
  category?: string;
  status?: 'active' | 'resolved' | 'closed' | 'all';
  urgency?: 'low' | 'medium' | 'high' | 'all';
  onReportTypePress: () => void;
  onLocationPress: () => void;
  onCategoryPress: () => void;
  onStatusPress: () => void;
  onUrgencyPress: () => void;
}

export const MrfFilterChipsBar: React.FC<MrfFilterChipsBarProps> = ({
  reportType = 'all',
  location,
  category,
  status = 'all',
  urgency = 'all',
  onReportTypePress,
  onLocationPress,
  onCategoryPress,
  onStatusPress,
  onUrgencyPress,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const ns = 'mrf.app-client.mobile.components.MrfFilterChipsBar';
  const getReportTypeLabel = (type: string) => {
    switch (type) {
      case 'missing': return t(`${ns}.filterMissing`);
      case 'found': return t(`${ns}.filterFound`);
      default: return t(`${ns}.type`);
    }
  };

  const getStatusLabel = (stat: string) => {
    switch (stat) {
      case 'active': return t(`${ns}.filterActive`);
      case 'resolved': return t(`${ns}.filterResolved`);
      case 'closed': return t(`${ns}.filterClosed`);
      default: return t(`${ns}.status`);
    }
  };

  const getUrgencyLabel = (urg: string) => {
    switch (urg) {
      case 'low': return t(`${ns}.filterUrgencyLow`);
      case 'medium': return t(`${ns}.filterUrgencyMedium`);
      case 'high': return t(`${ns}.filterUrgencyHigh`);
      default: return t(`${ns}.priority`);
    }
  };

  const chips: FilterChip[] = [
    {
      id: 'reportType',
      label: reportType !== 'all' ? getReportTypeLabel(reportType) : t('mrf.app-client.mobile.components.MrfFilterChipsBar.type'),
      icon: reportType === 'missing' ? '🔍' : reportType === 'found' ? '✅' : undefined,
      isActive: reportType !== 'all',
      onPress: onReportTypePress,
    },
    {
      id: 'location',
      label: location || t('mrf.app-client.mobile.components.MrfFilterChipsBar.location'),
      icon: '📍',
      isActive: !!location,
      onPress: onLocationPress,
    },
    {
      id: 'category',
      label: category || t('mrf.app-client.mobile.components.MrfFilterChipsBar.category'),
      icon: '🏷️',
      isActive: !!category,
      onPress: onCategoryPress,
    },
    {
      id: 'status',
      label: status !== 'all' ? getStatusLabel(status) : t('mrf.app-client.mobile.components.MrfFilterChipsBar.status'),
      isActive: status !== 'all',
      onPress: onStatusPress,
    },
    {
      id: 'urgency',
      label: urgency !== 'all' ? getUrgencyLabel(urgency) : t('mrf.app-client.mobile.components.MrfFilterChipsBar.priority'),
      icon: urgency === 'high' ? '🔴' : urgency === 'medium' ? '🟡' : urgency === 'low' ? '🟢' : undefined,
      isActive: urgency !== 'all',
      onPress: onUrgencyPress,
    },
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { flexDirection: layoutDirection === 'rtl' ? 'row-reverse' : 'row' }]}
        style={styles.scrollView}
        bounces={false}
        alwaysBounceHorizontal={false}
      >
        {chips.map((chip) => (
          <TouchableOpacity
            key={chip.id}
            style={[
              styles.chip,
              chip.isActive && styles.chipActive,
              chip.isLocked && styles.chipLocked,
            ]}
            onPress={chip.onPress}
            disabled={chip.isLocked}
            activeOpacity={0.7}
            accessibilityLabel={chip.label}
            accessibilityRole="button"
          >
            {chip.icon && (
              <Text style={styles.chipIcon}>{chip.icon}</Text>
            )}
            <Text
              style={[
                styles.chipText,
                chip.isActive && styles.chipTextActive,
              ]}
              numberOfLines={1}
            >
              {chip.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: semanticRoles.surface,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.border,
    justifyContent: 'center',
  },
  scrollView: {
    flexGrow: 0,
  },
  scrollContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: 999,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    height: 40,
    minWidth: 60,
  },
  chipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  chipLocked: {
    opacity: 0.7,
  },
  chipIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    marginStart: BTHWANI_SPACING.xs,
  },
  chipText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  chipTextActive: {
    color: semanticRoles.primaryCTAText,
  },
});

