// amn_captain_trip_assigned_get — تفاصيل الرحلة المعينة للكابتن (activate / verify / complete)
// Surface: app-captain | Service: amn
// عمليات: amn_trip_activate, amn_trip_verify, amn_trip_complete

import React, { useMemo, useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { ArrivalBellCaptainBlock } from '../../../dsh/components/ArrivalBellCaptainBlock';

type TripStage = 'assigned' | 'en_route' | 'at_pickup' | 'in_progress' | 'completed';

interface AutoAmnCaptainTripAssignedGetProps {
  navigation?: { navigate: (screen: string) => void; goBack: () => void };
  route?: { params?: { tripId?: string } };
}

export const AutoAmnCaptainTripAssignedGet: React.FC<AutoAmnCaptainTripAssignedGetProps> = ({
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const tripId = route?.params?.tripId as string | undefined;
  const [stage, setStage] = useState<TripStage>('assigned');
  const [submitting, setSubmitting] = useState(false);
  const [tripDetails, setTripDetails] = useState<{
    pickup: string;
    dropoff: string;
    passengerName: string;
    estimatedFare: number;
  } | null>(null);

  useEffect(() => {
    if (tripId) {
      // Mock: جلب تفاصيل الرحلة
      setTripDetails({
        pickup: t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.mockPickupAddress'),
        dropoff: t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.mockDropoffAddress'),
        passengerName: t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.passengerLabel'),
        estimatedFare: 45,
      });
    }
  }, [tripId]);

  const handleActivate = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setStage('en_route');
      setSubmitting(false);
    }, 1000);
  }, [submitting]);

  const handleVerify = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    setTimeout(() => {
      setStage('in_progress');
      setSubmitting(false);
    }, 1000);
  }, [submitting]);

  const handleComplete = useCallback(() => {
    if (submitting) return;
    Alert.alert(
      t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.endTripTitle'),
      t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.confirmEndTripMessage'),
      [
        { text: t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.cancelButton'), style: 'cancel' },
        {
          text: t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.endButton'),
          onPress: () => {
            setSubmitting(true);
            setTimeout(() => {
              setStage('completed');
              setSubmitting(false);
              Alert.alert(t('surfaces.done'), t('messages.changesSaved'), [
                { text: t('common.ok'), onPress: () => navigation?.navigate?.('Home') },
              ]);
            }, 1200);
          },
        },
      ]
    );
  }, [submitting, navigation]);

  if (!tripId) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>لا توجد رحلة معينة</Text>
          <Text style={styles.emptySubtitle}>اختر عرضاً من قائمة العروض وقبله لرؤية الرحلة هنا.</Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => navigation?.navigate?.('amn_captain_offers_list')}
          >
            <Text style={styles.ctaButtonText}>قائمة العروض</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={() => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home'))}>
            <Text style={styles.backLinkText}>← الرئيسية</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  const getStageLabel = (s: TripStage) => {
    switch (s) {
      case 'assigned': return t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.statusAssigned');
      case 'en_route': return t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.statusOnTheWay');
      case 'at_pickup': return t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.statusAtPickup');
      case 'in_progress': return t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.statusInProgress');
      case 'completed': return t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.statusCompleted');
      default: return s;
    }
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={[styles.title, textAlignStart]}>الرحلة المعينة</Text>
          <Text style={styles.tripId}>#{String(tripId).slice(-6)}</Text>
        </View>
        <View style={[styles.stageBadge, { backgroundColor: semanticRoles.primaryCTA }]}>
          <Text style={styles.stageText}>{getStageLabel(stage)}</Text>
        </View>

        {tripDetails && (
          <>
            <View style={styles.card}>
              <Text style={[styles.cardLabel, textAlignStart]}>نقطة الانطلاق</Text>
              <Text style={[styles.cardValue, textAlignStart]}>{tripDetails.pickup}</Text>
            </View>
            <View style={styles.card}>
              <Text style={[styles.cardLabel, textAlignStart]}>الوجهة</Text>
              <Text style={[styles.cardValue, textAlignStart]}>{tripDetails.dropoff}</Text>
            </View>
            <View style={styles.card}>
              <Text style={[styles.cardLabel, textAlignStart]}>الراكب</Text>
              <Text style={[styles.cardValue, textAlignStart]}>{tripDetails.passengerName}</Text>
            </View>
            <View style={styles.card}>
              <Text style={[styles.cardLabel, textAlignStart]}>الأجر التقديري</Text>
              <Text style={[styles.fareValue, textAlignStart]}>{tripDetails.estimatedFare} ريال</Text>
            </View>
          </>
        )}

        {(stage === 'en_route' || stage === 'at_pickup' || stage === 'in_progress') && (
          <ArrivalBellCaptainBlock orderId={tripId} serviceLabel={t('surfaces.trip')} />
        )}

        <View style={styles.actions}>
          {stage === 'assigned' && (
            <TouchableOpacity
              style={[styles.primaryButton, submitting && styles.buttonDisabled]}
              onPress={handleActivate}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.actionStartTrip') : t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.actionStartTrip')}
              </Text>
            </TouchableOpacity>
          )}
          {(stage === 'en_route' || stage === 'at_pickup') && (
            <TouchableOpacity
              style={[styles.primaryButton, submitting && styles.buttonDisabled]}
              onPress={handleVerify}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.confirmArrivalStartMessage') : t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.confirmArrivalStartMessage')}
              </Text>
            </TouchableOpacity>
          )}
          {stage === 'in_progress' && (
            <TouchableOpacity
              style={[styles.primaryButton, submitting && styles.buttonDisabled]}
              onPress={handleComplete}
              disabled={submitting}
            >
              <Text style={styles.primaryButtonText}>
                {submitting ? t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.actionEndTrip') : t('amn.app-captain.mobile.auto_amn_captain_trip_assigned_get.actionEndTrip')}
              </Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.backLink} onPress={() => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home'))}>
            <Text style={styles.backLinkText}>← رجوع</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: BTHWANI_SPACING.md },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.text, },
  tripId: { fontSize: 14, color: semanticRoles.textMuted },
  stageBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    marginBottom: BTHWANI_SPACING.lg,
  },
  stageText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardLabel: { fontSize: 12, color: semanticRoles.textMuted, marginBottom: BTHWANI_SPACING.xs, },
  cardValue: { fontSize: 16, color: semanticRoles.text, },
  fareValue: { fontSize: 18, fontWeight: '700', color: semanticRoles.primaryCTA, },
  actions: { marginTop: BTHWANI_SPACING.lg },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  backLink: { alignItems: 'center', padding: BTHWANI_SPACING.md },
  backLinkText: { fontSize: 14, color: semanticRoles.primaryCTA, fontWeight: '500' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: BTHWANI_SPACING.contentH },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: semanticRoles.text, marginBottom: BTHWANI_SPACING.sm },
  emptySubtitle: { fontSize: 14, color: semanticRoles.textMuted, marginBottom: BTHWANI_SPACING.lg, textAlign: 'center' },
  ctaButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
  },
  ctaButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontWeight: '600' },
});

export default AutoAmnCaptainTripAssignedGet;
