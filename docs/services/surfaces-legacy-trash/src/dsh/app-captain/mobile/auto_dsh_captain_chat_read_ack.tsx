// Auto-generated screen for dsh_captain_chat_read_ack
// Surface: app-captain | Service: dsh
// Operation: POST /api/dsh/captain/orders/{order_id}/chat/read-ack
// Description: Acknowledge chat read (Captain) - Required for read receipts

import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { ackDshCaptainChatMessage } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface AutoDshCaptainChatReadAckProps {
  navigation?: any;
  route?: {
    params?: {
      orderId: string;
      messageId?: string;
    };
  };
}

export const AutoDshCaptainChatReadAck: React.FC<AutoDshCaptainChatReadAckProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [isProcessing, setIsProcessing] = useState(false);
  const orderId = route?.params?.orderId || '';

  const handleAcknowledge = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const success = await ackDshCaptainChatMessage(orderId);
      if (!success) throw new Error(t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.confirmFail'));
      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.doneLabel'),
        t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.successMessage'),
        [{ text: t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.okButton'), onPress: () => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home')) }]
      );
    } catch (error) {
      Alert.alert(t('common.error'), t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.readAckError'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={[styles.title, textAlignStart]}>{t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            {t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.subtitle')}
          </Text>
          
          {orderId && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.orderIdLabel')}</Text>
              <Text style={styles.infoValue}>{orderId}</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.button, isProcessing && styles.buttonDisabled]}
            onPress={handleAcknowledge}
            disabled={isProcessing}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>
              {isProcessing ? t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.loadingMessage') : t('dsh.app-captain.mobile.auto_dsh_captain_chat_read_ack.confirmRead')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
    padding: BTHWANI_SPACING.md,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.lg,
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
  button: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoDshCaptainChatReadAck;

