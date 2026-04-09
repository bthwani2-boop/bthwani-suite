// Auto-generated screen for dsh_subscription_family_get
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/subscriptions/family/{family_id}
// §30 States: Loading / Error / Content

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { family_id?: string } };
}

type FamilyData = { familyId?: string; name?: string; memberCount?: number; tier?: string; updatedAt?: string } | null;

export const auto_dsh_subscription_family_get: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [familyId, setFamilyId] = useState(() => (route?.params?.family_id != null ? route.params.family_id : ''));
  const [state, setState] = useState<ScreenState>('content');
  const [data, setData] = useState<FamilyData>(null);

  const fetchFamily = useCallback(async () => {
    const id = (familyId || (route?.params?.family_id != null ? route.params.family_id : '')).trim();
    if (!id) {
      setState('content');
      setData(null);
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/family/${encodeURIComponent(id)}`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب العائلة');
      setData(json?.data || null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [familyId, route?.params?.family_id]);

  useEffect(() => {
    const id = (route?.params?.family_id ?? '').trim();
    if (!id) return;
    setFamilyId(id);
    setState('loading');
    let cancelled = false;
    (async () => {
      try {
        const url = `${getBaseUrl()}/api/dsh/subscriptions/family/${encodeURIComponent(id)}`;
        const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!json?.success) throw new Error(json?.error || 'فشل في جلب العائلة');
        if (!cancelled) {
          setData(json?.data || null);
          setState('content');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    })();
    return () => { cancelled = true; };
  }, [route?.params?.family_id]);

  const handleRetry = () => {
    setState('content');
    void fetchFamily();
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_subscription_family_get.loadingMessage')} screenName="auto_dsh_subscription_family_get" operationName="dsh_subscription_family_get" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_subscription_family_get.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_subscription_family_get" operationName="dsh_subscription_family_get" />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>عائلة الاشتراك</Text>
        <Text style={[styles.subtitle, textAlignStart]}>معرف العائلة (family_id)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={familyId}
          onChangeText={setFamilyId}
          placeholder="default"
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void fetchFamily()} disabled={!familyId.trim()}>
          <Text style={styles.primaryButtonText}>عرض العائلة</Text>
        </TouchableOpacity>
        {data && (
          <View style={styles.card}>
            {data.name && <Text style={[styles.name, textAlignStart]}>{data.name}</Text>}
            <Text style={[styles.meta, textAlignStart]}>المعرف: {data.familyId}</Text>
            {data.memberCount != null && <Text style={[styles.meta, textAlignStart]}>عدد الأفراد: {data.memberCount}</Text>}
            {data.tier && <Text style={[styles.meta, textAlignStart]}>الباقة: {data.tier}</Text>}
          </View>
        )}
        {data?.familyId && (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshSubscriptionFamilyMembersGet', { family_id: data.familyId })}>
            <Text style={styles.secondaryButtonText}>عرض الأفراد</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshSubscriptionTierGet')}>
          <Text style={styles.secondaryButtonText}>باقات الاشتراك</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
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
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  card: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  name: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface, },
  meta: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
});

export default auto_dsh_subscription_family_get;

