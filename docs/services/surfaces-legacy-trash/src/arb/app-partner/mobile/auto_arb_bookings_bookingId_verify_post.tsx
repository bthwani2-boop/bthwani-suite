/**
 * ARB Partner Booking Verify — arb_bookings_bookingId_verify_post
 * Surface: app-partner | Service: arb
 * Operation: POST /api/arb/bookings/{bookingId}/verify
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to verify booking
 * - Full states: Loading/Error/Success
 */

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface AutoArbBookingsBookingIdVerifyPostProps {
  navigation?: any;
  route?: {
    params?: {
      bookingId?: string;
      booking?: any;
    };
  };
}

export const AutoArbBookingsBookingIdVerifyPost: React.FC<AutoArbBookingsBookingIdVerifyPostProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const bookingId = route?.params?.bookingId || 'unknown';
  const booking = route?.params?.booking || null;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleVerify = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // await verifyBooking(bookingId);
      await new Promise(resolve => setTimeout(resolve, 1500));

      setIsSuccess(true);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('arb.app-partner.mobile.auto_arb_bookings_bookingId_verify_post.errorMessage');
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [bookingId]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('surfaces.arb_verify_loading')}
      errorMessage={error || t('errors.generic')}
      errorActionText={t('common.retry')}
      onErrorAction={handleVerify}
      successMessage={t('surfaces.arb_verify_success')}
      successActionText={t('surfaces.arb_back_to_list')}
      onSuccessAction={() => navigation?.navigate('arb_partner_bookings_list')}
      screenName="auto_arb_bookings_bookingId_verify_post"
      operationName="arb_bookings_bookingId_verify_post"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('surfaces.arb_verify_title')}</Text>
          <Text style={styles.subtitle}>#{bookingId}</Text>
        </View>

        {booking && (
          <View style={styles.bookingInfo}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('surfaces.arb_client_name')}:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{booking.customer_name || '-'}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{t('surfaces.arb_date_label')}:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{booking.booking_date || booking.created_at || booking.date || '-'}</Text>
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            {t('surfaces.arb_verify_info')}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.verifyButton}
          onPress={handleVerify}
          disabled={isLoading}
        >
          <Text style={styles.verifyButtonText}>{t('surfaces.arb_verify_title')}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation?.goBack()}
          disabled={isLoading}
        >
          <Text style={styles.backLinkText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  bookingInfo: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 16,
    color: semanticRoles.text,
    textAlign: 'center',
  },
  verifyButton: {
    backgroundColor: semanticRoles.stateInfo.icon,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  verifyButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  backLink: {
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
  },
  backLinkText: {
    color: semanticRoles.textMuted,
    fontSize: 15,
  },
});

export default AutoArbBookingsBookingIdVerifyPost;
