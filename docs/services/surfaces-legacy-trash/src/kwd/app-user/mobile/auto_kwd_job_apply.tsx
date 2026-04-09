// KWD Job Apply Screen - Simple Job Application Form
// Surface: app-client | Service: kwd
// §30 States: Loading / Empty / Error / Success / Content
// §86 UI Screen Closure: Complete with all states and proper error handling
// Design: Simple, flexible, smart - for developing economy (Yemen)
// No complex CV/resume, no complex contracts, no earnest money
// Simple form: name, phone, skill, availability + optional portfolio (3-10 images, JPEG/PNG only)

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, colorTokens } from '@bthwani/ui-kit';
import { AppSuccessState } from '@bthwani/ui-kit';
// @ts-ignore - expo-image-picker is available at runtime in mobile app
import * as ImagePicker from 'expo-image-picker';
import { useKwdMyFile } from './hooks/useKwdMyFile';
import { KWD_MAX_PORTFOLIO_IMAGES } from './types';

// Network retry configuration
const MAX_RETRIES = 3;
const REQUEST_TIMEOUT = 20000;

interface auto_kwd_job_applyProps {
  onNavigate?: (screen: string, params?: any) => void;
  navigation?: { navigate: (screen: string, params?: any) => void };
  route?: { params?: { jobId?: string } };
}

export const auto_kwd_job_apply: React.FC<auto_kwd_job_applyProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const [state, setState] = useState<ScreenState>('content');
  const [submitting, setSubmitting] = useState(false);
  const { myFile, isLoading: myFileLoading, updateMyFile } = useKwdMyFile();

  // Get jobId from route params
  const jobId = route?.params?.jobId || 'job_123456';

  // Form fields (simple - no complex CV/resume)
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [skill, setSkill] = useState('');
  const [availability, setAvailability] = useState('');

  // Portfolio images (optional, 3-10 images, JPEG/PNG only)
  const [portfolioImages, setPortfolioImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { t, isRTL } = useI18n();

  const validFormats = useMemo(() => ['.jpg', '.jpeg', '.png', '.webp'], []);

  const removePortfolioImage = useCallback((index: number) => {
    setPortfolioImages(prev => prev.filter((_, i) => i !== index));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = t('surfaces.الاسم_مطلوب');
    if (phone.trim() && !/^[+]?[0-9]{8,15}$/.test(phone.replace(/\s/g, '')))
      newErrors.phone = 'رقم التواصل غير صحيح';
    if (!skill.trim()) newErrors.skill = t('surfaces.المهارة_مطلوبة');
    if (!availability.trim())
      newErrors.availability = t('surfaces.التوافر_مطلوب');
    if (portfolioImages.length > KWD_MAX_PORTFOLIO_IMAGES)
      newErrors.portfolio = `يمكنك إضافة ما يصل إلى ${KWD_MAX_PORTFOLIO_IMAGES} صور فقط`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [name, phone, skill, availability, portfolioImages.length]);

  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const layoutDirection = useMemo(
    () => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    [isRTL]
  );

  useEffect(() => {
    if (myFileLoading) return;

    setName(prev => prev || myFile.fullName || '');
    setPhone(prev => prev || myFile.contactPhone || '');
    setSkill(prev => prev || myFile.primarySkill || '');
    setAvailability(prev => prev || myFile.availability || '');

    if (portfolioImages.length === 0 && myFile.portfolioImageUris?.length) {
      setPortfolioImages(myFile.portfolioImageUris);
    }
  }, [
    myFileLoading,
    myFile.fullName,
    myFile.contactPhone,
    myFile.primarySkill,
    myFile.availability,
    myFile.portfolioImageUris,
    portfolioImages.length,
  ]);

  const handleNavigate = useCallback(
    (screen: string, params?: any) => {
      if (navigation?.navigate) {
        navigation.navigate(screen as any, params);
      } else if (onNavigate) {
        onNavigate(screen, params);
      }
    },
    [navigation, onNavigate]
  );

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

  // Upload portfolio images
  const uploadPortfolioImages = async (
    imageUris: string[]
  ): Promise<string[]> => {
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
              uploadedUrls.push(json.data.attachment.id);
            } else if (json?.data?.id) {
              uploadedUrls.push(json.data.id);
            }
          } else {
            console.error('Image upload failed:', response.status);
          }
        } catch (error) {
          console.error('Image upload error:', error);
          // Continue with other images even if one fails
        }
      }
    } finally {
      setUploadingImages(false);
    }

    return uploadedUrls;
  };

  // Pick portfolio images
  const pickPortfolioImages = async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t(
            'kwd.app-client.mobile.auto_kwd_job_apply.photosPermissionRequiredForListing'
          ),
          t(
            'kwd.app-client.mobile.auto_kwd_job_apply.photosPermissionRequiredForListing'
          )
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
        allowsEditing: false,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset: any) => asset.uri);
        const totalImages = portfolioImages.length + newImages.length;
        if (totalImages > KWD_MAX_PORTFOLIO_IMAGES) {
          Alert.alert(
            t('kwd.app-client.mobile.auto_kwd_job_apply.photosLimit'),
            `يمكنك إضافة ما يصل إلى ${KWD_MAX_PORTFOLIO_IMAGES} صورة فقط`
          );
          return;
        }
        const invalidImages = newImages.filter((uri: string) => {
          const extension = uri.toLowerCase().substring(uri.lastIndexOf('.'));
          return !validFormats.includes(extension);
        });
        if (invalidImages.length > 0) {
          Alert.alert(
            t('kwd.app-client.mobile.auto_kwd_job_apply.photosFormatValidation'),
            t('kwd.app-client.mobile.auto_kwd_job_apply.photosFormatValidation')
          );
          return;
        }
        setPortfolioImages(prev => [...prev, ...newImages]);
      }
    } catch (error) {
      console.error('Error picking images:', error);
      Alert.alert(
        t('kwd.app-client.mobile.auto_kwd_job_apply.errorMessage'),
        t('kwd.app-client.mobile.auto_kwd_job_apply.errorMessage')
      );
    }
  };

  const handleSubmit = useCallback(async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    setState('loading');
    let uploadedImageUrls: string[] = [];
    try {
      if (portfolioImages.length > 0) {
        uploadedImageUrls = await uploadPortfolioImages(portfolioImages);
      }
      void updateMyFile({
        fullName: name.trim(),
        contactPhone: phone.trim() || undefined,
        primarySkill: skill.trim(),
        availability: availability.trim(),
        portfolioImageUris: portfolioImages,
      });
      const baseUrl = getBaseUrl();
      const response = await fetchWithRetry(
        `${baseUrl}/api/kwd/jobs/${encodeURIComponent(jobId)}/apply`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            name: name.trim(),
            phone: phone.trim() || undefined,
            skill: skill.trim(),
            availability: availability.trim(),
            portfolioImages:
              uploadedImageUrls.length > 0 ? uploadedImageUrls : undefined,
          }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const json = await response.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في تقديم الطلب');
      setState('success');
      Alert.alert(
        t('surfaces.تم_التقديم_بنجاح'),
        t('surfaces.تم_إرسال_طلبك_بنجاح_سنتواصل_معك_قريب'),
        [
          {
            text: 'حسناً',
            onPress: () => handleNavigate('KwdMyApplicationsList'),
          },
        ]
      );
    } catch (error: any) {
      console.error('[KWD Job Apply] Submit error:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t('kwd.app-client.mobile.auto_kwd_job_apply.errorMessage_350');
      Alert.alert(
        t('kwd.app-client.mobile.auto_kwd_job_apply.errorMessage_351'),
        errorMessage
      );
      setState('content');
    } finally {
      setSubmitting(false);
    }
  }, [
    validateForm,
    portfolioImages,
    name,
    phone,
    skill,
    availability,
    jobId,
    updateMyFile,
    handleNavigate,
    t,
  ]);

  if (state === 'success') {
    return (
      <ScreenWrapper
        state='success'
        screenName='auto_kwd_job_apply'
        operationName='kwd_application_create'
      >
        <View style={styles.container}>
          <AppSuccessState
            message={t('kwd.app-client.mobile.auto_kwd_job_apply.successMessage')}
          />
          <TouchableOpacity
            style={styles.successButton}
            onPress={() => handleNavigate('KwdMyApplicationsList')}
            accessibilityLabel={t(
              'kwd.app-client.mobile.auto_kwd_job_apply.successButtonText'
            )}
            accessibilityRole='button'
          >
            <Text style={styles.successButtonText}>
              {t('kwd.app-client.mobile.auto_kwd_job_apply.successButtonText')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      screenName='auto_kwd_job_apply'
      operationName='kwd_application_create'
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <Text style={[styles.title, textAlignStart]}>
          {t('kwd.app-client.mobile.auto_kwd_job_apply.title')}
        </Text>
        <Text style={[styles.subtitle, textAlignStart]}>
          {t('kwd.app-client.mobile.auto_kwd_job_apply.subtitle')}
        </Text>

        {/* Simple Form Fields */}
        <View style={styles.formSection}>
          <Text style={[styles.label, textAlignStart]}>الاسم الكامل *</Text>
          <TextInput
            style={[
              styles.input,
              { textAlign: isRTL ? 'right' : 'left' },
              errors.name && styles.inputError,
            ]}
            value={name}
            onChangeText={text => {
              setName(text);
              if (errors.name) {
                setErrors({ ...errors, name: '' });
              }
            }}
            placeholder={t(
              'kwd.app-client.mobile.auto_kwd_job_apply.placeholder'
            )}
            placeholderTextColor={semanticRoles.textMuted}
            editable={!submitting}
          />
          {errors.name && (
            <Text style={[styles.errorText, textAlignStart]}>
              {errors.name}
            </Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, textAlignStart]}>
            رقم التواصل (اختياري)
          </Text>
          <TextInput
            style={[
              styles.input,
              { textAlign: isRTL ? 'right' : 'left' },
              errors.phone && styles.inputError,
            ]}
            value={phone}
            onChangeText={text => {
              setPhone(text);
              if (errors.phone) {
                setErrors({ ...errors, phone: '' });
              }
            }}
            placeholder='+966501234567'
            placeholderTextColor={semanticRoles.textMuted}
            keyboardType='phone-pad'
            editable={!submitting}
          />
          {errors.phone && (
            <Text style={[styles.errorText, textAlignStart]}>
              {errors.phone}
            </Text>
          )}
          <Text style={[styles.hint, textAlignStart]}>
            سيستخدم صاحب العمل هذا الرقم للتواصل معك (مكالمة أو واتساب). لن يظهر
            هذا الرقم إلا للأطراف المرتبطة بالفرصة.
          </Text>
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, textAlignStart]}>المهارة *</Text>
          <TextInput
            style={[
              styles.input,
              { textAlign: isRTL ? 'right' : 'left' },
              errors.skill && styles.inputError,
            ]}
            value={skill}
            onChangeText={text => {
              setSkill(text);
              if (errors.skill) {
                setErrors({ ...errors, skill: '' });
              }
            }}
            placeholder={t(
              'kwd.app-client.mobile.auto_kwd_job_apply.placeholder_438'
            )}
            placeholderTextColor={semanticRoles.textMuted}
            editable={!submitting}
          />
          {errors.skill && (
            <Text style={[styles.errorText, textAlignStart]}>
              {errors.skill}
            </Text>
          )}
        </View>

        <View style={styles.formSection}>
          <Text style={[styles.label, textAlignStart]}>التوافر *</Text>
          <TextInput
            style={[
              styles.input,
              { textAlign: isRTL ? 'right' : 'left' },
              errors.availability && styles.inputError,
            ]}
            value={availability}
            onChangeText={text => {
              setAvailability(text);
              if (errors.availability) {
                setErrors({ ...errors, availability: '' });
              }
            }}
            placeholder={t(
              'kwd.app-client.mobile.auto_kwd_job_apply.placeholder_456'
            )}
            placeholderTextColor={semanticRoles.textMuted}
            multiline
            numberOfLines={2}
            editable={!submitting}
          />
          {errors.availability && (
            <Text style={[styles.errorText, textAlignStart]}>
              {errors.availability}
            </Text>
          )}
        </View>

        {/* Portfolio Images (Optional) */}
        <View style={styles.formSection}>
          <Text style={[styles.label, textAlignStart]}>
            معرض أعمال (اختياري){' '}
            {portfolioImages.length > 0 &&
              `(${portfolioImages.length}/${KWD_MAX_PORTFOLIO_IMAGES})`}
          </Text>
          <Text style={[styles.helperText, textAlignStart]}>
            يمكنك إضافة ما يصل إلى {KWD_MAX_PORTFOLIO_IMAGES} صورة لأعمالك
            السابقة (اختياري تماماً، JPEG/PNG فقط)
          </Text>

          {portfolioImages.length > 0 && (
            <View
              style={[styles.portfolioGrid, { direction: layoutDirection }]}
            >
              {portfolioImages.map((uri, index) => (
                <View key={index} style={styles.portfolioImageContainer}>
                  <Image source={{ uri }} style={styles.portfolioImage} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => removePortfolioImage(index)}
                    disabled={submitting}
                    accessibilityLabel={t(
                      'kwd.app-client.mobile.KwdMyFileScreen.removeImage',
                      { default: 'Remove image' }
                    )}
                    accessibilityRole='button'
                  >
                    <Text style={styles.removeImageText}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {portfolioImages.length < KWD_MAX_PORTFOLIO_IMAGES && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={pickPortfolioImages}
              disabled={submitting || uploadingImages}
              accessibilityLabel={
                uploadingImages
                  ? t('surfaces.جاري_الرفع')
                  : t('surfaces.إضافة_صورة')
              }
              accessibilityRole='button'
            >
              <Text style={styles.addImageText}>
                {uploadingImages
                  ? t('surfaces.جاري_الرفع')
                  : t('surfaces.إضافة_صورة')}
              </Text>
            </TouchableOpacity>
          )}

          {errors.portfolio && (
            <Text style={[styles.errorText, textAlignStart]}>
              {errors.portfolio}
            </Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (submitting || uploadingImages) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={submitting || uploadingImages}
          accessibilityLabel={
            submitting
              ? t('surfaces.جاري_الإرسال')
              : uploadingImages
                ? t('surfaces.جاري_رفع_الصور')
                : t('surfaces.تقديم_الطلب')
          }
          accessibilityRole='button'
        >
          <Text style={styles.submitButtonText}>
            {submitting
              ? t('surfaces.جاري_الإرسال')
              : uploadingImages
                ? t('surfaces.جاري_رفع_الصور')
                : t('surfaces.تقديم_الطلب')}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.note, textAlignStart]}>
          * الحقول المطلوبة{'\n'}
          ملاحظة: معرض الأعمال اختياري تماماً - لا يؤثر على التقديم إذا لم يكن
          موجوداً
        </Text>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  contentContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xl,
  },
  formSection: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  helperText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  inputError: {
    borderColor: semanticRoles.error,
  },
  errorText: {
    fontSize: 14,
    color: semanticRoles.error,
    marginTop: BTHWANI_SPACING.xs,
  },
  hint: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  portfolioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: BTHWANI_SPACING.md,
  },
  portfolioImageContainer: {
    width: 100,
    height: 100,
    margin: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    overflow: 'hidden',
    position: 'relative',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 4,
    end: 4,
    backgroundColor: semanticRoles.error,
    width: 24,
    height: 24,
    borderRadius: BTHWANI_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeImageText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addImageButton: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: semanticRoles.outline,
    borderStyle: 'dashed',
    alignItems: 'center',
  },
  addImageText: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
    marginBottom: BTHWANI_SPACING.lg,
  },
  submitButtonDisabled: {
    backgroundColor: semanticRoles.textMuted,
    opacity: 0.6,
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  note: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    lineHeight: 20,
  },
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  successIcon: {
    fontSize: 64,
    marginBottom: BTHWANI_SPACING.lg,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  successMessage: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
  },
  successButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  successButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTAText,
  },
});

export default auto_kwd_job_apply;

