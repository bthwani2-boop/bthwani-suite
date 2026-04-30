// Auto-generated screen for platform_captain_profile_get
// Surface: app-captain | Service: platform
// Operation: GET /api/platform/captain/profile
// Description: Unified captain profile screen - works across DSH and AMN captain types (no KNZ per policy)

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { useCaptainProfileDisplay } from '../../../mobile/app-captain/CaptainProfileDisplayContext';
import { buildPlatformCaptainProfileGetMock, type CaptainProfile } from '../../fixtures/captainProfileGet';

interface AutoPlatformCaptainProfileGetProps {
  navigation?: any;
  route?: {
    params?: {
      service_mode?: 'DSH' | 'AMN';
    };
  };
}

export const AutoPlatformCaptainProfileGet: React.FC<AutoPlatformCaptainProfileGetProps> = ({
  navigation,
  route
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const { setDisplayProfile } = useCaptainProfileDisplay();
  const [profile, setProfile] = useState<CaptainProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [serviceMode, setServiceMode] = useState<'DSH' | 'AMN'>('DSH');

  useEffect(() => {
    // Get service mode from route params or determine from captain type
    const mode = route?.params?.service_mode || 'DSH';
    setServiceMode(mode);

    loadProfile();
  }, [route]);

  const loadProfile = useCallback(async () => {
    try {
      setIsLoading(true);

      const profileData = buildPlatformCaptainProfileGetMock(t, serviceMode);
      setProfile(profileData);
      setDisplayProfile(profileData.name, profileData.rating, 'فضّي');
    } catch (error) {
      Alert.alert(
        'خطأ',
        t('surfaces.فشل_في_تحميل_الملف_الشخصي'),
        [{ text: 'موافق' }]
      );
    } finally {
      setIsLoading(false);
    }
  }, [serviceMode]);

  const getServiceDisplayName = (mode: string) => {
    switch (mode) {
      case 'DSH': return '🚚 توصيل وتسوق';
      case 'AMN': return '🚕 تاكسي للنساء';
      default: return mode;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return BTHWANI_COLORS.success;
      case 'inactive': return BTHWANI_COLORS.warning;
      case 'suspended': return BTHWANI_COLORS.error;
      default: return BTHWANI_COLORS.textSecondary;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'نشط';
      case 'inactive': return t('surfaces.غير_نشط');
      case 'suspended': return 'معلق';
      default: return status;
    }
  };

  if (isLoading) {
    return (
      <ScreenWrapper>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>جاري تحميل الملف الشخصي...</Text>
        </View>
      </ScreenWrapper>
    );
  }

  if (!profile) {
    return (
      <ScreenWrapper>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>لم يتم العثور على الملف الشخصي</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadProfile}>
            <Text style={styles.retryButtonText}>إعادة المحاولة</Text>
          </TouchableOpacity>
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{profile.name.charAt(0)}</Text>
          </View>
          <Text style={styles.name}>{profile.name}</Text>
          <Text style={styles.service}>{getServiceDisplayName(profile.service_mode)}</Text>
          <View style={[styles.statusBadge, { backgroundColor: getStatusColor(profile.status) }]}>
            <Text style={styles.statusText}>{getStatusText(profile.status)}</Text>
          </View>
        </View>

        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>الإحصائيات</Text>
          <View style={[styles.statsGrid, { flexDirection: 'row', direction: layoutDirection }]}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profile.rating}</Text>
              <Text style={styles.statLabel}>التقييم</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profile.total_trips}</Text>
              <Text style={styles.statLabel}>إجمالي الرحلات</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{profile.completed_trips}</Text>
              <Text style={styles.statLabel}>مكتملة</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>
                {((profile.completed_trips / profile.total_trips) * 100).toFixed(1)}%
              </Text>
              <Text style={styles.statLabel}>معدل النجاح</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>المعلومات الشخصية</Text>
          <View style={styles.infoCard}>
            <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.infoLabel}>رقم الهاتف:</Text>
              <Text style={styles.infoValue}>{profile.phone}</Text>
            </View>
            {profile.email && (
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.infoLabel}>البريد الإلكتروني:</Text>
                <Text style={styles.infoValue}>{profile.email}</Text>
              </View>
            )}
            <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
              <Text style={styles.infoLabel}>تاريخ الانضمام:</Text>
              <Text style={styles.infoValue}>
                {new Date(profile.join_date).toLocaleDateString('ar-SA')}
              </Text>
            </View>
            {profile.specialization && (
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.infoLabel}>التخصص:</Text>
                <Text style={styles.infoValue}>{profile.specialization}</Text>
              </View>
            )}
            {profile.vehicle_type && (
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.infoLabel}>نوع المركبة:</Text>
                <Text style={styles.infoValue}>{profile.vehicle_type}</Text>
              </View>
            )}
            {profile.license_expiry && (
              <View style={[styles.infoRow, { flexDirection: 'row', direction: layoutDirection }]}>
                <Text style={styles.infoLabel}>انتهاء الرخصة:</Text>
                <Text style={styles.infoValue}>
                  {new Date(profile.license_expiry).toLocaleDateString('ar-SA')}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.actionsSection}>
          <TouchableOpacity style={styles.editButton} onPress={() => {
            Alert.alert(t('platform.app-captain.mobile.auto_platform_captain_profile_get.profileEditComingSoon'), t('platform.app-captain.mobile.auto_platform_captain_profile_get.profileEditComingSoon'));
          }}>
            <Text style={styles.editButtonText}>تعديل الملف الشخصي</Text>
          </TouchableOpacity>
        </View>
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
    padding: BTHWANI_SPACING.contentH,
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
    marginBottom: BTHWANI_SPACING.md,
  },
  retryButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
  },
  retryButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surface,
    marginBottom: BTHWANI_SPACING.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: BTHWANI_COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.surface,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  service: {
    fontSize: 16,
    color: BTHWANI_COLORS.textSecondary,
    marginBottom: BTHWANI_SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  statsSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: BTHWANI_COLORS.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: BTHWANI_COLORS.primary,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statLabel: {
    fontSize: 12,
    color: BTHWANI_COLORS.textSecondary,
    textAlign: 'center',
  },
  infoSection: {
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  infoCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    shadowColor: BTHWANI_COLORS.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: BTHWANI_COLORS.border,
  },
  infoLabel: {
    fontSize: 14,
    color: BTHWANI_COLORS.textSecondary,
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: BTHWANI_COLORS.text,
    fontWeight: '600',
  },
  actionsSection: {
    padding: BTHWANI_SPACING.md,
  },
  editButton: {
    backgroundColor: BTHWANI_COLORS.primary,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
  },
  editButtonText: {
    color: BTHWANI_COLORS.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoPlatformCaptainProfileGet;
