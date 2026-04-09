
// Primary operationId: chat_message_create
/**
 * DSH Partner Order Chat Message Create — dsh_partner_order_chat_message_create. ScreenId: APP_CLIENT_DSH_PARTNER_ORDER_CHAT_MESSAGE_CREATE.
 * Implements Gate-UI-3 (States), Gate-UI-5 (Trace/Audit).
 * Uses partnerOrderChatMessageCreate from dsh-orders-api.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { partnerOrderChatMessageCreate } from '@bthwani/api-clients';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

// States for Gate-UI-3
type State = 'idle' | 'loading' | 'success' | 'error';

export function DshPartnerOrderChatMessageCreateScreen() {
  const { t } = useI18n();
  const navigation = useNavigation();
  const route = useRoute();
  const orderId = (route.params as { orderId?: string })?.orderId || '';

  const [state, setState] = useState<State>('idle');
  const [message, setMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [traceId, setTraceId] = useState<string>('');

  // Gate-UI-5: Trace ID generation
  const generateTraceId = () => `dsh_partner_order_chat_message_create_${Date.now()}_${(0).toString(36).substr(2, 9)}`;

  const sendMessage = async () => {
    if (!message.trim()) {
      Alert.alert(t('common.warning'), t('dsh.mobile.dsh.DshPartnerOrderChatMessageCreateScreen.pleaseWriteMessage'));
      return;
    }

    const requestTraceId = generateTraceId();
    setTraceId(requestTraceId);

    setState('loading');
    setErrorMessage('');

    try {
      const chatMessage = await partnerOrderChatMessageCreate(orderId, message);

      // Gate-UI-5: Audit success
      setTraceId(`msg_${(chatMessage as { id?: string } | null)?.id ?? 'unknown'}`);

      setState('success');
      Alert.alert(
        t('dsh.mobile.dsh.DshPartnerOrderChatMessageCreateScreen.successMessage'),
        t('dsh.mobile.dsh.DshPartnerOrderChatMessageCreateScreen.yourMessageWas'),
        [
          {
            text: t('dsh.mobile.dsh.DshPartnerOrderChatMessageCreateScreen.sendAnotherMessage'),
            onPress: () => {
              setMessage('');
              setState('idle');
            }
          },
          {
            text: t('dsh.mobile.dsh.DshPartnerOrderChatMessageCreateScreen.backToOrder'),
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error: any) {
      // Gate-UI-5: Audit error
      setErrorMessage(error.message || t('dsh.mobile.dsh.DshPartnerOrderChatMessageCreateScreen.errorSendMessage'));
      setState('error');
    }
  };

  const renderForm = () => (
    <KeyboardAvoidingView
      style={styles.form}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>إرسال رسالة للعميل</Text>
      <Text style={styles.orderIdText}>طلب رقم: {orderId}</Text>
      <Text style={styles.instruction}>
        اكتب رسالة للتواصل مع العميل حول الطلب
      </Text>

      <TextInput
        style={styles.messageInput}
        value={message}
        onChangeText={setMessage}
        placeholder={t('dsh.mobile.dsh.DshPartnerOrderChatMessageCreateScreen.writeYourMessage')}
        placeholderTextColor={colorTokens.neutral['400']}
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <Text style={styles.tips}>
        💡 نصائح للتواصل الفعال:
        {'\n'}• أخبر العميل بموعد الاستعداد
        {'\n'}• أجب على أسئلته بسرعة
        {'\n'}• كن ودوداً ومحترفاً
      </Text>

      {state === 'error' && (
        <Text style={styles.errorText}>{errorMessage}</Text>
      )}

      <TouchableOpacity
        style={[styles.sendButton, state === 'loading' && styles.disabledButton]}
        onPress={sendMessage}
        disabled={state === 'loading'}
      >
        {state === 'loading' ? (
          <ActivityIndicator color={BTHWANI_COLORS.surface}/>
        ) : (
          <Text style={styles.sendButtonText}>إرسال الرسالة</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>إلغاء</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );

  const renderLoading = () => (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colorTokens.success['500']} />
      <Text style={styles.loadingText}>جاري إرسال الرسالة...</Text>
      {traceId && (
        <Text style={styles.traceText}>Trace ID: {traceId}</Text>
      )}
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.center}>
      <View style={styles.successIcon}>
        <Text style={styles.successText}>📤</Text>
      </View>
      <Text style={styles.successTitle}>تم إرسال الرسالة بنجاح</Text>
      <Text style={styles.successMessage}>
        وصلت رسالتك للعميل وسيتم إشعاره بها
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.center}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorText}>⚠</Text>
      </View>
      <Text style={styles.errorTitle}>فشل في إرسال الرسالة</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={sendMessage}>
        <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
      </TouchableOpacity>
    </View>
  );

  if (!orderId) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>معرف الطلب مطلوب</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {state === 'idle' && renderForm()}
      {state === 'loading' && renderLoading()}
      {state === 'success' && renderSuccess()}
      {state === 'error' && renderError()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorTokens.neutral['50'],
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  form: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colorTokens.neutral['900'],
    textAlign: 'center',
    marginBottom: 8,
  },
  orderIdText: {
    fontSize: 16,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    marginBottom: 24,
  },
  instruction: {
    fontSize: 16,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  messageInput: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.gray300,
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: colorTokens.neutral['900'],
    height: 120,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  tips: {
    backgroundColor: colorTokens.primary['50'],
    padding: 12,
    borderRadius: 8,
    fontSize: 14,
    color: colorTokens.primary['700'],
    lineHeight: 20,
    marginBottom: 24,
  },
  errorText: {
    color: colorTokens.error['500'],
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16,
  },
  sendButton: {
    backgroundColor: colorTokens.success['500'],
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  disabledButton: {
    backgroundColor: BTHWANI_COLORS.primaryMuted,
  },
  sendButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 18,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: colorTokens.error['500'],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colorTokens.neutral['500'],
  },
  traceText: {
    marginTop: 8,
    fontSize: 12,
    color: colorTokens.neutral['400'],
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colorTokens.success['500'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successText: {
    fontSize: 40,
  },
  successTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['900'],
    marginBottom: 12,
  },
  successMessage: {
    fontSize: 16,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    lineHeight: 22,
  },
  errorIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colorTokens.error['500'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorTokens.neutral['900'],
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colorTokens.neutral['500'],
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colorTokens.error['500'],
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

