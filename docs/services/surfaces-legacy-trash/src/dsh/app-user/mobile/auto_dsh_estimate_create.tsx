// Auto-generated screen for dsh_estimate_create
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/estimates
// §30 States: Loading / Error / Success / Content — أقل نقرات، مسار واضح

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

export const auto_dsh_estimate_create: React.FC<Props> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [restaurantId, setRestaurantId] = useState('rest_default');
  const [lat, setLat] = useState('24.7136');
  const [lng, setLng] = useState('46.6753');
  const [address, setAddress] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [createdEstimateId, setCreatedEstimateId] = useState<string | null>(null);

  const submit = useCallback(async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/estimates`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          restaurantId: restaurantId.trim() || 'rest_default',
          customerLocation: {
            latitude: Number(lat) || 0,
            longitude: Number(lng) || 0,
            address: address.trim() || undefined,
          },
          items: [{ itemId: 'item_1', quantity: 1, price: 25 }],
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في إنشاء التقدير');
      setCreatedEstimateId(json?.data?.estimateId ?? null);
      setState('content');
    } catch {
      setState('error');
    }
  }, [restaurantId, lat, lng, address]);

  const handleRetry = () => {
    setState('content');
    void submit();
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) navigation.navigate(screen, params);
    else if (onNavigate) onNavigate(screen, params);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_estimate_create.loadingMessage')}
        screenName="auto_dsh_estimate_create"
        operationName="dsh_estimate_create"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_estimate_create.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_estimate_create"
        operationName="dsh_estimate_create"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>تقدير توصيل</Text>
        <Text style={[styles.subtitle, textAlignStart]}>إنشاء تقدير تكلفة ووقت التوصيل</Text>

        <Text style={[styles.label, textAlignStart]}>معرف المطعم</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={restaurantId}
          onChangeText={setRestaurantId}
          placeholder="rest_default"
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={[styles.label, textAlignStart]}>خط العرض</Text>
        <TextInput style={[styles.input, textAlignStart]} value={lat} onChangeText={setLat} placeholder="24.7136" placeholderTextColor={semanticRoles.onSurfaceMuted} keyboardType="numeric" />
        <Text style={[styles.label, textAlignStart]}>خط الطول</Text>
        <TextInput style={[styles.input, textAlignStart]} value={lng} onChangeText={setLng} placeholder="46.6753" placeholderTextColor={semanticRoles.onSurfaceMuted} keyboardType="numeric" />
        <Text style={[styles.label, textAlignStart]}>العنوان (اختياري)</Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={address}
          onChangeText={setAddress}
          placeholder={t('dsh.app-client.mobile.auto_dsh_estimate_create.deliveryAddressLabel')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />

        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()}>
          <Text style={styles.primaryButtonText}>إنشاء التقدير</Text>
        </TouchableOpacity>

        {createdEstimateId && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>تم إنشاء التقدير: {createdEstimateId}</Text>
            <TouchableOpacity style={styles.linkButton} onPress={() => handleNavigate('DshEstimateGet', { estimateId: createdEstimateId })}>
              <Text style={styles.linkText}>عرض التقدير</Text>
            </TouchableOpacity>
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
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface, },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.md },
  label: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.xs },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginVertical: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  secondaryButton: { padding: BTHWANI_SPACING.md, alignItems: 'center', borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
  result: { backgroundColor: semanticRoles.surface, padding: BTHWANI_SPACING.md, borderRadius: BTHWANI_RADIUS.md, marginBottom: BTHWANI_SPACING.sm },
  resultText: { fontSize: 14, color: semanticRoles.onSurface, },
  linkButton: { marginTop: BTHWANI_SPACING.sm, alignItems: 'center' },
  linkText: { fontSize: 14, color: semanticRoles.primaryCTA },
});

export default auto_dsh_estimate_create;

