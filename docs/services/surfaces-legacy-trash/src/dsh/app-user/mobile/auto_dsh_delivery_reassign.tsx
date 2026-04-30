// Auto-generated screen for dsh_delivery_reassign (decision; API: dsh_delivery_reassign_request)
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/deliveries/:deliveryId/reassign
// §30 States: Loading / Error / Content — لا خلط ?? مع ||

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

const REASON_VALUES = ['customer_request', 'captain_unavailable', 'traffic_issues', 'technical_issue'] as const;

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { deliveryId?: string } };
}

export const auto_dsh_delivery_reassign: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const reasons = useMemo(
    () => [
      { value: 'customer_request' as const, label: t('dsh.app-client.mobile.auto_dsh_delivery_reassign.reasonCustomerRequest') },
      { value: 'captain_unavailable' as const, label: t('dsh.app-client.mobile.auto_dsh_delivery_reassign.reasonCaptainUnavailable') },
      { value: 'traffic_issues' as const, label: t('dsh.app-client.mobile.auto_dsh_delivery_reassign.reasonTrafficIssue') },
      { value: 'technical_issue' as const, label: t('dsh.app-client.mobile.auto_dsh_delivery_reassign.reasonTechnicalIssue') },
    ],
    [t]
  );
  const [deliveryId, setDeliveryId] = useState(() => (route?.params?.deliveryId != null ? route.params.deliveryId : ''));
  const [reason, setReason] = useState<string>(REASON_VALUES[0]);
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
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
      const url = `${getBaseUrl()}/api/dsh/deliveries/${encodeURIComponent(id)}/reassign`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason, priority, notes: notes.trim() || undefined }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في إعادة التعيين');
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [deliveryId, reason, priority, notes, route?.params?.deliveryId]);

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
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_delivery_reassign.loadingMessage')} screenName="auto_dsh_delivery_reassign" operationName="dsh_delivery_reassign_request" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_delivery_reassign.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_delivery_reassign" operationName="dsh_delivery_reassign_request" />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.subtitle')}</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={deliveryId}
          onChangeText={setDeliveryId}
          placeholder="delivery_123..."
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={[styles.label, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.labelReason')}</Text>
        <View style={styles.reasonRow}>
          {reasons.map((r) => (
            <TouchableOpacity
              key={r.value}
              style={[styles.reasonBtn, reason === r.value && styles.reasonBtnActive]}
              onPress={() => setReason(r.value)}
            >
              <Text style={[styles.reasonText, reason === r.value && styles.reasonTextActive]}>{r.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.label, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.labelPriority')}</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.segButton, priority === 'normal' && styles.segButtonActive]} onPress={() => setPriority('normal')}>
            <Text style={[styles.segText, priority === 'normal' && styles.segTextActive]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.segNormal')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.segButton, priority === 'urgent' && styles.segButtonActive]} onPress={() => setPriority('urgent')}>
            <Text style={[styles.segText, priority === 'urgent' && styles.segTextActive]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.segUrgent')}</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.label, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.labelNotesOptional')}</Text>
        <TextInput
          style={[styles.input, textAlignStart, styles.notesInput]}
          value={notes}
          onChangeText={setNotes}
          placeholder={t('dsh.app-client.mobile.auto_dsh_delivery_reassign.placeholderNotes')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          multiline
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!deliveryId.trim()}>
          <Text style={styles.primaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.primaryButtonText')}</Text>
        </TouchableOpacity>
        {success && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.resultText')}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_delivery_reassign.secondaryButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
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
  reasonRow: { flexDirection: 'row', flexWrap: 'wrap', gap: BTHWANI_SPACING.xs, marginBottom: BTHWANI_SPACING.lg },
  reasonBtn: { paddingVertical: BTHWANI_SPACING.sm, paddingHorizontal: BTHWANI_SPACING.contentH, borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  reasonBtnActive: { backgroundColor: semanticRoles.primaryCTA, borderColor: semanticRoles.primaryCTA },
  reasonText: { fontSize: 12, color: semanticRoles.onSurface },
  reasonTextActive: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  row: { flexDirection: 'row', gap: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.lg },
  segButton: { flex: 1, padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  segButtonActive: { backgroundColor: semanticRoles.primaryCTA, borderColor: semanticRoles.primaryCTA },
  segText: { fontSize: 14, color: semanticRoles.onSurface },
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
  resultText: { fontSize: 14, color: semanticRoles.onSurface, },
});

export default auto_dsh_delivery_reassign;

