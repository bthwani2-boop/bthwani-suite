// Auto-generated screen for dsh_cart_init
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/cart/init
// §30 States: Loading / Error / Empty / Success / Content

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { dshCartInit } from '@bthwani/api-clients/dsh/dsh-cart-api';

interface auto_dsh_cart_initProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_dsh_cart_init: React.FC<auto_dsh_cart_initProps> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('content');
  const [cartId, setCartId] = useState<string | null>(null);

  const handleInit = useCallback(async () => {
    setState('loading');
    try {
      const json = await dshCartInit();
      if (!json?.success) throw new Error(json?.error || 'Init failed');
      setCartId(json?.data?.cartId ?? null);
      setState('content');
    } catch {
      setState('error');
    }
  }, []);

  const handleRetry = () => {
    setState('content');
    void handleInit();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_cart_init.loadingMessage')}
        screenName="auto_dsh_cart_init"
        operationName="dsh_cart_init"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_cart_init.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_cart_init"
        operationName="dsh_cart_init"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تهيئة السلة</Text>
        <Text style={[styles.subtitle, textAlignStart]}>بدء سلة تسوق جديدة</Text>
        {cartId && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>تم إنشاء السلة: {cartId}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.primaryButton} onPress={() => void handleInit()}>
          <Text style={styles.primaryButtonText}>{cartId ? t('dsh.app-client.mobile.auto_dsh_cart_init.startButtonText') : t('dsh.app-client.mobile.auto_dsh_cart_init.startButtonText')}</Text>
        </TouchableOpacity>
        {cartId && (
          <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshCartGet')}>
            <Text style={styles.secondaryButtonText}>عرض السلة</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  result: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginTop: BTHWANI_SPACING.lg },
  resultText: { fontSize: 14, color: semanticRoles.onSurface, },
  primaryButton: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginTop: BTHWANI_SPACING.lg, alignItems: 'center' },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: { padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginTop: BTHWANI_SPACING.sm, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_cart_init;


