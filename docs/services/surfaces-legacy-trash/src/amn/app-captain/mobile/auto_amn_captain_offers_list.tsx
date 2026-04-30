// Auto-generated screen for amn_captain_offers_list
// Surface: app-captain | Service: amn
// Operation: GET /api/amn/captain/offers
// Description: List trip offers for AMN captain - Perfect UX with minimum clicks

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { getAmnCaptainOffers } from '@bthwani/api-clients/amn/amn-captain-offers-api';

interface Offer {
  id: string;
  trip_id: string;
  passenger_name?: string;
  passenger_phone?: string;
  pickup_location: string;
  dropoff_location: string;
  status: 'pending' | 'accepted' | 'rejected' | 'expired';
  estimated_fare?: number;
  distance_km?: number;
  estimated_duration?: number;
  requested_at: string;
}

interface AutoAmnCaptainOffersListProps {
  navigation?: any;
}

export const AutoAmnCaptainOffersList: React.FC<
  AutoAmnCaptainOffersListProps
> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [hasActiveTrip, setHasActiveTrip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadOffers = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      const { hasActiveTrip: hasActive, offers: rawOffers } =
        await getAmnCaptainOffers();

      setHasActiveTrip(hasActive);
      const mapped: Offer[] = (rawOffers ?? []).map((o: any) => ({
        id: o.id || o.trip_id,
        trip_id: o.trip_id || o.id,
        passenger_name: o.passenger_name ?? t('amn.captain.offersList.passengerDefault'),
        passenger_phone: o.passenger_phone,
        pickup_location:
          typeof o.pickup_location === 'string'
            ? o.pickup_location
            : o.pickup_location?.lat != null
              ? `موقع (${Number(o.pickup_location.lat).toFixed(4)}, ${Number(o.pickup_location.lng).toFixed(4)})`
              : '—',
        dropoff_location:
          typeof o.dropoff_location === 'string'
            ? o.dropoff_location
            : o.dropoff_location?.lat != null
              ? `موقع (${Number(o.dropoff_location.lat).toFixed(4)}, ${Number(o.dropoff_location.lng).toFixed(4)})`
              : '—',
        status: 'pending',
        estimated_fare: o.estimated_fare,
        requested_at: o.requested_pickup_time || new Date().toISOString(),
      }));
      setOffers(mapped);
    } catch (err: any) {
      setError(err?.message || t('amn.captain.offersList.loadError'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadOffers();
  }, [loadOffers]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return semanticRoles.stateWarning.icon;
      case 'accepted':
        return semanticRoles.stateSuccess.icon;
      case 'rejected':
        return semanticRoles.stateError.icon;
      case 'expired':
        return semanticRoles.textMuted;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('amn.captain.offersList.statusPending');
      case 'accepted':
        return t('amn.captain.offersList.statusAccepted');
      case 'rejected':
        return t('amn.captain.offersList.statusRejected');
      case 'expired':
        return t('amn.captain.offersList.statusExpired');
      default:
        return status;
    }
  };

  const handleOfferPress = (offer: Offer) => {
    if (navigation) {
      navigation.navigate('amn_captain_offer_respond', {
        offerId: offer.id,
        tripId: offer.trip_id,
        pickup_location: offer.pickup_location,
        dropoff_location: offer.dropoff_location,
        estimated_fare: offer.estimated_fare,
        passenger_name: offer.passenger_name,
        passenger_phone: offer.passenger_phone,
        distance_km: offer.distance_km,
        estimated_duration: offer.estimated_duration,
      });
    }
  };

  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper state='loading' loadingMessage={t('amn.captain.offersList.loading')} />
    );
  }

  if (error) {
    return (
      <ScreenWrapper
        state='error'
        errorMessage={error}
        errorActionText={t('amn.captain.offersList.retry')}
        onErrorAction={() => loadOffers()}
      />
    );
  }

  if (offers.length === 0 && !hasActiveTrip) {
    return (
      <ScreenWrapper state='empty' emptyMessage={t('amn.captain.offersList.emptyMessage')} />
    );
  }

  if (hasActiveTrip) {
    return (
      <ScreenWrapper state='content'>
        <SafeAreaView style={styles.container}>
          <View style={styles.onTripBlock}>
            <Text style={styles.onTripTitle}>{t('amn.captain.offersList.onTripTitle')}</Text>
            <Text style={styles.onTripMessage}>
              {t('amn.captain.offersList.onTripMessage')}
            </Text>
            <TouchableOpacity
              style={styles.onTripCta}
              onPress={() => navigation?.navigate?.('amn_captain_trip_assigned_get')}
              activeOpacity={0.8}
            >
              <Text style={styles.onTripCtaText}>{t('amn.captain.offersList.viewMyTrip')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.onTripRefresh}
              onPress={() => loadOffers(true)}
              activeOpacity={0.8}
            >
              <Text style={styles.onTripRefreshText}>{t('amn.captain.offersList.refreshAfterTrip')}</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper state='content'>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>🚕 {t('amn.captain.offersList.title')}</Text>
          <Text style={styles.subtitle}>{t('amn.captain.offersList.offersCount', { count: offers.length })}</Text>
        </View>

        <FlatList
          data={offers}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.offerCard}
              onPress={() => handleOfferPress(item)}
              activeOpacity={0.7}
            >
              <View style={[styles.cardHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>
                    {item.passenger_name}
                  </Text>
                  {item.passenger_phone && (
                    <Text style={styles.passengerPhone}>
                      {item.passenger_phone}
                    </Text>
                  )}
                </View>
                <View
                  style={[
                    styles.statusBadge,
                    { backgroundColor: getStatusColor(item.status) },
                  ]}
                >
                  <Text style={styles.statusText}>
                    {getStatusText(item.status)}
                  </Text>
                </View>
              </View>

              <View style={styles.routeContainer}>
                <View style={[styles.locationRow, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.locationLabel}>{t('amn.captain.offersList.from')}</Text>
                  <Text style={styles.locationText} numberOfLines={1}>
                    {item.pickup_location}
                  </Text>
                </View>
                <View style={[styles.locationRow, { flexDirection: 'row', direction: layoutDirection }]}>
                  <Text style={styles.locationLabel}>{t('amn.captain.offersList.to')}</Text>
                  <Text style={styles.locationText} numberOfLines={1}>
                    {item.dropoff_location}
                  </Text>
                </View>
              </View>

              <View style={[styles.detailsRow, { flexDirection: 'row', direction: layoutDirection }]}>
                {item.distance_km != null && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('amn.captain.offersList.distance')}</Text>
                    <Text style={styles.detailValue}>{item.distance_km != null ? t('amn.captain.offersList.distanceKm', { value: String(item.distance_km) }) : ''}</Text>
                  </View>
                )}
                {item.estimated_duration != null && (
                  <View style={styles.detailItem}>
                    <Text style={styles.detailLabel}>{t('amn.captain.offersList.duration')}</Text>
                    <Text style={styles.detailValue}>{item.estimated_duration != null ? t('amn.captain.offersList.durationMinutes', { value: String(item.estimated_duration) }) : ''}</Text>
                  </View>
                )}
                <View style={styles.detailItem}>
                  <Text style={styles.detailLabel}>{t('amn.captain.offersList.fare')}</Text>
                  <Text style={[styles.detailValue, styles.fareValue]}>
                    {item.estimated_fare != null ? t('amn.captain.offersList.fareSar', { value: String(item.estimated_fare) }) : '—'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>{t('amn.captain.offersList.emptyMessage')}</Text>
            </View>
          }
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadOffers(true)}
              colors={[semanticRoles.primaryCTA]}
            />
          }
          contentContainerStyle={styles.listContent}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  onTripBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  onTripTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
    textAlign: 'center',
  },
  onTripMessage: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    lineHeight: 24,
  },
  onTripCta: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  onTripCtaText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  onTripRefresh: {
    paddingVertical: BTHWANI_SPACING.sm,
  },
  onTripRefreshText: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  loadingText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  errorText: {
    fontSize: 16,
    color: semanticRoles.stateError.text,
    marginBottom: BTHWANI_SPACING.lg,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  retryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: BTHWANI_SPACING.md,
  },
  offerCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.md,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  passengerPhone: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  routeContainer: {
    marginBottom: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  locationRow: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.xs,
  },
  locationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginEnd: BTHWANI_SPACING.sm,
    minWidth: 40,
  },
  locationText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    flex: 1,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: BTHWANI_SPACING.md,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  fareValue: {
    color: semanticRoles.primaryCTA,
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: BTHWANI_SPACING.xxl,
  },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
});

export default AutoAmnCaptainOffersList;

