/**
 * KWD Job Apply Sheet
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * Bottom Sheet for job application form
 * Simple form: name, phone, skill, availability + optional portfolio (3-10 images)
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { KwdBottomSheet } from './KwdBottomSheet';
// @ts-ignore - expo-image-picker is available at runtime in mobile app
import * as ImagePicker from 'expo-image-picker';
import { useKwdMyFile } from '../hooks/useKwdMyFile';
import { KWD_MAX_PORTFOLIO_IMAGES } from '../types';
import { getKwdMainCategories } from '../kwdCategories';
import { rawFetch } from '@bthwani/api-clients';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface KwdJobApplySheetProps {
  visible: boolean;
  jobId: string;
  jobTitle?: string;
  onClose: () => void;
  onSuccess: () => void;
}

export const KwdJobApplySheet: React.FC<KwdJobApplySheetProps> = ({
  visible,
  jobId,
  jobTitle,
  onClose,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('');
  const [availability, setAvailability] = useState('');
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { myFile, isLoading: myFileLoading, updateMyFile } = useKwdMyFile();
  const { t, isRTL } = useI18n();
  const KWD_MAIN_CATEGORIES = useMemo(() => getKwdMainCategories(t), [t]);
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);

  // عند فتح الشيت: تعبئة النموذج من "ملفي" (معلومات + صور) لتسريع الإدخال مع إمكانية التعديل قبل الإرسال
  useEffect(() => {
    if (!visible || myFileLoading) return;

    setName(myFile.fullName ?? '');
    setPhone(myFile.contactPhone ?? '');
    setSkill(myFile.primarySkill ?? '');
    setAvailability(myFile.availability ?? '');
    setPortfolioImages(myFile.portfolioImageUris?.length ? [...myFile.portfolioImageUris] : []);
    setSelectedCategoryIds(myFile.categoryIds?.length ? [...myFile.categoryIds] : []);
    setErrors({});
  }, [
    visible,
    myFileLoading,
    myFile.fullName,
    myFile.contactPhone,
    myFile.primarySkill,
    myFile.availability,
    myFile.portfolioImageUris,
    myFile.categoryIds,
  ]);

  const hasPrefillFromMyFile =
    !myFileLoading &&
    (!!myFile.fullName || !!myFile.contactPhone || !!myFile.primarySkill || !!myFile.availability ||
      (myFile.portfolioImageUris?.length ?? 0) > 0 || (myFile.categoryIds?.length ?? 0) > 0);

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
      const isNetworkError = error instanceof Error && (
        error.name === 'AbortError' ||
        error.name === 'TypeError' ||
        error.message.includes('Network request failed') ||
        error.message.includes('timeout')
      );

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const uploadPortfolioImages = async (imageUris: string[]): Promise<string[]> => {
    const uploadedUrls: string[] = [];
    setUploadingImages(true);

    try {
      for (const imageUri of imageUris) {
        try {
          const formData = new FormData();
          const filename = imageUri.split('/').pop() || 'image.jpg';
          const match = /\.(\w+)$/.exec(filename);
          const type = match ? `image/${match[1]}` : 'image/jpeg';

          formData.append('file', {
            uri: imageUri,
            type,
            name: filename,
          } as any);

          const response = await fetchWithRetry(
            `${getBaseUrl()}/api/platform/attachments`,
            {
              method: 'POST',
              credentials: 'include',
              body: formData,
            }
          );

          if (!response.ok) {
            console.warn(`Failed to upload image: ${filename}`);
            continue;
          }

          const json = await response.json();
          const attachmentId = json?.data?.id || json?.id;
          if (attachmentId) {
            uploadedUrls.push(attachmentId);
          }
        } catch (error) {
          console.warn('Image upload error:', error);
          continue;
        }
      }
    } finally {
      setUploadingImages(false);
    }

    return uploadedUrls;
  };

  const handlePickImages = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('kwd.app-client.mobile.components.KwdJobApplySheet.photosPermissionRequiredForGalleryAlt'), t('kwd.app-client.mobile.components.KwdJobApplySheet.photosPermissionRequiredForGalleryAlt'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: KWD_MAX_PORTFOLIO_IMAGES - portfolioImages.length,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset: any) => asset.uri);
        const totalImages = portfolioImages.length + newImages.length;

        if (totalImages > KWD_MAX_PORTFOLIO_IMAGES) {
          Alert.alert(t('kwd.app-client.mobile.components.KwdJobApplySheet.maxLabel'), t('surfaces.يمكن_إضافة_صور_كحد_أقصى', { max: String(KWD_MAX_PORTFOLIO_IMAGES) }));
          return;
        }

        setPortfolioImages([...portfolioImages, ...newImages]);
      }
    } catch (error) {
      Alert.alert(t('kwd.app-client.mobile.components.KwdJobApplySheet.errorMessage'), t('kwd.app-client.mobile.components.KwdJobApplySheet.errorMessage'));
    }
  }, [portfolioImages]);

  const handleRemoveImage = useCallback((index: number) => {
    setPortfolioImages(portfolioImages.filter((_, i) => i !== index));
  }, [portfolioImages]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = t('surfaces.الاسم_مطلوب');
    }

    if (phone.trim() && !/^[0-9+\-\s()]+$/.test(phone)) {
      newErrors.phone = t('surfaces.رقم_التواصل_غير_صحيح');
    }

    if (!skill.trim()) {
      newErrors.skill = t('surfaces.المهارة_مطلوبة');
    }

    if (!availability.trim()) {
      newErrors.availability = t('surfaces.التوافر_مطلوب');
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
      // Upload portfolio images first (اختياري بالكامل)
      let attachmentIds: string[] = [];
      if (portfolioImages.length > 0) {
        attachmentIds = await uploadPortfolioImages(portfolioImages);
      }

      void updateMyFile({
        fullName: name.trim(),
        contactPhone: phone.trim() || undefined,
        primarySkill: skill.trim(),
        availability: availability.trim(),
        portfolioImageUris: portfolioImages,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
      });

      // Submit application
      const response = await fetchWithRetry(
        `${getBaseUrl()}/api/kwd/jobs/${jobId}/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim() || undefined,
            skill: skill.trim(),
            availability: availability.trim(),
            portfolioImages: attachmentIds.length > 0 ? attachmentIds : undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || t('surfaces.فشل_في_إرسال_الطلب'));
      }

      Alert.alert(t('kwd.app-client.mobile.components.KwdJobApplySheet.requestSentSuccess'), t('kwd.app-client.mobile.components.KwdJobApplySheet.requestSentSuccess'), [
        {
          text: t('surfaces.حسناً'),
          onPress: () => {
            onSuccess();
            onClose();
            // Reset form
            setName('');
            setPhone('');
            setSkill('');
            setAvailability('');
            setPortfolioImages([]);
            setSelectedCategoryIds([]);
            setErrors({});
          },
        },
      ]);
    } catch (error: any) {
      Alert.alert(t('kwd.app-client.mobile.components.KwdJobApplySheet.errorSendMessage'), error.message || t('kwd.app-client.mobile.components.KwdJobApplySheet.errorSendMessage'));
    } finally {
      setSubmitting(false);
    }
  }, [jobId, name, phone, skill, availability, portfolioImages, selectedCategoryIds, onSuccess, onClose, updateMyFile]);

  return (
    <KwdBottomSheet
      visible={visible}
      onClose={onClose}
      height="large"
      title={t('kwd.app-client.mobile.components.KwdJobApplySheet.quickApply')}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {jobTitle && (
          <View style={styles.jobTitleCard}>
            <Text style={[styles.jobTitleText, textAlignStart]}>{jobTitle}</Text>
          </View>
        )}

        {hasPrefillFromMyFile && (
          <View style={styles.myFileBanner}>
            <Text style={[styles.myFileBannerText, textAlignStart]}>
              {t('surfaces.معبأ_من_ملفي_المهني')}
            </Text>
          </View>
        )}

        <Text style={[styles.formHint, textAlignStart]}>{t('surfaces.املأ_المعلومات_الأساسية')}</Text>

        {/* Form Fields — 4 حقول فقط */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.الاسم_الكامل')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.name && styles.inputError]}
            placeholder={t('kwd.app-client.mobile.components.KwdJobApplySheet.placeholder')}
            value={name}
            onChangeText={(text) => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: '' });
              }
            }}
            maxLength={100}
          />
          {errors.name && <Text style={[styles.errorText, textAlignStart]}>{errors.name}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.رقم_التواصل_اختياري')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.phone && styles.inputError]}
            placeholder="+967 771234567"
            value={phone}
            onChangeText={(text) => {
              setPhone(text);
              if (errors.phone) {
                setErrors({ ...errors, phone: '' });
              }
            }}
            keyboardType="phone-pad"
            maxLength={20}
          />
          {errors.phone && <Text style={[styles.errorText, textAlignStart]}>{errors.phone}</Text>}
          <Text style={[styles.helperText, textAlignStart]}>
            {t('surfaces.سيستخدم_صاحب_العمل_الرقم')}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.المهارة_أو_المهنة')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.skill && styles.inputError]}
            placeholder={t('kwd.app-client.mobile.components.KwdJobApplySheet.placeholder_377')}
            value={skill}
            onChangeText={(text) => {
              setSkill(text);
              if (errors.skill) {
                setErrors({ ...errors, skill: '' });
              }
            }}
            maxLength={100}
          />
          {errors.skill && <Text style={[styles.errorText, textAlignStart]}>{errors.skill}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.متى_أنت_متاح')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.availability && styles.inputError]}
            placeholder={t('kwd.app-client.mobile.components.KwdJobApplySheet.placeholder_394')}
            value={availability}
            onChangeText={(text) => {
              setAvailability(text);
              if (errors.availability) {
                setErrors({ ...errors, availability: '' });
              }
            }}
            maxLength={200}
          />
          {errors.availability && <Text style={[styles.errorText, textAlignStart]}>{errors.availability}</Text>}
        </View>

        {/* الفئات (اختياري) — اختيار متعدد */}
        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.الفئات_اختياري')}</Text>
          <Text style={[styles.helperText, textAlignStart]}>{t('surfaces.يمكنك_اختيار_أكثر_من_فئة')}</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={[styles.categoryChipsScroll, { direction: layoutDirection }]}
          >
            {KWD_MAIN_CATEGORIES.map((cat) => {
              const isSelected = selectedCategoryIds.includes(cat.id);
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.categoryChip, isSelected && styles.categoryChipActive, { direction: layoutDirection }]}
                  onPress={() => {
                    setSelectedCategoryIds(prev =>
                      isSelected ? prev.filter(id => id !== cat.id) : [...prev, cat.id]
                    );
                  }}
                  activeOpacity={0.85}
                  accessibilityLabel={cat.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                >
                  <Text style={styles.categoryChipIcon}>{cat.icon}</Text>
                  <Text
                    style={[styles.categoryChipLabel, isSelected && styles.categoryChipLabelActive]}
                    numberOfLines={1}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Portfolio Images — اختياري بالكامل */}
        <View style={styles.portfolioSection}>
          <Text style={[styles.portfolioLabel, textAlignStart]}>
            📸 {t('surfaces.معرض_أعمال_اختياري')}{portfolioImages.length > 0 ? ` ${portfolioImages.length}/${KWD_MAX_PORTFOLIO_IMAGES}` : ''}
          </Text>
          <Text style={[styles.portfolioHint, textAlignStart]}>
            {t('surfaces.اختياري_أضف_صوراً')}
          </Text>

          {portfolioImages.length > 0 && (
            <View style={[styles.imagesContainer, { direction: layoutDirection }]}>
              {portfolioImages.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.portfolioImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                    accessibilityLabel={t('common.remove', { default: 'Remove' })}
                    accessibilityRole="button"
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {portfolioImages.length < KWD_MAX_PORTFOLIO_IMAGES && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handlePickImages}
              disabled={uploadingImages}
              accessibilityLabel={t('surfaces.إضافة_صور')}
              accessibilityRole="button"
            >
              <Text style={styles.addImageText}>
                {uploadingImages ? t('surfaces.جاري_الرفع') : t('surfaces.إضافة_صور')}
              </Text>
            </TouchableOpacity>
          )}

          {errors.portfolio && <Text style={[styles.errorText, textAlignStart]}>{errors.portfolio}</Text>}
        </View>

        {/* سياسة الإلغاء — واضحة للمستخدم دون تعقيد */}
        <View style={styles.policyBlock}>
          <Text style={styles.policyText}>
            {t('surfaces.إلغاء_مجاني_5_دقائق')}
          </Text>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityLabel={submitting ? t('surfaces.جاري_الإرسال') : t('surfaces.تقديم_الطلب')}
          accessibilityRole="button"
        >
          <Text style={styles.submitButtonText}>
            {submitting ? t('surfaces.جاري_الإرسال') : t('surfaces.إرسال_الطلب')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KwdBottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
  jobTitleCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
  },
  jobTitleText: {
    fontSize: 15,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  formHint: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  myFileBanner: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.md,
    borderEndWidth: 3,
    borderEndColor: semanticRoles.primaryCTA,
  },
  myFileBannerText: {
    fontSize: 13,
    color: semanticRoles.text,
  },
  categoryChipsScroll: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.outline || semanticRoles.border,
  },
  categoryChipActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  categoryChipIcon: {
    fontSize: 14,
    marginStart: BTHWANI_SPACING.xs,
  },
  categoryChipLabel: {
    fontSize: 13,
    color: semanticRoles.text,
    maxWidth: 100,
  },
  categoryChipLabelActive: {
    color: semanticRoles.primaryCTAText,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  inputHint: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
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
  inputError: {
    borderColor: semanticRoles.error,
  },
  errorText: {
    fontSize: 12,
    color: semanticRoles.error,
    marginTop: BTHWANI_SPACING.xs,
  },
  imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  imageWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
    borderRadius: BTHWANI_RADIUS.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -8,
    end: -8,
    width: 24,
    height: 24,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  addImageButton: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 2,
    borderColor: semanticRoles.primaryCTA,
    borderStyle: 'dashed',
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImageText: {
    color: semanticRoles.primaryCTA,
    fontSize: 14,
    fontWeight: '600',
  },
  portfolioSection: {
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.md,
  },
  portfolioLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  portfolioHint: {
    fontSize: 11,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  helperText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  policyBlock: {
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  policyText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.xl,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
    marginBottom: BTHWANI_SPACING.xl,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
});

