// Auto-generated unified screen for UserProfileUpdate
// Surface: app-user | Service: user
// §30 States: Loading / Error / Empty / Success / Content
// §86 Unified app-user screen — تعديل الملف الشخصي

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  ScreenState,
  ScreenWrapper,
  colorTokens,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';

import { buildProfileDataMock } from '../fixtures/profileUpdate';
import type { ProfileData } from '../fixtures/profileUpdate';

interface UserProfileUpdateScreenProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const UserProfileUpdateScreen: React.FC<
  UserProfileUpdateScreenProps
> = ({ onNavigate, navigation }) => {
  const { t, textAlignStartStyle } = useDirection();
  const NS = 'mobile.app-user.UserProfileUpdateScreen';
  const [state, setState] = useState<ScreenState>('loading');
  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dateOfBirth: '',
    gender: '',
  });
  const [isEditing, setIsEditing] = useState(false);

  const profileDataMock = useMemo(() => buildProfileDataMock(t), [t]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        // Backend integration call
        await new Promise(resolve => setTimeout(resolve, 1500));

        setProfileData(profileDataMock);

        // Simulate success (90% success rate)
        const mockSuccess = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadProfile();
  }, [profileDataMock]);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenderSelect = (gender: 'male' | 'female' | 'other') => {
    setProfileData(prev => ({
      ...prev,
      gender,
    }));
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone } = profileData;

    if (!firstName.trim()) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.pleaseEnterFirstName`));
      return false;
    }

    if (!lastName.trim()) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.pleaseEnterLastName`));
      return false;
    }

    if (!email.trim() || !email.includes('@')) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.enterValidEmail`));
      return false;
    }

    if (!phone.trim() || phone.length < 10) {
      Alert.alert(t(`${NS}.error`), t(`${NS}.enterValidPhone`));
      return false;
    }

    return true;
  };

  const handleSaveProfile = () => {
    if (!validateForm()) return;

    Alert.alert(t(`${NS}.saveChangesTitle`), t(`${NS}.saveChangesMessage`), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.save'),
        onPress: () => {
          // Simulate saving
          setIsEditing(false);
          Alert.alert(t(`${NS}.done`), t(`${NS}.saveSuccess`));
        },
      },
    ]);
  };

  const handleCancelEdit = () => {
    // Reset to original data (in real app, you'd load from API again)
    setIsEditing(false);
    Alert.alert(t(`${NS}.done`), t(`${NS}.cancelSuccess`));
  };

  const genderOptions = useMemo(
    () => [
      { key: 'male', label: t(`${NS}.male`), icon: '👨' },
      { key: 'female', label: t(`${NS}.female`), icon: '👩' },
      { key: 'other', label: t(`${NS}.other`), icon: '🧑' },
    ],
    [t]
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t(`${NS}.editProfileTitle`)}</Text>
            <Text style={styles.subtitle}>
              {t(`${NS}.editProfileSubtitle`)}
            </Text>
          </View>

          <View style={styles.profileImageSection}>
            <View style={styles.profileImage}>
              <Text style={styles.profileInitials}>
                {profileData.firstName.charAt(0)}
                {profileData.lastName.charAt(0)}
              </Text>
            </View>
            <TouchableOpacity style={styles.changePhotoButton}>
              <Text style={styles.changePhotoText}>
                {t(`${NS}.changePhoto`)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.formSection}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t(`${NS}.firstNameLabel`)}
              </Text>
              <TextInput
                style={[styles.textInput, textAlignStartStyle]}
                value={profileData.firstName}
                onChangeText={value => handleInputChange('firstName', value)}
                editable={isEditing}
                placeholder={t(`${NS}.enterFirstName`)}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t(`${NS}.lastNameLabel`)}
              </Text>
              <TextInput
                style={[styles.textInput, textAlignStartStyle]}
                value={profileData.lastName}
                onChangeText={value => handleInputChange('lastName', value)}
                editable={isEditing}
                placeholder={t(`${NS}.enterLastName`)}
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t(`${NS}.emailLabel`)}
              </Text>
              <TextInput
                style={[styles.textInput, textAlignStartStyle]}
                value={profileData.email}
                onChangeText={value => handleInputChange('email', value)}
                editable={isEditing}
                placeholder={t(`${NS}.enterValidEmail`)}
                placeholderTextColor={semanticRoles.textMuted}
                keyboardType='email-address'
                autoCapitalize='none'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t(`${NS}.phoneLabel`)}
              </Text>
              <TextInput
                style={[styles.textInput, textAlignStartStyle]}
                value={profileData.phone}
                onChangeText={value => handleInputChange('phone', value)}
                editable={isEditing}
                placeholder={t(`${NS}.phonePlaceholder`)}
                placeholderTextColor={semanticRoles.textMuted}
                keyboardType='phone-pad'
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                تاريخ الميلاد
              </Text>
              <TextInput
                style={[styles.textInput, textAlignStartStyle]}
                value={profileData.dateOfBirth}
                onChangeText={value => handleInputChange('dateOfBirth', value)}
                editable={isEditing}
                placeholder='YYYY-MM-DD'
                placeholderTextColor={semanticRoles.textMuted}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, textAlignStartStyle]}>
                {t(`${NS}.genderLabel`)}
              </Text>
              <View style={styles.genderOptions}>
                {genderOptions.map(option => {
                  if (!option || !option.icon) return null;
                  return (
                    <TouchableOpacity
                      key={option.key}
                      style={[
                        styles.genderButton,
                        profileData.gender === option.key &&
                          styles.selectedGenderButton,
                      ]}
                      onPress={() =>
                        isEditing && handleGenderSelect(option.key as any)
                      }
                      disabled={!isEditing}
                    >
                      <Text style={styles.genderIcon}>
                        {option.icon || '👤'}
                      </Text>
                      <Text
                        style={[
                          styles.genderText,
                          profileData.gender === option.key &&
                            styles.selectedGenderText,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          <View style={styles.actionsSection}>
            {!isEditing ? (
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => setIsEditing(true)}
              >
                <Text style={styles.editText}>✏️ {t(`${NS}.editInfo`)}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.saveButton}
                  onPress={handleSaveProfile}
                >
                  <Text style={styles.saveText}>💾 حفظ التغييرات</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelButton}
                  onPress={handleCancelEdit}
                >
                  <Text style={styles.cancelText}>❌ {t(`${NS}.cancel`)}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('UserProfile')}
          >
            <Text style={styles.backText}>{t(`${NS}.backToProfile`)}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(`${NS}.loadingMessage`)}
      errorMessage={t(`${NS}.errorMessage`)}
      onErrorAction={handleRetry}
      screenName='UserProfileUpdateScreen'
      operationName='profile_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  profileImageSection: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: 'semanticRoles.shadow',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
  changePhotoButton: {
    padding: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  changePhotoText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  formSection: {
    padding: BTHWANI_SPACING.contentH,
  },
  inputGroup: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  textInput: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  genderOptions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  genderButton: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  selectedGenderButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  genderIcon: {
    fontSize: 24,
    marginBottom: BTHWANI_SPACING.xs,
  },
  genderText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  selectedGenderText: {
    color: semanticRoles.primaryCTAText,
  },
  actionsSection: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  editButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  editText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colorTokens.success['600'],
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  saveText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: colorTokens.error['500'],
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  cancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  backText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserProfileUpdateScreen;
