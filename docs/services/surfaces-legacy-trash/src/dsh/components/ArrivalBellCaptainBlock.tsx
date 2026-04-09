/**
 * جرس الوصول — بلوك الكابتن (وصلت / رن الجرس).
 * مرجع: .cursor/context/DSH_ARRIVAL_BELL_SPEC.md | عملية arrival_bell
 * يُستخدم في DSH و AMN (orderId = معرف الطلب أو الرحلة).
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
  BTHWANI_COLORS,
} from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import { loadExpoLocation } from '../loadExpoLocation';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

async function getCurrentCoords(): Promise<{
  lat: number;
  lng: number;
} | null> {
  try {
    const Location = await loadExpoLocation();
    if (Location == null) return null;
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') return null;
    const pos = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });
    return { lat: pos.coords.latitude, lng: pos.coords.longitude };
  } catch {
    return null;
  }
}

export interface ArrivalBellStatus {
  arrived: boolean;
  arrivedAt: string | null;
  ringCount: number;
  lastRingAt: string | null;
  cooldownUntil: string | null;
  canRing: boolean;
  blockReason: string | null;
  customerAcknowledged: boolean;
  acknowledgedAt: string | null;
}

export interface ArrivalBellCaptainBlockProps {
  orderId: string;
  baseUrl?: string;
  /** تسمية الخدمة للعرض فقط (مثلاً "توصيل" أو "رحلة") */
  serviceLabel?: string;
  /** من يصل ويرن الجرس: كابتن (افتراضي) أو شريك توصيل (merchant_delivery). */
  actor?: 'captain' | 'partner';
  /** معرف الشريك عند actor=partner (اختياري؛ إن لم يُمرَّر يُرسل "me"). */
  actorId?: string;
}

export const ArrivalBellCaptainBlock: React.FC<
  ArrivalBellCaptainBlockProps
> = ({
  orderId,
  baseUrl,
  serviceLabel: serviceLabelProp,
  actor = 'captain',
  actorId,
}) => {
  const { t, isRTL } = useI18n();
  const serviceLabel =
    serviceLabelProp ?? t('dsh.components.ArrivalBellCaptainBlock.delivery');
  const textAlignStyle = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const url = baseUrl ?? getBaseUrl();
  const [status, setStatus] = useState<ArrivalBellStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [arriving, setArriving] = useState(false);
  const [ringing, setRinging] = useState(false);

  const fetchStatus = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id) return;
    try {
      const res = await rawFetch(
        `${url}/api/dsh/orders/${encodeURIComponent(id)}/arrival/status`,
        {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        }
      );
      const json = await res.json();
      if (json?.success && json?.data)
        setStatus(json.data as ArrivalBellStatus);
    } catch {
      setStatus(null);
    } finally {
      setLoading(false);
    }
  }, [orderId, url]);

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 8000);
    return () => clearInterval(t);
  }, [fetchStatus]);

  const handleArrived = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id || arriving) return;
    setArriving(true);
    try {
      const coords = await getCurrentCoords();
      const body: {
        lat?: number;
        lng?: number;
        captainId?: string;
        partnerId?: string;
      } = coords ? { lat: coords.lat, lng: coords.lng } : {};
      if (actor === 'partner') {
        body.partnerId = (actorId ?? 'me').trim() || 'me';
      } else {
        body.captainId = (actorId ?? 'me').trim() || 'me';
      }
      const res = await rawFetch(
        `${url}/api/dsh/orders/${encodeURIComponent(id)}/arrival/arrived`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (json?.success) await fetchStatus();
      else if (json?.data?.blockReason === 'out_of_range') {
        await fetchStatus();
      }
    } finally {
      setArriving(false);
    }
  }, [orderId, url, arriving, fetchStatus, actor, actorId]);

  const handleRing = useCallback(async () => {
    const id = (orderId ?? '').trim();
    if (!id || ringing) return;
    setRinging(true);
    try {
      const res = await rawFetch(
        `${url}/api/dsh/orders/${encodeURIComponent(id)}/arrival/ring`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({}),
        }
      );
      const json = await res.json();
      if (json?.success || json?.data?.blockReason) await fetchStatus();
    } finally {
      setRinging(false);
    }
  }, [orderId, url, ringing, fetchStatus]);

  if (loading || !status) {
    return (
      <View style={styles.block}>
        <ActivityIndicator size='small' color={semanticRoles.primaryCTA} />
        <Text style={[styles.hint, textAlignStyle]}>
          جاري تحميل حالة جرس الوصول...
        </Text>
      </View>
    );
  }

  const cooldownActive =
    status.cooldownUntil && new Date(status.cooldownUntil) > new Date();
  const cooldownSec =
    cooldownActive && status.cooldownUntil
      ? Math.max(
          0,
          Math.ceil(
            (new Date(status.cooldownUntil).getTime() - Date.now()) / 1000
          )
        )
      : 0;

  return (
    <View style={styles.block}>
      <Text style={[styles.title, textAlignStyle]}>جرس الوصول</Text>
      {!status.arrived ? (
        <>
          <Text style={[styles.hint, textAlignStyle]}>
            وصلت إلى نقطة {serviceLabel}؟
          </Text>
          <TouchableOpacity
            style={[styles.primaryBtn, arriving && styles.btnDisabled]}
            onPress={() => void handleArrived()}
            disabled={arriving}
          >
            {arriving ? (
              <ActivityIndicator size='small' color={BTHWANI_COLORS.surface} />
            ) : (
              <Text style={styles.primaryBtnText}>وصلت</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.arrivedLabel, textAlignStyle]}>
            تم تسجيل الوصول
          </Text>
          {status.customerAcknowledged ? (
            <Text style={[styles.ackText, textAlignStyle]}>
              العميل قال: أنا قادم
            </Text>
          ) : (
            <>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  (ringing || !status.canRing) && styles.btnDisabled,
                ]}
                onPress={() => void handleRing()}
                disabled={ringing || !status.canRing}
              >
                {ringing ? (
                  <ActivityIndicator
                    size='small'
                    color={BTHWANI_COLORS.surface}
                  />
                ) : cooldownActive ? (
                  <Text style={styles.primaryBtnText}>
                    يمكنك إعادة الرن بعد {cooldownSec} ث
                  </Text>
                ) : status.blockReason === 'max_rings_reached' ? (
                  <Text style={styles.primaryBtnText}>
                    تم الوصول للحد الأقصى
                  </Text>
                ) : status.blockReason === 'customer_disabled' ? (
                  <Text style={styles.primaryBtnText}>
                    العميل عطّل جرس الوصول
                  </Text>
                ) : (
                  <Text style={styles.primaryBtnText}>رن الجرس</Text>
                )}
              </TouchableOpacity>
              {status.ringCount > 0 && (
                <Text style={[styles.hint, textAlignStyle]}>
                  تم إرسال الجرس {status.ringCount} مرة
                </Text>
              )}
            </>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  block: {
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor:
      semanticRoles.surfaceSubtle || BTHWANI_COLORS.surfaceVariant,
    marginVertical: BTHWANI_SPACING.sm,
  },
  title: { fontSize: 16, fontWeight: '600', marginBottom: BTHWANI_SPACING.xs },
  hint: {
    fontSize: 13,
    color: semanticRoles.textMuted || BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  arrivedLabel: {
    fontSize: 14,
    color: semanticRoles.stateSuccess?.icon || BTHWANI_COLORS.onSuccess,
    marginBottom: BTHWANI_SPACING.sm,
  },
  ackText: { fontSize: 14, color: semanticRoles.primaryCTA },
  primaryBtn: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  btnDisabled: { opacity: 0.7 },
  primaryBtnText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});
