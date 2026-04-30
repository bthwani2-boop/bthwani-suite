// dsh_partner_inventory_update — POST /api/dsh/partner/stores/{storeId}/inventory
// Surface: app-partner | §30 States: Loading/Error/Content

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { updateDshPartnerInventory } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

export const AutoDshPartnerInventoryUpdate: React.FC<{ navigation?: any; route?: { params?: { storeId?: string } } }> = ({ route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [storeId, setStoreId] = useState(() => (route?.params?.storeId ?? ''));
  const [itemsJson, setItemsJson] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [done, setDone] = useState(false);

  const submit = useCallback(async () => {
    const id = storeId.trim();
    if (!id) { setState('error'); return; }
    setState('loading');
    try {
      let items: Array<{ sku?: string; quantity?: number }> = [];
      try { items = JSON.parse(itemsJson || '[]'); } catch { items = []; }
      const ok = await updateDshPartnerInventory(id, items);
      if (!ok) throw new Error('فشل التحديث');
      setDone(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [storeId, itemsJson]);

  if (state === 'loading') return <ScreenWrapper state="loading" loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_inventory_update.loadingMessage')} screenName="auto_dsh_partner_inventory_update" operationName="dsh_partner_inventory_update" />;
  if (state === 'error') return <ScreenWrapper state="error" errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_inventory_update.returnScreenwrapState')} screenName="auto_dsh_partner_inventory_update" operationName="dsh_partner_inventory_update" />;

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تحديث مخزون المتجر</Text>
        <TextInput style={[styles.input, textAlignStart]} value={storeId} onChangeText={setStoreId} placeholder="معرّف المتجر" placeholderTextColor={semanticRoles.onSurfaceMuted} />
        <TextInput style={[styles.input, textAlignStart, styles.area]} value={itemsJson} onChangeText={setItemsJson} placeholder='[{"sku":"x","quantity":1}]' placeholderTextColor={semanticRoles.onSurfaceMuted} multiline />
        <TouchableOpacity style={styles.btn} onPress={() => void submit()} disabled={!storeId.trim()}><Text style={styles.btnText}>تحديث</Text></TouchableOpacity>
        {done && <Text style={[styles.done, textAlignStart]}>تم التحديث بنجاح</Text>}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.lg, },
  input: { borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md, padding: BTHWANI_SPACING.md, fontSize: 16, color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.lg, },
  area: { minHeight: 80 },
  btn: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.contentH, borderRadius: BTHWANI_RADIUS.lg, alignItems: 'center' },
  btnText: { color: semanticRoles.primaryCTAText, fontSize: 16, fontWeight: '600' },
  done: { fontSize: 14, color: semanticRoles.onSurface, marginTop: BTHWANI_SPACING.md, },
});

export default AutoDshPartnerInventoryUpdate;

