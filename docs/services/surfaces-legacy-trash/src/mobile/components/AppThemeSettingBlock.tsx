/**
 * AppThemeSettingBlock — Light/Dark theme toggle for app-level settings.
 * Uses Appearance.setColorScheme to override system. Resets on app restart unless persisted.
 */

import React, { useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { useI18n } from '@bthwani/ui-kit';
import { PreferenceCard, PreferenceSwitchRow } from './preferences/PreferencePrimitives';

export interface AppThemeSettingBlockProps {
  compact?: boolean;
}

export const AppThemeSettingBlock: React.FC<AppThemeSettingBlockProps> = () => {
  const { t } = useI18n();
  const [darkMode, setDarkMode] = useState(
    () => Appearance.getColorScheme() === 'dark',
  );

  useEffect(() => {
    const subscription = Appearance.addChangeListener(
      ({ colorScheme }) => setDarkMode(colorScheme === 'dark'),
    );
    return () => subscription.remove();
  }, []);

  const handleToggle = (value: boolean) => {
    setDarkMode(value);
    Appearance.setColorScheme(value ? 'dark' : 'light');
  };

  return (
    <PreferenceCard>
      <PreferenceSwitchRow
        title={t('preferences.app_theme_dark_title')}
        subtitle={t('preferences.app_theme_dark_desc')}
        value={darkMode}
        onValueChange={handleToggle}
      />
    </PreferenceCard>
  );
};
