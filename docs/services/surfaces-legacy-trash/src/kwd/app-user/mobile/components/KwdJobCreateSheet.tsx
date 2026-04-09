/**
 * KWD Job Create Sheet
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * Bottom Sheet for creating a new job listing
 * Simple form: job type, category, skill, title, description, location, wage, duration
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KwdBottomSheet } from './KwdBottomSheet';
import { getKwdMainCategories } from '../kwdCategories';
import { rawFetch } from '@bthwani/api-clients';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface KwdJobCreateSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
  /** للانتقال إلى منشوراتي بعد النشر (عرض التفاصيل) */
  onNavigate?: (screen: string, params?: any) => void;
}

export const KwdJobCreateSheet: React.FC<KwdJobCreateSheetProps> = ({
  visible,
  onClose,
  onSuccess,
  onNavigate,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);
  const KWD_MAIN_CATEGORIES = useMemo(() => getKwdMainCategories(t), [t]);
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );

  const [submitting, setSubmitting] = useState(false);

  const jobtypes = useMemo(
    () => [
      {
        id: 'daily',
        label: t(
          'kwd.app-client.mobile.components.KwdJobCreateSheet.salaryTypeDaily'
        ),
        icon: '💰',
      },
      {
        id: 'one_time',
        label: t(
          'kwd.app-client.mobile.components.KwdJobCreateSheet.salaryTypeTask'
        ),
        icon: '🔧',
      },
      {
        id: 'recurring',
        label: t(
          'kwd.app-client.mobile.components.KwdJobCreateSheet.salaryTypeRecurring'
        ),
        icon: '🔄',
      },
      {
        id: 'contract',
        label: t(
          'kwd.app-client.mobile.components.KwdJobCreateSheet.salaryTypeContract'
        ),
        icon: '📝',
      },
      {
        id: 'permanent',
        label: t(
          'kwd.app-client.mobile.components.KwdJobCreateSheet.salaryTypePermanent'
        ),
        icon: '💼',
      },
    ],
    [t]
  );
  /** بعد النشر: عرض بطاقة مختصرة قابلة للنقر للتفاصيل */
  const [createdJob, setCreatedJob] = useState<{
    id?: string;
    title: string;
  } | null>(null);
  const [jobType, setJobType] = useState<string>('');
  const [categoryIds, setCategoryIds] = useState<string[]>([]);
  const [skill, setSkill] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [wage, setWage] = useState('');
  const [duration, setDuration] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetchWithRetry = async (
    url: string,
    options: RequestInit,
    maxRetries: number = MAX_RETRIES,
    attempt: number = 0
  ): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      if (!controller.signal.aborted) {
        controller.abort();
      }
    }, REQUEST_TIMEOUT);

    try {
      const response = await rawFetch(url, {
        ...options,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      const isNetworkError =
        error instanceof Error &&
        (error.name === 'AbortError' ||
          error.name === 'TypeError' ||
          error.message.includes('Network request failed') ||
          error.message.includes('timeout'));

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!jobType) {
      newErrors.jobType = t('surfaces.نوع_العمل_مطلوب');
    }

    if (!skill.trim()) {
      newErrors.skill = 'المهارة مطلوبة';
    }

    if (!title.trim()) {
      newErrors.title = t(
        'kwd.app-client.mobile.components.KwdJobCreateSheet.validationAddressRequired'
      );
    }

    if (!description.trim()) {
      newErrors.description = t('surfaces.الوصف_مطلوب');
    } else if (description.trim().length < 20) {
      newErrors.description = t('surfaces.الوصف_يجب_أن_يكون_20_حرف_على_الأقل');
    }

    if (!location.trim()) {
      newErrors.location = t('surfaces.الموقع_مطلوب');
    }

    if (contactPhone.trim() && !/^[0-9+\-\s()]+$/.test(contactPhone)) {
      newErrors.contactPhone = 'رقم التواصل غير صحيح';
    }

    if (!duration.trim()) {
      newErrors.duration = t('surfaces.المدة_مطلوبة');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Parse wage if provided
      let wageMin: number | undefined;
      let wageMax: number | undefined;
      if (wage.trim()) {
        const wageParts = wage
          .trim()
          .split('-')
          .map(s => s.trim());
        if (wageParts.length === 2) {
          wageMin = parseInt(wageParts[0].replace(/[^0-9]/g, ''));
          wageMax = parseInt(wageParts[1].replace(/[^0-9]/g, ''));
        } else {
          wageMin = parseInt(wage.trim().replace(/[^0-9]/g, ''));
        }
      }

      // Deferred: use contract operation when available; then set createdJob({ id: res.job?.id, title })
      // بعد النشر: عرض بطاقة مختصرة ثم نقرة واحدة للتفاصيل (منشوراتي)
      setCreatedJob({
        title:
          title.trim() ||
          t('kwd.app-client.mobile.components.KwdJobCreateSheet.newJobTitle'),
      });
      onSuccess();
    } catch (error: any) {
      Alert.alert(
        t('kwd.app-client.mobile.components.KwdJobCreateSheet.errorTitle'),
        error.message ||
          t('kwd.app-client.mobile.components.KwdJobCreateSheet.errorTitle')
      );
    } finally {
      setSubmitting(false);
    }
  }, [
    jobType,
    categoryIds,
    skill,
    title,
    description,
    location,
    contactPhone,
    wage,
    duration,
    onSuccess,
  ]);

  const handleCloseAfterSuccess = useCallback(() => {
    if (createdJob && onNavigate) {
      onNavigate('KwdMyListings', { highlightListingId: createdJob.id });
    }
    setCreatedJob(null);
    setJobType('');
    setCategoryIds([]);
    setSkill('');
    setTitle('');
    setDescription('');
    setLocation('');
    setContactPhone('');
    setWage('');
    setDuration('');
    setErrors({});
    onClose();
  }, [createdJob, onNavigate, onClose]);

  const handleClose = useCallback(() => {
    setCreatedJob(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!visible) setCreatedJob(null);
  }, [visible]);

  return (
    <KwdBottomSheet
      visible={visible}
      onClose={createdJob ? handleCloseAfterSuccess : handleClose}
      height='full'
      title={
        createdJob
          ? t(
              'kwd.app-client.mobile.components.KwdJobCreateSheet.createJobButton'
            )
          : t(
              'kwd.app-client.mobile.components.KwdJobCreateSheet.createJobButton'
            )
      }
    >
      {createdJob ? (
        <View style={styles.successBlock}>
          <Text style={styles.successMessage}>تم نشر إعلانك بنجاح.</Text>
          <TouchableOpacity
            style={styles.createdCard}
            onPress={handleCloseAfterSuccess}
            activeOpacity={0.85}
            accessibilityLabel={createdJob.title}
            accessibilityRole="button"
          >
            <Text
              style={[styles.createdCardTitle, textAlignStart]}
              numberOfLines={2}
            >
              {createdJob.title}
            </Text>
            <View style={styles.createdCardStatus}>
              <Text style={styles.createdCardStatusText}>{t('surfaces.listingStatusActive')}</Text>
            </View>
            <Text style={[styles.createdCardHint, textAlignStart]}>
              {t('surfaces.tapHereOrViewDetailsToGoToMyListings')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.viewDetailsButton}
            onPress={handleCloseAfterSuccess}
            activeOpacity={0.9}
            accessibilityLabel={isRTL ? `${t('surfaces.myListings')} ${t('surfaces.viewDetails')}` : `${t('surfaces.viewDetails')} ${t('surfaces.myListings')}`}
            accessibilityRole="button"
          >
            <Text style={styles.viewDetailsButtonText}>
              {isRTL ? `${t('surfaces.myListings')} → ${t('surfaces.viewDetails')}` : `${t('surfaces.viewDetails')} ← ${t('surfaces.myListings')}`}
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Job Type - compact chips row */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>نوع العمل *</Text>
            <View style={[styles.chipsRow, { direction: layoutDirection }]}>
              {jobtypes.map(type => {
                const isSelected = jobType === type.id;
                return (
                  <TouchableOpacity
                    key={type.id}
                    style={[styles.chip, isSelected && styles.chipActive, { direction: layoutDirection }]}
                    onPress={() => {
                      setJobType(type.id);
                      if (errors.jobType) {
                        setErrors({ ...errors, jobType: '' });
                      }
                    }}
                    activeOpacity={0.85}
                    accessibilityLabel={type.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={styles.chipIcon}>{type.icon}</Text>
                    <Text
                      style={[
                        styles.chipLabel,
                        isSelected && styles.chipLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {type.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            {errors.jobType && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.jobType}
              </Text>
            )}
          </View>

          {/* الفئات (اختياري) — اختيار متعدد، نفس قائمة إعلان البحث عن عامل */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              الفئات (اختياري)
            </Text>
            <Text style={[styles.helperText, textAlignStart]}>
              يمكنك اختيار أكثر من فئة
            </Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipsScroll}
            >
              {KWD_MAIN_CATEGORIES.map(cat => {
                const isSelected = categoryIds.includes(cat.id);
                return (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.chip, isSelected && styles.chipActive, { direction: layoutDirection }]}
                    onPress={() => {
                      setCategoryIds(prev =>
                        isSelected
                          ? prev.filter(id => id !== cat.id)
                          : [...prev, cat.id]
                      );
                    }}
                    activeOpacity={0.85}
                    accessibilityLabel={cat.label}
                    accessibilityRole="button"
                    accessibilityState={{ selected: isSelected }}
                  >
                    <Text style={styles.chipIcon}>{cat.icon}</Text>
                    <Text
                      style={[
                        styles.chipLabel,
                        isSelected && styles.chipLabelActive,
                      ]}
                      numberOfLines={1}
                    >
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Skill */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              المهارة المحددة *
            </Text>
            <TextInput
              style={[
                styles.input,
                { textAlign: isRTL ? 'right' : 'left' },
                errors.skill && styles.inputError,
              ]}
              placeholder={t(
                'kwd.app-client.mobile.components.KwdJobCreateSheet.salaryTypePermanent7'
              )}
              value={skill}
              onChangeText={text => {
                setSkill(text);
                if (errors.skill) {
                  setErrors({ ...errors, skill: '' });
                }
              }}
              maxLength={100}
            />
            {errors.skill && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.skill}
              </Text>
            )}
          </View>

          {/* Title */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              عنوان الإعلان *
            </Text>
            <TextInput
              style={[
                styles.input,
                { textAlign: isRTL ? 'right' : 'left' },
                errors.title && styles.inputError,
              ]}
              placeholder={t(
                'kwd.app-client.mobile.components.KwdJobCreateSheet.descriptionPlaceholder'
              )}
              value={title}
              onChangeText={text => {
                setTitle(text);
                if (errors.title) {
                  setErrors({ ...errors, title: '' });
                }
              }}
              maxLength={200}
            />
            {errors.title && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.title}
              </Text>
            )}
          </View>

          {/* Description */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>الوصف *</Text>
            <TextInput
              style={[
                styles.input,
                styles.textArea,
                { textAlign: isRTL ? 'right' : 'left' },
                errors.description && styles.inputError,
              ]}
              placeholder={t(
                'kwd.app-client.mobile.components.KwdJobCreateSheet.descriptionValidationHint'
              )}
              value={description}
              onChangeText={text => {
                setDescription(text);
                if (errors.description) {
                  setErrors({ ...errors, description: '' });
                }
              }}
              multiline
              numberOfLines={4}
              maxLength={1000}
              textAlignVertical='top'
            />
            <Text style={[styles.charCount, textAlignStart]}>
              {description.length}/1000{' '}
              {description.length < 20 && t('surfaces.الحد_الأدنى_20_حرف')}
            </Text>
            {errors.description && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.description}
              </Text>
            )}
          </View>

          {/* Location */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>الموقع *</Text>
            <TextInput
              style={[styles.input, errors.location && styles.inputError]}
              placeholder={t(
                'kwd.app-client.mobile.components.KwdJobCreateSheet.locationPlaceholder'
              )}
              value={location}
              onChangeText={text => {
                setLocation(text);
                if (errors.location) {
                  setErrors({ ...errors, location: '' });
                }
              }}
              maxLength={200}
            />
            {errors.location && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.location}
              </Text>
            )}
            <Text style={[styles.helperText, textAlignStart]}>
              نستخدم هذا الموقع لحساب المسافة بينك وبين الباحث عن عمل. لن نعرض
              عنوان العمل الدقيق، فقط المنطقة والمسافة بالكيلومتر.
            </Text>
          </View>

          {/* Wage + Duration في صف واحد لتقليل الطول */}
          <View style={[styles.row, { direction: layoutDirection }]}>
            <View style={[styles.halfWidth, styles.rightMargin]}>
              <Text style={[styles.inputLabel, textAlignStart]}>
                الأجر (اختياري)
              </Text>
              <TextInput
                style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
                placeholder={t(
                  'kwd.app-client.mobile.components.KwdJobCreateSheet.salaryPlaceholder'
                )}
                value={wage}
                onChangeText={setWage}
                keyboardType='numeric'
                maxLength={50}
              />
            </View>

            <View style={styles.halfWidth}>
              <Text style={[styles.inputLabel, textAlignStart]}>المدة *</Text>
              <TextInput
                style={[
                  styles.input,
                  { textAlign: isRTL ? 'right' : 'left' },
                  errors.duration && styles.inputError,
                ]}
                placeholder={t(
                  'kwd.app-client.mobile.components.KwdJobCreateSheet.durationPlaceholder'
                )}
                value={duration}
                onChangeText={text => {
                  setDuration(text);
                  if (errors.duration) {
                    setErrors({ ...errors, duration: '' });
                  }
                }}
                maxLength={100}
              />
              {errors.duration && (
                <Text style={[styles.errorText, textAlignStart]}>
                  {errors.duration}
                </Text>
              )}
            </View>
          </View>

          {/* Employer contact info */}
          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              معلومات التواصل لاستقبال الطلبات
            </Text>
            <Text style={[styles.helperText, textAlignStart]}>
              رقم واحد يتواصل معك من خلاله الباحث عن عمل بعد قبول الطلب. لن يظهر
              هذا الرقم إلا للأطراف المرتبطة بالإعلان.
            </Text>
            <Text style={[styles.inputLabel, textAlignStart]}>
              رقم التواصل (اختياري)
            </Text>
            <TextInput
              style={[
                styles.input,
                { textAlign: isRTL ? 'right' : 'left' },
                errors.contactPhone && styles.inputError,
              ]}
              placeholder='+967 771234567'
              value={contactPhone}
              onChangeText={text => {
                setContactPhone(text);
                if (errors.contactPhone) {
                  setErrors({ ...errors, contactPhone: '' });
                }
              }}
              keyboardType='phone-pad'
              maxLength={20}
            />
            {errors.contactPhone && (
              <Text style={[styles.errorText, textAlignStart]}>
                {errors.contactPhone}
              </Text>
            )}
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              submitting && styles.submitButtonDisabled,
            ]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityLabel={submitting ? t('surfaces.جاري_النشر') : t('surfaces.نشر_الإعلان')}
            accessibilityRole="button"
          >
            <Text style={styles.submitButtonText}>
              {submitting
                ? t('surfaces.جاري_النشر')
                : t('surfaces.نشر_الإعلان')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}
    </KwdBottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.lg,
  },
  halfWidth: {
    flex: 1,
  },
  rightMargin: {
    marginEnd: BTHWANI_SPACING.xs,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  optionCard: {
    flex: 1,
    minWidth: '30%',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 2,
    borderColor: semanticRoles.outline || semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.xs,
  },
  optionCardSelected: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '10',
  },
  optionIcon: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  optionLabelSelected: {
    color: semanticRoles.primaryCTA,
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  chipsScroll: {
    paddingVertical: BTHWANI_SPACING.xs,
    gap: BTHWANI_SPACING.sm,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    gap: BTHWANI_SPACING.xs,
  },
  chipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  chipIcon: {
    fontSize: 16,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  chipLabelActive: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '700',
  },
  input: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline || semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.text,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: semanticRoles.error,
  },
  charCount: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  helperText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  errorText: {
    fontSize: 12,
    color: semanticRoles.error,
    marginTop: BTHWANI_SPACING.xs,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.xl,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
  successBlock: {
    padding: BTHWANI_SPACING.contentH,
  },
  successMessage: {
    fontSize: 16,
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  createdCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.xl,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  createdCardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  createdCardStatus: {
    alignSelf: 'flex-end',
    backgroundColor: semanticRoles.primaryCTA + '20',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
  },
  createdCardStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
  },
  createdCardHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.sm,
  },
  viewDetailsButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  viewDetailsButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});

