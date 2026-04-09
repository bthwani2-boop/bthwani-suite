// Auto-generated screen for dsh_order_proof_verify
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/orders/:order_id/proof/verify
// §30 States: Loading / Error / Success / Content — أقل نقرات، مسار واضح

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

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { orderId?: string } };
}

export const auto_dsh_order_proof_verify: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [orderId, setOrderId] = useState(() => (route?.params?.orderId ?? ''));
  const [code, setCode] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [verified, setVerified] = useState<boolean | null>(null);

  const submit = useCallback(async () => {
    const id = (orderId || (route?.params?.orderId ?? '')).trim();
    if (!id) {
      setState('error');
      return;
    }
    setState('loading');
    setVerified(null);
    try {
      const url = `${getBaseUrl()}/api/dsh/orders/${encodeURIComponent(id)}/proof/verify`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim() }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Verify failed');
      setVerified(json?.data?.verified ?? false);
      setState('content');
    } catch {
      setState('error');
    }
  }, [orderId, route?.params?.orderId, code]);

  const handleRetry = () => {
    setState('content');
    void submit();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_order_proof_verify.loadingMessage')}
        screenName="auto_dsh_order_proof_verify"
        operationName="dsh_order_proof_verify"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_order_proof_verify.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_order_proof_verify"
        operationName="dsh_order_proof_verify"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_proof_verify.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_proof_verify.subtitleOrder')}</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={orderId}
          onChangeText={setOrderId}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_proof_verify.orderIdPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_proof_verify.subtitleCode')}</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={code}
          onChangeText={setCode}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_proof_verify.proofCodePlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          keyboardType="number-pad"
          maxLength={6}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!orderId.trim()}>
          <Text style={styles.primaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_proof_verify.primaryButtonText')}</Text>
        </TouchableOpacity>
        {verified !== null && (
          <View style={[styles.result, verified ? styles.resultSuccess : styles.resultFail]}>
            <Text style={[styles.resultText, textAlignStart]}>
              {verified ? t('dsh.app-client.mobile.auto_dsh_order_proof_verify.verifyButtonText') : 'الرمز غير صحيح أو منتهي'}
            </Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_proof_verify.secondaryButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.xs,
  },
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
  result: {
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  resultSuccess: { backgroundColor: semanticRoles.surface },
  resultFail: { backgroundColor: semanticRoles.surface, borderWidth: 1, borderColor: semanticRoles.outline },
  resultText: { fontSize: 14, color: semanticRoles.onSurface, },
  secondaryButton: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
  },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_order_proof_verify;

