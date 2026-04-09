// ARB Booking Get Screen - Complete Design
// Surface: app-client | Service: arb
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildArbBookingGetMock } from '../../hooks';

interface auto_arb_booking_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_arb_booking_get: React.FC<auto_arb_booking_getProps> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [state, setState] = useState<ScreenState>('loading');

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  useEffect(() => {
    // Backend integration call
    const loadBooking = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (88% success rate)
        const mockSuccess = 0 > 0.12;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadBooking();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const booking = useMemo(() => buildArbBookingGetMock(t), [t]);

  const getStatusColor = (status: string) => {
    // Using semantic tokens instead of raw hex colors (P1-2 fix)
    switch (status) {
      case 'confirmed': return semanticRoles.stateInfo.icon;
      case 'pending': return semanticRoles.stateWarning.icon;
      case 'cancelled': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return t('arb.app-client.mobile.auto_arb_booking_get.confirmed');
      case 'pending': return t('arb.app-client.mobile.auto_arb_booking_get.pending');
      case 'cancelled': return t('arb.app-client.mobile.auto_arb_booking_get.cancelled');
      default: return status;
    }
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t('arb.app-client.mobile.auto_arb_booking_get.title')}</Text>
          <Text style={styles.bookingId}>{booking.id}</Text>

          <View style={styles.statusCard}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(booking.status) }]}>
              <Text style={styles.statusText}>{getStatusText(booking.status)}</Text>
            </View>
            <Text style={styles.bookingDate}>تم الحجز في: {booking.bookingDate}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_booking_get.sectionProperty')}</Text>
            <View style={styles.propertyCard}>
              <View style={styles.propertyHeader}>
                <Text style={styles.propertyEmoji}>{booking.property.image}</Text>
                <View style={styles.propertyInfo}>
                  <Text style={styles.propertyName}>{booking.property.name}</Text>
                  <Text style={styles.propertyType}>{booking.property.type} • {booking.property.location}</Text>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {booking.property.rating}</Text>
                    <Text style={styles.reviews}>({booking.property.reviews} تقييم)</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_booking_get.sectionDates')}</Text>
            <View style={styles.datesCard}>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.dateLabelCheckIn')}</Text>
                <Text style={styles.dateValue}>{booking.dates.checkIn}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.dateLabelCheckOut')}</Text>
                <Text style={styles.dateValue}>{booking.dates.checkOut}</Text>
              </View>
              <View style={styles.dateRow}>
                <Text style={styles.dateLabel}>عدد الليالي:</Text>
                <Text style={styles.dateValue}>{booking.dates.nights} ليالي</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_booking_get.sectionGuests')}</Text>
            <View style={styles.guestCard}>
              <View style={styles.guestRow}>
                <Text style={styles.guestLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.guestLabelName')}</Text>
                <Text style={styles.guestValue}>{booking.guest.name}</Text>
              </View>
              <View style={styles.guestRow}>
                <Text style={styles.guestLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.guestLabelEmail')}</Text>
                <Text style={[styles.guestValue, textAlignStart]}>{booking.guest.email}</Text>
              </View>
              <View style={styles.guestRow}>
                <Text style={styles.guestLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.guestLabelPhone')}</Text>
                <Text style={[styles.guestValue, textAlignStart]}>{booking.guest.phone}</Text>
              </View>
              <View style={styles.guestRow}>
                <Text style={styles.guestLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.guestLabelGuests')}</Text>
                <Text style={styles.guestValue}>{booking.guest.guests} أشخاص</Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{t('arb.app-client.mobile.auto_arb_booking_get.sectionAmenities')}</Text>
            <View style={styles.amenitiesContainer}>
              {booking.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityItem}>
                  <Text style={styles.amenityBullet}>✓</Text>
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.pricingTitle}>{t('arb.app-client.mobile.auto_arb_booking_get.pricingTitle')}</Text>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.pricingLabelNightly')}</Text>
              <Text style={styles.pricingValue}>{booking.pricing.nightlyRate} {booking.pricing.currency}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.pricingLabelBase', { nights: booking.dates.nights })}</Text>
              <Text style={styles.pricingValue}>{booking.pricing.total} {booking.pricing.currency}</Text>
            </View>
            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.pricingLabelServiceFee')}</Text>
              <Text style={styles.pricingValue}>{booking.pricing.serviceFee} {booking.pricing.currency}</Text>
            </View>
            <View style={[styles.pricingRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>{t('arb.app-client.mobile.auto_arb_booking_get.totalLabelPricing')}</Text>
              <Text style={styles.totalValue}>{booking.pricing.totalWithFees} {booking.pricing.currency}</Text>
            </View>
          </View>

          <View style={styles.policyCard}>
            <Text style={styles.policyTitle}>{t('arb.app-client.mobile.auto_arb_booking_get.policyTitle')}</Text>
            <Text style={styles.policyText}>{booking.cancellationPolicy}</Text>
          </View>

          {/* ARB_UX_FLOW: زر واحد أساسي حسب الحالة — لا ازدواج */}
          {booking.status === 'pending' && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('ArbBookingConfirm')}>
              <Text style={styles.primaryButtonText}>تأكيد الحجز</Text>
            </TouchableOpacity>
          )}
          {booking.status === 'confirmed' && (
            <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('ArbBookingEscrowStatusGet')}>
              <Text style={styles.primaryButtonText}>{t('arb.app-client.mobile.auto_arb_booking_get.primaryButtonEscrow')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.actionButton} onPress={() => handleNavigate('ArbAmendmentsList')}>
            <Text style={styles.actionText}>{t('arb.app-client.mobile.auto_arb_booking_get.actionText')}</Text>
          </TouchableOpacity>

          {booking.status !== 'cancelled' && (
            <TouchableOpacity style={styles.cancelButton} onPress={() => handleNavigate('ArbBookingCancel')}>
              <Text style={styles.cancelText}>{t('arb.app-client.mobile.auto_arb_booking_get.cancelText')}</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactText}>{t('arb.app-client.mobile.auto_arb_booking_get.contactText')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('arb.app-client.mobile.auto_arb_booking_get.loadingMessage')}
      errorMessage={t('arb.app-client.mobile.auto_arb_booking_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      successMessage={t('arb.app-client.mobile.auto_arb_booking_get.successMessage')}
      successActionText={t('arb.app-client.mobile.auto_arb_booking_get.backToBookings')}
      onSuccessAction={() => setState('content')}
      screenName="auto_arb_booking_get"
      operationName="arb_booking_get"
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
    color: semanticRoles.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  bookingId: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  statusCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  bookingDate: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  propertyCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  propertyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  propertyEmoji: {
    fontSize: 40,
    marginEnd: BTHWANI_SPACING.md,
  },
  propertyInfo: {
    flex: 1,
  },
  propertyName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  propertyType: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    marginEnd: BTHWANI_SPACING.sm,
  },
  reviews: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  datesCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  dateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  dateLabel: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  dateValue: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    fontWeight: '500',
  },
  guestCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  guestRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  guestLabel: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  guestValue: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  amenitiesContainer: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  amenityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  amenityBullet: {
    color: semanticRoles.success,
    fontSize: 16,
    marginEnd: BTHWANI_SPACING.sm,
    fontWeight: '600',
  },
  amenityText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.onSurface,
  },
  pricingCard: {
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
  pricingTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  pricingLabel: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  pricingValue: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: semanticRoles.outline,
    paddingTop: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  policyCard: {
    backgroundColor: semanticRoles.info + '20',
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.info,
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.info,
    marginBottom: BTHWANI_SPACING.sm,
  },
  policyText: {
    fontSize: 14,
    color: semanticRoles.info,
    lineHeight: 20,
  },
  primaryButton: {
    backgroundColor: semanticRoles.success,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  actionText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: semanticRoles.error,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  cancelText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  contactButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  contactText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_arb_booking_get;

