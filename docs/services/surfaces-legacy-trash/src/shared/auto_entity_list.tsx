// BTHWANI Unified Entity List Screen — Zero-Noise Unification for all entity lists (DSH, AMN, KNZ, ARB, ESF, MRF)
// WAVE 8: Layout direction (start/end) from useI18n().isRTL only; entityHeader, locationRow, metaRow, statsContainer, headerContent use direction (ltr/rtl) + row. Same for all screens.

import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import {
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

// Unified Types Import
import { rawFetch } from '@bthwani/api-clients';
import {
  UnifiedEntity,
  EntityDomain,
  EntityFilter,
  EntityStats,
} from '@bthwani/domain-types/entity-types';

import {
  getDomainConfig,
  getEntityTypeForDomain,
} from '@bthwani/domain-types/entity-config';

// import { useEntityList } from '@bthwani/states/entity-hooks';

interface AutoEntityListProps {
  navigation?: any;
  route?: {
    params?: {
      domain: EntityDomain;
      filters?: EntityFilter;
      title?: string;
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

export const AutoEntityList: React.FC<AutoEntityListProps> = ({
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();

  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const routeParams = route?.params;
  const domain = routeParams?.domain || 'dsh';
  const initialFilters = routeParams?.filters || {};
  const customTitle = routeParams?.title;

  // Unified Hooks (TEMPORARILY DISABLED - fetch() removed from domain-types)
  // const { entities, isLoading, error, hasMore, loadMore, refetch, stats } = useEntityList(domain, initialFilters);

  // Temporary mock implementation
  const entities: UnifiedEntity[] = [];
  const isLoading = false;
  const error = null;
  const hasMore = false;
  const loadMore = async () => {};
  const refetch = async () => {};
  const stats = null;

  const statusoptions = useMemo(
    () => [
      {
        key: 'all',
        label: t('shared.auto_entity_list.filterAll'),
        count: entities.length,
      },
      {
        key: 'pending',
        label: t('shared.auto_entity_list.filterPending'),
        count: entities.filter(e => e.status === 'pending').length,
      },
      {
        key: 'accepted',
        label: t('shared.auto_entity_list.filterAccepted'),
        count: entities.filter(e => e.status === 'accepted').length,
      },
      {
        key: 'completed',
        label: t('shared.auto_entity_list.filterCompleted'),
        count: entities.filter(e => e.status === 'completed').length,
      },
    ],
    [t, entities]
  );

  // Local State
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Configuration
  const config = getDomainConfig(domain);
  const entityType = getEntityTypeForDomain(domain);
  const primaryColor = config.primaryColor ?? BTHWANI_COLORS.primary;
  const secondaryColor = config.secondaryColor ?? BTHWANI_COLORS.surfaceVariant;
  const displayName =
    config.displayName ?? config.label ?? config.name.toUpperCase();
  const domainIcon = config.icon ?? config.label ?? config.name.toUpperCase();
  const statusLabels = config.statusLabels ?? {};

  const filteredEntities = useMemo(() => {
    if (selectedStatus === 'all') return entities;
    return entities.filter(entity => entity.status === selectedStatus);
  }, [entities, selectedStatus]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  const handleEntityPress = (entity: UnifiedEntity) => {
    navigation?.navigate('entity_details', {
      entityId: entity.id,
      domain,
      entity,
    });
  };

  const handleStatusFilterPress = (status: string) => {
    setSelectedStatus(status);
  };

  const renderStatusFilter = () => {
    return (
      <View style={styles.statusFilterContainer}>
        <FlatList
          horizontal
          data={statusoptions}
          keyExtractor={item => item.key}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.statusFilterButton,
                selectedStatus === item.key && {
                  backgroundColor: primaryColor,
                },
              ]}
              onPress={() => handleStatusFilterPress(item.key)}
            >
              <Text
                style={[
                  styles.statusFilterText,
                  selectedStatus === item.key && {
                    color: BTHWANI_COLORS.white,
                  },
                ]}
              >
                {item.label} ({item.count})
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.statusFilterList}
        />
      </View>
    );
  };

  const renderEntityItem = ({ item }: { item: UnifiedEntity }) => {
    const isCompleted = item.status === 'completed';
    const isPending = item.status === 'pending';

    return (
      <TouchableOpacity
        style={[styles.entityCard, isCompleted && styles.completedCard]}
        onPress={() => handleEntityPress(item)}
        activeOpacity={0.7}
      >
        <View
          style={[
            styles.entityHeader,
            { flexDirection: 'row', direction: layoutDirection },
          ]}
        >
          <View style={styles.entityInfo}>
            <Text style={styles.entityId}>#{item.id}</Text>
            <Text style={styles.customerName}>{item.customerName}</Text>
          </View>
          <View style={styles.entityMeta}>
            <Text style={[styles.statusBadge, getStatusStyle(item.status)]}>
              {statusLabels[item.status || ''] || item.status}
            </Text>
            {item.totalAmount && (
              <Text style={styles.amountText}>
                {item.totalAmount} {t('shared.auto_entity_list.amountSuffix')}
              </Text>
            )}
          </View>
        </View>

        <View style={styles.entityDetails}>
          {item.pickupLocation && (
            <View
              style={[
                styles.locationRow,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <Text style={styles.locationLabel}>
                {t('shared.auto_entity_list.locationFrom')}
              </Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {item.pickupLocation.address}
              </Text>
            </View>
          )}

          {item.deliveryLocation && (
            <View
              style={[
                styles.locationRow,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <Text style={styles.locationLabel}>
                {t('shared.auto_entity_list.locationTo')}
              </Text>
              <Text style={styles.locationText} numberOfLines={1}>
                {item.deliveryLocation.address}
              </Text>
            </View>
          )}

          <View
            style={[
              styles.metaRow,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            {item.distanceKm && (
              <Text style={styles.metaText}>
                📍 {item.distanceKm} {t('shared.auto_entity_list.unitKm')}
              </Text>
            )}
            {item.createdAt && (
              <Text style={styles.metaText}>
                🕐 {new Date(item.createdAt).toLocaleDateString('ar-SA')}
              </Text>
            )}
            {item.estimatedCompletionTime && (
              <Text style={styles.metaText}>
                ⏱️{' '}
                {new Date(item.estimatedCompletionTime).toLocaleTimeString(
                  'ar-SA',
                  {
                    hour: '2-digit',
                    minute: '2-digit',
                  }
                )}
              </Text>
            )}
          </View>
        </View>

        {item.items && item.items.length > 0 && (
          <View style={styles.itemsPreview}>
            <Text style={styles.itemsText}>
              📦 {item.items.length} {t('shared.auto_entity_list.productLabel')}
              {item.items.length > 1 &&
                ` (${item.items.reduce((sum, item) => sum + (item.quantity || 1), 0)} ${t('shared.auto_entity_list.pieceLabel')})`}
            </Text>
          </View>
        )}

        {isPending && (
          <View style={styles.actionHint}>
            <Text style={styles.actionHintText}>
              {t('shared.auto_entity_list.actionHintText')}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const getStatusStyle = (status: string) => {
    // Using semantic tokens instead of raw hex colors (P1-2 fix)
    const styles = {
      pending: {
        backgroundColor: semanticRoles.stateWarning.background,
        color: semanticRoles.stateWarning.icon,
      },
      accepted: {
        backgroundColor: semanticRoles.stateInfo.background,
        color: semanticRoles.stateInfo.icon,
      },
      picked_up: {
        backgroundColor: semanticRoles.stateInfo.background,
        color: semanticRoles.stateInfo.icon,
      },
      delivered: {
        backgroundColor: semanticRoles.stateInfo.background,
        color: semanticRoles.stateInfo.icon,
      },
      completed: {
        backgroundColor: semanticRoles.stateInfo.background,
        color: semanticRoles.stateInfo.icon,
      },
      cancelled: {
        backgroundColor: semanticRoles.stateError.background,
        color: semanticRoles.stateError.icon,
      },
      rejected: {
        backgroundColor: semanticRoles.stateError.background,
        color: semanticRoles.stateError.icon,
      },
      disputed: {
        backgroundColor: semanticRoles.stateWarning.background,
        color: semanticRoles.stateWarning.icon,
      },
    };
    return (
      styles[status as keyof typeof styles] || {
        backgroundColor: semanticRoles.surfaceSubtle,
        color: semanticRoles.textMuted,
      }
    );
  };

  const renderStats = () => {
    if (!stats) return null;

    return (
      <View
        style={[
          styles.statsContainer,
          { flexDirection: 'row', direction: layoutDirection },
        ]}
      >
        <View style={[styles.statCard, { backgroundColor: secondaryColor }]}>
          <Text style={styles.statNumber}>{stats.total}</Text>
          <Text style={styles.statLabel}>
            {t('shared.auto_entity_list.statTotal')}
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: semanticRoles.stateWarning.background },
          ]}
        >
          <Text style={styles.statNumber}>{stats.pending}</Text>
          <Text style={styles.statLabel}>
            {t('shared.auto_entity_list.statPending')}
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: semanticRoles.stateInfo.background },
          ]}
        >
          <Text style={styles.statNumber}>{stats.active}</Text>
          <Text style={styles.statLabel}>
            {t('shared.auto_entity_list.statActive')}
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            { backgroundColor: semanticRoles.stateInfo.background },
          ]}
        >
          <Text style={styles.statNumber}>{stats.completed}</Text>
          <Text style={styles.statLabel}>
            {t('shared.auto_entity_list.statCompleted')}
          </Text>
        </View>
      </View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.domainIcon}>{domainIcon}</Text>
      <Text style={styles.emptyTitle}>
        {t('shared.auto_entity_list.emptyTitle', { displayName })}
      </Text>
      <Text style={styles.emptySubtitle}>
        {selectedStatus === 'all'
          ? t('shared.auto_entity_list.emptySubtitleAll', { displayName })
          : t('shared.auto_entity_list.emptySubtitleFiltered', { displayName })}
      </Text>
      <TouchableOpacity
        style={[styles.refreshButton, { backgroundColor: primaryColor }]}
        onPress={handleRefresh}
      >
        <Text style={styles.refreshButtonText}>
          {t('shared.auto_entity_list.refreshButtonText')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorContainer}>
      <Text style={styles.errorIcon}>⚠️</Text>
      <Text style={styles.errorTitle}>
        {t('shared.auto_entity_list.errorTitle')}
      </Text>
      <Text style={styles.errorText}>{error}</Text>
      <TouchableOpacity
        style={[styles.retryButton, { backgroundColor: primaryColor }]}
        onPress={handleRefresh}
      >
        <Text style={styles.retryButtonText}>
          {t('shared.auto_entity_list.retryButtonText')}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenWrapper>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: secondaryColor }]}>
        <View
          style={[
            styles.headerContent,
            { flexDirection: 'row', direction: layoutDirection },
          ]}
        >
          <Text style={styles.domainIcon}>{domainIcon}</Text>
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>
              {customTitle || `${displayName}`}
            </Text>
            <Text style={styles.headerSubtitle}>
              {filteredEntities.length} {t('shared.auto_entity_list.countOf')}{' '}
              {entities.length}
            </Text>
          </View>
        </View>
      </View>

      {/* Stats */}
      {renderStats()}

      {/* Status Filter */}
      {renderStatusFilter()}

      {/* Entity List */}
      {error ? (
        renderErrorState()
      ) : (
        <FlatList
          data={filteredEntities}
          keyExtractor={item => item.id}
          renderItem={renderEntityItem}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[primaryColor]}
              tintColor={primaryColor}
            />
          }
          onEndReached={hasMore ? loadMore : undefined}
          onEndReachedThreshold={0.5}
          ListEmptyComponent={!isLoading ? renderEmptyState() : null}
          ListFooterComponent={
            hasMore ? (
              <View style={styles.loadingMore}>
                <Text style={styles.loadingMoreText}>
                  {t('shared.auto_entity_list.loadingMoreText')}
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Loading Overlay */}
      {isLoading && entities.length === 0 && (
        <View style={styles.loadingOverlay}>
          <Text style={styles.loadingText}>
            {t('shared.auto_entity_list.loadingText', { displayName })}
          </Text>
        </View>
      )}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.border,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  domainIcon: {
    fontSize: 32,
    marginEnd: BTHWANI_SPACING.md,
  },
  headerText: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: BTHWANI_COLORS.textPrimary,
  },
  headerSubtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.white,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.textPrimary,
  },
  statLabel: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    marginTop: 2,
  },
  statusFilterContainer: {
    backgroundColor: BTHWANI_COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.border,
  },
  statusFilterList: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
  },
  statusFilterButton: {
    backgroundColor: BTHWANI_COLORS.gray50,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.full,
    marginEnd: BTHWANI_SPACING.sm,
  },
  statusFilterText: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.textSecondary,
  },
  listContainer: {
    padding: BTHWANI_SPACING.md,
  },
  entityCard: {
    backgroundColor: BTHWANI_COLORS.white,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    ...CARD_SHADOW,
  },
  completedCard: {
    opacity: 0.7,
  },
  entityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  entityInfo: {
    flex: 1,
  },
  entityId: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    marginBottom: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
  },
  entityMeta: {
    alignItems: 'flex-end',
  },
  statusBadge: {
    fontSize: 10,
    fontWeight: '600',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
    marginBottom: BTHWANI_SPACING.xs,
  },
  amountText: {
    fontSize: 14,
    fontWeight: '700',
    color: BTHWANI_COLORS.primary,
  },
  entityDetails: {
    marginBottom: BTHWANI_SPACING.md,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  locationLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.textSecondary,
    width: 30,
    marginEnd: BTHWANI_SPACING.sm,
  },
  locationText: {
    fontSize: 12,
    color: BTHWANI_COLORS.textPrimary,
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: BTHWANI_SPACING.sm,
  },
  metaText: {
    fontSize: 11,
    color: BTHWANI_COLORS.textSecondary,
  },
  itemsPreview: {
    backgroundColor: BTHWANI_COLORS.gray50,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  itemsText: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
  },
  actionHint: {
    backgroundColor: semanticRoles.stateWarning.background,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
    marginTop: BTHWANI_SPACING.sm,
  },
  actionHintText: {
    fontSize: 12,
    color: semanticRoles.stateWarning.icon,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.textPrimary,
    textAlign: 'center',
    marginTop: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  refreshButton: {
    marginTop: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  refreshButtonText: {
    color: BTHWANI_COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: BTHWANI_SPACING.md,
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.error,
    marginBottom: BTHWANI_SPACING.sm,
  },
  errorText: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: BTHWANI_SPACING.lg,
  },
  retryButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: BTHWANI_COLORS.surfaceOverlay90,
  },
  loadingText: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
  },
  loadingMore: {
    paddingVertical: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  loadingMoreText: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
  },
});
