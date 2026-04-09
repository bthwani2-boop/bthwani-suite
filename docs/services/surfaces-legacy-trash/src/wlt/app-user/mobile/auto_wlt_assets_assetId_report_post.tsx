// Auto-generated screen for wlt_assets_assetId_report_post
// Surface: app-client | Service: wlt
// §30 States: Loading/Empty/Error/Success

import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

export const auto_wlt_assets_assetId_report_post: React.FC = () => {
  const { t } = useI18n();
  const [state, setState] = useState<ScreenState>('content');
  const handleReport = () => setState('loading');
  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.box}>
          <Text style={styles.title}>{t('surfaces.الإبلاغ_عن_الأصل')}</Text>
          <TouchableOpacity style={styles.btn} onPress={handleReport}>
            <Text style={styles.btnText}>{t('surfaces.إبلاغ')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper
      state="loading"
      loadingMessage={t('surfaces.جاري_الإبلاغ')}
      screenName="auto_wlt_assets_assetId_report_post"
      operationName="wlt_assets_assetId_report_post"
    />
  );
};

const styles = StyleSheet.create({
  box: { padding: BTHWANI_SPACING.contentH },
  title: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.onSurface, marginBottom: 16 },
  btn: { backgroundColor: BTHWANI_COLORS.primary, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.lg, alignItems: 'center' },
  btnText: { color: BTHWANI_COLORS.onPrimary, fontSize: 16, fontWeight: '600' },
});
export default auto_wlt_assets_assetId_report_post;

