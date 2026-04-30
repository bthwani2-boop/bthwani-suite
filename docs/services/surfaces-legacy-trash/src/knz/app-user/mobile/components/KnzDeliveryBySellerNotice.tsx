/**
 * KnzDeliveryBySellerNotice — عرض «التوصيل متاح من البائع» + تنبيه السياسة.
 * مرجع: KNZ_ADDITIONS_RECOMMENDATIONS 1.4 — وضوح التوقعات وتوافق مع السياسة.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import { KnzPolicyDisclaimer } from './KnzPolicyDisclaimer';

interface KnzDeliveryBySellerNoticeProps {
  /** عند true يُعرض السطر + التنبيه */
  show: boolean;
}

export const KnzDeliveryBySellerNotice: React.FC<KnzDeliveryBySellerNoticeProps> = ({
  show,
}) => {
  const { isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  if (!show) return null;

  return (
    <>
      <View style={[styles.row, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.label}>🚚 التوصيل:</Text>
        <Text style={styles.value}>متاح من البائع</Text>
      </View>
      <KnzPolicyDisclaimer variant="delivery" />
    </>
  );
};

const styles = StyleSheet.create({
  row: {
        alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  label: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginStart: BTHWANI_SPACING.sm,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
});

export default KnzDeliveryBySellerNotice;
