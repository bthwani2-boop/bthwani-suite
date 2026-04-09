// Auto-generated screen for platform_captain_settings
// Surface: app-captain | Service: platform
// Operation: GET/PUT /api/captain/settings
// Description: Unified settings screen - works across DSH, AMN (no KNZ per policy)

import React, { useState, useCallback } from 'react';
import {
  Alert,
} from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { LanguageSettingBlock } from '../../../mobile/components/LanguageSettingBlock';
import {
  PreferenceScreenLayout,
  PreferenceSection,
  PreferenceCard,
  PreferenceSwitchRow,
} from '../../../mobile/components';

interface AutoPlatformCaptainSettingsProps {
  navigation?: any;
}

export const AutoPlatformCaptainSettings: React.FC<
  AutoPlatformCaptainSettingsProps
> = ({ navigation }) => {
  const { t } = useI18n();
  const [settings, setSettings] = useState<Record<string, boolean>>({
    notifications: true,
    location_tracking: true,
    auto_accept: false,
    night_mode: false,
    sound_effects: true,
  });

  const handleSettingToggle = useCallback((settingId: string) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: !prev[settingId],
    }));
  }, []);

  const handleSettingAction = useCallback(
    (settingId: string) => {
      switch (settingId) {
        case 'change_password':
          Alert.alert(
            t('platform.app-captain.mobile.auto_platform_captain_settings.changePasswordTitle'),
            t('platform.app-captain.mobile.auto_platform_captain_settings.changePasswordMessage')
          );
          break;
        case 'privacy_policy':
          Alert.alert(
            t('platform.app-captain.mobile.auto_platform_captain_settings.privacyPolicyTitle'),
            t('platform.app-captain.mobile.auto_platform_captain_settings.privacyPolicyDescription')
          );
          break;
        case 'support':
          navigation?.navigate('platform_captain_incident_create');
          break;
        case 'logout':
          Alert.alert(
            t('platform.app-captain.mobile.auto_platform_captain_settings.logoutTitle'),
            t('platform.app-captain.mobile.auto_platform_captain_settings.logoutMessage'),
            [
              { text: t('common.cancel'), style: 'cancel' },
              {
                text: t('common.logout'),
                style: 'destructive',
                onPress: () => {
                  Alert.alert(
                    t('common.goodbye'),
                    t('platform.app-captain.mobile.auto_platform_captain_settings.logoutThankYou')
                  );
                },
              },
            ]
          );
          break;
      }
    },
    [navigation, t]
  );

  return (
    <ScreenWrapper state="content">
      <PreferenceScreenLayout
        title={t('platform.app-captain.mobile.auto_platform_captain_settings.title')}
        subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.subtitle')}
      >
        <PreferenceSection title={t('platform.app-captain.mobile.auto_platform_captain_settings.sectionNotifications')}>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingNotifications')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingNotificationsDescription')}
              value={settings.notifications}
              onValueChange={() => handleSettingToggle('notifications')}
            />
          </PreferenceCard>
        </PreferenceSection>

        <PreferenceSection title={t('platform.app-captain.mobile.auto_platform_captain_settings.sectionBehavior')}>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingLocationTracking')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingLocationTrackingDescription')}
              value={settings.location_tracking}
              onValueChange={() => handleSettingToggle('location_tracking')}
            />
          </PreferenceCard>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingAutoAccept')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingAutoAcceptDescription')}
              value={settings.auto_accept}
              onValueChange={() => handleSettingToggle('auto_accept')}
            />
          </PreferenceCard>
        </PreferenceSection>

        <PreferenceSection title={t('platform.app-captain.mobile.auto_platform_captain_settings.sectionAppearance')}>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingDarkMode')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingDarkModeDescription')}
              value={settings.night_mode}
              onValueChange={() => handleSettingToggle('night_mode')}
            />
          </PreferenceCard>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingSounds')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingSoundsDescription')}
              value={settings.sound_effects}
              onValueChange={() => handleSettingToggle('sound_effects')}
            />
          </PreferenceCard>
        </PreferenceSection>

        <PreferenceSection title={t('platform.app-captain.mobile.auto_platform_captain_settings.sectionLanguage')}>
          <LanguageSettingBlock />
        </PreferenceSection>

        <PreferenceSection title={t('platform.app-captain.mobile.auto_platform_captain_settings.sectionAccount')}>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingChangePassword')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingChangePasswordDescription')}
              value={false}
              onValueChange={() => handleSettingAction('change_password')}
              disabled
            />
          </PreferenceCard>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingPrivacy')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingPrivacyDescription')}
              value={false}
              onValueChange={() => handleSettingAction('privacy_policy')}
              disabled
            />
          </PreferenceCard>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingSupport')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingSupportDescription')}
              value={false}
              onValueChange={() => handleSettingAction('support')}
              disabled
            />
          </PreferenceCard>
          <PreferenceCard>
            <PreferenceSwitchRow
              title={t('platform.app-captain.mobile.auto_platform_captain_settings.settingLogout')}
              subtitle={t('platform.app-captain.mobile.auto_platform_captain_settings.settingLogoutDescription')}
              value={false}
              onValueChange={() => handleSettingAction('logout')}
              disabled
            />
          </PreferenceCard>
        </PreferenceSection>
      </PreferenceScreenLayout>
    </ScreenWrapper>
  );
};

export default AutoPlatformCaptainSettings;
