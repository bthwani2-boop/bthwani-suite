// Auto-generated screen for arb_bookings_list
// Surface: app-client | Service: arb
// Generated from Master SCREENS CATALOG
// §30 States: Loading/Empty/Error/Success

import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { resolveDevMediaUrl } from '../../../config';
import { buildArbBookingsListMock } from '../../hooks';

interface auto_arb_bookings_listProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void };
}

export const auto_arb_bookings_list: React.FC<auto_arb_bookings_listProps> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  useEffect(() => {
    // Backend integration call
    const loadBookings = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate different states
        const mockSuccess = 0 > 0.1; // 90% success rate
        const mockHasBookings = 0 > 0.2; // 80% have bookings

        if (!mockSuccess) {
          setState('error');
        } else if (!mockHasBookings) {
          setState('empty');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadBookings();
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const bookings = useMemo(
    () => buildArbBookingsListMock(t, resolveDevMediaUrl),
    [t, resolveDevMediaUrl]
  );

  const renderBookingItem = ({ item }: { item: typeof bookings[number] }) => (
    <TouchableOpacity
      style={[styles.bookingItem, { flexDirection: 'row', direction: layoutDirection }]}
      onPress={() => handleNavigate('ArbBookingGet')}
      activeOpacity={0.8}
    >
      {item.imageUrl ? (
        <Image source={{ uri: item.imageUrl }} style={styles.bookingImage} resizeMode="cover" />
      ) : (
        <View style={[styles.bookingImage, { justifyContent: 'center', alignItems: 'center', backgroundColor: semanticRoles.surfaceSubtle }]}>
          <Text style={{ fontSize: 28 }}>🏠</Text>
        </View>
      )}
      <View style={styles.bookingInfo}>
        <View style={[styles.bookingHeader, { flexDirection: 'row', direction: layoutDirection }]}>
          <Text style={styles.property} numberOfLines={1}>
            {item.property}
          </Text>
          <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>
        <Text style={styles.dates}>
          {item.checkIn} - {item.checkOut}
        </Text>
        <Text style={styles.price}>{item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case t('arb.app-client.mobile.auto_arb_bookings_list.confirmed'): return { backgroundColor: semanticRoles.success };
      case t('arb.app-client.mobile.auto_arb_bookings_list.underReview'): return { backgroundColor: semanticRoles.primaryCTA };
      case t('arb.app-client.mobile.auto_arb_bookings_list.completed'): return { backgroundColor: semanticRoles.textMuted };
      case t('arb.app-client.mobile.auto_arb_bookings_list.cancelled'): return { backgroundColor: semanticRoles.error };
      default: return { backgroundColor: semanticRoles.textMuted };
    }
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <View style={styles.container}>
          <View style={[styles.titleRow, { flexDirection: 'row', direction: layoutDirection }]}>
            <Text style={styles.title}>{t('arb.app-client.mobile.auto_arb_bookings_list.title')}</Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => handleNavigate('ArbBookingCreate')}>
              <Text style={styles.primaryButtonText}>{t('arb.app-client.mobile.auto_arb_bookings_list.primaryButtonText')}</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={bookings}
            keyExtractor={(item) => item.id}
            renderItem={renderBookingItem}
            contentContainerStyle={styles.listContainer}
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('arb.app-client.mobile.auto_arb_bookings_list.loadingMessage')}
      emptyMessage={t('arb.app-client.mobile.auto_arb_bookings_list.noBookingsYet')}
      emptyActionText={t('arb.app-client.mobile.auto_arb_bookings_list.searchOffers')}
      onEmptyAction={() => handleNavigate('ArbOffersSearch')}
      errorMessage={t('arb.app-client.mobile.auto_arb_bookings_list.errorLoadMessage')}
      onErrorAction={handleRetry}
      successMessage={t('arb.app-client.mobile.auto_arb_bookings_list.successMessage')}
      successActionText={t('arb.app-client.mobile.auto_arb_bookings_list.viewBookings')}
      onSuccessAction={() => setState('content')}
      screenName="auto_arb_bookings_list"
      operationName="arb_bookings_list"
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
    color: semanticRoles.onSurface,
    textAlign: 'center',
  },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  primaryButtonText: {
    color: semanticRoles.textInverse,
    fontSize: 14,
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.lg,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  bookingItem: {
    flexDirection: 'row',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  bookingImage: {
    width: 96,
    height: 80,
    borderRadius: BTHWANI_RADIUS.md,
    marginStart: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  bookingInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  property: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  dates: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  price: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
});

export default auto_arb_bookings_list;

