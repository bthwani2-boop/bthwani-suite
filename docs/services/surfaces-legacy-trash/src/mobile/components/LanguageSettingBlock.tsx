/**
 * LanguageSettingBlock — Shared block for app language selection (SSoT). Consumes central i18n only; direction from useI18n().isRTL.
 * Use in Captain settings, Partner profile, Field settings. Arabic ⇒ RTL, English ⇒ LTR. Restart hint on RN.
 */

import React from 'react';
import {
  Alert,
  Platform,
  View,
  StyleSheet,
} from 'react-native';
import {
  useI18n,
  SUPPORTED_LANGUAGES,
  RESTART_DIRECTION_MESSAGE,
} from '@bthwani/ui-kit';
import type { SupportedLanguage } from '@bthwani/ui-kit';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';
import {
  PreferenceCard,
  PreferenceSegmentedLanguageRow,
} from './preferences/PreferencePrimitives';

const SUPPORTED_LOCALES = Object.keys(SUPPORTED_LANGUAGES) as SupportedLanguage[];

export interface LanguageSettingBlockProps {
  /** Compact: single row, no card wrapper — for profile screens */
  compact?: boolean;
}

export const LanguageSettingBlock: React.FC<LanguageSettingBlockProps> = ({ compact }) => {
  const { t, currentLanguage, changeLanguage } = useI18n();

  const handleSelect = async (locale: SupportedLanguage) => {
    const result = await changeLanguage(locale);
    if (Platform.OS !== 'web' && result.directionChanged) {
      const msg = RESTART_DIRECTION_MESSAGE[locale];
      Alert.alert(msg.title, msg.body, [{ text: t('common.ok') }]);
    }
  };

  const content = (
    <PreferenceSegmentedLanguageRow
      title={t('preferences.app_language_title')}
      subtitle={compact ? undefined : t('preferences.app_language_desc')}
      value={currentLanguage}
      onChange={handleSelect}
    />
  );

  if (compact) {
    return (
      <View style={styles.compactWrap}>
        {content}
      </View>
    );
  }

  return <PreferenceCard>{content}</PreferenceCard>;
};

const styles = StyleSheet.create({
  compactWrap: {
    marginBottom: BTHWANI_SPACING.md,
  },
});
