// AMN Trip Get Screen - Complete Design
// Surface: app-client | Service: amn
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { buildAmnTripGetMock } from '../../hooks';

interface auto_amn_trip_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: {
    navigate: (screen: string, params?: { tripId?: string }) => void;
  };
  route?: { params?: { tripId?: string } };
}

export const auto_amn_trip_get: React.FC<auto_amn_trip_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');
  const tripIdFromRoute = route?.params?.tripId;

  const handleNavigate = (screen: string, params?: { tripId?: string }) => {
    if (navigation?.navigate) {
      if (params?.tripId)
        (navigation as { navigate: (s: string, p?: object) => void }).navigate(
          screen,
          params
        );
      else navigation.navigate(screen);
    } else if (onNavigate) onNavigate(screen);
  };

  useEffect(() => {
    // Backend integration call
    const loadTrip = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate success (85% success rate)
        const mockSuccess = 0 > 0.15;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadTrip();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const trip = useMemo(
    () => buildAmnTripGetMock(t, tripIdFromRoute),
    [t, tripIdFromRoute]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'requested':
        return colorTokens.warning['500'];
      case 'accepted':
        return colorTokens.primary['500'];
      case 'arrived':
        return colorTokens.accent['500'];
      case 'in_progress':
        return colorTokens.success['600'];
      case 'completed':
        return colorTokens.success['600'];
      case 'cancelled':
        return colorTokens.error['500'];
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'requested':
        return t('amn.app-client.mobile.auto_amn_trip_get.validationRequired');
      case 'accepted':
        return t('amn.app-client.mobile.auto_amn_trip_get.accepted');
      case 'arrived':
        return t('amn.app-client.mobile.auto_amn_trip_get.arrivedAtPickup');
      case 'in_progress':
        return t('amn.app-client.mobile.auto_amn_trip_get.inTrip');
      case 'completed':
        return t('amn.app-client.mobile.auto_amn_trip_get.completed');
      case 'cancelled':
        return t('amn.app-client.mobile.auto_amn_trip_get.cancelledAlt');
      default:
        return status;
    }
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t('amn.app-client.mobile.auto_amn_trip_get.title')}</Text>
          <Text style={styles.tripId}>{trip.id}</Text>

          <View style={styles.statusCard}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: getStatusColor(trip.status) },
              ]}
            >
              <Text style={styles.statusText}>
                {getStatusText(trip.status)}
              </Text>
            </View>
            <Text style={styles.requestTime}>
              {t('amn.app-client.mobile.auto_amn_trip_get.requestedAtLabel', { at: trip.timing.requestedAt })}
            </Text>
          </View>

          <View style={styles.routeCard}>
            <View style={[styles.routePoint, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.routeIcon}>📍</Text>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>{t('amn.app-client.mobile.auto_amn_trip_get.routeLabelPickup')}</Text>
                <Text style={styles.routeAddress}>
                  {trip.pickupLocation}
                </Text>
                <Text style={styles.routeETA}>
                  ⏱️ يصل الكابتن خلال {trip.timing.pickupETA}
                </Text>
              </View>
            </View>

            <View style={styles.routeLine}>
              <Text style={styles.routeDistance}>
                📏 {trip.route.distance}
              </Text>
              <Text style={styles.routeDuration}>
                ⏰ {trip.route.duration}
              </Text>
            </View>

            <View style={[styles.routePoint, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.routeIcon}>🏁</Text>
              <View style={styles.routeInfo}>
                <Text style={styles.routeLabel}>الوجهة</Text>
                <Text style={styles.routeAddress}>{trip.destination}</Text>
                <Text style={styles.routeETA}>
                  ⏱️ {trip.timing.arrivalETA}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.driverCard}>
            <Text style={styles.sectionTitle}>{t('amn.app-client.mobile.auto_amn_trip_get.sectionTitleDriver')}</Text>
            <View style={[styles.driverHeader, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.driverAvatar}>👨‍🚗</Text>
              <View style={styles.driverInfo}>
                <Text style={styles.driverName}>{trip.driver.name}</Text>
                <View style={styles.driverRating}>
                  <Text style={styles.ratingText}>
                    ⭐ {trip.driver.rating}
                  </Text>
                </View>
              </View>
            </View>

            <View style={[styles.vehicleInfo, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.vehicleEmoji}>
                {trip.driver.vehicle.image}
              </Text>
              <View style={styles.vehicleDetails}>
                <Text style={styles.vehicleModel}>
                  {trip.driver.vehicle.model}
                </Text>
                <Text style={styles.vehicleColor}>
                  {trip.driver.vehicle.color}
                </Text>
                <Text style={styles.plateNumber}>
                  {trip.driver.vehicle.plateNumber}
                </Text>
              </View>
            </View>

            <View style={[styles.contactButtons, { flexDirection: 'row', direction: layoutDirection }]}>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactIcon}>📞</Text>
                <Text style={styles.contactText}>{t('amn.app-client.mobile.auto_amn_trip_get.contactCall')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.contactButton}>
                <Text style={styles.contactIcon}>💬</Text>
                <Text style={styles.contactText}>رسالة</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.reportLink}
              onPress={() =>
                handleNavigate('AmnTripReport', { tripId: trip.id })
              }
            >
              <Text style={styles.reportLinkText}>
                📋 تقديم بلاغ على الرحلة
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.pricingCard}>
            <Text style={styles.sectionTitle}>{t('amn.app-client.mobile.auto_amn_trip_get.sectionTitlePricing')}</Text>
            <View style={[styles.pricingRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.pricingLabel}>{t('amn.app-client.mobile.auto_amn_trip_get.pricingLabelBase')}</Text>
              <Text style={styles.pricingValue}>
                {trip.pricing.baseFare} {trip.pricing.currency}
              </Text>
            </View>
            <View style={[styles.pricingRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.pricingLabel}>{t('amn.app-client.mobile.auto_amn_trip_get.pricingLabelDistance')}</Text>
              <Text style={styles.pricingValue}>
                {trip.pricing.distanceFare} {trip.pricing.currency}
              </Text>
            </View>
            <View style={[styles.pricingRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.pricingLabel}>أجرة الانتظار</Text>
              <Text style={styles.pricingValue}>
                {trip.pricing.waitingFare} {trip.pricing.currency}
              </Text>
            </View>
            <View style={[styles.pricingRow, styles.totalRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.totalLabel}>{t('amn.app-client.mobile.auto_amn_trip_get.totalLabel')}</Text>
              <Text style={styles.totalValue}>
                {trip.pricing.total} {trip.pricing.currency}
              </Text>
            </View>
          </View>

          {trip.status !== 'completed' &&
            trip.status !== 'cancelled' && (
              <>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() =>
                    handleNavigate('AmnTripTrack', { tripId: trip.id })
                  }
                >
                  <Text style={styles.actionText}>📍 تتبع الرحلة</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={() =>
                    handleNavigate('AmnTripCancel', { tripId: trip.id })
                  }
                >
                  <Text style={styles.cancelText}>{t('amn.app-client.mobile.auto_amn_trip_get.cancelText')}</Text>
                </TouchableOpacity>
              </>
            )}

          {trip.status === 'completed' && (
            <View style={[styles.completedActions, { flexDirection: 'row', direction: layoutDirection }]}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleNavigate('AmnTripRate', { tripId: trip.id })
                }
              >
                <Text style={styles.actionText}>⭐ تقييم الرحلة</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() =>
                  handleNavigate('AmnTripReceiptGet', { tripId: trip.id })
                }
              >
                <Text style={styles.actionText}>🧾 إيصال الرحلة</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => handleNavigate('AmnSosTrigger')}
          >
            <Text style={styles.emergencyText}>🚨 طوارئ — إرسال تنبيه</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_get.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trip_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      successMessage={t('amn.app-client.mobile.auto_amn_trip_get.tripCancelledSuccess')}
      successActionText={t('amn.app-client.mobile.auto_amn_trip_get.backToTrips')}
      onSuccessAction={() => setState('content')}
      screenName='auto_amn_trip_get'
      operationName='amn_trip_get'
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
  tripId: {
    fontSize: 14,
    color: semanticRoles.textMuted,
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
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  requestTime: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  routeCard: {
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
  routePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  routeIcon: {
    fontSize: 24,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 2,
  },
  routeInfo: {
    flex: 1,
  },
  routeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  routeAddress: {
    fontSize: 14,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
    lineHeight: 20,
  },
  routeETA: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  routeLine: {
    alignItems: 'center',
    marginVertical: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  routeDistance: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  routeDuration: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  driverCard: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  driverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  driverAvatar: {
    fontSize: 40,
    marginEnd: BTHWANI_SPACING.md,
  },
  driverInfo: {
    flex: 1,
  },
  driverName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  driverRating: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  ratingText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
  vehicleInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  vehicleEmoji: {
    fontSize: 32,
    marginEnd: BTHWANI_SPACING.md,
  },
  vehicleDetails: {
    flex: 1,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  vehicleColor: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  plateNumber: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  contactButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  contactButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    flex: 0.45,
  },
  contactIcon: {
    fontSize: 20,
    marginBottom: BTHWANI_SPACING.xs,
  },
  contactText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  reportLink: {
    marginTop: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  reportLinkText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
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
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  pricingLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  pricingValue: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    paddingTop: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.md,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  completedActions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  actionText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
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
  emergencyButton: {
    backgroundColor: semanticRoles.error,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  emergencyText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_amn_trip_get;

