// Auto-generated screen for dsh_order_issue_flag
// Surface: app-client | Service: dsh | Operation: POST /api/dsh/orders/:order_id/issues
// §30 States: Loading / Error / Success / Content — أقل نقرات، مسار واضح

function getBaseUrl(): string {
  let baseUrl = (
    process.env.EXPO_PUBLIC_API_URL || ''
  ).replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useCallback } from 'react';
import { rawFetch } from '@bthwani/api-clients';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface Props {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  route?: { params?: { orderId?: string } };
}

export const auto_dsh_order_issue_flag: React.FC<Props> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const [orderId, setOrderId] = useState(() => route?.params?.orderId ?? '');

  const issueTypes = useMemo(
    () => [
      {
        value: 'delay',
        label: t('dsh.app-client.mobile.auto_dsh_order_issue_flag.issueTypeDeliveryDelay'),
      },
      {
        value: 'missing_item',
        label: t('dsh.app-client.mobile.auto_dsh_order_issue_flag.issueTypeMissingItem'),
      },
      {
        value: 'wrong_item',
        label: t('dsh.app-client.mobile.auto_dsh_order_issue_flag.issueTypeWrongItem'),
      },
      {
        value: 'quality',
        label: t('dsh.app-client.mobile.auto_dsh_order_issue_flag.issueTypeQuality'),
      },
      {
        value: 'other',
        label: t('dsh.app-client.mobile.auto_dsh_order_issue_flag.issueTypeOther'),
      },
    ],
    [t]
  );
  const [issueType, setIssueType] = useState<string>('other');
  const [description, setDescription] = useState('');
  const [state, setState] = useState<ScreenState>('content');
  const [success, setSuccess] = useState(false);

  const submit = useCallback(async () => {
    const id = (orderId || (route?.params?.orderId ?? '')).trim();
    if (!id) {
      setState('error');
      return;
    }
    setState('loading');
    try {
      const url = `${getBaseUrl()}/api/dsh/orders/${encodeURIComponent(id)}/issues`;
      const res = await rawFetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          issueType,
          description: description.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Flag failed');
      setSuccess(true);
      setState('content');
    } catch {
      setState('error');
    }
  }, [orderId, route?.params?.orderId, issueType, description]);

  const handleRetry = () => {
    setState('content');
    void submit();
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) navigation.navigate(screen);
    else if (onNavigate) onNavigate(screen);
  };

  if (state === 'loading') {
    return (
      <ScreenWrapper
        state='loading'
        loadingMessage={t('dsh.app-client.mobile.auto_dsh_order_issue_flag.loadingMessage')}
        screenName='auto_dsh_order_issue_flag'
        operationName='dsh_order_issue_flag'
      />
    );
  }

  if (state === 'error') {
    return (
      <ScreenWrapper
        state='error'
        errorMessage={t('dsh.app-client.mobile.auto_dsh_order_issue_flag.errorMessage')}
        onErrorAction={handleRetry}
        screenName='auto_dsh_order_issue_flag'
        operationName='dsh_order_issue_flag'
      />
    );
  }

  return (
    <ScreenWrapper state='content'>
      <View style={styles.container}>
        <Text style={[styles.title, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_issue_flag.title')}</Text>
        <Text style={[styles.subtitle, textAlignStart]}>
          {t('dsh.app-client.mobile.auto_dsh_order_issue_flag.subtitleOrderId')}
        </Text>
        <TextInput
          style={[styles.input, textAlignStart]}
          value={orderId}
          onChangeText={setOrderId}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_issue_flag.placeholderOrderId')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
        />
        <Text style={[styles.subtitle, textAlignStart]}>{t('dsh.app-client.mobile.auto_dsh_order_issue_flag.labelIssueType')}</Text>
        <View style={styles.optionsRow}>
          {issueTypes.map(opt => (
            <TouchableOpacity
              key={opt.value}
              style={[
                styles.optionButton,
                issueType === opt.value && styles.optionButtonActive,
              ]}
              onPress={() => setIssueType(opt.value)}
            >
              <Text
                style={[
                  styles.optionText,
                  issueType === opt.value && styles.optionTextActive,
                ]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[styles.subtitle, textAlignStart]}>وصف (اختياري)</Text>
        <TextInput
          style={[styles.input, textAlignStart, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder={t('dsh.app-client.mobile.auto_dsh_order_issue_flag.placeholderDetails')}
          placeholderTextColor={semanticRoles.onSurfaceMuted}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={() => void submit()}
          disabled={!orderId.trim()}
        >
          <Text style={styles.primaryButtonText}>إبلاغ</Text>
        </TouchableOpacity>
        {success && (
          <View style={styles.result}>
            <Text style={[styles.resultText, textAlignStart]}>
              {t('dsh.app-client.mobile.auto_dsh_order_issue_flag.resultText')}
            </Text>
          </View>
        )}
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => handleNavigate('DshOrdersList')}
        >
          <Text style={styles.secondaryButtonText}>{t('dsh.app-client.mobile.auto_dsh_order_issue_flag.secondaryButtonText')}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.onSurface },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.xs,
  },
  input: {
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.lg,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  optionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.md,
  },
  optionButton: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  optionButtonActive: {
    backgroundColor: semanticRoles.primaryCTA,
    borderColor: semanticRoles.primaryCTA,
  },
  optionText: { fontSize: 14, color: semanticRoles.onSurface },
  optionTextActive: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  primaryButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  primaryButtonText: { color: semanticRoles.primaryCTAText, fontWeight: '600' },
  result: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  resultText: { fontSize: 14, color: semanticRoles.onSurface },
  secondaryButton: {
    padding: BTHWANI_SPACING.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    borderRadius: BTHWANI_RADIUS.md,
  },
  secondaryButtonText: { color: semanticRoles.onSurface, fontWeight: '600' },
});

export default auto_dsh_order_issue_flag;

