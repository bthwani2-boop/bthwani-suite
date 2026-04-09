// dsh_partner_intake_start — POST /api/dsh/partners/intake
// Surface: app-partner | §30 States: Loading/Error/Content | 1 tap

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { startDshPartnerIntake } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

export const AutoDshPartnerIntakeStart: React.FC<{ navigation?: any }> = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('content');
  const [done, setDone] = useState(false);

  const submit = useCallback(async () => {
    setState('loading');
    try {
      const ok = await startDshPartnerIntake();
      if (!ok) throw new Error('فشل البدء');
      setDone(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, []);

  if (state === 'loading') return <ScreenWrapper state="loading" loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_intake_start.loadingMessage')} screenName="auto_dsh_partner_intake_start" operationName="dsh_partner_intake_start" />;
  if (state === 'error') return <ScreenWrapper state="error" errorMessage={t('dsh.app-partner.mobile.auto_dsh_partner_intake_start.returnScreenwrapState')} screenName="auto_dsh_partner_intake_start" operationName="dsh_partner_intake_start" />;

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>بدء إعداد الشريك</Text>
        <TouchableOpacity style={styles.btn} onPress={() => void submit()}><Text style={styles.btnText}>بدء الإعداد</Text></TouchableOpacity>
        {done && <Text style={[styles.done, textAlignStart]}>تم بدء الإعداد بنجاح</Text>}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 20, fontWeight: '700', color: semanticRoles.onSurface, marginBottom: BTHWANI_SPACING.lg, },
  btn: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.contentH, borderRadius: BTHWANI_RADIUS.lg, alignItems: 'center' },
  btnText: { color: semanticRoles.primaryCTAText, fontSize: 16, fontWeight: '600' },
  done: { fontSize: 14, color: semanticRoles.onSurface, marginTop: BTHWANI_SPACING.md, },
});

export default AutoDshPartnerIntakeStart;

