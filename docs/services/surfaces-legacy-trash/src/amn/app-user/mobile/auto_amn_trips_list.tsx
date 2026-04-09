// Auto-generated screen for amn_trips_list
// Surface: app-client | Service: amn
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { buildAmnTripsListMock, type AmnTripListItem } from '../../hooks';

interface auto_amn_trips_listProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_amn_trips_list: React.FC<auto_amn_trips_listProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');

  const handleNavigate = (screen: string, params?: { tripId?: string }) => {
    if (navigation?.navigate) {
      if (params?.tripId) {
        (navigation as { navigate: (s: string, p?: object) => void }).navigate(
          screen,
          params
        );
      } else {
        navigation.navigate(screen);
      }
    } else if (onNavigate) onNavigate(screen);
  };

  useEffect(() => {
    // Backend integration call
    const loadTrips = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate different states
        const mockSuccess = 0 > 0.2; // 80% success rate
        const mockHasTrips = 0 > 0.1; // 90% have trips

        if (!mockSuccess) {
          setState('error');
        } else if (!mockHasTrips) {
          setState('empty');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadTrips();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const trips = useMemo(() => buildAmnTripsListMock(t), [t]);

  const renderTripItem = ({ item }: { item: AmnTripListItem }) => (
    <TouchableOpacity
      style={styles.tripItem}
      onPress={() => handleNavigate('AmnTripGet', { tripId: item.id })}
    >
      <View style={styles.tripInfo}>
        <Text style={styles.destination}>{item.destination}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
        <Text style={styles.statusText}>{item.status}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case t('amn.app-client.mobile.auto_amn_trips_list.completed'):
        return { backgroundColor: semanticRoles.success };
      case t('amn.app-client.mobile.auto_amn_trips_list.inProgress'):
        return { backgroundColor: semanticRoles.primaryCTA };
      case t('amn.app-client.mobile.auto_amn_trips_list.cancelled'):
        return { backgroundColor: semanticRoles.error };
      default:
        return { backgroundColor: semanticRoles.textMuted };
    }
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <View style={[styles.titleRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.title}>{t('amn.app-client.mobile.auto_amn_trips_list.title')}</Text>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={() => handleNavigate('AmnTripCreate')}
            >
              <Text style={styles.primaryButtonText}>{t('amn.app-client.mobile.auto_amn_trips_list.primaryButtonText')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={trips}
            keyExtractor={item => item.id}
            renderItem={renderTripItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_trips_list.loadingMessage')}
      emptyMessage={t('amn.app-client.mobile.auto_amn_trips_list.noTripsYet')}
      emptyActionText={t('amn.app-client.mobile.auto_amn_trips_list.newTripRequest')}
      onEmptyAction={() => handleNavigate('AmnTripCreate')}
      errorMessage={t('amn.app-client.mobile.auto_amn_trips_list.errorLoadMessage')}
      onErrorAction={handleRetry}
      successMessage={t('amn.app-client.mobile.auto_amn_trips_list.successMessage')}
      successActionText={t('amn.app-client.mobile.auto_amn_trips_list.viewTrips')}
      onSuccessAction={() => setState('content')}
      screenName='auto_amn_trips_list'
      operationName='amn_trips_list'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.sm,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  primaryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  tripItem: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tripItemMain: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  reportButton: {
    marginTop: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    alignItems: 'flex-end',
  },
  reportButtonText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  tripInfo: {
    flex: 1,
  },
  destination: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  date: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
});

export default auto_amn_trips_list;

