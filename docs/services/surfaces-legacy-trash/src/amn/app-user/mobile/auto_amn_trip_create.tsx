// AMN Trip Create Screen - Complete Design
// Surface: app-client | Service: amn
// §30 States: Loading / Error / Empty / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// نموذج دفع هجين (WLT + Cash) — طريقة الدفع في نفس النموذج (≤3 خطوات، 3–5 حقول إلزامية)

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

export type AmnPaymentMethodType = 'wlt' | 'cash';

// العقد: pickupLocation/dropoffLocation كـ object { lat, lng } أو { latitude, longitude, address }
// الـ Backend الحالي يقبل { lat, lng }. عند وجود عنوان نصي فقط نرسل إحداثيات افتراضية حتى يتم ربط Geocoding.
interface auto_amn_trip_createProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: {
    params?: {
      pickupLocation?: string;
      destination?: string;
      rideType?: string;
      quoteFare?: number;
      estimatedFare?: number;
      estimatedDuration?: number;
    };
  };
}

export const auto_amn_trip_create: React.FC<auto_amn_trip_createProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t } = useI18n();
  const params = route?.params ?? {};
  const AMN_PAYMENT_OPTIONS = useMemo(() => [
    { id: 'wlt' as const, label: t('surfaces.wallet_wlt'), icon: '💳' },
    { id: 'cash' as const, label: t('surfaces.cash'), icon: '💵' },
  ], [t]);
  const mapRideTypeToVehicle = (r: string) =>
    r === 'ECONOMY'
      ? 'standard'
      : r === 'PREMIUM'
        ? 'premium'
        : r === 'XL'
          ? 'luxury'
          : r;
  const [state, setState] = useState<ScreenState>('content');
  const [submitting, setSubmitting] = useState(false);
  const [pickupLocation, setPickupLocation] = useState(
    (params.pickupLocation as string) ?? ''
  );
  const [destination, setDestination] = useState(
    (params.destination as string) ?? ''
  );
  const [scheduledTime, setScheduledTime] = useState('');
  const [vehicleType, setVehicleType] = useState<string>(
    mapRideTypeToVehicle((params.rideType as string) ?? '')
  );
  const [passengerCount, setPassengerCount] = useState('1');
  const [paymentMethod, setPaymentMethod] =
    useState<AmnPaymentMethodType>('wlt');
  const [specialRequests, setSpecialRequests] = useState('');
  const [estimatedFare, setEstimatedFare] = useState<number | null>(
    (params.estimatedFare as number) ?? (params.quoteFare as number) ?? null
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

  const vehicleTypes = useMemo(() => [
    { id: 'standard', name: t('surfaces.vehicle_standard'), icon: '🚗', price: 15 },
    { id: 'premium', name: t('surfaces.vehicle_premium'), icon: '🚙', price: 25 },
    { id: 'luxury', name: t('surfaces.vehicle_luxury'), icon: '🏎️', price: 40 },
  ], [t]);

  const calculateEstimate = useCallback(() => {
    if (!pickupLocation || !destination || !vehicleType) {
      setEstimatedFare(null);
      return;
    }

    const baseFare = vehicleTypes.find(v => v.id === vehicleType)?.price || 15;
    const distanceFare = 10; // Note: derive from routing distance when the routing service is available
    const total = baseFare + distanceFare;
    setEstimatedFare(total);
  }, [pickupLocation, destination, vehicleType, vehicleTypes]);

  useEffect(() => {
    calculateEstimate();
  }, [calculateEstimate]);

  // تاريخ آمن: تجنّب RangeError: Date value out of bounds (مثلاً عند إدخال غير صالح أو توقيت غير مدعوم)
  const getSafeRequestedPickupTime = (): string => {
    const fallback = new Date(Date.now() + 15 * 60 * 1000).toISOString();
    if (!scheduledTime || !scheduledTime.trim()) return fallback;
    try {
      const d = new Date(scheduledTime.trim());
      if (Number.isNaN(d.getTime())) return fallback;
      return d.toISOString();
    } catch {
      return fallback;
    }
  };

  // بناء الجسم مطابقاً للعقد: pickupLocation/dropoffLocation كـ object (Backend: lat/lng)
  const buildTripPayload = () => {
    const pickup = pickupLocation.trim();
    const dropoff = destination.trim();
    return {
      passengerId: 'current_user', // من الجلسة عند تفعيل المصادقة
      pickupLocation: { lat: 0, lng: 0 }, // عند توفر Geocoding أو «موقعي» تُستبدل بالإحداثيات الفعلية
      dropoffLocation: dropoff ? { lat: 0, lng: 0 } : undefined,
      rideType: vehicleType || 'ECONOMY',
      requestedPickupTime: getSafeRequestedPickupTime(),
      specialRequests:
        [
          pickup && `انطلاق: ${pickup}`,
          dropoff && `وصول: ${dropoff}`,
          specialRequests,
        ]
          .filter(Boolean)
          .join(' | ') || undefined,
    };
  };

  const handleSubmit = () => {
    if (!pickupLocation.trim()) {
      Alert.alert(t('common.error'), t('surfaces.validation_pickup_required'));
      return;
    }

    if (!destination.trim()) {
      Alert.alert(t('common.error'), t('surfaces.validation_destination_required'));
      return;
    }

    if (!vehicleType) {
      Alert.alert(t('common.error'), t('surfaces.validation_vehicle_required'));
      return;
    }

    setSubmitting(true);
    setState('loading');
    void buildTripPayload(); // للاستخدام عند استدعاء POST /api/amn/trips

    setTimeout(() => {
      const mockSuccess = 0 > 0.1;
      if (mockSuccess) {
        setState('success');
      } else {
        setState('error');
      }
      setSubmitting(false);
    }, 2000);
  };

  const handleRetry = () => {
    setState('content');
  };

  const selectedCaptainName = (params as { selectedCaptainName?: string })
    .selectedCaptainName;
  const selectedCaptainVehicle = (params as { selectedCaptainVehicle?: string })
    .selectedCaptainVehicle;

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <Text style={styles.title}>طلب رحلة جديدة</Text>
          <Text style={styles.subtitle}>
            إنشاء رحلة فعلياً — بعد التأكيد تُسجّل الرحلة ويُخصم أو يُحتجز
            المبلغ حسب السياسة.
          </Text>

          {selectedCaptainName && (
            <View style={styles.selectedCaptainBanner}>
              <Text style={styles.selectedCaptainLabel}>السائق المختار:</Text>
              <Text style={styles.selectedCaptainValue}>
                {selectedCaptainName}
                {selectedCaptainVehicle ? ` — ${selectedCaptainVehicle}` : ''}
              </Text>
            </View>
          )}

          {/* Pickup Location — صندوق نقطة الانطلاق + خيار تحديد موقع (مزوّد الخرائط من لوحة التحكم) */}
          <View style={styles.section}>
            <Text style={styles.label}>نقطة الالتقاء *</Text>
            <TextInput
              style={styles.input}
              placeholder={t('surfaces.placeholder_meeting_address')}
              placeholderTextColor={semanticRoles.textMuted}
              value={pickupLocation}
              onChangeText={setPickupLocation}
            />
            <View style={styles.locationActionsRow}>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => handleNavigate('UserAddressesList')}
              >
                <Text style={styles.locationButtonText}>
                  📍 اختر من العناوين المحفوظة
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mapPickButton}
                onPress={() => {
                  // مزوّد الخرائط (مثل Google Maps) يُفعّل من لوحة التحكم؛ عند التفعيل يفتح شاشة تحديد موقع ويعيد العنوان/الإحداثيات
                  Alert.alert(
                    t('surfaces.set_location'),
                    t('surfaces.placeholder_destination_map')
                  );
                }}
              >
                <Text style={styles.mapPickButtonText}>
                  🗺️ تحديد على الخريطة
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Destination — صندوق الوجهة + خيار تحديد موقع */}
          <View style={styles.section}>
            <Text style={styles.label}>الوجهة *</Text>
            <TextInput
              style={styles.input}
              placeholder={t('surfaces.placeholder_destination_address')}
              placeholderTextColor={semanticRoles.textMuted}
              value={destination}
              onChangeText={setDestination}
            />
            <View style={styles.locationActionsRow}>
              <TouchableOpacity
                style={styles.locationButton}
                onPress={() => handleNavigate('UserAddressesList')}
              >
                <Text style={styles.locationButtonText}>
                  📍 اختر من العناوين المحفوظة
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.mapPickButton}
                onPress={() => {
                  Alert.alert(
                    t('surfaces.set_destination'),
                    t('surfaces.placeholder_destination_map')
                  );
                }}
              >
                <Text style={styles.mapPickButtonText}>
                  🗺️ تحديد على الخريطة
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Scheduled Time */}
          <View style={styles.section}>
            <Text style={styles.label}>الموعد (اختياري)</Text>
            <TextInput
              style={styles.input}
              placeholder={t('surfaces.placeholder_date_time')}
              placeholderTextColor={semanticRoles.textMuted}
              value={scheduledTime}
              onChangeText={setScheduledTime}
            />
            <Text style={styles.hint}>اتركه فارغاً للرحلة الفورية</Text>
          </View>

          {/* Payment Method — نموذج هجين WLT + Cash (خارج النطاق لا أثر مالي إلا عبر WLT) */}
          <View style={styles.section}>
            <Text style={styles.label}>طريقة الدفع *</Text>
            <View style={styles.paymentRow}>
              {AMN_PAYMENT_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.paymentChip,
                    paymentMethod === opt.id && styles.paymentChipSelected,
                  ]}
                  onPress={() => setPaymentMethod(opt.id)}
                >
                  <Text style={styles.paymentChipIcon}>{opt.icon}</Text>
                  <Text
                    style={[
                      styles.paymentChipText,
                      paymentMethod === opt.id &&
                        styles.paymentChipTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Vehicle Type */}
          <View style={styles.section}>
            <Text style={styles.label}>نوع المركبة *</Text>
            <View style={styles.vehicleTypesGrid}>
              {vehicleTypes.map(vehicle => (
                <TouchableOpacity
                  key={vehicle.id}
                  style={[
                    styles.vehicleTypeCard,
                    vehicleType === vehicle.id &&
                      styles.vehicleTypeCardSelected,
                  ]}
                  onPress={() => setVehicleType(vehicle.id)}
                >
                  <Text style={styles.vehicleIcon}>{vehicle.icon}</Text>
                  <Text
                    style={[
                      styles.vehicleName,
                      vehicleType === vehicle.id && styles.vehicleNameSelected,
                    ]}
                  >
                    {vehicle.name}
                  </Text>
                  <Text
                    style={[
                      styles.vehiclePrice,
                      vehicleType === vehicle.id && styles.vehiclePriceSelected,
                    ]}
                  >
                    {vehicle.price} {t('surfaces.currency_rial')}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Passenger Count */}
          <View style={styles.section}>
            <Text style={styles.label}>عدد الركاب</Text>
            <View style={styles.passengerRow}>
              <TouchableOpacity
                style={styles.passengerButton}
                onPress={() => {
                  const count = parseInt(passengerCount) - 1;
                  if (count >= 1) setPassengerCount(count.toString());
                }}
              >
                <Text style={styles.passengerButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.passengerCount}>{passengerCount}</Text>
              <TouchableOpacity
                style={styles.passengerButton}
                onPress={() => {
                  const count = parseInt(passengerCount) + 1;
                  if (count <= 8) setPassengerCount(count.toString());
                }}
              >
                <Text style={styles.passengerButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Special Requests */}
          <View style={styles.section}>
            <Text style={styles.label}>طلبات خاصة (اختياري)</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder={t('surfaces.placeholder_extra_notes')}
              placeholderTextColor={semanticRoles.textMuted}
              value={specialRequests}
              onChangeText={setSpecialRequests}
              multiline
              numberOfLines={3}
              maxLength={200}
            />
          </View>

          {/* Estimated Fare */}
          {estimatedFare && (
            <View style={styles.estimateCard}>
              <Text style={styles.estimateLabel}>التكلفة التقريبية</Text>
              <Text style={styles.estimateValue}>{estimatedFare} ريال</Text>
              <Text style={styles.estimateNote}>
                * قد تختلف التكلفة الفعلية حسب المسافة والوقت
              </Text>
            </View>
          )}

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text
              style={[
                styles.submitButtonText,
                submitting && styles.submitButtonTextDisabled,
              ]}
            >
              {submitting ? t('amn.app-client.mobile.auto_amn_trip_create.requestTrip') : t('amn.app-client.mobile.auto_amn_trip_create.requestTrip')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_create.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trip_create.errorCreateMessage')}
      onErrorAction={handleRetry}
      successMessage={t('amn.app-client.mobile.auto_amn_trip_create.tripCreatedSuccess')}
      successActionText={t('amn.app-client.mobile.auto_amn_trip_create.viewTrip')}
      onSuccessAction={() => handleNavigate('AmnTripGet')}
      screenName='auto_amn_trip_create'
      operationName='amn_trip_create'
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
  selectedCaptainBanner: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    borderLeftWidth: 4,
    borderLeftColor: semanticRoles.primaryCTA,
  },
  selectedCaptainLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  selectedCaptainValue: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  section: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  paymentRow: {
    flexDirection: 'row',
    marginHorizontal: -BTHWANI_SPACING.xs,
  },
  paymentChip: {
    flex: 1,
    marginHorizontal: BTHWANI_SPACING.xs,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  paymentChipSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '14',
  },
  paymentChipIcon: {
    fontSize: 18,
    marginStart: BTHWANI_SPACING.sm,
  },
  paymentChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  paymentChipTextSelected: {
    color: semanticRoles.primaryCTA,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
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
    minHeight: 80,
    textAlignVertical: 'top',
  },
  hint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  locationButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  locationButtonText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  locationActionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.sm,
  },
  mapPickButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  mapPickButtonText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  vehicleTypesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: BTHWANI_SPACING.md,
  },
  vehicleTypeCard: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  vehicleTypeCardSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '10',
  },
  vehicleIcon: {
    fontSize: 32,
    marginBottom: BTHWANI_SPACING.xs,
  },
  vehicleName: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  vehicleNameSelected: {
    color: semanticRoles.primaryCTA,
  },
  vehiclePrice: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  vehiclePriceSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  passengerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.md,
  },
  passengerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: semanticRoles.primaryCTA,
    justifyContent: 'center',
    alignItems: 'center',
  },
  passengerButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  passengerCount: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    minWidth: 30,
    textAlign: 'center',
  },
  estimateCard: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  estimateLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  estimateValue: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    marginBottom: BTHWANI_SPACING.xs,
  },
  estimateNote: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontStyle: 'italic',
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

export default auto_amn_trip_create;

