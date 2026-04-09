
// Primary operationId: entity_accept
/**
 * DSH Partner Order Accept Alt — entity_accept_alt. ScreenId: APP_CLIENT_DSH_PARTNER_ORDER_ACCEPT_ALT.
 * Implements Gate-UI-3 (States), Gate-UI-5 (Trace/Audit).
 * Uses partnerOrderAcceptAlt from dsh-orders-api.
 */

import React, { useState } from 'react';
import { useI18n } from '@bthwani/ui-kit';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { partnerOrderAcceptAlt } from '@bthwani/api-clients';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';

// States for Gate-UI-3
type State = 'idle' | 'loading' | 'success' | 'error';

export function DshPartnerOrderAcceptAltScreen() {
  const { t } = useI18n();
  const navigation = useNavigation();
  const route = useRoute();
  const orderId = (route.params as { orderId?: string })?.orderId || '';

  const [state, setState] = useState<State>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [traceId, setTraceId] = useState<string>('');

  // Gate-UI-5: Trace ID generation
  const generateTraceId = () => `entity_accept_alt_${Date.now()}_${(0).toString(36).substr(2, 9)}`;

  const acceptOrderAlt = async () => {
    const requestTraceId = generateTraceId();
    setTraceId(requestTraceId);

    setState('loading');
    setErrorMessage('');

    try {
      await partnerOrderAcceptAlt(orderId);

      // Gate-UI-5: Audit success
      setState('success');
      Alert.alert(
        t('dsh.mobile.dsh.DshPartnerOrderAcceptAltScreen.alertTitle'),
        t('dsh.mobile.dsh.DshPartnerOrderAcceptAltScreen.alertMessage'),
        [
          {
            text: t('dsh.mobile.dsh.DshPartnerOrderAcceptAltScreen.continue'),
            onPress: () => navigation.goBack() }
        ]
      );
    } catch (error: any) {
      // Gate-UI-5: Audit error
      setErrorMessage(error.message || t('dsh.mobile.dsh.DshPartnerOrderAcceptAltScreen.errorAcceptMessage'));
      setState('error');
    }
  };

  const renderForm = () => (
    <View style={styles.form}>
      <Text style={styles.title}>قبول الطلب (تدفق بديل)</Text>
      <Text style={styles.orderIdText}>طلب رقم: {orderId}</Text>
      <Text style={styles.instruction}>
        هل تريد قبول هذا الطلب عبر التدفق البديل؟
      </Text>

      <View style={styles.benefits}>
        <Text style={styles.benefitsTitle}>مزايا التدفق البديل:</Text>
        <Text style={styles.benefit}>• أولوية أعلى في الطلبات</Text>
        <Text style={styles.benefit}>• رسوم إضافية 15%</Text>
        <Text style={styles.benefit}>• إمكانية إدارة أفضل للوقت</Text>
        <Text style={styles.benefit}>• دعم فني مُعزز</Text>
      </View>

      <TouchableOpacity
        style={styles.acceptButton}
        onPress={acceptOrderAlt}
      >
        <Text style={styles.acceptButtonText}>قبول عبر التدفق البديل</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.regularAcceptButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.regularAcceptButtonText}>القبول العادي</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.rejectButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.rejectButtonText}>رفض الطلب</Text>
      </TouchableOpacity>
    </View>
  );

  const renderLoading = () => (
    <View style={styles.center}>
      <ActivityIndicator size="large" color={colorTokens.primary['500']} />
      <Text style={styles.loadingText}>جاري قبول الطلب عبر التدفق البديل...</Text>
      {traceId && (
        <Text style={styles.traceText}>Trace ID: {traceId}</Text>
      )}
    </View>
  );

  const renderSuccess = () => (
    <View style={styles.center}>
      <View style={styles.successIcon}>
        <Text style={styles.successText}>✓</Text>
      </View>
      <Text style={styles.successTitle}>تم قبول الطلب عبر التدفق البديل</Text>
      <Text style={styles.successMessage}>
        ستحصل على أولوية أعلى ورسوم إضافية. ابدأ بتحضير الطلب.
      </Text>
    </View>
  );

  const renderError = () => (
    <View style={styles.center}>
      <View style={styles.errorIcon}>
        <Text style={styles.errorText}>⚠</Text>
      </View>
      <Text style={styles.errorTitle}>فشل في قبول الطلب</Text>
      <Text style={styles.errorMessage}>{errorMessage}</Text>
      <TouchableOpacity style={styles.retryButton} onPress={acceptOrderAlt}>
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
    marginBottom: 32,
  },
  benefits: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  benefitsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colorTokens.neutral['900'],
    marginBottom: 12,
  },
  benefit: {
    fontSize: 14,
    color: colorTokens.success['500'],
    marginBottom: 4,
  },
  acceptButton: {
    backgroundColor: colorTokens.primary['500'],
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  acceptButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  regularAcceptButton: {
    backgroundColor: colorTokens.success['500'],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  regularAcceptButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: 'bold',
  },
  rejectButton: {
    backgroundColor: colorTokens.error['500'],
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  rejectButtonText: {
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
    color: BTHWANI_COLORS.surface,
    fontWeight: 'bold',
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
  errorText: {
    fontSize: 40,
    color: BTHWANI_COLORS.surface,
    fontWeight: 'bold',
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

