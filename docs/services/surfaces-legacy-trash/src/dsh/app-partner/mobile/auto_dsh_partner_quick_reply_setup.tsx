/**
 * DSH Partner Quick Reply Setup — dsh_partner_quick_reply_setup
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/quick-reply/setup (via @bthwani/api-clients)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TextInput, Switch } from 'react-native';
import { ScreenWrapper, ScreenState, semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  getDshPartnerQuickReplyConfig,
  setupDshPartnerQuickReplies,
  type DshPartnerQuickReplyConfig,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { ServiceIcon } from '../../../mobile/components';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';

type EditableReply = {
  replyId: string;
  title: string;
  message: string;
  categoryId: string;
  isActive: boolean;
};

type EditableCategory = {
  id: string;
  name: string;
  replies: EditableReply[];
};

export const AutoDshPartnerQuickReplySetup: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useI18n();

  const [state, setState] = useState<ScreenState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<EditableCategory[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const data: DshPartnerQuickReplyConfig | null = await getDshPartnerQuickReplyConfig();
      if (!data) {
        setCategories([]);
        setState('empty');
        return;
      }

      const editableCategories: EditableCategory[] = (data.categories ?? []).map((cat) => ({
        id: cat.id,
        name: cat.name ?? cat.id,
        replies: (cat.replies ?? []).map((r) => ({
          replyId: r.id,
          title: r.id,
          message: r.text ?? '',
          categoryId: cat.id,
          isActive: !!r.isActive,
        })),
      }));

      setCategories(editableCategories);
      setState(editableCategories.length ? 'content' : 'empty');
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const screenErrorMessage =
    error || t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.errorMessage');
  const loadingMessage = t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.loadingMessage');
  const emptyMessage = t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.emptyMessage');

  const groupedCount = useMemo(() => {
    return categories.reduce((acc, c) => acc + (c.replies?.length ?? 0), 0);
  }, [categories]);

  const updateReply = useCallback((categoryId: string, replyId: string, patch: Partial<EditableReply>) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id !== categoryId) return cat;
        return {
          ...cat,
          replies: cat.replies.map((r) => (r.replyId === replyId ? { ...r, ...patch } : r)),
        };
      })
    );
  }, []);

  const handleSave = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    setError(null);
    try {
      const payloadReplies = categories.flatMap((cat) =>
        (cat.replies ?? []).map((r) => ({
          id: r.replyId,
          title: String(r.title ?? r.replyId).trim(),
          message: String(r.message ?? '').trim(),
          category: String(r.categoryId ?? cat.id).trim(),
          isActive: r.isActive,
        }))
      );

      const invalidActiveMissingMessage = payloadReplies.some(
        (r) => !!r.isActive && !String(r.message ?? '').trim()
      );
      if (invalidActiveMissingMessage) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.validationMessageRequired'));
      }
      if (payloadReplies.length === 0) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.validationNoReplies'));
      }

      const ok = await setupDshPartnerQuickReplies(payloadReplies);
      if (!ok) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.errorUpdate'));
      }

      setState('success');
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
      setState('error');
    } finally {
      setIsSaving(false);
    }
  }, [categories, isSaving, t]);

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={loadingMessage}
      errorMessage={screenErrorMessage}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.errorActionText')}
      onErrorAction={load}
      emptyMessage={emptyMessage}
      emptyActionText={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.emptyActionText')}
      onEmptyAction={load}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.successMessage')}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.successActionText')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_store_get')}
      screenName="auto_dsh_partner_quick_reply_setup"
      operationName="dsh_partner_quick_reply_setup"
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <ServiceIcon name="reply" size={24} color={semanticRoles.primaryCTA} />
          </View>
          <Text style={styles.headerTitle}>{t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.sectionTitle')}</Text>
          <Text style={styles.headerMeta}>{t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.metaRepliesTemplate', { count: groupedCount })}</Text>
        </View>

        {categories.map((cat) => (
          <View key={cat.id} style={styles.categoryCard}>
            <Text style={styles.categoryTitle}>{cat.name || cat.id}</Text>
            <View style={styles.replies}>
              {cat.replies.map((r) => (
                <View key={r.replyId} style={styles.replyRow}>
                  <View style={styles.replyTop}>
                    <Text style={styles.replyId}>{r.replyId}</Text>
                    <View style={styles.activeSwitch}>
                      <Switch
                        value={r.isActive}
                        onValueChange={(next) => updateReply(cat.id, r.replyId, { isActive: next })}
                        trackColor={{ false: semanticRoles.border, true: BTHWANI_COLORS.primary }}
                        thumbColor={r.isActive ? BTHWANI_COLORS.primaryCTAText : semanticRoles.textMuted}
                      />
                    </View>
                  </View>
                  <TextInput
                    style={styles.input}
                    value={r.message}
                    onChangeText={(text) => updateReply(cat.id, r.replyId, { message: text })}
                    placeholder={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.replyMessagePlaceholder')}
                    placeholderTextColor={semanticRoles.textMuted}
                    multiline
                    numberOfLines={3}
                  />
                </View>
              ))}
            </View>
          </View>
        ))}

        {categories.length ? (
          <TouchableOpacity
            style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={isSaving}
          >
            <Text style={styles.saveButtonText}>{t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_setup.saveButtonText')}</Text>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.lg,
  },
  headerIcon: {
    marginEnd: BTHWANI_SPACING.sm,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  headerMeta: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  categoryCard: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  replies: {
    gap: BTHWANI_SPACING.sm,
  },
  replyRow: {
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.surface,
    marginBottom: BTHWANI_SPACING.sm,
  },
  replyTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.xs,
  },
  replyId: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
  },
  activeSwitch: {
    alignItems: 'center',
  },
  input: {
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
    color: semanticRoles.text,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: BTHWANI_SPACING.xl,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AutoDshPartnerQuickReplySetup;

