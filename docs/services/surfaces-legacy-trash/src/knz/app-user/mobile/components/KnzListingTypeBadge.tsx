/**
 * KnzListingTypeBadge — بادج نوع العرض (للبيع / للإيجار / خدمة / مطلوب).
 * مرجع: KNZ_ADDITIONS_RECOMMENDATIONS 1.3 — مصدر واحد من KNZ_LISTING_TYPES.
 */

import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { KNZ_LISTING_TYPES } from '../../../shared/knz-constants';

interface KnzListingTypeBadgeProps {
  code: string;
}

export const KnzListingTypeBadge: React.FC<KnzListingTypeBadgeProps> = ({
  code,
}) => {
  const { t } = useI18n();
  const listingType = KNZ_LISTING_TYPES.find((lt) => lt.code === code);
  const label = listingType ? t(listingType.labelKey) : code;

  return <Text style={styles.badge}>{label}</Text>;
};

const styles = StyleSheet.create({
  badge: {
    fontSize: 11,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
});

export default KnzListingTypeBadge;
