import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { ScreenHeader } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
// @ts-ignore - expo-image-picker is available at runtime in mobile app
import * as ImagePicker from 'expo-image-picker';
import { useKwdMyFile } from './hooks/useKwdMyFile';
import { KWD_MAX_PORTFOLIO_IMAGES } from './types';

interface KwdMyFileScreenProps {
  navigation?: { goBack?: () => void };
}

export const KwdMyFileScreen: React.FC<KwdMyFileScreenProps> = ({
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const layoutDirection = useMemo(
    () => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr',
    [isRTL]
  );
  const { myFile, isLoading, isSaving, updateMyFile } = useKwdMyFile();

  const [fullName, setFullName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [primarySkill, setPrimarySkill] = useState('');
  const [availability, setAvailability] = useState('');
  const [preferredLocation, setPreferredLocation] = useState('');
  const [portfolioImageUris, setPortfolioImageUris] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    setFullName(myFile.fullName || '');
    setContactPhone(myFile.contactPhone || '');
    setPrimarySkill(myFile.primarySkill || '');
    setAvailability(myFile.availability || '');
    setPreferredLocation(myFile.preferredLocation || '');
    setPortfolioImageUris(myFile.portfolioImageUris || []);
  }, [isLoading, myFile]);

  const handlePickImages = useCallback(async () => {
    try {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          t(
            'kwd.app-client.mobile.KwdMyFileScreen.photosPermissionRequiredForGallery'
          ),
          t(
            'kwd.app-client.mobile.KwdMyFileScreen.photosPermissionRequiredForGallery'
          )
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: true,
        quality: 0.8,
      });

      if (!result.canceled && result.assets) {
        const newImages = result.assets.map((asset: any) => asset.uri);
        const totalImages = portfolioImageUris.length + newImages.length;

        if (totalImages > KWD_MAX_PORTFOLIO_IMAGES) {
          Alert.alert(
            t('kwd.app-client.mobile.KwdMyFileScreen.maxLabel'),
            `يمكن إضافة ${KWD_MAX_PORTFOLIO_IMAGES} صور كحد أقصى`
          );
          return;
        }

        setPortfolioImageUris([...portfolioImageUris, ...newImages]);
      }
    } catch {
      Alert.alert(
        t('kwd.app-client.mobile.KwdMyFileScreen.errorMessage'),
        t('kwd.app-client.mobile.KwdMyFileScreen.errorMessage')
      );
    }
  }, [portfolioImageUris]);

  const handleRemoveImage = useCallback(
    (index: number) => {
      setPortfolioImageUris(portfolioImageUris.filter((_, i) => i !== index));
    },
    [portfolioImageUris]
  );

  const handleSave = useCallback(async () => {
    const next = {
      fullName: fullName.trim(),
      contactPhone: contactPhone.trim() || undefined,
      primarySkill: primarySkill.trim() || undefined,
      availability: availability.trim() || undefined,
      preferredLocation: preferredLocation.trim() || undefined,
      portfolioImageUris,
    };

    try {
      setUploadingImages(true);
      await updateMyFile(next);
      Alert.alert(
        t('kwd.app-client.mobile.KwdMyFileScreen.savedSuccess'),
        t('kwd.app-client.mobile.KwdMyFileScreen.savedSuccess')
      );
    } catch {
      Alert.alert(
        t('kwd.app-client.mobile.KwdMyFileScreen.errorSaveMessage'),
        t('kwd.app-client.mobile.KwdMyFileScreen.errorSaveMessage')
      );
    } finally {
      setUploadingImages(false);
    }
  }, [
    fullName,
    contactPhone,
    primarySkill,
    availability,
    preferredLocation,
    portfolioImageUris,
    updateMyFile,
  ]);

  return (
    <ScreenWrapper
      state={isLoading ? 'loading' : 'content'}
      screenName='KwdMyFileScreen'
      operationName='kwd_my_file_get'
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <ScreenHeader
          title={t('kwd.app-client.mobile.KwdMyFileScreen.k119')}
          subtitle={t('kwd.app-client.mobile.KwdMyFileScreen.k121')}
        />

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>
            {t('kwd.app-client.mobile.KwdMyFileScreen.l126')}
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              {t('kwd.app-client.mobile.KwdMyFileScreen.l129')}
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('kwd.app-client.mobile.KwdMyFileScreen.placeholder')}
              placeholderTextColor={semanticRoles.textMuted}
              value={fullName}
              onChangeText={setFullName}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              {t('kwd.app-client.mobile.KwdMyFileScreen.l141')}
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t('kwd.app-client.mobile.KwdMyFileScreen.l144')}
              placeholderTextColor={semanticRoles.textMuted}
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType='phone-pad'
              maxLength={20}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              {t('kwd.app-client.mobile.KwdMyFileScreen.l154')}
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t(
                'kwd.app-client.mobile.KwdMyFileScreen.placeholder_157'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={primarySkill}
              onChangeText={setPrimarySkill}
              maxLength={100}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              {t('kwd.app-client.mobile.KwdMyFileScreen.l166')}
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t(
                'kwd.app-client.mobile.KwdMyFileScreen.placeholder_169'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={availability}
              onChangeText={setAvailability}
              maxLength={200}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.inputLabel, textAlignStart]}>
              {t('kwd.app-client.mobile.KwdMyFileScreen.l178')}
            </Text>
            <TextInput
              style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={t(
                'kwd.app-client.mobile.KwdMyFileScreen.placeholder_181'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={preferredLocation}
              onChangeText={setPreferredLocation}
              maxLength={200}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, textAlignStart]}>
            {portfolioImageUris.length > 0
              ? t('kwd.app-client.mobile.KwdMyFileScreen.l192', {
                  current: portfolioImageUris.length,
                  max: KWD_MAX_PORTFOLIO_IMAGES,
                })
              : t('kwd.app-client.mobile.KwdMyFileScreen.l192_noCounter')}
          </Text>
          <Text style={[styles.helperText, textAlignStart]}>
            {t('kwd.app-client.mobile.KwdMyFileScreen.l195', {
              max: KWD_MAX_PORTFOLIO_IMAGES,
            })}
          </Text>

          {portfolioImageUris.length > 0 && (
            <View
              style={[styles.imagesContainer, { direction: layoutDirection }]}
            >
              {portfolioImageUris.map((uri, index) => (
                <View key={index} style={styles.imageWrapper}>
                  <Image source={{ uri }} style={styles.image} />
                  <TouchableOpacity
                    style={styles.removeImageButton}
                    onPress={() => handleRemoveImage(index)}
                    accessibilityLabel={t(
                      'kwd.app-client.mobile.KwdMyFileScreen.removeImage',
                      { default: 'Remove image' }
                    )}
                    accessibilityRole='button'
                  >
                    <Text style={styles.removeImageText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {portfolioImageUris.length < KWD_MAX_PORTFOLIO_IMAGES && (
            <TouchableOpacity
              style={styles.addImageButton}
              onPress={handlePickImages}
              disabled={uploadingImages || isSaving}
              accessibilityLabel={
                uploadingImages
                  ? t('surfaces.جاري_اختيار_الصور')
                  : t('surfaces.إضافة_صور')
              }
              accessibilityRole='button'
            >
              <Text style={styles.addImageText}>
                {uploadingImages
                  ? t('surfaces.جاري_اختيار_الصور')
                  : t('surfaces.إضافة_صور')}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.saveButton,
            (isSaving || uploadingImages) && styles.saveButtonDisabled,
          ]}
          onPress={handleSave}
          disabled={isSaving || uploadingImages}
          accessibilityLabel={
            isSaving
              ? t('kwd.app-client.mobile.KwdMyFileScreen.l233')
              : t('surfaces.حفظ_البيانات')
          }
          accessibilityRole='button'
        >
          <Text style={styles.saveButtonText}>
            {isSaving
              ? t('kwd.app-client.mobile.KwdMyFileScreen.l233')
              : t('surfaces.حفظ_البيانات')}
          </Text>
        </TouchableOpacity>
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
    paddingBottom: BTHWANI_SPACING.xxl,
  },
  header: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    lineHeight: 18,
  },
  section: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  helperText: {
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
  image: {
    width: '100%',
    height: '100%',
    borderRadius: BTHWANI_RADIUS.md,
  },
  removeImageButton: {
    position: 'absolute',
    top: -6,
    end: -6,
    width: 22,
    height: 22,
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
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.xl,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.7,
  },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});

export default KwdMyFileScreen;

