// Auto-generated screen for dsh_captain_profile_get
// Surface: app-captain | Service: dsh
// Operation: GET /api/dsh/captain/profile
// Description: Unified captain profile screen - works across DSH, AMN (no KNZ per policy)

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { getDshCaptainProfile } from '@bthwani/api-clients/dsh/dsh-captain-api';

interface CaptainProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar?: string;
  service_type: 'dsh' | 'amn';
  rating: number;
  total_trips: number;
  join_date: string;
  vehicle_info?: {
    model: string;
    plate_number: string;
    color: string;
  };
  documents_status: {
    id_verified: boolean;
    license_verified: boolean;
    vehicle_verified: boolean;
    background_check: boolean;
  };
  earnings: {
    today: number;
    this_week: number;
    this_month: number;
  };
}

interface AutoDshCaptainProfileGetProps {
  navigation?: any;
}

export const AutoDshCaptainProfileGet: React.FC<AutoDshCaptainProfileGetProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [profile, setProfile] = useState<CaptainProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const d = await getDshCaptainProfile();
      if (!d) throw new Error(t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.loadFail'));
      setProfile({
        id: d.id ?? 'captain_me',
        name: d.name ?? t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.captainLabel'),
        phone: d.phone ?? '',
        email: d.email ?? '',
        service_type: (d.service_type === 'amn' ? d.service_type : 'dsh') as CaptainProfile['service_type'],
        rating: Number(d.rating) ?? 0,
        total_trips: Number(d.total_trips) ?? 0,
        join_date: d.join_date ?? new Date().toISOString().slice(0, 10),
        vehicle_info: d.vehicle_info ?? undefined,
        documents_status: {
          id_verified: Boolean(d.documents_status?.id_verified),
          license_verified: Boolean(d.documents_status?.license_verified),
          vehicle_verified: Boolean(d.documents_status?.vehicle_verified),
          background_check: Boolean(d.documents_status?.background_check),
        },
        earnings: {
          today: Number(d.earnings?.today) ?? 0,
          this_week: Number(d.earnings?.this_week) ?? 0,
          this_month: Number(d.earnings?.this_month) ?? 0,
        },
      });
    } catch (err) {
      setError(t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.errorLoadProfileMessage'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEditProfile = useCallback(() => {
    Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.editComingSoonMessage'), t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.editComingSoonMessage'));
  }, []);

  const handleViewDocuments = useCallback(() => {
    navigation?.navigate('platform_captain_documents_get');
  }, [navigation]);

  const handleViewEarnings = useCallback(() => {
    navigation?.navigate('captain_earnings_history');
  }, [navigation]);

  const handleSupport = useCallback(() => {
    Alert.alert(t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.supportRedirectMessage'), t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.supportRedirectMessage'));
  }, []);

  const getServiceTypeLabel = (type: string) => {
    switch (type) {
      case 'dsh': return t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.modeDeliveryLabel');
      case 'amn': return t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.modeTaxiLabel');
      default: return type;
    }
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'dsh': return BTHWANI_COLORS.primary;
      case 'amn': return colorTokens.success['600']; // Green
      default: return BTHWANI_COLORS.onSurfaceMuted;
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper
        state="loading"
        loadingMessage={t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.loadingMessage')}
        screenName="dsh_captain_profile_get"
        operationName="GET /api/dsh/captain/profile"
      />
    );
  }

  if (error || !profile) {
    return (
      <ScreenWrapper
        state="error"
        errorMessage={error || t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.errorLoadProfileMessageAlt')}
        onErrorAction={loadProfile}
        errorActionText={t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.retryButton')}
        screenName="dsh_captain_profile_get"
        operationName="GET /api/dsh/captain/profile"
      />
    );
  }

  return (
    <ScreenWrapper
      state="content"
      screenName="dsh_captain_profile_get"
      operationName="GET /api/dsh/captain/profile"
    >
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar and Basic Info */}
        <View style={[styles.header, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.avatarContainer}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <View style={styles.basicInfo}>
            <Text style={styles.name}>{profile.name}</Text>
            <Text style={styles.phone}>{profile.phone}</Text>
            <View style={[styles.serviceBadge, { backgroundColor: getServiceTypeColor(profile.service_type) }]}>
              <Text style={styles.serviceText}>{getServiceTypeLabel(profile.service_type)}</Text>
            </View>
          </View>
        </View>

        {/* Rating and Stats */}
        <View style={[styles.statsCard, { flexDirection: 'row', direction: layoutDirection }]}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.rating.toFixed(1)}</Text>
            <Text style={styles.statLabel}>التقييم</Text>
            <View style={[styles.stars, { flexDirection: 'row', direction: layoutDirection }]}>
              {[...Array(5)].map((_, i) => (
                <Text key={i} style={[styles.star, i < Math.floor(profile.rating) ? styles.starFilled : styles.starEmpty]}>
                  ★
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{profile.total_trips}</Text>
            <Text style={styles.statLabel}>إجمالي الرحلات</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>
              {Math.floor((new Date().getTime() - new Date(profile.join_date).getTime()) / (1000 * 60 * 60 * 24))}
            </Text>
            <Text style={styles.statLabel}>يوم معنا</Text>
          </View>
        </View>

        {/* Today's Earnings */}
        <View style={styles.earningsCard}>
          <Text style={styles.sectionTitle}>أرباح اليوم</Text>
          <Text style={styles.earningsAmount}>{profile.earnings.today.toFixed(2)} ريال</Text>
          <TouchableOpacity style={styles.viewEarningsButton} onPress={handleViewEarnings}>
            <Text style={styles.viewEarningsText}>عرض التفاصيل</Text>
          </TouchableOpacity>
        </View>

        {/* Vehicle Info */}
        {profile.vehicle_info && (
          <View style={styles.vehicleCard}>
            <Text style={styles.sectionTitle}>المركبة</Text>
            <View style={styles.vehicleDetails}>
              <Text style={styles.vehicleModel}>{profile.vehicle_info.model}</Text>
              <Text style={styles.vehiclePlate}>رقم اللوحة: {profile.vehicle_info.plate_number}</Text>
              <Text style={styles.vehicleColor}>اللون: {profile.vehicle_info.color}</Text>
            </View>
          </View>
        )}

        {/* Documents Status */}
        <View style={styles.documentsCard}>
          <Text style={styles.sectionTitle}>حالة الوثائق</Text>
          <View style={styles.documentItems}>
            <View style={[styles.documentItem, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.documentLabel}>الهوية الشخصية</Text>
              <View style={[styles.statusIndicator, profile.documents_status.id_verified && styles.statusVerified]}>
                <Text style={[styles.statusText, profile.documents_status.id_verified && styles.statusTextVerified]}>
                  {profile.documents_status.id_verified ? t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.unverifiedLabel') : t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.unverifiedLabel')}
                </Text>
              </View>
            </View>
            <View style={[styles.documentItem, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.documentLabel}>رخصة القيادة</Text>
              <View style={[styles.statusIndicator, profile.documents_status.license_verified && styles.statusVerified]}>
                <Text style={[styles.statusText, profile.documents_status.license_verified && styles.statusTextVerified]}>
                  {profile.documents_status.license_verified ? t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.unverifiedLabelAlt') : t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.unverifiedLabelAlt')}
                </Text>
              </View>
            </View>
            <View style={[styles.documentItem, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.documentLabel}>المركبة</Text>
              <View style={[styles.statusIndicator, profile.documents_status.vehicle_verified && styles.statusVerified]}>
                <Text style={[styles.statusText, profile.documents_status.vehicle_verified && styles.statusTextVerified]}>
                  {profile.documents_status.vehicle_verified ? t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.unverifiedLabelAlt2') : t('dsh.app-captain.mobile.auto_dsh_captain_profile_get.unverifiedLabelAlt2')}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.viewDocumentsButton} onPress={handleViewDocuments}>
            <Text style={styles.viewDocumentsText}>عرض جميع الوثائق</Text>
          </TouchableOpacity>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEditProfile}>
            <Text style={styles.actionButtonText}>تعديل الملف</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.actionButton, styles.supportButton]} onPress={handleSupport}>
            <Text style={styles.supportButtonText}>الدعم والمساعدة</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.surfaceSubtle,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BTHWANI_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.lg,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.surface,
  },
  basicInfo: {
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: 2,
  },
  phone: {
    fontSize: 16,
    color: BTHWANI_COLORS.primary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  serviceBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  serviceText: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: BTHWANI_COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceSubtle,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.primary,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  stars: {
    flexDirection: 'row',
  },
  star: {
    fontSize: 14,
    marginHorizontal: 1,
  },
  starFilled: {
    color: colorTokens.warning['400'],
  },
  starEmpty: {
    color: BTHWANI_COLORS.surfaceSubtle,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    marginHorizontal: BTHWANI_SPACING.contentH,
  },
  earningsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: BTHWANI_COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceSubtle,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  earningsAmount: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colorTokens.success['600'],
    marginBottom: BTHWANI_SPACING.md,
  },
  viewEarningsButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
  },
  viewEarningsText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  vehicleCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: BTHWANI_COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceSubtle,
  },
  vehicleDetails: {
    gap: BTHWANI_SPACING.sm,
  },
  vehicleModel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  vehiclePlate: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  vehicleColor: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
  },
  documentsCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    margin: BTHWANI_SPACING.md,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    shadowColor: BTHWANI_COLORS.onSurface,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surfaceSubtle,
  },
  documentItems: {
    marginBottom: BTHWANI_SPACING.md,
  },
  documentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.surfaceSubtle,
  },
  documentLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurface,
  },
  statusIndicator: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: BTHWANI_COLORS.error,
  },
  statusVerified: {
    backgroundColor: colorTokens.success['600'],
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: BTHWANI_COLORS.surface,
  },
  statusTextVerified: {
    color: BTHWANI_COLORS.surface,
  },
  viewDocumentsButton: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  viewDocumentsText: {
    color: BTHWANI_COLORS.onSurface,
    fontSize: 14,
    fontWeight: '600',
  },
  actionsContainer: {
    padding: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
  },
  actionButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  actionButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  supportButton: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: BTHWANI_COLORS.surface,
  },
  supportButtonText: {
    color: BTHWANI_COLORS.onSurface,
  },
});

export default AutoDshCaptainProfileGet;

