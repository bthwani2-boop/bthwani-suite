// DSH Partner Chat Send — dsh_partner_chat_send
// Surface: app-partner | Service: dsh
// Operation: POST /api/dsh/partner/orders/{order_id}/chat/messages
// §30 States: Loading / Error / Success / Content

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { sendDshPartnerChatMessage } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface Props {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { order_id?: string } };
}

export const AutoDshPartnerChatSend: React.FC<Props> = ({ route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [orderId, setOrderId] = useState(() => (route?.params?.order_id ?? ''));
  const [message, setMessage] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [sending, setSending] = useState(false);
  const [lastSent, setLastSent] = useState<{ messageId?: string } | null>(null);

  const submit = useCallback(async () => {
    const id = (orderId || (route?.params?.order_id ?? '')).trim();
    const text = message.trim();
    if (!id || !text) {
      setState('error');
      return;
    }
    setSending(true);
    setState('loading');
    try {
      const ok = await sendDshPartnerChatMessage(id, text);
      if (!ok) throw new Error('Send failed');
      setLastSent({});
      setMessage('');
      setState('content');
    } catch {
      setState('error');
    } finally {
      setSending(false);
    }
  }, [orderId, message, route?.params?.order_id]);

  const handleRetry = () => {
    setState('content');
  };

  if (state === 'loading' && sending) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_chat_send.loadingMessage')}
        screenName="dsh_partner_chat_send"
        operationName="dsh_partner_chat_send"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_chat_send.errorMessage')}
        onErrorAction={handleRetry}
        screenName="dsh_partner_chat_send"
        operationName="dsh_partner_chat_send"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_chat_send.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_chat_send.subtitle')}</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={orderId}
          onChangeText={setOrderId}
          placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_chat_send.orderIdPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TextInput
          style={[styles.input, textAlignStart, styles.messageInput]}
          value={message}
          onChangeText={setMessage}
          placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_chat_send.messagePlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          multiline
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => void submit()}
          disabled={!orderId.trim() || !message.trim() || sending}
        >
          <Text style={styles.primaryButtonText}>إرسال</Text>
        </TouchableOpacity>
        {lastSent && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_chat_send.resultText')}</Text>
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
  messageInput: {
    minHeight: 80,
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

export default AutoDshPartnerChatSend;

