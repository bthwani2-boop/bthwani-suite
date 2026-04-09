/**
 * DSH Partner Subscription — dsh_partner_subscription_get / analytics / upgrade
 * Surface: app-partner | Service: dsh
 * Operations: /dsh/partner/subscription* via @bthwani/api-clients
 *
 * §UX-SUPREME-001: One screen, minimal clicks — عرض الاشتراك، التحليلات، الترقية
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import {
  getDshPartnerSubscription,
  getDshPartnerSubscriptionAnalytics,
  upgradeDshPartnerSubscription,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface SubscriptionData {
  tier?: string;
  expiresAt?: string;
  features?: string[];
}

interface AnalyticsData {
  ordersCount?: number;
  revenue?: number;
  period?: string;
}

export const AutoDshPartnerSubscription: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadSubscription = useCallback(async (showRefresh = false) => {
    try {
      if (showRefresh) setIsRefreshing(true); else setIsLoading(true);
      setError(null);
      const data = await getDshPartnerSubscription();
      if (!data) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorLoadSubscription'));
      }
      setSubscription(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorLoadSubscription'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => { loadSubscription(); }, [loadSubscription]);

  const loadAnalytics = useCallback(async () => {
    try {
      setIsLoadingAnalytics(true);
      setError(null);
      const data = await getDshPartnerSubscriptionAnalytics();
      if (!data) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorLoadAnalytics'));
      }
      setAnalytics(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorLoadAnalytics'));
    } finally {
      setIsLoadingAnalytics(false);
    }
  }, []);

  const handleUpgrade = useCallback(async () => {
    Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_subscription.confirmUpgradeTitle'), t('dsh.app-partner.mobile.auto_dsh_partner_subscription.confirmUpgradeTitle'), [
      { text: t('dsh.app-partner.mobile.auto_dsh_partner_subscription.cancelButton'), style: 'cancel' },
      {
        text: t('dsh.app-partner.mobile.auto_dsh_partner_subscription.upgradeConfirmButton'),
        onPress: async () => {
          try {
            setIsUpgrading(true);
            setError(null);
            const ok = await upgradeDshPartnerSubscription('premium');
            if (!ok) {
              throw new Error('فشل في الترقية');
            }
            setSubscription((prev) => (prev ? { ...prev, tier: 'premium' } : { tier: 'premium' }));
            Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_subscription.successUpgradeTitle'), t('dsh.app-partner.mobile.auto_dsh_partner_subscription.successUpgradeTitle'), [{ text: t('common.ok') }]);
          } catch (err) {
            setError(err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorUpgradeMessage'));
            Alert.alert(t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorUpgradeTitle'), err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorUpgradeTitle'));
          } finally {
            setIsUpgrading(false);
          }
        },
      },
    ]);
  }, []);

  const getState = (): 'loading' | 'error' | 'content' => {
    if (isLoading && !isRefreshing) return 'loading';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_subscription.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_subscription.errorActionText')}
      onErrorAction={() => loadSubscription()}
      screenName="auto_dsh_partner_subscription"
      operationName="dsh_partner_subscription_get"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadSubscription(true)} />}
      >
        {subscription && (
          <View style={styles.card}>
            <Text style={[styles.title, textAlignStart]}>الاشتراك</Text>
            <Text style={[styles.tier, textAlignStart]}>المستوى: {subscription.tier ?? '—'}</Text>
            {subscription.expiresAt && (
              <Text style={[styles.muted, textAlignStart]}>ينتهي: {new Date(subscription.expiresAt).toLocaleDateString('ar-SA')}</Text>
            )}
            {Array.isArray(subscription.features) && subscription.features.length > 0 && (
              <Text style={[styles.muted, textAlignStart]}>المميزات: {subscription.features.join(t('dsh.app-partner.mobile.auto_dsh_partner_subscription.featuresSeparator'))}</Text>
            )}
          </View>
        )}

        <TouchableOpacity
          style={styles.primaryButton}
          onPress={loadAnalytics}
          disabled={isLoadingAnalytics}
        >
          <Text style={styles.primaryButtonText}>
            {isLoadingAnalytics ? t('dsh.app-partner.mobile.auto_dsh_partner_subscription.viewAnalyticsButton') : t('dsh.app-partner.mobile.auto_dsh_partner_subscription.viewAnalyticsButton')}
          </Text>
        </TouchableOpacity>

        {analytics && (
          <View style={styles.card}>
            <Text style={[styles.title, textAlignStart]}>التحليلات</Text>
            <Text style={[styles.muted, textAlignStart]}>الفترة: {analytics.period ?? '—'}</Text>
            <Text style={[styles.tier, textAlignStart]}>عدد الطلبات: {analytics.ordersCount ?? 0}</Text>
            <Text style={[styles.tier, textAlignStart]}>الإيرادات: {analytics.revenue ?? 0} ر.س</Text>
          </View>
        )}

        <TouchableOpacity
          style={[styles.upgradeButton, isUpgrading && styles.buttonDisabled]}
          onPress={handleUpgrade}
          disabled={isUpgrading}
        >
          <Text style={styles.upgradeButtonText}>{isUpgrading ? t('dsh.app-partner.mobile.auto_dsh_partner_subscription.upgradeButtonText') : t('dsh.app-partner.mobile.auto_dsh_partner_subscription.upgradeButtonText')}</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: { fontSize: 18, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.sm, },
  tier: { fontSize: 16, color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.xs, },
  muted: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.xs, },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontSize: 16, fontWeight: '600' },
  upgradeButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA,
  },
  upgradeButtonText: { color: semanticRoles.primaryCTA, fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
});

export default AutoDshPartnerSubscription;

