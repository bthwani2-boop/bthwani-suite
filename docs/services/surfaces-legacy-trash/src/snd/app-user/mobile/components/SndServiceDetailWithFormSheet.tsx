/**
 * SND Service Detail with Interest Form - Unified Sheet
 * §UX-SUPREME-001: Service details + request form in one main create flow
 *
 * Features:
 * - Service details (what we offer, benefits, process, portfolio)
 * - Integrated interest form (service pre-selected)
 * - Single sheet, single flow
 * - Primary create path: service selection -> request submit
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  Animated,
  Easing,
} from 'react-native';
import { SndBottomSheet } from './SndBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useDirection } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
  BTHWANI_TYPOGRAPHY,
} from '@bthwani/ui-kit';
import type { ServiceDetail } from './SndServiceDetail.types';
import type { InterestData } from './SndInterestQuickComposeSheet';
import {
  classifySndRuntimeFailure,
  getSndSubmissionFailureMessage,
} from '../sndRuntimeFailures';
import {
  SND_INTERACTIVE_HIT_SLOP,
  SND_MIN_TOUCH_TARGET,
  useSndReducedMotion,
} from '../sndAccessibility';

const typography = BTHWANI_TYPOGRAPHY;
const SND_NEUTRAL_SURFACE = '#f5f7fa';
const SND_NEUTRAL_BORDER = '#d8e3ef';
const SND_NEUTRAL_TEXT = '#243b53';

function getServiceMark(label?: string | null) {
  const normalized = label?.trim();
  return normalized ? normalized.charAt(0) : 'س';
}

interface SndServiceDetailWithFormSheetProps {
  visible: boolean;
  service: ServiceDetail | null;
  onClose: () => void;
  onSubmit: (data: InterestData) => Promise<void>;
  onSuccess?: () => void;
}

export const SndServiceDetailWithFormSheet: React.FC<
  SndServiceDetailWithFormSheetProps
> = ({ visible, service, onClose, onSubmit, onSuccess }) => {
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactMethod, setContactMethod] = useState<
    'phone' | 'whatsapp' | 'in_app'
  >('in_app');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { rowStyle, textAlignStartStyle, t } = useDirection();
  const reduceMotion = useSndReducedMotion();
  const minimumDescriptionLength = 50;
  const heroMotion = useRef(new Animated.Value(0)).current;
  const formMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      // Reset form when closed
      setDescription('');
      setLocation('');
      setContactMethod('in_app');
      setContactInfo('');
    }
  }, [visible]);

  useEffect(() => {
    if (!visible) {
      heroMotion.setValue(0);
      formMotion.setValue(0);
      return;
    }

    if (reduceMotion) {
      heroMotion.setValue(1);
      formMotion.setValue(1);
      return;
    }

    heroMotion.setValue(0);
    formMotion.setValue(0);
    Animated.stagger(75, [
      Animated.timing(heroMotion, {
        toValue: 1,
        duration: 280,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(formMotion, {
        toValue: 1,
        duration: 320,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [formMotion, heroMotion, reduceMotion, visible]);

  const handleSubmit = useCallback(async () => {
    if (!service) return;

    if (
      !description.trim() ||
      description.trim().length < minimumDescriptionLength
    ) {
      Alert.alert(
        t(
          'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.validationRequired'
        ),
        t(
          'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.validationRequired'
        )
      );
      return;
    }
    if (!location.trim()) {
      Alert.alert(
        t(
          'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.errorMessage'
        ),
        t(
          'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.errorMessage'
        )
      );
      return;
    }
    if (contactMethod !== 'in_app' && !contactInfo.trim()) {
      const fieldLabel =
        contactMethod === 'phone'
          ? t('surfaces.snd.phoneRequired')
          : t('surfaces.snd.whatsappRequired');
      Alert.alert(
        fieldLabel,
        t('surfaces.snd.please_enter_contact', { field: fieldLabel })
      );
      return;
    }

    setSubmitting(true);
    try {
      const interestData: InterestData = {
        serviceType: service.id,
        description: description.trim(),
        location: location.trim(),
        urgency: 'medium',
        contactMethod,
        contactInfo: contactMethod !== 'in_app' ? contactInfo.trim() : '',
      };

      await onSubmit(interestData);

      if (onSuccess) {
        onSuccess();
      }

      // Close sheet after success
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error: any) {
      const failureKind = classifySndRuntimeFailure({ error });
      Alert.alert(
        t(
          'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.errorMessage_103'
        ),
        getSndSubmissionFailureMessage(
          failureKind,
          error.message ||
            t(
              'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.errorMessage_103'
            )
        )
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    service,
    description,
    location,
    contactMethod,
    contactInfo,
    minimumDescriptionLength,
    onSubmit,
    onSuccess,
    onClose,
    t,
  ]);

  if (!service) return null;

  const highlights =
    service.whatWeOffer && service.benefits
      ? [...service.whatWeOffer.slice(0, 2), ...service.benefits.slice(0, 2)]
      : service.whatWeOffer?.slice(0, 3) ||
        service.benefits?.slice(0, 3) || [
          t('surfaces.snd.servicedetailwithformsheet.l117_ar_1'),
          t('surfaces.snd.servicedetailwithformsheet.l118_ar_1'),
          t('surfaces.snd.servicedetailwithformsheet.l119_ar_1'),
        ];
  const serviceSignals = highlights.slice(0, 3);
  const heroAnimatedStyle: any = {
    opacity: heroMotion,
    transform: [
      {
        translateY: heroMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
      {
        scale: heroMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [0.985, 1],
        }),
      },
    ],
  };
  const formAnimatedStyle: any = {
    opacity: formMotion,
    transform: [
      {
        translateY: formMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [22, 0],
        }),
      },
    ],
  };

  return (
    <SndBottomSheet
      visible={visible}
      onClose={onClose}
      height='medium'
      title={service.name}
      showHandle={true}
      enableSwipeDown={true}
    >
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Animated.View style={heroAnimatedStyle}>
          <View style={styles.serviceHeader}>
            <View style={[styles.serviceHeaderTopRow, rowStyle]}>
              <View
                style={[
                  styles.serviceIconOrb,
                  {
                    backgroundColor: SND_NEUTRAL_SURFACE,
                    borderColor: SND_NEUTRAL_BORDER,
                  },
                ]}
              >
                <Text style={{ fontSize: 15, fontWeight: '700' }}>
                  {getServiceMark(service.name)}
                </Text>
              </View>
              <View
                style={[
                  styles.serviceStateBadge,
                  { backgroundColor: SND_NEUTRAL_SURFACE },
                  { borderColor: SND_NEUTRAL_BORDER },
                ]}
              >
                <Text
                  style={[
                    styles.serviceStateBadgeText,
                    { color: SND_NEUTRAL_TEXT },
                  ]}
                >
                  المسار الرئيسي
                </Text>
              </View>
            </View>

            <Text style={[styles.serviceHeadline, textAlignStartStyle]}>
              {service.name}
            </Text>
            <Text
              style={[styles.serviceDescription, textAlignStartStyle]}
              numberOfLines={2}
            >
              {service.description}
            </Text>

            <View style={[styles.serviceMetaRow, rowStyle]}>
              {serviceSignals.map(signal => (
                <View
                  key={signal}
                  style={[
                    styles.serviceMetaPill,
                    {
                      backgroundColor: SND_NEUTRAL_SURFACE,
                      borderColor: SND_NEUTRAL_BORDER,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.serviceMetaPillText,
                      { color: SND_NEUTRAL_TEXT },
                    ]}
                    numberOfLines={1}
                  >
                    {signal}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View style={formAnimatedStyle}>
          <View style={styles.formSection}>
            <View style={[styles.formHeaderRow, rowStyle]}>
              <View style={styles.formHeaderCopy}>
                <Text style={[styles.formSectionTitle, textAlignStartStyle]}>
                  {t('surfaces.snd.servicedetailwithformsheet.l198_ar_1')}
                </Text>
                <Text style={[styles.formSectionLead, textAlignStartStyle]}>
                  ثلاثة حقول فقط لنبدأ: ماذا تريد، أين، وكيف نصل إليك.
                </Text>
              </View>

              <View style={[styles.formStateBadge]}>
                <Text style={[styles.formStateBadgeText]}>مختصر</Text>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t('surfaces.snd.servicedetailwithformsheet.l202_ar_1')}
              </Text>
              <Text style={[styles.inputHint, textAlignStartStyle]}>
                {t(
                  'surfaces.snd.servicedetailwithformsheet.description_hint_short'
                )}
              </Text>
              <TextInput
                style={[styles.input, styles.textArea, textAlignStartStyle]}
                placeholder={t(
                  'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.placeholder'
                )}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                maxLength={1000}
                textAlignVertical='top'
              />
              <Text
                style={[
                  styles.charCount,
                  textAlignStartStyle,
                  description.length < minimumDescriptionLength &&
                    styles.charCountWarning,
                ]}
              >
                {description.length}/1000{' '}
                {description.length < minimumDescriptionLength &&
                  t('surfaces.snd.minimum_characters', {
                    count: minimumDescriptionLength,
                  })}
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t('surfaces.snd.servicedetailwithformsheet.l223_ar_1')}
              </Text>
              <TextInput
                style={[styles.input, textAlignStartStyle]}
                placeholder={t(
                  'snd.app-client.mobile.components.SndServiceDetailWithFormSheet.fullAddressOrCity'
                )}
                value={location}
                onChangeText={setLocation}
                maxLength={200}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t('surfaces.snd.servicedetailwithformsheet.l263_ar_1')}
              </Text>
              <View style={[styles.contactOptions, rowStyle]}>
                <TouchableOpacity
                  style={[
                    styles.contactOption,
                    contactMethod === 'in_app' && styles.contactOptionSelected,
                  ]}
                  onPress={() => setContactMethod('in_app')}
                  accessibilityRole='button'
                  accessibilityLabel='التواصل داخل التطبيق'
                  accessibilityHint='يجعل المتابعة داخل التطبيق دون رقم إضافي'
                  accessibilityState={{ selected: contactMethod === 'in_app' }}
                  hitSlop={SND_INTERACTIVE_HIT_SLOP}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.contactOptionText,
                      contactMethod === 'in_app' &&
                        styles.contactOptionTextSelected,
                    ]}
                  >
                    {t('surfaces.snd.servicedetailwithformsheet.l274_ar_1')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.contactOption,
                    contactMethod === 'phone' && styles.contactOptionSelected,
                  ]}
                  onPress={() => setContactMethod('phone')}
                  activeOpacity={0.7}
                  accessibilityRole='button'
                  accessibilityLabel='اختيار الاتصال الهاتفي'
                  accessibilityHint='يطلب رقم اتصال للمتابعة على الهاتف'
                  accessibilityState={{ selected: contactMethod === 'phone' }}
                  hitSlop={SND_INTERACTIVE_HIT_SLOP}
                >
                  <Text
                    style={[
                      styles.contactOptionText,
                      contactMethod === 'phone' &&
                        styles.contactOptionTextSelected,
                    ]}
                  >
                    {t('surfaces.snd.servicedetailwithformsheet.l284_ar_1')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.contactOption,
                    contactMethod === 'whatsapp' &&
                      styles.contactOptionSelected,
                  ]}
                  onPress={() => setContactMethod('whatsapp')}
                  accessibilityRole='button'
                  accessibilityLabel='اختيار واتساب'
                  accessibilityHint='يطلب رقم واتساب للمتابعة على واتساب'
                  accessibilityState={{
                    selected: contactMethod === 'whatsapp',
                  }}
                  hitSlop={SND_INTERACTIVE_HIT_SLOP}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.contactOptionText,
                      contactMethod === 'whatsapp' &&
                        styles.contactOptionTextSelected,
                    ]}
                  >
                    {t('surfaces.snd.servicedetailwithformsheet.l295_ar_1')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Contact Info (conditional) */}
            {contactMethod !== 'in_app' && (
              <View style={styles.inputGroup}>
                <Text style={[styles.inputLabel, textAlignStartStyle]}>
                  {contactMethod === 'phone'
                    ? t('surfaces.snd.phoneRequired')
                    : t('surfaces.snd.whatsappRequired')}
                </Text>
                <TextInput
                  style={[styles.input, textAlignStartStyle]}
                  placeholder={
                    contactMethod === 'phone' ? '05xxxxxxxx' : '05xxxxxxxx'
                  }
                  value={contactInfo}
                  onChangeText={setContactInfo}
                  keyboardType='phone-pad'
                  maxLength={15}
                />
              </View>
            )}

            <TouchableOpacity
              style={[
                styles.submitButton,
                submitting && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={submitting}
              activeOpacity={0.7}
              accessibilityRole='button'
              accessibilityLabel='إرسال الطلب'
              accessibilityHint='يرسل طلب الخدمة من شاشة سند الرئيسية ثم يعيدك إلى تفاصيل الطلب'
              accessibilityState={{ disabled: submitting }}
              hitSlop={SND_INTERACTIVE_HIT_SLOP}
            >
              <Text style={styles.submitButtonText}>
                {submitting ? t('surfaces.snd.submitting') : 'إرسال الطلب'}
              </Text>
            </TouchableOpacity>
            <Text style={[styles.submitFootnote, textAlignStartStyle]}>
              هذا هو مسار الطلب الرئيسي من سند، وبعد الإرسال ستنتقل مباشرة إلى
              تفاصيل الطلب متى عادت الهوية من الخادم.
            </Text>
          </View>
        </Animated.View>
      </ScrollView>
    </SndBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: BTHWANI_SPACING.sm,
    paddingBottom: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  serviceHeader: {
    backgroundColor: '#f7fafd',
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d9e4ef',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 2,
  },
  serviceHeaderTopRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.md,
  },
  serviceIconOrb: {
    width: 62,
    height: 62,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
  },
  serviceStateBadge: {
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: '#eef4fa',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d9e3ee',
  },
  serviceStateBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: '#163760',
  },
  serviceHeadline: {
    marginTop: BTHWANI_SPACING.sm,
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  serviceDescription: {
    fontSize: typography.fontSize.sm,
    color: '#5e738a',
    marginTop: BTHWANI_SPACING.sm,
    lineHeight: typography.lineHeightPx.sm,
  },
  serviceMetaRow: {
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginTop: BTHWANI_SPACING.md,
  },
  serviceMetaPill: {
    borderRadius: BTHWANI_RADIUS.lg,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderWidth: BTHWANI_BORDER.hairline,
  },
  serviceMetaPillText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
  },
  // Form Styles
  formSection: {
    marginTop: 0,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.border,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.md,
  },
  formHeaderRow: {
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: BTHWANI_SPACING.md,
  },
  formHeaderCopy: {
    flex: 1,
  },
  formStateBadge: {
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: '#eff4fa',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d7e3ef',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 5,
  },
  formStateBadgeText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.bold,
    color: '#163760',
  },
  formSectionTitle: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.text,
  },
  formSectionLead: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.textMuted,
    lineHeight: typography.lineHeightPx.sm,
    marginTop: BTHWANI_SPACING.xs,
    marginBottom: BTHWANI_SPACING.sm,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.sm,
  },
  inputLabel: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  inputHint: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: '#f8fbff',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d7e3ef',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.sm + 2,
    fontSize: typography.fontSize.sm,
    color: semanticRoles.text,
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  charCountWarning: {
    color: semanticRoles.stateError.text,
  },
  contactOptions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  contactOption: {
    flex: 1,
    minHeight: SND_MIN_TOUCH_TARGET,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: '#f8fbff',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d7e3ef',
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactOptionSelected: {
    borderColor: '#173f73',
    backgroundColor: '#edf4ff',
  },
  contactOptionText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.semibold,
    color: semanticRoles.text,
  },
  contactOptionTextSelected: {
    color: '#173f73',
  },
  submitButton: {
    backgroundColor: '#173f73',
    borderRadius: BTHWANI_RADIUS.lg,
    minHeight: SND_MIN_TOUCH_TARGET,
    paddingVertical: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.bold,
    color: semanticRoles.primaryCTAText,
  },
  submitFootnote: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    lineHeight: typography.lineHeightPx.xs,
  },
  backButton: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  backButtonText: {
    fontSize: typography.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: typography.fontWeight.semibold,
  },
});

