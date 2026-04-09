// AMN Trip Receipt Get — إيصال الرحلة في سياق الرحلة المكتملة
// Surface: app-client | Service: amn | operation: amn_trip_receipt_get
// §30 States: Loading / Empty / Error / Content (no Success — receipt is read-only)

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface auto_amn_trip_receipt_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string, params?: { tripId?: string }) => void };
  route?: { params?: { tripId?: string } };
}

export const auto_amn_trip_receipt_get: React.FC<auto_amn_trip_receipt_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const tripId = route?.params?.tripId;
  const [state, setState] = useState<ScreenState>(tripId ? 'loading' : 'empty');
  const [receipt, setReceipt] = useState<{ tripId: string; total?: number; currency?: string; status?: string } | null>(null);

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    if (!tripId) {
      setState('empty');
      return;
    }
    let cancelled = false;
    setState('loading');
    const load = async () => {
      try {
        // In production: GET /api/amn/trip/:tripId/receipt with X-User-Id
        await new Promise((r) => setTimeout(r, 600));
        if (!cancelled) {
          setReceipt({
            tripId,
            total: 45,
            currency: '',
            status: t('amn.app-client.mobile.auto_amn_trip_receipt_get.completed'),
          });
          setState('content');
        }
      } catch {
        if (!cancelled) setState('error');
      }
    };
    load();
    return () => { cancelled = true; };
  }, [tripId]);

  const handleRetry = () => {
    setState('loading');
    setReceipt(null);
    setTimeout(() => {
      setReceipt({ tripId: tripId!, total: 45, currency: '', status: t('amn.app-client.mobile.auto_amn_trip_receipt_get.completed_69') });
      setState('content');
    }, 500);
  };

  if (!tripId) {
    return (
      <ScreenWrapper
        state="empty"
        emptyMessage={t('amn.app-client.mobile.auto_amn_trip_receipt_get.selectTripForReceipt')}
        screenName="auto_amn_trip_receipt_get"
        operationName="amn_trip_receipt_get"
      >
        <TouchableOpacity style={styles.cta} onPress={() => handleNavigate('AmnTripsList')}>
          <Text style={styles.ctaText}>{t('amn.receipt.back_to_trips')}</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  if (state === 'content' && receipt) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>إيصال الرحلة</Text>
          <Text style={[styles.subtitle, textAlignStart]}>تفاصيل الإيصال والمبلغ</Text>
          <View style={styles.receiptCard}>
            <Text style={[styles.receiptTripId, textAlignStart]}>{receipt.tripId}</Text>
            <View style={styles.row}>
              <Text style={[styles.label, textAlignStart]}>{t('amn.receipt.status')}</Text>
              <Text style={[styles.value, textAlignStart]}>{receipt.status ?? '—'}</Text>
            </View>
            <View style={styles.row}>
              <Text style={[styles.label, textAlignStart]}>{t('amn.receipt.total_amount')}</Text>
              <Text style={[styles.totalValue, textAlignStart]}>{receipt.total ?? '—'} {t('surfaces.currency_rial')}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.cta} onPress={() => handleNavigate('AmnTripsList')}>
            <Text style={styles.ctaText}>{t('amn.receipt.back_to_trips')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_receipt_get.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trip_receipt_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName="auto_amn_trip_receipt_get"
      operationName="amn_trip_receipt_get"
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
  receiptCard: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginTop: BTHWANI_SPACING.lg,
  },
  receiptTripId: { fontSize: 14, fontWeight: '600', color: semanticRoles.primaryCTA, marginBottom: BTHWANI_SPACING.md, },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginTop: BTHWANI_SPACING.sm },
  label: { fontSize: 14, color: semanticRoles.textMuted, },
  value: { fontSize: 14, color: semanticRoles.text },
  totalValue: { fontSize: 16, fontWeight: '600', color: semanticRoles.text },
  cta: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
  },
  ctaText: { color: semanticRoles.primaryCTAText ?? semanticRoles.surface, fontSize: 16, fontWeight: '600' },
});

export default auto_amn_trip_receipt_get;

