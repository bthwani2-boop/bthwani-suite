// Auto-generated screen for dsh_estimate_get
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/estimates/:estimateId
// §30 States: Loading / Error / Empty / Content — أقل نقرات، مسار واضح

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

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { estimateId?: string } };
}

export const auto_dsh_estimate_get: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [estimateId, setEstimateId] = useState(() => route?.params?.estimateId ?? '');
  const [state, setState] = useState<ScreenState>('content');
  const [data, setData] = useState<{
    estimateId: string;
    status: string;
    restaurantName?: string;
    pricing?: { subtotal?: number; deliveryFee?: number; tax?: number; total?: number };
    expiresAt?: string;
  } | null>(null);

  const fetchEstimate = useCallback(async () => {
    const id = (estimateId || route?.params?.estimateId || '').trim();
    if (!id) {
      setState('content');
      setData(null);
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/estimates/${encodeURIComponent(id)}`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في تحميل التقدير');
      setData(json?.data ?? null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [estimateId, route?.params?.estimateId]);

  const handleRetry = () => {
    setState('content');
    void fetchEstimate();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_estimate_get.loadingMessage')}
        screenName="auto_dsh_estimate_get"
        operationName="dsh_estimate_get"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_estimate_get.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_estimate_get"
        operationName="dsh_estimate_get"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_estimate_get.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_estimate_get.subtitle')}</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={estimateId}
          onChangeText={setEstimateId}
          placeholder="est_123..."
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void fetchEstimate()} disabled={!estimateId.trim()}>
          <Text style={styles.primaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_estimate_get.primaryButtonText')}</Text>
        </TouchableOpacity>

        {data && (
          <View style={styles.card}>
            <Text style={[styles.cardTitle, textAlignStart]}>{data.restaurantName ?? '—'}</Text>
            <Text style={[styles.meta, textAlignStart]}>الحالة: {data.status}</Text>
            {data.expiresAt && <Text style={[styles.meta, textAlignStart]}>ينتهي: {new Date(data.expiresAt).toLocaleString('ar-SA')}</Text>}
            {data.pricing && (
              <View style={styles.pricing}>
                <Row label={t('dsh.app-client.mobile.auto_dsh_estimate_get.labelSubtotal')} value={data.pricing.subtotal} />
                <Row label={t('dsh.app-client.mobile.auto_dsh_estimate_get.labelDeliveryFee')} value={data.pricing.deliveryFee} />
                <Row label={t('dsh.app-client.mobile.auto_dsh_estimate_get.labelTax')} value={data.pricing.tax} />
                <View style={styles.totalRow}>
                  <Text style={[styles.totalLabel, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_estimate_get.totalLabel')}</Text>
                  <Text style={[styles.totalValue, textAlignStart]}>{Number(data.pricing.total).toFixed(2)} ر.س</Text>
                </View>
              </View>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshEstimateCreate')}>
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_estimate_get.secondaryButtonNew')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_estimate_get.secondaryButtonOrders')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

function Row({ label, value }: { label: string; value?: number }) {
  if (value == null) return null;
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value.toFixed(2)} ر.س</Text>
    </View>
  );
}

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
  secondaryButton: { padding: BTHWANI_SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md, marginTop: BTHWANI_SPACING.xs },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  card: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.md },
  cardTitle: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
  meta: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  pricing: { marginTop: BTHWANI_SPACING.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: BTHWANI_SPACING.xs },
  rowLabel: { fontSize: 14, color: semanticRoles.onSurfaceMuted },
  rowValue: { fontSize: 14, color: semanticRoles.onSurface },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: BTHWANI_SPACING.sm, paddingTop: BTHWANI_SPACING.sm, borderTopWidth: 1, borderTopColor: semanticRoles.outline },
  totalLabel: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
  totalValue: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface },
});

export default auto_dsh_estimate_get;

