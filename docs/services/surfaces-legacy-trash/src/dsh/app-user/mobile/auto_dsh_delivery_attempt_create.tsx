// Auto-generated screen for dsh_delivery_attempt_create
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/deliveries/:deliveryId/attempt
// §30 States: Loading / Error / Success / Content — أقل نقرات، مسار واضح (لا خلط ?? مع ||)

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { deliveryId?: string } };
}

export const auto_dsh_delivery_attempt_create: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [deliveryId, setDeliveryId] = useState(() => (route?.params?.deliveryId != null ? route.params.deliveryId : ''));
  const [attemptNumber, setAttemptNumber] = useState('1');
  const [status, setStatus] = useState<'successful' | 'failed' | 'rescheduled'>('successful');
  const [notes, setNotes] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async () => {
    const id = (deliveryId || (route?.params?.deliveryId != null ? route.params.deliveryId : '')).trim();
    if (!id) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/deliveries/${encodeURIComponent(id)}/attempt`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptNumber: Math.max(1, parseInt(attemptNumber, 10) || 1),
          status,
          notes: notes.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في تسجيل المحاولة');
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [deliveryId, attemptNumber, status, notes, route?.params?.deliveryId]);

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
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_delivery_attempt_create.loadingMessage')}
        screenName="auto_dsh_delivery_attempt_create"
        operationName="dsh_delivery_attempt_create"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_delivery_attempt_create.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_delivery_attempt_create"
        operationName="dsh_delivery_attempt_create"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تسجيل محاولة توصيل</Text>
        <Text style={[styles.subtitle, textAlignStart]}>معرف التوصيل (deliveryId)</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={deliveryId}
          onChangeText={setDeliveryId}
          placeholder="delivery_123..."
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={[styles.label, textAlignStart]}>رقم المحاولة</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={attemptNumber}
          onChangeText={setAttemptNumber}
          placeholder="1"
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          keyboardType="number-pad"
        />
        <Text style={[styles.label, textAlignStart]}>النتيجة</Text>
        <View style={styles.row}>
          {(['successful', 'failed', 'rescheduled'] as const).map((s) => (
            <TouchableOpacity
              key={s}
              style={[styles.segButton, status === s && styles.segButtonActive]}
              onPress={() => setStatus(s)}
            >
              <Text style={[styles.segText, status === s && styles.segTextActive]}>
                {s === 'successful' ? t('dsh.app-client.mobile.auto_dsh_delivery_attempt_create.successLabel') : s === 'failed' ? 'فاشلة' : 'مؤجلة'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, textAlignStart]}>ملاحظات (اختياري)</Text>
        <TextInput
          style={[styles.input, styles.notesInput, { textAlign: isRTL ? 'right' : 'left' }]}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('dsh.app-client.mobile.auto_dsh_delivery_attempt_create.notesPlaceholder')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          multiline
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!deliveryId.trim()}>
          <Text style={styles.primaryButtonText}>تسجيل المحاولة</Text>
        </TouchableOpacity>
        {success && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>تم تسجيل المحاولة بنجاح</Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>طلباتي</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.sm },
  label: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.xs },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  notesInput: { minHeight: 64, textAlignVertical: 'top' },
  row: { flexDirection: 'row', gap: BTHWANI_SPACING.xs, marginBottom: BTHWANI_SPACING.lg },
  segButton: { flex: 1, padding: BTHWANI_SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  segButtonActive: { backgroundColor: semanticRoles.primaryCTA, borderColor: semanticRoles.primaryCTA },
  segText: { fontSize: 12, color: semanticRoles.onSurface },
  segTextActive: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginVertical: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  result: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  resultText: { fontSize: 14, color: semanticRoles.onSurface },
});

export default auto_dsh_delivery_attempt_create;

