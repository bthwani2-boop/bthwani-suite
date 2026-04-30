// Auto-generated screen for amn_captains_nearby
// Surface: app-captain | Service: amn
// Operation: GET /api/amn/captains/nearby
// Description: Find nearby AMN captains

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface NearbyCaptain {
  id: string;
  name: string;
  distance_km: number;
  rating: number;
  status: 'online' | 'offline' | 'busy';
  vehicle_type: string;
  current_location: {
    latitude: number;
    longitude: number;
  };
}

interface AutoAmnCaptainsNearbyProps {
  navigation?: any;
  route?: {
    params?: {
      latitude?: number;
      longitude?: number;
      radius_km?: number;
    };
  };
}

export const AutoAmnCaptainsNearby: React.FC<AutoAmnCaptainsNearbyProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const [captains, setCaptains] = useState<NearbyCaptain[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadCaptains = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
    } catch (err) {
      setError(t('amn.app-captain.mobile.auto_amn_captains_nearby.loadingMessage'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadCaptains();
  }, [loadCaptains]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return semanticRoles.stateSuccess.icon;
      case 'busy': return semanticRoles.stateWarning.icon;
      case 'offline': return semanticRoles.textMuted;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'online': return t('amn.app-captain.mobile.auto_amn_captains_nearby.available');
      case 'busy': return t('amn.app-captain.mobile.auto_amn_captains_nearby.busy');
      case 'offline': return t('amn.app-captain.mobile.auto_amn_captains_nearby.offline');
      default: return status;
    }
  };

  const renderCaptain = ({ item }: { item: NearbyCaptain }) => (
    <TouchableOpacity
      style={styles.captainCard}
      onPress={() => {
        // Navigate to captain details if needed
      }}
      activeOpacity={0.8}
    >
      <View style={styles.captainHeader}>
        <View style={styles.captainInfo}>
          <Text style={[styles.captainName, textAlignStart]}>{item.name}</Text>
          <Text style={[styles.vehicleType, textAlignStart]}>{item.vehicle_type}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>
      <View style={styles.captainDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>المسافة:</Text>
          <Text style={styles.detailValue}>{item.distance_km.toFixed(1)} كم</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>التقييم:</Text>
          <Text style={styles.detailValue}>⭐ {item.rating.toFixed(1)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return <ScreenWrapper state="loading" loadingMessage={t('amn.app-captain.mobile.auto_amn_captains_nearby.loadingMessage_153')} />;
  }

  if (error) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        onErrorAction={() => loadCaptains()}
      />
    );
  }

  if (captains.length === 0) {
    return (
      <ScreenWrapper state="content">
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>{t('amn.app-captain.mobile.auto_amn_captains_nearby.emptyTitle')}</Text>
          <TouchableOpacity style={styles.backLink} onPress={() => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home'))}>
            <Text style={styles.backLinkText}>← رجوع</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, textAlignStart]}>{t('amn.app-captain.mobile.auto_amn_captains_nearby.headerTitle')}</Text>
          <Text style={[styles.headerSubtitle, textAlignStart]}>
            تم العثور على {captains.length} كابتن
          </Text>
          <TouchableOpacity style={styles.backLinkHeader} onPress={() => (typeof navigation?.goBack === 'function' ? navigation.goBack() : navigation?.navigate?.('Home'))}>
            <Text style={styles.backLinkText}>← رجوع</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={captains}
          renderItem={renderCaptain}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadCaptains(true)} />
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyTitle: {
    fontSize: 18,
    color: semanticRoles.text,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  backLink: {
    padding: BTHWANI_SPACING.md,
  },
  backLinkHeader: {
    alignSelf: 'flex-end',
    paddingTop: BTHWANI_SPACING.xs,
  },
  backLinkText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  header: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  list: {
    padding: BTHWANI_SPACING.md,
  },
  captainCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  captainInfo: {
    flex: 1,
  },
  captainName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  vehicleType: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: colorTokens.surface.primary,
    fontSize: 12,
    fontWeight: '600',
  },
  captainDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: BTHWANI_SPACING.sm,
    paddingTop: BTHWANI_SPACING.sm,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginStart: BTHWANI_SPACING.xs,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
});

export default AutoAmnCaptainsNearby;
