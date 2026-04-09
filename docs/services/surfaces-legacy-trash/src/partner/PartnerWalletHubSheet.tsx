/**
 * PartnerWalletHubSheet — المحفظة والحسابات المالية
 * §UX-SUPREME-001: Opens from header ledger icon — one tap to access all financial items
 * كل شيء مالي في مكان واحد: منظم ومرتب حسب التدفق (دفع → دفتر → تسويات → مدفوعات)
 */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, Pressable } from 'react-native';
import { semanticRoles, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { Ionicons } from '@expo/vector-icons';

export interface PartnerWalletHubSheetProps {
  visible: boolean;
  onRequestClose: () => void;
  onNavigate: (screen: string) => void;
}

const WALLET_SECTIONS: Array<{
  sectionKey: string;
  items: Array<{ screen: string; labelKey: string; icon: string }>;
}> = [
  {
    sectionKey: 'partner.PartnerWalletHubSheet.sectionPayment',
    items: [
      { screen: 'wlt_sudad_home', labelKey: 'partner.PartnerHomeScreen.walletSudad', icon: 'receipt-outline' },
    ],
  },
  {
    sectionKey: 'partner.PartnerWalletHubSheet.sectionLedger',
    items: [
      { screen: 'wlt_partner_ledger_get', labelKey: 'partner.PartnerProfileScreen.navWalletLedger', icon: 'book-outline' },
      { screen: 'wlt_partner_finance_overview', labelKey: 'partner.PartnerHomeScreen.navFinancialView', icon: 'analytics-outline' },
    ],
  },
  {
    sectionKey: 'partner.PartnerWalletHubSheet.sectionSettlements',
    items: [
      { screen: 'wlt_partner_settlements_list', labelKey: 'partner.PartnerProfileScreen.navWalletSettlements', icon: 'document-text-outline' },
      { screen: 'wlt_payouts_list', labelKey: 'partner.PartnerProfileScreen.navWalletPayouts', icon: 'card-outline' },
      { screen: 'wlt_payout_request', labelKey: 'partner.PartnerProfileScreen.navWalletWithdraw', icon: 'wallet-outline' },
    ],
  },
];

export const PartnerWalletHubSheet: React.FC<PartnerWalletHubSheetProps> = ({
  visible,
  onRequestClose,
  onNavigate,
}) => {
  const { t, isRTL } = useI18n();
  const textAlign = isRTL ? 'right' : 'left';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onRequestClose}>
      <Pressable style={styles.backdrop} onPress={onRequestClose} />
      <View style={styles.sheetContainer}>
        <View style={styles.sheetContent}>
          <View style={[styles.header, { flexDirection: 'row' }]}>
            <Text style={[styles.title, { textAlign }]}>
              {t('partner.PartnerProfileScreen.navWalletSection')}
            </Text>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={onRequestClose}
              hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            >
              <Ionicons name="close" size={24} color={semanticRoles.textMuted} />
            </TouchableOpacity>
          </View>
          <ScrollView
            style={styles.list}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContent}
          >
            {WALLET_SECTIONS.map(({ sectionKey, items }) => (
              <View key={sectionKey} style={styles.section}>
                <Text style={[styles.sectionTitle, { textAlign }]}>
                  {t(sectionKey)}
                </Text>
                {items.map(({ screen, labelKey, icon }) => (
                  <TouchableOpacity
                    key={screen}
                    style={[styles.row, { flexDirection: 'row' }]}
                    onPress={() => {
                      onNavigate(screen);
                      onRequestClose();
                    }}
                    activeOpacity={0.7}
                  >
                    <Ionicons name={icon as any} size={22} color={semanticRoles.primaryCTA} style={styles.rowIcon} />
                    <Text style={[styles.rowLabel, { textAlign }]} numberOfLines={1}>
                      {t(labelKey)}
                    </Text>
                    <Ionicons
                      name={isRTL ? 'chevron-back' : 'chevron-forward'}
                      size={20}
                      color={semanticRoles.textMuted}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  sheetContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.xxl,
    maxHeight: '70%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.xs,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  closeBtn: {
    padding: BTHWANI_SPACING.xs,
  },
  list: {
    flexGrow: 0,
  },
  listContent: {
    paddingBottom: BTHWANI_SPACING.xl,
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: semanticRoles.border,
  },
  rowIcon: {
    marginEnd: BTHWANI_SPACING.md,
  },
  rowLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
});

export default PartnerWalletHubSheet;
