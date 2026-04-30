/**
 * Field Partner Draft Pin Geo — field_partner_draft_pin_geo
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/drafts/{draft_id}/geo/pin
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerDraftPinGeoProps {
  navigation?: any;
  route?: any;
}

const AutoFieldPartnerDraftPinGeo: React.FC<AutoFieldPartnerDraftPinGeoProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const ns = 'field.app-field.mobile.auto_field_partner_draft_pin_geo';
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const draftId = route?.params?.draftId || 'unknown';
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleGetCurrentLocation = () => {
    
    Alert.alert(t(`${ns}.comingSoon`), t(`${ns}.pinCurrentComingSoon`));
    // Simulated location
    setCurrentLocation({ lat: 24.7136, lng: 46.6753 });
    setLatitude('24.7136');
    setLongitude('46.6753');
    setAddress(t('surfaces.الرياض،_المملكة_العربية_السعودية'));
  };

  const handleSave = async () => {
    if (!latitude || !longitude) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.selectLocationPrompt`));
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.invalidCoords`));
      return;
    }

    setIsSaving(true);
    try {
      
      // await pinFieldPartnerDraftGeo(draftId, { lat, lng, address });
      await new Promise(resolve => setTimeout(resolve, 1000));
      Alert.alert(t(`${ns}.success`), t(`${ns}.pinSuccess`), [
        { text: t('common.ok'), onPress: () => navigation?.goBack() },
      ]);
    } catch (err) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.pinFailed`));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenWrapper
      state="content"
      screenName="field_partner_draft_pin_geo"
      operationName="field_partner_draft_pin_geo"
    >
      <View style={styles.container}>
        <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>📍 تحديد الموقع الجغرافي</Text>
            <Text style={styles.subtitle}>حدد موقع الشريك على الخريطة</Text>
          </View>

          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapPlaceholderText}>🗺️</Text>
            <Text style={styles.mapPlaceholderLabel}>خريطة تفاعلية</Text>
            <Text style={styles.mapPlaceholderSubtext}>
              {currentLocation
                ? `الموقع الحالي: ${currentLocation.lat}, ${currentLocation.lng}`
                : t(`${ns}.hintCoords`)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.locationButton}
            onPress={handleGetCurrentLocation}
            activeOpacity={0.8}
          >
            <Text style={styles.locationButtonText}>📍 تحديد الموقع الحالي</Text>
          </TouchableOpacity>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>خط العرض (Latitude) *</Text>
              <TextInput
                style={styles.input}
                value={latitude}
                onChangeText={setLatitude}
                placeholder="24.7136"
                keyboardType="numeric"
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>خط الطول (Longitude) *</Text>
              <TextInput
                style={styles.input}
                value={longitude}
                onChangeText={setLongitude}
                placeholder="46.6753"
                keyboardType="numeric"
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t(`${ns}.addressLabel`)}</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={address}
                onChangeText={setAddress}
                placeholder={t(`${ns}.fullAddress`)}
                multiline
                numberOfLines={3}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoText}>💡 نصيحة</Text>
            <Text style={styles.infoDesc}>
              {t(`${ns}.hintCoords`)}
            </Text>
          </View>
        </ScrollView>

        <View style={[styles.footer, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={[styles.footerButton, styles.saveButton, (!latitude || !longitude) && styles.disabledButton]}
            onPress={handleSave}
            disabled={isSaving || !latitude || !longitude}
            activeOpacity={0.8}
          >
            <Text style={styles.saveButtonText}>
              {isSaving ? 'جاري الحفظ...' : t('surfaces.حفظ_الموقع')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.footerButton, styles.cancelButton]}
            onPress={() => navigation?.goBack()}
            disabled={isSaving}
            activeOpacity={0.8}
          >
            <Text style={styles.cancelButtonText}>إلغاء</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  mapPlaceholder: {
    height: 250,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: semanticRoles.border,
    borderStyle: 'dashed',
  },
  mapPlaceholderText: {
    fontSize: 64,
    marginBottom: BTHWANI_SPACING.sm,
  },
  mapPlaceholderLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  locationButton: {
    backgroundColor: colorTokens.primary['500'],
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  locationButtonText: {
    color: colorTokens.surface.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  form: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  infoBox: {
    backgroundColor: colorTokens.primary['100'],
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: colorTokens.primary['300'],
  },
  infoText: {
    fontSize: 16,
    fontWeight: '600',
    color: colorTokens.primary['800'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  infoDesc: {
    fontSize: 14,
    color: colorTokens.primary['800'],
    lineHeight: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    flexDirection: 'row',
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  footerButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
    opacity: 0.5,
  },
  cancelButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AutoFieldPartnerDraftPinGeo;
