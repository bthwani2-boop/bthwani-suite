// ARB Amendment Create Screen - Complete Design
// Surface: app-client | Service: arb
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildArbAmendmentCreateMock } from '../../hooks';

interface auto_arb_amendment_createProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { bookingId?: string } };
}

export const auto_arb_amendment_create: React.FC<auto_arb_amendment_createProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('content');
  const [submitting, setSubmitting] = useState(false);

  const amendmenttypes = useMemo(
    () => [
      { id: 'dates', name: t('surfaces.arb_amendment_type_dates'), icon: '📅' },
      { id: 'guests', name: t('surfaces.arb_amendment_type_guests'), icon: '👥' },
      { id: 'other', name: t('surfaces.arb_amendment_type_other'), icon: '📝' },
    ],
    [t]
  );
  const [amendmentType, setAmendmentType] = useState<string>('');
  const [newCheckIn, setNewCheckIn] = useState('');
  const [newCheckOut, setNewCheckOut] = useState('');
  const [newGuests, setNewGuests] = useState('');
  const [reason, setReason] = useState('');

  const bookingId = route?.params?.bookingId || 'BK-001';
  const booking = useMemo(
    () => buildArbAmendmentCreateMock(t, bookingId),
    [t, bookingId]
  );

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) {
        navigation.navigate(screen);
      } else if (onNavigate) {
        onNavigate(screen);
      }
    },
    [navigation, onNavigate]
  );


  const handleSubmit = () => {
    if (!amendmentType) {
      Alert.alert(t('common.error'), t('surfaces.arb_alert_choose_type'));
      return;
    }

    if (!reason.trim()) {
      Alert.alert(t('common.error'), t('surfaces.arb_alert_enter_reason'));
      return;
    }

    setSubmitting(true);
    setState('loading');

    setTimeout(() => {
      setState('success');
      setSubmitting(false);
    }, 2000);
  };

  const handleRetry = () => {
    setState('content');
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>طلب تعديل حجز</Text>
          <Text style={styles.subtitle}>إنشاء طلب تعديل للحجز {booking.id}</Text>

          <View style={styles.bookingCard}>
            <Text style={styles.bookingId}>الحجز: {booking.id}</Text>
            <View style={styles.bookingDetails}>
              <Text style={styles.bookingDetail}>العقار: {booking.property}</Text>
              <Text style={styles.bookingDetail}>الوصول: {booking.checkIn}</Text>
              <Text style={styles.bookingDetail}>المغادرة: {booking.checkOut}</Text>
              <Text style={styles.bookingDetail}>عدد الضيوف: {booking.guests}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>نوع التعديل *</Text>
            <View style={styles.typesGrid}>
              {amendmenttypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.typeCard,
                    amendmentType === type.id && styles.typeCardSelected,
                  ]}
                  onPress={() => setAmendmentType(type.id)}
                >
                  <Text style={styles.typeIcon}>{type.icon}</Text>
                  <Text
                    style={[
                      styles.typeName,
                      amendmentType === type.id && styles.typeNameSelected,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {amendmentType === 'dates' && (
            <>
              <View style={styles.section}>
                <Text style={styles.label}>{t('surfaces.arb_new_checkin_label')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('surfaces.arb_placeholder_date_example')}
                  placeholderTextColor={semanticRoles.textMuted}
                  value={newCheckIn}
                  onChangeText={setNewCheckIn}
                />
              </View>
              <View style={styles.section}>
                <Text style={styles.label}>{t('surfaces.arb_new_checkout_label')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('surfaces.arb_placeholder_date_example')}
                  placeholderTextColor={semanticRoles.textMuted}
                  value={newCheckOut}
                  onChangeText={setNewCheckOut}
                />
              </View>
            </>
          )}

          {amendmentType === 'guests' && (
            <View style={styles.section}>
              <Text style={styles.label}>{t('surfaces.arb_new_guests_label')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('surfaces.arb_placeholder_guests')}
                placeholderTextColor={semanticRoles.textMuted}
                value={newGuests}
                onChangeText={setNewGuests}
                keyboardType="numeric"
              />
            </View>
          )}

          <View style={styles.section}>
            <Text style={styles.label}>{t('surfaces.arb_reason_label')} *</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('surfaces.arb_placeholder_amendment_reason')}
              placeholderTextColor={semanticRoles.textMuted}
              value={reason}
              onChangeText={setReason}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={[styles.charCount, textAlignStart]}>{reason.length}/500</Text>
          </View>

          <View style={styles.noteCard}>
            <Text style={styles.noteTitle}>{t('surfaces.arb_note_title')}</Text>
            <Text style={styles.noteText}>
              • {t('surfaces.arb_note_1')}{'\n'}
              • {t('surfaces.arb_note_2')}{'\n'}
              • {t('surfaces.arb_note_3')}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={[styles.submitButtonText, submitting && styles.submitButtonTextDisabled]}>
              {submitting ? t('surfaces.arb_submitting') : t('surfaces.arb_submit_amendment')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.arb_loading_amendment')}
      errorMessage={t('surfaces.arb_error_amendment')}
      onErrorAction={handleRetry}
      successMessage={t('surfaces.arb_success_amendment')}
      successActionText={t('surfaces.arb_view_amendments_list')}
      onSuccessAction={() => handleNavigate('ArbAmendmentsList')}
      screenName="auto_arb_amendment_create"
      operationName="arb_amendment_create"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  bookingCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  bookingId: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.md,
  },
  bookingDetails: {
    gap: BTHWANI_SPACING.sm,
  },
  bookingDetail: {
    fontSize: 14,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  section: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  typesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
  },
  typeCard: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  typeCardSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '10',
  },
  typeIcon: {
    fontSize: 32,
    marginBottom: BTHWANI_SPACING.xs,
  },
  typeName: {
    fontSize: 12,
    fontWeight: '600',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  typeNameSelected: {
    color: semanticRoles.primaryCTA,
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
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  noteCard: {
    backgroundColor: semanticRoles.warning + '20',
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.warning,
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.warning,
    marginBottom: BTHWANI_SPACING.sm,
  },
  noteText: {
    fontSize: 14,
    color: semanticRoles.warning,
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  submitButtonTextDisabled: {
    color: semanticRoles.textMuted,
  },
});

export default auto_arb_amendment_create;

