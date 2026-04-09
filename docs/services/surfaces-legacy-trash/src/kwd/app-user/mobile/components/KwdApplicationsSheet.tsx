/**
 * KWD Applications Sheet
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * Bottom Sheet for listing user's job applications
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { KwdBottomSheet } from './KwdBottomSheet';
import { rawFetch } from '@bthwani/api-clients';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

interface JobApplication {
  id: string;
  applicationId?: string;
  job: {
    id: string;
    title: string;
    company?: string;
    location?: string;
  };
  status: 'pending' | 'contacted' | 'accepted' | 'rejected' | 'completed' | 'under_review' | 'shortlisted' | 'interviewed' | 'offered' | 'withdrawn';
  appliedAt?: string;
  lastUpdated?: string;
}

interface KwdApplicationsSheetProps {
  visible: boolean;
  onClose: () => void;
  onApplicationPress: (applicationId: string, jobId: string) => void;
}

export const KwdApplicationsSheet: React.FC<KwdApplicationsSheetProps> = ({
  visible,
  onClose,
  onApplicationPress,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);
  const [loading, setLoading] = useState(true);

  const filtertabs = useMemo(
    () => [
      { id: 'all', label: t('kwd.app-client.mobile.components.KwdApplicationsSheet.all') },
      { id: 'pending', label: t('kwd.app-client.mobile.components.KwdApplicationsSheet.underReview') },
      { id: 'accepted', label: t('kwd.app-client.mobile.components.KwdApplicationsSheet.accepted') },
      { id: 'completed', label: t('kwd.app-client.mobile.components.KwdApplicationsSheet.completed') },
      { id: 'rejected', label: t('kwd.app-client.mobile.components.KwdApplicationsSheet.rejected') },
    ],
    [t]
  );
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState<string | null>(null);

  const loadApplications = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const baseUrl = getBaseUrl();
      const url = `${baseUrl}/api/kwd/applications/me`;

      const response = await rawFetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || t('surfaces.failedToLoadApplications'));
      }

      const appsData = json?.data?.applications || json?.data || [];
      const transformedApps: JobApplication[] = appsData.map((app: any) => ({
        id: app.id || app.applicationId,
        applicationId: app.applicationId || app.id,
        job: {
          id: app.job?.id || '',
          title: app.job?.title || t('kwd.app-client.mobile.components.KwdApplicationsSheet.noAddress'),
          company: app.job?.company?.name || app.job?.company,
          location: app.job?.location || app.location,
        },
        status: (app.status || 'pending') as JobApplication['status'],
        appliedAt: app.appliedAt || app.createdAt,
        lastUpdated: app.lastUpdated || app.updatedAt,
      }));

      setApplications(transformedApps);
    } catch (err: any) {
      setError(err.message || t('surfaces.failedToLoadRequests'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (visible) {
      loadApplications();
    }
  }, [visible, loadApplications]);

  const filteredApplications = statusFilter === 'all'
    ? applications
    : applications.filter(app => app.status === statusFilter);

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending':
      case 'under_review':
        return semanticRoles.warning;
      case 'contacted':
      case 'shortlisted':
      case 'interviewed':
        return semanticRoles.info;
      case 'offered':
      case 'accepted':
        return semanticRoles.success;
      case 'rejected':
        return semanticRoles.error;
      case 'completed':
        return semanticRoles.textMuted;
      case 'withdrawn':
        return semanticRoles.textMuted;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string): string => {
    const statusMap: Record<string, string> = {
      pending: t('surfaces.statusPending'),
      under_review: t('surfaces.statusUnderReview'),
      contacted: t('surfaces.statusContacted'),
      shortlisted: t('surfaces.statusShortlisted'),
      interviewed: t('surfaces.statusInterviewed'),
      offered: t('surfaces.statusOffered'),
      accepted: t('surfaces.statusAccepted'),
      rejected: t('surfaces.statusRejected'),
      completed: t('surfaces.statusCompleted'),
      withdrawn: t('surfaces.statusWithdrawn'),
    };
    return statusMap[status] || status;
  };

  const formatDate = (dateString?: string): string => {
    if (!dateString) return t('surfaces.unspecified');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  };

  const renderApplication = ({ item }: { item: JobApplication }) => (
    <TouchableOpacity
      style={styles.applicationCard}
      onPress={() => onApplicationPress(item.id, item.job.id)}
      activeOpacity={0.7}
      accessibilityLabel={item.job.title}
      accessibilityRole="button"
    >
      <View style={[styles.applicationHeader, { direction: layoutDirection }]}>
        <Text style={[styles.jobTitle, textAlignStart]} numberOfLines={2}>
          {item.job.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{getStatusText(item.status)}</Text>
        </View>
      </View>

      {item.job.company && (
        <Text style={[styles.company, textAlignStart]} numberOfLines={1}>
          {item.job.company}
        </Text>
      )}

      {item.appliedAt && (
        <Text style={[styles.date, textAlignStart]}>تم التقديم: {formatDate(item.appliedAt)}</Text>
      )}
    </TouchableOpacity>
  );


  return (
    <KwdBottomSheet
      visible={visible}
      onClose={onClose}
      height="large"
      title={t('kwd.app-client.mobile.components.KwdApplicationsSheet.jobApplications')}
    >
      {/* Filter Tabs */}
      <View style={[styles.filtertabs, { direction: layoutDirection }]}>
        {filtertabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.filterTab,
              statusFilter === tab.id && styles.filterTabActive,
            ]}
            onPress={() => setStatusFilter(tab.id)}
            accessibilityLabel={tab.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: statusFilter === tab.id }}
          >
            <Text
              style={[
                styles.filterTabText,
                statusFilter === tab.id && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={semanticRoles.primaryCTA} />
          <Text style={styles.loadingText}>جاري تحميل الطلبات...</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadApplications} accessibilityLabel={t('common.retry')} accessibilityRole="button">
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : filteredApplications.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>لا توجد طلبات حالياً</Text>
          <Text style={styles.emptySubtext}>ابدأ بتصفح الوظائف والتقديم عليها</Text>
        </View>
      ) : (
        <FlatList
          data={filteredApplications}
          renderItem={renderApplication}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </KwdBottomSheet>
  );
};

const styles = StyleSheet.create({
  filtertabs: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  filterTab: {
    flex: 1,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
  },
  filterTabActive: {
    backgroundColor: semanticRoles.primaryCTA,
  },
  filterTabText: {
    fontSize: 12,
    fontWeight: '500',
    color: semanticRoles.text,
  },
  filterTabTextActive: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '700',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  loadingText: {
    marginTop: BTHWANI_SPACING.md,
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: semanticRoles.error,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  retryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  retryButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  listContent: {
    padding: BTHWANI_SPACING.contentH,
  },
  applicationCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  applicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.xs,
  },
  jobTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginEnd: BTHWANI_SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
    color: 'white',
  },
  company: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  date: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
});

