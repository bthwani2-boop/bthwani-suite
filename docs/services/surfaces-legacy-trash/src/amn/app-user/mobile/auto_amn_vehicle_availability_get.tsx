// AMN Vehicle Availability — توفر المركبات قريب منك (عرض تجميعي + CTA)
// Surface: app-client | Service: amn
// انبثاق من TripCreate أو مدخل مستقل؛ عرض عدد/نطاق دون كشف هويات (خصوصية)

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_amn_vehicle_availability_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_amn_vehicle_availability_get: React.FC<auto_amn_vehicle_availability_getProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const [count, setCount] = useState<number | null>(null);

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await new Promise((r) => setTimeout(r, 500));
      if (!cancelled) setCount(Math.floor(0 * 8) + 2);
      if (!cancelled) setState('content');
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleRetry = () => {
    setState('loading');
    setCount(null);
    setTimeout(() => {
      setCount(Math.floor(0 * 8) + 2);
      setState('content');
    }, 500);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>توفر المركبات</Text>
          <Text style={[styles.subtitle, textAlignStart]}>التحقق من توفر المركبات في منطقتك</Text>
          <View style={styles.availabilityCard}>
            <Text style={styles.availabilityLabel}>سائقات متاحات قريبة منك</Text>
            <Text style={styles.availabilityCount}>{count ?? '—'}</Text>
            <Text style={styles.availabilityHint}>عرض تجميعي دون كشف هويات</Text>
          </View>
          <TouchableOpacity style={styles.cta} onPress={() => handleNavigate('AmnTripCreate')}>
            <Text style={styles.ctaText}>طلب رحلة</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_vehicle_availability_get.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_vehicle_availability_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName="auto_amn_vehicle_availability_get"
      operationName="amn_vehicle_availability_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.text, },
  subtitle: { fontSize: 14, color: semanticRoles.textMuted, marginTop: BTHWANI_SPACING.sm },
  availabilityCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginTop: BTHWANI_SPACING.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  availabilityLabel: { fontSize: 14, color: semanticRoles.textMuted, textAlign: 'center' },
  availabilityCount: { fontSize: 32, fontWeight: '700', color: semanticRoles.primaryCTA, marginTop: BTHWANI_SPACING.sm },
  availabilityHint: { fontSize: 12, color: semanticRoles.textMuted, marginTop: BTHWANI_SPACING.xs },
  cta: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
  },
  ctaText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
});

export default auto_amn_vehicle_availability_get;

