// AMN Booking Create — إنشاء حجز مجدول
// Surface: app-client | Operation: amn_booking_create
// UX: Smart Defaults — وقت افتراضي غداً؛ عرض سياسة العربون ومبلغ العربون قبل الدفع؛ CTA واحد «تأكيد الحجز ودفع العربون»

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

// غداً 9:00 — آمن ضد RangeError: Date value out of bounds (توقيت/منطقة زمنية)
const tomorrowDefault = (): string => {
  try {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    if (Number.isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 16);
  } catch {
    return '';
  }
};

const DEPOSIT_PERCENT = 20;
const CANCELLATION_WINDOW_HOURS = 24;

interface auto_amn_booking_createProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_amn_booking_create: React.FC<auto_amn_booking_createProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('content');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [scheduledAt, setScheduledAt] = useState(tomorrowDefault());
  const [submitting, setSubmitting] = useState(false);

  const estimatedFare = useMemo(
    () => (pickup.trim() ? Math.round(25 + (pickup.length % 40) + (destination.length % 20)) : null),
    [pickup, destination]
  );
  const depositAmount = estimatedFare != null ? Math.round((estimatedFare * DEPOSIT_PERCENT) / 100) : null;

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  const handleSubmit = useCallback(() => {
    if (!pickup.trim()) return;
    setSubmitting(true);
    setState('loading');
    setTimeout(() => {
      setState('success');
      setSubmitting(false);
    }, 1500);
  }, [pickup]);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.contentFill}>
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.scrollContent}
          >
            <TouchableOpacity
              style={styles.backLink}
              onPress={() => handleNavigate('AmnTripsList')}
            >
              <Text style={styles.backLinkText}>{t('amn.app-client.mobile.auto_amn_booking_create.backLinkText')}</Text>
            </TouchableOpacity>
            <Text style={styles.title}>{t('amn.app-client.mobile.auto_amn_booking_create.title')}</Text>
            <Text style={styles.subtitle}>
              {t('amn.app-client.mobile.auto_amn_booking_create.subtitle')}
            </Text>

            <View style={styles.section}>
              <Text style={styles.label}>نقطة الالتقاء *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('surfaces.pickup_address')}
                placeholderTextColor={semanticRoles.textMuted}
                value={pickup}
                onChangeText={setPickup}
              />
              <View style={styles.locationRow}>
                <TouchableOpacity
                  style={styles.mapPickBtn}
                  onPress={() => Alert.alert(t('surfaces.set_location'), t('surfaces.placeholder_destination_map'))}
                >
                  <Text style={styles.mapPickBtnText}>🗺️ تحديد على الخريطة</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>الوجهة (اختياري)</Text>
              <TextInput
                style={styles.input}
                placeholder={t('surfaces.dropoff_address')}
                placeholderTextColor={semanticRoles.textMuted}
                value={destination}
                onChangeText={setDestination}
              />
              <View style={styles.locationRow}>
                <TouchableOpacity
                  style={styles.mapPickBtn}
                  onPress={() => Alert.alert(t('surfaces.set_destination'), t('surfaces.placeholder_destination_map'))}
                >
                  <Text style={styles.mapPickBtnText}>🗺️ تحديد على الخريطة</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>الموعد *</Text>
              <TextInput
                style={styles.input}
                placeholder="YYYY-MM-DDTHH:mm"
                placeholderTextColor={semanticRoles.textMuted}
                value={scheduledAt}
                onChangeText={setScheduledAt}
              />
              <Text style={styles.hint}>الافتراضي: غداً 9:00 صباحاً</Text>
            </View>

            {estimatedFare != null && depositAmount != null && (
              <View style={styles.policyCard}>
                <Text style={[styles.policyTitle, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_booking_create.policyTitle')}</Text>
                <Text style={[styles.policyRow, textAlignStart]}>التقدير التقريبي: {String(estimatedFare)} ريال</Text>
                <Text style={[styles.policyRow, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_booking_create.policyDepositRow', { percent: DEPOSIT_PERCENT, amount: String(depositAmount) })}</Text>
                <Text style={[styles.policyText, textAlignStart]}>
                  {t('amn.app-client.mobile.auto_amn_booking_create.policyCancelWindow', { hours: CANCELLATION_WINDOW_HOURS })}
                </Text>
              </View>
            )}

            <TouchableOpacity
              style={[styles.cta, submitting && styles.ctaDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              <Text
                style={[
                  styles.ctaText,
                  submitting && styles.ctaTextDisabled,
                ]}
              >
                {submitting ? t('amn.app-client.mobile.auto_amn_booking_create.confirmBookingAnd') : t('amn.app-client.mobile.auto_amn_booking_create.confirmBookingAnd')}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_booking_create.creatingBooking')}
      errorMessage={t('amn.app-client.mobile.auto_amn_booking_create.errorCreateMessage')}
      onErrorAction={() => setState('content')}
      successMessage={t('amn.app-client.mobile.auto_amn_booking_create.successMessage')}
      successActionText={t('amn.app-client.mobile.auto_amn_booking_create.viewTrips')}
      onSuccessAction={() => handleNavigate('AmnTripsList')}
      screenName="auto_amn_booking_create"
      operationName="amn_booking_create"
    />
  );
};

const styles = StyleSheet.create({
  contentFill: { flex: 1, alignSelf: 'stretch', width: '100%' },
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  scrollContent: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl },
  backLink: { marginBottom: BTHWANI_SPACING.md },
  backLinkText: { fontSize: 16, color: semanticRoles.primaryCTA, fontWeight: '600' },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
  },
  section: { marginBottom: BTHWANI_SPACING.lg },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  hint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  policyCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  policyRow: {
    fontSize: 14,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  policyText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.sm,
    lineHeight: 20,
  },
  locationRow: { marginTop: BTHWANI_SPACING.sm },
  mapPickBtn: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  mapPickBtnText: { fontSize: 14, color: semanticRoles.primaryCTA, fontWeight: '500' },
  cta: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.md,
  },
  ctaDisabled: { backgroundColor: semanticRoles.surfaceSubtle },
  ctaText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  ctaTextDisabled: { color: semanticRoles.textMuted },
});

export default auto_amn_booking_create;

