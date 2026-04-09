/**
 * ARB Partner Bookings List — arb_partner_bookings_list
 * Surface: app-partner | Service: arb
 * Operation: POST /api/arb/partner/bookings/list
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to view booking details
 * - 1 tap to activate/approve/assign booking
 * - Full states: Loading/Error/Empty/Offline/Success
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { resolveDevMediaUrl } from '../../../config';

interface AutoArbPartnerBookingsListProps {
  navigation?: any;
}

type ArbBookingStatus = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled' | 'rejected';
interface ArbPartnerBooking {
  id: string;
  booking_reference?: string;
  customer_name?: string;
  status?: ArbBookingStatus;
  total_amount?: number;
  created_at?: string;
  service_type?: string;
  booking_date?: string;
  image_url?: string;
}

type FilterTab = 'all' | 'pending' | 'completed';

export const AutoArbPartnerBookingsList: React.FC<AutoArbPartnerBookingsListProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [bookings, setBookings] = useState<ArbPartnerBooking[]>([]);
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const loadBookings = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setIsOffline(false);

      // const data = await getPartnerBookingsList();
      // Backend integration call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setBookings([
        {
          id: '1',
          booking_reference: 'ARB-2024-001',
          customer_name: t('arb.app-partner.mobile.auto_arb_partner_bookings_list.mockPassengerName'),
          status: 'pending',
          total_amount: 150.00,
          created_at: new Date().toISOString(),
          service_type: t('arb.app-partner.mobile.auto_arb_partner_bookings_list.cleaningService'),
          booking_date: '2024-01-15',
          image_url: resolveDevMediaUrl('products/arb/prod_0001.jpg') || undefined,
        },
        {
          id: '2',
          booking_reference: 'ARB-2024-002',
          customer_name: t('arb.app-partner.mobile.auto_arb_partner_bookings_list.mockProviderName'),
          status: 'confirmed',
          total_amount: 250.00,
          created_at: new Date().toISOString(),
          service_type: t('arb.app-partner.mobile.auto_arb_partner_bookings_list.maintenanceService'),
          booking_date: '2024-01-16',
          image_url: resolveDevMediaUrl('products/arb/prod_0002.jpg') || undefined,
        },
        {
          id: '3',
          booking_reference: 'ARB-2024-003',
          customer_name: t('arb.app-partner.mobile.auto_arb_partner_bookings_list.mockPartnerName'),
          status: 'completed',
          total_amount: 320.00,
          created_at: new Date().toISOString(),
          service_type: t('arb.app-partner.mobile.auto_arb_partner_bookings_list.installation'),
          booking_date: '2024-01-14',
          image_url: resolveDevMediaUrl('products/arb/prod_0003.jpg') || undefined,
        },
      ] as ArbPartnerBooking[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('arb.app-partner.mobile.auto_arb_partner_bookings_list.errorLoadMessage');
      setError(errorMessage);
      
      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        setIsOffline(true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadBookings();
  }, [loadBookings]);

  const handleRefresh = useCallback(() => {
    loadBookings(true);
  }, [loadBookings]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '0.00';
    return amount.toFixed(2);
  };

  const getStatusColor = (status?: ArbBookingStatus): string => {
    // Using semantic tokens instead of raw hex colors (P1-2 fix)
    switch (status) {
      case 'pending': return semanticRoles.stateWarning.icon;
      case 'confirmed': return semanticRoles.stateInfo.icon;
      case 'in_progress': return semanticRoles.stateInfo.icon;
      case 'completed': return semanticRoles.stateInfo.icon;
      case 'cancelled': return semanticRoles.stateError.icon;
      case 'rejected': return semanticRoles.stateError.icon;
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status?: ArbBookingStatus): string => {
    switch (status) {
      case 'pending': return t('surfaces.arb_status_pending_short');
      case 'confirmed': return t('surfaces.arb_status_confirmed');
      case 'in_progress': return t('surfaces.arb_status_in_progress');
      case 'completed': return t('surfaces.arb_status_completed');
      case 'cancelled': return t('surfaces.arb_status_cancelled');
      case 'rejected': return t('surfaces.arb_status_rejected');
      default: return t('surfaces.arb_status_unspecified');
    }
  };

  const filteredBookings = useMemo(() => {
    if (filterTab === 'all') return bookings;
    if (filterTab === 'pending') return bookings.filter(b => b.status === 'pending' || b.status === 'confirmed' || b.status === 'in_progress');
    return bookings.filter(b => b.status === 'completed' || b.status === 'cancelled' || b.status === 'rejected');
  }, [bookings, filterTab]);

  const getPrimaryActionScreen = (booking: ArbPartnerBooking): string => {
    switch (booking.status) {
      case 'pending': return 'arb_bookings_bookingId_activate_post';
      case 'confirmed': return 'arb_bookings_bookingId_approve_post';
      case 'in_progress': return 'arb_bookings_bookingId_verify_post';
      case 'completed': return 'arb_bookings_bookingId_rate_post';
      default: return 'arb_bookings_bookingId_verify_post';
    }
  };

  const getPrimaryActionLabel = (booking: ArbPartnerBooking): string => {
    switch (booking.status) {
      case 'pending': return t('surfaces.arb_activate_button');
      case 'confirmed': return t('surfaces.arb_approve_title');
      case 'in_progress': return t('surfaces.arb_verify_execution');
      case 'completed': return t('surfaces.arb_rate_title');
      default: return t('surfaces.arb_view_details');
    }
  };

  const handleBookingPress = (booking: ArbPartnerBooking) => {
    const screen = getPrimaryActionScreen(booking);
    navigation?.navigate(screen, { bookingId: booking.id, booking });
  };

  const renderBookingCard = ({ item: booking }: { item: ArbPartnerBooking }) => {
    const statusColor = getStatusColor(booking.status);
    const statusText = getStatusText(booking.status);
    const imageUrl = booking.image_url || resolveDevMediaUrl('products/arb/prod_0001.jpg') || '';

    return (
      <TouchableOpacity
        style={styles.bookingCard}
        onPress={() => handleBookingPress(booking)}
        activeOpacity={0.7}
      >
        <View style={styles.cardRow}>
          {imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.cardImage} resizeMode="cover" />
          ) : (
            <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
              <Text style={styles.cardImageEmoji}>📋</Text>
            </View>
          )}
          <View style={styles.cardBody}>
            <View style={styles.cardHeader}>
              <Text style={styles.customerName} numberOfLines={1}>{booking.customer_name || t('surfaces.arb_client')}</Text>
              <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.statusText}>{statusText}</Text>
              </View>
            </View>
            {booking.booking_reference && (
              <Text style={styles.referenceValue}>{booking.booking_reference}</Text>
            )}
            {booking.service_type && (
              <Text style={styles.serviceValue}>{booking.service_type}</Text>
            )}
            <Text style={styles.amountValue}>{formatAmount(booking.total_amount)} ر.س</Text>
          </View>
        </View>
        <TouchableOpacity
          style={styles.primaryCta}
          onPress={() => handleBookingPress(booking)}
          activeOpacity={0.8}
        >
          <Text style={styles.primaryCtaText}>{getPrimaryActionLabel(booking)}</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  // Loading State
  if (isLoading && !isRefreshing) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('surfaces.arb_loading_bookings')}
        screenName="auto_arb_partner_bookings_list"
        operationName="arb_partner_bookings_list"
      />
    );
  }

  // Offline State
  if (isOffline) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={t('errors.offline')}
        errorActionText={t('common.retry')}
        onErrorAction={handleRefresh}
        screenName="auto_arb_partner_bookings_list"
        operationName="arb_partner_bookings_list"
      />
    );
  }

  // Error State
  if (error && !isRefreshing) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error}
        errorActionText={t('common.retry')}
        onErrorAction={handleRefresh}
        screenName="auto_arb_partner_bookings_list"
        operationName="arb_partner_bookings_list"
      />
    );
  }

  // Empty State (no data at all) — single CTA, calm copy
  if (bookings.length === 0) {
    return (
      <ScreenWrapper
        state="empty"
        emptyMessage={t('surfaces.arb_empty_bookings')}
        emptyActionText={t('common.refresh')}
        onEmptyAction={handleRefresh}
        screenName="auto_arb_partner_bookings_list"
        operationName="arb_partner_bookings_list"
      />
    );
  }

  // Success/Content State — Final design: hero + calm hierarchy + single CTA per card
  const tabs: { key: FilterTab; label: string }[] = [
    { key: 'all', label: t('surfaces.arb_filter_all') },
    { key: 'pending', label: t('surfaces.arb_filter_pending') },
    { key: 'completed', label: t('surfaces.arb_filter_complete') },
  ];
  const pendingCount = bookings.filter(b => ['pending', 'confirmed', 'in_progress'].includes(b.status || '')).length;
  const completedCount = bookings.filter(b => ['completed', 'cancelled', 'rejected'].includes(b.status || '')).length;

  return (
    <ScreenWrapper
      state="content"
      screenName="auto_arb_partner_bookings_list"
      operationName="arb_partner_bookings_list"
    >
      <View style={styles.container}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>{t('surfaces.arb_my_bookings')}</Text>
          <Text style={styles.heroSummary}>
            {pendingCount > 0 && t('surfaces.arb_partner_summary_pending', { count: pendingCount })}
            {pendingCount > 0 && completedCount > 0 && ' · '}
            {completedCount > 0 && t('surfaces.arb_partner_summary_done', { count: completedCount })}
            {pendingCount === 0 && completedCount === 0 && t('surfaces.arb_partner_summary_count', { count: bookings.length })}
          </Text>
        </View>
        <View style={styles.filterTabs}>
          {tabs.map(({ key, label }) => (
            <TouchableOpacity
              key={key}
              style={[styles.filterTab, filterTab === key && styles.filterTabActive]}
              onPress={() => setFilterTab(key)}
            >
              <Text style={[styles.filterTabText, filterTab === key && styles.filterTabTextActive]}>{label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <FlatList
          data={filteredBookings}
          renderItem={renderBookingCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, filteredBookings.length === 0 && styles.listContentEmpty]}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[BTHWANI_COLORS.primary]}
              tintColor={BTHWANI_COLORS.primary}
            />
          }
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            filteredBookings.length === 0 ? (
              <View style={styles.filterEmpty}>
                <Text style={styles.filterEmptyText}>{t('surfaces.arb_empty_filter')}</Text>
              </View>
            ) : null
          }
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  hero: {
    paddingVertical: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
    letterSpacing: 0.2,
  },
  heroSummary: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  listContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  listContentEmpty: {
    flexGrow: 1,
  },
  filterTabs: {
    flexDirection: 'row',
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  filterTab: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    backgroundColor: 'transparent',
  },
  filterTabActive: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  filterTabText: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '600',
  },
  filterEmpty: {
    padding: BTHWANI_SPACING.contentH,
    alignItems: 'center',
  },
  filterEmptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  bookingCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.md,
  },
  cardImage: {
    width: 88,
    height: 88,
    borderRadius: BTHWANI_RADIUS.md,
    marginStart: BTHWANI_SPACING.md,
  },
  cardImagePlaceholder: {
    backgroundColor: semanticRoles.surfaceSubtle,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImageEmoji: {
    fontSize: 32,
  },
  cardBody: {
    flex: 1,
    justifyContent: 'space-between',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  customerName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
  referenceValue: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  serviceValue: {
    fontSize: 12,
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.xs,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
    marginTop: BTHWANI_SPACING.xs,
  },
  primaryCta: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xs,
  },
  primaryCtaText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 15,
    fontWeight: '600',
  },
});

export default AutoArbPartnerBookingsList;
