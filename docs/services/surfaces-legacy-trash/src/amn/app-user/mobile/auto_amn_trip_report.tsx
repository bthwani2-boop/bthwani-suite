// AMN Trip Report - تقديم بلاغ/شكوى على رحلة
// Surface: app-client | Operation: amn_trip_report
// UX: 1-2 نقرات — اختيار سبب ثم إرسال (CTA واحد)

import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface auto_amn_trip_reportProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { tripId?: string } };
}

export const auto_amn_trip_report: React.FC<auto_amn_trip_reportProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t } = useI18n();
  const tripId = route?.params?.tripId ?? 'TRIP-001';
  const REPORT_REASONS = useMemo(() => [
    { id: 'delay', label: t('surfaces.report_reason_delay'), icon: '⏱️' },
    { id: 'behavior', label: t('surfaces.report_reason_behavior'), icon: '😕' },
    { id: 'safety', label: t('surfaces.report_reason_safety'), icon: '🛡️' },
    { id: 'route', label: t('surfaces.report_reason_route'), icon: '🛣️' },
    { id: 'fare', label: t('surfaces.report_reason_fare'), icon: '💰' },
    { id: 'other', label: t('surfaces.report_reason_other'), icon: '📝' },
  ], [t]);
  const [state, setState] = useState<ScreenState>('content');
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  const handleSubmit = useCallback(() => {
    if (!selectedReason) return;
    setSubmitting(true);
    setState('loading');
    setTimeout(() => {
      setState('success');
      setSubmitting(false);
    }, 1200);
  }, [selectedReason]);

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
              <Text style={styles.backLinkText}>← رحلاتي</Text>
            </TouchableOpacity>
            <Text style={styles.title}>تقديم بلاغ على الرحلة</Text>
            <Text style={styles.subtitle}>
              الرحلة: {tripId} — اختر السبب ثم أرسل
            </Text>

            <View style={styles.section}>
              <Text style={styles.label}>سبب البلاغ *</Text>
              {REPORT_REASONS.map((r) => (
                <TouchableOpacity
                  key={r.id}
                  style={[
                    styles.reasonCard,
                    selectedReason === r.id && styles.reasonCardSelected,
                  ]}
                  onPress={() => setSelectedReason(r.id)}
                >
                  <Text style={styles.reasonIcon}>{r.icon}</Text>
                  <Text
                    style={[
                      styles.reasonLabel,
                      selectedReason === r.id && styles.reasonLabelSelected,
                    ]}
                  >
                    {r.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>تفاصيل إضافية (اختياري)</Text>
              <TextInput
                style={styles.textArea}
                placeholder={t('surfaces.report_details_placeholder')}
                placeholderTextColor={semanticRoles.textMuted}
                value={details}
                onChangeText={setDetails}
                multiline
                numberOfLines={3}
                maxLength={500}
              />
            </View>

            <TouchableOpacity
              style={[
                styles.cta,
                (!selectedReason || submitting) && styles.ctaDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!selectedReason || submitting}
            >
              <Text
                style={[
                  styles.ctaText,
                  (!selectedReason || submitting) && styles.ctaTextDisabled,
                ]}
              >
                {submitting ? t('amn.app-client.mobile.auto_amn_trip_report.submitReport') : t('amn.app-client.mobile.auto_amn_trip_report.submitReport')}
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
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_report.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trip_report.errorSendMessage')}
      onErrorAction={() => setState('content')}
      successMessage={t('amn.app-client.mobile.auto_amn_trip_report.reportReceivedMessage')}
      successActionText={t('amn.app-client.mobile.auto_amn_trip_report.backToTrips')}
      onSuccessAction={() => handleNavigate('AmnTripsList')}
      screenName="auto_amn_trip_report"
      operationName="amn_trip_report"
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
  section: { marginBottom: BTHWANI_SPACING.xl },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  reasonCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  reasonCardSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '12',
  },
  reasonIcon: { fontSize: 24, marginEnd: BTHWANI_SPACING.md },
  reasonLabel: { fontSize: 16, color: semanticRoles.text, flex: 1 },
  reasonLabelSelected: { color: semanticRoles.primaryCTA, fontWeight: '600' },
  textArea: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.text,
    minHeight: 80,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cta: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  ctaDisabled: { backgroundColor: semanticRoles.surfaceSubtle },
  ctaText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  ctaTextDisabled: { color: semanticRoles.textMuted },
});

export default auto_amn_trip_report;

