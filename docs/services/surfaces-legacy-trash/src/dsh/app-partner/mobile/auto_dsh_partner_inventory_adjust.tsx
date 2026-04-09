// dsh_partner_inventory_adjust — POST /api/dsh/partners/me/inventory/adjust
// Surface: app-partner | §30 States: Loading/Error/Content

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { adjustDshPartnerInventory } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

export const AutoDshPartnerInventoryAdjust: React.FC<{ navigation?: any }> = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [itemId, setItemId] = useState('');
  const [delta, setDelta] = useState('');
  const [reason, setReason] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [done, setDone] = useState(false);

  const submit = useCallback(async () => {
    setState('loading');
    try {
      const ok = await adjustDshPartnerInventory(
        itemId.trim(),
        Number(delta) || 0,
        reason,
      );
      if (!ok) throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.adjustFail'));
      setDone(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [itemId, delta, reason, t]);

  if (state === 'loading') return <ScreenWrapper state="loading" loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.loadingMessage')} screenName="auto_dsh_partner_inventory_adjust" operationName="dsh_partner_inventory_adjust" />;
  if (state === 'error') return <ScreenWrapper state="error" errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.returnScreenwrapState')} screenName="auto_dsh_partner_inventory_adjust" operationName="dsh_partner_inventory_adjust" />;

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.title')}</Text>
        <TextInput style={[styles.input, textAlignStart]} value={itemId} onChangeText={setItemId} placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.productIdPlaceholder')} placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TextInput style={[styles.input, textAlignStart]} value={delta} onChangeText={setDelta} placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.deltaPlaceholder')} placeholderTextColor={semanticRoles.onSurfaceMuted} keyboardType="numeric" />
        <TextInput style={[styles.input, textAlignStart]} value={reason} onChangeText={setReason} placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.reasonLabel')} placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TouchableOpacity style={styles.btn} onPress={() => void submit()}><Text style={styles.btnText}>{t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.btnText')}</Text></TouchableOpacity>
        {done && <Text style={[styles.done, textAlignStart]}>{t('dsh.app-partner.mobile.auto_dsh_partner_inventory_adjust.doneText')}</Text>}
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

export default AutoDshPartnerInventoryAdjust;

