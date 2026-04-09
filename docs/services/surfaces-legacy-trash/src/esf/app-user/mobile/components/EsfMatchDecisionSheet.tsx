import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useI18n, semanticRoles } from '@bthwani/ui-kit';
import { BTHWANI_RADIUS, BTHWANI_SPACING } from '@bthwani/ui-kit';
import { assertEsfSuccess } from '../../../data/esfDtoMappers';
import { getEsfRestAdapter } from '../../../data/esfRestSingleton';
import type { EsfMatchPreview } from '../../../uiTypes';

interface EsfMatchDecisionSheetProps {
  matchId: string;
  matchPreview: EsfMatchPreview;
  onViewMatchesInbox: () => void;
}

/**
 * Accept/Decline decision UI extracted from `auto_esf_match_get.tsx`.
 * - Accept: Alert confirm + `esf_match_respond` with `accept`.
 * - Decline: reason input modal + Alert confirm + `esf_match_respond` with `decline`.
 */
export const EsfMatchDecisionSheet: React.FC<EsfMatchDecisionSheetProps> = ({
  matchId,
  matchPreview,
  onViewMatchesInbox,
}) => {
  const { t, isRTL } = useI18n();

  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const openDeclineModal = useCallback(() => {
    setDeclineReason('');
    setDeclineModalVisible(true);
  }, []);

  const respondToMatch = useCallback(
    async (decision: 'accept' | 'decline', reason?: string) => {
      const adapter = getEsfRestAdapter();
      const raw = await adapter.matchRespond(matchId, { decision, reason });
      assertEsfSuccess(raw);
    },
    [matchId]
  );

  const submitDecline = useCallback(async () => {
    if (!matchId) return;

    if (!declineReason.trim()) {
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_match_decline.errorTitle'),
        t('esf.app-client.mobile.auto_esf_match_decline.enterDeclineReason')
      );
      return;
    }

    setActionLoading(true);
    try {
      await respondToMatch('decline', declineReason.trim());

      setDeclineModalVisible(false);
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_match_decline.successDeclineMessage'),
        '',
        [
          {
            text: t(
              'esf.app-client.mobile.auto_esf_match_decline.viewMatchesButton'
            ),
            onPress: onViewMatchesInbox,
          },
        ]
      );
    } catch (error) {
      Alert.alert(
        t('esf.app-client.mobile.auto_esf_match_decline.errorTitleAlt'),
        error instanceof Error
          ? error.message
          : t('esf.app-client.mobile.auto_esf_match_decline.errorDeclineMessage')
      );
    } finally {
      setActionLoading(false);
    }
  }, [declineReason, matchId, onViewMatchesInbox, respondToMatch, t]);

  const runAccept = useCallback(() => {
    if (!matchId) return;

    Alert.alert(
      t('esf.app-client.mobile.auto_esf_match_accept.confirmAcceptTitle'),
      t('esf.app-client.mobile.auto_esf_match_accept.confirmAcceptMessage'),
      [
        {
          text: t('esf.app-client.mobile.auto_esf_match_accept.cancelButton'),
          style: 'cancel',
        },
        {
          text: t('esf.app-client.mobile.auto_esf_match_accept.acceptButton'),
          onPress: async () => {
            setActionLoading(true);
            try {
              await respondToMatch('accept');

              Alert.alert(
                t(
                  'esf.app-client.mobile.auto_esf_match_accept.successAcceptMessage'
                )
              );
            } catch (error) {
              Alert.alert(
                t('esf.app-client.mobile.auto_esf_match_accept.errorTitle'),
                error instanceof Error
                  ? error.message
                  : t(
                      'esf.app-client.mobile.auto_esf_match_accept.errorAcceptMessage'
                    )
              );
            } finally {
              setActionLoading(false);
            }
          },
        },
      ]
    );
  }, [matchId, respondToMatch, t]);

  return (
    <>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={[styles.actionButton, styles.acceptButton]}
          onPress={() => void runAccept()}
          disabled={actionLoading || !matchId}
        >
          <Text style={styles.actionButtonText}>
            {actionLoading
              ? t('esf.app-client.mobile.auto_esf_match_accept.acceptingMessage')
              : t('esf.app-client.mobile.auto_esf_match_get.buttonAccept')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.declineButton]}
          onPress={openDeclineModal}
          disabled={actionLoading || !matchId}
        >
          <Text style={styles.actionButtonText}>
            {t('esf.app-client.mobile.auto_esf_match_get.buttonDecline')}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={declineModalVisible}
        transparent
        animationType='slide'
        onRequestClose={() => !actionLoading && setDeclineModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalBackdrop}
        >
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>
              {t('esf.app-client.mobile.auto_esf_match_decline.title')}
            </Text>
            <Text style={styles.modalSubtitle}>
              {t('esf.app-client.mobile.auto_esf_match_decline.subtitle', {
                id: matchPreview.id,
              })}
            </Text>
            <Text style={styles.modalLabel}>
              {t('esf.app-client.mobile.auto_esf_match_decline.reasonLabel')}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder={t(
                'esf.app-client.mobile.auto_esf_match_decline.reasonPlaceholder'
              )}
              placeholderTextColor={semanticRoles.textMuted}
              value={declineReason}
              onChangeText={setDeclineReason}
              multiline
              maxLength={300}
              editable={!actionLoading}
            />

            <View
              style={[
                styles.modalActions,
                { flexDirection: isRTL ? 'row-reverse' : 'row' },
              ]}
            >
              <TouchableOpacity
                style={styles.modalSecondaryBtn}
                onPress={() => setDeclineModalVisible(false)}
                disabled={actionLoading}
              >
                <Text style={styles.modalSecondaryBtnText}>
                  {t('esf.app-client.mobile.auto_esf_match_decline.cancelButton')}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDestructiveBtn}
                onPress={() => {
                  Alert.alert(
                    t(
                      'esf.app-client.mobile.auto_esf_match_decline.confirmDeclineTitle'
                    ),
                    t(
                      'esf.app-client.mobile.auto_esf_match_decline.confirmDeclineMessage'
                    ),
                    [
                      {
                        text: t(
                          'esf.app-client.mobile.auto_esf_match_decline.cancelButton'
                        ),
                        style: 'cancel',
                      },
                      {
                        text: t(
                          'esf.app-client.mobile.auto_esf_match_decline.declineButton'
                        ),
                        style: 'destructive',
                        onPress: () => void submitDecline(),
                      },
                    ]
                  );
                }}
                disabled={actionLoading}
              >
                <Text style={styles.modalDestructiveBtnText}>
                  {t(
                    'esf.app-client.mobile.auto_esf_match_decline.buttonDecline'
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
  actionsContainer: {
    padding: BTHWANI_SPACING.contentH,
    gap: BTHWANI_SPACING.md,
  },
  actionButton: {
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  acceptButton: {
    backgroundColor: semanticRoles.stateSuccess.icon,
  },
  declineButton: {
    backgroundColor: semanticRoles.stateError.icon,
  },
  actionButtonText: {
    color: semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
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
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.sm,
  },
  modalSubtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  modalInput: {
    minHeight: 96,
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

