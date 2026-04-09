// BTHWANI Unified Entity Details Screen
// Zero-Noise Unification: Single screen for all entity details across DSH, AMN, KNZ, ARB, ESF, MRF

import React, { useMemo, useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Linking,
  Dimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import {
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import {
  UnifiedEntity,
  EntityDomain,
  EntityAction,
  EntityLocation,
  EntityItem,
} from '@bthwani/domain-types/entity-types';

import {
  getDomainConfig,
  getEntityTypeForDomain,
  getAllowedActions,
  getUIComponent,
} from '@bthwani/domain-types/entity-config';

// import { useEntity, useEntityAction, useEntityRealtime } from '@bthwani/states/entity-hooks';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface AutoEntityDetailsProps {
  navigation?: any;
  route?: {
    params?: {
      entityId: string;
      domain: EntityDomain;
      entity?: UnifiedEntity;
    };
  };
}

const CARD_SHADOW = {
  shadowColor: '#0F172A',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.08,
  shadowRadius: 8,
  elevation: 2,
} as const;

export const AutoEntityDetails: React.FC<AutoEntityDetailsProps> = ({
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const routeParams = route?.params;
  const entityId = routeParams?.entityId || 'unknown';
  const domain = routeParams?.domain || 'dsh';
  const passedEntity = routeParams?.entity;

  // Unified Hooks (TEMPORARILY DISABLED - fetch() removed from domain-types)
  // const { entity: loadedEntity, isLoading, error, refetch } = useEntity(domain, entityId, !passedEntity);
  // const { execute: executeAction, isExecuting } = useEntityAction(domain, entityId);
  // const { updates: realtimeUpdates, isConnected } = useEntityRealtime(domain, entityId);

  // Temporary mock implementation
  const loadedEntity = passedEntity || null;
  const isLoading = false;
  const error = null;
  const refetch = async () => {};
  const executeAction = async (_action: EntityAction) => ({
    success: false,
    message: t('shared.auto_entity_details.entityHooksNot'),
  });
  const isExecuting = false;
  const realtimeUpdates: any[] = [];
  const isConnected = false;

  // Local State
  const [currentEntity, setCurrentEntity] = useState<UnifiedEntity | null>(
    passedEntity || null
  );

  // Configuration
  const config = getDomainConfig(domain);
  const allowedActions = getAllowedActions(domain);
  const primaryColor = config.primaryColor ?? BTHWANI_COLORS.primary;
  const secondaryColor = config.secondaryColor ?? BTHWANI_COLORS.surfaceVariant;
  const displayName =
    config.displayName ?? config.label ?? config.name.toUpperCase();
  const domainIcon = config.icon ?? config.label ?? config.name.toUpperCase();
  const statusLabels = config.statusLabels ?? {};

  useEffect(() => {
    if (loadedEntity) {
      setCurrentEntity(loadedEntity);
    }
  }, [loadedEntity]);

  useEffect(() => {
    if (realtimeUpdates.length > 0) {
      // Update entity with real-time data
      setCurrentEntity(prev =>
        prev ? { ...prev, ...realtimeUpdates[0] } : null
      );
    }
  }, [realtimeUpdates]);

  const handleAction = async (action: EntityAction) => {
    if (!currentEntity) return;

    const result = await executeAction(action);

    if (result.success) {
      Alert.alert(
        t('shared.auto_entity_details.successMessage'),
        result.message,
        [
          {
            text: t('common.ok'),
            onPress: () => {
              // Navigate to next screen based on action
              const nextScreen = getNextScreenForAction(action);
              if (nextScreen) {
                navigation?.navigate(nextScreen, {
                  entityId: currentEntity.id,
                  domain,
                  entity: currentEntity,
                });
              } else {
                refetch(); // Refresh data
              }
            },
          },
        ]
      );
    } else {
      Alert.alert(t('shared.auto_entity_details.errorMessage'), result.message);
    }
  };

  const getNextScreenForAction = (action: EntityAction): string | null => {
    const actionMap: Partial<Record<EntityAction, string>> = {
      accept: 'entity_accept',
      pickup: 'entity_pickup',
      deliver: 'entity_deliver',
      track: 'entity_track',
      rate: 'entity_rate',
      complete: 'entity_complete',
      start: 'entity_start',
      inspect: 'entity_inspect',
      dispute: 'entity_dispute',
      resolve: 'entity_resolve',
      reject: 'entity_reject',
      cancel: 'entity_cancel',
    };
    return actionMap[action] || null;
  };

  const handleCallCustomer = () => {
    if (currentEntity?.customerPhone) {
      Linking.openURL(`tel:${currentEntity.customerPhone}`);
    }
  };

  const renderLocation = (location: EntityLocation, title: string) => (
    <View style={styles.locationCard}>
      <Text style={styles.locationTitle}>{title}</Text>
      <Text style={styles.locationAddress}>{location.address}</Text>
      {location.contactName && (
        <Text style={styles.locationContact}>
          {t('shared.auto_entity_details.contactNameLabel')}{' '}
          {location.contactName}
        </Text>
      )}
      {location.contactPhone && (
        <Text style={styles.locationContact}>
          {t('shared.auto_entity_details.contactPhoneLabel')}{' '}
          {location.contactPhone}
        </Text>
      )}
      {location.instructions && (
        <Text style={styles.locationInstructions}>{location.instructions}</Text>
      )}
    </View>
  );

  const renderItems = (items: EntityItem[]) => (
    <View style={styles.itemsCard}>
      <Text style={styles.sectionTitle}>
        {t('shared.auto_entity_details.productsTitle')}
      </Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.itemInfo}>
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemDetails}>
              {item.quantity &&
                `${t('shared.auto_entity_details.quantityLabel')} ${item.quantity}`}
              {item.description && ` - ${item.description}`}
            </Text>
          </View>
          {item.price && (
            <Text style={styles.itemPrice}>
              {item.price} {t('shared.auto_entity_details.currencySuffix')}
            </Text>
          )}
        </View>
      ))}
    </View>
  );

  const renderStatusBadge = (status: string) => {
    // Using semantic tokens instead of raw hex colors (P1-2 fix)
    const statusColors: Record<string, string> = {
      pending: semanticRoles.stateWarning.icon, // Warning state
      accepted: semanticRoles.stateInfo.icon, // Info state (navy)
      picked_up: semanticRoles.stateInfo.icon, // Info state (navy)
      delivered: semanticRoles.stateInfo.icon, // Info state (navy)
      completed: semanticRoles.stateInfo.icon, // Info state (navy)
      cancelled: semanticRoles.stateError.icon, // Error state (orangeDark)
      rejected: semanticRoles.stateError.icon, // Error state (orangeDark)
      disputed: semanticRoles.stateWarning.icon, // Warning state
      active: semanticRoles.stateInfo.icon, // Info state (navy)
      matched: semanticRoles.stateInfo.icon, // Info state (navy)
    };

    return (
      <View
        style={[
          styles.statusBadge,
          { backgroundColor: statusColors[status] || semanticRoles.textMuted },
        ]}
      >
        <Text style={styles.statusText}>{statusLabels[status] || status}</Text>
      </View>
    );
  };

  const renderActionButtons = () => {
    if (!currentEntity) return null;

    return (
      <View style={styles.actionsContainer}>
        {/* Primary Actions */}
        <View style={styles.primaryActions}>
          {allowedActions.includes('accept') &&
            currentEntity.status === 'pending' && (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: primaryColor },
                ]}
                onPress={() => handleAction('accept')}
                disabled={isExecuting}
              >
                <Text style={styles.primaryButtonText}>
                  {t('shared.auto_entity_details.buttonAccept')}
                </Text>
              </TouchableOpacity>
            )}

          {allowedActions.includes('pickup') &&
            currentEntity.status === 'accepted' && (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: primaryColor },
                ]}
                onPress={() => handleAction('pickup')}
                disabled={isExecuting}
              >
                <Text style={styles.primaryButtonText}>
                  {t('shared.auto_entity_details.buttonPickup')}
                </Text>
              </TouchableOpacity>
            )}

          {allowedActions.includes('deliver') &&
            currentEntity.status === 'picked_up' && (
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  { backgroundColor: primaryColor },
                ]}
                onPress={() => handleAction('deliver')}
                disabled={isExecuting}
              >
                <Text style={styles.primaryButtonText}>
                  {t('shared.auto_entity_details.buttonDeliver')}
                </Text>
              </TouchableOpacity>
            )}
        </View>

        {/* Secondary Actions */}
        <View style={styles.secondaryActions}>
          {allowedActions.includes('track') && (
            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={() => handleAction('track')}
            >
              <Text style={styles.secondaryButtonText}>
                {t('shared.auto_entity_details.buttonTrack')}
              </Text>
            </TouchableOpacity>
          )}

          {allowedActions.includes('rate') &&
            ['delivered', 'completed'].includes(currentEntity.status) && (
              <TouchableOpacity
                style={styles.secondaryButton}
                onPress={() => handleAction('rate')}
              >
                <Text style={styles.secondaryButtonText}>
                  {t('shared.auto_entity_details.buttonRate')}
                </Text>
              </TouchableOpacity>
            )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={handleCallCustomer}
          >
            <Text style={styles.secondaryButtonText}>
              {t('shared.auto_entity_details.buttonCall')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>
            {t('shared.auto_entity_details.loadingText')}
          </Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (error || !currentEntity) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>
            {error || t('surfaces.فشل_في_تحميل_تفاصيل_الكيان')}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={refetch}>
            <Text style={styles.retryButtonText}>
              {t('shared.auto_entity_details.retryButtonText')}
            </Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: secondaryColor }]}>
          <Text style={styles.domainIcon}>{domainIcon}</Text>
          <View style={styles.headerInfo}>
            <Text style={styles.entityType}>{displayName}</Text>
            <Text style={styles.entityId}>#{currentEntity.id}</Text>
          </View>
          {renderStatusBadge(currentEntity.status || 'pending')}
        </View>

        {/* Customer Info */}
        <View style={styles.customerCard}>
          <Text style={styles.sectionTitle}>
            {t('shared.auto_entity_details.customerInfoTitle')}
          </Text>
          <Text style={styles.customerName}>
            {currentEntity.customerName ||
              `${displayName} #${currentEntity.id}`}
          </Text>
          {currentEntity.customerPhone ? (
            <Text style={styles.customerPhone}>
              {currentEntity.customerPhone}
            </Text>
          ) : null}
          {currentEntity.customerEmail && (
            <Text style={styles.customerEmail}>
              {currentEntity.customerEmail}
            </Text>
          )}
        </View>

        {/* Locations */}
        {currentEntity.pickupLocation &&
          renderLocation(
            currentEntity.pickupLocation,
            t('surfaces.مكان_الاستلام')
          )}
        {currentEntity.deliveryLocation &&
          renderLocation(
            currentEntity.deliveryLocation,
            t('surfaces.مكان_التسليم')
          )}

        {/* Items */}
        {currentEntity.items &&
          currentEntity.items.length > 0 &&
          renderItems(currentEntity.items)}

        {/* Business Info */}
        <View style={styles.businessCard}>
          <Text style={styles.sectionTitle}>
            {t('shared.auto_entity_details.operationDetailsTitle')}
          </Text>

          {currentEntity.restaurantName && (
            <View style={styles.businessRow}>
              <Text style={styles.businessLabel}>
                {t('shared.auto_entity_details.restaurantLabel')}
              </Text>
              <Text style={[styles.businessValue, textAlignStart]}>
                {currentEntity.restaurantName}
              </Text>
            </View>
          )}

          {currentEntity.serviceType && (
            <View style={styles.businessRow}>
              <Text style={styles.businessLabel}>
                {t('shared.auto_entity_details.serviceTypeLabel')}
              </Text>
              <Text style={[styles.businessValue, textAlignStart]}>
                {currentEntity.serviceType}
              </Text>
            </View>
          )}

          {currentEntity.vehicleType && (
            <View style={styles.businessRow}>
              <Text style={styles.businessLabel}>
                {t('shared.auto_entity_details.vehicleTypeLabel')}
              </Text>
              <Text style={[styles.businessValue, textAlignStart]}>
                {currentEntity.vehicleType}
              </Text>
            </View>
          )}

          {currentEntity.totalAmount && (
            <View style={styles.businessRow}>
              <Text style={styles.businessLabel}>
                {t('shared.auto_entity_details.totalAmountLabel')}
              </Text>
              <Text style={[styles.businessAmount, textAlignStart]}>
                {currentEntity.totalAmount}{' '}
                {t('shared.auto_entity_details.currencySuffix')}
              </Text>
            </View>
          )}

          {currentEntity.distanceKm && (
            <View style={styles.businessRow}>
              <Text style={styles.businessLabel}>
                {t('shared.auto_entity_details.distanceLabel')}
              </Text>
              <Text style={[styles.businessValue, textAlignStart]}>
                {currentEntity.distanceKm} {t('shared.auto_entity_list.unitKm')}
              </Text>
            </View>
          )}

          {currentEntity.estimatedCompletionTime && (
            <View style={styles.businessRow}>
              <Text style={styles.businessLabel}>
                {t('shared.auto_entity_details.estimatedTimeLabel')}
              </Text>
              <Text style={[styles.businessValue, textAlignStart]}>
                {currentEntity.estimatedCompletionTime}
              </Text>
            </View>
          )}

          <View style={styles.businessRow}>
            <Text style={styles.businessLabel}>
              {t('shared.auto_entity_details.createdAtLabel')}
            </Text>
            <Text style={[styles.businessValue, textAlignStart]}>
              {currentEntity.createdAt
                ? new Date(currentEntity.createdAt).toLocaleString('ar-SA')
                : t('shared.auto_delivery_action.notAvailable')}
            </Text>
          </View>
        </View>

        {/* Real-time Status */}
        {isConnected && (
          <View style={styles.realtimeCard}>
            <Text style={styles.realtimeTitle}>
              🔴 {t('shared.auto_entity_details.realtimeTitle')}
            </Text>
            {realtimeUpdates.length > 0 && (
              <Text style={styles.realtimeUpdate}>
                {t('shared.auto_entity_details.lastUpdateLabel')}{' '}
                {new Date(realtimeUpdates[0].timestamp).toLocaleTimeString(
                  isRTL ? 'ar-SA' : 'en-US'
                )}
              </Text>
            )}
          </View>
        )}

        {/* Actions */}
        {renderActionButtons()}

        {/* Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  errorText: {
    fontSize: 16,
    color: BTHWANI_COLORS.error,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  retryButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    marginHorizontal: BTHWANI_SPACING.contentH,
  },
  domainIcon: {
    fontSize: 32,
    marginEnd: BTHWANI_SPACING.md,
  },
  headerInfo: {
    flex: 1,
  },
  entityType: {
    fontSize: 18,
    fontWeight: '700',
    color: BTHWANI_COLORS.textPrimary,
  },
  entityId: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
  },
  statusText: {
    color: BTHWANI_COLORS.white,
    fontSize: 12,
    fontWeight: '600',
  },
  customerCard: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: BTHWANI_SPACING.md,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  customerPhone: {
    fontSize: 14,
    color: BTHWANI_COLORS.primary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  customerEmail: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
  },
  locationCard: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  locationTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  locationAddress: {
    fontSize: 14,
    color: BTHWANI_COLORS.textPrimary,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 20,
  },
  locationContact: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    marginBottom: BTHWANI_SPACING.xs,
  },
  locationInstructions: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    fontStyle: 'italic',
  },
  itemsCard: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.border,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
  },
  itemDetails: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.primary,
  },
  businessCard: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  businessRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
  },
  businessLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    flex: 1,
  },
  businessValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.textPrimary,
    flex: 1,
  },
  businessAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
    flex: 1,
  },
  realtimeCard: {
    backgroundColor: BTHWANI_COLORS.white,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    ...CARD_SHADOW,
  },
  realtimeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: BTHWANI_COLORS.success,
    marginBottom: BTHWANI_SPACING.sm,
  },
  realtimeUpdate: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
  },
  actionsContainer: {
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  primaryActions: {
    marginBottom: BTHWANI_SPACING.md,
  },
  primaryButton: {
    paddingVertical: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: {
    color: BTHWANI_COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  secondaryButton: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.white,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginHorizontal: BTHWANI_SPACING.xs,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.border,
  },
  secondaryButtonText: {
    color: BTHWANI_COLORS.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: BTHWANI_SPACING.xl,
  },
});
