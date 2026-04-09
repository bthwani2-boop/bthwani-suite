// Auto-generated screen for dsh_delivery_get | Surface: app-client | Service: dsh | §30 States
// WAVE 7: Central i18n only; all UI via t(); useMemo([isRTL, currentLanguage]). No stale locale.

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface auto_dsh_delivery_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_delivery_get: React.FC<auto_dsh_delivery_getProps> = () => {
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
          <Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_delivery_get.title')}</Text>
          <Text style={styles.subtitle}>{t('dsh.app-client.mobile.auto_dsh_delivery_get.subtitle')}</Text>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper state={state} loadingMessage={t('dsh.app-client.mobile.auto_dsh_delivery_get.loadingMessage')} errorMessage={t('dsh.app-client.mobile.auto_dsh_delivery_get.loadError')} onErrorAction={handleRetry} screenName="auto_dsh_delivery_get" operationName="dsh_delivery_get" />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: BTHWANI_COLORS.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.onSurface },
  subtitle: { fontSize: 14, color: BTHWANI_COLORS.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
});

export default auto_dsh_delivery_get;

