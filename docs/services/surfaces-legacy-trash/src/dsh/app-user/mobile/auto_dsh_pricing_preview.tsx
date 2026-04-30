// Auto-generated screen for dsh_pricing_preview
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/pricing/preview
// §30 States: Loading / Error / Empty / Success / Content — أقل نقرات، مسار واضح

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface PricingBreakdown {
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  discount: number;
  total: number;
}

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_dsh_pricing_preview: React.FC<Props> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const [pricing, setPricing] = useState<PricingBreakdown | null>(null);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [promoCode, setPromoCode] = useState('');

  const fetchPreview = useCallback(
    async (items: { itemId: string; quantity: number }[], address?: string, promo?: string) => {
      const url = `${getBaseUrl()}/api/dsh/pricing/preview`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.length ? items : [{ itemId: 'default', quantity: 1 }],
          deliveryAddress: address?.trim() || undefined,
          promoCode: promo?.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في المعاينة');
      setPricing(json?.data?.pricing ?? null);
    },
    [],
  );

  const load = useCallback(async () => {
    setState('loading');
    try {
      const cartUrl = `${getBaseUrl()}/api/dsh/cart`;
      const cartRes = await rawFetch(cartUrl, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      const cartJson = cartRes.ok ? await cartRes.json() : null;
      const rawItems = cartJson?.data?.items ?? [];
      const items = rawItems.map((it: { id?: string; quantity?: number }) => ({
        itemId: it?.id ?? 'item',
        quantity: Math.max(1, Number(it?.quantity) || 1),
      }));
      await fetchPreview(items, deliveryAddress || undefined, promoCode || undefined);
      setState('content');
    } catch {
      setState('error');
    }
  }, [deliveryAddress, promoCode, fetchPreview]);

  React.useEffect(() => {
    void load();
  }, []);

  const handleRetry = () => {
    setState('content');
    void load();
  };

  const handleUpdatePreview = () => {
    setState('loading');
    void load();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_pricing_preview.loadingMessage')}
        screenName="auto_dsh_pricing_preview"
        operationName="dsh_pricing_preview"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_pricing_preview.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_pricing_preview"
        operationName="dsh_pricing_preview"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>معاينة السعر</Text>
        <Text style={[styles.subtitle, textAlignStart]}>تكلفة الطلب قبل التأكيد</Text>

        <Text style={[styles.label, textAlignStart]}>عنوان التوصيل (اختياري)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={deliveryAddress}
          onChangeText={setDeliveryAddress}
          placeholder={t('dsh.app-client.mobile.auto_dsh_pricing_preview.addressPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={[styles.label, textAlignStart]}>كود الخصم (اختياري)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={promoCode}
          onChangeText={setPromoCode}
          placeholder={t('dsh.app-client.mobile.auto_dsh_pricing_preview.promoCodeLabel')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={handleUpdatePreview}>
          <Text style={styles.primaryButtonText}>{pricing ? t('dsh.app-client.mobile.auto_dsh_pricing_preview.updatePreviewButton') : t('dsh.app-client.mobile.auto_dsh_pricing_preview.calculatePreview')}</Text>
        </TouchableOpacity>

        {pricing && (
          <View style={styles.card}>
            <Row label={t('dsh.app-client.mobile.auto_dsh_pricing_preview.subtotalLabel')} value={pricing.subtotal} />
            <Row label={t('dsh.app-client.mobile.auto_dsh_pricing_preview.deliveryFeeLabel')} value={pricing.deliveryFee} />
            <Row label={t('dsh.app-client.mobile.auto_dsh_pricing_preview.serviceFeeLabel')} value={pricing.serviceFee} />
            <Row label={t('dsh.app-client.mobile.auto_dsh_pricing_preview.taxLabel')} value={pricing.tax} />
            {pricing.discount > 0 && <Row label={t('dsh.app-client.mobile.auto_dsh_pricing_preview.discountLabel')} value={-pricing.discount} />}
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>{t('dsh.app-client.mobile.auto_dsh_pricing_preview.totalLabel')}</Text>
              <Text style={styles.totalValue}>{pricing.total.toFixed(2)} {t('surfaces.currency_rial')}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigate('DshCartGet')}>
          <Text style={styles.linkButtonText}>{t('dsh.app-client.mobile.auto_dsh_pricing_preview.viewCart')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.linkButtonText}>{t('dsh.app-client.mobile.auto_dsh_pricing_preview.myOrders')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

function Row({ label, value }: { label: string; value: number }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value.toFixed(2)} ر.س</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.md },
  label: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.xs },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginVertical: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  card: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: BTHWANI_SPACING.xs },
  rowLabel: { fontSize: 14, color: semanticRoles.onSurfaceMuted },
  rowValue: { fontSize: 14, color: semanticRoles.onSurface },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: BTHWANI_SPACING.sm, paddingTop: BTHWANI_SPACING.sm, borderTopWidth: 1, borderTopColor: semanticRoles.outline },
  totalLabel: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
  totalValue: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
  linkButton: { padding: BTHWANI_SPACING.sm, alignItems: 'center', marginTop: BTHWANI_SPACING.xs },
  linkButtonText: { fontSize: 14, color: semanticRoles.primaryCTA },
});

export default auto_dsh_pricing_preview;

