// Auto-generated screen for wlt_subscription_cancel
// Surface: app-client | Service: wlt
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';

interface auto_wlt_subscription_cancelProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_wlt_subscription_cancel: React.FC<auto_wlt_subscription_cancelProps> = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise((r) => setTimeout(r, 600));
        setState('content');
      } catch {
        setState('error');
      }
    };
    load();
  }, []);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>{t('wlt.subscription_cancel_title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t('wlt.subscription_cancel_subtitle')}</Text>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_التحميل')}
      errorMessage={t('surfaces.فشل_في_تحميل_البيانات')}
      onErrorAction={() => { setState('loading'); setTimeout(() => setState('content'), 600); }}
      screenName="auto_wlt_subscription_cancel"
      operationName="wlt_subscription_cancel"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  title: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.onSurface, },
  subtitle: { fontSize: 14, color: BTHWANI_COLORS.onSurfaceMuted, marginTop: 8 },
});

export default auto_wlt_subscription_cancel;

