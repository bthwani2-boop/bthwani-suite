// Auto-generated screen for dsh_booking_create
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/bookings
// §30 States: Loading / Error / Success / Content

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
}

export const auto_dsh_booking_create: React.FC<Props> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [bookingType, setBookingType] = useState<'delivery' | 'appointment'>('delivery');
  const [customerName, setCustomerName] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [createdId, setCreatedId] = useState<string | null>(null);

  const submit = useCallback(async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/bookings`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingType,
          customerInfo: { name: customerName.trim() || t('dsh.app-client.mobile.auto_dsh_booking_create.customerLabel') },
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في إنشاء الحجز');
      setCreatedId(json?.data?.bookingId || null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [bookingType, customerName]);

  const handleRetry = () => { setState('content'); void submit(); };
  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_booking_create.loadingMessage')} screenName="auto_dsh_booking_create" operationName="dsh_booking_create" />
    );
  }
  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_booking_create.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_booking_create" operationName="dsh_booking_create" />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={styles.title}>حجز جديد</Text>
        <Text style={styles.subtitle}>إنشاء حجز توصيل أو موعد</Text>
        <Text style={styles.label}>نوع الحجز</Text>
        <View style={styles.row}>
          <TouchableOpacity style={[styles.segButton, bookingType === 'delivery' && styles.segButtonActive]} onPress={() => setBookingType('delivery')}>
            <Text style={[styles.segText, bookingType === 'delivery' && styles.segTextActive]}>توصيل</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.segButton, bookingType === 'appointment' && styles.segButtonActive]} onPress={() => setBookingType('appointment')}>
            <Text style={[styles.segText, bookingType === 'appointment' && styles.segTextActive]}>موعد</Text>
          </TouchableOpacity>
        </View>
        <Text style={[styles.label, textAlignStart]}>اسم العميل (اختياري)</Text>
        <TextInput style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]} value={customerName} onChangeText={setCustomerName} placeholder={t('dsh.app-client.mobile.auto_dsh_booking_create.nameLabel')} placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()}>
          <Text style={styles.primaryButtonText}>إنشاء الحجز</Text>
        </TouchableOpacity>
        {createdId && (
          <View style={styles.result}>
            <Text style={styles.resultText}>تم إنشاء الحجز: {createdId}</Text>
            <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigate('DshOrdersList')}>
              <Text style={styles.linkText}>طلباتي</Text>
            </TouchableOpacity>
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
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.md },
  label: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.xs },
  input: { borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md, padding: BTHWANI_SPACING.md, fontSize: 16, color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.sm },
  row: { flexDirection: 'row', gap: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.lg },
  segButton: { flex: 1, padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  segButtonActive: { backgroundColor: semanticRoles.primaryCTA, borderColor: semanticRoles.primaryCTA },
  segText: { fontSize: 14, color: semanticRoles.onSurface },
  segTextActive: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  primaryButton: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, alignItems: 'center', marginVertical: BTHWANI_SPACING.sm },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  result: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  resultText: { fontSize: 14, color: semanticRoles.onSurface },
  linkButton: { marginTop: BTHWANI_SPACING.sm, alignItems: 'center' },
  linkText: { fontSize: 14, color: semanticRoles.primaryCTA },
});

export default auto_dsh_booking_create;

