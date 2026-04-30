// Auto-generated screen for dsh_order_rate
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/orders/:order_id/rate
// §30 States: Loading / Error / Success / Content — أقل نقرات، مسار واضح

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

const RATING_OPTIONS = [1, 2, 3, 4, 5];

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { orderId?: string } };
}

export const auto_dsh_order_rate: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [orderId, setOrderId] = useState(() => (route?.params?.orderId ?? ''));
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [captainRating, setCaptainRating] = useState<number | null>(null);
  const [captainComment, setCaptainComment] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async () => {
    const id = (orderId || (route?.params?.orderId ?? '')).trim();
    if (!id) {
      setState('error');
      return;
    }
    setState('loading');
    const payload: Record<string, unknown> = { rating, comment: comment.trim() || undefined };
    if (captainRating != null) payload.captainRating = captainRating;
    if (captainComment.trim()) payload.captainComment = captainComment.trim();
    try {
      const url = `${getBaseUrl()}/api/dsh/orders/${encodeURIComponent(id)}/rate`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Rate failed');
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [orderId, route?.params?.orderId, rating, comment, captainRating, captainComment]);

  const handleRetry = () => {
    setState('content');
    void submit();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_order_rate.loadingMessage')}
        screenName="auto_dsh_order_rate"
        operationName="dsh_order_rate"
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('dsh.app-client.mobile.auto_dsh_order_rate.errorMessage')}
        onErrorAction={handleRetry}
        screenName="auto_dsh_order_rate"
        operationName="dsh_order_rate"
      />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_order_rate.title')}</Text>
        <Text style={styles.subtitle}>{t('dsh.app-client.mobile.auto_dsh_order_rate.subtitle')}</Text>
        <TextInput
          style={styles.input}
          value={orderId}
          onChangeText={setOrderId}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_rate.placeholderOrderId')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={[styles.subtitle, textAlignStart]}>التقييم (1–5)</Text>
        <View style={styles.ratingRow}>
          {RATING_OPTIONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.ratingButton, rating === r && styles.ratingButtonActive]}
              onPress={() => setRating(r)}
            >
              <Text style={[styles.ratingText, rating === r && styles.ratingTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.subtitle}>تعليق (اختياري)</Text>
        <TextInput
          style={[styles.input, styles.commentInput]}
          value={comment}
          onChangeText={setComment}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_rate.placeholderExperience')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          multiline
          numberOfLines={2}
        />
        <Text style={[styles.sectionLabel, textAlignStart]}>تقييم الكابتن (اختياري)</Text>
        <View style={styles.ratingRow}>
          {RATING_OPTIONS.map((r) => (
            <TouchableOpacity
              key={r}
              style={[styles.ratingButton, captainRating === r && styles.ratingButtonActive]}
              onPress={() => setCaptainRating(captainRating === r ? null : r)}
            >
              <Text style={[styles.ratingText, captainRating === r && styles.ratingTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.subtitle, textAlignStart]}>تعليق للكابتن (اختياري)</Text>
        <TextInput
          style={[styles.input, styles.commentInput, { textAlign: isRTL ? 'right' : 'left' }]}
          value={captainComment}
          onChangeText={setCaptainComment}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_rate.placeholderDeliveryExperience')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          multiline
          numberOfLines={2}
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()} disabled={!orderId.trim()}>
          <Text style={styles.primaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_rate.primaryButtonText')}</Text>
        </TouchableOpacity>
        {success && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_rate.resultText')}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_rate.secondaryButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.xs,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.lg,
  },
  commentInput: { minHeight: 64, textAlignVertical: 'top' },
  ratingRow: { flexDirection: 'row', gap: BTHWANI_SPACING.sm, marginBottom: BTHWANI_SPACING.lg },
  ratingButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingButtonActive: { backgroundColor: semanticRoles.primaryCTA, borderColor: semanticRoles.primaryCTA },
  ratingText: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface },
  ratingTextActive: { color: semanticRoles.primaryCTAText },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  result: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  resultText: { fontSize: 14, color: semanticRoles.onSurface },
  secondaryButton: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
  },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_order_rate;

