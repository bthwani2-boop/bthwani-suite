/**
 * DSH Customer Profile Detail — dsh_customer_profile_get. Shared for app-partner.
 * Uses getProfile(customerId) + optional initialCustomerId + onBack + optional onEdit.
 * WAVE 7: Central i18n only; no stale locale (all UI via t(); useCallback/useEffect deps include t or load).
 * WAVE 8: Layout direction (start/end) from useI18n().isRTL only; header uses direction (ltr/rtl) + row so content follows start/end. Same for all screens.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import type { DshCustomerProfileItem, DshCustomerProfileDetailProps } from './types';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export type { DshCustomerProfileItem, DshCustomerProfileDetailProps } from './types';

type State = 'idle' | 'loading' | 'normal' | 'error';

export function DshCustomerProfileDetail({
  getProfile,
  initialCustomerId = '',
  onBack,
  onEdit,
}: DshCustomerProfileDetailProps) {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<State>(initialCustomerId?.trim() ? 'loading' : 'idle');
  const [profile, setProfile] = useState<DshCustomerProfileItem | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [enteredId, setEnteredId] = useState<string>(initialCustomerId?.trim() ?? '');
  const [lastTriedId, setLastTriedId] = useState<string>('');

  const load = useCallback(
    async (customerId: string) => {
      if (!customerId?.trim()) {
        setErrorMessage(t('dsh.DshCustomerProfileDetail.customerIdPlaceholder'));
        setState('error');
        return;
      }
      setState('loading');
      setErrorMessage('');
      setLastTriedId(customerId.trim());
      try {
        const data = await getProfile(customerId.trim());
        setProfile(data ?? null);
        setState(data ? 'normal' : 'error');
        if (!data) setErrorMessage(t('dsh.DshCustomerProfileDetail.customerNotFoundMessage'));
      } catch (e: unknown) {
        setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCustomerProfileDetail.errorMessage'));
        setState('error');
      }
    },
    [getProfile, t]
  );

  useEffect(() => {
    if (initialCustomerId?.trim()) load(initialCustomerId.trim());
  }, [initialCustomerId, load]);

  if (state === 'idle') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t('dsh.DshCustomerProfileDetail.backText')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dsh.DshCustomerProfileDetail.title')}</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.emptyTitle}>{t('dsh.DshCustomerProfileDetail.emptyTitle')}</Text>
          <TextInput
            style={styles.input}
            value={enteredId}
            onChangeText={setEnteredId}
            placeholder={t('dsh.DshCustomerProfileDetail.inputPlaceholder')}
            placeholderTextColor={colorTokens.neutral['400']}
          />
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => load(enteredId)}
          >
            <Text style={styles.retryText}>{t('dsh.DshCustomerProfileDetail.retryText')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (state === 'loading') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t('dsh.DshCustomerProfileDetail.backText')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dsh.DshCustomerProfileDetail.title')}</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colorTokens.error['800']} />
          <Text style={styles.loadingText}>{t('dsh.DshCustomerProfileDetail.loadingText')}</Text>
        </View>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t('dsh.DshCustomerProfileDetail.backText')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dsh.DshCustomerProfileDetail.title')}</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('dsh.DshCustomerProfileDetail.errorTitle')}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={() => load(lastTriedId || enteredId || initialCustomerId)}>
            <Text style={styles.retryText}>{t('dsh.DshCustomerProfileDetail.retryErrorText')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>{t('dsh.DshCustomerProfileDetail.backText')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{profile?.first_name || profile?.last_name || t('dsh.DshCustomerProfileDetail.profileTitle')}</Text>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>{t('dsh.DshCustomerProfileDetail.cardLabelCustomerId')}</Text>
          <Text style={styles.cardValue}>{profile?.customer_id ?? ''}</Text>
          {profile?.first_name != null && (
            <>
              <Text style={styles.cardLabel}>{t('dsh.DshCustomerProfileDetail.cardLabelFirstName')}</Text>
              <Text style={styles.cardValue}>{profile.first_name}</Text>
            </>
          )}
          {profile?.last_name != null && (
            <>
              <Text style={styles.cardLabel}>{t('dsh.DshCustomerProfileDetail.cardLabelLastName')}</Text>
              <Text style={styles.cardValue}>{profile.last_name}</Text>
            </>
          )}
          {profile?.email != null && (
            <>
              <Text style={styles.cardLabel}>{t('dsh.DshCustomerProfileDetail.cardLabelEmail')}</Text>
              <Text style={styles.cardValue}>{profile.email}</Text>
            </>
          )}
          {profile?.phone != null && (
            <>
              <Text style={styles.cardLabel}>{t('dsh.DshCustomerProfileDetail.cardLabelPhone')}</Text>
              <Text style={styles.cardValue}>{profile.phone}</Text>
            </>
          )}
        </View>
        {onEdit && profile?.customer_id && (
          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => onEdit(profile.customer_id)}
          >
            <Text style={styles.editBtnText}>{t('dsh.DshCustomerProfileDetail.editBtnText')}</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colorTokens.neutral['100'] },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colorTokens.surface.primary,
    borderBottomWidth: 1,
    borderBottomColor: colorTokens.neutral['200'],
  },
  backBtn: { marginEnd: 12 },
  backText: { fontSize: 16, color: colorTokens.error['800'] },
  title: { fontSize: 18, fontWeight: '600', color: colorTokens.neutral['900'] },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  loadingText: { marginTop: 12, fontSize: 14, color: colorTokens.neutral['600'] },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: colorTokens.neutral['900'], marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: colorTokens.neutral['200'],
    borderRadius: 8,
    padding: 12,
    width: '100%',
    maxWidth: 320,
    marginBottom: 16,
    fontSize: 14,
  },
  errorTitle: { fontSize: 18, fontWeight: '600', color: colorTokens.error['700'], marginBottom: 8 },
  errorMessage: { fontSize: 14, color: colorTokens.neutral['500'], textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colorTokens.error['800'],
    borderRadius: 8,
  },
  retryText: { fontSize: 16, color: colorTokens.surface.primary, fontWeight: '600' },
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colorTokens.surface.primary,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colorTokens.neutral['200'],
  },
  cardLabel: { fontSize: 12, color: colorTokens.neutral['600'], marginTop: 12 },
  cardValue: { fontSize: 16, color: colorTokens.neutral['900'], marginTop: 4 },
  editBtn: {
    padding: 16,
    backgroundColor: colorTokens.success['700'],
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtnText: { fontSize: 16, color: colorTokens.surface.primary, fontWeight: '600' },
});
