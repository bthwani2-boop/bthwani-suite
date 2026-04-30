/**
 * MRF Report Quick Compose Sheet - Compact & Modern Design
 * Based on ESF RequestQuickComposeSheet design
 * §UX-SUPREME-001: 2 clicks max, compact layout, optimized space usage
 * 
 * Features:
 * - Compact grid layout
 * - Grouped related fields
 * - Minimal spacing
 * - Fast animations
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, Alert, Image, Platform } from 'react-native';
import { MrfBottomSheet } from './MrfBottomSheet';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface MrfReportQuickComposeSheetProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: ReportData) => void;
  initialData?: ReportData;
  isEditMode?: boolean;
}

export interface ReportData {
  reportType: 'missing' | 'found';
  title: string;
  description: string;
  location?: { city?: string; region?: string; coordinates?: { lat: number; lng: number } };
  category?: string;
  attachments?: string[];
  lastSeenAt?: string; // ISO date string
  contactMethod?: 'in_app' | 'whatsapp' | 'phone';
  contactInfo?: string;
}

export const MrfReportQuickComposeSheet: React.FC<MrfReportQuickComposeSheetProps> = ({
  visible,
  onClose,
  onSubmit,
  initialData,
  isEditMode = false,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const reportTypes = useMemo<Array<{ id: 'missing' | 'found'; label: string; emoji: string }>>(
    () => [
      { id: 'missing', label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryMissing'), emoji: '🔍' },
      { id: 'found', label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryFound'), emoji: '✅' },
    ],
    [t]
  );
  const [reportType, setReportType] = useState<'missing' | 'found' | ''>(initialData?.reportType || '');
  const [title, setTitle] = useState(initialData?.title || '');

  const categories = useMemo(
    () => [
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryPhone'), value: 'phone', icon: '📱' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryWallet'), value: 'wallet', icon: '💼' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryKeys'), value: 'keys', icon: '🔑' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryBag'), value: 'bag', icon: '👜' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryDocument'), value: 'document', icon: '📄' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryIdCard'), value: 'id_card', icon: '🪪' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryGlasses'), value: 'glasses', icon: '👓' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryWatch'), value: 'watch', icon: '⌚' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryElectronics'), value: 'electronics', icon: '💻' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryClothing'), value: 'clothing', icon: '👕' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryShoes'), value: 'shoes', icon: '👟' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryPet'), value: 'pet', icon: '🐾' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryBike'), value: 'bicycle', icon: '🚲' },
      { label: t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryOther'), value: 'other', icon: '📦' },
    ],
    [t]
  );
  const [description, setDescription] = useState(initialData?.description || '');
  const [city, setCity] = useState(initialData?.location?.city || '');
  const [region, setRegion] = useState(initialData?.location?.region || '');
  const [category, setCategory] = useState(initialData?.category || '');
  
  // Image upload state
  const [selectedImages, setSelectedImages] = useState<Array<{ uri: string; id?: string }>>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Date picker state
  const [lastSeenDate, setLastSeenDate] = useState<Date | null>(
    initialData?.lastSeenAt ? new Date(initialData.lastSeenAt) : null
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Location picker state
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  
  // Category picker state
  const [showCategoryPicker, setShowCategoryPicker] = useState(false);
  
  // Contact information state
  const [contactMethod, setContactMethod] = useState<'in_app' | 'whatsapp' | 'phone'>(initialData?.contactMethod || 'in_app');
  const [contactInfo, setContactInfo] = useState(initialData?.contactInfo || '');
  
  useEffect(() => {
    if (!visible) {
      if (!isEditMode) {
        setReportType('');
        setTitle('');
        setDescription('');
        setCity('');
        setRegion('');
        setCategory('');
        setSelectedImages([]);
        setLastSeenDate(null);
        setContactMethod('in_app');
        setContactInfo('');
      }
    } else if (initialData) {
      setReportType(initialData.reportType);
      setTitle(initialData.title);
      setDescription(initialData.description);
      setCity(initialData.location?.city || '');
      setRegion(initialData.location?.region || '');
      setCategory(initialData.category || '');
      setLastSeenDate(initialData.lastSeenAt ? new Date(initialData.lastSeenAt) : null);
    }
  }, [visible, initialData, isEditMode]);

  // Handle image picker
  const handlePickImages = useCallback(async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.alertTitle'), t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.alertTitle'));
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
        selectionLimit: 5,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map(asset => ({ uri: asset.uri }));
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 5));
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      Alert.alert(t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.errorSelectImagesMessage'), t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.errorSelectImagesMessage'));
    }
  }, []);

  // Remove selected image
  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleSubmit = () => {
    if (!reportType) {
      Alert.alert(t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.validationCategoryRequired'), t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.validationCategoryRequired'));
      return;
    }
    if (!title.trim()) {
      Alert.alert(t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.validationTitleRequired'), t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.validationTitleRequired'));
      return;
    }
    if (!description.trim()) {
      Alert.alert(t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.validationDescriptionRequired'), t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.validationDescriptionRequired'));
      return;
    }
    onSubmit({
      reportType: reportType as 'missing' | 'found',
      title: title.trim(),
      description: description.trim(),
      location: (city.trim() || region.trim()) ? {
        city: city.trim() || undefined,
        region: region.trim() || undefined,
      } : undefined,
      category: category.trim() || undefined,
      attachments: selectedImages.map(img => img.id).filter(Boolean) as string[],
      lastSeenAt: lastSeenDate ? lastSeenDate.toISOString() : undefined,
      contactMethod: contactMethod === 'in_app' ? undefined : contactMethod,
      contactInfo: contactMethod !== 'in_app' && contactInfo.trim() ? contactInfo.trim() : undefined,
    });
    onClose();
  };

  return (
    <MrfBottomSheet
      visible={visible}
      onClose={onClose}
      height="large"
      title={isEditMode ? t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.quickReportTitle') : t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.quickReportTitle')}
      showHandle={true}
      enableSwipeDown={true}
    >
      <ScrollView 
        style={styles.container} 
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Report Type */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.reportTypeLabel')}</Text>
          <View style={styles.reportTypesRow}>
            {reportTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.reportTypeButton,
                  reportType === type.id && styles.reportTypeButtonActive,
                ]}
                onPress={() => setReportType(type.id)}
              >
                <Text style={styles.reportTypeEmoji}>{type.emoji}</Text>
                <Text
                  style={[
                    styles.reportTypeLabel,
                    reportType === type.id && styles.reportTypeLabelActive,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.reportTitleLabel')}</Text>
          <TextInput
            style={styles.input}
            placeholder={t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.examplePlaceholder')}
            placeholderTextColor={semanticRoles.textMuted}
            value={title}
            onChangeText={setTitle}
            maxLength={200}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.reportDescriptionLabel')}</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder={t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.descriptionHint')}
            placeholderTextColor={semanticRoles.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={4}
            maxLength={1000}
          />
          <Text style={[styles.charCount, textAlignStart]}>{description.length}/1000</Text>
        </View>

        {/* Location Row */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.locationOptional')}</Text>
          <TouchableOpacity
            style={styles.locationButton}
            onPress={() => setShowLocationPicker(true)}
          >
            <Text style={styles.locationButtonIcon}>📍</Text>
            <Text style={styles.locationButtonText}>
              {city || region ? `${city || ''} ${region || ''}`.trim() : t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.chooseLocation')}
            </Text>
            <Text style={styles.locationButtonArrow}>›</Text>
          </TouchableOpacity>
          
          {(city || region) && (
            <View style={styles.row}>
              <View style={[styles.halfWidth, styles.rightMargin]}>
                <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.cityLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.cityExample')}
                  placeholderTextColor={semanticRoles.textMuted}
                  value={city}
                  onChangeText={setCity}
                  maxLength={100}
                />
              </View>
              <View style={styles.halfWidth}>
                <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.areaLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.areaExample')}
                  placeholderTextColor={semanticRoles.textMuted}
                  value={region}
                  onChangeText={setRegion}
                  maxLength={100}
                />
              </View>
            </View>
          )}
          
          {showLocationPicker && (
            <View style={styles.locationPickerContainer}>
              <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.enterLocationManually')}</Text>
              <View style={styles.row}>
                <View style={[styles.halfWidth, styles.rightMargin]}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.cityLabel')}
                    placeholderTextColor={semanticRoles.textMuted}
                    value={city}
                    onChangeText={setCity}
                    maxLength={100}
                  />
                </View>
                <View style={styles.halfWidth}>
                  <TextInput
                    style={styles.input}
                    placeholder={t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.areaLabel')}
                    placeholderTextColor={semanticRoles.textMuted}
                    value={region}
                    onChangeText={setRegion}
                    maxLength={100}
                  />
                </View>
              </View>
              <TouchableOpacity
                style={styles.locationPickerClose}
                onPress={() => setShowLocationPicker(false)}
              >
                <Text style={styles.locationPickerCloseText}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.done')}</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryOptional')}</Text>
          <TouchableOpacity
            style={styles.categoryButton}
            onPress={() => setShowCategoryPicker(true)}
          >
            <Text style={styles.categoryButtonText}>
              {category ? categories.find(c => c.value === category)?.label || category : t('surfaces.اختر_الفئة_اختياري')}
            </Text>
            <Text style={styles.categoryButtonArrow}>›</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information (Optional) */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.contactInfoOptional')}</Text>
          <View style={styles.row}>
            <View style={[styles.halfWidth, styles.rightMargin]}>
              <Text style={styles.contactMethodLabel}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.contactMethodLabel')}</Text>
              <View style={styles.contactRow}>
                <TouchableOpacity
                  style={[styles.contactChip, contactMethod === 'in_app' && styles.contactChipSelected]}
                  onPress={() => {
                    setContactMethod('in_app');
                    setContactInfo('');
                  }}
                >
                  <Text style={[styles.contactText, contactMethod === 'in_app' && styles.contactTextSelected]}>
                    💬
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.contactChip, contactMethod === 'whatsapp' && styles.contactChipSelected]}
                  onPress={() => setContactMethod('whatsapp')}
                >
                  <Text style={[styles.contactText, contactMethod === 'whatsapp' && styles.contactTextSelected]}>
                    📱
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.contactChip, contactMethod === 'phone' && styles.contactChipSelected]}
                  onPress={() => setContactMethod('phone')}
                >
                  <Text style={[styles.contactText, contactMethod === 'phone' && styles.contactTextSelected]}>
                    ☎️
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            {contactMethod !== 'in_app' && (
              <View style={styles.halfWidth}>
                <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.contactNumberLabel')}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={contactMethod === 'phone' ? t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.whatsappPlaceholder') : t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.whatsappPlaceholder')}
                  value={contactInfo}
                  onChangeText={setContactInfo}
                  keyboardType="phone-pad"
                  placeholderTextColor={semanticRoles.textMuted}
                  maxLength={20}
                />
              </View>
            )}
          </View>
          {contactMethod !== 'in_app' && (
            <Text style={styles.contactHint}>
              {t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.contactHint')}
            </Text>
          )}
        </View>

        {/* Date Picker */}
        <View style={styles.section}>
          <Text style={styles.label}>
            {reportType === 'missing' ? t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.dateLastSeen') :
             reportType === 'found' ? t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.dateFound') :
             t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.dateOptional')}
          </Text>
          <TouchableOpacity
            style={styles.dateInput}
            onPress={() => setShowDatePicker(true)}
            disabled={!reportType}
          >
            <Text style={[styles.dateText, !reportType && styles.dateTextDisabled]}>
              {lastSeenDate
                ? lastSeenDate.toLocaleDateString(isRTL ? 'ar-SA' : 'en-GB', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })
                : t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.chooseDate')}
            </Text>
            <Text style={styles.dateIcon}>📅</Text>
          </TouchableOpacity>
          {lastSeenDate && (
            <TouchableOpacity
              style={styles.clearDateButton}
              onPress={() => setLastSeenDate(null)}
            >
              <Text style={styles.clearDateText}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.clearDate')}</Text>
            </TouchableOpacity>
          )}
          {!reportType && (
            <Text style={styles.dateHint}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.dateHintFirst')}</Text>
          )}
          
          {showDatePicker && (
            <DateTimePicker
              value={lastSeenDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) => {
                if (Platform.OS === 'android') {
                  setShowDatePicker(false);
                }
                if (event.type === 'set' && selectedDate) {
                  setLastSeenDate(selectedDate);
                  if (Platform.OS === 'ios') {
                    setShowDatePicker(false);
                  }
                } else if (event.type === 'dismissed') {
                  setShowDatePicker(false);
                }
              }}
              maximumDate={new Date()}
              minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))}
            />
          )}
          
          {Platform.OS === 'ios' && showDatePicker && (
            <TouchableOpacity
              style={styles.datePickerDoneButton}
              onPress={() => setShowDatePicker(false)}
            >
              <Text style={styles.datePickerDoneText}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.done')}</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Image Upload */}
        <View style={styles.section}>
          <Text style={styles.label}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.attachedPhotosOptional')}</Text>
          <Text style={styles.photoHint}>{t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.photoHint')}</Text>
          
          <TouchableOpacity 
            style={[styles.photoUpload, uploadingImages && styles.photoUploadDisabled]}
            onPress={handlePickImages}
            disabled={uploadingImages || selectedImages.length >= 5}
          >
            <Text style={styles.photoIcon}>📷</Text>
            <Text style={styles.photoText}>
              {uploadingImages ? t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.uploadingPhotos') :
               selectedImages.length >= 5 ? t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.maxPhotosReached') :
               t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.addPhotos')}
            </Text>
            <Text style={styles.photoSubtext}>
              {selectedImages.length > 0
                ? `${selectedImages.length} ${t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.photosSelected')}`
                : t('surfaces.يساعد_في_التعرف_على_الشيء')}
            </Text>
          </TouchableOpacity>
          
          {selectedImages.length > 0 && (
            <View style={styles.selectedImagesContainer}>
              {selectedImages.map((image, index) => (
                <View key={index} style={styles.imagePreview}>
                  <Image source={{ uri: image.uri }} style={styles.previewImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                    disabled={uploadingImages}
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Submit Button */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.submitButton, (!reportType || !title.trim() || !description.trim()) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!reportType || !title.trim() || !description.trim()}
          >
            <Text style={[styles.submitButtonText, (!reportType || !title.trim() || !description.trim()) && styles.submitButtonTextDisabled]}>
              {isEditMode ? t('surfaces.حفظ_التعديلات') : `🔍 ${t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.submitReport')}`}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Category Picker Bottom Sheet */}
      <MrfBottomSheet
        visible={showCategoryPicker}
        onClose={() => setShowCategoryPicker(false)}
        height="medium"
        title={t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.categoryPickerTitle')}
        showHandle={true}
        enableSwipeDown={true}
      >
        <ScrollView style={{ flex: 1 }}>
          <TouchableOpacity
            style={[
              {
                padding: BTHWANI_SPACING.md,
                borderBlockEndWidth: 1,
                borderBlockEndColor: semanticRoles.border,
                flexDirection: 'row',
                alignItems: 'center',
              },
              !category && {
                backgroundColor: semanticRoles.primaryCTA + '20',
              },
            ]}
            onPress={() => {
              setCategory('');
              setShowCategoryPicker(false);
            }}
          >
            <Text style={{ fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'], marginEnd: BTHWANI_SPACING.sm }}>🔍</Text>
            <Text
              style={{
                fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
                fontWeight: !category ? BTHWANI_TYPOGRAPHY.fontWeight.bold : BTHWANI_TYPOGRAPHY.fontWeight.medium,
                color: !category ? semanticRoles.primaryCTA : semanticRoles.text,
                flex: 1,
              }}
            >
              {t('mrf.app-client.mobile.components.MrfReportQuickComposeSheet.noCategory')}
            </Text>
            {!category && (
              <Text style={{ fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl, color: semanticRoles.primaryCTA }}>✓</Text>
            )}
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.value}
              style={[
                {
                  padding: BTHWANI_SPACING.md,
                  borderBlockEndWidth: 1,
                  borderBlockEndColor: semanticRoles.border,
                  flexDirection: 'row',
                  alignItems: 'center',
                },
                category === cat.value && {
                  backgroundColor: semanticRoles.primaryCTA + '20',
                },
              ]}
              onPress={() => {
                setCategory(cat.value);
                setShowCategoryPicker(false);
              }}
            >
              <Text style={{ fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'], marginEnd: BTHWANI_SPACING.sm }}>
                {cat.icon}
              </Text>
              <Text
                style={{
                  fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
                  fontWeight: category === cat.value ? BTHWANI_TYPOGRAPHY.fontWeight.bold : BTHWANI_TYPOGRAPHY.fontWeight.medium,
                  color: category === cat.value ? semanticRoles.primaryCTA : semanticRoles.text,
                  flex: 1,
                }}
              >
                {cat.label}
              </Text>
              {category === cat.value && (
                <Text style={{ fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl, color: semanticRoles.primaryCTA }}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </MrfBottomSheet>
    </MrfBottomSheet>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  row: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.lg,
    gap: BTHWANI_SPACING.sm,
  },
  halfWidth: {
    flex: 1,
  },
  rightMargin: {
    marginEnd: BTHWANI_SPACING.xs,
  },
  label: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  reportTypesRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  reportTypeButton: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: semanticRoles.border,
  },
  reportTypeButtonActive: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.primaryCTA + '20',
  },
  reportTypeEmoji: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  reportTypeLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
  },
  reportTypeLabelActive: {
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  actions: {
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.xl,
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: semanticRoles.surfaceSubtle,
    opacity: 0.5,
  },
  submitButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  submitButtonTextDisabled: {
    color: semanticRoles.textMuted,
  },
  locationButton: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.sm,
  },
  locationButtonIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    marginEnd: BTHWANI_SPACING.sm,
  },
  locationButtonText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
  },
  locationButtonArrow: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    color: semanticRoles.textMuted,
  },
  locationPickerContainer: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginTop: BTHWANI_SPACING.sm,
  },
  locationPickerClose: {
    marginTop: BTHWANI_SPACING.sm,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  locationPickerCloseText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.primaryCTA,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  dateInput: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
    flex: 1,
  },
  dateTextDisabled: {
    color: semanticRoles.textMuted,
  },
  dateIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    marginStart: BTHWANI_SPACING.sm,
  },
  clearDateButton: {
    marginTop: BTHWANI_SPACING.sm,
    padding: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  clearDateText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: colorTokens.error['600'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
  },
  dateHint: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
    fontStyle: 'italic',
  },
  datePickerDoneButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.sm,
  },
  datePickerDoneText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  photoHint: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  photoUpload: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: semanticRoles.border,
    borderStyle: 'dashed',
  },
  photoUploadDisabled: {
    opacity: 0.5,
  },
  photoIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['3xl'],
    marginBottom: BTHWANI_SPACING.xs,
  },
  photoText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  photoSubtext: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  imagePreview: {
    width: 80,
    height: 80,
    borderRadius: BTHWANI_RADIUS.md,
    marginEnd: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
    position: 'relative',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    end: 4,
    backgroundColor: colorTokens.error['600'],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.surface,
  },
  removeImageText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
  },
  categoryButton: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  categoryButtonText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.text,
  },
  categoryButtonArrow: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    color: semanticRoles.textMuted,
  },
  contactMethodLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  contactRow: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.xs,
  },
  contactChip: {
    flex: 1,
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
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
  },
  contactTextSelected: {
    // Emoji stays same
  },
  contactHint: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
    fontStyle: 'italic',
  },
});

