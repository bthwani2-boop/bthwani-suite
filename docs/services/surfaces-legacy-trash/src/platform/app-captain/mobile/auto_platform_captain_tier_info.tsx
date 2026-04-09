// Auto-generated screen for platform_captain_tier_info
// Surface: app-captain | Service: platform
// Operation: GET /api/platform/captains/{captainId}/tier
// Description: Unified captain tier information screen - works across DSH, AMN service types (no KNZ per policy)
// UX Principle: Minimum Clicks + Minimum Cognitive Load + Zero Ambiguity

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildPlatformCaptainTierInfoMock, type TierInfo } from '../../fixtures/captainTierInfo';

interface AutoPlatformCaptainTierInfoProps {
  navigation?: any;
  route?: {
    params?: {
      service?: 'dsh' | 'amn';
      captainId?: string;
    };
  };
}

export const AutoPlatformCaptainTierInfo: React.FC<AutoPlatformCaptainTierInfoProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [service, setService] = useState<'dsh' | 'amn'>('dsh');

  useEffect(() => {
    const serviceParam = route?.params?.service || 'dsh';
    setService(serviceParam);
    loadTierInfo();
  }, [route]);

  const loadTierInfo = useCallback(async () => {
    try {
      setScreenState('loading');
      setErrorMessage('');

      await new Promise(resolve => setTimeout(resolve, 800));

      setTierInfo(buildPlatformCaptainTierInfoMock(t, service, route?.params?.captainId || 'cap_001'));
      setScreenState('content');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t('platform.app-captain.mobile.auto_platform_captain_tier_info.errorLoadMessage');
      setErrorMessage(errorMsg);
      setScreenState('error');
    }
  }, [service, route]);

  const getServiceDisplayName = (svc: string) => {
    switch (svc) {
      case 'dsh': return '🚚 توصيل وتسوق';
      case 'amn': return '🚕 تاكسي للنساء';
      default: return svc;
    }
  };

  const getTierColor = (tier: string) => {
    // §UX-SUPREME-001 R2.4: Use semantic roles only, no hardcoded colors
    switch (tier) {
      case 'ELITE': return semanticRoles.accentStrong; // Orange Dark - Highest tier
      case 'GOLD': return semanticRoles.accent; // Orange - High tier
      case 'SILVER': return semanticRoles.textMuted; // 60% Navy - Medium tier
      case 'BRONZE': return semanticRoles.textMuted; // 60% Navy - Basic tier
      default: return semanticRoles.primaryCTA;
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'ELITE': return '👑';
      case 'GOLD': return '⭐';
      case 'SILVER': return '🥈';
      case 'BRONZE': return '🥉';
      default: return '⭐';
    }
  };

  const handleEvaluatePress = useCallback(() => {
    navigation?.navigate('platform_captain_tier_evaluate', { 
      service: service,
      captainId: tierInfo?.captainId 
    });
  }, [navigation, service, tierInfo]);

  // Loading State
  if (screenState === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('surfaces.جاري_تحميل_معلومات_المستوى')}
        screenName="platform_captain_tier_info"
        operationName="GET /api/platform/captains/{captainId}/tier"
      />
    );
  }

  // Error State
  if (screenState === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={errorMessage || t('surfaces.فشل_في_تحميل_معلومات_المستوى')}
        errorActionText="إعادة المحاولة"
        onErrorAction={loadTierInfo}
        screenName="platform_captain_tier_info"
        operationName="GET /api/platform/captains/{captainId}/tier"
      />
    );
  }

  // Empty State (should not happen for tier info, but handled for safety)
  if (!tierInfo) {
    return (
      <ScreenWrapper
        state="empty"
        emptyMessage={t('surfaces.لا_توجد_معلومات_مستوى_متاحة')}
        emptyActionText="إعادة المحاولة"
        onEmptyAction={loadTierInfo}
        screenName="platform_captain_tier_info"
        operationName="GET /api/platform/captains/{captainId}/tier"
      />
    );
  }

  // Content State - Success
  return (
    <ScreenWrapper state="content">
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Premium Tier Display */}
        <View style={styles.header}>
          <View style={styles.headerGradient}>
            <View style={styles.tierIconContainer}>
              <Text style={styles.tierIcon}>{getTierIcon(tierInfo.currentTier)}</Text>
            </View>
            <Text style={styles.tierName}>{tierInfo.tierName}</Text>
            <Text style={styles.serviceName}>{getServiceDisplayName(tierInfo.service)}</Text>
            <View style={[styles.tierBadge, { backgroundColor: getTierColor(tierInfo.currentTier) }]}>
              <Text style={styles.tierBadgeText}>{tierInfo.currentTier}</Text>
            </View>
          </View>
        </View>

        {/* Benefits - Clear List, No Interaction Needed */}
        <View style={styles.benefitsSection}>
          <Text style={styles.sectionTitle}>المميزات الحالية</Text>
          {tierInfo.tierBenefits.map((benefit, index) => (
            <View key={index} style={[styles.benefitCard, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={styles.benefitText}>{benefit}</Text>
            </View>
          ))}
        </View>

        {/* Progress - Visual, Immediate Understanding */}
        <View style={styles.progressSection}>
          <Text style={styles.sectionTitle}>التقدم نحو المستوى التالي</Text>
          <View style={styles.progressCard}>
            <View style={[styles.progressHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.progressLabel}>التقدم</Text>
              <Text style={styles.progressPercentage}>{tierInfo.progress.percentage}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${tierInfo.progress.percentage}%`, 
                    backgroundColor: getTierColor(tierInfo.currentTier) 
                  }
                ]}
              />
            </View>
            <View style={styles.progressStats}>
              <Text style={styles.progressStat}>
                {tierInfo.progress.currentValue} / {tierInfo.progress.targetValue}
              </Text>
            </View>
          </View>
        </View>

        {/* Requirements - Clear, Actionable */}
        <View style={styles.requirementsSection}>
          <Text style={styles.sectionTitle}>متطلبات المستوى التالي</Text>
          <View style={styles.requirementsCard}>
            {tierInfo.nextTierRequirements.requiredDeliveries && (
              <View style={[styles.requirementRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.requirementLabel}>عدد التوصيلات المطلوبة:</Text>
                <Text style={styles.requirementValue}>
                  {tierInfo.nextTierRequirements.requiredDeliveries}
                </Text>
              </View>
            )}
            {tierInfo.nextTierRequirements.requiredTrips && (
              <View style={[styles.requirementRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.requirementLabel}>عدد الرحلات المطلوبة:</Text>
                <Text style={styles.requirementValue}>
                  {tierInfo.nextTierRequirements.requiredTrips}
                </Text>
              </View>
            )}
            <View style={[styles.requirementRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.requirementLabel}>التقييم المطلوب:</Text>
              <Text style={styles.requirementValue}>
                {tierInfo.nextTierRequirements.requiredRating} ⭐
              </Text>
            </View>
            <View style={[styles.requirementRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.requirementLabel}>معدل الإتمام المطلوب:</Text>
              <Text style={styles.requirementValue}>
                {tierInfo.nextTierRequirements.requiredCompletionRate}%
              </Text>
            </View>
          </View>
        </View>

        {/* Evaluation Info - Minimal, Non-Intrusive */}
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>معلومات التقييم</Text>
          <View style={styles.infoCard}>
            <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.infoLabel}>تاريخ آخر تقييم:</Text>
              <Text style={styles.infoValue}>
                {new Date(tierInfo.evaluationDate).toLocaleDateString('ar-SA')}
              </Text>
            </View>
          </View>
        </View>

        {/* Primary Action - Single Tap, Clear Outcome */}
        <View style={styles.actionsSection}>
          <TouchableOpacity 
            style={styles.evaluateButton} 
            onPress={handleEvaluatePress}
            activeOpacity={0.8}
          >
            <Text style={styles.evaluateButtonText}>تقييم المستوى الآن</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  contentContainer: {
    paddingBottom: BTHWANI_SPACING.xl,
  },
  header: {
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
  tierIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
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
  tierIcon: {
    fontSize: 72,
    marginBottom: 0,
  },
  tierName: {
    fontSize: 32,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
    marginBottom: BTHWANI_SPACING.sm,
    letterSpacing: 0.5,
  },
  serviceName: {
    fontSize: 16,
    color: semanticRoles.primaryCTAText,
    opacity: 0.95,
    marginBottom: BTHWANI_SPACING.md,
    fontWeight: '500',
  },
  tierBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTAText + '30',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  tierBadgeText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 1,
  },
  benefitsSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  benefitCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  benefitIcon: {
    fontSize: 20,
    color: semanticRoles.stateSuccess.icon,
    marginEnd: BTHWANI_SPACING.sm,
  },
  benefitText: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  progressSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  progressCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 4,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  progressLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  progressPercentage: {
    fontSize: 18,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
  },
  progressBarContainer: {
    height: 12,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.sm,
    overflow: 'hidden',
    marginBottom: BTHWANI_SPACING.sm,
  },
  progressBar: {
    height: '100%',
    borderRadius: BTHWANI_RADIUS.sm,
  },
  progressStats: {
    alignItems: 'center',
  },
  progressStat: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  requirementsSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  requirementsCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  requirementLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  requirementValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  infoSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  actionsSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  evaluateButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    minHeight: 48, // Minimum touch target
  },
  evaluateButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoPlatformCaptainTierInfo;
