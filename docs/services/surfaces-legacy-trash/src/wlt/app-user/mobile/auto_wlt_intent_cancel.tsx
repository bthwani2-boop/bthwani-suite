// Auto-generated screen for wlt_intent_cancel
// Surface: app-client | Service: wlt
// §30 States: Loading / Error / Empty / Success / Content

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface auto_wlt_intent_cancelProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_wlt_intent_cancel: React.FC<auto_wlt_intent_cancelProps> = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 500));
        setState('content');
      } catch {
        setState('error');
      }
    };
    load();
  }, []);
  const handleRetry = () => { setState('loading'); setTimeout(() => setState('content'), 500); };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>{t('wlt.app-client.mobile.auto_wlt_intent_cancel.title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t('wlt.app-client.mobile.auto_wlt_intent_cancel.subtitle')}</Text>
          <TouchableOpacity style={styles.primaryButton}><Text style={styles.primaryButtonText}>{t('wlt.app-client.mobile.auto_wlt_intent_cancel.cancelButtonText')}</Text></TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper state={state} loadingMessage={t('wlt.app-client.mobile.auto_wlt_intent_cancel.loadingMessage')} errorMessage={t('wlt.app-client.mobile.auto_wlt_intent_cancel.errorMessage')} onErrorAction={handleRetry} screenName="auto_wlt_intent_cancel" operationName="wlt_intent_cancel" />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: BTHWANI_COLORS.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.onSurface, },
  subtitle: { fontSize: 14, color: BTHWANI_COLORS.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  primaryButton: { backgroundColor: BTHWANI_COLORS.primary, padding: BTHWANI_SPACING.md, borderRadius: 8, marginTop: BTHWANI_SPACING.lg, alignItems: 'center' },
  primaryButtonText: { color: BTHWANI_COLORS.onPrimary, fontWeight: '600' },
});

export default auto_wlt_intent_cancel;

