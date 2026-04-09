/**
 * PartnerHomeScreen — §87 SSoT in packages/surfaces
 * §UX-SUPREME-001: One-Click Everything | Smart Defaults | Progressive Disclosure
 * DSH: واجهة موحدة — الطلبات + إجراءات مضمنة (نقرة واحدة)
 * ARB: قائمة الحجوزات + روابط سريعة
 */
import React, { useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { AnimatedCard } from '../mobile/components/MicroInteractions';
import { ServiceIcon } from '../mobile/components';
import { usePartnerType } from '../mobile/app-partner/PartnerTypeContext';
import { usePartnerSessionUi } from '../mobile/app-partner/PartnerSessionUiContext';
import { DshPartnerHomeUnified } from './DshPartnerHomeUnified';
export interface PartnerHomeScreenProps {
  navigation?: { navigate: (name: string, params?: Record<string, unknown>) => void };
  partnerType?: 'dsh' | 'arb' | null;
  isLoading?: boolean;
}

export const PartnerHomeScreen: React.FC<PartnerHomeScreenProps> = ({
  navigation,
  partnerType: propPartnerType,
  isLoading = false,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const { partnerType: contextPartnerType } = usePartnerType();
  const partnerType = propPartnerType || contextPartnerType;
  const { activeStoreScope } = usePartnerSessionUi();

  const isDsh = partnerType === 'dsh';
  const canNavigate = !!navigation?.navigate;

  const navigateTo = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (!canNavigate) return;
      const isDshRoute = screen.startsWith('dsh_');
      const scopedStoreId =
        partnerType === 'dsh' &&
        activeStoreScope &&
        activeStoreScope !== '__partner_all_stores__'
          ? activeStoreScope
          : undefined;
      const p = isDshRoute && scopedStoreId ? { ...params, storeId: scopedStoreId } : params;
      navigation!.navigate(screen, p);
    },
    [canNavigate, navigation, activeStoreScope, partnerType],
  );

  const getTypeTitle = () => {
    if (partnerType === 'dsh') return t('surfaces.شريك_التوصيل');
    if (partnerType === 'arb') return t('surfaces.شريك_الحجوزات');
    return t('surfaces.تطبيق_بثواني_للشريك');
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          {/* Simple loading indicator */}
        </View>
      </View>
    );
  }

  if (!partnerType) {
    return (
      <View style={styles.container}>
        <View style={styles.emptyContainer}>
          <ServiceIcon name="store" size={64} color={semanticRoles.primaryCTA} />
          <Text style={styles.title}>{t('partner.PartnerHomeScreen.emptyTitle')}</Text>
          <Text style={styles.subtitle}>{t('partner.PartnerHomeScreen.emptySubtitle')}</Text>
        </View>
      </View>
    );
  }

  return (
    <>
    {isDsh ? (
      <View style={styles.dshFullScreen}>
        <View style={[styles.arbCompactHeader, { paddingHorizontal: BTHWANI_SPACING.contentH }]}>
          <Text style={styles.arbCompactTitle}>{getTypeTitle()}</Text>
          <Text style={styles.arbCompactSubtitle}>{t('partner.dsh_subtitle')}</Text>
        </View>
        <View style={styles.dshUnifiedContent}>
        <DshPartnerHomeUnified
          navigation={navigation}
          activeStoreScope={activeStoreScope}
        />
        </View>
      </View>
    ) : (
    <ScrollView 
      style={styles.scroll} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* ARB: هيدر + قائمة الحجوزات */}
      {partnerType === 'arb' && (
        <View style={styles.arbCompactHeader}>
          <Text style={styles.arbCompactTitle}>{getTypeTitle()}</Text>
          <Text style={styles.arbCompactSubtitle}>{t('partner.arb_subtitle')}</Text>
        </View>
      )}

      {/* ARB: نمط t('surfaces.اليوم_أولاً') كما في Airbnb/Booking — تحليل أقوى تطبيقات الحجوزات */}
      {partnerType === 'arb' && (
        <>
          {/* قسم "اليوم" — أول ما يراه الشريك (at a glance) */}
          <View style={styles.arbTodayCard}>
            <Text style={styles.arbTodayLabel}>{t('partner.arb_today_label')}</Text>
            <Text style={styles.arbTodaySummary}>{t('partner.arb_today_summary')}</Text>
          </View>
          {/* زر بطل واحد — قائمة الحجوزات مع سياق يومي */}
          <View style={styles.section}>
            <AnimatedCard
              style={styles.arbHeroCta}
              onPress={() => navigateTo('arb_partner_bookings_list')}
            >
              <View style={styles.arbHeroCtaContent}>
                <View style={styles.arbHeroCtaIconWrap}>
                  <ServiceIcon name="event" size={28} color={BTHWANI_COLORS.surface}/>
                </View>
                <Text style={styles.arbHeroCtaText}>{t('partner.arb_bookings_hero')}</Text>
                <Text style={styles.arbHeroCtaSubtext}>{t('partner.arb_bookings_sub')}</Text>
              </View>
            </AnimatedCard>
            {/* صف روابط ثانوية: مالية + دعم (كما في التطبيقات الحديثة) */}
            <View style={styles.arbLinksRow}>
              <TouchableOpacity
                style={styles.arbLinkBox}
                onPress={() => navigateTo('arb_partner_finance_overview')}
                activeOpacity={0.7}
              >
                <ServiceIcon name="account-balance" size={22} color={semanticRoles.primaryCTA} />
                <Text style={styles.arbLinkBoxText}>{t('partner.arb_finance_link')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.arbLinkBox}
                onPress={() => navigateTo('platform_partner_support')}
                activeOpacity={0.7}
              >
                <ServiceIcon name="support-agent" size={22} color={semanticRoles.primaryCTA} />
                <Text style={styles.arbLinkBoxText}>{t('partner.arb_support_link')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      )}

    </ScrollView>
    )}
    </>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  scrollContent: { 
    padding: BTHWANI_SPACING.contentH, 
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  headerSection: {
    marginBottom: BTHWANI_SPACING.xl,
    borderRadius: BTHWANI_RADIUS.xl,
    overflow: 'hidden',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 12,
  },
  headerGradient: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xxl,
    paddingBottom: BTHWANI_SPACING.xxl,
    alignItems: 'center',
  },
  headerIconContainer: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: semanticRoles.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 3,
    borderColor: semanticRoles.primaryCTAText + '20',
  },
  greeting: { 
    fontSize: 28,
    fontWeight: '700', 
    color: semanticRoles.primaryCTAText, 
    marginBottom: BTHWANI_SPACING.sm,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  greetingSubtitle: {
    fontSize: 16,
    color: semanticRoles.primaryCTAText,
    opacity: 0.95,
    textAlign: 'center',
    fontWeight: '500',
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.lg,
    letterSpacing: 0.3,
  },
  primaryRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
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
  primaryActionCardHalf: {
    flex: 1,
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
  arbCompactHeader: {
    paddingVertical: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  arbCompactTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  arbCompactSubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  arbHeroCta: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.xl,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 0,
  },
  arbHeroCtaContent: {
    alignItems: 'center',
  },
  arbHeroCtaIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.22)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  arbHeroCtaText: {
    fontSize: 20,
    fontWeight: '700',
    color: BTHWANI_COLORS.surface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  arbHeroCtaSubtext: {
    fontSize: 13,
    color: BTHWANI_COLORS.surface,
    opacity: 0.92,
  },
  arbTodayCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  arbTodayLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
    letterSpacing: 0.3,
  },
  arbTodaySummary: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 22,
  },
  arbLinksRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.sm,
  },
  arbLinkBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  arbLinkBoxText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  arbCollapseChevron: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  dshFullScreen: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  dshUnifiedContent: {
    flex: 1,
    paddingHorizontal: BTHWANI_SPACING.contentH,
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
});
