// Auto-generated screen for dsh_partner_chat_read_ack
// Surface: app-partner | Service: dsh
// Operation: POST /api/dsh/partner/orders/{order_id}/chat/read-ack
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
import { ackDshPartnerChatMessage } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface Props {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { order_id?: string } };
}

export const AutoDshPartnerChatReadAck: React.FC<Props> = ({ route }) => {
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
      const success = await ackDshPartnerChatMessage(id);
      if (!success) throw new Error('Ack failed');
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
        loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_chat_read_ack.loadingMessage')}
        screenName="dsh_partner_chat_read_ack"
        operationName="dsh_partner_chat_read_ack"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_chat_read_ack.errorMessage')}
        onErrorAction={handleRetry}
        screenName="dsh_partner_chat_read_ack"
        operationName="dsh_partner_chat_read_ack"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تأكيد قراءة المحادثة (شريك)</Text>
        <Text style={[styles.subtitle, textAlignStart]}>أكد قراءة رسائل المحادثة للطلب (order_id)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={orderId}
          onChangeText={setOrderId}
          placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_chat_read_ack.orderIdPlaceholder')}
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

export default AutoDshPartnerChatReadAck;

