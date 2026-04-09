// Auto-generated screen for platform_captain_tier_evaluate
// Surface: app-captain | Service: platform
// Operation: POST /api/platform/captains/{captainId}/tier/evaluate
// Description: Unified captain tier evaluation screen - works across DSH, AMN service types (no KNZ per policy)
// UX Principle: Minimum Clicks + Minimum Cognitive Load + Zero Ambiguity

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildPlatformCaptainTierEvaluateMock, type TierEvaluationResult } from '../../fixtures/captainTierEvaluate';

interface AutoPlatformCaptainTierEvaluateProps {
  navigation?: any;
  route?: {
    params?: {
      service?: 'dsh' | 'amn';
      captainId?: string;
      evaluationPeriod?: 'monthly' | 'quarterly' | 'annual';
      forceEvaluation?: boolean;
    };
  };
}

export const AutoPlatformCaptainTierEvaluate: React.FC<AutoPlatformCaptainTierEvaluateProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [evaluationResult, setEvaluationResult] = useState<TierEvaluationResult | null>(null);
  const [screenState, setScreenState] = useState<ScreenState>('content');
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [service, setService] = useState<'dsh' | 'amn'>('dsh');
  const [evaluationPeriod, setEvaluationPeriod] = useState<'monthly' | 'quarterly' | 'annual'>('monthly');
  const [forceEvaluation, setForceEvaluation] = useState(false);

  useEffect(() => {
    const serviceParam = route?.params?.service || 'dsh';
    const periodParam = route?.params?.evaluationPeriod || 'monthly';
    const forceParam = route?.params?.forceEvaluation || false;
    setService(serviceParam);
    setEvaluationPeriod(periodParam);
    setForceEvaluation(forceParam);
  }, [route]);

  const performEvaluation = useCallback(async () => {
    try {
      setIsEvaluating(true);
      setScreenState('loading');
      setErrorMessage('');

      await new Promise(resolve => setTimeout(resolve, 2000));

      setEvaluationResult(buildPlatformCaptainTierEvaluateMock(t, service, route?.params?.captainId || 'cap_001'));
      setScreenState('success');
      
      // Auto-navigate to tier info after 2 seconds (optional - can be removed for manual navigation)
      setTimeout(() => {
        setScreenState('content');
      }, 2000);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : t('platform.app-captain.mobile.auto_platform_captain_tier_evaluate.errorMessage');
      setErrorMessage(errorMsg);
      setScreenState('error');
    } finally {
      setIsEvaluating(false);
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

  const getPeriodDisplayName = (period: string) => {
    switch (period) {
      case 'monthly': return t('surfaces.شهري');
      case 'quarterly': return t('surfaces.ربع_سنوي');
      case 'annual': return t('surfaces.سنوي');
      default: return period;
    }
  };

  const handleViewTierInfo = useCallback(() => {
    navigation?.navigate('platform_captain_tier_info', { 
      service: service,
      captainId: evaluationResult?.captainId || route?.params?.captainId
    });
  }, [navigation, service, evaluationResult, route]);

  const handleReEvaluate = useCallback(() => {
    setEvaluationResult(null);
    setScreenState('content');
  }, []);

  // Loading State (during evaluation)
  if (screenState === 'loading' && isEvaluating) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('surfaces.جاري_تقييم_المستوى')}
        screenName="platform_captain_tier_evaluate"
        operationName="POST /api/platform/captains/{captainId}/tier/evaluate"
      />
    );
  }

  // Error State
  if (screenState === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={errorMessage || t('surfaces.فشل_في_تقييم_المستوى')}
        errorActionText="إعادة المحاولة"
        onErrorAction={performEvaluation}
        screenName="platform_captain_tier_evaluate"
        operationName="POST /api/platform/captains/{captainId}/tier/evaluate"
      />
    );
  }

  // Success State (brief display after evaluation)
  if (screenState === 'success' && evaluationResult) {
    return (
      <ScreenWrapper
        state="success"
        successMessage={evaluationResult.message}
        successActionText={t('surfaces.عرض_التفاصيل')}
        onSuccessAction={handleViewTierInfo}
        screenName="platform_captain_tier_evaluate"
        operationName="POST /api/platform/captains/{captainId}/tier/evaluate"
      />
    );
  }

  // Content State
  return (
    <ScreenWrapper state="content">
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header - Clear Context */}
        <View style={styles.header}>
          <Text style={styles.title}>تقييم المستوى</Text>
          <Text style={styles.subtitle}>{getServiceDisplayName(service)}</Text>
          <Text style={styles.periodText}>فترة التقييم: {getPeriodDisplayName(evaluationPeriod)}</Text>
        </View>

        {/* Pre-Evaluation: Clear Criteria, Single Action */}
        {!evaluationResult && (
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>معايير التقييم</Text>
            <View style={styles.infoCard}>
              <View style={styles.criteriaList}>
                {service === 'dsh' && (
                  <View style={[styles.criteriaItem, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.criteriaIcon}>📦</Text>
                    <Text style={styles.criteriaText}>عدد التوصيلات المكتملة</Text>
                  </View>
                )}
                {service === 'amn' && (
                  <View style={[styles.criteriaItem, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.criteriaIcon}>🚕</Text>
                    <Text style={styles.criteriaText}>عدد الرحلات المكتملة</Text>
                  </View>
                )}
                <View style={[styles.criteriaItem, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.criteriaIcon}>⭐</Text>
                  <Text style={styles.criteriaText}>متوسط التقييم</Text>
                </View>
                <View style={[styles.criteriaItem, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.criteriaIcon}>⏰</Text>
                  <Text style={styles.criteriaText}>معدل الإتمام في الوقت المحدد</Text>
                </View>
                {service === 'amn' && (
                  <View style={[styles.criteriaItem, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.criteriaIcon}>✅</Text>
                    <Text style={styles.criteriaText}>معدل إتمام الرحلات</Text>
                  </View>
                )}
                <View style={[styles.criteriaItem, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.criteriaIcon}>⚠️</Text>
                  <Text style={styles.criteriaText}>عدد شكاوى العملاء</Text>
                </View>
              </View>
            </View>
          </View>
        )}

        {/* Post-Evaluation: Clear Result, Clear Actions */}
        {evaluationResult && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>نتيجة التقييم</Text>
            
            <View style={styles.resultCard}>
              {/* Tier Comparison - Visual, Immediate Understanding */}
              <View style={[styles.tierComparison, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.tierBox}>
                  <Text style={styles.tierLabel}>المستوى السابق</Text>
                  <Text style={styles.tierIcon}>{getTierIcon(evaluationResult.previousTier)}</Text>
                  <Text style={styles.tierName}>{evaluationResult.previousTier}</Text>
                </View>
                <Text style={styles.arrow}>→</Text>
                <View style={styles.tierBox}>
                  <Text style={styles.tierLabel}>المستوى الجديد</Text>
                  <Text style={styles.tierIcon}>{getTierIcon(evaluationResult.newTier)}</Text>
                  <Text style={[styles.tierName, { color: getTierColor(evaluationResult.newTier) }]}>
                    {evaluationResult.newTier}
                  </Text>
                </View>
              </View>

              {/* Success Badge - Clear Visual Feedback */}
              {evaluationResult.tierChanged && (
                <View style={styles.successBadge}>
                  <Text style={styles.successText}>✓ تم الترقية!</Text>
                </View>
              )}

              {/* Message - Clear, Actionable */}
              <Text style={styles.messageText}>{evaluationResult.message}</Text>
            </View>

            {/* Metrics - Detailed but Non-Intrusive */}
            <View style={styles.metricsSection}>
              <Text style={styles.sectionTitle}>المقاييس المستخدمة</Text>
              <View style={styles.metricsCard}>
                {evaluationResult.metrics.totalDeliveries !== undefined && (
                  <View style={[styles.metricRow, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.metricLabel}>عدد التوصيلات:</Text>
                    <Text style={styles.metricValue}>{evaluationResult.metrics.totalDeliveries}</Text>
                  </View>
                )}
                {evaluationResult.metrics.totalTrips !== undefined && (
                  <View style={[styles.metricRow, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.metricLabel}>عدد الرحلات:</Text>
                    <Text style={styles.metricValue}>{evaluationResult.metrics.totalTrips}</Text>
                  </View>
                )}
                <View style={[styles.metricRow, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.metricLabel}>متوسط التقييم:</Text>
                  <Text style={styles.metricValue}>
                    {evaluationResult.metrics.averageRating} ⭐
                  </Text>
                </View>
                <View style={[styles.metricRow, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.metricLabel}>معدل الإتمام في الوقت:</Text>
                  <Text style={styles.metricValue}>
                    {evaluationResult.metrics.onTimePercentage}%
                  </Text>
                </View>
                {evaluationResult.metrics.tripCompletionRate !== undefined && (
                  <View style={[styles.metricRow, { flexDirection: 'row', direction: layoutDirection }]}>
                    <Text style={styles.metricLabel}>معدل إتمام الرحلات:</Text>
                    <Text style={styles.metricValue}>
                      {evaluationResult.metrics.tripCompletionRate}%
                    </Text>
                  </View>
                )}
                <View style={[styles.metricRow, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.metricLabel}>شكاوى العملاء:</Text>
                  <Text style={styles.metricValue}>
                    {evaluationResult.metrics.customerComplaints}
                  </Text>
                </View>
              </View>
            </View>

            {/* Evaluation Date - Minimal Info */}
            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>تاريخ التقييم:</Text>
              <Text style={styles.dateValue}>
                {new Date(evaluationResult.evaluationDate).toLocaleString('ar-SA')}
              </Text>
            </View>
          </View>
        )}

        {/* Actions - Clear, Single Purpose Per Button */}
        <View style={styles.actionsSection}>
          {!evaluationResult && (
            <TouchableOpacity 
              style={[styles.evaluateButton, isEvaluating && styles.evaluateButtonDisabled]} 
              onPress={performEvaluation}
              disabled={isEvaluating}
              activeOpacity={0.8}
            >
              {isEvaluating ? (
                <ActivityIndicator color={semanticRoles.primaryCTAText} />
              ) : (
                <Text style={styles.evaluateButtonText}>بدء التقييم</Text>
              )}
            </TouchableOpacity>
          )}
          
          {evaluationResult && (
            <>
              {/* Primary Action - View Updated Tier Info */}
              <TouchableOpacity 
                style={styles.viewTierButton} 
                onPress={handleViewTierInfo}
                activeOpacity={0.8}
              >
                <Text style={styles.viewTierButtonText}>عرض معلومات المستوى</Text>
              </TouchableOpacity>
              
              {/* Secondary Action - Re-evaluate (if needed) */}
              <TouchableOpacity 
                style={styles.reEvaluateButton} 
                onPress={handleReEvaluate}
                activeOpacity={0.8}
              >
                <Text style={styles.reEvaluateButtonText}>تقييم مرة أخرى</Text>
              </TouchableOpacity>
            </>
          )}
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
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    marginBottom: BTHWANI_SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  periodText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
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
  criteriaList: {
    marginTop: BTHWANI_SPACING.sm,
  },
  criteriaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  criteriaIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.sm,
  },
  criteriaText: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  resultSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  resultCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tierComparison: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  tierBox: {
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  tierIcon: {
    fontSize: 48,
    marginBottom: BTHWANI_SPACING.xs,
  },
  tierName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semanticRoles.text,
  },
  arrow: {
    fontSize: 24,
    color: semanticRoles.textMuted,
  },
  successBadge: {
    backgroundColor: semanticRoles.stateSuccess.background,
    borderRadius: BTHWANI_RADIUS.sm,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  successText: {
    color: semanticRoles.stateSuccess.text,
    fontSize: 16,
    fontWeight: '600',
  },
  messageText: {
    fontSize: 14,
    color: semanticRoles.text,
    textAlign: 'center',
    lineHeight: 20,
  },
  metricsSection: {
    marginTop: BTHWANI_SPACING.md,
  },
  metricsCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  metricLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  metricValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  dateSection: {
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  dateLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  dateValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
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
  evaluateButtonDisabled: {
    opacity: 0.6,
  },
  evaluateButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  viewTierButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
    minHeight: 48, // Minimum touch target
  },
  viewTierButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  reEvaluateButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    minHeight: 48, // Minimum touch target
  },
  reEvaluateButtonText: {
    color: semanticRoles.primaryCTA,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoPlatformCaptainTierEvaluate;
