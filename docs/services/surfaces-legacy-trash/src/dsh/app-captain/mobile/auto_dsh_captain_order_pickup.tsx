// Auto-generated screen for dsh_captain_order_pickup
// Surface: app-captain | Service: dsh
// Operation: PUT /api/dsh/orders/:orderId/status (status: in_transit)
// Description: Pickup order from restaurant - One-tap confirmation with verification

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useMemo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { AnimatedCard } from '../../../mobile/components/MicroInteractions';
import { ServiceIcon } from '../../../mobile/components';
import { colorTokens } from '@bthwani/ui-kit';
import { pickupDshCaptainOrder } from '@bthwani/api-clients/dsh/dsh-captain-api';
import { buildOrderPickupFallback, type OrderPickup as Order } from '../../hooks';

interface AutoDshCaptainOrderPickupProps {
  navigation?: any;
  route?: {
    params?: {
      orderId?: string;
      order?: Order;
    };
  };
}

export const AutoDshCaptainOrderPickup: React.FC<AutoDshCaptainOrderPickupProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const [isProcessing, setIsProcessing] = useState(false);
  const orderId = route?.params?.orderId || route?.params?.order?.id || '';
  const order = route?.params?.order;

  const mockOrder: Order = order || buildOrderPickupFallback(t, orderId);

  const handlePickup = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const id = (orderId || mockOrder?.id || '').trim();
      const success = await pickupDshCaptainOrder(id);
      if (!success) throw new Error('فشل في تحديث الحالة');

      Alert.alert(
        t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.confirmTitle'),
        t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.confirmMessage'),
        [
          {
            text: t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.confirmButtonText'),
            onPress: () => {
              navigation?.navigate('dsh_captain_order_deliver', {
                orderId: mockOrder.id,
                order: mockOrder,
              });
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.errorTitle'), t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.errorTitle'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenWrapper state="content">
      <ScrollView style={styles.container}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <ServiceIcon name="inventory" size={64} color={semanticRoles.primaryCTA} />
          </View>
          <Text style={styles.title}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.title')}</Text>
          <Text style={styles.subtitle}>
            تأكد من استلام جميع العناصر من المطعم
          </Text>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>المطعم:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{mockOrder.restaurant_name || mockOrder.pickup_location}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>العميل:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{mockOrder.customer_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>عدد العناصر:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{mockOrder.items_count}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>المبلغ:</Text>
              <Text style={[styles.infoValue, textAlignStart]}>{mockOrder.total_amount.toFixed(2)} ريال</Text>
            </View>
          </View>

          <View style={styles.checklistSection}>
            <Text style={styles.checklistTitle}>قائمة التحقق:</Text>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistIcon}>✓</Text>
              <Text style={styles.checklistText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.checklistText1')}</Text>
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistIcon}>✓</Text>
              <Text style={styles.checklistText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.checklistText2')}</Text>
            </View>
            <View style={styles.checklistItem}>
              <Text style={styles.checklistIcon}>✓</Text>
              <Text style={styles.checklistText}>{t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.checklistText3')}</Text>
            </View>
          </View>

          <AnimatedCard
            style={StyleSheet.flatten([styles.pickupButton, isProcessing && styles.pickupButtonDisabled])}
            onPress={handlePickup}
            disabled={isProcessing}
          >
            <Text style={styles.pickupButtonText}>
              {isProcessing ? t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.submitButtonLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_order_pickup.submitButtonLabel')}
            </Text>
          </AnimatedCard>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  card: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.xl,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xl,
    textAlign: 'center',
  },
  infoSection: {
    backgroundColor: semanticRoles.bg,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.sm,
  },
  checklistSection: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  checklistIcon: {
    fontSize: 18,
    color: semanticRoles.stateSuccess.icon,
    marginStart: BTHWANI_SPACING.sm,
  },
  checklistText: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  pickupButton: {
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    paddingVertical: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    alignItems: 'center',
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  pickupButtonDisabled: {
    opacity: 0.6,
  },
  pickupButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AutoDshCaptainOrderPickup;
