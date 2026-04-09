
// Primary operationId: chat_read_ack
/**
 * DSH Partner Order Chat Read Ack — dsh_partner_order_chat_read_ack. ScreenId: APP_CLIENT_DSH_PARTNER_ORDER_CHAT_READ_ACK.
 * Implements Gate-UI-3 (States), Gate-UI-5 (Trace/Audit).
 * Uses partnerOrderChatReadAck from dsh-orders-api.
 */

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { partnerOrderChatReadAck } from '@bthwani/api-clients';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

// States for Gate-UI-3
type State = 'idle' | 'loading' | 'success' | 'error';

export function DshPartnerOrderChatReadAckScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const orderId = (route.params as { orderId?: string })?.orderId || '';

  const [state, setState] = useState<State>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [traceId, setTraceId] = useState<string>('');

  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);

  const generateTraceId = () => `dsh_partner_order_chat_read_ack_${Date.now()}_${(0).toString(36).substr(2, 9)}`;

  const markAsRead = async () => {
    const requestTraceId = generateTraceId();
    setTraceId(requestTraceId);

    setState('loading');
    setErrorMessage('');

    try {
      await partnerOrderChatReadAck(orderId);

      // Gate-UI-5: Audit success
      setState('success');
      Alert.alert(
        t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.successTitle'),
        t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.successMessage'),
        [
          {
            text: t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.backToChatText'),
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      setState('error');
      setErrorMessage(t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.errorMessage'));
    }
  };

  const renderContent = () => {
    switch (state) {
      case 'loading':
        return (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color={colorTokens.success['700']} />
            <Text style={styles.loadingText}>جاري تأكيد القراءة...</Text>
          </View>
        );

      case 'success':
        return (
          <View style={styles.centerContent}>
            <Text style={styles.successIcon}>✓</Text>
            <Text style={styles.successTitle}>{t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.successTitle')}</Text>
            <Text style={styles.successMessage}>
              {t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.successMessage')}
            </Text>
          </View>
        );

      case 'error':
        return (
          <View style={styles.centerContent}>
            <Text style={styles.errorIcon}>⚠️</Text>
            <Text style={styles.errorTitle}>{t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.errorTitle')}</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={markAsRead}
            >
              <Text style={styles.retryButtonText}>{t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.retryButtonText')}</Text>
            </TouchableOpacity>
          </View>
        );

      default:
        return (
          <View style={styles.centerContent}>
            <Text style={styles.title}>تأكيد قراءة الرسائل</Text>
            <Text style={styles.message}>
              هل تريد تأكيد قراءة جميع الرسائل في هذا الطلب؟
            </Text>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={markAsRead}
            >
              <Text style={styles.confirmButtonText}>تأكيد القراءة</Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, textAlignStart]}>{t('dsh.partner_chat_read_ack_title')}</Text>
        <Text style={[styles.traceId, textAlignStart]}>Trace ID: {traceId}</Text>
      </View>

      <View style={styles.content}>
        {renderContent()}
      </View>

      {state === 'idle' && (
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>{t('dsh.mobile.dsh.DshPartnerOrderChatReadAckScreen.cancelButtonText')}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.neutral['50'],
  },
  header: {
    padding: 20,
    backgroundColor: BTHWANI_COLORS.surface,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.success['700'],
  },
  traceId: {
    fontSize: 10,
    color: colorTokens.neutral['500'],
    marginTop: 5,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  centerContent: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorTokens.neutral['800'],
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: colorTokens.neutral['500'],
    marginBottom: 30,
    textAlign: 'center',
    lineHeight: 24,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colorTokens.neutral['500'],
  },
  successIcon: {
    fontSize: 48,
    color: colorTokens.success['500'],
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorTokens.success['500'],
    marginBottom: 10,
  },
  successMessage: {
    fontSize: 16,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    lineHeight: 24,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colorTokens.error['500'],
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 24,
  },
  confirmButton: {
    backgroundColor: colorTokens.success['700'],
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 8,
    elevation: 2,
  },
  confirmButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  retryButton: {
    backgroundColor: colorTokens.warning['500'],
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 6,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 14,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  cancelButton: {
    backgroundColor: colorTokens.error['500'],
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

