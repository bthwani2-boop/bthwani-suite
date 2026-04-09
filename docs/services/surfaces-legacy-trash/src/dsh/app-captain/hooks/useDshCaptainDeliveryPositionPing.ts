/**
 * Hook: إرسال موقع الكابتن للتوصيلة بشكل دوري — نظام الإشعارات الذكي (قرب الكابتن).
 * مرجع: kdt/analysis/dsh/DSH_SMART_NOTIFICATIONS_CAPTAIN_NEAR_SPEC.md
 *
 * عند التفعيل: يجلب الموقع الحالي (expo-location) ويرسل POST /api/dsh/deliveries/:deliveryId/position
 * كل intervalMs. في أول طلب يمكن إرسال customerId, deliveryLat, deliveryLng لربط التوصيلة بعنوان العميل.
 * صفر تكرار: الإرسال من الخادم يحدد العتبات ويرسل كل إشعار مرة واحدة.
 */

import { useEffect, useRef } from 'react';
import { pingDshCaptainDeliveryPosition } from '@bthwani/api-clients/dsh/dsh-captain-api';
import { loadExpoLocation } from '../../loadExpoLocation';

const DEFAULT_INTERVAL_MS = 15000;

export interface DshDeliveryPositionMeta {
  customerId?: string;
  deliveryLat?: number;
  deliveryLng?: number;
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
    return {
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
    };
  } catch {
    return null;
  }
}

export function useDshCaptainDeliveryPositionPing(
  deliveryId: string,
  meta: DshDeliveryPositionMeta | null | undefined,
  enabled: boolean,
  intervalMs: number = DEFAULT_INTERVAL_MS
): void {
  const sentMetaRef = useRef(false);
  const id = (deliveryId ?? '').trim();

  useEffect(() => {
    if (!enabled || !id) return;

    const sendPosition = async () => {
      const coords = await getCurrentCoords();
      if (coords == null) return;

      const includeMeta =
        meta?.customerId &&
        typeof meta.deliveryLat === 'number' &&
        typeof meta.deliveryLng === 'number' &&
        !sentMetaRef.current;

      try {
        const ok = await pingDshCaptainDeliveryPosition(
          id,
          coords.lat,
          coords.lng,
          includeMeta
            ? {
                customerId: meta!.customerId,
                deliveryLat: meta!.deliveryLat!,
                deliveryLng: meta!.deliveryLng!,
              }
            : undefined
        );
        if (includeMeta && ok) {
          sentMetaRef.current = true;
        } else if (includeMeta && !ok) {
          sentMetaRef.current = false;
        }
      } catch {
        if (includeMeta) {
          sentMetaRef.current = false;
        }
      }
    };

    sendPosition();
    const interval = setInterval(sendPosition, intervalMs);
    return () => clearInterval(interval);
  }, [
    enabled,
    id,
    intervalMs,
    meta?.customerId,
    meta?.deliveryLat,
    meta?.deliveryLng,
  ]);
}
