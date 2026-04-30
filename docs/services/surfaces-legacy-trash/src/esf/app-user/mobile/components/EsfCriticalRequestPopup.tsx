/**
 * ESF Critical Request Popup
 * §UX-SUPREME-001: Critical donor alert with accept only when a real match exists.
 */

import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import type { EsfRequest } from '../../../uiTypes';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface EsfCriticalRequestPopupProps {
  visible: boolean;
  request: EsfRequest | null;
  onAccept: (request: EsfRequest) => void;
  onViewDetails: (request: EsfRequest) => void;
  onDismiss: () => void;
}

export const EsfCriticalRequestPopup: React.FC<
  EsfCriticalRequestPopupProps
> = ({ visible, request, onAccept, onViewDetails, onDismiss }) => {
  const { isRTL } = useI18n();
  const slideAnim = useRef(new Animated.Value(SCREEN_WIDTH)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible && request) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          tension: 100,
          friction: 8,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: SCREEN_WIDTH,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, request, slideAnim, opacityAnim]);

  if (!visible || !request) return null;

  const canAccept = request.status === 'pending' && Boolean(request.matchId);

  const handlePrimaryAction = () => {
    if (canAccept) {
      onAccept(request);
    } else {
      onViewDetails(request);
    }
    onDismiss();
  };

  return (
    <Animated.View
      style={[
        styles.floatingWrap,
        {
          opacity: opacityAnim,
        },
      ]}
      pointerEvents='box-none'
    >
      <Animated.View
        style={[
          styles.popup,
          {
            transform: [
              {
                translateY: slideAnim.interpolate({
                  inputRange: [0, SCREEN_WIDTH],
                  outputRange: [0, 36],
                }),
              },
            ],
          },
        ]}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <View
              style={[
                styles.bloodTypeBadge,
                { backgroundColor: semanticRoles.stateError.icon },
              ]}
            >
              <Text style={styles.bloodTypeText}>{request.bloodType}</Text>
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.title}>طلب حرج قريب منك</Text>
              <Text style={styles.subtitle}>
                {request.units} وحدة مطلوبة • {request.distance?.toFixed(1)} كم
              </Text>
            </View>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onDismiss}
              hitSlop={{
                top: 10,
                bottom: 10,
                [isRTL ? 'right' : 'left']: 10,
                [isRTL ? 'left' : 'right']: 10,
              }}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.details}>
            <Text style={styles.hospital}>
              {request.hospitalName || request.location}
            </Text>
            <Text style={styles.time}>{request.timestamp}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={styles.dismissButton} onPress={onDismiss}>
              <Text style={styles.dismissButtonText}>تجاهل</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={handlePrimaryAction}
            >
              <Text style={styles.acceptButtonText}>
                {canAccept ? '✓ سأتبرع الآن' : 'عرض التفاصيل'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  floatingWrap: {
    position: 'absolute',
    start: 0,
    end: 0,
    bottom: BTHWANI_SPACING.xl * 2,
    justifyContent: 'flex-end',
    zIndex: 1000,
  },
  popup: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.xl,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 18,
    elevation: 8,
    marginHorizontal: BTHWANI_SPACING.contentH,
    borderWidth: 1,
    borderColor: semanticRoles.stateError.icon + '22',
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  bloodTypeBadge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  bloodTypeText: {
    color: semanticRoles.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  closeButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  closeButtonText: {
    fontSize: 18,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  details: {
    marginBottom: BTHWANI_SPACING.md,
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  hospital: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  time: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  actions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
  },
  dismissButton: {
    flex: 1,
    minHeight: 46,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    color: semanticRoles.text,
    fontSize: 14,
    fontWeight: '700',
  },
  acceptButton: {
    flex: 1.4,
    minHeight: 46,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '800',
  },
});
