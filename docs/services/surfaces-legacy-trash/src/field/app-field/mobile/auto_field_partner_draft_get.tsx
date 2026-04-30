/**
 * Field Partner Draft Get — field_partner_draft_get
 * Surface: app-field | Service: field
 * Operation: GET /api/field/partners/drafts/{draft_id}
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, RefreshControl } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerDraftGetProps {
  navigation?: any;
  route?: any;
}

const AutoFieldPartnerDraftGet: React.FC<AutoFieldPartnerDraftGetProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const ns = 'field.app-field.mobile.auto_field_partner_draft_get';
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
    const draftId = route?.params?.draftId || 'unknown';
  const [draftData, setDraftData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadDraft = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // const data = await getFieldPartnerDraft(draftId);
      await new Promise(resolve => setTimeout(resolve, 800));
      setDraftData({
        id: draftId,
        partnerName: t('surfaces.مطعم_الشام'),
        phone: '+966501234567',
        email: 'info@example.com',
        address: t('surfaces.الرياض،_حي_النرجس'),
        status: 'draft',
        serviceType: 'DSH',
        createdAt: new Date().toISOString(),
        hasEvidence: true,
        hasLocation: true,
        hasHours: false,
        hasService: true,
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t(`${ns}.loadDraftFailed`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [draftId]);

  useEffect(() => {
    loadDraft();
  }, [loadDraft]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return colorTokens.warning['500'];
      case 'submitted': return colorTokens.primary['500'];
      case 'approved': return colorTokens.success['600'];
      case 'rejected': return colorTokens.error['500'];
      default: return semanticRoles.textMuted;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return t('surfaces.مسودة');
      case 'submitted': return t('surfaces.مُرسلة');
      case 'approved': return t('surfaces.مُوافق_عليها');
      case 'rejected': return t('surfaces.مرفوضة');
      default: return status;
    }
  };

  const getState = (): 'loading' | 'error' | 'empty' | 'content' => {
    if (isLoading && !isRefreshing) return 'loading';
    if (error) return 'error';
    if (!draftData) return 'empty';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t(`${ns}.loadingMessage`)}
      errorMessage={error || t(`${ns}.unexpectedError`)}
      errorActionText={t(`${ns}.retry`)}
      onErrorAction={() => loadDraft()}
      emptyMessage={t(`${ns}.emptyMessage`)}
      emptyActionText={t(`${ns}.retry`)}
      onEmptyAction={() => loadDraft()}
      screenName="field_partner_draft_get"
      operationName="field_partner_draft_get"
    >
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadDraft(true)} />
          }
        >
          {draftData && (
            <>
              <View style={styles.header}>
                <View style={styles.headerTop}>
                  <Text style={styles.title}>{draftData.partnerName}</Text>
                  <View style={[styles.statusBadge, { backgroundColor: getStatusColor(draftData.status) + '20' }]}>
                    <Text style={[styles.statusText, { color: getStatusColor(draftData.status) }]}>
                      {getStatusLabel(draftData.status)}
                    </Text>
                  </View>
                </View>
                <Text style={styles.subtitle}>معرف المسودة: {draftId}</Text>
              </View>

              <View style={styles.detailsCard}>
                <Text style={styles.sectionTitle}>📋 المعلومات الأساسية</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الاسم:</Text>
                  <Text style={[styles.detailValue, textAlignStart]}>{draftData.partnerName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>الهاتف:</Text>
                  <Text style={[styles.detailValue, textAlignStart]}>{draftData.phone}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>البريد:</Text>
                  <Text style={[styles.detailValue, textAlignStart]}>{draftData.email}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>العنوان:</Text>
                  <Text style={[styles.detailValue, textAlignStart]}>{draftData.address}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>نوع الخدمة:</Text>
                  <Text style={[styles.detailValue, textAlignStart]}>
                    {draftData.serviceType === 'DSH' ? '🏪 DSH' : '🎭 ARB'}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>تاريخ الإنشاء:</Text>
                  <Text style={[styles.detailValue, textAlignStart]}>
                    {new Date(draftData.createdAt).toLocaleDateString('ar-SA')}
                  </Text>
                </View>
              </View>

              <View style={styles.completionCard}>
                <Text style={styles.sectionTitle}>✅ حالة الإكمال</Text>
                <View style={styles.completionItem}>
                  <Text style={styles.completionIcon}>{draftData.hasEvidence ? '✓' : '✗'}</Text>
                  <Text style={styles.completionLabel}>الأدلة المرفقة</Text>
                </View>
                <View style={styles.completionItem}>
                  <Text style={styles.completionIcon}>{draftData.hasLocation ? '✓' : '✗'}</Text>
                  <Text style={styles.completionLabel}>الموقع الجغرافي</Text>
                </View>
                <View style={styles.completionItem}>
                  <Text style={styles.completionIcon}>{draftData.hasHours ? '✓' : '✗'}</Text>
                  <Text style={styles.completionLabel}>ساعات العمل</Text>
                </View>
                <View style={styles.completionItem}>
                  <Text style={styles.completionIcon}>{draftData.hasService ? '✓' : '✗'}</Text>
                  <Text style={styles.completionLabel}>الخدمة المربوطة</Text>
                </View>
              </View>

              <View style={styles.quickActions}>
                <Text style={styles.sectionTitle}>⚡ إجراءات سريعة</Text>
                {draftData.status === 'draft' && (
                  <>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => navigation?.navigate('field_partner_draft_update', { draftId })}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickActionText}>✏️ تعديل المسودة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => navigation?.navigate('field_partner_draft_evidence_add', { draftId })}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickActionText}>📎 إضافة أدلة</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => navigation?.navigate('field_partner_draft_pin_geo', { draftId })}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickActionText}>📍 تحديد الموقع</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => navigation?.navigate('field_partner_draft_set_hours', { draftId })}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.quickActionText}>🕐 تعيين ساعات العمل</Text>
                    </TouchableOpacity>
                    {!draftData.hasService && (
                      <TouchableOpacity
                        style={styles.quickActionButton}
                        onPress={() => navigation?.navigate('field_partner_service_attach', { draftId })}
                        activeOpacity={0.8}
                      >
                        <Text style={styles.quickActionText}>🔗 ربط الخدمة</Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.quickActionButton, styles.primaryAction]}
                      onPress={() => navigation?.navigate('field_partner_draft_submit', { draftId })}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.quickActionText, styles.primaryActionText]}>📤 إرسال للمراجعة</Text>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity
                  style={styles.quickActionButton}
                  onPress={() => navigation?.navigate('field_partner_products_list', { partnerId: draftId })}
                  activeOpacity={0.8}
                >
                  <Text style={styles.quickActionText}>📦 إدارة المنتجات</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation?.navigate('field_partner_draft_create')}
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonText}>← العودة للقائمة</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: 100,
  },
  header: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semanticRoles.text,
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    marginStart: BTHWANI_SPACING.md,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  detailsCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.textMuted,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: semanticRoles.text,
    fontWeight: '500',
    flex: 1,
  },
  completionCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  completionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
  },
  completionIcon: {
    fontSize: 20,
    marginEnd: BTHWANI_SPACING.md,
    width: 24,
  },
  completionLabel: {
    fontSize: 16,
    color: semanticRoles.text,
  },
  quickActions: {
    marginBottom: BTHWANI_SPACING.lg,
  },
  quickActionButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: semanticRoles.text,
  },
  primaryActionText: {
    color: semanticRoles.primaryCTAText,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
  },
  footerButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  footerButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoFieldPartnerDraftGet;
