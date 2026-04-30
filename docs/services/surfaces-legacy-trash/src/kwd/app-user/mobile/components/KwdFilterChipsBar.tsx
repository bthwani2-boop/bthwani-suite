/**
 * KWD Filter Chips Bar
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * 
 * Features:
 * - Simple filter chips (Job Type + Location only)
 * - Horizontal scrollable
 * - Clear visual feedback
 */

import React, { useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

export type JobTypeFilter = 'all' | 'daily_wage' | 'one_time' | 'recurring' | 'contract' | 'permanent';
export type LocationFilter = 'all' | 'nearby' | string;

const NS = 'kwd.app-client.mobile.filterChips';

const JOB_TYPE_IDS: Array<{ id: JobTypeFilter; icon: string; key: string }> = [
  { id: 'all', icon: '📋', key: 'jobTypeAll' },
  { id: 'daily_wage', icon: '💰', key: 'dailyWage' },
  { id: 'one_time', icon: '🔧', key: 'oneTime' },
  { id: 'recurring', icon: '🔄', key: 'recurring' },
  { id: 'contract', icon: '📝', key: 'contract' },
  { id: 'permanent', icon: '💼', key: 'permanent' },
];

interface KwdFilterChipsBarProps {
  selectedJobType: JobTypeFilter;
  selectedLocation: LocationFilter;
  onJobTypeChange: (type: JobTypeFilter) => void;
  onLocationChange: (location: LocationFilter) => void;
  userLocation?: string;
}

export const KwdFilterChipsBar: React.FC<KwdFilterChipsBarProps> = ({
  selectedJobType,
  selectedLocation,
  onJobTypeChange,
  onLocationChange,
  userLocation,
}) => {
  const { t, isRTL } = useI18n();
  const jobTypes = useMemo(
    () => JOB_TYPE_IDS.map(({ id, icon, key }) => ({ id, label: t(`${NS}.${key}`), icon })),
    [t]
  );
  const locationOptions: Array<{ id: LocationFilter; label: string; icon: string }> = useMemo(
    () => [
      { id: 'all', label: t(`${NS}.locationAll`), icon: '🌍' },
      { id: 'nearby', label: t(`${NS}.nearby`), icon: '📍' },
    ],
    [t]
  );
  const locationOptionsWithUser = useMemo(() => {
    const opts = [...locationOptions];
    if (userLocation && userLocation !== 'all' && userLocation !== 'nearby') {
      opts.push({ id: userLocation, label: userLocation, icon: '📍' });
    }
    return opts;
  }, [locationOptions, userLocation]);
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Job Type Filters */}
        <View style={[styles.filterGroup, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.groupLabel}>{t(`${NS}.jobTypeGroupLabel`)}</Text>
          {jobTypes.map((type) => (
            <TouchableOpacity
              key={type.id}
              style={[
                styles.chip,
                selectedJobType === type.id && styles.chipSelected,
              ]}
              onPress={() => onJobTypeChange(type.id)}
              accessibilityLabel={type.label}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedJobType === type.id }}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{type.icon}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  selectedJobType === type.id && styles.chipLabelSelected,
                ]}
              >
                {type.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Location Filters */}
        <View style={[styles.filterGroup, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.groupLabel}>{t(`${NS}.locationGroupLabel`)}</Text>
          {locationOptionsWithUser.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={[
                styles.chip,
                selectedLocation === location.id && styles.chipSelected,
              ]}
              onPress={() => onLocationChange(location.id)}
              accessibilityLabel={location.label}
              accessibilityRole="button"
              accessibilityState={{ selected: selectedLocation === location.id }}
              activeOpacity={0.7}
            >
              <Text style={styles.chipIcon}>{location.icon}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  selectedLocation === location.id && styles.chipLabelSelected,
                ]}
              >
                {location.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.md,
    borderBlockEndWidth: 1,
    borderBlockEndColor: semanticRoles.outline || semanticRoles.border,
  },
  scrollContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  filterGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  groupLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginEnd: BTHWANI_SPACING.xs,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.xs,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline || semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  chipSelected: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: semanticRoles.text,
  },
  chipLabelSelected: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '600',
  },
});

