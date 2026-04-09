// Auto-generated screen for dsh_promo_apply
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// Contract: GET /api/dsh/external-orders/{externalOrderId}

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface auto_dsh_promo_applyProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { externalOrderId?: string } };
}

export const auto_dsh_promo_apply: React.FC<auto_dsh_promo_applyProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [externalOrderId, setExternalOrderId] = useState(
    () => route?.params?.externalOrderId ?? ''
  );
  const [loadState, setLoadState] = useState<ScreenState>('content');
  const [result, setResult] = useState<{
    success: boolean;
    message?: string;
    promoCode?: string | null;
    discount?: { type: string; value: number };
  } | null>(null);

  const load = useCallback(async () => {
    const id = (externalOrderId || (route?.params?.externalOrderId ?? '')).trim();
    if (!id) {
      setLoadState('error');
      return;
    }
    setLoadState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/external-orders/${encodeURIComponent(id)}`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Request failed');
      setResult(json?.data ?? null);
      setLoadState('content');
    } catch {
      setLoadState('error');
    }
  }, [externalOrderId, route?.params?.externalOrderId]);

  const handleRetry = () => {
    setLoadState('loading');
    void load();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (loadState === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_promo_apply.loadingMessage')}
        screenName="auto_dsh_promo_apply"
        operationName="dsh_promo_apply"
      />
    );
  }

  if (loadState === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_promo_apply.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_promo_apply"
        operationName="dsh_promo_apply"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تطبيق عرض / طلب خارجي</Text>
        <Text style={[styles.subtitle, textAlignStart]}>أدخل معرف الطلب الخارجي للاستعلام أو تطبيق العرض</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={externalOrderId}
          onChangeText={setExternalOrderId}
          placeholder={t('dsh.app-client.mobile.auto_dsh_promo_apply.orderIdPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => void load()}
          disabled={!externalOrderId.trim()}
        >
          <Text style={styles.primaryButtonText}>استعلام / تطبيق</Text>
        </TouchableOpacity>
        {result && (
          <View style={styles.result}>
            <Text style={[styles.resultMessage, textAlignStart]}>{result.message ?? t('dsh.app-client.mobile.auto_dsh_promo_apply.successMessage')}</Text>
            {result.promoCode != null && (
              <Text style={[styles.resultCode, textAlignStart]}>رمز: {result.promoCode}</Text>
            )}
            {result.discount != null && (
              <Text style={[styles.resultDiscount, textAlignStart]}>
                خصم: {result.discount.type} = {result.discount.value}
              </Text>
            )}
          </View>
        )}
        <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate('DshHome')}>
          <Text style={styles.backText}>العودة للرئيسية</Text>
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
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.lg,
  },
  resultMessage: {
    fontSize: 14,
    color: semanticRoles.onSurface,
  },
  resultCode: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: 4 },
  resultDiscount: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: 2 },
  backButton: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
});

export default auto_dsh_promo_apply;

