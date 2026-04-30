// Auto-generated screen for arb_booking_escrow_status_get
// Surface: app-client | Service: arb
// §30 States: Loading / Error / Empty / Success / Content
// ARB_UX_FLOW: عرض فقط + زر واحد أساسي «عودة»

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_arb_booking_escrow_status_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_arb_booking_escrow_status_get: React.FC<auto_arb_booking_escrow_status_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

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

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>حالة العربون</Text>
          <Text style={[styles.subtitle, textAlignStart]}>حالة العربون (الإسكرو) للحجز: محجوز حتى إكمال الخدمة أو طلب إطلاق وفق السياسة.</Text>
          <View style={styles.statusCard}>
            <Text style={[styles.statusLabel, textAlignStart]}>الحالة</Text>
            <Text style={[styles.statusValue, textAlignStart]}>محجوز</Text>
          </View>
          <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('ArbBookingGet')}>
            <Text style={styles.primaryButtonText}>عودة لتفاصيل الحجز</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('arb.app-client.mobile.auto_arb_booking_escrow_status_get.loadingMessage')}
      errorMessage={t('arb.app-client.mobile.auto_arb_booking_escrow_status_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName="auto_arb_booking_escrow_status_get"
      operationName="arb_booking_escrow_status_get"
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  statusCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.lg,
  },
  statusLabel: { fontSize: 14, color: semanticRoles.onSurfaceMuted, },
  statusValue: { fontSize: 16, fontWeight: '600', color: semanticRoles.primaryCTA, marginTop: BTHWANI_SPACING.xs },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginTop: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  primaryButtonText: { color: semanticRoles.textInverse, fontSize: 14, fontWeight: '600' },
});

export default auto_arb_booking_escrow_status_get;

