// Auto-generated screen for dsh_order_status_get
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { ScreenWrapper, ScreenState } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { ArrivalBellCustomerBlock } from '../../components/ArrivalBellCustomerBlock';

interface auto_dsh_order_status_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { orderId?: string } };
}

export const auto_dsh_order_status_get: React.FC<auto_dsh_order_status_getProps> = ({ route }) => {
  const { t, isRTL } = useI18n();

  const steps = useMemo(
    () => [
      { id: 'created', label: t('dsh.app-client.mobile.auto_dsh_order_status_get.orderReceived'), time: t('dsh.app-client.mobile.auto_dsh_order_status_get.time1'), completed: true },
      { id: 'preparing', label: t('dsh.app-client.mobile.auto_dsh_order_status_get.beingPreparedAt'), time: t('dsh.app-client.mobile.auto_dsh_order_status_get.time2'), completed: true },
      { id: 'on_the_way', label: t('dsh.app-client.mobile.auto_dsh_order_status_get.onTheWay'), time: t('dsh.app-client.mobile.auto_dsh_order_status_get.time3'), completed: true },
      { id: 'delivered', label: t('dsh.app-client.mobile.auto_dsh_order_status_get.delivered'), time: t('dsh.app-client.mobile.auto_dsh_order_status_get.time4'), completed: false },
    ],
    [t]
  );
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const orderId = route?.params?.orderId ?? '';
  const [state, setState] = useState<ScreenState>('loading');
  // TODO: ربط هذه القيم مع استجابة dsh_order_status_get الفعلية

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
          <Text style={[styles.title, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_status_get.trackTitle')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_status_get.trackSubtitle')}</Text>
          {orderId ? <ArrivalBellCustomerBlock orderId={orderId} /> : null}
          <View style={styles.timeline}>
            {steps.map((step, index) => {
              const isLast = index === steps.length - 1;
              return (
                <View key={step.id} style={styles.stepRow}>
                  <View style={styles.stepIndicatorCol}>
                    <View
                      style={[
                        styles.stepCircle,
                        step.completed && styles.stepCircleCompleted,
                      ]}
                    >
                      {step.completed ? <Text style={styles.stepCheck}>✓</Text> : null}
                    </View>
                    {!isLast && <View style={styles.stepLine} />}
                  </View>
                  <View style={styles.stepContentCol}>
                    <Text style={styles.stepLabel}>{step.label}</Text>
                    <Text style={styles.stepTime}>{step.time}</Text>
                  </View>
                </View>
              );
            })}
          </View>
          <View style={styles.footer}>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_status_get.supportCta')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScreenWrapper>
    );
  }
  return (
    <ScreenWrapper state={state} loadingMessage={t('dsh.app-client.mobile.auto_dsh_order_status_get.loadingMessage')} errorMessage={t('dsh.app-client.mobile.auto_dsh_order_status_get.loadError')} onErrorAction={handleRetry} screenName="auto_dsh_order_status_get" operationName="dsh_order_status_get" />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: BTHWANI_COLORS.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: BTHWANI_COLORS.onSurface },
  subtitle: { fontSize: 14, color: BTHWANI_COLORS.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm },
  timeline: { marginTop: BTHWANI_SPACING.lg },
  stepRow: { flexDirection: 'row', marginBottom: BTHWANI_SPACING.sm },
  stepIndicatorCol: { width: 32, alignItems: 'center' },
  stepCircle: { width: 24, height: 24, borderRadius: 12, backgroundColor: BTHWANI_COLORS.surfaceSubtle, borderWidth: 2, borderColor: BTHWANI_COLORS.onSurfaceMuted, alignItems: 'center', justifyContent: 'center' },
  stepCircleCompleted: { backgroundColor: BTHWANI_COLORS.primary, borderColor: BTHWANI_COLORS.primary },
  stepCheck: { fontSize: 12, color: BTHWANI_COLORS.onPrimary, fontWeight: '700' },
  stepLine: { flex: 1, width: 2, backgroundColor: BTHWANI_COLORS.onSurfaceMuted, marginVertical: 2 },
  stepContentCol: { flex: 1, marginStart: BTHWANI_SPACING.sm },
  stepLabel: { fontSize: 14, fontWeight: '600', color: BTHWANI_COLORS.onSurface },
  stepTime: { fontSize: 12, color: BTHWANI_COLORS.onSurfaceMuted, marginTop: 2 },
  footer: { marginTop: BTHWANI_SPACING.xl, paddingTop: BTHWANI_SPACING.lg },
  supportButton: { paddingVertical: BTHWANI_SPACING.sm, paddingHorizontal: BTHWANI_SPACING.md, backgroundColor: BTHWANI_COLORS.surface, borderWidth: 1, borderColor: BTHWANI_COLORS.primary, borderRadius: 8 },
  supportButtonText: { fontSize: 14, color: BTHWANI_COLORS.primary },
});

export default auto_dsh_order_status_get;

