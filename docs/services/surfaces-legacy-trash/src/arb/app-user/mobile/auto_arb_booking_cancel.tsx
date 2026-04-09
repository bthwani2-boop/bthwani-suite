// Auto-generated screen for arb_booking_cancel
// Surface: app-client | Service: arb
// §30 States: Loading / Error / Empty / Success / Content

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_arb_booking_cancelProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_arb_booking_cancel: React.FC<auto_arb_booking_cancelProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

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

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 500);
  };

  const handleCancel = () => {
    setState('loading');
    setTimeout(() => setState('success'), 800);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>إلغاء الحجز</Text>
          <Text style={[styles.policyText, textAlignStart]}>داخل نافذة الإلغاء يُسترد العربون كاملاً. بعد انتهاء النافذة لا يُسترد العربون تلقائياً.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleCancel}>
            <Text style={styles.primaryButtonText}>إلغاء الحجز</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('arb.app-client.mobile.auto_arb_booking_cancel.loadingMessage')}
      errorMessage={t('arb.app-client.mobile.auto_arb_booking_cancel.errorLoadMessage')}
      onErrorAction={handleRetry}
      successMessage={t('arb.app-client.mobile.auto_arb_booking_cancel.bookingCancelledSuccess')}
      successActionText={t('arb.app-client.mobile.auto_arb_booking_cancel.backToBookings')}
      onSuccessAction={() => handleNavigate('ArbBookingsList')}
      screenName="auto_arb_booking_cancel"
      operationName="arb_booking_cancel"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  policyText: { fontSize: 13, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.md, lineHeight: 20 },
  primaryButton: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.md, borderRadius: 8, marginTop: BTHWANI_SPACING.lg, alignItems: 'center' },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
});

export default auto_arb_booking_cancel;

