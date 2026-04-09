/**
 * ESF Request Quick Compose Sheet - Compact & Modern Design
 * §UX-SUPREME-001: 2 clicks max, compact layout, optimized space usage
 *
 * Features:
 * - Compact grid layout (2 columns for chips)
 * - Grouped related fields
 * - Minimal spacing
 * - Fast animations
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { EsfBottomSheet } from './EsfBottomSheet';
import {
  EsfBloodTypePickerSheet,
  type BloodType,
} from './EsfBloodTypePickerSheet';
import { semanticRoles, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { loadExpoLocation } from '../../../../dsh/loadExpoLocation';
import type {
  EsfBeneficiaryUi,
  EsfContactMethod,
  EsfMedicalReasonUi,
} from '../../../uiTypes';

interface EsfRequestQuickComposeSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: RequestData) => void;
  initialData?: RequestData;
  isEditMode?: boolean;
}

export interface RequestData {
  beneficiary?: EsfBeneficiaryUi;
  bloodType: BloodType;
  units: number;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  hospitalName: string;
  location: string;
  locationCoords?: { lat: number; lng: number };
  patientName?: string; // Optional
  medicalReason?: EsfMedicalReasonUi;
  medicalReasonLabel?: string;
  medicalReasonNote?: string;
  contactMethod: EsfContactMethod;
  contactInfo: string;
  patientAge?: string;
  medicalCondition?: string;
  notes?: string;
  patientPhoto?: string;
}

const UNITS_OPTIONS = [1, 2, 3, 4];
const MEDICAL_REASON_OPTIONS: Array<{
  id: EsfMedicalReasonUi;
  label: string;
}> = [
  { id: 'major_surgery', label: 'عملية جراحية' },
  { id: 'open_heart', label: 'قلب مفتوح' },
  { id: 'blood_disorder', label: 'مرض دم' },
  { id: 'severe_bleeding', label: 'نزيف' },
  { id: 'postpartum_bleeding', label: 'نزيف ولادة' },
  { id: 'accident', label: 'حادث' },
  { id: 'cancer_treatment', label: 'علاج أورام' },
  { id: 'other', label: 'أخرى' },
];

export const EsfRequestQuickComposeSheet: React.FC<
  EsfRequestQuickComposeSheetProps
> = ({ visible, onClose, onSubmit, initialData, isEditMode = false }) => {
  const { t, isRTL } = useI18n();
  const ns = 'esf.app-client.mobile.EsfRequestQuickComposeSheet';
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [bloodType, setBloodType] = useState<BloodType | undefined>(
    initialData?.bloodType || 'O-'
  );
  const [units, setUnits] = useState<number>(initialData?.units || 1);
  const [urgency, setUrgency] = useState<
    'low' | 'medium' | 'high' | 'critical'
  >(initialData?.urgency || 'high');
  const [hospitalName, setHospitalName] = useState(
    initialData?.hospitalName || ''
  );
  const [location, setLocation] = useState(initialData?.location || '');
  const [locationCoords, setLocationCoords] = useState<
    { lat: number; lng: number } | undefined
  >(initialData?.locationCoords);
  const [locationLoading, setLocationLoading] = useState(false);
  const [patientName, setPatientName] = useState(
    initialData?.patientName || ''
  );
  const [medicalReason, setMedicalReason] = useState<
    EsfMedicalReasonUi | undefined
  >(initialData?.medicalReason);
  const [medicalReasonNote, setMedicalReasonNote] = useState(
    initialData?.medicalReasonNote || ''
  );
  const [contactMethod, setContactMethod] = useState<EsfContactMethod>(
    initialData?.contactMethod || 'in_app'
  );
  const [contactInfo, setContactInfo] = useState(
    initialData?.contactInfo || ''
  );
  const [showBloodTypePicker, setShowBloodTypePicker] = useState(false);

  const URGENCY_OPTIONS = useMemo<
    Array<{
      id: 'low' | 'medium' | 'high' | 'critical';
      label: string;
      emoji: string;
    }>
  >(
    () => [
      { id: 'high', label: t(`${ns}.urgencyHigh`), emoji: '⚠️' },
      { id: 'critical', label: t(`${ns}.urgencyCritical`), emoji: '🔴' },
    ],
    [t]
  );

  useEffect(() => {
    if (!visible) {
      if (!isEditMode) {
        setBloodType('O-');
        setUnits(1);
        setUrgency('high');
        setHospitalName('');
        setLocation('');
        setLocationCoords(undefined);
        setPatientName('');
        setMedicalReason(undefined);
        setMedicalReasonNote('');
        setContactMethod('in_app');
        setContactInfo('');
      }
    } else if (initialData) {
      setBloodType(initialData.bloodType);
      setUnits(initialData.units);
      setUrgency(initialData.urgency);
      setHospitalName(initialData.hospitalName);
      setLocation(initialData.location);
      setLocationCoords(initialData.locationCoords);
      setPatientName(initialData.patientName || '');
      setMedicalReason(initialData.medicalReason);
      setMedicalReasonNote(initialData.medicalReasonNote || '');
      setContactMethod(initialData.contactMethod);
      setContactInfo(initialData.contactInfo);
    }

    if (visible && !initialData && !isEditMode) {
      setPatientName('');
    }
  }, [visible, initialData, isEditMode]);

  const handleUseCurrentHospitalLocation = async () => {
    setLocationLoading(true);
    try {
      const locationModule = await loadExpoLocation();
      if (!locationModule) {
        Alert.alert(t(`${ns}.error`), 'ميزة تحديد الموقع غير متاحة حاليًا.');
        return;
      }

      const permission =
        await locationModule.requestForegroundPermissionsAsync();
      if (permission.status !== 'granted') {
        Alert.alert(
          t(`${ns}.error`),
          'يجب السماح بالموقع لتحديد موقع المستشفى.'
        );
        return;
      }

      const position = await locationModule.getCurrentPositionAsync({
        accuracy: locationModule.Accuracy.Balanced,
      });
      const lat = Number(position.coords.latitude.toFixed(4));
      const lng = Number(position.coords.longitude.toFixed(4));

      setLocationCoords({ lat, lng });
      setLocation(prev => prev.trim() || `GPS • ${lat}, ${lng}`);
    } catch (error) {
      Alert.alert(
        t(`${ns}.error`),
        error instanceof Error ? error.message : 'تعذر تحديد الموقع الآن.'
      );
    } finally {
      setLocationLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!bloodType) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.selectBloodType`));
      return;
    }
    if (!hospitalName?.trim()) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.enterHospital`));
      return;
    }
    if (!location?.trim()) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.enterLocation`));
      return;
    }
    if (!medicalReason) {
      Alert.alert(t(`${ns}.error`), 'اختر سبب الحاجة للدم أولًا');
      return;
    }
    if (medicalReason === 'other' && !medicalReasonNote.trim()) {
      Alert.alert(t(`${ns}.error`), 'أضف ملاحظة طبية قصيرة عند اختيار سبب آخر');
      return;
    }
    if (contactMethod !== 'in_app' && !contactInfo?.trim()) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.enterPhoneOrWhatsapp`));
      return;
    }
    onSubmit({
      beneficiary: patientName?.trim() ? 'other' : 'self',
      bloodType,
      units,
      urgency,
      hospitalName: hospitalName.trim(),
      location: location.trim(),
      locationCoords,
      patientName: patientName?.trim() || undefined,
      medicalReason,
      medicalReasonLabel:
        MEDICAL_REASON_OPTIONS.find(option => option.id === medicalReason)
          ?.label || 'أخرى',
      medicalReasonNote: medicalReasonNote.trim() || undefined,
      contactMethod,
      contactInfo: contactInfo.trim(),
    });
    onClose();
  };

  return (
    <>
      <EsfBottomSheet
        visible={visible}
        onClose={onClose}
        height='large'
        title={isEditMode ? t(`${ns}.editTitle`) : t(`${ns}.quickRequestTitle`)}
        showHandle={true}
        enableSwipeDown={true}
      >
        <ScrollView
          style={styles.container}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <View style={styles.heroPanel}>
            <Text style={styles.heroEyebrow}>طلب دم سريع</Text>
            <Text style={styles.heroTitle}>
              واجهة أنيقة وعملية لتجهيز الطلب والموقع الطبي بدقة.
            </Text>
          </View>

          {/* Row 1: Blood Type + Units (Side by Side) */}
          <View
            style={[
              styles.row,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <View style={[styles.halfWidth, styles.rightMargin]}>
              <Text style={styles.label}>{t(`${ns}.bloodTypeLabel`)}</Text>
              <TouchableOpacity
                style={[
                  styles.bloodTypeButton,
                  { flexDirection: 'row', direction: layoutDirection },
                ]}
                onPress={() => setShowBloodTypePicker(true)}
              >
                <Text style={styles.bloodTypeText}>
                  {bloodType || t(`${ns}.choose`)}
                </Text>
                <Text style={styles.arrow}>▼</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>الوحدات *</Text>
              <View
                style={[
                  styles.unitsRow,
                  { flexDirection: 'row', direction: layoutDirection },
                ]}
              >
                {UNITS_OPTIONS.map(unit => (
                  <TouchableOpacity
                    key={unit}
                    style={[
                      styles.unitChip,
                      units === unit && styles.unitChipSelected,
                    ]}
                    onPress={() => setUnits(unit)}
                  >
                    <Text
                      style={[
                        styles.unitText,
                        units === unit && styles.unitTextSelected,
                      ]}
                    >
                      {unit}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          {/* Row 2: Urgency (Compact) */}
          <View style={styles.section}>
            <Text style={styles.label}>{t(`${ns}.priorityLabel`)}</Text>
            <View
              style={[
                styles.urgencyRow,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              {URGENCY_OPTIONS.map(opt => (
                <TouchableOpacity
                  key={opt.id}
                  style={[
                    styles.urgencyChip,
                    urgency === opt.id && styles.urgencyChipSelected,
                    { flexDirection: 'row', direction: layoutDirection },
                  ]}
                  onPress={() => setUrgency(opt.id)}
                >
                  <Text style={styles.urgencyEmoji}>{opt.emoji}</Text>
                  <Text
                    style={[
                      styles.urgencyText,
                      urgency === opt.id && styles.urgencyTextSelected,
                    ]}
                  >
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Row 3: Hospital + Location (Side by Side) */}
          <View
            style={[
              styles.row,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <View style={[styles.halfWidth, styles.rightMargin]}>
              <Text style={styles.label}>{t(`${ns}.hospitalLabel`)}</Text>
              <TextInput
                style={styles.input}
                placeholder={t(`${ns}.hospitalPlaceholder`)}
                value={hospitalName}
                onChangeText={setHospitalName}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>
            <View style={styles.halfWidth}>
              <Text style={styles.label}>{t(`${ns}.locationLabel`)}</Text>
              <View style={styles.locationFieldRow}>
                <TouchableOpacity
                  style={styles.gpsButton}
                  onPress={() => {
                    void handleUseCurrentHospitalLocation();
                  }}
                  activeOpacity={0.85}
                >
                  <Ionicons
                    name={locationLoading ? 'sync-outline' : 'locate-outline'}
                    size={18}
                    color={semanticRoles.primaryCTAText}
                  />
                </TouchableOpacity>

                <TextInput
                  style={[styles.input, styles.locationInput]}
                  placeholder={t(`${ns}.locationPlaceholder`)}
                  value={location}
                  onChangeText={text => {
                    setLocation(text);
                    if (!text.trim()) {
                      setLocationCoords(undefined);
                    }
                  }}
                  placeholderTextColor={semanticRoles.textMuted}
                />
              </View>
              <Text style={styles.locationHint}>
                {locationCoords
                  ? `تم تحديد نقطة GPS: ${locationCoords.lat}, ${locationCoords.lng}`
                  : 'استخدم أيقونة GPS لتحديد موقع المستشفى بسرعة.'}
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>سبب الحاجة للدم *</Text>
            <View style={styles.reasonGrid}>
              {MEDICAL_REASON_OPTIONS.map(option => (
                <TouchableOpacity
                  key={option.id}
                  style={[
                    styles.reasonChip,
                    medicalReason === option.id && styles.reasonChipSelected,
                  ]}
                  onPress={() => setMedicalReason(option.id)}
                >
                  <Text
                    style={[
                      styles.reasonChipText,
                      medicalReason === option.id &&
                        styles.reasonChipTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>
              ملاحظة طبية قصيرة {medicalReason === 'other' ? '*' : '(اختياري)'}
            </Text>
            <TextInput
              style={[styles.input, styles.noteInput]}
              placeholder='مثال: حالة نزيف حاد بعد عملية اليوم'
              value={medicalReasonNote}
              onChangeText={setMedicalReasonNote}
              placeholderTextColor={semanticRoles.textMuted}
              multiline
              maxLength={120}
              textAlign={textAlignStart}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>{t(`${ns}.patientNameLabel`)}</Text>
            <TextInput
              style={styles.input}
              placeholder={t(`${ns}.patientNamePlaceholder`)}
              value={patientName}
              onChangeText={setPatientName}
              placeholderTextColor={semanticRoles.textMuted}
            />
          </View>

          {/* Row 5: Contact Method + Info (Side by Side) */}
          <View
            style={[
              styles.row,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <View style={[styles.halfWidth, styles.rightMargin]}>
              <Text style={styles.label}>{t(`${ns}.contactLabel`)}</Text>
              <View
                style={[
                  styles.contactRow,
                  { flexDirection: 'row', direction: layoutDirection },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.contactChip,
                    contactMethod === 'in_app' && styles.contactChipSelected,
                  ]}
                  onPress={() => setContactMethod('in_app')}
                >
                  <Text
                    style={[
                      styles.contactText,
                      contactMethod === 'in_app' && styles.contactTextSelected,
                    ]}
                  >
                    💬
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.contactChip,
                    contactMethod === 'whatsapp' && styles.contactChipSelected,
                  ]}
                  onPress={() => setContactMethod('whatsapp')}
                >
                  <Text
                    style={[
                      styles.contactText,
                      contactMethod === 'whatsapp' &&
                        styles.contactTextSelected,
                    ]}
                  >
                    📱
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.contactChip,
                    contactMethod === 'phone' && styles.contactChipSelected,
                  ]}
                  onPress={() => setContactMethod('phone')}
                >
                  <Text
                    style={[
                      styles.contactText,
                      contactMethod === 'phone' && styles.contactTextSelected,
                    ]}
                  >
                    ☎️
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {contactMethod !== 'in_app' && (
              <View style={styles.halfWidth}>
                <Text style={styles.label}>
                  {t(`${ns}.contactNumberLabel`)}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder={
                    contactMethod === 'phone'
                      ? t(`${ns}.phonePlaceholder`)
                      : t(`${ns}.whatsappPlaceholder`)
                  }
                  value={contactInfo}
                  onChangeText={setContactInfo}
                  keyboardType='phone-pad'
                  placeholderTextColor={semanticRoles.textMuted}
                />
              </View>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              (!bloodType ||
                !hospitalName ||
                !location ||
                !medicalReason ||
                (medicalReason === 'other' && !medicalReasonNote.trim()) ||
                (contactMethod !== 'in_app' && !contactInfo)) &&
                styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              !bloodType ||
              !hospitalName ||
              !location ||
              !medicalReason ||
              (medicalReason === 'other' && !medicalReasonNote.trim()) ||
              (contactMethod !== 'in_app' && !contactInfo)
            }
          >
            <Text style={styles.submitButtonText}>
              {isEditMode ? t(`${ns}.saveButton`) : t(`${ns}.publishButton`)}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </EsfBottomSheet>

      <EsfBloodTypePickerSheet
        visible={showBloodTypePicker}
        onClose={() => setShowBloodTypePicker(false)}
        selected={bloodType}
        onSelect={setBloodType}
        title={t(`${ns}.bloodTypePickerTitle`)}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroPanel: {
    marginBottom: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.xl,
    backgroundColor: semanticRoles.primaryCTA + '10',
    borderWidth: 1,
    borderColor: semanticRoles.primaryCTA + '20',
    gap: 6,
  },
  heroEyebrow: {
    fontSize: 13,
    fontWeight: '800',
    color: semanticRoles.primaryCTA,
  },
  heroTitle: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '800',
    color: semanticRoles.text,
  },
  row: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.md,
  },
  halfWidth: {
    flex: 1,
  },
  rightMargin: {
    marginEnd: BTHWANI_SPACING.sm,
  },
  section: {
    marginBottom: BTHWANI_SPACING.md,
  },
  optionRow: {
    gap: BTHWANI_SPACING.sm,
  },
  optionChip: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionChipSelected: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  optionChipTextSelected: {
    color: semanticRoles.primaryCTAText,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs + 2,
  },
  reasonGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  reasonChip: {
    paddingHorizontal: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  reasonChipSelected: {
    backgroundColor: semanticRoles.stateError.icon + '14',
    borderColor: semanticRoles.stateError.icon,
  },
  reasonChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  reasonChipTextSelected: {
    color: semanticRoles.stateError.icon,
  },
  bloodTypeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 50,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  bloodTypeText: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  arrow: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  unitsRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.xs,
  },
  unitChip: {
    flex: 1,
    minHeight: 50,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
  },
  unitChipSelected: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  unitText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  unitTextSelected: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '700',
  },
  urgencyRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  urgencyChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  urgencyChipSelected: {
    backgroundColor: semanticRoles.stateError.icon,
    borderColor: semanticRoles.stateError.icon,
  },
  urgencyEmoji: {
    fontSize: 16,
  },
  urgencyText: {
    fontSize: 15,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  urgencyTextSelected: {
    color: semanticRoles.surface,
    fontWeight: '700',
  },
  input: {
    minHeight: 50,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    fontSize: 16,
    color: semanticRoles.text,
  },
  locationFieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  locationInput: {
    flex: 1,
  },
  gpsButton: {
    width: 50,
    height: 50,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  locationHint: {
    marginTop: BTHWANI_SPACING.xs,
    fontSize: 13,
    lineHeight: 19,
    fontWeight: '700',
    color: semanticRoles.textMuted,
  },
  noteInput: {
    minHeight: 74,
    textAlignVertical: 'top',
  },
  contactRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.xs,
  },
  contactChip: {
    flex: 1,
    minHeight: 50,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactChipSelected: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  contactText: {
    fontSize: 18,
  },
  contactTextSelected: {
    // No change needed, emoji stays same
  },
  identificationRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  identificationChip: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  identificationChipSelected: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  identificationText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  identificationTextSelected: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '700',
  },
  submitButton: {
    minHeight: 56,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: BTHWANI_COLORS.danger,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: semanticRoles.surface,
    fontSize: 18,
    fontWeight: '800',
  },
});

