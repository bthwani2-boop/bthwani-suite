// بثواني برو — عرض بيانات باقة/معرف (مصدر واحد: بثواني برو فقط؛ لا default/family كـ tier)
// Surface: app-client | Operation: GET /api/dsh/subscriptions/:tier
// §30 States: Loading / Error / Content

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

const TIER_PRO = 'pro';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { tier?: string } };
}

type TierData = { tier?: string; name?: string; benefits?: string[]; priceMonthly?: number; currency?: string; updatedAt?: string } | null;

export const auto_dsh_subscription_tier_get: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [tier, setTier] = useState(() => (route?.params?.tier != null ? route.params.tier : TIER_PRO));
  const [state, setState] = useState<ScreenState>('content');
  const [data, setData] = useState<TierData>(null);

  const fetchTier = useCallback(async () => {
    const id = ((tier || route?.params?.tier) ?? TIER_PRO).trim() || TIER_PRO;
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/${encodeURIComponent(id)}`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب الباقة');
      setData(json?.data || null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [tier, route?.params?.tier]);

  const handleRetry = () => {
    setState('content');
    void fetchTier();
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_subscription_tier_get.loadingMessage')} screenName="auto_dsh_subscription_tier_get" operationName="dsh_subscription_tier_get" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_subscription_tier_get.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_subscription_tier_get" operationName="dsh_subscription_tier_get" />
    );
  }

  const benefits = data?.benefits || [];

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>بثواني برو</Text>
        <Text style={[styles.subtitle, textAlignStart]}>معرف الباقة من الـ API (مثلاً: pro)</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={tier}
          onChangeText={setTier}
          placeholder={TIER_PRO}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void fetchTier()} disabled={!tier.trim()}>
          <Text style={styles.primaryButtonText}>عرض الباقة</Text>
        </TouchableOpacity>
        {data && (
          <View style={styles.card}>
            <Text style={[styles.name, textAlignStart]}>{data.name || t('dsh.app-client.mobile.auto_dsh_subscription_tier_get.tierName')}</Text>
            {data.priceMonthly != null && <Text style={[styles.price, textAlignStart]}>{data.priceMonthly} {data.currency || t('dsh.app-client.mobile.auto_dsh_subscription_tier_get.currencyLabel')} / شهر</Text>}
            {benefits.length > 0 && benefits.map((b, i) => <Text key={i} style={[styles.benefit, textAlignStart]}>• {b}</Text>)}
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshSubscriptionProCatalog')}>
          <Text style={styles.secondaryButtonText}>كتالوج بثواني برو</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>طلباتي</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.sm },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.lg,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  card: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  name: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
  price: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  benefit: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
});

export default auto_dsh_subscription_tier_get;

