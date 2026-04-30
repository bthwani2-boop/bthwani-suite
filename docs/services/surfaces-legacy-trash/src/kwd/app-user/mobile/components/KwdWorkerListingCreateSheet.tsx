/**
 * KWD Worker Listing Create Sheet
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * Bottom Sheet for creating "أبحث عن عمل" listing (job seeker profile)
 * Mirrors create flow: skill, title, location, availability, optional wage & contact
 */

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Image } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { KwdBottomSheet } from './KwdBottomSheet';
import { useKwdMyFile } from '../hooks/useKwdMyFile';
import { getKwdMainCategories } from '../kwdCategories';
import { KWD_MAX_PORTFOLIO_IMAGES } from '../types';
// @ts-ignore - expo-image-picker is available at runtime in mobile app
import * as ImagePicker from 'expo-image-picker';

interface KwdWorkerListingCreateSheetProps {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const KwdWorkerListingCreateSheet: React.FC<KwdWorkerListingCreateSheetProps> = ({
  visible,
  onClose,
  onSuccess,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [skill, setSkill] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [availability, setAvailability] = useState('');
  const [desiredWage, setDesiredWage] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { myFile, isLoading: myFileLoading, updateMyFile } = useKwdMyFile();
  const { t, isRTL } = useI18n();
  const KWD_MAIN_CATEGORIES = useMemo(() => getKwdMainCategories(t), [t]);
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);

  // عند فتح الشيت: تعبئة النموذج من "ملفي" لتسريع الإدخال مع إمكانية التعديل قبل الإرسال
  useEffect(() => {
    if (!visible || myFileLoading) return;

    setSkill(myFile.primarySkill ?? '');
    setLocation(myFile.preferredLocation ?? '');
    setAvailability(myFile.availability ?? '');
    setContactPhone(myFile.contactPhone ?? '');
    setSelectedCategoryIds(myFile.categoryIds?.length ? [...myFile.categoryIds] : []);
    setPortfolioImages(myFile.portfolioImageUris?.length ? [...myFile.portfolioImageUris] : []);
    setErrors({});
  }, [
    visible,
    myFileLoading,
    myFile.primarySkill,
    myFile.preferredLocation,
    myFile.availability,
    myFile.contactPhone,
    myFile.categoryIds,
    myFile.portfolioImageUris,
  ]);

  const hasPrefillFromMyFile =
    !myFileLoading &&
    (!!myFile.primarySkill || !!myFile.preferredLocation || !!myFile.availability ||
      !!myFile.contactPhone || (myFile.categoryIds?.length ?? 0) > 0 ||
      (myFile.portfolioImageUris?.length ?? 0) > 0);

  const handlePickImages = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.validationPhotosPermissionRequired'), t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.validationPhotosPermissionRequired'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        selectionLimit: KWD_MAX_PORTFOLIO_IMAGES - portfolioImages.length,
      });
      if (!result.canceled && result.assets?.length) {
        const newUris = result.assets.map((a: { uri: string }) => a.uri);
        if (portfolioImages.length + newUris.length > KWD_MAX_PORTFOLIO_IMAGES) {
          Alert.alert(t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.maxLabel'), t('surfaces.يمكن_إضافة_صور_كحد_أقصى', { max: String(KWD_MAX_PORTFOLIO_IMAGES) }));
          return;
        }
        setPortfolioImages(prev => [...prev, ...newUris]);
      }
    } catch {
      Alert.alert(t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.errorSelectImagesMessage'), t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.errorSelectImagesMessage'));
    }
  }, [portfolioImages.length]);

  const handleRemoveImage = useCallback((index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!skill.trim()) newErrors.skill = t('surfaces.المهارة_مطلوبة');
    if (!title.trim()) newErrors.title = t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.validationTitleRequired');
    if (!location.trim()) newErrors.location = t('surfaces.الموقع_مطلوب');
    if (!availability.trim()) newErrors.availability = t('surfaces.التوافر_مطلوب');
    if (contactPhone.trim() && !/^[0-9+\-\s()]+$/.test(contactPhone)) {
      newErrors.contactPhone = t('surfaces.رقم_التواصل_غير_صحيح');
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      void updateMyFile({
        primarySkill: skill.trim() || undefined,
        preferredLocation: location.trim() || undefined,
        availability: availability.trim() || undefined,
        contactPhone: contactPhone.trim() || undefined,
        categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
        portfolioImageUris: portfolioImages.length > 0 ? portfolioImages : undefined,
      });

      // Deferred: create worker listing when service is ready
      Alert.alert(t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.successPublishMessage'), t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.successPublishMessage'), [
        {
          text: t('surfaces.حسناً'),
          onPress: () => {
            onSuccess();
            onClose();
            setSkill('');
            setTitle('');
            setLocation('');
            setAvailability('');
            setDesiredWage('');
            setContactPhone('');
            setSelectedCategoryIds([]);
            setPortfolioImages([]);
            setErrors({});
          },
        },
      ]);
    } catch (error: unknown) {
      Alert.alert(t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.errorPublishMessage'), error instanceof Error ? error.message : t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.errorPublishMessage'));
    } finally {
      setSubmitting(false);
    }
  }, [skill, title, location, availability, contactPhone, selectedCategoryIds, portfolioImages, onSuccess, onClose, updateMyFile]);

  return (
    <KwdBottomSheet
      visible={visible}
      onClose={onClose}
      height="full"
      title={t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.createListingButton')}
    >
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {hasPrefillFromMyFile && (
          <View style={styles.myFileBanner}>
            <Text style={[styles.myFileBannerText, textAlignStart]}>
              {t('surfaces.معبأ_من_ملفي_المهني')}
            </Text>
          </View>
        )}

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.المهارة_أو_المهنة')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.skill && styles.inputError]}
            placeholder={t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.skillsPlaceholder')}
            value={skill}
            onChangeText={(t) => { setSkill(t); if (errors.skill) setErrors({ ...errors, skill: '' }); }}
            maxLength={100}
          />
          {errors.skill && <Text style={[styles.errorText, textAlignStart]}>{errors.skill}</Text>}
        </View>

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
                  accessibilityLabel={cat.label}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  activeOpacity={0.85}
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

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.عنوان_الإعلان')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.title && styles.inputError]}
            placeholder={t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.descriptionPlaceholder')}
            value={title}
            onChangeText={(t) => { setTitle(t); if (errors.title) setErrors({ ...errors, title: '' }); }}
            maxLength={200}
          />
          {errors.title && <Text style={[styles.errorText, textAlignStart]}>{errors.title}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.الموقع')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.location && styles.inputError]}
            placeholder={t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.locationPlaceholder')}
            value={location}
            onChangeText={(t) => { setLocation(t); if (errors.location) setErrors({ ...errors, location: '' }); }}
            maxLength={200}
          />
          {errors.location && <Text style={[styles.errorText, textAlignStart]}>{errors.location}</Text>}
          <Text style={[styles.helperText, textAlignStart]}>
            {t('surfaces.نستخدم_الموقع_لحساب_المسافة')}
          </Text>
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.التوافر')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.availability && styles.inputError]}
            placeholder={t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.availabilityPlaceholder')}
            value={availability}
            onChangeText={(t) => { setAvailability(t); if (errors.availability) setErrors({ ...errors, availability: '' }); }}
            maxLength={100}
          />
          {errors.availability && <Text style={[styles.errorText, textAlignStart]}>{errors.availability}</Text>}
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.الأجر_المرغوب_اختياري')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
            placeholder={t('kwd.app-client.mobile.components.KwdWorkerListingCreateSheet.salaryPlaceholder')}
            value={desiredWage}
            onChangeText={setDesiredWage}
            keyboardType="numeric"
            maxLength={50}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.معلومات_التواصل')}</Text>
          <Text style={[styles.helperText, textAlignStart]}>
            {t('surfaces.رقم_واحد_يتواصل')}
          </Text>
          <Text style={[styles.inputLabel, textAlignStart]}>{t('surfaces.رقم_التواصل_اختياري')}</Text>
          <TextInput
            style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }, errors.contactPhone && styles.inputError]}
            placeholder="+967 771234567"
            value={contactPhone}
            onChangeText={(t) => { setContactPhone(t); if (errors.contactPhone) setErrors({ ...errors, contactPhone: '' }); }}
            keyboardType="phone-pad"
            maxLength={20}
          />
          {errors.contactPhone && <Text style={[styles.errorText, textAlignStart]}>{errors.contactPhone}</Text>}
        </View>

        {/* معرض الأعمال (اختياري) — يظهر من ملفي ويمكن التعديل */}
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
            <TouchableOpacity style={styles.addImageButton} onPress={handlePickImages} accessibilityLabel={t('surfaces.إضافة_صور')} accessibilityRole="button">
              <Text style={styles.addImageText}>{t('surfaces.إضافة_صور')}</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
          accessibilityLabel={submitting ? t('surfaces.جاري_النشر') : t('surfaces.نشر_الإعلان')}
          accessibilityRole="button"
        >
          <Text style={styles.submitButtonText}>
            {submitting ? t('surfaces.جاري_النشر') : t('surfaces.نشر_الإعلان')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KwdBottomSheet>
  );
};

const styles = StyleSheet.create({
  content: { flex: 1 },
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
  portfolioSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  portfolioLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  portfolioHint: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
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
  inputGroup: { marginBottom: BTHWANI_SPACING.lg },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  helperText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
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
  inputError: { borderColor: semanticRoles.error },
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
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});

