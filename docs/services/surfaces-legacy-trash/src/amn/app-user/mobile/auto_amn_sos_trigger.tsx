// Auto-generated screen for amn_sos_trigger
// Surface: app-client | Service: amn
// §30 States: Loading / Empty / Error / Success / Content

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_amn_sos_triggerProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_amn_sos_trigger: React.FC<auto_amn_sos_triggerProps> = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 400));
        setState('content');
      } catch {
        setState('error');
      }
    };
    load();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 400);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_sos_trigger.title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_sos_trigger.subtitle')}</Text>
          <TouchableOpacity style={styles.primaryButton}>
            <Text style={styles.primaryButtonText}>{t('amn.app-client.mobile.auto_amn_sos_trigger.primaryButtonText')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_sos_trigger.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_sos_trigger.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName="auto_amn_sos_trigger"
      operationName="amn_sos_trigger"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  primaryButton: { backgroundColor: semanticRoles.error, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginTop: BTHWANI_SPACING.lg, alignItems: 'center' },
  primaryButtonText: { color: semanticRoles.surface, fontWeight: '600' },
});

export default auto_amn_sos_trigger;

