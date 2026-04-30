/**
 * SND Interest Quick Compose Sheet - Compact & Modern Design
 * §UX-SUPREME-001: 1 click max, compact layout, optimized space usage
 *
 * Features:
 * - Compact grid layout
 * - Grouped related fields
 * - Minimal spacing
 * - Fast animations
 */

import React, { useMemo, useState, useEffect, useRef } from 'react';
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
import { rawFetch } from '@bthwani/api-clients';
import { SndBottomSheet } from './SndBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useDirection } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_BORDER,
  BTHWANI_TYPOGRAPHY,
} from '@bthwani/ui-kit';
import { sndScrollContentContainerStyle } from './_sndSheetLayout';
import {
  SND_CLIENT_CATEGORIES_VAR_KEY,
  SND_SERVICE_ENABLED_VAR_KEY,
  buildDefaultSndClientCategories,
  filterEnabledSndClientCategories,
  mergeSndClientCategories,
  parseRuntimeBoolean,
  type SndClientCategory,
} from '../../../hooks/sndClientCatalog';
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
const SND_NEUTRAL_SURFACE_ACTIVE = '#eef2f6';
const SND_NEUTRAL_BORDER = '#d8e3ef';
const SND_NEUTRAL_BORDER_ACTIVE = '#c7d2de';

function getServiceMark(label?: string | null) {
  const normalized = label?.trim();
  return normalized ? normalized.charAt(0) : 'س';
}

interface SndInterestQuickComposeSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: InterestData) => Promise<void>;
  onSuccess?: () => void;
  minimumDescriptionLength?: number;
}

export interface InterestData {
  serviceType: string;
  description: string;
  location: string;
  preferredTime?: string;
  urgency: 'low' | 'medium' | 'high';
  contactMethod: 'phone' | 'whatsapp' | 'in_app';
  contactInfo: string;
  budget?: string;
  timeline?: string;
}

export const SndInterestQuickComposeSheet: React.FC<
  SndInterestQuickComposeSheetProps
> = ({
  visible,
  onClose,
  onSubmit,
  onSuccess,
  minimumDescriptionLength = 50,
}) => {
  const {
    directionStyle,
    resolveGridVisualOrder,
    textAlignStartStyle,
    currentLanguage,
    t,
  } = useDirection();
  const reduceMotion = useSndReducedMotion();
  const [serviceType, setServiceType] = useState('');
  const defaultServiceTypes = useMemo(
    () => buildDefaultSndClientCategories(t, currentLanguage),
    [currentLanguage, t]
  );
  const [serviceTypes, setServiceTypes] =
    useState<SndClientCategory[]>(defaultServiceTypes);
  const [serviceSelectionDisabled, setServiceSelectionDisabled] =
    useState(false);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [contactMethod, setContactMethod] = useState<
    'phone' | 'whatsapp' | 'in_app'
  >('in_app');
  const [contactInfo, setContactInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const orderedServiceTypes = useMemo(
    () => resolveGridVisualOrder(serviceTypes, 3),
    [resolveGridVisualOrder, serviceTypes]
  );
  const pickerMotion = useRef(new Animated.Value(0)).current;
  const formMotion = useRef(new Animated.Value(0)).current;
  const actionMotion = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      // Reset form when closed
      setServiceType('');
      setDescription('');
      setLocation('');
      setPreferredTime('');
      setContactMethod('in_app');
      setContactInfo('');
    }
  }, [visible]);

  useEffect(() => {
    setServiceTypes(defaultServiceTypes);
  }, [defaultServiceTypes]);

  useEffect(() => {
    const loadVisibleCategories = async () => {
      if (!visible) {
        return;
      }

      let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
      if (baseUrl.endsWith('/api')) {
        baseUrl = baseUrl.slice(0, -4);
      }

      if (!baseUrl) {
        setServiceSelectionDisabled(false);
        setServiceTypes(defaultServiceTypes);
        return;
      }

      try {
        const [serviceFlagResponse, categoriesResponse] = await Promise.all([
          rawFetch(
            `${baseUrl}/api/infra/runtime-vars/${encodeURIComponent(
              SND_SERVICE_ENABLED_VAR_KEY
            )}/resolve`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            }
          ),
          rawFetch(
            `${baseUrl}/api/infra/runtime-vars/${encodeURIComponent(
              SND_CLIENT_CATEGORIES_VAR_KEY
            )}/resolve`,
            {
              method: 'GET',
              headers: { 'Content-Type': 'application/json' },
              credentials: 'include',
            }
          ),
        ]);

        let serviceEnabledValue: unknown = true;
        if (serviceFlagResponse.ok) {
          const serviceFlagData = await serviceFlagResponse.json();
          serviceEnabledValue = serviceFlagData?.value;
        }

        let categoryConfigValue: unknown = undefined;
        if (categoriesResponse.ok) {
          const categoriesData = await categoriesResponse.json();
          categoryConfigValue = categoriesData?.value;
        }

        const serviceEnabled = parseRuntimeBoolean(serviceEnabledValue, true);
        const mergedCategories = filterEnabledSndClientCategories(
          mergeSndClientCategories(
            defaultServiceTypes,
            categoryConfigValue,
            t,
            currentLanguage
          )
        );

        setServiceSelectionDisabled(!serviceEnabled);
        setServiceTypes(serviceEnabled ? mergedCategories : []);
      } catch {
        setServiceSelectionDisabled(false);
        setServiceTypes(defaultServiceTypes);
      }
    };

    void loadVisibleCategories();
  }, [currentLanguage, defaultServiceTypes, visible]);

  useEffect(() => {
    if (!visible) {
      pickerMotion.setValue(0);
      formMotion.setValue(0);
      actionMotion.setValue(0);
      return;
    }

    if (reduceMotion) {
      pickerMotion.setValue(1);
      formMotion.setValue(1);
      actionMotion.setValue(1);
      return;
    }

    pickerMotion.setValue(0);
    formMotion.setValue(0);
    actionMotion.setValue(0);
    Animated.stagger(70, [
      Animated.timing(pickerMotion, {
        toValue: 1,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(formMotion, {
        toValue: 1,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(actionMotion, {
        toValue: 1,
        duration: 220,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [actionMotion, formMotion, pickerMotion, reduceMotion, visible]);

  const pickerAnimatedStyle: any = {
    opacity: pickerMotion,
    transform: [
      {
        translateY: pickerMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [16, 0],
        }),
      },
      {
        scale: pickerMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [0.988, 1],
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
          outputRange: [20, 0],
        }),
      },
    ],
  };
  const actionAnimatedStyle: any = {
    opacity: actionMotion,
    transform: [
      {
        translateY: actionMotion.interpolate({
          inputRange: [0, 1],
          outputRange: [12, 0],
        }),
      },
    ],
  };

  const handleSubmit = async () => {
    if (!serviceType) {
      Alert.alert(
        t(
          'snd.app-client.mobile.components.SndInterestQuickComposeSheet.validationServiceTypeRequired'
        ),
        t(
          'snd.app-client.mobile.components.SndInterestQuickComposeSheet.validationServiceTypeRequired'
        )
      );
      return;
    }
    if (
      !description.trim() ||
      description.trim().length < minimumDescriptionLength
    ) {
      Alert.alert(
        t(
          'snd.app-client.mobile.components.SndInterestQuickComposeSheet.validationDescriptionRequired'
        ),
        `يرجى كتابة وصف لا يقل عن ${minimumDescriptionLength} حرفًا.`
      );
      return;
    }
    if (!location.trim()) {
      Alert.alert(
        t(
          'snd.app-client.mobile.components.SndInterestQuickComposeSheet.validationLocationRequired'
        ),
        t(
          'snd.app-client.mobile.components.SndInterestQuickComposeSheet.validationLocationRequired'
        )
      );
      return;
    }
    if (contactMethod !== 'in_app' && !contactInfo.trim()) {
      Alert.alert(
        contactMethod === 'phone'
          ? t('surfaces.snd.phoneRequired')
          : t(
              'snd.app-client.mobile.components.SndInterestQuickComposeSheet.whatsappLabel'
            ),
        contactMethod === 'phone'
          ? 'يرجى إدخال رقم الاتصال.'
          : 'يرجى إدخال رقم الواتساب.'
      );
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        serviceType,
        description: description.trim(),
        location: location.trim(),
        preferredTime: preferredTime.trim() || undefined,
        urgency: 'medium',
        contactMethod,
        contactInfo: contactInfo.trim(),
      });
      onSuccess?.();
      onClose();
    } catch (error: any) {
      const failureKind = classifySndRuntimeFailure({ error });
      Alert.alert(
        t(
          'snd.app-client.mobile.components.SndInterestQuickComposeSheet.errorSubmitMessage'
        ),
        getSndSubmissionFailureMessage(
          failureKind,
          error.message ||
            t(
              'snd.app-client.mobile.components.SndInterestQuickComposeSheet.errorSubmitMessage'
            )
        )
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SndBottomSheet
      visible={visible}
      onClose={onClose}
      height='large'
      title={t(
        'snd.app-client.mobile.components.SndInterestQuickComposeSheet.newInterestTitle'
      )}
      showHandle={true}
      enableSwipeDown={true}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={sndScrollContentContainerStyle}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <Animated.View style={pickerAnimatedStyle}>
          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestquickcomposesheet.l150_ar_1')}
            </Text>
            <View style={styles.quickComposeNotice}>
              <Text
                style={[styles.quickComposeNoticeText, textAlignStartStyle]}
              >
                هذا المسار سريع وثانوي، بينما يبقى سجل الطلبات هو الواجهة
                الأساسية للمتابعة.
              </Text>
            </View>
            {serviceSelectionDisabled ? (
              <View style={styles.disabledServiceNotice}>
                <Text
                  style={[
                    styles.disabledServiceNoticeText,
                    textAlignStartStyle,
                  ]}
                >
                  تم تعطيل سند من لوحة التحكم، لذلك لا يمكن إنشاء طلب جديد الآن.
                </Text>
              </View>
            ) : null}
            <View style={[styles.serviceTypesGrid, directionStyle]}>
              {orderedServiceTypes.map(type => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.serviceTypeCard,
                    serviceType === type.id && styles.selectedServiceType,
                    serviceType === type.id && {
                      backgroundColor: SND_NEUTRAL_SURFACE_ACTIVE,
                      borderColor: SND_NEUTRAL_BORDER_ACTIVE,
                    },
                  ]}
                  onPress={() => setServiceType(type.id)}
                  accessibilityRole='button'
                  accessibilityLabel={`اختيار ${type.name}`}
                  accessibilityHint='يحدد فئة الطلب السريع'
                  accessibilityState={{ selected: serviceType === type.id }}
                  hitSlop={SND_INTERACTIVE_HIT_SLOP}
                  activeOpacity={0.75}
                >
                  <View
                    style={[
                      styles.serviceIconOrb,
                      {
                        backgroundColor:
                          serviceType === type.id
                            ? SND_NEUTRAL_SURFACE_ACTIVE
                            : SND_NEUTRAL_SURFACE,
                        borderColor:
                          serviceType === type.id
                            ? SND_NEUTRAL_BORDER_ACTIVE
                            : SND_NEUTRAL_BORDER,
                      },
                    ]}
                  >
                    <Text style={{ fontSize: 12, fontWeight: '700' }}>
                      {getServiceMark(type.name)}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.serviceLabel,
                      serviceType === type.id && styles.selectedServiceLabel,
                    ]}
                  >
                    {type.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </Animated.View>

        <Animated.View style={formAnimatedStyle}>
          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestquickcomposesheet.l171_ar_1')}
            </Text>
            <Text style={[styles.hint, textAlignStartStyle]}>
              {t('surfaces.snd.interestquickcomposesheet.l172_ar_1')}
            </Text>
            <TextInput
              style={[styles.input, textAlignStartStyle, styles.textArea]}
              placeholder={t(
                'snd.app-client.mobile.components.SndInterestQuickComposeSheet.descriptionPlaceholder'
              )}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              maxLength={1000}
              textAlignVertical='top'
              placeholderTextColor={semanticRoles.textMuted}
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
                `(الحد الأدنى: ${minimumDescriptionLength})`}
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestquickcomposesheet.l191_ar_1')}
            </Text>
            <TextInput
              style={[styles.input, textAlignStartStyle]}
              placeholder={t(
                'snd.app-client.mobile.components.SndInterestQuickComposeSheet.addressPlaceholder'
              )}
              value={location}
              onChangeText={setLocation}
              maxLength={200}
              placeholderTextColor={semanticRoles.textMuted}
            />
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestquickcomposesheet.l225_ar_1')}
            </Text>
            <View style={[styles.contactRow, directionStyle]}>
              <TouchableOpacity
                style={[
                  styles.contactChip,
                  contactMethod === 'in_app' && styles.contactChipSelected,
                ]}
                onPress={() => setContactMethod('in_app')}
                accessibilityRole='button'
                accessibilityLabel='التواصل داخل التطبيق'
                accessibilityHint='يبقي المتابعة داخل التطبيق'
                accessibilityState={{ selected: contactMethod === 'in_app' }}
                hitSlop={SND_INTERACTIVE_HIT_SLOP}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.contactText,
                    contactMethod === 'in_app' && styles.contactTextSelected,
                  ]}
                >
                  {t('surfaces.snd.interestquickcomposesheet.contact_in_app')}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.contactChip,
                  contactMethod === 'whatsapp' && styles.contactChipSelected,
                ]}
                onPress={() => setContactMethod('whatsapp')}
                accessibilityRole='button'
                accessibilityLabel='اختيار واتساب'
                accessibilityHint='يطلب رقم واتساب للمتابعة السريعة'
                accessibilityState={{ selected: contactMethod === 'whatsapp' }}
                hitSlop={SND_INTERACTIVE_HIT_SLOP}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.contactText,
                    contactMethod === 'whatsapp' && styles.contactTextSelected,
                  ]}
                >
                  📱 واتساب
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.contactChip,
                  contactMethod === 'phone' && styles.contactChipSelected,
                ]}
                onPress={() => setContactMethod('phone')}
                accessibilityRole='button'
                accessibilityLabel='اختيار الاتصال الهاتفي'
                accessibilityHint='يطلب رقم هاتف للمتابعة السريعة'
                accessibilityState={{ selected: contactMethod === 'phone' }}
                hitSlop={SND_INTERACTIVE_HIT_SLOP}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.contactText,
                    contactMethod === 'phone' && styles.contactTextSelected,
                  ]}
                >
                  {t('surfaces.snd.interestquickcomposesheet.contact_call')}
                </Text>
              </TouchableOpacity>
            </View>
            {contactMethod !== 'in_app' && (
              <TextInput
                style={[styles.input, textAlignStartStyle, styles.contactInput]}
                placeholder={
                  contactMethod === 'phone'
                    ? t(
                        'snd.app-client.mobile.components.SndInterestQuickComposeSheet.whatsappPlaceholder'
                      )
                    : t(
                        'snd.app-client.mobile.components.SndInterestQuickComposeSheet.whatsappPlaceholder'
                      )
                }
                value={contactInfo}
                onChangeText={setContactInfo}
                keyboardType='phone-pad'
                maxLength={20}
                placeholderTextColor={semanticRoles.textMuted}
              />
            )}
          </View>

          <View style={styles.section}>
            <Text style={[styles.label, textAlignStartStyle]}>
              {t('surfaces.snd.interestquickcomposesheet.l273_ar_1')}
            </Text>
            <TextInput
              style={[styles.input, textAlignStartStyle]}
              placeholder={t(
                'snd.app-client.mobile.components.SndInterestQuickComposeSheet.timePreferencePlaceholder'
              )}
              value={preferredTime}
              onChangeText={setPreferredTime}
              maxLength={100}
              placeholderTextColor={semanticRoles.textMuted}
            />
          </View>
        </Animated.View>

        <Animated.View style={actionAnimatedStyle}>
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={
              submitting ||
              serviceSelectionDisabled ||
              !serviceType ||
              description.trim().length < minimumDescriptionLength ||
              !location.trim() ||
              (contactMethod !== 'in_app' && !contactInfo.trim())
            }
            activeOpacity={0.7}
            accessibilityRole='button'
            accessibilityLabel='إرسال الطلب السريع'
            accessibilityHint='يرسل الطلب من شاشة السجل ثم ينقلك إلى تفاصيل الطلب'
            accessibilityState={{
              disabled:
                submitting ||
                serviceSelectionDisabled ||
                !serviceType ||
                description.trim().length < minimumDescriptionLength ||
                !location.trim() ||
                (contactMethod !== 'in_app' && !contactInfo.trim()),
            }}
            hitSlop={SND_INTERACTIVE_HIT_SLOP}
          >
            <Text style={styles.submitButtonText}>
              {submitting
                ? t('surfaces.snd.interestquickcomposesheet.l287_ar_1')
                : 'إرسال الطلب السريع'}
            </Text>
          </TouchableOpacity>
          <Text style={[styles.quickComposeFootnote, textAlignStartStyle]}>
            بعد الإرسال الناجح سنعيدك مباشرة إلى تفاصيل الطلب حتى يبقى السجل
            واضحًا بلا مسارات إضافية.
          </Text>
        </Animated.View>
      </ScrollView>
    </SndBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  label: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  hint: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  disabledServiceNotice: {
    marginBottom: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#ffd3bc',
    backgroundColor: '#fff2e8',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  disabledServiceNoticeText: {
    fontSize: typography.fontSize.xs,
    color: '#9f5420',
    lineHeight: typography.lineHeightPx.xs,
  },
  quickComposeNotice: {
    marginBottom: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d7e3ef',
    backgroundColor: '#f7fafd',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  quickComposeNoticeText: {
    fontSize: typography.fontSize.xs,
    color: '#47617c',
    lineHeight: typography.lineHeightPx.xs,
  },
  serviceTypesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  serviceTypeCard: {
    width: '31%',
    backgroundColor: '#ffffff',
    borderRadius: BTHWANI_RADIUS.lg,
    minHeight: SND_MIN_TOUCH_TARGET * 2,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: '#d9e4ef',
  },
  selectedServiceType: {
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 1,
  },
  serviceIconOrb: {
    width: 40,
    height: 40,
    borderRadius: BTHWANI_RADIUS.full,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: BTHWANI_BORDER.hairline,
    marginBottom: BTHWANI_SPACING.xs,
  },
  serviceLabel: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.text,
    textAlign: 'center',
  },
  selectedServiceLabel: {
    color: '#163760',
    fontWeight: typography.fontWeight.bold,
  },
  input: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: typography.fontSize.md,
    color: semanticRoles.text,
    borderWidth: BTHWANI_BORDER.hairline,
    borderColor: semanticRoles.border,
  },
  textArea: {
    minHeight: 96,
    paddingTop: BTHWANI_SPACING.md,
  },
  charCount: {
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  charCountWarning: {
    color: semanticRoles.stateError.icon,
  },
  contactRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
  },
  contactChip: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    minHeight: SND_MIN_TOUCH_TARGET,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  contactChipSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '10',
  },
  contactText: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.medium,
    color: semanticRoles.text,
  },
  contactTextSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: typography.fontWeight.bold,
  },
  contactInput: {
    marginTop: BTHWANI_SPACING.sm,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    minHeight: SND_MIN_TOUCH_TARGET,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.bold,
  },
  quickComposeFootnote: {
    marginBottom: BTHWANI_SPACING.xl,
    fontSize: typography.fontSize.xs,
    color: semanticRoles.textMuted,
    lineHeight: typography.lineHeightPx.xs,
  },
});

