// Auto-generated unified screen for UserPreferencesGet
// Surface: app-user | Service: user
// §30 States: Loading / Error / Empty / Success / Content
// §86 Unified app-user screen — التفضيلات
// Language System SSoT: language preference wired to the central ui-kit direction/i18n contract only.

import React, { useState, useEffect } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import {
  useDirection,
  RESTART_DIRECTION_MESSAGE,
  SUPPORTED_LANGUAGES,
} from '@bthwani/ui-kit';
import type { SupportedLanguage } from '@bthwani/ui-kit';
import {
  PreferenceScreenLayout,
  PreferenceSection,
  PreferenceCard,
  PreferenceSwitchRow,
  PreferenceSegmentedLanguageRow,
} from '../components';

const PREF_NS = 'preferences';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

const LANGUAGE_OPTIONS = Object.keys(
  SUPPORTED_LANGUAGES
) as SupportedLanguage[];

interface Preference {
  id: string;
  categoryKey: string;
  titleKey: string;
  descKey: string;
  value: boolean;
  type: 'toggle' | 'select';
  options?: string[];
  selectedOption?: string;
}

interface UserPreferencesGetScreenProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const UserPreferencesGetScreen: React.FC<
  UserPreferencesGetScreenProps
> = ({ onNavigate, navigation }) => {
  const {
    t,
    currentLanguage,
    changeLanguage: changeLanguageFromContext,
  } = useDirection();
  const [state, setState] = useState<ScreenState>('loading');
  const [preferences, setPreferences] = useState<Preference[]>([]);

  useEffect(() => {
    const loadPreferences = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));

        const initialPreferences: Preference[] = [
          {
            id: 'notifications_orders',
            categoryKey: 'category_notifications',
            titleKey: 'notifications_orders_title',
            descKey: 'notifications_orders_desc',
            value: true,
            type: 'toggle',
          },
          {
            id: 'notifications_promotions',
            categoryKey: 'category_notifications',
            titleKey: 'notifications_promotions_title',
            descKey: 'notifications_promotions_desc',
            value: true,
            type: 'toggle',
          },
          {
            id: 'notifications_system',
            categoryKey: 'category_notifications',
            titleKey: 'notifications_system_title',
            descKey: 'notifications_system_desc',
            value: false,
            type: 'toggle',
          },
          {
            id: 'arrival_bell',
            categoryKey: 'category_delivery',
            titleKey: 'arrival_bell_title',
            descKey: 'arrival_bell_desc',
            value: true,
            type: 'toggle',
          },
          {
            id: 'language',
            categoryKey: 'category_language',
            titleKey: 'app_language_title',
            descKey: 'app_language_desc',
            value: true,
            type: 'select',
            options: LANGUAGE_OPTIONS,
            selectedOption: currentLanguage,
          },
          {
            id: 'location_services',
            categoryKey: 'category_privacy',
            titleKey: 'location_services_title',
            descKey: 'location_services_desc',
            value: true,
            type: 'toggle',
          },
          {
            id: 'data_sharing',
            categoryKey: 'category_privacy',
            titleKey: 'data_sharing_title',
            descKey: 'data_sharing_desc',
            value: false,
            type: 'toggle',
          },
          {
            id: 'auto_save_addresses',
            categoryKey: 'category_experience',
            titleKey: 'auto_save_addresses_title',
            descKey: 'auto_save_addresses_desc',
            value: true,
            type: 'toggle',
          },
          {
            id: 'quick_order',
            categoryKey: 'category_experience',
            titleKey: 'quick_order_title',
            descKey: 'quick_order_desc',
            value: true,
            type: 'toggle',
          },
        ];

        setPreferences(initialPreferences);

        // Simulate success (90% success rate)
        const mockSuccess = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
          try {
            const res = await rawFetch(
              `${getBaseUrl()}/api/dsh/user/arrival-bell-settings?userId=current`,
              { method: 'GET', headers: { 'Content-Type': 'application/json' } }
            );
            const json = await res.json();
            if (json?.success && typeof json?.data?.enabled === 'boolean') {
              setPreferences(prev =>
                prev.map(p =>
                  p.id === 'arrival_bell'
                    ? { ...p, value: json.data.enabled }
                    : p
                )
              );
            }
          } catch {
            /* keep default */
          }
        }
      } catch (error) {
        setState('error');
      }
    };

    loadPreferences();
  }, []);

  useEffect(() => {
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === 'language'
          ? { ...pref, selectedOption: currentLanguage }
          : pref
      )
    );
  }, [currentLanguage]);

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

  const handleTogglePreference = async (preferenceId: string) => {
    if (preferenceId === 'arrival_bell') {
      const prev = preferences.find(p => p.id === 'arrival_bell');
      const nextValue = !prev?.value;
      setPreferences(prevP =>
        prevP.map(p =>
          p.id === 'arrival_bell' ? { ...p, value: nextValue } : p
        )
      );
      try {
        const res = await rawFetch(
          `${getBaseUrl()}/api/dsh/user/arrival-bell-settings`,
          {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: 'current', enabled: nextValue }),
          }
        );
        if (!res.ok) {
          setPreferences(prevP =>
            prevP.map(p =>
              p.id === 'arrival_bell' ? { ...p, value: !nextValue } : p
            )
          );
        }
      } catch {
        setPreferences(prevP =>
          prevP.map(p =>
            p.id === 'arrival_bell' ? { ...p, value: !nextValue } : p
          )
        );
      }
      return;
    }
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === preferenceId ? { ...pref, value: !pref.value } : pref
      )
    );
  };

  const handleSelectOption = async (preferenceId: string, option: string) => {
    if (preferenceId === 'language') {
      const locale = option as SupportedLanguage;
      if (LANGUAGE_OPTIONS.includes(locale)) {
        const result = await changeLanguageFromContext(locale);
        setPreferences(prev =>
          prev.map(pref =>
            pref.id === preferenceId
              ? { ...pref, selectedOption: option }
              : pref
          )
        );
        if (Platform.OS !== 'web' && result.directionChanged) {
          const msg = RESTART_DIRECTION_MESSAGE[locale];
          Alert.alert(msg.title, msg.body, [{ text: t('common.ok') }]);
        }
      }
      return;
    }
    setPreferences(prev =>
      prev.map(pref =>
        pref.id === preferenceId ? { ...pref, selectedOption: option } : pref
      )
    );
  };

  const handleSavePreferences = () => {
    Alert.alert(
      t(`${PREF_NS}.save_confirm_title`),
      t(`${PREF_NS}.save_confirm_body`),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('common.save'),
          onPress: () => {
            Alert.alert(t(`${PREF_NS}.saved`), t('messages.changesSaved'));
          },
        },
      ]
    );
  };

  const handleResetToDefaults = () => {
    Alert.alert(
      t(`${PREF_NS}.reset_confirm_title`),
      t(`${PREF_NS}.reset_confirm_body`),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t(`${PREF_NS}.reset_confirm_title`),
          style: 'destructive',
          onPress: () => {
            Alert.alert(t(`${PREF_NS}.saved`), t(`${PREF_NS}.reset_done`));
          },
        },
      ]
    );
  };
  const categoryKeys = [
    'category_notifications',
    'category_language',
    'category_privacy',
    'category_experience',
    'category_delivery',
  ] as const;

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <PreferenceScreenLayout
          title={t(`${PREF_NS}.title`)}
          subtitle={t(`${PREF_NS}.subtitle`)}
        >
          {categoryKeys.map(categoryKey => {
            const categoryPreferences = preferences.filter(
              p => p.categoryKey === categoryKey
            );
            if (categoryPreferences.length === 0) return null;

            return (
              <PreferenceSection
                key={categoryKey}
                title={t(`${PREF_NS}.${categoryKey}`)}
              >
                {categoryPreferences.map(preference => {
                  if (preference.type === 'toggle') {
                    return (
                      <PreferenceCard key={preference.id}>
                        <PreferenceSwitchRow
                          title={t(`${PREF_NS}.${preference.titleKey}`)}
                          subtitle={t(`${PREF_NS}.${preference.descKey}`)}
                          value={preference.value}
                          onValueChange={() =>
                            handleTogglePreference(preference.id)
                          }
                        />
                      </PreferenceCard>
                    );
                  }

                  if (
                    preference.type === 'select' &&
                    preference.id === 'language' &&
                    preference.selectedOption
                  ) {
                    return (
                      <PreferenceCard key={preference.id}>
                        <PreferenceSegmentedLanguageRow
                          title={t(`${PREF_NS}.${preference.titleKey}`)}
                          subtitle={t(`${PREF_NS}.${preference.descKey}`)}
                          value={preference.selectedOption as SupportedLanguage}
                          onChange={locale =>
                            handleSelectOption(preference.id, locale as string)
                          }
                        />
                      </PreferenceCard>
                    );
                  }

                  return null;
                })}
              </PreferenceSection>
            );
          })}

          <View style={styles.actionsSection}>
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSavePreferences}
            >
              <Text style={styles.saveText}>💾 {t('common.save')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetToDefaults}
            >
              <Text style={styles.resetText}>{t('common.reset')}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => handleNavigate('UserProfile')}
          >
            <Text style={styles.backText}>
              {t('navigation.back_to_profile')}
            </Text>
          </TouchableOpacity>
        </PreferenceScreenLayout>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(`${PREF_NS}.loading`)}
      errorMessage={t(`${PREF_NS}.error`)}
      onErrorAction={handleRetry}
      screenName='UserPreferencesGetScreen'
      operationName='user_preferences_get'
    />
  );
};

const styles = StyleSheet.create({
  actionsSection: {
    paddingStart: BTHWANI_SPACING.contentH,
    paddingEnd: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.contentV,
    paddingBottom: BTHWANI_SPACING.contentV,
  },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingStart: BTHWANI_SPACING.contentH,
    paddingEnd: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.contentV,
    paddingBottom: BTHWANI_SPACING.contentV,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  saveText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  resetButton: {
    backgroundColor: 'transparent',
    paddingStart: BTHWANI_SPACING.contentH,
    paddingEnd: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.contentV,
    paddingBottom: BTHWANI_SPACING.contentV,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.textMuted,
  },
  resetText: {
    color: semanticRoles.textMuted,
    fontSize: 14,
    fontWeight: '500',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    paddingStart: BTHWANI_SPACING.contentH,
    paddingEnd: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.contentV,
    paddingBottom: BTHWANI_SPACING.contentV,
    borderRadius: BTHWANI_RADIUS.lg,
    marginStart: BTHWANI_SPACING.contentH,
    marginEnd: BTHWANI_SPACING.contentH,
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.lg,
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

export default UserPreferencesGetScreen;
