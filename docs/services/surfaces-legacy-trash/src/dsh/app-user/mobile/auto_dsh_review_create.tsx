// Auto-generated screen for dsh_review_create
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/reviews
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

const RATING_OPTIONS = [1, 2, 3, 4, 5];

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { orderId?: string } };
}

export const auto_dsh_review_create: React.FC<Props> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [orderId, setOrderId] = useState(() => (route?.params?.orderId != null ? route.params.orderId : ''));
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async () => {
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/reviews`;
      const id = (orderId || (route?.params?.orderId != null ? route.params.orderId : '')).trim();
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: id || undefined,
          order_id: id || undefined,
          rating,
          comment: comment.trim() || undefined,
          targetType: 'order',
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'فشل في إرسال التقييم');
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [orderId, route?.params?.orderId, rating, comment]);

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
      <ScreenWrapper state="loading" loadingMessage={t('dsh.app-client.mobile.auto_dsh_review_create.loadingMessage')} screenName="auto_dsh_review_create" operationName="dsh_review_create" />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper state="error" errorMessage={t('dsh.app-client.mobile.auto_dsh_review_create.errorMessage')} onErrorAction={handleRetry} screenName="auto_dsh_review_create" operationName="dsh_review_create" />
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_review_create.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_review_create.subtitle')}</Text>
        <TextInput
          style={[styles.input, { textAlign: isRTL ? 'right' : 'left' }]}
          value={orderId}
          onChangeText={setOrderId}
          placeholder="order_123..."
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={styles.label}>{t('dsh.app-client.mobile.auto_dsh_review_create.labelRating')}</Text>
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
        <Text style={[styles.label, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_review_create.labelComment')}</Text>
        <TextInput
          style={[styles.input, styles.commentInput, { textAlign: isRTL ? 'right' : 'left' }]}
          value={comment}
          onChangeText={setComment}
          placeholder={t('dsh.app-client.mobile.auto_dsh_review_create.placeholderComment')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          multiline
        />
        <TouchableOpacity style={styles.primaryButton} onPress={() => void submit()}>
          <Text style={styles.primaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_review_create.primaryButtonText')}</Text>
        </TouchableOpacity>
        {success && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_review_create.resultText')}</Text>
          </View>
        )}
        <TouchableOpacity style={styles.secondaryButton} onPress={() => handleNavigate('DshOrdersList')}>
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_review_create.secondaryButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: BTHWANI_SPACING.contentH, backgroundColor: semanticRoles.surfaceSubtle },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface },
  subtitle: { fontSize: 14, color: semanticRoles.onSurfaceMuted, marginBottom: BTHWANI_SPACING.sm },
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
  commentInput: { minHeight: 64, textAlignVertical: 'top' },
  ratingRow: { flexDirection: 'row', flexWrap: 'wrap', gap: BTHWANI_SPACING.xs, marginBottom: BTHWANI_SPACING.lg },
  ratingButton: { paddingVertical: BTHWANI_SPACING.sm, paddingHorizontal: BTHWANI_SPACING.contentH, borderWidth: 1, borderColor: semanticRoles.outline, borderRadius: BTHWANI_RADIUS.md },
  ratingButtonActive: { backgroundColor: semanticRoles.primaryCTA, borderColor: semanticRoles.primaryCTA },
  ratingText: { fontSize: 14, color: semanticRoles.onSurface },
  ratingTextActive: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
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
  resultText: { fontSize: 14, color: semanticRoles.onSurface },
});

export default auto_dsh_review_create;

