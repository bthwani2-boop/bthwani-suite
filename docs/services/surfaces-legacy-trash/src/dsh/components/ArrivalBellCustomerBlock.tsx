/**
 * جرس الوصول — بلوك العميل (استقبال الجرس + أنا قادم).
 * مرجع: .cursor/context/DSH_ARRIVAL_BELL_SPEC.md
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

export interface ArrivalBellCustomerBlockProps {
  orderId: string;
  baseUrl?: string;
}

export const ArrivalBellCustomerBlock: React.FC<ArrivalBellCustomerBlockProps> = ({ orderId, baseUrl }) => {
  const { t, isRTL } = useI18n();
  const textAlignStyle = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const url = baseUrl ?? getBaseUrl();
  const [arrived, setArrived] = useState(false);
  const [ringCount, setRingCount] = useState(0);
  const [acknowledged, setAcknowledged] = useState(false);
  const [rungBy, setRungBy] = useState<'captain' | 'partner'>('captain');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchStatus = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id) return;
    try {
      const res = await rawFetch(`${url}/api/dsh/orders/${encodeURIComponent(id)}/arrival/status`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      const json = await res.json();
      if (json?.success && json?.data) {
        setArrived(!!json.data.arrived);
        setRingCount(json.data.ringCount ?? 0);
        setAcknowledged(!!json.data.customerAcknowledged);
        setRungBy(json.data.rungBy === 'partner' ? 'partner' : 'captain');
      }
    } catch {
      setArrived(false);
      setRingCount(0);
    } finally {
      setLoading(false);
    }
  }, [orderId, url]);

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 5000);
    return () => clearInterval(t);
  }, [fetchStatus]);

  const handleAcknowledge = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id || submitting) return;
    setSubmitting(true);
    try {
      const res = await rawFetch(`${url}/api/dsh/orders/${encodeURIComponent(id)}/arrival/acknowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      const json = await res.json();
      if (json?.success) setAcknowledged(true);
    } finally {
      setSubmitting(false);
    }
  }, [orderId, url, submitting]);

  const whoAtDoor = rungBy === 'partner' ? t('dsh.components.ArrivalBellCustomerBlock.partnerAtDoor') : 'الكابتن أمام الباب';
  const whoAck = rungBy === 'partner' ? t('dsh.components.ArrivalBellCustomerBlock.toldPartnerOnTheWay') : 'أخبرت الكابتن أنك في الطريق';

  if (loading || (ringCount === 0 && !arrived)) return null;
  if (arrived && ringCount > 0 && !acknowledged) {
    return (
      <View style={styles.block}>
        <Text style={[styles.title, textAlignStyle]}>{whoAtDoor}</Text>
        <Text style={[styles.subtitle, textAlignStyle]}>تم إرسال جرس الوصول</Text>
        <TouchableOpacity
          style={[styles.cta, submitting && styles.ctaDisabled]}
          onPress={() => void handleAcknowledge()}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator size="small" color={BTHWANI_COLORS.surface}/> : <Text style={styles.ctaText}>أنا قادم</Text>}
        </TouchableOpacity>
      </View>
    );
  }
  if (acknowledged) {
    return (
      <View style={styles.block}>
        <Text style={[styles.ackLabel, textAlignStyle]}>{whoAck}</Text>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  block: {
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA + '18' || 'BTHWANI_COLORS.blueTint',
    marginVertical: BTHWANI_SPACING.sm,
  },
  title: { fontSize: 18, fontWeight: '700', marginBottom: BTHWANI_SPACING.xs },
  subtitle: { fontSize: 14, color: semanticRoles.textMuted || BTHWANI_COLORS.onSurfaceMuted, marginBottom: BTHWANI_SPACING.sm },
  ackLabel: { fontSize: 14, color: semanticRoles.stateSuccess?.icon || BTHWANI_COLORS.onSuccess },
  cta: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: { color: BTHWANI_COLORS.surface, fontSize: 16, fontWeight: '600' },
});
