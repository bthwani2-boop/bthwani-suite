// Auto-generated screen for dsh_chat_read_ack
// Surface: app-client | Service: dsh
// Operation: POST /api/dsh/orders/{order_id}/chat/read-ack
// §30 States: Loading / Error / Success / Content

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
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { order_id?: string } };
}

export const auto_dsh_chat_read_ack: React.FC<Props> = ({ route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [orderId, setOrderId] = useState(() => (route?.params?.order_id ?? ''));
  const [state, setState] = useState<ScreenState>('content');
  const [lastAck, setLastAck] = useState<{ order_id: string } | null>(null);

  const submit = useCallback(async () => {
    const id = (orderId || (route?.params?.order_id ?? '')).trim();
    if (!id) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/orders/${encodeURIComponent(id)}/chat/read-ack`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          readTimestamp: new Date().toISOString(),
          messageIds: [],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Ack failed');
      setLastAck({ order_id: id });
      setState('content');
    } catch {
      setState('error');
    }
  }, [orderId, route?.params?.order_id]);

  const handleRetry = () => {
    setState('content');
    void submit();
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_chat_read_ack.loadingMessage')}
        screenName="auto_dsh_chat_read_ack"
        operationName="dsh_chat_read_ack"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_chat_read_ack.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_chat_read_ack"
        operationName="dsh_chat_read_ack"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تأكيد قراءة المحادثة</Text>
        <Text style={[styles.subtitle, textAlignStart]}>أكد قراءة رسائل المحادثة للطلب (order_id)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={orderId}
          onChangeText={setOrderId}
          placeholder={t('dsh.app-client.mobile.auto_dsh_chat_read_ack.orderIdPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!orderId.trim()}>
          <Text style={styles.primaryButtonText}>تأكيد القراءة</Text>
        </TouchableOpacity>
        {lastAck && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>تم تأكيد القراءة للطلب: {lastAck.order_id}</Text>
          </View>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.lg,
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
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  result: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  resultText: { fontSize: 14, color: semanticRoles.onSurface, },
});

export default auto_dsh_chat_read_ack;

