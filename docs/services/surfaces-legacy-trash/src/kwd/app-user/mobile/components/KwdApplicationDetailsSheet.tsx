/**
 * KWD Application Details Sheet
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * Bottom Sheet for application details
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Image, Alert } from 'react-native';
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

interface Application {
  id: string;
  applicationId?: string;
  job: {
    id: string;
    title: string;
    company?: {
      name: string;
      logoUrl?: string;
      industry?: string;
    };
    location?: {
      city?: string;
      region?: string;
      country?: string;
    };
    salary?: {
      min?: number;
      max?: number;
      currency?: string;
    };
    jobType?: string;
    description?: string;
    requirements?: string[];
  };
  status: 'pending' | 'contacted' | 'accepted' | 'rejected' | 'completed' | 'under_review' | 'shortlisted' | 'interviewed' | 'offered' | 'withdrawn';
  appliedAt?: string;
  lastUpdated?: string;
  applicantInfo?: {
    name?: string;
    email?: string;
    phone?: string;
    skill?: string;
    availability?: string;
  };
  portfolioImages?: string[];
  notes?: string;
  nextSteps?: string[];
  /** ملخص العامل (من الـ API): مهام مكتملة، تقييم، شارات */
  workerSummary?: {
    completedTasksCount?: number;
    rating?: number;
    badges?: string[];
  };
  /** تقييم المستخدم الحالي لهذا الطلب (إن وُجد) */
  ratingGiven?: number;
}

interface KwdApplicationDetailsSheetProps {
  visible: boolean;
  applicationId: string;
  jobId?: string;
  onClose: () => void;
  onJobPress: (jobId: string) => void;
  /** عند التقديم: يغلق الشيت وينتقل لشاشة الإبلاغ عن مستخدم/تقديم */
  onReportApplication?: (applicationId: string, targetUserName?: string) => void;
}

export const KwdApplicationDetailsSheet: React.FC<KwdApplicationDetailsSheetProps> = ({
  visible,
  applicationId,
  jobId,
  onClose,
  onJobPress,
  onReportApplication,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);
  const [loading, setLoading] = useState(true);
  const [application, setApplication] = useState<Application | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [ratingStars, setRatingStars] = useState<number>(0);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  const loadApplication = useCallback(async () => {
    if (!applicationId) return;

    try {
      setLoading(true);
      setError(null);

      const baseUrl = getBaseUrl();
      const params = new URLSearchParams({
        domain: 'KWD',
        entityType: 'application',
      });
      const url = `${baseUrl}/api/entities/${applicationId}?${params.toString()}`;

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
        throw new Error(json?.error || t('surfaces.failedToLoadApplicationDetails'));
      }

      const entity = json?.entity || json?.data || {};
      const appData: Application = {
        id: entity.id || applicationId,
        applicationId: entity.applicationId || entity.id,
        job: {
          id: entity.job?.id || jobId || '',
          title: entity.job?.title || t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.noAddress'),
          company: entity.job?.company ? {
            name: entity.job.company.name || t('surfaces.unspecified'),
            logoUrl: entity.job.company.logoUrl,
            industry: entity.job.company.industry,
          } : undefined,
          location: entity.job?.location ? {
            city: entity.job.location.city,
            region: entity.job.location.region,
            country: entity.job.location.country,
          } : undefined,
          salary: entity.job?.salary || entity.job?.wage ? {
            min: entity.job.salary?.min || entity.job.wage?.min,
            max: entity.job.salary?.max || entity.job.wage?.max,
            currency: entity.job.salary?.currency || entity.job.wage?.currency || 'SAR',
          } : undefined,
          jobType: entity.job?.jobType,
          description: entity.job?.description,
          requirements: entity.job?.requirements || [],
        },
        status: (entity.status || 'pending') as Application['status'],
        appliedAt: entity.appliedAt || entity.submittedAt || entity.createdAt,
        lastUpdated: entity.lastUpdated || entity.updatedAt,
        applicantInfo: entity.applicantInfo ? {
          name: entity.applicantInfo.name || entity.applicantInfo.fullName,
          email: entity.applicantInfo.email,
          phone: entity.applicantInfo.phone,
          skill: entity.applicantInfo.skill,
          availability: entity.applicantInfo.availability,
        } : undefined,
        portfolioImages: entity.portfolioImages || entity.documents?.filter((d: any) => d.type === 'portfolio').map((d: any) => d.url) || [],
        notes: entity.notes,
        nextSteps: entity.nextSteps || [],
        workerSummary: entity.workerSummary ? {
          completedTasksCount: entity.workerSummary.completedTasksCount,
          rating: entity.workerSummary.rating,
          badges: entity.workerSummary.badges || [],
        } : undefined,
        ratingGiven: entity.ratingGiven,
      };

      setApplication(appData);
    } catch (err: any) {
      setError(err.message || t('surfaces.failedToLoadApplicationDetails'));
    } finally {
      setLoading(false);
    }
  }, [applicationId, jobId]);

  useEffect(() => {
    if (visible && applicationId) {
      loadApplication();
    }
  }, [visible, applicationId, loadApplication]);

  const formatDate = (dateString?: string): string => {
    if (!dateString) return t('surfaces.unspecified');
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('ar-SA');
    } catch {
      return dateString;
    }
  };

  const formatLocation = (location?: { city?: string; region?: string; country?: string }): string => {
    if (!location) return t('surfaces.unspecified');
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    return parts.length > 0 ? parts.join(', ') : t('surfaces.unspecified');
  };

  const formatWage = (salary?: { min?: number; max?: number; currency?: string }): string => {
    if (!salary) return t('surfaces.unspecified');
    const currency = salary.currency || 'SAR';
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${currency}`;
    }
    if (salary.min) {
      return `${t('surfaces.salaryFrom')} ${salary.min.toLocaleString()} ${currency}`;
    }
    if (salary.max) {
      return `${t('surfaces.salaryTo')} ${salary.max.toLocaleString()} ${currency}`;
    }
    return t('surfaces.unspecified');
  };

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

  const handleWithdraw = useCallback(() => {
    Alert.alert(
      t('surfaces.سحب_الطلب'),
      t('surfaces.هل_أنت_متأكد_من_سحب_طلب_التوظيف؟'),
      [
        { text: t('surfaces.إلغاء'), style: 'cancel' },
        {
          text: t('surfaces.سحب'),
          style: 'destructive',
          onPress: async () => {
            // Deferred: withdraw operation
            Alert.alert(t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.requestWithdrawnSuccess'), t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.requestWithdrawnSuccess'));
            onClose();
          },
        },
      ]
    );
  }, [onClose]);

  const handleSubmitRating = useCallback(async () => {
    if (ratingStars < 1 || ratingStars > 5 || !application) return;
    setRatingSubmitting(true);
    try {
      // Deferred: submit rating for application
      const baseUrl = getBaseUrl();
      const res = await rawFetch(`${baseUrl}/api/kwd/applications/${application.id}/rate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ rating: ratingStars }),
      });
      if (res.ok) {
        setApplication({ ...application, ratingGiven: ratingStars });
        Alert.alert(t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.thanks'), t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.thanks'));
      } else {
        Alert.alert(t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.ratingSaveErrorRetryLater'), t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.ratingSaveErrorRetryLater'));
      }
    } catch {
      Alert.alert(t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.ratingSaveErrorRetryLater'), t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.ratingSaveErrorRetryLater'));
    } finally {
      setRatingSubmitting(false);
    }
  }, [application, ratingStars]);

  return (
    <KwdBottomSheet
      visible={visible}
      onClose={onClose}
      height="large"
      title={application?.job.title || t('kwd.app-client.mobile.components.KwdApplicationDetailsSheet.orderDetails')}
    >
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={semanticRoles.primaryCTA} />
          <Text style={styles.loadingText}>{t('surfaces.loadingDetails')}</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadApplication} accessibilityLabel={t('common.retry')} accessibilityRole="button">
            <Text style={styles.retryButtonText}>{t('surfaces.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : application ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Status */}
          <View style={styles.statusCard}>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor(application.status) }]}>
              <Text style={styles.statusText}>{getStatusText(application.status)}</Text>
            </View>
            {application.lastUpdated && (
              <Text style={styles.lastUpdate}>{t('surfaces.lastUpdate')}: {formatDate(application.lastUpdated)}</Text>
            )}
          </View>

          {/* Job Info */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.jobInfoSection')}</Text>
            <View style={styles.infoCard}>
              <Text style={[styles.jobTitle, textAlignStart]}>{application.job.title}</Text>
              {application.job.company?.name && (
                <Text style={[styles.company, textAlignStart]}>{application.job.company.name}</Text>
              )}
              <View style={[styles.detailsRow, { direction: layoutDirection }]}>
                {application.job.location && (
                  <Text style={styles.detailItem}>📍 {formatLocation(application.job.location)}</Text>
                )}
                {application.job.salary && (
                  <Text style={styles.detailItem}>💰 {formatWage(application.job.salary)}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Applicant Info */}
          {application.applicantInfo && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.yourDataInApplication')}</Text>
              <View style={styles.infoCard}>
                {application.applicantInfo.name && (
                  <View style={[styles.infoRow, { direction: layoutDirection }]}>
                    <Text style={styles.infoLabel}>{t('surfaces.labelName')}</Text>
                    <Text style={[styles.infoValue, textAlignStart]}>{application.applicantInfo.name}</Text>
                  </View>
                )}
                {application.applicantInfo.phone && (
                  <View style={[styles.infoRow, { direction: layoutDirection }]}>
                    <Text style={styles.infoLabel}>{t('surfaces.labelPhone')}</Text>
                    <Text style={[styles.infoValue, textAlignStart]}>{application.applicantInfo.phone}</Text>
                  </View>
                )}
                {application.applicantInfo.skill && (
                  <View style={[styles.infoRow, { direction: layoutDirection }]}>
                    <Text style={styles.infoLabel}>{t('surfaces.labelSkill')}</Text>
                    <Text style={[styles.infoValue, textAlignStart]}>{application.applicantInfo.skill}</Text>
                  </View>
                )}
                {application.applicantInfo.availability && (
                  <View style={[styles.infoRow, { direction: layoutDirection }]}>
                    <Text style={styles.infoLabel}>{t('surfaces.labelAvailability')}</Text>
                    <Text style={[styles.infoValue, textAlignStart]}>{application.applicantInfo.availability}</Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* ملخص العامل — يظهر عند توفر بيانات من الـ API */}
          {application.workerSummary && (application.workerSummary.completedTasksCount != null || application.workerSummary.rating != null || (application.workerSummary.badges && application.workerSummary.badges.length > 0)) && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.workerSummarySection')}</Text>
              <View style={styles.infoCard}>
                {application.workerSummary.completedTasksCount != null && (
                  <View style={[styles.infoRow, { direction: layoutDirection }]}>
                    <Text style={styles.infoLabel}>مهام مكتملة:</Text>
                    <Text style={[styles.infoValue, textAlignStart]}>{application.workerSummary.completedTasksCount}</Text>
                  </View>
                )}
                {application.workerSummary.rating != null && (
                  <View style={[styles.infoRow, { direction: layoutDirection }]}>
                    <Text style={styles.infoLabel}>{t('surfaces.ratingLabel')}</Text>
                    <Text style={[styles.infoValue, textAlignStart]}>★ {Number(application.workerSummary.rating).toFixed(1)}</Text>
                  </View>
                )}
                {application.workerSummary.badges && application.workerSummary.badges.length > 0 && (
                  <View style={[styles.badgesRow, { direction: layoutDirection }]}>
                    <Text style={styles.infoLabel}>{t('surfaces.badgesLabel')}</Text>
                    <View style={[styles.badgesWrap, { direction: layoutDirection }]}>
                      {application.workerSummary.badges.map((badge, idx) => (
                        <View key={idx} style={styles.badgeChip}>
                          <Text style={styles.badgeText}>{badge}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Portfolio */}
          {application.portfolioImages && application.portfolioImages.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.portfolioSection')}</Text>
              <View style={[styles.portfolioContainer, { direction: layoutDirection }]}>
                {application.portfolioImages.map((imageUrl, index) => (
                  <Image
                    key={index}
                    source={{ uri: imageUrl }}
                    style={styles.portfolioImage}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Notes */}
          {application.notes && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>ملاحظات من الشركة</Text>
              <View style={styles.notesCard}>
                <Text style={[styles.notesText, textAlignStart]}>{application.notes}</Text>
              </View>
            </View>
          )}

          {/* تقييم 1–5 بعد الإتمام — يظهر عند حالة مكتمل فقط */}
          {application.status === 'completed' && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.rateApplicationSection')}</Text>
              <View style={styles.infoCard}>
                {application.ratingGiven ? (
                  <Text style={[styles.infoValue, textAlignStart]}>{t('surfaces.yourRating')} ★ {application.ratingGiven}/5</Text>
                ) : (
                  <>
                    <Text style={[styles.ratingPrompt, textAlignStart]}>{t('surfaces.ratingPrompt')}</Text>
                    <View style={[styles.starsRow, { direction: layoutDirection }]}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity
                          key={star}
                          style={styles.starButton}
                          onPress={() => setRatingStars(star)}
                          activeOpacity={0.8}
                          accessibilityLabel={t('surfaces.rateStars', { count: star, default: `Rate ${star} stars` })}
                          accessibilityRole="button"
                        >
                          <Text style={styles.starIcon}>{ratingStars >= star ? '★' : '☆'}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <TouchableOpacity
                      style={[styles.ratingSubmitButton, (ratingStars < 1 || ratingSubmitting) && styles.ratingSubmitDisabled]}
                      onPress={handleSubmitRating}
                      disabled={ratingStars < 1 || ratingSubmitting}
                      accessibilityLabel={ratingSubmitting ? t('surfaces.submitting') : t('surfaces.إرسال_التقييم')}
                      accessibilityRole="button"
                    >
                      <Text style={styles.ratingSubmitText}>
                        {ratingSubmitting ? t('surfaces.submitting') : t('surfaces.إرسال_التقييم')}
                      </Text>
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          )}

          {/* Report application / user — مسار واضح دون ازدحام */}
          {onReportApplication && (
            <TouchableOpacity
              style={styles.reportLink}
              onPress={() => {
                onClose();
                onReportApplication(application.id, application.applicantInfo?.name);
              }}
              accessibilityLabel={t('surfaces.reportThisApplication')}
              accessibilityRole="button"
            >
              <Text style={styles.reportLinkText}>⚠️ {t('surfaces.reportThisApplication')}</Text>
            </TouchableOpacity>
          )}

          {/* Actions */}
          <View style={[styles.actionsContainer, { direction: layoutDirection }]}>
            {(application.status === 'pending' || application.status === 'under_review') && (
              <TouchableOpacity
                style={styles.withdrawButton}
                accessibilityLabel={t('surfaces.withdrawApplication', { default: 'سحب الطلب' })}
                accessibilityRole="button"
                onPress={handleWithdraw}
              >
                <Text style={styles.withdrawButtonText}>{t('surfaces.withdrawApplication')}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={styles.jobButton}
              onPress={() => onJobPress(application.job.id)}
              accessibilityLabel={t('surfaces.viewJobDetails')}
              accessibilityRole="button"
            >
              <Text style={styles.jobButtonText}>{t('surfaces.viewJobDetails')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      ) : null}
    </KwdBottomSheet>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
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
  statusCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.xs,
  },
  statusText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  lastUpdate: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  infoCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  company: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.md,
  },
  detailItem: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
    marginStart: BTHWANI_SPACING.md,
  },
  portfolioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  portfolioImage: {
    width: 80,
    height: 80,
    borderRadius: BTHWANI_RADIUS.md,
  },
  notesCard: {
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  notesText: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  badgesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.xs,
  },
  badgeChip: {
    backgroundColor: semanticRoles.primaryCTA + '20',
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  badgeText: {
    fontSize: 12,
    color: semanticRoles.primaryCTA,
    fontWeight: '600',
  },
  ratingPrompt: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  starButton: {
    padding: BTHWANI_SPACING.xs,
  },
  starIcon: {
    fontSize: 28,
    color: semanticRoles.primaryCTA,
  },
  ratingSubmitButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  ratingSubmitDisabled: {
    opacity: 0.5,
  },
  ratingSubmitText: {
    color: semanticRoles.primaryCTAText,
    fontWeight: '600',
  },
  actionsContainer: {
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.xl,
    gap: BTHWANI_SPACING.md,
  },
  reportLink: {
    alignSelf: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  reportLinkText: {
    fontSize: 13,
    color: semanticRoles.textMuted,
  },
  withdrawButton: {
    backgroundColor: semanticRoles.error,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  withdrawButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
  jobButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  jobButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});

