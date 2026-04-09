/**
 * DSH Partner Quick Reply Config Get — dsh_partner_quick_reply_config_get
 * Surface: app-partner | Service: dsh
 * Operation: GET /dsh/partner/quick-reply/config (via @bthwani/api-clients)
 */

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import { ScreenWrapper, ScreenState, semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { getDshPartnerQuickReplyConfig, type DshPartnerQuickReplyConfig } from '@bthwani/api-clients/dsh/dsh-field-partner-api';
import { ServiceIcon } from '../../../mobile/components';

export const AutoDshPartnerQuickReplyConfigGet: React.FC<{ navigation?: any }> = ({ navigation }) => {
  const { t } = useI18n();

  const [state, setState] = useState<ScreenState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<DshPartnerQuickReplyConfig | null>(null);

  const load = useCallback(async () => {
    setState('loading');
    setError(null);
    try {
      const data = await getDshPartnerQuickReplyConfig();
      setConfig(data);
      setState(data ? 'content' : 'empty');
    } catch (e) {
      setError(e instanceof Error ? e.message : null);
      setState('error');
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const screenErrorMessage =
    error || t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.errorMessage');

  const enabledLabel = useMemo(() => {
    if (!config) return '';
    return config.enabled ? t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.enabledTrue') : t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.enabledFalse');
  }, [config, t]);

  const handleGoSetup = () => {
    navigation?.navigate('dsh_partner_quick_reply_setup');
  };

  const emptyMessage = t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.emptyMessage');

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.loadingMessage')}
      errorMessage={screenErrorMessage}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.errorActionText')}
      onErrorAction={load}
      emptyMessage={emptyMessage}
      emptyActionText={t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.emptyActionText')}
      onEmptyAction={load}
      screenName="auto_dsh_partner_quick_reply_config_get"
      operationName="dsh_partner_quick_reply_config_get"
    >
      {config ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.section}>
            <View style={styles.enabledRow}>
              <View style={styles.enabledIcon}>
                <ServiceIcon name="reply" size={20} color={semanticRoles.primaryCTA} />
              </View>
              <Text style={styles.enabledText}>
                {t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.enabledLabel')}: {enabledLabel}
              </Text>
              <Switch
                value={config.enabled}
                disabled
                trackColor={{ false: semanticRoles.border, true: BTHWANI_COLORS.primary }}
                thumbColor={config.enabled ? BTHWANI_COLORS.primaryCTAText : semanticRoles.textMuted}
              />
            </View>

            <Text style={styles.metaText}>
              {t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.maxRepliesLabel')}: {config.maxReplies}
            </Text>
          </View>

          <Text style={styles.sectionTitle}>
            {t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.categoriesTitle')}
          </Text>

          {config.categories.map((cat) => (
            <View key={cat.id} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{cat.name || cat.id}</Text>
              <Text style={styles.categorySub}>
                {t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.repliesCountTemplate', {
                  total: cat.replies?.length ?? 0,
                })}
              </Text>

              {cat.replies.map((r) => (
                <View key={r.id} style={styles.replyRow}>
                  <Text style={styles.replyMessage} numberOfLines={2}>
                    {r.text || r.id}
                  </Text>
                  <Text style={[styles.replyStatus, { color: r.isActive ? semanticRoles.success : semanticRoles.textMuted }]}>
                    {r.isActive
                      ? t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.activeLabel')
                      : t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.inactiveLabel')}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          <TouchableOpacity style={styles.setupButton} onPress={handleGoSetup}>
            <Text style={styles.setupButtonText}>
              {t('dsh.app-partner.mobile.auto_dsh_partner_quick_reply_config_get.editButtonText')}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: {
    padding: BTHWANI_SPACING.contentH,
  },
  section: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.lg,
  },
  enabledRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: BTHWANI_SPACING.sm,
  },
  enabledIcon: {
    width: 32,
    alignItems: 'center',
  },
  enabledText: {
    flex: 1,
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
  metaText: {
    marginTop: BTHWANI_SPACING.sm,
    color: semanticRoles.textMuted,
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  categoryCard: {
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  categorySub: {
    fontSize: 13,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  replyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: BTHWANI_SPACING.md,
    paddingVertical: BTHWANI_SPACING.xs,
  },
  replyMessage: {
    flex: 1,
    color: semanticRoles.text,
    fontSize: 14,
  },
  replyStatus: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'auto',
  },
  setupButton: {
    marginTop: BTHWANI_SPACING.xl,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  setupButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '700',
  },
});

export default AutoDshPartnerQuickReplyConfigGet;

