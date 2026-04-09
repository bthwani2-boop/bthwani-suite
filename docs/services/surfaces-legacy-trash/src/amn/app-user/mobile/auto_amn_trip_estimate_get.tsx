// AMN Trip Estimate Get — عرض تفاصيل التقدير (انبثاق/سياق أو DATA_ONLY)
// Surface: app-client | Service: amn | operation: amn_estimate_get

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface auto_amn_trip_estimate_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: {
    params?: {
      estimateId?: string;
      estimatedFare?: number;
      estimatedDuration?: number;
    };
  };
}

export const auto_amn_trip_estimate_get: React.FC<
  auto_amn_trip_estimate_getProps
> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const estimateId = route?.params?.estimateId;
  const [state, setState] = useState<ScreenState>(
    estimateId ? 'loading' : 'content'
  );
  const [data, setData] = useState<{ fare: number; duration: number } | null>(
    route?.params?.estimatedFare != null
      ? {
          fare: route.params.estimatedFare,
          duration: route.params.estimatedDuration ?? 0,
        }
      : null
  );

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    if (!estimateId && !data) return;
    let cancelled = false;
    const load = async () => {
      await new Promise(r => setTimeout(r, 400));
      if (!cancelled) setData(d => d ?? { fare: 45, duration: 15 });
      if (!cancelled) setState('content');
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [estimateId, data]);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 400);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>تفاصيل التقدير</Text>
          <Text style={[styles.subtitle, textAlignStart]}>التقدير والوقت المتوقع</Text>
          {(estimateId || data) && (
            <View style={styles.card}>
              {estimateId && <Text style={[styles.cardId, textAlignStart]}>{estimateId}</Text>}
              {data && (
                <>
                  <Text style={[styles.cardFare, textAlignStart]}>{data.fare} ريال</Text>
                  <Text style={[styles.cardMeta, textAlignStart]}>~{data.duration} دقيقة</Text>
                </>
              )}
            </View>
          )}
          <TouchableOpacity
            style={styles.cta}
            onPress={() => handleNavigate('AmnTripCreate')}
          >
            <Text style={styles.ctaText}>طلب رحلة</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_estimate_get.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trip_estimate_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName='auto_amn_trip_estimate_get'
      operationName='amn_estimate_get'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.sm,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginTop: BTHWANI_SPACING.lg,
  },
  cardId: { fontSize: 14, color: semanticRoles.primaryCTA },
  cardFare: {
    fontSize: 20,
    fontWeight: '600',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.sm,
  },
  cardMeta: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  cta: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
  },
  ctaText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_amn_trip_estimate_get;

