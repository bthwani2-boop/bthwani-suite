// ESF Matches Inbox Screen - Donor Matches (UX Optimized)
// Surface: app-client | Service: esf
// §30 States: Loading / Error / Empty / Success / Content
// UX: 1-click actions, Direct accept/decline on card

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { rawFetch } from '@bthwani/api-clients';
import type { EsfContactMethod } from '../../uiTypes';

function normalizeContactMethod(raw: unknown): EsfContactMethod | undefined {
  if (raw === 'chat') return 'in_app';
  if (raw === 'phone' || raw === 'whatsapp' || raw === 'in_app') return raw;
  return undefined;
}

function parseDistanceKm(raw: unknown): number | undefined {
  const value = Number(raw);
  return Number.isFinite(value) ? value : undefined;
}

function getContactMethodBadge(method?: EsfContactMethod): string | null {
  switch (method) {
    case 'in_app':
      return '💬 دردشة';
    case 'whatsapp':
      return '📱 واتساب';
    case 'phone':
      return '☎️ هاتف';
    default:
      return null;
  }
}

interface DonorMatch {
  id: string;
  requestId: string;
  requestBloodType: string;
  donorName: string;
  donorBloodType: string;
  location: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  matchedAt: string;
  distance?: string;
  distanceKm?: number;
  eta?: string;
  donorRating?: number;
  contactMethod?: EsfContactMethod;
  medicalReasonLabel?: string;
}

interface auto_esf_matches_inboxProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

export const auto_esf_matches_inbox: React.FC<auto_esf_matches_inboxProps> = ({
  onNavigate,
  navigation,
}) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');
  const [refreshing, setRefreshing] = useState(false);
  const [matches, setMatches] = useState<DonorMatch[]>([]);
  const [processingMatch, setProcessingMatch] = useState<string | null>(null);
  const pendingMatches = useMemo(
    () => matches.filter(match => match.status === 'pending'),
    [matches]
  );
  const nearestPendingMatch = useMemo(
    () =>
      pendingMatches.reduce<DonorMatch | null>((closest, current) => {
        if (current.distanceKm === undefined) return closest;
        if (!closest || closest.distanceKm === undefined) return current;
        return current.distanceKm < closest.distanceKm ? current : closest;
      }, null),
    [pendingMatches]
  );
  const headerSummary =
    pendingMatches.length > 0
      ? `${pendingMatches.length} فرصة مطابقة • الأقرب ${nearestPendingMatch?.distance || 'غير محدد'}`
      : 'لا توجد فرص مطابقة تحتاج قرارًا الآن';

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      const nav = navigation?.navigate as
        | ((s: string, p?: object) => void)
        | undefined;
      if (nav) nav(screen, params);
      else if (onNavigate)
        (onNavigate as (s: string, p?: Record<string, unknown>) => void)(
          screen,
          params
        );
    },
    [navigation, onNavigate]
  );

  const loadMatches = useCallback(async () => {
    try {
      setState('loading');

      const response = await rawFetch(
        `${getBaseUrl()}/api/esf/matches/inbox?limit=100&offset=0`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const json = await response.json();
      if (!json?.success) {
        throw new Error(json?.error || 'فشل في تحميل المطابقات');
      }

      // Transform API response to DonorMatch format
      const matchesData = json?.data?.matches || [];
      const transformedMatches: DonorMatch[] = matchesData.map((match: any) => {
        // Format matchedAt timestamp
        let matchedAt = t(
          'esf.app-client.mobile.auto_esf_matches_inbox.nowLabel'
        );
        if (match.matched_at || match.created_at) {
          const matched = new Date(match.matched_at || match.created_at);
          const now = new Date();
          const diffMinutes = Math.floor(
            (now.getTime() - matched.getTime()) / 60000
          );
          if (diffMinutes < 1)
            matchedAt = t(
              'esf.app-client.mobile.auto_esf_matches_inbox.nowLabelAlt'
            );
          else if (diffMinutes < 60) matchedAt = `منذ ${diffMinutes} دقيقة`;
          else if (diffMinutes < 1440)
            matchedAt = `منذ ${Math.floor(diffMinutes / 60)} ساعة`;
          else matchedAt = `منذ ${Math.floor(diffMinutes / 1440)} يوم`;
        }

        const distanceKm = parseDistanceKm(match.distance);

        return {
          id: match.match_id || match.id || `MATCH-${Date.now()}`,
          requestId: match.request_id || match.requestId || '',
          requestBloodType: match.request_blood_type || match.bloodType || 'O+',
          donorName:
            match.donor_name ||
            match.donorName ||
            t('esf.app-client.mobile.auto_esf_matches_inbox.donorLabel'),
          donorBloodType:
            match.donor_blood_type || match.donorBloodType || 'O+',
          location:
            match.location?.address ||
            match.location ||
            t(
              'esf.app-client.mobile.auto_esf_matches_inbox.locationNotSpecified'
            ),
          status: (
            match.status || 'pending'
          ).toLowerCase() as DonorMatch['status'],
          matchedAt,
          distance: distanceKm !== undefined ? `${distanceKm} كم` : undefined,
          distanceKm,
          eta: match.eta ? `${match.eta} دقيقة` : undefined,
          donorRating: match.donor_rating || match.donorRating,
          contactMethod: normalizeContactMethod(
            match.contact_method ||
              match.contactPreference ||
              match.request?.medical_info?.contact_method
          ),
          medicalReasonLabel:
            match.medical_reason_label ||
            match.request?.medical_info?.medical_reason_label ||
            match.medical_reason ||
            undefined,
        };
      });

      setMatches(transformedMatches);
      setState(transformedMatches.length === 0 ? 'empty' : 'content');
    } catch (error) {
      console.error('Failed to load matches:', error);
      setState('error');
    }
  }, []);

  useEffect(() => {
    loadMatches();
  }, [loadMatches]);

  const handleRetry = useCallback(() => {
    loadMatches();
  }, [loadMatches]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadMatches().finally(() => setRefreshing(false));
  }, [loadMatches]);

  // 1-click accept action
  const handleAccept = useCallback(
    async (matchId: string) => {
      if (processingMatch) return;

      setProcessingMatch(matchId);
      try {
        const response = await rawFetch(
          `${getBaseUrl()}/api/esf/matches/${encodeURIComponent(matchId)}/accept`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
          }
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData?.error || `HTTP ${response.status}`);
        }

        const json = await response.json();
        if (!json?.success) {
          throw new Error(json?.error || 'فشل في قبول المطابقة');
        }

        setMatches(prev =>
          prev.map(m =>
            m.id === matchId ? { ...m, status: 'accepted' as const } : m
          )
        );

        // Navigate to match details or chat
        handleNavigate('EsfMatchGet', { matchId });
      } catch (error) {
        console.error('Failed to accept match:', error);
        Alert.alert(
          t('esf.app-client.mobile.auto_esf_matches_inbox.errorTitle'),
          error instanceof Error
            ? error.message
            : t('esf.app-client.mobile.auto_esf_matches_inbox.errorAcceptMessage')
        );
      } finally {
        setProcessingMatch(null);
      }
    },
    [processingMatch, handleNavigate]
  );

  // 1-click decline action
  const handleDecline = useCallback(
    async (matchId: string) => {
      if (processingMatch) return;

      Alert.alert(
        t('esf.app-client.mobile.auto_esf_matches_inbox.declineMatchTitle'),
        t('esf.app-client.mobile.auto_esf_matches_inbox.confirmDeclineMessage'),
        [
          {
            text: t('esf.app-client.mobile.auto_esf_matches_inbox.cancelButton'),
            style: 'cancel',
          },
          {
            text: t('esf.app-client.mobile.auto_esf_matches_inbox.declineButton'),
            style: 'destructive',
            onPress: async () => {
              setProcessingMatch(matchId);
              try {
                const response = await rawFetch(
                  `${getBaseUrl()}/api/esf/matches/${encodeURIComponent(matchId)}/decline`,
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      reason: t(
                        'esf.app-client.mobile.auto_esf_matches_inbox.statusDeclinedByUser'
                      ),
                    }),
                  }
                );

                if (!response.ok) {
                  const errorData = await response.json().catch(() => ({}));
                  throw new Error(
                    errorData?.error || `HTTP ${response.status}`
                  );
                }

                const json = await response.json();
                if (!json?.success) {
                  throw new Error(json?.error || 'فشل في رفض المطابقة');
                }

                setMatches(prev =>
                  prev.map(m =>
                    m.id === matchId ? { ...m, status: 'declined' as const } : m
                  )
                );
              } catch (error) {
                console.error('Failed to decline match:', error);
                Alert.alert(
                  t('esf.app-client.mobile.auto_esf_matches_inbox.errorTitleAlt'),
                  error instanceof Error
                    ? error.message
                    : t(
                        'esf.app-client.mobile.auto_esf_matches_inbox.errorDeclineMessage'
                      )
                );
              } finally {
                setProcessingMatch(null);
              }
            },
          },
        ]
      );
    },
    [processingMatch]
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return semanticRoles.stateWarning.icon;
      case 'accepted':
        return semanticRoles.stateSuccess.icon;
      case 'declined':
        return semanticRoles.stateError.icon;
      case 'completed':
        return semanticRoles.stateSuccess.icon;
      default:
        return semanticRoles.textMuted;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return t('esf.app-client.mobile.auto_esf_matches_inbox.statusPending');
      case 'accepted':
        return t('esf.app-client.mobile.auto_esf_matches_inbox.statusAccepted');
      case 'declined':
        return t('esf.app-client.mobile.auto_esf_matches_inbox.statusDeclined');
      case 'completed':
        return t('esf.app-client.mobile.auto_esf_matches_inbox.statusCompleted');
      default:
        return status;
    }
  };

  const renderMatchItem = ({ item }: { item: DonorMatch }) => {
    const isProcessing = processingMatch === item.id;
    const canInteract = item.status === 'pending' && !isProcessing;
    const contactMethodBadge = getContactMethodBadge(item.contactMethod);

    return (
      <View style={styles.matchCard}>
        <TouchableOpacity
          style={styles.matchCardContent}
          onPress={() => handleNavigate('EsfMatchGet', { matchId: item.id })}
          activeOpacity={0.7}
          disabled={isProcessing}
        >
          <View
            style={[
              styles.matchHeader,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <View
              style={[
                styles.bloodTypeContainer,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <View
                style={[
                  styles.bloodTypeBadge,
                  { backgroundColor: semanticRoles.stateError.icon },
                ]}
              >
                <Text style={styles.bloodTypeText}>
                  {item.requestBloodType}
                </Text>
              </View>
              <View style={styles.matchInfo}>
                <Text style={styles.donorName}>👤 {item.donorName}</Text>
                <Text style={styles.donorBloodType}>
                  فصيلة المتبرع: {item.donorBloodType}
                </Text>
                <Text style={styles.location}>📍 {item.location}</Text>
              </View>
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

          {item.distance && (
            <View
              style={[
                styles.matchDetails,
                { flexDirection: 'row', direction: layoutDirection },
              ]}
            >
              <Text style={styles.matchDetail}>📏 {item.distance}</Text>
              {item.eta && (
                <Text style={styles.matchDetail}>⏱️ {item.eta}</Text>
              )}
              {item.donorRating && (
                <Text style={styles.matchDetail}>⭐ {item.donorRating}</Text>
              )}
            </View>
          )}

          {item.medicalReasonLabel ? (
            <Text style={styles.reasonLine}>
              سبب الحاجة: {item.medicalReasonLabel}
            </Text>
          ) : null}

          {contactMethodBadge ? (
            <View style={styles.metaBadgeRow}>
              <View style={styles.metaBadge}>
                <Text style={styles.metaBadgeText}>{contactMethodBadge}</Text>
              </View>
            </View>
          ) : null}

          <Text style={styles.matchedAt}>{item.matchedAt}</Text>
        </TouchableOpacity>

        {/* Quick Actions - Direct on Card (1-click) */}
        {canInteract && (
          <View
            style={[
              styles.quickActionsRow,
              { flexDirection: 'row', direction: layoutDirection },
            ]}
          >
            <TouchableOpacity
              style={[styles.quickActionButton, styles.acceptButton]}
              onPress={() => handleAccept(item.id)}
              disabled={isProcessing}
            >
              <Text style={styles.quickActionText}>✓ قبول</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.declineButton]}
              onPress={() => handleDecline(item.id)}
              disabled={isProcessing}
            >
              <Text style={styles.quickActionText}>✗ رفض</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.quickActionButton, styles.viewButton]}
              onPress={() =>
                handleNavigate('EsfMatchGet', { matchId: item.id })
              }
              disabled={isProcessing}
            >
              <Text style={styles.quickActionText}>👁️ تفاصيل</Text>
            </TouchableOpacity>
          </View>
        )}

        {isProcessing && (
          <View style={styles.processingOverlay}>
            <Text style={styles.processingText}>جاري المعالجة...</Text>
          </View>
        )}
      </View>
    );
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>صندوق التطابقات</Text>
            <Text style={styles.subtitle}>{headerSummary}</Text>
          </View>
          <FlatList
            data={matches}
            keyExtractor={item => item.id}
            renderItem={renderMatchItem}
            contentContainerStyle={styles.listContainer}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>لا توجد تطابقات حالياً</Text>
                <TouchableOpacity
                  style={styles.emptyButton}
                  onPress={() =>
                    handleNavigate('EsfHome', { esfFocus: 'search' })
                  }
                >
                  <Text style={styles.emptyButtonText}>تحديث توفرك</Text>
                </TouchableOpacity>
              </View>
            }
          />
        </View>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(
        'esf.app-client.mobile.auto_esf_matches_inbox.loadingMessage'
      )}
      emptyMessage={t(
        'esf.app-client.mobile.auto_esf_matches_inbox.emptyMessage'
      )}
      errorMessage={t(
        'esf.app-client.mobile.auto_esf_matches_inbox.errorLoadMessage'
      )}
      onErrorAction={handleRetry}
      screenName='auto_esf_matches_inbox'
      operationName='esf_matches_inbox'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.lg,
    paddingHorizontal: BTHWANI_SPACING.contentH,
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
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  listContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  matchCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    overflow: 'hidden',
    position: 'relative',
  },
  matchCardContent: {
    padding: BTHWANI_SPACING.md,
  },
  matchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  bloodTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  bloodTypeBadge: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginEnd: BTHWANI_SPACING.sm,
  },
  bloodTypeText: {
    color: semanticRoles.surface,
    fontSize: 18,
    fontWeight: '700',
  },
  matchInfo: {
    flex: 1,
  },
  donorName: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  donorBloodType: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.xs,
  },
  location: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    color: semanticRoles.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  matchDetails: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.xs,
  },
  matchDetail: {
    fontSize: 12,
    color: semanticRoles.stateInfo.icon,
  },
  reasonLine: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '600',
    marginBottom: BTHWANI_SPACING.xs,
  },
  metaBadgeRow: {
    flexDirection: 'row',
    marginBottom: BTHWANI_SPACING.xs,
  },
  metaBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.full,
    backgroundColor: semanticRoles.stateInfo.background,
  },
  metaBadgeText: {
    fontSize: 12,
    color: semanticRoles.stateInfo.icon,
    fontWeight: '700',
  },
  matchedAt: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  quickActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    paddingTop: BTHWANI_SPACING.sm,
    gap: BTHWANI_SPACING.sm,
  },
  quickActionButton: {
    flex: 1,
    padding: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.sm,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: semanticRoles.stateSuccess.icon + '20',
  },
  declineButton: {
    backgroundColor: semanticRoles.stateError.icon + '20',
  },
  viewButton: {
    backgroundColor: semanticRoles.stateInfo.icon + '20',
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    start: 0,
    end: 0,
    bottom: 0,
    backgroundColor: semanticRoles.overlay,
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  emptyText: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.lg,
  },
  emptyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  emptyButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_esf_matches_inbox;

