// Auto-generated screen for dsh_captain_chat_send
// Surface: app-captain | Service: dsh
// Operation: POST /api/dsh/captain/orders/{order_id}/chat/messages
// Description: Send chat message (Captain) - Required for order communication

import React, { useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { sendDshCaptainChatMessage } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface AutoDshCaptainChatSendProps {
  navigation?: any;
  route?: {
    params?: {
      orderId: string;
    };
  };
}

export const AutoDshCaptainChatSend: React.FC<AutoDshCaptainChatSendProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const orderId = route?.params?.orderId || '';

  const handleSend = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    try {
      const ok = await sendDshCaptainChatMessage(orderId, message.trim());
      if (!ok) throw new Error('فشل في الإرسال');
      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.alertTitle'),
        t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.alertMessage'),
        [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.alertButtonText'), onPress: () => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home')) }]
      );
      setMessage('');
    } catch (error) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.errorTitle'), t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.errorTitle'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ScreenWrapper state="content">
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={100}
      >
        <View style={styles.content}>
          {orderId && (
            <View style={styles.infoCard}>
              <Text style={styles.infoLabel}>رقم الطلب:</Text>
              <Text style={styles.infoValue}>{orderId}</Text>
            </View>
          )}

          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, textAlignStart]}
              placeholder={t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.placeholderMessage')}
              placeholderTextColor={semanticRoles.textMuted}
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, textAlignStart]}>
              {message.length} / 500
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.sendButton, (!message.trim() || isSending) && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim() || isSending}
            activeOpacity={0.8}
          >
            <Text style={styles.sendButtonText}>
              {isSending ? t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.sendButtonLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_chat_send.sendButtonLabel')}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  content: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
  },
  infoCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  inputContainer: {
    flex: 1,
    marginBottom: BTHWANI_SPACING.md,
  },
  input: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    minHeight: 120,
  },
  charCount: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  sendButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainChatSend;

