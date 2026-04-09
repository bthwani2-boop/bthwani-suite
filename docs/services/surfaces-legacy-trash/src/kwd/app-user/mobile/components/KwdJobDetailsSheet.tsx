/**
 * KWD Job Details Sheet
 * Design: Simple, flexible, smart - for developing economy (Yemen)
 * Bottom Sheet for job details with apply button
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { KwdBottomSheet } from './KwdBottomSheet';
import type { KwdJob } from './KwdSwipeableCard';
import { rawFetch } from '@bthwani/api-clients';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

interface Job {
  id: string;
  title: string;
  company?: {
    name: string;
    logoUrl?: string;
    industry?: string;
    companySize?: string;
  };
  location?: {
    city?: string;
    region?: string;
    country?: string;
  };
  jobType?: string;
  experienceLevel?: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
  };
  description?: string;
  requirements?: string[];
  benefits?: string[];
  skills?: string[];
  postedDate?: string;
  applicationDeadline?: string;
  applicantsCount?: number;
  status?: string;
}

interface KwdJobDetailsSheetProps {
  visible: boolean;
  jobId: string;
  onClose: () => void;
  onApply: (jobId: string) => void;
}

export const KwdJobDetailsSheet: React.FC<KwdJobDetailsSheetProps> = ({
  visible,
  jobId,
  onClose,
  onApply,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const layoutDirection = useMemo(() => (isRTL ? 'rtl' : 'ltr') as 'rtl' | 'ltr', [isRTL]);
  const [loading, setLoading] = useState(true);
  const [job, setJob] = useState<Job | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadJob = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      setError(null);

      const baseUrl = getBaseUrl();
      const params = new URLSearchParams({
        domain: 'KWD',
        entityType: 'job',
      });
      const url = `${baseUrl}/api/entities/${jobId}?${params.toString()}`;

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
        throw new Error(json?.error || 'فشل في تحميل تفاصيل الوظيفة');
      }

      const entity = json?.entity || json?.data || {};
      const jobData: Job = {
        id: entity.id || jobId,
        title: entity.title || entity.name || t('kwd.app-client.mobile.components.KwdJobDetailsSheet.noAddress'),
        company: entity.company ? {
          name: entity.company.name || 'غير محدد',
          logoUrl: entity.company.logoUrl,
          industry: entity.company.industry,
          companySize: entity.company.companySize,
        } : undefined,
        location: entity.location ? {
          city: entity.location.city,
          region: entity.location.region,
          country: entity.location.country,
        } : undefined,
        jobType: entity.jobType || entity.type,
        experienceLevel: entity.experienceLevel,
        salary: entity.salary || entity.wage ? {
          min: entity.salary?.min || entity.wage?.min,
          max: entity.salary?.max || entity.wage?.max,
          currency: entity.salary?.currency || entity.wage?.currency || 'SAR',
        } : undefined,
        description: entity.description || entity.details,
        requirements: entity.requirements || [],
        benefits: entity.benefits || [],
        skills: entity.skills || [],
        postedDate: entity.postedDate || entity.createdAt,
        applicationDeadline: entity.applicationDeadline || entity.deadline,
        applicantsCount: entity.applicantsCount || entity.applicants,
        status: entity.status,
      };

      setJob(jobData);
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل تفاصيل الوظيفة');
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => {
    if (visible && jobId) {
      loadJob();
    }
  }, [visible, jobId, loadJob]);

  const formatLocation = (location?: { city?: string; region?: string; country?: string }): string => {
    if (!location) return 'غير محدد';
    const parts = [];
    if (location.city) parts.push(location.city);
    if (location.region) parts.push(location.region);
    if (location.country) parts.push(location.country);
    return parts.length > 0 ? parts.join(', ') : 'غير محدد';
  };

  const formatWage = (salary?: { min?: number; max?: number; currency?: string }): string => {
    if (!salary) return 'غير محدد';
    const currency = salary.currency || 'SAR';
    if (salary.min && salary.max) {
      return `${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${currency}`;
    }
    if (salary.min) {
      return `من ${salary.min.toLocaleString()} ${currency}`;
    }
    if (salary.max) {
      return `حتى ${salary.max.toLocaleString()} ${currency}`;
    }
    return 'غير محدد';
  };

  const formatJobType = (type?: string): string => {
    const typeMap: Record<string, string> = {
      full_time: 'دوام كامل',
      part_time: 'دوام جزئي',
      contract: 'عقد',
      freelance: 'عمل حر',
      daily: 'أجر يومي',
      one_time: 'عمل معين',
      recurring: 'خدمة متكررة',
      permanent: 'وظيفة دائمة',
    };
    return type ? (typeMap[type] || type) : 'غير محدد';
  };

  return (
    <KwdBottomSheet
      visible={visible}
      onClose={onClose}
      height="large"
      title={job?.title || t('kwd.app-client.mobile.components.KwdJobDetailsSheet.jobDetails')}
    >
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={semanticRoles.primaryCTA} />
          <Text style={styles.loadingText}>{t('kwd.app-client.mobile.components.KwdJobDetailsSheet.loadingDetails', { default: 'جاري تحميل التفاصيل...' })}</Text>
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadJob} accessibilityLabel={t('common.retry')} accessibilityRole="button">
            <Text style={styles.retryButtonText}>{t('common.retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : job ? (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Company Info */}
          {job.company && (
            <View style={styles.section}>
              <View style={[styles.companyCard, { direction: layoutDirection }]}>
                <Text style={styles.companyIcon}>🏢</Text>
                <View style={styles.companyInfo}>
                  <Text style={styles.companyName}>{job.company.name}</Text>
                  {job.company.industry && (
                    <Text style={styles.companyDetails}>{job.company.industry}</Text>
                  )}
                </View>
              </View>
            </View>
          )}

          {/* Details */}
          <View style={styles.section}>
            <View style={[styles.detailRow, { direction: layoutDirection }]}>
              <Text style={[styles.detailLabel, textAlignStart]}>{t('surfaces.locationLabel', { default: '📍 الموقع:' })}</Text>
              <Text style={[styles.detailValue, textAlignStart]}>{formatLocation(job.location)}</Text>
            </View>
            {job.jobType && (
              <View style={[styles.detailRow, { direction: layoutDirection }]}>
                <Text style={[styles.detailLabel, textAlignStart]}>{t('surfaces.jobTypeLabel', { default: '⏰ نوع العمل:' })}</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{formatJobType(job.jobType)}</Text>
              </View>
            )}
            {job.salary && (
              <View style={[styles.detailRow, { direction: layoutDirection }]}>
                <Text style={[styles.detailLabel, textAlignStart]}>{t('surfaces.wageLabel', { default: '💰 الأجر:' })}</Text>
                <Text style={[styles.detailValue, textAlignStart]}>{formatWage(job.salary)}</Text>
              </View>
            )}
          </View>

          {/* Description */}
          {job.description && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.descriptionLabel', { default: 'الوصف' })}</Text>
              <Text style={[styles.description, textAlignStart]}>{job.description}</Text>
            </View>
          )}

          {/* Requirements */}
          {job.requirements && job.requirements.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.requirementsTitle', { default: 'المتطلبات' })}</Text>
              {job.requirements.map((req, index) => (
                <View key={index} style={[styles.requirementItem, { direction: layoutDirection }]}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={[styles.requirementText, textAlignStart]}>{req}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Skills */}
          {job.skills && job.skills.length > 0 && (
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, textAlignStart]}>{t('surfaces.skillsRequiredLabel', { default: 'المهارات المطلوبة' })}</Text>
              <View style={[styles.skillsContainer, { direction: layoutDirection }]}>
                {job.skills.map((skill, index) => (
                  <View key={index} style={styles.skillTag}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* سياسة الإلغاء — معلومة واضحة قبل التقديم */}
          <View style={[styles.policyBlock, { direction: layoutDirection }]}>
            <Text style={styles.policyText}>
              {t('kwd.app-client.mobile.components.KwdJobDetailsSheet.cancelPolicy', { default: 'إلغاء مجاني خلال 5 دقائق من التقديم.' })}
            </Text>
          </View>

          {/* Apply Button */}
          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => onApply(job.id)}
            activeOpacity={0.8}
            accessibilityLabel={t('surfaces.applyNow')}
            accessibilityRole="button"
          >
            <Text style={styles.applyButtonText}>{t('surfaces.applyNow')}</Text>
          </TouchableOpacity>
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
  section: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  companyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surfaceSubtle,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    gap: BTHWANI_SPACING.md,
  },
  companyIcon: {
    fontSize: 32,
  },
  companyInfo: {
    flex: 1,
  },
  companyName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  companyDetails: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.sm,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    marginEnd: BTHWANI_SPACING.md,
  },
  detailValue: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  description: {
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 22,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: BTHWANI_SPACING.xs,
  },
  bullet: {
    color: semanticRoles.primaryCTA,
    fontSize: 16,
    marginEnd: BTHWANI_SPACING.sm,
    marginTop: 2,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: semanticRoles.text,
    lineHeight: 20,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
  },
  skillTag: {
    backgroundColor: semanticRoles.surfaceSubtle,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.lg,
  },
  skillText: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  policyBlock: {
    marginBottom: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.sm,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
  },
  policyText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    textAlign: 'center',
  },
  applyButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.lg,
    marginBottom: BTHWANI_SPACING.xl,
  },
  applyButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '700',
  },
});

