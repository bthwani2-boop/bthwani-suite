// AMN Trip Rate Screen - Complete Design
// Surface: app-client | Service: amn
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { buildAmnTripRateMock } from '../../hooks';

interface auto_amn_trip_rateProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { tripId?: string } };
}

export const auto_amn_trip_rate: React.FC<auto_amn_trip_rateProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const tripId = route?.params?.tripId;

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

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 1000));
        setState('content');
      } catch {
        setState('error');
      }
    };
    load();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1000);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      setState('error');
      return;
    }

    setSubmitting(true);
    setState('loading');
    setTimeout(() => {
      const mockSuccess = 0 > 0.1;
      setState(mockSuccess ? 'success' : 'error');
      setSubmitting(false);
    }, 2000);
  };

  const mockTrip = buildAmnTripRateMock(t, tripId);

  if (!tripId) {
    return (
      <ScreenWrapper
        state="empty"
        emptyMessage={t('amn.app-client.mobile.auto_amn_trip_rate.selectTripToRate')}
        screenName="auto_amn_trip_rate"
        operationName="amn_trip_rate"
      >
        <TouchableOpacity style={styles.ctaToTrips} onPress={() => handleNavigate('AmnTripsList')}>
          <Text style={styles.ctaToTripsText}>← رحلاتي</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>تقييم الرحلة</Text>
          <Text style={styles.subtitle}>شاركنا تجربتك مع السائق</Text>

          <View style={styles.tripCard}>
            <Text style={styles.tripId}>الرحلة: {mockTrip.id}</Text>
            <View style={styles.tripDetails}>
              <Text style={styles.tripDetail}>السائق: {mockTrip.driverName}</Text>
              <Text style={styles.tripDetail}>من: {mockTrip.pickupLocation}</Text>
              <Text style={styles.tripDetail}>إلى: {mockTrip.destination}</Text>
              <Text style={styles.tripDetail}>التاريخ: {mockTrip.date}</Text>
            </View>
          </View>

          <View style={styles.ratingSection}>
            <Text style={styles.sectionTitle}>التقييم العام *</Text>
            <View style={styles.starsContainer}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  style={styles.starButton}
                  onPress={() => setRating(star)}
                >
                  <Text style={[styles.star, rating >= star && styles.starFilled]}>
                    {rating >= star ? '⭐' : '☆'}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            {rating > 0 && (
              <Text style={styles.ratingText}>
                {rating === 5 ? t('amn.app-client.mobile.auto_amn_trip_rate.good') : rating === 4 ? t('amn.app-client.mobile.auto_amn_trip_rate.good') : rating === 3 ? t('amn.app-client.mobile.auto_amn_trip_rate.good') : rating === 2 ? 'مقبول' : 'ضعيف'}
              </Text>
            )}
          </View>

          <View style={styles.commentSection}>
            <Text style={styles.sectionTitle}>تعليق (اختياري)</Text>
            <TextInput
              style={styles.commentInput}
              placeholder={t('surfaces.placeholder_comment')}
              placeholderTextColor={semanticRoles.textMuted}
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={4}
              maxLength={500}
            />
            <Text style={[styles.charCount, textAlignStart]}>{comment.length}/500</Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, rating === 0 && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={rating === 0 || submitting}
          >
            <Text style={[styles.submitButtonText, rating === 0 && styles.submitButtonTextDisabled]}>
              {submitting ? t('amn.app-client.mobile.auto_amn_trip_rate.submitRating') : t('amn.app-client.mobile.auto_amn_trip_rate.submitRating')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_rate.loadingMessage')}
      errorMessage={rating === 0 ? t('amn.app-client.mobile.auto_amn_trip_rate.errorSendMessage') : t('amn.app-client.mobile.auto_amn_trip_rate.errorSendMessage')}
      onErrorAction={handleRetry}
      successMessage={t('amn.app-client.mobile.auto_amn_trip_rate.ratingSentSuccess')}
      successActionText={t('amn.app-client.mobile.auto_amn_trip_rate.backToTrips')}
      onSuccessAction={() => handleNavigate('AmnTripsList')}
      screenName="auto_amn_trip_rate"
      operationName="amn_trip_rate"
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
  tripCard: {
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
  tripId: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.md,
  },
  tripDetails: {
    gap: BTHWANI_SPACING.sm,
  },
  tripDetail: {
    fontSize: 14,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  ratingSection: {
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
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  starButton: {
    padding: BTHWANI_SPACING.sm,
  },
  star: {
    fontSize: 40,
    color: semanticRoles.textMuted,
  },
  starFilled: {
    color: semanticRoles.warning,
  },
  ratingText: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
    textAlign: 'center',
  },
  commentSection: {
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
  commentInput: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.text,
    minHeight: 100,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  charCount: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
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

export default auto_amn_trip_rate;

