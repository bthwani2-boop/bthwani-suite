// Auto-generated screen for dsh_subscription_family_members_post
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/subscriptions/family/{family_id}/members
// §30 States: Loading / Error / Content — أقل نقرات: نموذج واحد ثم تأكيد

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { family_id?: string } };
}

export const auto_dsh_subscription_family_members_post: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const familyId = (route?.params?.family_id ?? '').trim() || 'default';
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('member');
  const [state, setState] = useState<ScreenState>('content');
  const [successId, setSuccessId] = useState<string | null>(null);

  const handleSubmit = async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/subscriptions/family/${encodeURIComponent(familyId)}/members`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim() || undefined, name: name.trim() || undefined, role: role.trim() || 'member' }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في الإضافة');
      setSuccessId(json?.data?.memberId ?? null);
      setState('content');
    } catch {
      setState('error');
    }
  };

  const handleRetry = () => {
    setState('content');
    setSuccessId(null);
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_subscription_family_members_post.loadingMessage')} screenName="auto_dsh_subscription_family_members_post" operationName="dsh_subscription_family_members_post" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_subscription_family_members_post.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_subscription_family_members_post" operationName="dsh_subscription_family_members_post" />
    );
  }

  if (successId) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>تمت الإضافة</Text>
          <Text style={[styles.subtitle, textAlignStart]}>تم إضافة الفرد بنجاح.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('DshSubscriptionFamilyMembersGet', { family_id: familyId })}>
            <Text style={styles.primaryButtonText}>عرض الأفراد</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} onPress={() => { setSuccessId(null); setEmail(''); setName(''); setRole('member'); }}>
            <Text style={styles.secondaryButtonText}>إضافة فرد آخر</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>إضافة فرد للعائلة</Text>
        <Text style={[styles.subtitle, textAlignStart]}>العائلة: {familyId}</Text>
        <TextInput style={[styles.input, textAlignStart]} value={name} onChangeText={setName} placeholder={t('dsh.app-client.mobile.auto_dsh_subscription_family_members_post.nameLabel')} placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TextInput style={[styles.input, textAlignStart]} value={email} onChangeText={setEmail} placeholder={t('dsh.app-client.mobile.auto_dsh_subscription_family_members_post.emailLabel')} placeholderTextColor={semanticRoles.onSurfaceMuted} keyboardType="email-address" />
        <TextInput style={[styles.input, textAlignStart]} value={role} onChangeText={setRole} placeholder={t('dsh.app-client.mobile.auto_dsh_subscription_family_members_post.Member')} placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void handleSubmit()}>
          <Text style={styles.primaryButtonText}>إضافة</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshSubscriptionFamilyMembersGet', { family_id: familyId })}>
          <Text style={styles.secondaryButtonText}>عرض الأفراد</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.md },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_subscription_family_members_post;

