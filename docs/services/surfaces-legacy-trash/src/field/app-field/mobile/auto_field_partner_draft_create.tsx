/**
 * Field Partner Draft Create — field_partner_draft_create
 * Surface: app-field | Service: field
 * Operation: POST /api/field/partners/drafts
 * 
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - Hub screen: Drafts list with Quick Actions + Create new draft
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';

interface AutoFieldPartnerDraftCreateProps {
  navigation?: any;
  route?: any;
}

interface DraftItem {
  id: string;
  partnerName: string;
  status: 'draft' | 'submitted' | 'approved' | 'rejected';
  createdAt: string;
  serviceType?: 'DSH' | 'ARB';
}

const AutoFieldPartnerDraftCreate: React.FC<AutoFieldPartnerDraftCreateProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const ns = 'field.app-field.mobile.auto_field_partner_draft_create';
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const layoutDirectionReverse = isRTL ? ('ltr' as const) : ('rtl' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const [drafts, setDrafts] = useState<DraftItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const loadDrafts = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // const data = await getFieldPartnerDrafts();
      await new Promise(resolve => setTimeout(resolve, 800));
      setDrafts([
        { id: '1', partnerName: t(`${ns}.mockPartner1`), status: 'draft', createdAt: new Date().toISOString(), serviceType: 'DSH' },
        { id: '2', partnerName: t(`${ns}.mockPartner2`), status: 'submitted', createdAt: new Date(Date.now() - 86400000).toISOString(), serviceType: 'ARB' },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t(`${ns}.loadDraftsFailed`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    loadDrafts();
  }, [loadDrafts]);

  const handleCreateDraft = async () => {
    setIsCreating(true);
    try {
      
      // const newDraft = await createFieldPartnerDraft();
      await new Promise(resolve => setTimeout(resolve, 500));
      const newDraftId = 'new-' + Date.now();
      navigation?.navigate('field_partner_draft_update', { draftId: newDraftId, isNew: true });
    } catch (err) {
      Alert.alert(t(`${ns}.error`), t(`${ns}.createFailed`));
    } finally {
      setIsCreating(false);
    }
  };

  const handleDraftPress = (draftId: string) => {
    navigation?.navigate('field_partner_draft_get', { draftId });
  };

  const handleQuickAction = (action: string, draftId: string) => {
    switch (action) {
      case 'view':
        navigation?.navigate('field_partner_draft_get', { draftId });
        break;
      case 'edit':
        navigation?.navigate('field_partner_draft_update', { draftId });
        break;
      case 'submit':
        navigation?.navigate('field_partner_draft_submit', { draftId });
        break;
      case 'evidence':
        navigation?.navigate('field_partner_draft_evidence_add', { draftId });
        break;
    }
  };

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
      case 'draft': return t(`${ns}.statusDraft`);
      case 'submitted': return t(`${ns}.statusSubmitted`);
      case 'approved': return t(`${ns}.statusApproved`);
      case 'rejected': return t(`${ns}.statusRejected`);
      default: return status;
    }
  };

  const getState = (): 'loading' | 'error' | 'empty' | 'content' => {
    if (isLoading && !isRefreshing) return 'loading';
    if (error) return 'error';
    if (drafts.length === 0 && !isLoading) return 'empty';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t(`${ns}.loadingMessage`)}
      errorMessage={error || t(`${ns}.errorMessage`)}
      errorActionText={t(`${ns}.errorActionText`)}
      onErrorAction={() => loadDrafts()}
      emptyMessage={t(`${ns}.emptyMessage`)}
      emptyActionText={t(`${ns}.emptyActionText`)}
      onEmptyAction={handleCreateDraft}
      screenName="field_partner_draft_create"
      operationName="field_partner_draft_create"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📝 {t(`${ns}.title`)}</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={handleCreateDraft}
            disabled={isCreating}
            activeOpacity={0.8}
          >
            <Text style={styles.createButtonText}>
              {isCreating ? t(`${ns}.creating`) : `➕ ${t(`${ns}.createButton`)}`}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadDrafts(true)} />
          }
        >
          {drafts.map((draft) => (
            <TouchableOpacity
              key={draft.id}
              style={styles.draftCard}
              onPress={() => handleDraftPress(draft.id)}
              activeOpacity={0.7}
            >
              <View style={[styles.draftHeader, { flexDirection: 'row', direction: layoutDirection }]}>
                <View style={styles.draftInfo}>
                  <Text style={styles.draftName}>{draft.partnerName}</Text>
                  <View style={[styles.draftMeta, { flexDirection: 'row', direction: layoutDirection }]}>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(draft.status) + '20' }]}>
                      <Text style={[styles.statusText, { color: getStatusColor(draft.status) }]}>
                        {getStatusLabel(draft.status)}
                      </Text>
                    </View>
                    {draft.serviceType && (
                      <Text style={styles.serviceType}>
                        {draft.serviceType === 'DSH' ? `🏪 ${t(`${ns}.serviceTypeDsh`)}` : `🎭 ${t(`${ns}.serviceTypeArb`)}`}
                      </Text>
                    )}
                  </View>
                </View>
                <Text style={styles.arrow}>›</Text>
              </View>

              <View style={[styles.quickActions, { flexDirection: 'row', direction: layoutDirection }]}>
                {draft.status === 'draft' && (
                  <>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => handleQuickAction('edit', draft.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quickActionText}>✏️ {t(`${ns}.edit`)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.quickActionButton}
                      onPress={() => handleQuickAction('evidence', draft.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.quickActionText}>📎 {t(`${ns}.evidence`)}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.quickActionButton, styles.primaryAction]}
                      onPress={() => handleQuickAction('submit', draft.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.quickActionText, styles.primaryActionText]}>📤 {t(`${ns}.submit`)}</Text>
                    </TouchableOpacity>
                  </>
                )}
                {draft.status === 'submitted' && (
                  <TouchableOpacity
                    style={styles.quickActionButton}
                    onPress={() => handleQuickAction('view', draft.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.quickActionText}>👁️ {t(`${ns}.view`)}</Text>
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={[styles.footerActions, { flexDirection: 'row', direction: layoutDirection }]}>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation?.navigate('field_partner_products_list')}
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonText}>📦 {t(`${ns}.products`)}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.footerButton}
            onPress={() => navigation?.navigate('field_partner_lead_update')}
            activeOpacity={0.8}
          >
            <Text style={styles.footerButtonText}>👤 {t(`${ns}.leads`)}</Text>
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
  header: {
    padding: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    backgroundColor: semanticRoles.surface,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  createButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  createButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: 100,
  },
  draftCard: {
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
  draftHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.md,
  },
  draftInfo: {
    flex: 1,
  },
  draftName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  draftMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 4,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  serviceType: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  arrow: {
    fontSize: 24,
    color: semanticRoles.textMuted,
  },
  quickActions: {
    flexDirection: 'row',
    gap: BTHWANI_SPACING.sm,
    flexWrap: 'wrap',
  },
  quickActionButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingVertical: BTHWANI_SPACING.xs,
    paddingHorizontal: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.sm,
    minWidth: 70,
    alignItems: 'center',
  },
  primaryAction: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  quickActionText: {
    fontSize: 12,
    color: semanticRoles.text,
    fontWeight: '500',
  },
  primaryActionText: {
    color: semanticRoles.primaryCTAText,
  },
  footerActions: {
    position: 'absolute',
    bottom: 0,
    start: 0,
    end: 0,
    flexDirection: 'row',
    padding: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    borderTopWidth: 1,
    borderTopColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  footerButton: {
    flex: 1,
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
  },
  footerButtonText: {
    fontSize: 14,
    color: semanticRoles.text,
    fontWeight: '500',
  },
});

export default AutoFieldPartnerDraftCreate;
