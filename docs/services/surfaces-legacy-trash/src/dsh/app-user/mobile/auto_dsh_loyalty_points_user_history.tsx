// Auto-generated screen for dsh_loyalty_points_user_history
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/loyalty/points/user/:user_id/history
// §30 States: Loading / Error / Content — لا خلط ?? مع ||

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

interface HistoryItem {
  transactionId?: string;
  type?: string;
  points?: number;
  description?: string;
  createdAt?: string;
}

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { user_id?: string } };
}

type HistoryData = { userId?: string; items?: HistoryItem[]; limit?: number; offset?: number; total?: number } | null;

export const auto_dsh_loyalty_points_user_history: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [userId, setUserId] = useState(() => (route?.params?.user_id != null ? route.params.user_id : ''));
  const [state, setState] = useState<ScreenState>('content');
  const [history, setHistory] = useState<HistoryData>(null);

  const fetchHistory = useCallback(async () => {
    const id = (userId || (route?.params?.user_id != null ? route.params.user_id : '')).trim();
    if (!id) {
      setState('content');
      setHistory(null);
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/loyalty/points/user/${encodeURIComponent(id)}/history`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب السجل');
      setHistory(json?.data || null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [userId, route?.params?.user_id]);

  const handleRetry = () => {
    setState('content');
    void fetchHistory();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_loyalty_points_user_history.loadingMessage')} screenName="auto_dsh_loyalty_points_user_history" operationName="dsh_loyalty_points_user_history" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_loyalty_points_user_history.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_loyalty_points_user_history" operationName="dsh_loyalty_points_user_history" />
    );
  }

  const items = history?.items || [];

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>سجل نقاط الولاء</Text>
        <Text style={[styles.subtitle, textAlignStart]}>معرف المستخدم (user_id)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={userId}
          onChangeText={setUserId}
          placeholder="user_123..."
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void fetchHistory()} disabled={!userId.trim()}>
          <Text style={styles.primaryButtonText}>عرض السجل</Text>
        </TouchableOpacity>
        {items.length > 0 && (
          <View style={styles.list}>
            {items.map((item, i) => (
              <View key={item.transactionId || i} style={styles.row}>
                <Text style={[styles.rowPoints, textAlignStart]}>{item.points != null ? (item.points >= 0 ? `+${item.points}` : item.points) : '—'} نقطة</Text>
                <Text style={[styles.rowDesc, textAlignStart]}>{item.description || item.type || '—'}</Text>
              </View>
            ))}
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshLoyaltyPointsUserBalance')}>
          <Text style={styles.secondaryButtonText}>رصيد النقاط</Text>
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
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  list: { marginBottom: BTHWANI_SPACING.lg },
  row: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.xs },
  rowPoints: { fontSize: 14, fontWeight: '600', color: semanticRoles.onSurface, },
  rowDesc: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
});

export default auto_dsh_loyalty_points_user_history;

