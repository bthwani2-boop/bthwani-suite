// AMN Quote Get — عرض تفاصيل عرض السعر (انبثاق/سياق بعد QuoteCreate أو DATA_ONLY)
// Surface: app-client | Service: amn

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface auto_amn_quote_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
  route?: { params?: { quoteId?: string; fare?: number; validUntil?: string } };
}

export const auto_amn_quote_get: React.FC<auto_amn_quote_getProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const quoteId = route?.params?.quoteId;
  const [state, setState] = useState<ScreenState>(
    quoteId ? 'loading' : 'content'
  );
  const [fare, setFare] = useState<number | null>(route?.params?.fare ?? null);

  const handleNavigate = useCallback(
    (screen: string) => {
      if (navigation?.navigate) navigation.navigate(screen);
      else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    if (!quoteId) return;
    let cancelled = false;
    const load = async () => {
      await new Promise(r => setTimeout(r, 400));
      if (!cancelled) setFare(f => f ?? 45);
      if (!cancelled) setState('content');
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 400);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_quote_get.title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_quote_get.subtitle')}</Text>
          {quoteId && (
            <View style={styles.card}>
              <Text style={[styles.cardId, textAlignStart]}>{quoteId}</Text>
              {fare != null && <Text style={[styles.cardFare, textAlignStart]}>{fare} ريال</Text>}
            </View>
          )}
          <TouchableOpacity
            style={styles.cta}
            onPress={() => handleNavigate('AmnTripCreate')}
          >
            <Text style={styles.ctaText}>{t('amn.app-client.mobile.auto_amn_quote_get.ctaText')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_quote_get.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_quote_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName='auto_amn_quote_get'
      operationName='amn_quote_get'
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
  cardId: { fontSize: 14, color: semanticRoles.primaryCTA, },
  cardFare: {
    fontSize: 20,
    fontWeight: '600',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.sm,
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

export default auto_amn_quote_get;

