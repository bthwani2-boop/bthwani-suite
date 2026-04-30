/**
 * DSH Customer Profile Update — dsh_customer_profile_update. Shared for app-partner.
 * Uses getProfile + updateProfile + customerId + onBack + onSuccess.
 * WAVE 7: Central i18n only; no stale locale (all UI via t(); useCallback deps include t).
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
import type { DshCustomerProfileItem, DshCustomerProfileUpdateProps } from './types';
import { colorTokens } from '@bthwani/ui-kit';
import { BTHWANI_COLORS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export type { DshCustomerProfileUpdateProps } from './types';

type State = 'loading' | 'normal' | 'saving' | 'error';

export function DshCustomerProfileUpdate({
  getProfile,
  updateProfile,
  customerId,
  onBack,
  onSuccess,
}: DshCustomerProfileUpdateProps) {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<State>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const load = useCallback(async () => {
    if (!customerId?.trim()) {
      setErrorMessage(t('dsh.DshCustomerProfileUpdate.invalidCustomerId'));
      setState('error');
      return;
    }
    setState('loading');
    setErrorMessage('');
    try {
      const data = await getProfile(customerId.trim());
      if (data) {
        setFirst_name(data.first_name ?? '');
        setLast_name(data.last_name ?? '');
        setEmail(data.email ?? '');
        setPhone(data.phone ?? '');
        setState('normal');
      } else {
        setErrorMessage(t('dsh.DshCustomerProfileUpdate.customerNotFound'));
        setState('error');
      }
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCustomerProfileUpdate.errorMessage'));
      setState('error');
    }
  }, [getProfile, customerId, t]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = useCallback(async () => {
    setState('saving');
    setErrorMessage('');
    try {
      await updateProfile(customerId.trim(), {
        first_name: first_name.trim() || undefined,
        last_name: last_name.trim() || undefined,
        email: email.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      onSuccess?.();
      onBack();
    } catch (e: unknown) {
      setErrorMessage(e instanceof Error ? e.message : t('dsh.DshCustomerProfileUpdate.errorMessage'));
      setState('normal');
    }
  }, [updateProfile, customerId, first_name, last_name, email, phone, onSuccess, onBack, t]);

  if (state === 'loading') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t('dsh.DshCustomerProfileUpdate.backText')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dsh.DshCustomerProfileUpdate.title')}</Text>
        </View>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colorTokens.error['800']} />
          <Text style={styles.loadingText}>{t('dsh.DshCustomerProfileUpdate.loadingText')}</Text>
        </View>
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.container}>
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backText}>{t('dsh.DshCustomerProfileUpdate.backText')}</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{t('dsh.DshCustomerProfileUpdate.title')}</Text>
        </View>
        <View style={styles.centered}>
          <Text style={styles.errorTitle}>{t('dsh.DshCustomerProfileUpdate.errorTitle')}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={load}>
            <Text style={styles.retryText}>{t('dsh.DshCustomerProfileUpdate.retryText')}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
        <TouchableOpacity onPress={onBack} style={styles.backBtn}>
          <Text style={styles.backText}>{t('dsh.DshCustomerProfileUpdate.backText')}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{t('dsh.DshCustomerProfileUpdate.title')}</Text>
      </View>
      <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
        <Text style={styles.label}>{t('dsh.DshCustomerProfileUpdate.labelFirstName')}</Text>
        <TextInput
          style={styles.input}
          value={first_name}
          onChangeText={setFirst_name}
          placeholder={t('dsh.DshCustomerProfileUpdate.placeholderFirstName')}
          placeholderTextColor={colorTokens.neutral['400']}
          editable={state !== 'saving'}
        />
        <Text style={styles.label}>{t('dsh.DshCustomerProfileUpdate.labelLastName')}</Text>
        <TextInput
          style={styles.input}
          value={last_name}
          onChangeText={setLast_name}
          placeholder={t('dsh.DshCustomerProfileUpdate.placeholderLastName')}
          placeholderTextColor={colorTokens.neutral['400']}
          editable={state !== 'saving'}
        />
        <Text style={styles.label}>{t('dsh.DshCustomerProfileUpdate.labelEmail')}</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder={t('dsh.DshCustomerProfileUpdate.placeholderEmail')}
          placeholderTextColor={colorTokens.neutral['400']}
          keyboardType="email-address"
          editable={state !== 'saving'}
        />
        <Text style={styles.label}>{t('dsh.DshCustomerProfileUpdate.labelPhone')}</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder={t('dsh.DshCustomerProfileUpdate.placeholderPhone')}
          placeholderTextColor={colorTokens.neutral['400']}
          keyboardType="phone-pad"
          editable={state !== 'saving'}
        />
        {errorMessage ? (
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        ) : null}
        <TouchableOpacity
          style={[styles.saveBtn, state === 'saving' && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={state === 'saving'}
        >
          {state === 'saving' ? (
            <ActivityIndicator size="small" color={BTHWANI_COLORS.surface}/>
          ) : (
            <Text style={styles.saveBtnText}>{t('dsh.DshCustomerProfileUpdate.saveBtnText')}</Text>
          )}
        </TouchableOpacity>
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
  errorTitle: { fontSize: 18, fontWeight: '600', color: colorTokens.error['700'], marginBottom: 8 },
  errorMessage: { fontSize: 14, color: colorTokens.error['700'], textAlign: 'center', marginVertical: 8 },
  retryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: colorTokens.error['800'],
    borderRadius: 8,
  },
  retryText: { fontSize: 16, color: colorTokens.surface.primary, fontWeight: '600' },
  content: { flex: 1 },
  contentInner: { padding: 16, paddingBottom: 32 },
  label: { fontSize: 14, fontWeight: '600', color: colorTokens.neutral['900'], marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: colorTokens.neutral['200'],
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: colorTokens.surface.primary,
  },
  saveBtn: {
    padding: 16,
    backgroundColor: colorTokens.success['700'],
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  saveBtnDisabled: { opacity: 0.7 },
  saveBtnText: { fontSize: 16, color: colorTokens.surface.primary, fontWeight: '600' },
});
