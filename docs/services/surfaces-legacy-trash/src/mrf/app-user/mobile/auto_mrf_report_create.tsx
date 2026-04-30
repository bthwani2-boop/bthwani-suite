// MRF Report Create Screen - Lost & Found Report Creation
// Surface: app-client | Service: mrf
// §30 States: Loading / Error / Empty / Success / Content
// UX: Simple form, backend API integration, Minimum fields, Clear validation

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Image, Platform } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_TYPOGRAPHY } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import * as ImagePicker from 'expo-image-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { rawFetch } from '@bthwani/api-clients';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_mrf_report_createProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
}

export const auto_mrf_report_create: React.FC<auto_mrf_report_createProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [state, setState] = useState<ScreenState>('content');
  const [submitting, setSubmitting] = useState(false);

  const reporttypes = useMemo(
    () => [
      { id: 'missing', label: t('mrf.app-client.mobile.auto_mrf_report_create.categoryMissing'), icon: '🔍', description: t('mrf.app-client.mobile.auto_mrf_report_create.categoryMissing') },
      { id: 'found', label: t('mrf.app-client.mobile.auto_mrf_report_create.categoryFound'), icon: '✅', description: t('mrf.app-client.mobile.auto_mrf_report_create.categoryFound') },
    ],
    [t]
  );
  
  // Form fields
  const [reportType, setReportType] = useState<'missing' | 'found' | ''>('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState<{ city?: string; region?: string; coordinates?: { lat: number; lng: number } }>({});
  const [category, setCategory] = useState('');
  const [attachments, setAttachments] = useState<string[]>([]);
  
  // Contact information state
  const [contactMethod, setContactMethod] = useState<'in_app' | 'whatsapp' | 'phone'>('in_app');
  const [contactInfo, setContactInfo] = useState('');
  
  // Image upload state
  const [selectedImages, setSelectedImages] = useState<Array<{ uri: string; id?: string }>>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  // Date picker state
  const [lastSeenDate, setLastSeenDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleNavigate = useCallback(
    (screen: string, params?: any) => {
      if (navigation?.navigate) {
        navigation.navigate(screen as any, params);
      } else if (onNavigate) {
        onNavigate(screen);
      }
    },
    [navigation, onNavigate]
  );

  const handleRetry = useCallback(() => {
    setState('content');
  }, []);

  // Retry helper with exponential backoff
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
        error.message.includes('timeout') ||
        error.message.includes('NetworkError') ||
        error.message.includes('Failed to fetch')
      );

      if (isNetworkError && attempt < maxRetries) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 4000);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, maxRetries, attempt + 1);
      }

      throw error;
    }
  };

  const validateForm = (): boolean => {
    if (!reportType) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_create.validationCategoryRequired'), t('mrf.app-client.mobile.auto_mrf_report_create.validationCategoryRequired'));
      return false;
    }
    if (!title.trim()) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_create.validationTitleRequired'), t('mrf.app-client.mobile.auto_mrf_report_create.validationTitleRequired'));
      return false;
    }
    if (!description.trim()) {
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_create.validationDescriptionRequired'), t('mrf.app-client.mobile.auto_mrf_report_create.validationDescriptionRequired'));
      return false;
    }
    return true;
  };

  // Handle image picker
  const handlePickImages = useCallback(async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_create.validationPhotosPermissionRequired'), t('mrf.app-client.mobile.auto_mrf_report_create.validationPhotosPermissionRequired'));
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
        selectionLimit: 5, // Maximum 5 images
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImages = result.assets.map(asset => ({ uri: asset.uri }));
        setSelectedImages(prev => [...prev, ...newImages].slice(0, 5)); // Limit to 5 total
      }
    } catch (error: any) {
      console.error('Image picker error:', error);
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_create.errorSelectImagesMessage'), t('mrf.app-client.mobile.auto_mrf_report_create.errorSelectImagesMessage'));
    }
  }, []);

  // Remove selected image
  const handleRemoveImage = useCallback((index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  // Upload images to platform attachments API
  const uploadImages = useCallback(async (imageUris: string[]): Promise<string[]> => {
    const uploadedIds: string[] = [];
    
    for (const uri of imageUris) {
      try {
        // Create FormData for multipart upload
        const formData = new FormData();
        
        // Extract filename from URI
        const filename = uri.split('/').pop() || 'photo.jpg';
        const fileExtension = filename.split('.').pop() || 'jpg';
        const mimeType = `image/${fileExtension === 'jpg' ? 'jpeg' : fileExtension}`;
        
        // Add file to FormData
        formData.append('file', {
          uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
          type: mimeType,
          name: filename,
        } as any);

        // Upload to platform attachments API
        // Note: Don't set Content-Type header - let fetch set it automatically with boundary
        const response = await fetchWithRetry(
          `${getBaseUrl()}/api/platform/attachments`,
          {
            method: 'POST',
            headers: {
              // Content-Type will be set automatically by fetch with boundary
            },
            credentials: 'include',
            body: formData,
          }
        );

        if (response.ok) {
          const json = await response.json();
          if (json?.data?.attachment?.id) {
            uploadedIds.push(json.data.attachment.id);
          } else if (json?.data?.id) {
            uploadedIds.push(json.data.id);
          }
        } else {
          console.error('Image upload failed:', response.status);
        }
      } catch (error) {
        console.error('Image upload error:', error);
        // Continue with other images even if one fails
      }
    }
    
    return uploadedIds;
  }, [fetchWithRetry]);

  const handleSubmitReport = useCallback(async () => {
    if (!validateForm()) {
      return;
    }

    setSubmitting(true);
    setState('loading');
    setUploadingImages(true);

    try {
      // Upload images first if any selected
      let attachmentIds: string[] = [];
      if (selectedImages.length > 0) {
        const imageUris = selectedImages.map(img => img.uri);
        attachmentIds = await uploadImages(imageUris);
        
        // If some images failed to upload, warn but continue
        if (attachmentIds.length < selectedImages.length) {
          console.warn(`[MRF] Only ${attachmentIds.length} of ${selectedImages.length} images uploaded successfully`);
          // Continue with successfully uploaded images
        }
      }

      // Prepare request body according to API contract
      const requestBody = {
        reportType: reportType as 'missing' | 'found',
        title: title.trim(),
        description: description.trim(),
        location: Object.keys(location).length > 0 ? location : undefined,
        category: category.trim() || undefined,
        attachments: attachmentIds.length > 0 ? attachmentIds : (attachments.length > 0 ? attachments : undefined),
        lastSeenAt: lastSeenDate ? lastSeenDate.toISOString() : undefined,
        contactMethod: contactMethod === 'in_app' ? undefined : contactMethod,
        contactInfo: contactMethod !== 'in_app' && contactInfo.trim() ? contactInfo.trim() : undefined,
      };

      const response = await fetchWithRetry(
        `${getBaseUrl()}/api/mrf/reports`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData?.error || `HTTP ${response.status}: فشل في إنشاء البلاغ`);
      }

      const json = await response.json();
      
      if (!json?.success) {
        throw new Error(json?.error || 'فشل في إنشاء البلاغ');
      }

      // Success - navigate to report details
      const reportId = json?.data?.report?.reportId || json?.data?.report?.id;
      if (reportId) {
        setState('success');
        // Navigate to report details after a short delay
        setTimeout(() => {
          handleNavigate('MrfReportGet', { reportId });
        }, 2000);
      } else {
        setState('success');
      }
    } catch (error: any) {
      console.error('Report creation error:', error);
      setState('error');
      Alert.alert(t('mrf.app-client.mobile.auto_mrf_report_create.errorCreateMessage'), error.message || t('mrf.app-client.mobile.auto_mrf_report_create.errorCreateMessage'));
    } finally {
      setSubmitting(false);
      setUploadingImages(false);
    }
  }, [reportType, title, description, location, category, attachments, selectedImages, lastSeenDate, contactMethod, contactInfo, uploadImages, handleNavigate]);


  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <Text style={styles.title}>إبلاغ عن مفقود</Text>
          <Text style={styles.subtitle}>ساعد في العثور على الأحباء من خلال تقديم البلاغ</Text>

          <View style={[styles.emergencyBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.emergencyIcon}>🚨</Text>
            <Text style={styles.emergencyText}>
              في حالات الطوارئ، اتصل بالشرطة فوراً على 999
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>نوع البلاغ *</Text>
            <View style={[styles.reportTypesGrid, { flexDirection: 'row', direction: layoutDirection }]}>
              {reporttypes.map((type) => (
                <TouchableOpacity
                  key={type.id}
                  style={[
                    styles.reportTypeCard,
                    reportType === type.id && styles.selectedReportType
                  ]}
                  onPress={() => setReportType(type.id as 'missing' | 'found' | '')}
                >
                  <Text style={styles.reportTypeIcon}>{type.icon}</Text>
                  <Text style={[
                    styles.reportTypeLabel,
                    reportType === type.id && styles.selectedReportTypeLabel
                  ]}>
                    {type.label}
                  </Text>
                  <Text style={[
                    styles.reportTypeDesc,
                    reportType === type.id && styles.selectedReportTypeDesc
                  ]}>
                    {type.description}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات البلاغ</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>عنوان البلاغ *</Text>
              <TextInput
                style={styles.input}
                placeholder={t('mrf.app-client.mobile.auto_mrf_report_create.examplePlaceholder')}
                value={title}
                onChangeText={setTitle}
                maxLength={200}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>وصف البلاغ *</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder={t('mrf.app-client.mobile.auto_mrf_report_create.descriptionPlaceholder')}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={1000}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>الفئة (اختياري)</Text>
              <TextInput
                style={styles.input}
                placeholder={t('mrf.app-client.mobile.auto_mrf_report_create.keywordsPlaceholder')}
                value={category}
                onChangeText={setCategory}
                maxLength={50}
              />
            </View>
          </View>

          {/* Contact Information (Optional) */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>معلومات التواصل (اختياري)</Text>
            <View style={[styles.row, { flexDirection: 'row', direction: layoutDirection }]}>
              <View style={[styles.halfWidth, styles.rightMargin]}>
                <Text style={styles.contactMethodLabel}>وسيلة التواصل</Text>
                <View style={[styles.contactRow, { flexDirection: 'row', direction: layoutDirection }]}>
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
                  <Text style={styles.inputLabel}>رقم التواصل</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={contactMethod === 'phone' ? t('mrf.app-client.mobile.auto_mrf_report_create.whatsappPlaceholder') : t('mrf.app-client.mobile.auto_mrf_report_create.whatsappPlaceholder')}
                    value={contactInfo}
                    onChangeText={setContactInfo}
                    keyboardType="phone-pad"
                    maxLength={20}
                  />
                </View>
              )}
            </View>
            {contactMethod !== 'in_app' && (
              <Text style={styles.contactHint}>
                💡 يمكنك ترك هذا الحقل فارغاً للتواصل داخل التطبيق فقط
              </Text>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>الموقع (اختياري)</Text>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>المدينة</Text>
              <TextInput
                style={styles.input}
                placeholder={t('mrf.app-client.mobile.auto_mrf_report_create.cityExample')}
                value={location.city || ''}
                onChangeText={(text) => setLocation({ ...location, city: text || undefined })}
                maxLength={100}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>المنطقة</Text>
              <TextInput
                style={styles.input}
                placeholder={t('mrf.app-client.mobile.auto_mrf_report_create.cityExampleAlt')}
                value={location.region || ''}
                onChangeText={(text) => setLocation({ ...location, region: text || undefined })}
                maxLength={100}
              />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>تاريخ الفقدان/العثور (اختياري)</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {reportType === 'missing' ? t('surfaces.آخر_مرة_شوهد_فيها') : 
                 reportType === 'found' ? t('surfaces.تاريخ_العثور') : 
                 t('surfaces.تاريخ_الفقدانالعثور_اختياري')}
              </Text>
              
              <TouchableOpacity
                style={[styles.dateInput, { flexDirection: 'row', direction: layoutDirection }]}
                onPress={() => setShowDatePicker(true)}
                disabled={!reportType}
              >
                <Text style={[styles.dateText, !reportType && styles.dateTextDisabled]}>
                  {lastSeenDate 
                    ? lastSeenDate.toLocaleDateString('ar-SA', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })
                    : t('surfaces.اختر_التاريخ')}
                </Text>
                <Text style={styles.dateIcon}>📅</Text>
              </TouchableOpacity>
              
              {lastSeenDate && (
                <TouchableOpacity
                  style={styles.clearDateButton}
                  onPress={() => setLastSeenDate(null)}
                >
                  <Text style={styles.clearDateText}>✕ إلغاء التاريخ</Text>
                </TouchableOpacity>
              )}
              
              {!reportType && (
                <Text style={styles.dateHint}>يرجى اختيار نوع البلاغ أولاً</Text>
              )}
            </View>
            
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
                maximumDate={new Date()} // لا يمكن اختيار تاريخ في المستقبل
                minimumDate={new Date(new Date().setFullYear(new Date().getFullYear() - 10))} // أقصى 10 سنوات في الماضي
              />
            )}
            
            {Platform.OS === 'ios' && showDatePicker && (
              <TouchableOpacity
                style={styles.datePickerDoneButton}
                onPress={() => setShowDatePicker(false)}
              >
                <Text style={styles.datePickerDoneText}>تم</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.photoSection}>
            <Text style={styles.sectionTitle}>الصور المرفقة (اختياري)</Text>
            <Text style={styles.photoHint}>يمكنك إضافة حتى 5 صور</Text>
            
            <TouchableOpacity 
              style={[styles.photoUpload, uploadingImages && styles.photoUploadDisabled]}
              onPress={handlePickImages}
              disabled={uploadingImages || selectedImages.length >= 5}
            >
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoText}>
                {uploadingImages ? 'جاري الرفع...' : 
                 selectedImages.length >= 5 ? t('surfaces.تم_الوصول_للحد_الأقصى_5_صور') :
                 'إضافة صور'}
              </Text>
              <Text style={styles.photoSubtext}>
                {selectedImages.length > 0 
                  ? `${selectedImages.length} صورة محددة` 
                  : t('surfaces.يساعد_في_تحديد_الهوية')}
              </Text>
            </TouchableOpacity>
            
            {selectedImages.length > 0 && (
              <View style={[styles.selectedImagesContainer, { flexDirection: 'row', direction: layoutDirection }]}>
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

          <View style={[styles.privacyBanner, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.privacyIcon}>🔒</Text>
            <Text style={styles.privacyText}>
              معلوماتك محمية وستُستخدم فقط لأغراض البحث والإنقاذ
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, (!reportType || !title.trim() || !description.trim() || submitting) && styles.disabledButton]}
            onPress={handleSubmitReport}
            disabled={!reportType || !title.trim() || !description.trim() || submitting}
          >
            <Text style={[styles.submitText, (!reportType || !title.trim() || !description.trim() || submitting) && styles.disabledText]}>
              {submitting ? 'جاري الإرسال...' : t('surfaces.إرسال_البلاغ')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_إرسال_البلاغ')}
      errorMessage={t('surfaces.فشل_في_إرسال_البلاغ_يرجى_المحاولة_مر')}
      onErrorAction={handleRetry}
      successMessage="تم إنشاء البلاغ بنجاح. سيتم تحويلك إلى صفحة التفاصيل..."
      successActionText={t('surfaces.إغلاق')}
      onSuccessAction={() => {
        // Navigation is handled in handleSubmitReport
        setState('content');
      }}
      screenName="auto_mrf_report_create"
      operationName="mrf_report_create"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.bold,
    color: semanticRoles.text,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  emergencyBanner: {
    backgroundColor: colorTokens.error['50'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colorTokens.error['400'],
  },
  emergencyIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['2xl'],
    marginEnd: BTHWANI_SPACING.md,
  },
  emergencyText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: colorTokens.error['800'],
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  section: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  reportTypesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  reportTypeCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    width: '30%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  selectedReportType: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: colorTokens.success['50'],
  },
  reportTypeIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['3xl'],
    marginBottom: BTHWANI_SPACING.sm,
  },
  reportTypeLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  selectedReportTypeLabel: {
    color: semanticRoles.primaryCTA,
  },
  reportTypeDesc: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  selectedReportTypeDesc: {
    color: semanticRoles.primaryCTA,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabel: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.medium,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  photoSection: {
    padding: BTHWANI_SPACING.contentH,
  },
  photoUpload: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: semanticRoles.outline,
  },
  photoIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize['4xl'],
    marginBottom: BTHWANI_SPACING.sm,
    color: semanticRoles.textMuted,
  },
  photoText: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  photoSubtext: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: semanticRoles.textMuted,
  },
  privacyBanner: {
    backgroundColor: colorTokens.primary['50'],
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: 'semanticRoles.stateInfo.icon',
  },
  privacyIcon: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xl,
    marginEnd: BTHWANI_SPACING.md,
    marginTop: 2,
  },
  privacyText: {
    flex: 1,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.sm,
    color: colorTokens.primary['800'],
    lineHeight: 20,
  },
  submitButton: {
    backgroundColor: colorTokens.error['600'],
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: semanticRoles.textMuted,
  },
  submitText: {
    color: semanticRoles.surface,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.lg,
    fontWeight: BTHWANI_TYPOGRAPHY.fontWeight.semibold,
  },
  disabledText: {
    color: semanticRoles.surface,
  },
  dateInput: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
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
  photoHint: {
    fontSize: BTHWANI_TYPOGRAPHY.fontSize.xs,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  photoUploadDisabled: {
    opacity: 0.5,
  },
  selectedImagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: BTHWANI_RADIUS.md,
    marginEnd: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.sm,
    position: 'relative',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
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

export default auto_mrf_report_create;

