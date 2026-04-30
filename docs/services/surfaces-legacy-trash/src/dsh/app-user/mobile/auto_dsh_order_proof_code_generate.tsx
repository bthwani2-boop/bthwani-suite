// Auto-generated screen for dsh_order_proof_code_generate
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/orders/:order_id/proof/code
// §30 States: Loading / Error / Success / Content — أقل نقرات، مسار واضح

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Platform } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import QRCode from 'react-native-qrcode-svg';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { orderId?: string } };
}

export const auto_dsh_order_proof_code_generate: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [orderId, setOrderId] = useState(() => (route?.params?.orderId ?? ''));
  const [state, setState] = useState<ScreenState>('content');
  const [success, setSuccess] = useState(false);
  const [generatedCode, setGeneratedCode] = useState<string | null>(null);
  const [proofOrderId, setProofOrderId] = useState<string | null>(null);
  const [proofExpiresAt, setProofExpiresAt] = useState<string | null>(null);

  const submit = useCallback(async () => {
    const id = (orderId || (route?.params?.orderId ?? '')).trim();
    if (!id) {
      setState('error');
      return;
    }
    setState('loading');
    setGeneratedCode(null);
    setProofOrderId(null);
    setProofExpiresAt(null);
    try {
      const url = `${getBaseUrl()}/api/dsh/orders/${encodeURIComponent(id)}/proof/code`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Generate failed');
      const data = json?.data ?? {};
      setGeneratedCode(data.code ?? null);
      setProofOrderId(data.order_id ?? id);
      setProofExpiresAt(data.expiresAt ?? null);
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [orderId, route?.params?.orderId]);

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
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_order_proof_code_generate.loadingMessage')}
        screenName="auto_dsh_order_proof_code_generate"
        operationName="dsh_order_proof_code_generate"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_order_proof_code_generate.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_order_proof_code_generate"
        operationName="dsh_order_proof_code_generate"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>إنشاء رمز إثبات الاستلام</Text>
        <Text style={[styles.subtitle, textAlignStart]}>معرف الطلب (order_id)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={orderId}
          onChangeText={setOrderId}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_proof_code_generate.orderIdPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!orderId.trim()}>
          <Text style={styles.primaryButtonText}>إنشاء رمز</Text>
        </TouchableOpacity>
        {success && generatedCode && (
          <View style={styles.result}>
            <Text style={styles.resultLabel}>امسح بالكاميرا أو أدخل الرقم</Text>
            {Platform.OS !== 'web' && proofOrderId != null && (
              <View style={styles.qrWrap}>
                <QRCode
                  value={JSON.stringify({
                    order_id: proofOrderId,
                    code: generatedCode,
                    expiresAt: proofExpiresAt,
                  })}
                  size={160}
                  backgroundColor={semanticRoles.surface}
                  color={semanticRoles.onSurface}
                />
              </View>
            )}
            <Text style={styles.resultCode}>{generatedCode}</Text>
            <Text style={styles.resultHint}>أعطِ الرقم أو امسح QR للكابتن عند الاستلام</Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>عرض الطلبات</Text>
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
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  resultLabel: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.sm },
  qrWrap: { marginBottom: BTHWANI_SPACING.md, padding: BTHWANI_SPACING.sm, backgroundColor: semanticRoles.surface, borderRadius: BTHWANI_RADIUS.md, alignSelf: 'center' },
  resultCode: { fontSize: 28, fontWeight: '700', color: semanticRoles.onSurface, letterSpacing: 4 },
  resultHint: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm, textAlign: 'center' },
  secondaryButton: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
  },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_order_proof_code_generate;

