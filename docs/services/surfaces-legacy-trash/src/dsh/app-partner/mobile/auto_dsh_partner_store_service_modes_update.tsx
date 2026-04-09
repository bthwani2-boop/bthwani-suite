/**
 * DSH Partner Store Service Modes Update — dsh_partner_store_service_modes_update
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/store/service-modes (via @bthwani/api-clients)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ScreenWrapper, ScreenState, semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { getDshPartnerStoreProfile, updateDshPartnerStoreServiceModes } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import type { PartnerStoreServiceMode } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

type ServiceModeState = {
  mode: PartnerStoreServiceMode;
  isEnabled: boolean;
};

const MODE_ORDER: PartnerStoreServiceMode[] = ['delivery', 'pickup', 'dine_in'];

const MODE_LABEL_KEYS: Record<PartnerStoreServiceMode, string> = {
  delivery: 'delivery',
  pickup: 'pickup',
  dine_in: 'dine_in',
};

function normalizeServiceModes(raw: any): ServiceModeState[] | null {
  const modesRaw = raw?.serviceModes ?? raw?.service_modes ?? raw?.serviceModeList;
  if (!Array.isArray(modesRaw)) return null;

  const byMode: Partial<Record<PartnerStoreServiceMode, boolean>> = {};
  for (const item of modesRaw) {
    const mode = item?.mode as PartnerStoreServiceMode;
    if (!MODE_ORDER.includes(mode)) continue;
    if (typeof item?.isEnabled === 'boolean') {
      byMode[mode] = item.isEnabled;
    }
  }

  const defaults: Record<PartnerStoreServiceMode, boolean> = {
    delivery: true,
    pickup: true,
    dine_in: false,
  };

  return MODE_ORDER.map((m) => ({
    mode: m,
    isEnabled: typeof byMode[m] === 'boolean' ? byMode[m] : defaults[m],
  }));
}

export const AutoDshPartnerStoreServiceModesUpdate: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useI18n();

  const [serviceModes, setServiceModes] = useState<ServiceModeState[]>(() =>
    MODE_ORDER.map((mode) => ({
      mode,
      isEnabled: mode === 'dine_in' ? false : true,
    }))
  );
  const [state, setState] = useState<ScreenState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const profile = await getDshPartnerStoreProfile();
      const normalized = profile ? normalizeServiceModes(profile as any) : null;
      if (normalized) setServiceModes(normalized);
      setState('content');
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleToggle = useCallback((mode: PartnerStoreServiceMode, next: boolean) => {
    setServiceModes((prev) => prev.map((m) => (m.mode === mode ? { ...m, isEnabled: next } : m)));
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    const enabledCount = serviceModes.filter((m) => m.isEnabled).length;
    if (enabledCount === 0) {
      setError(
        t(
          'dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.validationAtLeastOne'
        )
      );
      setState('error');
      return;
    }
    setIsSaving(true);
    setError(null);
    try {
      const ok = await updateDshPartnerStoreServiceModes(
        serviceModes.map((m) => ({
          mode: m.mode,
          isEnabled: m.isEnabled,
        }))
      );
      if (!ok) throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.errorUpdate'));
      setState('success');
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.errorMessage');
      setError(msg);
      setState('error');
    } finally {
      setIsSaving(false);
    }
  }, [isSaving, serviceModes, t]);

  const screenErrorMessage =
    error || t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.errorMessage');

  const screenSuccessMessage = t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.successMessage');

  const screenLoadingMessage = t(
    'dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.loadingMessage'
  );

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={screenLoadingMessage}
      errorMessage={screenErrorMessage}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.errorActionText')}
      onErrorAction={load}
      successMessage={screenSuccessMessage}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.successActionText')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_store_get')}
      screenName="auto_dsh_partner_store_service_modes_update"
      operationName="dsh_partner_store_service_modes_update"
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>{t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.sectionTitle')}</Text>
        <Text style={styles.helperText}>
          {t(
            'dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.helperText'
          )}
        </Text>

        {MODE_ORDER.map((mode) => {
          const isEnabled = serviceModes.find((m) => m.mode === mode)?.isEnabled ?? false;
          return (
            <View key={mode} style={styles.modeRow}>
              <View style={styles.modeLabelWrap}>
                <Text style={styles.modeLabel}>
                  {t(
                    `dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.mode.${MODE_LABEL_KEYS[mode]}`
                  )}
                </Text>
              </View>
              <View style={styles.modeSwitchWrap}>
                <Switch
                  value={isEnabled}
                  onValueChange={(next) => handleToggle(mode, next)}
                  trackColor={{ false: semanticRoles.border, true: BTHWANI_COLORS.primary }}
                  thumbColor={isEnabled ? BTHWANI_COLORS.primaryCTAText : semanticRoles.textMuted}
                />
              </View>
            </View>
          );
        })}

        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_store_service_modes_update.saveButtonText')}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.lg,
  },
  helperText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  modeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    marginBottom: BTHWANI_SPACING.md,
  },
  modeLabelWrap: {
    flex: 1,
    paddingEnd: BTHWANI_SPACING.md,
  },
  modeLabel: {
    fontSize: 16,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  modeSwitchWrap: {
    flexShrink: 0,
  },
  saveButton: {
    marginTop: BTHWANI_SPACING.xl,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AutoDshPartnerStoreServiceModesUpdate;

