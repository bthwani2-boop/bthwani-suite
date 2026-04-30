/**
 * DSH Customer Preferences — dsh_customer_preferences_get. Shared for app-partner.
 * Uses getPreferences() + onBack.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import type { DshCustomerPreferencesItem, DshCustomerPreferencesDetailProps } from './types';
import { colorTokens, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export type { DshCustomerPreferencesItem, DshCustomerPreferencesDetailProps } from './types';

type State = 'loading' | 'normal' | 'error';

export function DshCustomerPreferencesDetail({
  getPreferences,
  onBack,
}: DshCustomerPreferencesDetailProps) {
  const { t } = useI18n();
  const [state, setState] = useState<State>('loading');
  const [preferences, setPreferences] = useState<DshCustomerPreferencesItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const load = useCallback(async () => {
    setState('loading');
    setErrorMessage('');
    try {
      const data = await getPreferences();
      setPreferences(data ?? null);
      setState(data ? 'normal' : 'error');
      if (!data) setErrorMessage(t('dsh.DshCustomerPreferencesDetail.noPreferenceFound'));
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCustomerPreferencesDetail.errorMessage'));
      setState('error');
    }
  }, [getPreferences, t]);

  useEffect(() => {
    load();
  }, [load]);

  if (state === 'loading') {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>{t('dsh.DshCustomerPreferencesDetail.loading')}</Text>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{errorMessage}</Text>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>{t('common.back')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const prefs = preferences ?? {};
  const knownKeys = ['notifications', 'language'];
  const restKeys = Object.keys(prefs).filter(k => !knownKeys.includes(k));

  return (
    <ScrollView style={styles.scroll}>
      <View style={styles.section}>
        <Text style={styles.label}>{t('dsh.DshCustomerPreferencesDetail.notifications')}</Text>
        <Text style={styles.value}>{prefs.notifications === true ? t('dsh.DshCustomerPreferencesDetail.enabled') : prefs.notifications === false ? t('dsh.DshCustomerPreferencesDetail.disabled') : '—'}</Text>
      </View>
      <View style={styles.section}>
        <Text style={styles.label}>{t('dsh.DshCustomerPreferencesDetail.language')}</Text>
        <Text style={styles.value}>{prefs.language ?? '—'}</Text>
      </View>
      {restKeys.length > 0 &&
        restKeys.map(key => (
          <View key={key} style={styles.section}>
            <Text style={styles.label}>{key}</Text>
            <Text style={styles.value}>{String((prefs as Record<string, unknown>)[key] ?? '—')}</Text>
          </View>
        ))}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Text style={styles.backButtonText}>{t('common.back')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14 },
  errorText: { color: colorTokens.error['700'], marginBottom: 16, textAlign: 'center' },
  scroll: { flex: 1 },
  section: { paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: BTHWANI_COLORS.borderSubtle },
  label: { fontSize: 12, color: colorTokens.neutral['500'], marginBottom: 4 },
  value: { fontSize: 16 },
  backButton: { margin: 16, padding: 12, backgroundColor: colorTokens.success['700'], borderRadius: 8, alignItems: 'center' },
  backButtonText: { color: BTHWANI_COLORS.surface, fontWeight: '600' },
});
