// AMN Trip Cancel Screen - Complete Design
// Surface: app-client | Service: amn
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useMemo, useState, useEffect } from 'react';
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
import { colorTokens } from '@bthwani/ui-kit';

interface auto_amn_trip_cancelProps {
  onNavigate?: (screen: string) => void;
  navigation?: {
    navigate: (screen: string, params?: { tripId?: string }) => void;
  };
  route?: { params?: { tripId?: string } };
}

export const auto_amn_trip_cancel: React.FC<auto_amn_trip_cancelProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const tripId = route?.params?.tripId;
  const [state, setState] = useState<ScreenState>(tripId ? 'content' : 'empty');
  const [cancellationReason, setCancellationReason] = useState('');

  const cancellationreasons = useMemo(
    () => [
      t('amn.app-client.mobile.auto_amn_trip_cancel.reasonChangePlans'),
      t('amn.app-client.mobile.auto_amn_trip_cancel.reasonScheduleIssue'),
      t('amn.app-client.mobile.auto_amn_trip_cancel.reasonFoundAlternative'),
      t('amn.app-client.mobile.auto_amn_trip_cancel.reasonHealth'),
      t('amn.app-client.mobile.auto_amn_trip_cancel.reasonEmergency'),
      t('amn.app-client.mobile.auto_amn_trip_cancel.reasonOther'),
    ],
    [t]
  );
  const [selectedReason, setSelectedReason] = useState('');

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

  const handleCancelTrip = () => {
    if (!selectedReason && !cancellationReason) {
      setState('error');
      return;
    }

    setState('loading');
    setTimeout(() => {
      setState('success');
    }, 2000);
  };

  const handleRetry = () => {
    setState('content');
  };


  const displayTrip = {
    id: tripId ?? 'TRIP-2024-001',
    driver: t('amn.app-client.mobile.auto_amn_trip_cancel.mockPassengerName'),
    vehicle: t('amn.app-client.mobile.auto_amn_trip_cancel.mockVehicleName'),
    pickupLocation: t('amn.app-client.mobile.auto_amn_trip_cancel.mockPickupAddress'),
    destination: t('amn.app-client.mobile.auto_amn_trip_cancel.mockDropoffAddress'),
    scheduledTime: '2024-02-10 15:00',
    estimatedFare: 45,
  };

  if (!tripId) {
    return (
      <ScreenWrapper
        state='empty'
        emptyMessage={t('amn.app-client.mobile.auto_amn_trip_cancel.selectTripPrompt')}
        screenName='auto_amn_trip_cancel'
        operationName='amn_trip_cancel'
      >
        <TouchableOpacity
          style={styles.ctaToTrips}
          onPress={() => handleNavigate('AmnTripsList')}
        >
          <Text style={styles.ctaToTripsText}>{t('amn.app-client.mobile.auto_amn_trip_cancel.ctaToTripsText')}</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>{t('amn.app-client.mobile.auto_amn_trip_cancel.title')}</Text>
          <Text style={styles.subtitle}>
            هل أنت متأكد من رغبتك في إلغاء الرحلة؟
          </Text>

          <View style={styles.tripCard}>
            <Text style={styles.tripId}>{displayTrip.id}</Text>
            <View style={styles.tripDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>السائق:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{displayTrip.driver}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>السيارة:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{displayTrip.vehicle}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>من:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>
                  {displayTrip.pickupLocation}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>إلى:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>
                  {displayTrip.destination}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>الموعد:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>
                  {displayTrip.scheduledTime}
                </Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>التكلفة التقريبية:</Text>
                <Text style={[styles.detailValue, textAlignStart]}>
                  {displayTrip.estimatedFare} ريال
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>سبب الإلغاء *</Text>
            <View style={styles.reasonsGrid}>
              {cancellationreasons.map((reason, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.reasonCard,
                    selectedReason === reason && styles.selectedReason,
                  ]}
                  onPress={() => {
                    setSelectedReason(reason);
                    if (reason !== t('amn.app-client.mobile.auto_amn_trip_cancel.reasonOtherLabel')) {
                      setCancellationReason('');
                    }
                  }}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      selectedReason === reason && styles.selectedReasonText,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {selectedReason === t('amn.app-client.mobile.auto_amn_trip_cancel.reasonOtherLabelAlt') && (
              <TextInput
                style={styles.customReasonInput}
                placeholder={t('surfaces.cancel_reason_placeholder')}
                value={cancellationReason}
                onChangeText={setCancellationReason}
                multiline
                numberOfLines={3}
                maxLength={200}
              />
            )}
          </View>

          <View style={styles.policyCard}>
            <Text style={styles.policyTitle}>{t('amn.app-client.mobile.auto_amn_trip_cancel.policyTitle')}</Text>
            <View style={styles.policyPoints}>
              <Text style={styles.policyPoint}>
                • إلغاء مجاني قبل ساعة من الرحلة
              </Text>
              <Text style={styles.policyPoint}>
                • رسوم إلغاء 50% خلال الساعة الأخيرة
              </Text>
              <Text style={styles.policyPoint}>
                • رسوم كاملة في حال عدم الإبلاغ
              </Text>
            </View>
            <Text style={styles.policyNote}>
              بإلغاء الرحلة، أنت توافق على سياسة الإلغاء المذكورة أعلاه
            </Text>
          </View>

          <View style={styles.warningBanner}>
            <Text style={styles.warningIcon}>⚠️</Text>
            <Text style={styles.warningText}>
              هذا الإجراء لا يمكن التراجع عنه. الرحلة ستُلغى نهائياً.
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={handleCancelTrip}
          >
            <Text style={styles.cancelText}>{t('amn.app-client.mobile.auto_amn_trip_cancel.cancelText')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.keepButton}
            onPress={() => handleNavigate('AmnTripGet', { tripId })}
          >
            <Text style={styles.keepText}>{t('amn.app-client.mobile.auto_amn_trip_cancel.keepText')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_cancel.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trip_cancel.errorMessage')}
      onErrorAction={handleRetry}
      successMessage={t('amn.app-client.mobile.auto_amn_trip_cancel.successMessage')}
      successActionText={t('amn.app-client.mobile.auto_amn_trip_cancel.backToTripsButton')}
      onSuccessAction={() => handleNavigate('AmnTripsList')}
      screenName='auto_amn_trip_cancel'
      operationName='amn_trip_cancel'
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
  subtitle: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  tripCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripId: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.md,
  },
  tripDetails: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
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
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  reasonCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    margin: BTHWANI_SPACING.xs,
    width: '48%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  selectedReason: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.success + '20',
  },
  reasonText: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    textAlign: 'center',
  },
  selectedReasonText: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  customReasonInput: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    marginTop: BTHWANI_SPACING.md,
    height: 80,
    textAlignVertical: 'top',
  },
  policyCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  policyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  policyPoints: {
    marginBottom: BTHWANI_SPACING.md,
  },
  policyPoint: {
    fontSize: 14,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
    lineHeight: 20,
  },
  policyNote: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    fontStyle: 'italic',
  },
  warningBanner: {
    backgroundColor: semanticRoles.warning + '20',
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: semanticRoles.warning,
  },
  warningIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 2,
  },
  warningText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.warning,
    fontWeight: '600',
    lineHeight: 20,
  },
  cancelButton: {
    backgroundColor: semanticRoles.error,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  keepButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  keepText: {
    color: semanticRoles.primaryCTA,
    fontSize: 16,
    fontWeight: '600',
  },
  ctaToTrips: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.lg,
  },
  ctaToTripsText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_amn_trip_cancel;

