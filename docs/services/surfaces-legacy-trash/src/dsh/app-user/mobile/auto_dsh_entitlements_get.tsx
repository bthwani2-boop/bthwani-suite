// Auto-generated screen for dsh_entitlements_get
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface auto_dsh_entitlements_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

export const auto_dsh_entitlements_get: React.FC<auto_dsh_entitlements_getProps> = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const [entitlements, setEntitlements] = useState<unknown[]>([]);
  const load = useCallback(async () => {
    try {
      const url = `${getBaseUrl()}/api/dsh/entitlements`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Failed to load');
      setEntitlements(json?.data?.entitlements ?? []);
      setState('content');
    } catch {
      setState('error');
    }
  }, []);
  useEffect(() => { void load(); }, [load]);
  const handleRetry = () => { setState('loading'); void load(); };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>الاستحقاقات</Text>
          <Text style={[styles.subtitle, textAlignStart]}>عرض الاستحقاقات والمزايا{entitlements.length > 0 ? ` (${entitlements.length})` : ''}</Text>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper state={state} loadingMessage={t('dsh.app-client.mobile.auto_dsh_entitlements_get.loadingMessage')} errorMessage={t('dsh.app-client.mobile.auto_dsh_entitlements_get.loadError')} onErrorAction={handleRetry} screenName="auto_dsh_entitlements_get" operationName="dsh_entitlements_get" />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: BTHWANI_COLORS.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.onSurface, },
  subtitle: { fontSize: 14, color: BTHWANI_COLORS.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
});

export default auto_dsh_entitlements_get;

