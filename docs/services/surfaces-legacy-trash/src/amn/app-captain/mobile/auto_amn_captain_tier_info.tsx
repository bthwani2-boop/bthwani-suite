// Auto-generated screen for amn_captain_tier_info
// Surface: app-captain | Service: amn
// Operation: GET /api/amn/captains/{captainId}/tier
// Description: Get AMN captain tier information

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ScrollView,
} from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface TierInfo {
  current_tier: string;
  tier_level: number;
  tier_name: string;
  next_tier: string | null;
  progress_to_next: number;
  benefits: string[];
  performance_metrics: {
    trip_completion_rate: number;
    average_rating: number;
    customer_complaints: number;
    on_time_delivery: number;
  };
  last_evaluated: string;
}

interface AutoAmnCaptainTierInfoProps {
  navigation?: any;
  route?: {
    params?: {
      captainId: string;
    };
  };
}

export const AutoAmnCaptainTierInfo: React.FC<AutoAmnCaptainTierInfoProps> = ({
  navigation,
  route,
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
      // No dev/design seed: wait for backend API wiring; for now keep empty state.
      setTierInfo(null);
    } catch (err) {
      setError(t('amn.app-captain.mobile.auto_amn_captain_tier_info.loadingMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadTierInfo();
  }, [loadTierInfo]);

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
      default:
        return semanticRoles.primaryCTA;
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper
        state='loading'
        loadingMessage={t('amn.app-captain.mobile.auto_amn_captain_tier_info.loadingMessage_125')}
      />
    );
  }

  if (error) {
    return (
      <ScreenWrapper
        state='error'
        errorMessage={error}
        onErrorAction={() => loadTierInfo()}
      />
    );
  }

  if (!tierInfo) {
    return <ScreenWrapper state='empty' emptyMessage={t('amn.app-captain.mobile.auto_amn_captain_tier_info.noTierInfo')} />;
  }

  return (
    <ScreenWrapper state='content'>
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => loadTierInfo(true)}
          />
        }
      >
        <View
          style={[
            styles.tierCard,
            { backgroundColor: getTierColor(tierInfo.current_tier) },
          ]}
        >
          <Text style={styles.tierLabel}>المستوى الحالي</Text>
          <Text style={styles.tierName}>{tierInfo.tier_name}</Text>
          <Text style={styles.tierLevel}>المستوى {tierInfo.tier_level}</Text>
        </View>

        {tierInfo.next_tier && (
          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>التقدم للمستوى التالي</Text>
              <Text style={styles.progressPercent}>
                {tierInfo.progress_to_next}%
              </Text>
            </View>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${tierInfo.progress_to_next}%` },
                ]}
              />
            </View>
          </View>
        )}

        <View style={styles.metricsCard}>
          <Text style={[styles.cardTitle, textAlignStart]}>مؤشرات الأداء</Text>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>معدل إكمال الرحلات:</Text>
            <Text style={styles.metricValue}>
              {tierInfo.performance_metrics.trip_completion_rate}%
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>متوسط التقييم:</Text>
            <Text style={styles.metricValue}>
              ⭐ {tierInfo.performance_metrics.average_rating.toFixed(1)}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>شكاوى العملاء:</Text>
            <Text style={styles.metricValue}>
              {tierInfo.performance_metrics.customer_complaints}
            </Text>
          </View>
          <View style={styles.metricRow}>
            <Text style={styles.metricLabel}>التسليم في الوقت:</Text>
            <Text style={styles.metricValue}>
              {tierInfo.performance_metrics.on_time_delivery}%
            </Text>
          </View>
        </View>

        <View style={styles.benefitsCard}>
          <Text style={[styles.cardTitle, textAlignStart]}>المميزات</Text>
          {tierInfo.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <Text style={styles.benefitIcon}>✓</Text>
              <Text style={[styles.benefitText, textAlignStart]}>{benefit}</Text>
            </View>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            آخر تقييم:{' '}
            {new Date(tierInfo.last_evaluated).toLocaleString('ar-SA')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.evaluateButton}
          onPress={() =>
            navigation?.navigate('amn_captain_tier_evaluate', { captainId })
          }
          activeOpacity={0.8}
        >
          <Text style={styles.evaluateButtonText}>تقييم المستوى</Text>
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
  metricsCard: {
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
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  metricLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  metricValue: {
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

export default AutoAmnCaptainTierInfo;
