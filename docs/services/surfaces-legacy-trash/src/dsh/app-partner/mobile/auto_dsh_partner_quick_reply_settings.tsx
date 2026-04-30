import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Switch } from 'react-native';
import {
  BTHWANI_COLORS,
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  ScreenState,
  ScreenWrapper,
  semanticRoles,
  useI18n,
} from '@bthwani/ui-kit';
import {
  getDshPartnerQuickReplyConfig,
  setupDshPartnerQuickReplies,
  type DshPartnerQuickReplyConfig,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

export const AutoDshPartnerQuickReplySettings: React.FC<{ navigation?: any }> = ({
  navigation,
}) => {
  const { t } = useI18n();
  const [state, setState] = useState<ScreenState>('loading');
  const [error, setError] = useState<string | null>(null);
  const [config, setConfig] = useState<DshPartnerQuickReplyConfig | null>(null);
  const [isSaving, setIsSaving] = useState(false);

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
    void load();
  }, [load]);

  const enabledRepliesCount = useMemo(() => {
    if (!config) return 0;
    return config.categories.reduce(
      (sum, c) => sum + c.replies.filter((r) => r.isActive).length,
      0
    );
  }, [config]);

  const totalRepliesCount = useMemo(() => {
    if (!config) return 0;
    return config.categories.reduce((sum, c) => sum + c.replies.length, 0);
  }, [config]);

  const setAllEnabledState = useCallback(
    async (enabled: boolean) => {
      if (!config || isSaving) return;
      setIsSaving(true);
      setError(null);
      try {
        const payload = config.categories.flatMap((cat) =>
          cat.replies.map((reply) => ({
            id: reply.id,
            title: reply.id,
            message: reply.text,
            category: cat.id,
            isActive: enabled,
          }))
        );
        const ok = await setupDshPartnerQuickReplies(payload);
        if (!ok) {
          throw new Error(
            t(
              'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.errorUpdate'
            )
          );
        }
        await load();
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : t(
                'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.errorMessage'
              )
        );
        setState('error');
      } finally {
        setIsSaving(false);
      }
    },
    [config, isSaving, load, t]
  );

  const isEnabled = enabledRepliesCount > 0;

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t(
        'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.loadingMessage'
      )}
      errorMessage={
        error ??
        t(
          'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.errorMessage'
        )
      }
      errorActionText={t(
        'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.errorActionText'
      )}
      onErrorAction={load}
      emptyMessage={t(
        'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.emptyMessage'
      )}
      emptyActionText={t(
        'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.emptyActionText'
      )}
      onEmptyAction={load}
      screenName='auto_dsh_partner_quick_reply_settings'
      operationName='dsh_partner_quick_reply_config_get'
    >
      {config ? (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.title}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.title'
            )}
          </Text>
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.label}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.enabled'
                )}
              </Text>
              <Switch
                value={isEnabled}
                onValueChange={(next) => void setAllEnabledState(next)}
                disabled={isSaving || totalRepliesCount === 0}
                trackColor={{ false: semanticRoles.border, true: BTHWANI_COLORS.primary }}
                thumbColor={
                  isEnabled
                    ? BTHWANI_COLORS.primaryCTAText
                    : semanticRoles.onSurfaceMuted
                }
              />
            </View>
            <Text style={styles.meta}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.repliesStatus',
                {
                  enabled: enabledRepliesCount,
                  total: totalRepliesCount,
                }
              )}
            </Text>
            <Text style={styles.meta}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.maxReplies',
                { max: config.maxReplies }
              )}
            </Text>
          </View>

          {config.categories.map((cat) => (
            <View key={cat.id} style={styles.categoryCard}>
              <Text style={styles.categoryTitle}>{cat.name || cat.id}</Text>
              <Text style={styles.categorySub}>
                {t(
                  'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.categoryCount',
                  { count: cat.replies.length }
                )}
              </Text>
            </View>
          ))}

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => navigation?.navigate?.('dsh_partner_quick_reply_setup')}
          >
            <Text style={styles.editButtonText}>
              {t(
                'dsh.app-partner.mobile.auto_dsh_partner_quick_reply_settings.editButton'
              )}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      ) : null}
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  content: { padding: BTHWANI_SPACING.contentH },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  card: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: BTHWANI_SPACING.sm,
  },
  label: { fontSize: 15, fontWeight: '700', color: semanticRoles.onSurface },
  meta: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: 4 },
  categoryCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  categoryTitle: { fontSize: 14, fontWeight: '700', color: semanticRoles.onSurface },
  categorySub: { fontSize: 12, color: semanticRoles.onSurfaceMuted, marginTop: 4 },
  editButton: {
    marginTop: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.primaryCTA,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: BTHWANI_SPACING.contentH,
  },
  editButtonText: { color: semanticRoles.primaryCTAText, fontSize: 16, fontWeight: '700' },
});

export default AutoDshPartnerQuickReplySettings;
