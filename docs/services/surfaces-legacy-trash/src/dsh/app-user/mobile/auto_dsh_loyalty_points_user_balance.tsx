// Auto-generated screen for dsh_loyalty_points_user_balance
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/loyalty/points/user/:user_id/balance
// §30 States: Loading / Error / Content — لا خلط ?? مع ||

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
  route?: { params?: { user_id?: string } };
}

type BalanceData = { userId?: string; balance?: number; currency?: string; updatedAt?: string } | null;

export const auto_dsh_loyalty_points_user_balance: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [userId, setUserId] = useState(() => (route?.params?.user_id != null ? route.params.user_id : ''));
  const [state, setState] = useState<ScreenState>('content');
  const [balance, setBalance] = useState<BalanceData>(null);

  const fetchBalance = useCallback(async () => {
    const id = (userId || (route?.params?.user_id != null ? route.params.user_id : '')).trim();
    if (!id) {
      setState('content');
      setBalance(null);
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/loyalty/points/user/${encodeURIComponent(id)}/balance`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || t('dsh.app-client.mobile.auto_dsh_loyalty_points_user_balance.fetchError'));
      setBalance(json?.data || null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [userId, route?.params?.user_id, t]);

  const handleRetry = () => {
    setState('content');
    void fetchBalance();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_loyalty_points_user_balance.loadingMessage')} screenName="auto_dsh_loyalty_points_user_balance" operationName="dsh_loyalty_points_user_balance" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_loyalty_points_user_balance.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_loyalty_points_user_balance" operationName="dsh_loyalty_points_user_balance" />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>رصيد نقاط الولاء</Text>
        <Text style={[styles.subtitle, textAlignStart]}>معرف المستخدم (user_id)</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={userId}
          onChangeText={setUserId}
          placeholder="user_123..."
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void fetchBalance()} disabled={!userId.trim()}>
          <Text style={styles.primaryButtonText}>عرض الرصيد</Text>
        </TouchableOpacity>
        {balance && (
          <View style={styles.card}>
            {balance.balance != null && <Text style={styles.balanceText}>{balance.balance} نقطة</Text>}
            {balance.currency && <Text style={styles.sub}>{balance.currency}</Text>}
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshLoyaltyPointsUserHistory')}>
          <Text style={styles.secondaryButtonText}>سجل النقاط</Text>
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
  balanceText: { fontSize: 20, fontWeight: '600', color: semanticRoles.onSurface },
  sub: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
});

export default auto_dsh_loyalty_points_user_balance;

