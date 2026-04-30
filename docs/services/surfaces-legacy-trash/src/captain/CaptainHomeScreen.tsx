/**
 * CaptainHomeScreen — §87 SSoT in packages/surfaces
 * §UX-SUPREME-001: Unified Design - Same Tokens, Layout for DSH/AMN types only.
 * Captain types = DSH and AMN only (no KNZ per policy).
 * WAVE 8: Layout direction (start/end) from useI18n().isRTL only; sheetHeader and sheetItem use direction (ltr/rtl) + row so content follows start/end. Same for all screens.
 */
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Modal, TouchableOpacity } from 'react-native';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { CaptainModeSwitchSheet, type CaptainType as ModeSwitchCaptainType } from './CaptainModeSwitchSheet';
import { AnimatedCard, LoadingSkeletonCard } from '../mobile/components/MicroInteractions';
import { ServiceIcon } from '../mobile/components/ServiceIcon';
import { CAPTAIN_CONTENT_BG } from './captainTypes';

export type CaptainType = 'dsh' | 'amn';

export type CaptainHomeScreenProps = {
  /** استخدم في التطبيق: navigation.navigate(screenName) */
  navigation?: { navigate: (name: string) => void };
  /** نوع الكابتن الحالي (من التخزين أو اختيار التطوير) */
  captainType?: CaptainType | null;
  /** تحميل أولي (مثلاً جلب النوع من التخزين) */
  isLoading?: boolean;
};

export const CaptainHomeScreen: React.FC<CaptainHomeScreenProps> = ({
  navigation,
  captainType,
  isLoading = false,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [modeSwitchVisible, setModeSwitchVisible] = useState(false);
  const [financialSheetVisible, setFinancialSheetVisible] = useState(false);

  const canNavigate = !!navigation?.navigate;

  const DSH_ACTIONS = useMemo(() => [
    { screen: 'dsh_captain_orders_list', label: t('surfaces.captain_orders_delivery'), icon: 'restaurant', primary: true },
    { screen: 'dsh_captain_cod_balance', label: t('surfaces.captain_cod_balance'), icon: 'account-balance-wallet' },
    { screen: 'captain_wallet', label: t('surfaces.captain_wallet'), icon: 'account-balance-wallet' },
    { screen: 'captain_settlements', label: t('surfaces.captain_settlements'), icon: 'account-balance-wallet' },
    { screen: 'captain_earnings_history', label: t('surfaces.captain_earnings_history'), icon: 'star' },
    { screen: 'captain_payments', label: t('surfaces.captain_payments'), icon: 'payment' },
    { screen: 'captain_financial_reports', label: t('surfaces.captain_financial_reports'), icon: 'assessment' },
  ], [t]);

  const AMN_PRIMARY_CTA = useMemo(() => ({ screen: 'amn_captain_offers_list', label: t('surfaces.captain_offers_list'), icon: 'list' as const }), [t]);
  const AMN_FINANCIAL_ITEMS = useMemo(() => [
    { screen: 'platform_captain_earnings_get', label: t('surfaces.captain_earnings'), icon: 'star' },
    { screen: 'captain_wallet', label: t('surfaces.captain_wallet'), icon: 'account-balance-wallet' },
    { screen: 'captain_settlements', label: t('surfaces.captain_settlements'), icon: 'account-balance-wallet' },
    { screen: 'captain_earnings_history', label: t('surfaces.captain_earnings_history'), icon: 'star' },
    { screen: 'captain_payments', label: t('surfaces.captain_payments'), icon: 'payment' },
    { screen: 'captain_financial_reports', label: t('surfaces.captain_financial_reports'), icon: 'assessment' },
  ], [t]);
  
  const handleModeSwitch = (newType: ModeSwitchCaptainType) => {
    // In production, this would update captain_type via API
    // For dev, navigate to type select screen
    if (canNavigate) {
      navigation!.navigate('CaptainTypeSelect');
    }
  };

  const getTypeTitle = () => {
    if (captainType === 'dsh') return t('surfaces.captain_title_delivery');
    return t('surfaces.captain_title_default');
  };

  const getTypeIcon = () => {
    if (captainType === 'dsh') return 'directions-car';
    if (captainType === 'amn') return 'directions-car';
    return 'person';
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {Array.from({ length: 3 }).map((_, index) => (
            <LoadingSkeletonCard key={index} lines={2} showAvatar={true} />
          ))}
        </View>
      </View>
    );
  }

  if (!captainType) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ServiceIcon name="person" size={64} color={semanticRoles.primaryCTA} />
          <Text style={styles.title}>{t('surfaces.captain_brand')}</Text>
          <Text style={styles.subtitle}>{t('surfaces.captain_choose_type_start')}</Text>
          {typeof __DEV__ !== 'undefined' && __DEV__ && canNavigate && (
            <AnimatedCard
              style={styles.primaryButton}
              onPress={() => navigation!.navigate('CaptainTypeSelect')}
            >
              <Text style={styles.primaryButtonText}>{t('surfaces.captain_choose_type_dev')}</Text>
            </AnimatedCard>
          )}
        </View>
      </View>
    );
  }

  const handleFinancialItem = (screen: string) => {
    setFinancialSheetVisible(false);
    if (canNavigate) navigation!.navigate(screen);
  };

  return (
    <>
      <ScrollView 
        style={[styles.scroll, captainType === 'dsh' && styles.scrollDsh]} 
        contentContainerStyle={[styles.scrollContent, captainType === 'dsh' && styles.scrollContentDsh]}
        showsVerticalScrollIndicator={false}
      >
        {/* §UX: عنوان {t('captain.CaptainHomeScreen.captain')} في الشريط العلوي فقط — لا تكرار في منتصف المحتوى (نفس AMN) */}

        {captainType === 'amn' ? (
          <View style={styles.section}>
            <Text style={styles.amnRedirectHint}>{t('surfaces.captain_amn_map_hint')}</Text>
          </View>
        ) : captainType === 'dsh' ? (
          <>
            <View style={styles.dshContentArea}>
              <Text style={styles.dshContentHint}>{t('surfaces.captain_dsh_hint')}</Text>
              <Text style={styles.dshTabsHint}>{t('surfaces.captain_dsh_tabs_hint')}</Text>
            </View>
          </>
        ) : null}

        {typeof __DEV__ !== 'undefined' && __DEV__ && canNavigate && (
          <TouchableOpacity
            style={styles.typeSelectButton}
            onPress={() => setModeSwitchVisible(true)}
            activeOpacity={0.8}
          >
            <Text style={styles.typeSelectButtonText}>{t('surfaces.captain_select_type')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <CaptainModeSwitchSheet
        visible={modeSwitchVisible}
        currentType={captainType}
        onSelect={handleModeSwitch}
        onClose={() => setModeSwitchVisible(false)}
      />

      {/* AMN: Finance sheet — Progressive Disclosure */}
      <Modal
        visible={financialSheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setFinancialSheetVisible(false)}
      >
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={() => setFinancialSheetVisible(false)}
        >
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <View style={[styles.sheetHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.sheetTitle}>{t('surfaces.captain_sheet_finance')}</Text>
              <TouchableOpacity onPress={() => setFinancialSheetVisible(false)}>
                <Text style={styles.sheetCloseText}>✕</Text>
              </TouchableOpacity>
            </View>
            {(captainType === 'dsh' ? DSH_ACTIONS.filter((a) => !a.primary) : AMN_FINANCIAL_ITEMS).map(({ screen, label, icon }) => (
              <TouchableOpacity
                key={screen}
                style={[styles.sheetItem, { flexDirection: 'row', direction: layoutDirection }]}
                onPress={() => handleFinancialItem(screen)}
                activeOpacity={0.7}
              >
                <ServiceIcon name={icon} size={22} color={semanticRoles.primaryCTA} />
                <Text style={styles.sheetItemLabel}>{label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  loadingContainer: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: BTHWANI_SPACING.contentH,
  },
  scroll: { 
    flex: 1, 
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  scrollDsh: {
    backgroundColor: CAPTAIN_CONTENT_BG,
  },
  scrollContent: { 
    padding: BTHWANI_SPACING.contentH, 
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  scrollContentDsh: {
    flexGrow: 1,
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  minimalHeader: {
    marginBottom: BTHWANI_SPACING.lg,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  minimalHeaderDsh: {
    marginBottom: BTHWANI_SPACING.md,
  },
  minimalHeaderText: {
    fontSize: 20,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  amnRedirectHint: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    paddingVertical: BTHWANI_SPACING.lg,
  },
  dshContentArea: {
    flex: 1,
    minHeight: 320,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  dshContentHint: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
  },
  dshTabsHint: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    opacity: 0.9,
  },
  dshPrimaryButton: {
    alignSelf: 'stretch',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.xl,
  },
  dshPrimaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText ?? BTHWANI_COLORS.surface,
  },
  dshFinancialLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  dshFinancialLinkText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  heroSection: {
    paddingHorizontal: 0,
    marginBottom: BTHWANI_SPACING.xl,
  },
  heroCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  heroTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  heroSubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    shadowColor: BTHWANI_COLORS.onPrimaryContainer,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  menuItemLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
  },
  primaryActionCard: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.xl,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTAText + '10',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.md,
  },
  actionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.primaryCTA + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText,
    flex: 1,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
  },
  actionCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: semanticRoles.border,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
  },
  actionIconContainerSmall: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: semanticRoles.primaryCTA + '12',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA + '20',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  title: { 
    fontSize: 28, 
    fontWeight: '700', 
    color: semanticRoles.text, 
    marginBottom: BTHWANI_SPACING.sm, 
    textAlign: 'center',
  },
  subtitle: { 
    fontSize: 16, 
    color: semanticRoles.textMuted, 
    marginBottom: BTHWANI_SPACING.xl, 
    textAlign: 'center',
  },
  primaryButton: { 
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  primaryButtonText: { 
    color: semanticRoles.primaryCTAText, 
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  devButton: { 
    marginTop: BTHWANI_SPACING.lg, 
    paddingVertical: BTHWANI_SPACING.md, 
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  devButtonText: { 
    fontSize: 12, 
    color: semanticRoles.textMuted,
  },
  /** نفس أسلوب CaptainMapScreen — توحيد زر تغيير النوع مع كابتن AMN */
  typeSelectButton: {
    marginTop: BTHWANI_SPACING.lg,
    marginHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  typeSelectButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText ?? BTHWANI_COLORS.surface,
  },
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'BTHWANI_COLORS.overlayMid',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.xxl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    maxHeight: '80%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  sheetCloseText: {
    fontSize: 18,
    color: semanticRoles.textMuted,
    padding: BTHWANI_SPACING.sm,
  },
  sheetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  sheetItemLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
  },
});
