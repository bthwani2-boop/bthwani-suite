/**
 * KnzPolicyDisclaimer — تنبيه سياسة كنز (مصدر واحد للنص).
 * مرجع: KNZ_POLICY_WLT_DELIVERY_AUCTION — لا دفع لثمن السلعة عبر المنصة، لا تحجز ولا تضمن المبالغ.
 * استخدام: شاشة المزاد (فتح/إغلاق)، تفاصيل إعلان عند «توصيل من البائع».
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

export const KNZ_POLICY_AUCTION_KEY = 'surfaces.knz.policy_auction';
export const KNZ_POLICY_DELIVERY_KEY =
  'surfaces.الاتفاق_على_مكان_وطريقة_التسليم_بينك';
export const KNZ_POLICY_AUCTION = KNZ_POLICY_AUCTION_KEY;
export const KNZ_POLICY_DELIVERY = KNZ_POLICY_DELIVERY_KEY;

export type KnzPolicyVariant = 'auction' | 'delivery';

interface KnzPolicyDisclaimerProps {
  variant: KnzPolicyVariant;
  /** نص مخصص إن لزم؛ وإلا يُستخدم النص المعياري حسب variant */
  customText?: string;
}

export const KnzPolicyDisclaimer: React.FC<KnzPolicyDisclaimerProps> = ({
  variant,
  customText,
}) => {
  const { t } = useI18n();

  const deliveryText = t(KNZ_POLICY_DELIVERY_KEY);
  const auctionText = t(KNZ_POLICY_AUCTION_KEY);
  const text =
    customText ?? (variant === 'auction' ? auctionText : deliveryText);

  return (
    <View style={styles.banner}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: {
    backgroundColor: semanticRoles.warning + '18',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    borderLeftWidth: 3,
    borderLeftColor: semanticRoles.warning,
  },
  text: {
    fontSize: 13,
    color: semanticRoles.text,
  },
});

export default KnzPolicyDisclaimer;
