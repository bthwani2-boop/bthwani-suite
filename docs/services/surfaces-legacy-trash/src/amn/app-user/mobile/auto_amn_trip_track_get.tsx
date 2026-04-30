// Auto-generated screen for amn_trip_track_get
// Surface: app-client | Service: amn
// §30 States: Loading / Empty / Error / Success / Content
// Privacy: تتبع الرحلة متاح فقط في سياق رحلة محددة (من تفاصيل الرحلة أو رحلاتي)

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface auto_amn_trip_track_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: {
    navigate: (screen: string, params?: { tripId?: string }) => void;
  };
  route?: { params?: { tripId?: string } };
}

export const auto_amn_trip_track_get: React.FC<
  auto_amn_trip_track_getProps
> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [state, setState] = useState<ScreenState>('loading');
  const tripId = route?.params?.tripId;

  const handleNavigate = (screen: string, params?: { tripId?: string }) => {
    if (navigation?.navigate) {
      if (params?.tripId)
        (navigation as { navigate: (s: string, p?: object) => void }).navigate(
          screen,
          params
        );
      else navigation.navigate(screen);
    } else if (onNavigate) onNavigate(screen);
  };

  useEffect(() => {
    const load = async () => {
      try {
        await new Promise(r => setTimeout(r, 500));
        setState(tripId ? 'content' : 'empty');
      } catch {
        setState('error');
      }
    };
    load();
  }, [tripId]);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState(tripId ? 'content' : 'empty'), 500);
  };

  // لا tripId: تتبع متاح فقط من سياق رحلة (رحلاتي أو تفاصيل الرحلة)
  if (
    state === 'empty' ||
    (!tripId && state !== 'loading' && state !== 'error')
  ) {
    return (
      <ScreenWrapper
        state='empty'
        emptyMessage={t('amn.app-client.mobile.auto_amn_trip_track_get.selectTripToTrack')}
        screenName='auto_amn_trip_track_get'
        operationName='amn_trip_track_get'
      >
        <TouchableOpacity
          style={styles.cta}
          onPress={() => handleNavigate('AmnTripsList')}
        >
          <Text style={styles.ctaText}>{t('amn.app-client.mobile.auto_amn_trip_track_get.ctaTextTrips')}</Text>
        </TouchableOpacity>
      </ScreenWrapper>
    );
  }

  if (state === 'content' && tripId) {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <Text style={[styles.title, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_trip_track_get.title')}</Text>
          <Text style={[styles.subtitle, textAlignStart]}>{t('amn.app-client.mobile.auto_amn_trip_track_get.subtitle')}</Text>
          <TouchableOpacity
            style={styles.cta}
            onPress={() => handleNavigate('AmnTripGet', { tripId })}
          >
            <Text style={styles.ctaText}>{t('amn.app-client.mobile.auto_amn_trip_track_get.ctaTextDetails')}</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trip_track_get.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trip_track_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName='auto_amn_trip_track_get'
      operationName='amn_trip_track_get'
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

export default auto_amn_trip_track_get;

