// Auto-generated screen for dsh_delivery_track_get
// Surface: app-client | Service: dsh | Operation: GET /api/dsh/deliveries/:deliveryId/track
// §30 States: Loading / Error / Content — لا خلط ?? مع ||

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { deliveryId?: string } };
}

type TrackData = {
  deliveryId?: string;
  status?: string;
  lastPosition?: { lat?: number; lng?: number; updatedAt?: string };
  estimatedArrival?: string;
  updatedAt?: string;
} | null;

export const auto_dsh_delivery_track_get: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [deliveryId, setDeliveryId] = useState(() => (route?.params?.deliveryId != null ? route.params.deliveryId : ''));
  const [state, setState] = useState<ScreenState>('content');
  const [track, setTrack] = useState<TrackData>(null);

  const fetchTrack = useCallback(async () => {
    const id = (deliveryId || (route?.params?.deliveryId != null ? route.params.deliveryId : '')).trim();
    if (!id) {
      setState('content');
      setTrack(null);
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/deliveries/${encodeURIComponent(id)}/track`;
      const res = await rawFetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في جلب التتبع');
      setTrack(json?.data || null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [deliveryId, route?.params?.deliveryId]);

  const handleRetry = () => {
    setState('content');
    void fetchTrack();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_delivery_track_get.loadingMessage')} screenName="auto_dsh_delivery_track_get" operationName="dsh_delivery_track_get" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_delivery_track_get.errorLoadMessage')} onErrorAction={handleRetry} screenName="auto_dsh_delivery_track_get" operationName="dsh_delivery_track_get" />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تتبع التوصيل</Text>
        <Text style={[styles.subtitle, textAlignStart]}>معرف التوصيل (deliveryId)</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={deliveryId}
          onChangeText={setDeliveryId}
          placeholder="delivery_123..."
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void fetchTrack()} disabled={!deliveryId.trim()}>
          <Text style={styles.primaryButtonText}>عرض التتبع</Text>
        </TouchableOpacity>
        {track && (
          <View style={styles.card}>
            {track.status && <Text style={[styles.label, textAlignStart]}>الحالة: {track.status}</Text>}
            {track.lastPosition && (
              <Text style={[styles.value, textAlignStart]}>
                آخر موقع: {track.lastPosition.lat != null && track.lastPosition.lng != null ? `${track.lastPosition.lat.toFixed(4)}, ${track.lastPosition.lng.toFixed(4)}` : '—'}
              </Text>
            )}
            {track.estimatedArrival && (
              <Text style={[styles.value, textAlignStart]}>الوصول المتوقع: {new Date(track.estimatedArrival).toLocaleString('ar-SA')}</Text>
            )}
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>طلباتي</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.sm },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.lg,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  card: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  label: { fontSize: 14, fontWeight: '600', color: semanticRoles.onSurface },
  value: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.xs },
});

export default auto_dsh_delivery_track_get;

