import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';

interface KnzRatingSummaryProps {
  average?: number;
  count?: number;
}

export const KnzRatingSummary: React.FC<KnzRatingSummaryProps> = ({ average, count }) => {
  const { isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  if (average == null || count == null) return null;
  if (count === 0) {
    return (
      <View style={[styles.container, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.noRatingsText}>لا توجد تقييمات بعد</Text>
      </View>
    );
  }

  const rounded = Math.round(average * 10) / 10;

  return (
    <View style={[styles.container, { flexDirection: 'row', direction: layoutDirection }]}>
      <Text style={styles.averageText}>
        {rounded.toFixed(1)} <Text style={styles.star}>⭐</Text>
      </Text>
      <Text style={styles.countText}>{count} تقييم</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
        alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  averageText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  star: {
    color: BTHWANI_COLORS.warning,
  },
  countText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  noRatingsText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
});

