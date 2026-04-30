// AMN Trip Estimate — تقدير الرحلة (amn_estimate_create)
// Surface: app-client | Service: amn
// خطوة أولى: انطلاق + وصول + نوع → عرض السعر والوقت → تأكيد ينقل لطلب الرحلة

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
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface auto_amn_trip_estimateProps {
  onNavigate?: (screen: string) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

export const auto_amn_trip_estimate: React.FC<auto_amn_trip_estimateProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const rideTypes = useMemo(
    () => [
      { id: 'ECONOMY', name: t('amn.app-client.mobile.auto_amn_trip_estimate.economy') },
      { id: 'PREMIUM', name: t('amn.app-client.mobile.auto_amn_trip_estimate.premium') },
      { id: 'XL', name: t('amn.app-client.mobile.auto_amn_trip_estimate.family') },
    ],
    [t]
  );
  const [state, setState] = useState<ScreenState>('content');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState('ECONOMY');
  const [loading, setLoading] = useState(false);
  const [estimate, setEstimate] = useState<{
    estimatedFare: number;
    estimatedDuration: number;
    estimatedDistance: number;
    currency: string;
    /** وقت وصول الكابتن لنقطة الالتقاء (ETA) — دقائق */
    estimatedPickupMinutes?: number;
  } | null>(null);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        if (params)
          (
            navigation as { navigate: (s: string, p?: object) => void }
          ).navigate(screen, params);
        else navigation.navigate(screen);
      } else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  const handleGetEstimate = useCallback(() => {
    if (!pickup.trim()) return;
    setLoading(true);
    setEstimate(null);
    setTimeout(() => {
      const dist = 5 + 0 * 20;
      const fare = Math.round(
        dist * 3 + (rideType === 'PREMIUM' ? 15 : rideType === 'XL' ? 10 : 0)
      );
      const duration = Math.round(dist * 2.5);
      const estimatedPickupMinutes = 5 + Math.min(15, Math.floor(dist));
      setEstimate({
        estimatedFare: fare,
        estimatedDuration: duration,
        estimatedDistance: Math.round(dist * 10) / 10,
        currency: 'YER',
        estimatedPickupMinutes,
      });
      setLoading(false);
    }, 700);
  }, [pickup, destination, rideType]);

  const handleConfirmToTripCreate = useCallback(() => {
    handleNavigate('AmnTripCreate', {
      pickupLocation: pickup,
      destination,
      rideType,
      estimatedFare: estimate?.estimatedFare,
      estimatedDuration: estimate?.estimatedDuration,
    });
  }, [handleNavigate, pickup, destination, rideType, estimate]);

  return (
    <ScreenWrapper state='content'>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.title, textAlignStart]}>تقدير الرحلة</Text>
        <Text style={[styles.subtitle, textAlignStart]}>
          أدخل الانطلاق والوصول لعرض السعر والوقت المتوقع
        </Text>

        <View style={styles.section}>
          <Text style={[styles.label, textAlignStart]}>نقطة الانطلاق *</Text>
          <TextInput
            style={styles.input}
            placeholder={t('surfaces.pickup_address')}
            placeholderTextColor={semanticRoles.textMuted}
            value={pickup}
            onChangeText={setPickup}
          />
          <TouchableOpacity
            style={styles.mapPickBtn}
            onPress={() =>
              Alert.alert(
                t('amn.app-client.mobile.auto_amn_trip_estimate.setPickupLocation'),
                t('amn.app-client.mobile.auto_amn_trip_estimate.pickupLocationMapHint')
              )
            }
          >
            <Text style={styles.mapPickBtnText}>🗺️ تحديد على الخريطة</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={[styles.label, textAlignStart]}>الوجهة (اختياري)</Text>
          <TextInput
            style={styles.input}
            placeholder={t('surfaces.dropoff_address')}
            placeholderTextColor={semanticRoles.textMuted}
            value={destination}
            onChangeText={setDestination}
          />
          <TouchableOpacity
            style={styles.mapPickBtn}
            onPress={() =>
              Alert.alert(
                t('amn.app-client.mobile.auto_amn_trip_estimate.setDropoffLocation'),
                t('amn.app-client.mobile.auto_amn_trip_estimate.dropoffLocationMapHint')
              )
            }
          >
            <Text style={styles.mapPickBtnText}>🗺️ تحديد على الخريطة</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.section}>
          <Text style={[styles.label, textAlignStart]}>نوع الخدمة</Text>
          <View style={styles.chipRow}>
            {rideTypes.map((ride) => (
              <TouchableOpacity
                key={ride.id}
                style={[styles.chip, rideType === ride.id && styles.chipSelected]}
                onPress={() => setRideType(ride.id)}
              >
                <Text
                  style={[
                    styles.chipText,
                    rideType === ride.id && styles.chipTextSelected,
                  ]}
                >
                  {ride.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.primaryButton,
            (loading || !pickup.trim()) && styles.primaryButtonDisabled,
          ]}
          onPress={handleGetEstimate}
          disabled={loading || !pickup.trim()}
        >
          <Text style={styles.primaryButtonText}>
            {loading
              ? t('amn.app-client.mobile.auto_amn_trip_estimate.calculateEstimate')
              : t('amn.app-client.mobile.auto_amn_trip_estimate.calculateEstimate')}
          </Text>
        </TouchableOpacity>

        {estimate && (
          <View style={styles.estimateCard}>
            <Text style={[styles.estimateLabel, textAlignStart]}>التقدير</Text>
            <Text style={[styles.estimateFare, textAlignStart]}>
              {estimate.estimatedFare} {estimate.currency}
            </Text>
            <Text style={[styles.estimateMeta, textAlignStart]}>
              ~{estimate.estimatedDuration} دقيقة · ~
              {estimate.estimatedDistance} كم
            </Text>
            {estimate.estimatedPickupMinutes != null && (
              <Text style={[styles.estimateEta, textAlignStart]}>
                يصل الكابتن خلال ~{estimate.estimatedPickupMinutes} دقيقة
              </Text>
            )}
            <TouchableOpacity
              style={styles.confirmCta}
              onPress={handleConfirmToTripCreate}
            >
              <Text style={styles.confirmCtaText}>تأكيد وطلب الرحلة</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity
          style={styles.altLink}
          onPress={() => handleNavigate('AmnTripCreate')}
        >
          <Text style={styles.altLinkText}>طلب رحلة — أدخل كل التفاصيل</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  scrollContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.sm,
  },
  section: { marginTop: BTHWANI_SPACING.lg },
  label: {
    fontSize: 14,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: BTHWANI_SPACING.sm },
  chip: {
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  chipSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '15',
  },
  chipText: { fontSize: 14, color: semanticRoles.text },
  chipTextSelected: { color: semanticRoles.primaryCTA, fontWeight: '600' },
  mapPickBtn: {
    marginTop: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  mapPickBtnText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  estimateCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginTop: BTHWANI_SPACING.xl,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '40',
  },
  estimateLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  estimateFare: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginTop: BTHWANI_SPACING.xs,
  },
  estimateMeta: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  estimateEta: {
    fontSize: 13,
    color: semanticRoles.primaryCTA,
    marginTop: BTHWANI_SPACING.sm,
  },
  confirmCta: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.lg,
  },
  confirmCtaText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  altLink: { marginTop: BTHWANI_SPACING.xl, alignItems: 'center' },
  altLinkText: { fontSize: 14, color: semanticRoles.primaryCTA },
});

export default auto_amn_trip_estimate;

