// amn_captain_offer_respond — استجابة الكابتن لعرض رحلة
// Surface: app-captain | Service: amn
// يستقبل offerId و tripId وتفاصيل العرض من route.params؛ يعرض التفاصيل وأزرار قبول/رفض.

import React, { useMemo, useState, useCallback } from 'react';
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

interface AutoAmnCaptainOfferRespondProps {
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void; goBack: () => void };
  route?: { params?: Record<string, unknown> };
}

export const AutoAmnCaptainOfferRespond: React.FC<AutoAmnCaptainOfferRespondProps> = ({
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const params = route?.params ?? {};
  const offerId = params.offerId as string | undefined;
  const tripId = params.tripId as string | undefined;
  const pickup = (params.pickup_location as string) ?? '';
  const dropoff = (params.dropoff_location as string) ?? '';
  const fare = (params.estimated_fare as number) ?? 0;
  const passengerName = (params.passenger_name as string) ?? '';
  const passengerPhone = (params.passenger_phone as string) ?? '';
  const distanceKm = (params.distance_km as number) ?? 0;
  const duration = (params.estimated_duration as number) ?? 0;

  const [submitting, setSubmitting] = useState(false);

  const handleAccept = useCallback(() => {
    if (submitting) return;
    setSubmitting(true);
    // Mock: استدعاء API قبول العرض ثم التوجيه لشاشة الرحلة المعينة
    setTimeout(() => {
      setSubmitting(false);
      if (navigation?.navigate && tripId) {
        navigation.navigate('amn_captain_trip_assigned_get', { tripId });
      } else {
        if (typeof navigation?.goBack === 'function') navigation.goBack();
        else navigation?.navigate?.('Home');
      }
    }, 1200);
  }, [submitting, navigation, tripId]);

  const handleReject = useCallback(() => {
    if (submitting) return;
    Alert.alert(
      t('amn.captain.offers.rejectTitle'),
      t('amn.captain.offers.rejectConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('amn.captain.offers.reject'),
          style: 'destructive',
          onPress: () => {
            setSubmitting(true);
            setTimeout(() => {
              setSubmitting(false);
              if (typeof navigation?.goBack === 'function') navigation.goBack();
              else navigation?.navigate?.('Home');
            }, 800);
          },
        },
      ]
    );
  }, [submitting, navigation]);

  if (!offerId) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('amn.captain.offers.emptyTitle')}</Text>
          <Text style={styles.emptySubtitle}>{t('amn.captain.offers.emptySubtitle')}</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home'))}>
            <Text style={styles.backButtonText}>{t('amn.captain.offers.backToList')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={[styles.title, textAlignStart]}>{t('amn.captain.offers.offerDetails')}</Text>

        {passengerName ? (
          <View style={styles.card}>
            <Text style={[styles.cardLabel, textAlignStart]}>{t('amn.captain.offers.passenger')}</Text>
            <Text style={[styles.cardValue, textAlignStart]}>{passengerName}</Text>
            {passengerPhone ? (
              <Text style={[styles.cardValueSecondary, textAlignStart]}>{passengerPhone}</Text>
            ) : null}
          </View>
        ) : null}

        <View style={styles.card}>
          <Text style={[styles.cardLabel, textAlignStart]}>{t('amn.captain.offers.from')}</Text>
          <Text style={[styles.cardValue, textAlignStart]} numberOfLines={2}>{pickup || '—'}</Text>
        </View>
        <View style={styles.card}>
          <Text style={[styles.cardLabel, textAlignStart]}>{t('amn.captain.offers.to')}</Text>
          <Text style={[styles.cardValue, textAlignStart]} numberOfLines={2}>{dropoff || '—'}</Text>
        </View>
        <View style={styles.row}>
          <View style={styles.cardHalf}>
            <Text style={[styles.cardLabel, textAlignStart]}>{t('amn.captain.offers.distance')}</Text>
            <Text style={[styles.cardValue, textAlignStart]}>{distanceKm ? t('amn.captain.offers.distanceKm', { value: String(distanceKm) }) : '—'}</Text>
          </View>
          <View style={styles.cardHalf}>
            <Text style={[styles.cardLabel, textAlignStart]}>{t('amn.captain.offers.estimatedDuration')}</Text>
            <Text style={[styles.cardValue, textAlignStart]}>{duration ? t('amn.captain.offers.durationMinutes', { value: String(duration) }) : '—'}</Text>
          </View>
        </View>
        <View style={styles.card}>
          <Text style={[styles.cardLabel, textAlignStart]}>{t('amn.captain.offers.estimatedFare')}</Text>
          <Text style={[styles.fareValue, textAlignStart]}>{fare ? t('amn.captain.offers.fareSar', { value: String(fare) }) : '—'}</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.acceptButton, submitting && styles.buttonDisabled]}
            onPress={handleAccept}
            disabled={submitting}
          >
            <Text style={styles.acceptButtonText}>
              {submitting ? t('amn.captain.offers.accepting') : t('amn.captain.offers.acceptOffer')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.rejectButton, submitting && styles.buttonDisabled]}
            onPress={handleReject}
            disabled={submitting}
          >
            <Text style={styles.rejectButtonText}>{t('amn.captain.offers.reject')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backLink} onPress={() => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home'))}>
            <Text style={styles.backLinkText}>← {t('amn.captain.offers.backToList')}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  content: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.lg,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  cardHalf: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.xs,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  row: { flexDirection: 'row', marginBottom: BTHWANI_SPACING.md },
  cardLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  cardValue: { fontSize: 16, color: semanticRoles.text, },
  cardValueSecondary: { fontSize: 14, color: semanticRoles.textMuted, marginTop: 2 },
  fareValue: { fontSize: 18, fontWeight: '700', color: semanticRoles.primaryCTA, },
  actions: { marginTop: BTHWANI_SPACING.lg },
  acceptButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  acceptButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
  rejectButton: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.sm,
  },
  rejectButtonText: { color: semanticRoles.error, fontSize: 16, fontWeight: '600' },
  buttonDisabled: { opacity: 0.6 },
  backLink: { alignItems: 'center', padding: BTHWANI_SPACING.md },
  backLinkText: { fontSize: 14, color: semanticRoles.primaryCTA, fontWeight: '500' },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: semanticRoles.text, marginBottom: BTHWANI_SPACING.sm },
  emptySubtitle: { fontSize: 14, color: semanticRoles.textMuted, marginBottom: BTHWANI_SPACING.lg, textAlign: 'center' },
  backButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  backButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontWeight: '600' },
});

export default AutoAmnCaptainOfferRespond;
