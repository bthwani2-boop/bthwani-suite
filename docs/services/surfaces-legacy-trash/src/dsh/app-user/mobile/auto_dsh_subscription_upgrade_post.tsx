// بثواني برو — ترقية الاشتراك (مصدر: كتالوج الفئات/الباقات)
// Surface: app-client | Operation: POST /api/dsh/subscriptions/upgrade
// §30 States: Loading / Error / Content — معلمات: bundleId, categoryId من الكتالوج؛ tier ثابت = pro

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

const TIER_PRO = 'pro';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { bundleId?: string; categoryId?: string; bundleName_ar?: string } };
}

export const auto_dsh_subscription_upgrade_post: React.FC<Props> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const params = route?.params ?? {};
  const bundleId = params.bundleId as string | undefined;
  const categoryId = params.categoryId as string | undefined;
  const bundleNameAr = (params.bundleName_ar as string) || t('dsh.app-client.mobile.auto_dsh_subscription_upgrade_post.tierNamePro');

  const [state, setState] = useState<ScreenState>('content');
  const [upgradedAt, setUpgradedAt] = useState<string | null>(null);

  const handleUpgrade = async () => {
    if (!bundleId || !categoryId) return;
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/upgrade`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tier: TIER_PRO,
          bundle_id: bundleId,
          category_id: categoryId,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في الترقية');
      setUpgradedAt(json?.data?.upgradedAt ?? new Date().toISOString());
      setState('content');
    } catch {
      setState('error');
    }
  };

  const handleRetry = () => {
    setState('content');
  };

  const handleNavigate = (screen: string, navParams?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, navParams);
    else if (onNavigate) onNavigate(screen, navParams);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_subscription_upgrade_post.loadingMessage')}
        screenName="auto_dsh_subscription_upgrade_post"
        operationName="dsh_subscription_upgrade_post"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_subscription_upgrade_post.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_subscription_upgrade_post"
        operationName="dsh_subscription_upgrade_post"
      />
    );
  }

  if (upgradedAt) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>تم تفعيل بثواني برو</Text>
          <Text style={[styles.subtitle, textAlignStart]}>الباقة: {bundleNameAr}</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleNavigate('DshSubscriptionProCatalog')}
          >
            <Text style={styles.primaryButtonText}>عرض الفئات والباقات</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => setUpgradedAt(null)}>
            <Text style={styles.secondaryButtonText}>اشتراك آخر</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  if (!bundleId || !categoryId) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>بثواني برو</Text>
          <Text style={[styles.subtitle, textAlignStart]}>اختر الباقة من الكتالوج ثم أعد المحاولة.</Text>
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => handleNavigate('DshSubscriptionProCatalog')}
          >
            <Text style={styles.primaryButtonText}>فتح كتالوج بثواني برو</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تفعيل بثواني برو</Text>
        <Text style={[styles.subtitle, textAlignStart]}>الباقة: {bundleNameAr}</Text>
        <TouchableOpacity style={styles.primaryButton} onPress={() => void handleUpgrade()}>
          <Text style={styles.primaryButtonText}>تأكيد الاشتراك</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => handleNavigate('DshSubscriptionProCatalog')}
        >
          <Text style={styles.secondaryButtonText}>تغيير الباقة</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
  },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_subscription_upgrade_post;

