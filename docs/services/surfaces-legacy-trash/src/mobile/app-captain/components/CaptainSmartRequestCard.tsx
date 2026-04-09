/**
 * CaptainSmartRequestCard — One-tap accept/decline overlay for incoming trip request
 * §UX-SUPREME-001: Smart Request Card on map; distance, time, fare, rating; رفض / قبول
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  semanticRoles,
  useDirection,
} from '@bthwani/ui-kit';
import { ServiceIcon } from '../../components';

export interface SmartRequestOffer {
  id: string;
  trip_id?: string;
  passenger_name?: string;
  pickup_location: string;
  dropoff_location?: string;
  estimated_fare?: number;
  distance_km?: number;
  estimated_duration?: number;
  rating?: number;
}

interface CaptainSmartRequestCardProps {
  visible: boolean;
  offer: SmartRequestOffer | null;
  onAccept: () => void;
  onDecline: () => void;
  onDismiss?: () => void;
  loading?: boolean;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = 260;

const formatFare = (n: number | undefined): string => {
  if (n == null) return '—';
  return `${Number(n).toLocaleString('ar-SA')} ر.س`;
};
const formatDistance = (km: number | undefined): string => {
  if (km == null) return '—';
  return `${Number(km).toFixed(1)} كم`;
};
const formatDuration = (min: number | undefined): string => {
  if (min == null) return '—';
  return `${Math.round(Number(min))} د`;
};

export const CaptainSmartRequestCard: React.FC<
  CaptainSmartRequestCardProps
> = ({ visible, offer, onAccept, onDecline, onDismiss, loading = false }) => {
  const { rowDirection, t } = useDirection();
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          damping: 24,
          stiffness: 200,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SHEET_HEIGHT,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  if (!offer) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType='none'
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, { opacity: backdropOpacity }]}>
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onDismiss}
          />
        </Animated.View>

        <Animated.View
          style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}
        >
          <SafeAreaView edges={['bottom']} style={styles.sheetContent}>
            <View style={styles.handle} />
            <Text style={styles.title}>طلب قريب منك</Text>

            <View style={[styles.row, { flexDirection: rowDirection }]}>
              <Text style={styles.label}>📍</Text>
              <Text style={styles.value}>
                {formatDistance(offer.distance_km)}
              </Text>
            </View>
            <View style={[styles.row, { flexDirection: rowDirection }]}>
              <Text style={styles.label}>🧑</Text>
              <Text style={styles.value}>
                {offer.passenger_name ??
                  t('mobile.app-captain.CaptainSmartRequestCard.rider')}
              </Text>
            </View>
            {offer.rating != null && (
              <View style={[styles.row, { flexDirection: rowDirection }]}>
                <Text style={styles.label}>⭐</Text>
                <Text style={styles.value}>
                  {Number(offer.rating).toFixed(1)}
                </Text>
              </View>
            )}
            <View style={[styles.row, { flexDirection: rowDirection }]}>
              <Text style={styles.label}>💰</Text>
              <Text style={styles.valueBold}>
                {formatFare(offer.estimated_fare)}
              </Text>
            </View>
            <View style={[styles.row, { flexDirection: rowDirection }]}>
              <Text style={styles.label}>⏱️</Text>
              <Text style={styles.value}>
                {formatDuration(offer.estimated_duration)}
              </Text>
            </View>

            <View style={[styles.actions, { flexDirection: rowDirection }]}>
              <TouchableOpacity
                style={styles.declineButton}
                onPress={onDecline}
                disabled={loading}
              >
                <Text style={styles.declineButtonText}>رفض</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.acceptButton}
                onPress={onAccept}
                disabled={loading}
              >
                <Text style={styles.acceptButtonText}>
                  {loading
                    ? t('mobile.app-captain.CaptainSmartRequestCard.loading')
                    : t('mobile.app-captain.CaptainSmartRequestCard.accept')}
                </Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: semanticRoles.overlay,
  },
  sheet: {
    minHeight: SHEET_HEIGHT,
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.xl,
    borderTopRightRadius: BTHWANI_RADIUS.xl,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 12,
  },
  sheetContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.lg,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: semanticRoles.border,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  label: {
    fontSize: 14,
    marginStart: BTHWANI_SPACING.sm,
    width: 24,
  },
  value: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  valueBold: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTA,
    flex: 1,
  },
  actions: {
    flexDirection: 'row',
    marginTop: BTHWANI_SPACING.lg,
    gap: BTHWANI_SPACING.md,
  },
  declineButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  declineButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  acceptButton: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: semanticRoles.primaryCTA,
  },
  acceptButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.primaryCTAText,
  },
});
