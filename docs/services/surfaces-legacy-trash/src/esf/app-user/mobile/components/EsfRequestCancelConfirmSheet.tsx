import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { rawFetch } from '@bthwani/api-clients';
import { semanticRoles, useI18n } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

interface EsfRequestCancelConfirmSheetProps {
  requestId: string;
  onViewMyRequests: () => void;
}

/**
 * Cancel confirmation UI extracted from `auto_esf_request_get.tsx`.
 * Uses Modal + reason input + POST cancel.
 */
export const EsfRequestCancelConfirmSheet: React.FC<
  EsfRequestCancelConfirmSheetProps
> = ({ requestId, onViewMyRequests }) => {
  const { t, isRTL } = useI18n();

  const [cancelModalVisible, setCancelModalVisible] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelSubmitting, setCancelSubmitting] = useState(false);

  const open = useCallback(() => {
    setCancelReason('');
    setCancelModalVisible(true);
  }, []);

  const close = useCallback(() => {
    setCancelModalVisible(false);
  }, []);

  const submitCancelRequest = useCallback(async () => {
    if (!cancelReason.trim()) {
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_request_cancel.errorTitle'),
        t('esf.app-client.mobile.auto_esf_request_cancel.enterCancelReason')
      );
      return;
    }

    setCancelSubmitting(true);
    try {
      const response = await rawFetch(
        `${getBaseUrl()}/api/esf/requests/${encodeURIComponent(requestId)}/cancel`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ reason: cancelReason.trim() }),
        }
      );

      if (!response.ok) {
        const errBody = await response.json().catch(() => ({} as any));
        throw new Error(errBody?.error || `HTTP ${response.status}`);
      }

      const json = (await response.json()) as { success?: boolean; error?: string };
      if (!json?.success) {
        throw new Error(
          json?.error ||
            t('esf.app-client.mobile.auto_esf_request_cancel.errorCancelMessage')
        );
      }

      close();
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_request_cancel.successCancelMessage'),
        '',
        [
          {
            text: t('esf.app-client.mobile.auto_esf_request_cancel.viewMyRequestsButton'),
            onPress: onViewMyRequests,
          },
        ]
      );
    } catch (e) {
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_request_cancel.errorTitle'),
        e instanceof Error ? e.message : String(e)
      );
    } finally {
      setCancelSubmitting(false);
    }
  }, [cancelReason, close, onViewMyRequests, requestId, t]);

  return (
    <>
      <TouchableOpacity style={styles.cancelButton} onPress={open}>
        <Text style={styles.cancelButtonText}>✗ إلغاء الطلب</Text>
      </TouchableOpacity>

      <Modal
        visible={cancelModalVisible}
        animationType='slide'
        transparent
        onRequestClose={() => !cancelSubmitting && close()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {t('esf.app-client.mobile.auto_esf_request_cancel.title')}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('esf.app-client.mobile.auto_esf_request_cancel.subtitle', {
                id: requestId,
              })}
            </Text>
            <Text style={styles.modalLabel}>
              {t('esf.app-client.mobile.auto_esf_request_cancel.label')}
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder={t(
                'esf.app-client.mobile.auto_esf_request_cancel.reasonPlaceholder'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={cancelReason}
              onChangeText={setCancelReason}
              multiline
              maxLength={300}
              editable={!cancelSubmitting}
            />

            <View
              style={[
                styles.modalActions,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={close}
                disabled={cancelSubmitting}
              >
                <Text style={styles.modalSecondaryBtnText}>
                  {t('esf.app-client.mobile.auto_esf_request_cancel.cancelButton')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDestructiveBtn}
                onPress={() => void submitCancelRequest()}
                disabled={cancelSubmitting}
              >
                <Text style={styles.modalDestructiveBtnText}>
                  {cancelSubmitting
                    ? t(
                        'esf.app-client.mobile.auto_esf_request_cancel.cancellingMessage'
                      )
                    : t(
                        'esf.app-client.mobile.auto_esf_request_cancel.cancelRequestButton'
                      )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  cancelButton: {
    backgroundColor: semanticRoles.stateError.icon,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '700',
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: semanticRoles.overlay,
    justifyContent: 'flex-end',
  },
  modalCard: {
    backgroundColor: semanticRoles.surface,
    borderTopLeftRadius: BTHWANI_RADIUS.lg,
    borderTopRightRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
    gap: BTHWANI_SPACING.sm,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.text,
  },
  modalSubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginTop: BTHWANI_SPACING.sm,
  },
  modalInput: {
    minHeight: 100,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    fontSize: 16,
    color: semanticRoles.text,
    textAlignVertical: 'top',
  },
  modalActions: {
    marginTop: BTHWANI_SPACING.md,
    gap: BTHWANI_SPACING.sm,
    justifyContent: 'space-between',
  },
  modalSecondaryBtn: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    alignItems: 'center',
  },
  modalSecondaryBtnText: {
    color: semanticRoles.text,
    fontWeight: '600',
  },
  modalDestructiveBtn: {
    flex: 1,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.stateError.icon,
    alignItems: 'center',
  },
  modalDestructiveBtnText: {
    color: semanticRoles.surface,
    fontWeight: '700',
  },
});


