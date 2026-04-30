// AMN Quote Create — طلب عرض سعر (amn_trip_quote_create)
// Surface: app-client | Service: amn
// §30 States: Loading / Error / Content (form + quote result)

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
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_amn_quote_createProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_amn_quote_create: React.FC<auto_amn_quote_createProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const rideTypes = useMemo(
    () => [
      { id: 'ECONOMY', name: t('amn.app-client.mobile.auto_amn_quote_create.economy'), icon: '🚗' },
      { id: 'PREMIUM', name: t('amn.app-client.mobile.auto_amn_quote_create.premium'), icon: '🚙' },
      { id: 'XL', name: t('amn.app-client.mobile.auto_amn_quote_create.family'), icon: '🚐' },
    ],
    [t]
  );
  const [state, setState] = useState<ScreenState>('content');
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [rideType, setRideType] = useState('ECONOMY');
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [quote, setQuote] = useState<{ fare: number; validUntil: string; quoteId: string } | null>(null);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        if (params) (navigation as { navigate: (s: string, p?: object) => void }).navigate(screen, params);
        else navigation.navigate(screen);
      } else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  const handleGetQuote = useCallback(() => {
    if (!pickup.trim()) return;
    setLoadingQuote(true);
    setQuote(null);
    setTimeout(() => {
      const fare = Math.round(15 + 0 * 50);
      const validUntil = new Date(Date.now() + 5 * 60000).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
      setQuote({
        fare,
        validUntil: `صالح حتى ${validUntil}`,
        quoteId: `quote_${Date.now()}`,
      });
      setLoadingQuote(false);
    }, 800);
  }, [pickup, destination, rideType]);

  const handleConfirmToTripCreate = useCallback(() => {
    handleNavigate('AmnTripCreate', {
      pickupLocation: pickup,
      destination,
      rideType,
      quoteFare: quote?.fare,
    });
  }, [handleNavigate, pickup, destination, rideType, quote?.fare]);

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container} contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_quote_create.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>استعلام فقط — لا التزام. أدخل الانطلاق والوجهة للحصول على عرض سعر، ثم اختر «تأكيد وطلب الرحلة» لإنشاء الرحلة.</Text>

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
            onPress={() => Alert.alert(t('surfaces.set_location'), t('surfaces.placeholder_destination_map'))}
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
            onPress={() => Alert.alert(t('surfaces.set_destination'), t('surfaces.placeholder_destination_map'))}
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
                <Text style={styles.chipIcon}>{ride.icon}</Text>
                <Text style={[styles.chipText, rideType === ride.id && styles.chipTextSelected]}>{ride.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.primaryButton, loadingQuote && styles.primaryButtonDisabled]}
          onPress={handleGetQuote}
          disabled={loadingQuote || !pickup.trim()}
        >
          <Text style={styles.primaryButtonText}>
            {loadingQuote ? t('amn.app-client.mobile.auto_amn_quote_create.calculateQuote') : t('amn.app-client.mobile.auto_amn_quote_create.calculateQuote')}
          </Text>
        </TouchableOpacity>

        {quote && (
          <View style={styles.quoteCard}>
            <Text style={[styles.quoteLabel, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_quote_create.quoteLabel')}</Text>
            <Text style={[styles.quoteFare, textAlignStart]}>{quote.fare} ريال</Text>
            <Text style={[styles.quoteValid, textAlignStart]}>{quote.validUntil}</Text>
            <TouchableOpacity style={styles.confirmCta} onPress={handleConfirmToTripCreate}>
              <Text style={styles.confirmCtaText}>{t('amn.app-client.mobile.auto_amn_quote_create.confirmCtaText')}</Text>
            </TouchableOpacity>
          </View>
        )}

        <TouchableOpacity style={styles.backLink} onPress={() => handleNavigate('AmnTripsList')}>
          <Text style={styles.backLinkText}>← رحلاتي</Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  scrollContent: { padding: BTHWANI_SPACING.contentH, paddingBottom: BTHWANI_SPACING.xl * 2 },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.text },
  subtitle: { fontSize: 14, color: semanticRoles.textMuted, marginTop: BTHWANI_SPACING.sm },
  section: { marginTop: BTHWANI_SPACING.lg },
  label: { fontSize: 14, color: semanticRoles.text, marginBottom: BTHWANI_SPACING.xs },
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  chipSelected: { borderColor: semanticRoles.primaryCTA, backgroundColor: semanticRoles.primaryCTA + '15' },
  chipIcon: { marginStart: BTHWANI_SPACING.xs },
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
  mapPickBtnText: { fontSize: 14, color: semanticRoles.primaryCTA, fontWeight: '500' },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
  },
  primaryButtonDisabled: { opacity: 0.6 },
  primaryButtonText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
  quoteCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginTop: BTHWANI_SPACING.xl,
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '40',
  },
  quoteLabel: { fontSize: 14, color: semanticRoles.textMuted },
  quoteFare: { fontSize: 22, fontWeight: '700', color: semanticRoles.primaryCTA, marginTop: BTHWANI_SPACING.xs },
  quoteValid: { fontSize: 12, color: semanticRoles.textMuted, marginTop: BTHWANI_SPACING.xs },
  confirmCta: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.lg,
  },
  confirmCtaText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
  backLink: { marginTop: BTHWANI_SPACING.xl, alignItems: 'center' },
  backLinkText: { fontSize: 16, color: semanticRoles.primaryCTA, fontWeight: '600' },
});

export default auto_amn_quote_create;

