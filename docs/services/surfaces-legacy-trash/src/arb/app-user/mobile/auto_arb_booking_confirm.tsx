// Auto-generated screen for arb_booking_confirm
// Surface: app-client | Service: arb
// §30 States: Loading / Error / Empty / Success / Content

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_arb_booking_confirmProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_arb_booking_confirm: React.FC<auto_arb_booking_confirmProps> = ({
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

  const handleConfirm = () => {
    setState('loading');
    setTimeout(() => setState('success'), 800);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>تأكيد الحجز</Text>
          <Text style={[styles.subtitle, textAlignStart]}>تأكيد الحجز النهائي. بعد التأكيد يمكنك عرض تفاصيل الحجز.</Text>
          <TouchableOpacity style={styles.primaryButton} onPress={handleConfirm}>
            <Text style={styles.primaryButtonText}>تأكيد</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('arb.app-client.mobile.auto_arb_booking_confirm.loadingMessage')}
      errorMessage={t('arb.app-client.mobile.auto_arb_booking_confirm.errorLoadMessage')}
      onErrorAction={handleRetry}
      successMessage={t('arb.app-client.mobile.auto_arb_booking_confirm.bookingConfirmedSuccess')}
      successActionText={t('arb.app-client.mobile.auto_arb_booking_confirm.viewBookingDetails')}
      onSuccessAction={() => handleNavigate('ArbBookingGet')}
      screenName="auto_arb_booking_confirm"
      operationName="arb_booking_confirm"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  primaryButton: { backgroundColor: semanticRoles.primaryCTA, padding: BTHWANI_SPACING.md, borderRadius: 8, marginTop: BTHWANI_SPACING.lg, alignItems: 'center' },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
});

export default auto_arb_booking_confirm;

