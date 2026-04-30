/**
 * CaptainBottomSheetAlert — Operational Alerts During Trip
 * §UX-SUPREME-001: Zero distraction, quick action
 *
 * Features:
 * - Bottom Sheet for operational alerts
 * - No scrolling (max 2 lines)
 * - Single CTA: "عرض" or "تم"
 * - Secondary action: "لاحقًا"
 * - Smooth animations
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

interface CaptainBottomSheetAlertProps {
  visible: boolean;
  title: string;
  message?: string;
  primaryAction: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
  onDismiss?: () => void;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const SHEET_HEIGHT = 180;

export const CaptainBottomSheetAlert: React.FC<
  CaptainBottomSheetAlertProps
> = ({
  visible,
  title,
  message,
  primaryAction,
  secondaryAction,
  onDismiss,
}) => {
  const { rowDirection } = useDirection();
  const slideAnim = useRef(new Animated.Value(SHEET_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
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

  return (
    <Modal
      visible={visible}
      transparent
      animationType='none'
      onRequestClose={onDismiss}
    >
      <View style={styles.container}>
        {/* Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={StyleSheet.absoluteFill}
            activeOpacity={1}
            onPress={onDismiss}
          />
        </Animated.View>

        {/* Bottom Sheet */}
        <Animated.View
          style={[
            styles.sheet,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView edges={['bottom']} style={styles.sheetContent}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Content */}
            <View style={styles.content}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {message && (
                <Text style={styles.message} numberOfLines={2}>
                  {message}
                </Text>
              )}
            </View>

            {/* Actions */}
            <View style={[styles.actions, { flexDirection: rowDirection }]}>
              {secondaryAction && (
                <TouchableOpacity
                  style={styles.secondaryButton}
                  onPress={secondaryAction.onPress}
                >
                  <Text style={styles.secondaryButtonText}>
                    {secondaryAction.label}
                  </Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={primaryAction.onPress}
              >
                <Text style={styles.primaryButtonText}>
                  {primaryAction.label}
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
    height: SHEET_HEIGHT,
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
    flex: 1,
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
  content: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  message: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.md,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: semanticRoles.textMuted,
    fontSize: 14,
    fontWeight: '600',
  },
});
