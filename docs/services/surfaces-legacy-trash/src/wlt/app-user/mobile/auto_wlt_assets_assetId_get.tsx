// Auto-generated screen for wlt_assets_assetId_get
// Surface: app-client | Service: wlt
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export const auto_wlt_assets_assetId_get: React.FC = () => {
  const { t } = useI18n();
  const [state, setState] = useState<ScreenState>('loading');
  useEffect(() => {
    const load = async () => {
      await new Promise((r) => setTimeout(r, 800));
      setState('content');
    };
    load();
  }, []);

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.box}>
          <Text style={styles.title}>{t('surfaces.تفاصيل_الأصل')}</Text>
          <Text style={styles.sub}>{t('surfaces.عرض_بيانات_الأصل')}</Text>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('surfaces.جاري_تحميل_الأصل')}
      emptyMessage={t('surfaces.لا_يوجد_أصل')}
      errorMessage={t('surfaces.فشل_التحميل')}
      onErrorAction={() => setState('loading')}
      screenName="auto_wlt_assets_assetId_get"
      operationName="wlt_assets_assetId_get"
    />
  );
};

const styles = StyleSheet.create({
  box: { padding: BTHWANI_SPACING.contentH },
  title: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.onSurface },
  sub: { fontSize: 14, color: BTHWANI_COLORS.onSurfaceMuted, marginTop: 8 },
});
export default auto_wlt_assets_assetId_get;

