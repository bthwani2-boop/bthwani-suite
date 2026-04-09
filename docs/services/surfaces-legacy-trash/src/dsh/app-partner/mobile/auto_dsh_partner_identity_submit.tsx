// dsh_partner_identity_submit — POST /api/dsh/partners/{partner_id}/identity
// Surface: app-partner | §30 States: Loading/Error/Content

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { submitDshPartnerIdentity } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

export const AutoDshPartnerIdentitySubmit: React.FC<{ navigation?: any; route?: { params?: { partner_id?: string } } }> = ({ route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [partnerId, setPartnerId] = useState(() => (route?.params?.partner_id ?? 'me'));
  const [idNumber, setIdNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [done, setDone] = useState(false);

  const submit = useCallback(async () => {
    const id = (partnerId || 'me').trim();
    setState('loading');
    try {
      const ok = await submitDshPartnerIdentity(id, fullName, idNumber);
      if (!ok) throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.submitFail'));
      setDone(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [partnerId, idNumber, fullName, t]);

  if (state === 'loading') return <ScreenWrapper state="loading" loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.loadingMessage')} screenName="auto_dsh_partner_identity_submit" operationName="dsh_partner_identity_submit" />;
  if (state === 'error') return <ScreenWrapper state="error" errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.returnScreenwrapState')} screenName="auto_dsh_partner_identity_submit" operationName="dsh_partner_identity_submit" />;

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.title')}</Text>
        <TextInput style={[styles.input, textAlignStart]} value={partnerId} onChangeText={setPartnerId} placeholder="partner_id" placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TextInput style={[styles.input, textAlignStart]} value={fullName} onChangeText={setFullName} placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.fullNameLabel')} placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TextInput style={[styles.input, textAlignStart]} value={idNumber} onChangeText={setIdNumber} placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.idNumberLabel')} placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TouchableOpacity style={styles.btn} onPress={() => void submit()}><Text style={styles.btnText}>{t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.btnText')}</Text></TouchableOpacity>
        {done && <Text style={[styles.done, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_identity_submit.doneText')}</Text>}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.lg, },
  input: { borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md, padding: BTHWANI_SPACING.md, fontSize: 16, color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.lg, },
  btn: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.contentH, borderRadius: BTHWANI_RADIUS.lg, alignItems: 'center' },
  btnText: { color: semanticRoles.primaryCTAText, fontSize: 16, fontWeight: '600' },
  done: { fontSize: 14, color: semanticRoles.onSurface, marginTop: BTHWANI_SPACING.md, },
});

export default AutoDshPartnerIdentitySubmit;

