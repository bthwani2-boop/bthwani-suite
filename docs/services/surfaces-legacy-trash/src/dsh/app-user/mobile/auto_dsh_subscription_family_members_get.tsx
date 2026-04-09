// Auto-generated screen for dsh_subscription_family_members_get
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/subscriptions/family/{family_id}/members
// §30 States: Loading / Error / Empty / Content

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { family_id?: string } };
}

type Member = { memberId?: string; email?: string; name?: string; role?: string };
type MembersData = { familyId?: string; members?: Member[]; updatedAt?: string } | null;

export const auto_dsh_subscription_family_members_get: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const familyId = (route?.params?.family_id ?? '').trim() || 'default';
  const [state, setState] = useState<ScreenState>('loading');
  const [data, setData] = useState<MembersData>(null);

  const fetchMembers = useCallback(async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/family/${encodeURIComponent(familyId)}/members`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب الأفراد');
      setData(json?.data || null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [familyId]);

  useEffect(() => {
    void fetchMembers();
  }, [fetchMembers]);

  const handleRetry = () => {
    void fetchMembers();
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_subscription_family_members_get.loadingMessage')} screenName="auto_dsh_subscription_family_members_get" operationName="dsh_subscription_family_members_get" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_subscription_family_members_get.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_subscription_family_members_get" operationName="dsh_subscription_family_members_get" />
    );
  }

  const members = data?.members ?? [];
  const isEmpty = members.length === 0;

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>أفراد العائلة</Text>
        <Text style={[styles.subtitle, textAlignStart]}>العائلة: {data?.familyId ?? familyId}</Text>
        {isEmpty ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>لا يوجد أفراد مسجّلون. أضف فرداً من الشاشة التالية.</Text>
          </View>
        ) : (
          <FlatList
            data={members}
            keyExtractor={(item) => item.memberId ?? String(0)}
            renderItem={({ item }) => (
              <View style={styles.card}>
                <Text style={[styles.name, textAlignStart]}>{item.name || item.email || '—'}</Text>
                {item.email ? <Text style={[styles.meta, textAlignStart]}>{item.email}</Text> : null}
                {item.role ? <Text style={[styles.meta, textAlignStart]}>الدور: {item.role}</Text> : null}
              </View>
            )}
            style={styles.list}
          />
        )}
        <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('DshSubscriptionFamilyMembersPost', { family_id: familyId })}>
          <Text style={styles.primaryButtonText}>إضافة فرد</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshSubscriptionFamilyGet', { family_id: familyId })}>
          <Text style={styles.secondaryButtonText}>تفاصيل العائلة</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.md },
  list: { flex: 1, marginBottom: BTHWANI_SPACING.md },
  card: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  name: { fontSize: 16, fontWeight: '600', color: semanticRoles.onSurface, },
  meta: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
  emptyCard: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.contentH, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.md },
  emptyText: { fontSize: 14, color: semanticRoles.onSurfaceMuted, textAlign: 'center' },
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
});

export default auto_dsh_subscription_family_members_get;

