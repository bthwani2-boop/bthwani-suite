// Auto-generated screen for dsh_pricing_snapshot_get
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/pricing/snapshots/{snapshot_id}
// §30 States: Loading / Error / Content

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { snapshot_id?: string } };
}

type SnapshotData = { snapshotId?: string; subtotal?: number; deliveryFee?: number; tax?: number; total?: number; currency?: string; capturedAt?: string } | null;

export const auto_dsh_pricing_snapshot_get: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const snapshotId = (route?.params?.snapshot_id ?? '').trim() || 'default';
  const [state, setState] = useState<ScreenState>('loading');
  const [data, setData] = useState<SnapshotData>(null);

  const fetchSnapshot = useCallback(async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/pricing/snapshots/${encodeURIComponent(snapshotId)}`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب اللقطة');
      setData(json?.data ?? null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [snapshotId]);

  useEffect(() => {
    void fetchSnapshot();
  }, [fetchSnapshot]);

  const handleRetry = () => void fetchSnapshot();

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_pricing_snapshot_get.loadingMessage')} screenName="auto_dsh_pricing_snapshot_get" operationName="dsh_pricing_snapshot_get" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_pricing_snapshot_get.errorLoadMessage')} onErrorAction={handleRetry} screenName="auto_dsh_pricing_snapshot_get" operationName="dsh_pricing_snapshot_get" />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>لقطة السعر</Text>
        <Text style={[styles.subtitle, textAlignStart]}>المعرف: {data?.snapshotId ?? snapshotId}</Text>
        {data && (
          <View style={styles.card}>
            {data.subtotal != null && <Text style={[styles.row, textAlignStart]}>المجموع الفرعي: {data.subtotal} {data.currency ?? 'SAR'}</Text>}
            {data.deliveryFee != null && <Text style={[styles.row, textAlignStart]}>التوصيل: {data.deliveryFee} {data.currency ?? 'SAR'}</Text>}
            {data.tax != null && <Text style={[styles.row, textAlignStart]}>الضريبة: {data.tax} {data.currency ?? 'SAR'}</Text>}
            {data.total != null && <Text style={[styles.total, textAlignStart]}>الإجمالي: {data.total} {data.currency ?? 'SAR'}</Text>}
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshCartGet')}>
          <Text style={styles.secondaryButtonText}>السلة</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.md },
  card: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.md },
  row: { fontSize: 14, color: semanticRoles.onSurface, marginTop: BTHWANI_SPACING.xs },
  total: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface, marginTop: BTHWANI_SPACING.sm },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_pricing_snapshot_get;

