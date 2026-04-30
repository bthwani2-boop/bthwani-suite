/**
 * FieldSettingsScreen — Settings Screen for Field Operations
 * §87 SSoT in packages/surfaces
 * §UX-SUPREME-001: Unified Design - Same Tokens, Layout for all types
 * Language System SSoT: language selection via LanguageSettingBlock.
 * WAVE 11 (Phase 8): Central contract only; all UI text via t('field.FieldSettingsScreen.*').
 */
import React from 'react';
import { useI18n } from '@bthwani/ui-kit';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { LanguageSettingBlock } from '../mobile/components';
import {
  PreferenceScreenLayout,
  PreferenceSection,
} from '../mobile/components';

export const FieldSettingsScreen: React.FC = () => {
  const { t } = useI18n();
  return (
    <ScreenWrapper state='content'>
      <PreferenceScreenLayout
        title={t('field.FieldSettingsScreen.title')}
        subtitle={t('field.FieldSettingsScreen.subtitle')}
      >
        <PreferenceSection
          title={t('field.FieldSettingsScreen.languageRegion')}
        >
          <LanguageSettingBlock />
        </PreferenceSection>
      </PreferenceScreenLayout>
    </ScreenWrapper>
  );
};
