/**
 * DSH Partner Store Status Update — dsh_partner_store_status_update
 * Surface: app-partner | Service: dsh
 * Operation: POST /dsh/partner/store/status (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - 1 tap to toggle store status
 * - Full states: Loading/Error/Success
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { safeGoBack } from '../../../shared/navigation/safeGoBack';
import {
  getDshPartnerStoreProfile,
  updateDshPartnerStoreStatus,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface AutoDshPartnerStoreStatusUpdateProps {
  navigation?: any;
}

export const AutoDshPartnerStoreStatusUpdate: React.FC<AutoDshPartnerStoreStatusUpdateProps> = ({ navigation }) => {
  const { t } = useI18n();
  const [currentStatus, setCurrentStatus] = useState<'open' | 'closed'>('open');
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const loadStatus = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const profile = await getDshPartnerStoreProfile();
      if (!profile) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.errorLoadMessage'));
      }
      const status = (profile.status === 'closed' ? 'closed' : 'open') as 'open' | 'closed';
      setCurrentStatus(status);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.errorLoadMessage'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleToggleStatus = useCallback(async () => {
    const newStatus = currentStatus === 'open' ? 'closed' : 'open';
    const NS = 'dsh.app-partner.mobile.auto_dsh_partner_store_status_update';
    const statusText = newStatus === 'open' ? t(`${NS}.openLabel`) : t(`${NS}.k58`);

    Alert.alert(
      t(`${NS}.confirmTitle`, { status: statusText }),
      t(`${NS}.confirmMessage`, { status: statusText }),
      [
        { text: t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.cancelButton'), style: 'cancel' },
        {
          text: t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.confirmButton'),
          onPress: async () => {
            try {
              setIsUpdating(true);
              setError(null);

              const ok = await updateDshPartnerStoreStatus(newStatus);
              if (!ok) {
                throw new Error(t(`${NS}.errorUpdate`));
              }

              setCurrentStatus(newStatus);
              setIsSuccess(true);
              Alert.alert(t(`${NS}.k83`), t(`${NS}.successMessageTemplate`, { status: statusText }), [
                {
                  text: t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.okButton'),
                  onPress: () => safeGoBack(navigation, 'dsh_partner_store_get')
                }
              ]);
            } catch (err) {
              const errorMessage = err instanceof Error ? err.message : t(`${NS}.errorStatusTemplate`, { status: statusText });
              setError(errorMessage);
              Alert.alert(t(`${NS}.k92`), errorMessage);
            } finally {
              setIsUpdating(false);
            }
          }
        }
      ]
    );
  }, [currentStatus, navigation, t]);

  const getState = (): 'loading' | 'error' | 'success' | 'content' => {
    if (isLoading) return 'loading';
    if (isSuccess) return 'success';
    if (error) return 'error';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.loadingMessage')}
      errorMessage={error || t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.errorUnexpectedMessage')}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.retryButton')}
      onErrorAction={loadStatus}
      successMessage={t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.successMessageTemplate', { status: currentStatus === 'open' ? t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.openLabel') : t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.closeButton') })}
      successActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.backButton')}
      onSuccessAction={() => safeGoBack(navigation, 'dsh_partner_store_get')}
      screenName="auto_dsh_partner_store_status_update"
      operationName="dsh_partner_store_status_update"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>تحديث حالة المتجر</Text>
        </View>

        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>الحالة الحالية</Text>
          <View style={[
            styles.statusBadge,
            currentStatus === 'open' ? styles.statusOpen : styles.statusClosed
          ]}>
            <Text style={styles.statusText}>
              {currentStatus === 'open' ? t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.statusClosed') : t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.statusClosed')}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            currentStatus === 'open' ? styles.toggleButtonClose : styles.toggleButtonOpen,
            isUpdating && styles.toggleButtonDisabled
          ]}
          onPress={handleToggleStatus}
          disabled={isUpdating}
        >
          <Text style={styles.toggleButtonText}>
            {isUpdating 
              ? t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.updatingMessage') 
              : currentStatus === 'open' 
                ? t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.actionCloseStore') 
                : t('dsh.app-partner.mobile.auto_dsh_partner_store_status_update.actionOpenStore')
            }
          </Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  header: {
    marginBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
  },
  statusCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.xl,
    alignItems: 'center',
  },
  statusLabel: {
    fontSize: 16,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
  },
  statusOpen: {
    backgroundColor: colorTokens.success['600'],
  },
  statusClosed: {
    backgroundColor: colorTokens.error['500'],
  },
  statusText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  toggleButton: {
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  toggleButtonOpen: {
    backgroundColor: colorTokens.success['600'],
  },
  toggleButtonClose: {
    backgroundColor: colorTokens.error['500'],
  },
  toggleButtonDisabled: {
    opacity: 0.5,
  },
  toggleButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AutoDshPartnerStoreStatusUpdate;

