// Auto-generated screen for dsh_captain_tier_info
// Surface: app-captain | Service: dsh
// Operation: GET /api/dsh/captains/{captainId}/tier
// Description: Get DSH captain tier information

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, RefreshControl, ScrollView } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { evaluateDshCaptainTier } from '@bthwani/api-clients/dsh/dsh-captain-api';
import { buildTierInfoFromApi, type TierInfo } from '../../hooks';

interface AutoDshCaptainTierInfoProps {
  navigation?: any;
  route?: {
    params?: {
      captainId: string;
    };
  };
}

export const AutoDshCaptainTierInfo: React.FC<AutoDshCaptainTierInfoProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const captainId = route?.params?.captainId || '';

  const loadTierInfo = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const tierData = await evaluateDshCaptainTier();
      if (!tierData) throw new Error('فشل في تحميل المستوى');

      const tierInfo = buildTierInfoFromApi(t, tierData as Parameters<typeof buildTierInfoFromApi>[1]);

      setTierInfo(tierInfo);
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.errorMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [captainId]);

  useEffect(() => {
    loadTierInfo();
  }, [loadTierInfo]);

  if (isLoading) {
    return <ScreenWrapper state="loading" loadingMessage={t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.loadingMessage')} />;
  }

  if (error) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        onErrorAction={() => loadTierInfo()}
      />
    );
  }

  if (!tierInfo) {
    return <ScreenWrapper state="empty" emptyMessage={t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.emptyMessage')} />;
  }

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze':
        return colorTokens.warning['600'];
      case 'silver':
        return colorTokens.neutral['300'];
      case 'gold':
        return colorTokens.warning['400'];
      case 'platinum':
        return colorTokens.neutral['200'];
      default: return semanticRoles.primaryCTA;
    }
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadTierInfo(true)} />
        }
      >
        <View style={[styles.tierCard, { backgroundColor: getTierColor(tierInfo.current_tier) }]}>
          <Text style={styles.tierLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.tierLabel')}</Text>
          <Text style={styles.tierName}>{tierInfo.tier_name}</Text>
          <Text style={styles.tierLevel}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.tierLevelFormat', { level: tierInfo.tier_level })}</Text>
        </View>

        {tierInfo.next_tier && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.progressTitle')}</Text>
              <Text style={styles.progressPercent}>{tierInfo.progress_to_next}%</Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[styles.progressFill, { width: `${tierInfo.progress_to_next}%` }]}
              />
            </View>
          </View>
        )}

        <View style={styles.requirementsCard}>
          <Text style={[styles.cardTitle, textAlignStart]}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.cardTitleRequirements')}</Text>
          <View style={styles.requirementRow}>
            <Text style={styles.requirementLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.requirementLabelOrders')}</Text>
            <Text style={styles.requirementValue}>
              {tierInfo.requirements.completed_orders} / {tierInfo.requirements.required_orders}
            </Text>
          </View>
          <View style={styles.requirementRow}>
            <Text style={styles.requirementLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.requirementLabelRating')}</Text>
            <Text style={styles.requirementValue}>
              {tierInfo.requirements.rating.toFixed(1)} / {tierInfo.requirements.required_rating}
            </Text>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={[styles.cardTitle, textAlignStart]}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.cardTitleBenefits')}</Text>
          {tierInfo.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={[styles.benefitText, textAlignStart]}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            آخر تقييم: {new Date(tierInfo.last_evaluated).toLocaleString('ar-SA')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.evaluateButton}
          onPress={() => navigation?.navigate('dsh_captain_tier_evaluate', { captainId })}
          activeOpacity={0.8}
        >
          <Text style={styles.evaluateButtonText}>{t('dsh.app-captain.mobile.auto_dsh_captain_tier_info.evaluateButtonText')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  tierCard: {
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  tierLabel: {
    fontSize: 14,
    color: colorTokens.surface.primary,
    opacity: 0.9,
    marginBottom: BTHWANI_SPACING.xs,
  },
  tierName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colorTokens.surface.primary,
    marginBottom: BTHWANI_SPACING.xs,
  },
  tierLevel: {
    fontSize: 16,
    color: colorTokens.surface.primary,
    opacity: 0.9,
  },
  progressCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  progressPercent: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
  },
  progressBar: {
    height: 8,
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: semanticRoles.primaryCTA,
  },
  requirementsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  requirementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  requirementLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  requirementValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  benefitsCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  benefitIcon: {
    fontSize: 16,
    color: semanticRoles.stateSuccess.icon,
    marginStart: BTHWANI_SPACING.sm,
  },
  benefitText: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  evaluateButton: {
    backgroundColor: semanticRoles.primaryCTA,
    margin: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  evaluateButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainTierInfo;
