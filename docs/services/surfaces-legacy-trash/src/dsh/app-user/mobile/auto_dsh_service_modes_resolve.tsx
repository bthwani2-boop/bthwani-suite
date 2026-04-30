// Auto-generated screen for dsh_service_modes_resolve
// Surface: app-client | Service: dsh
// §30 States: Loading / Error / Empty / Success / Content
// اختيار نمط التوصيل (نوع التوصيل) حسب اتفاقية الشريك — توصيل المنصة (افتراضي) | استلم بنفسك | توصيل الشريك. DSH_PARTNER_AGREEMENT_AND_CHECKOUT_SPEC.

function getBaseUrl(): string {
  let baseUrl = (process.env.EXPO_PUBLIC_API_URL || '').replace(/\/+$/, '');
  if (baseUrl.endsWith('/api')) baseUrl = baseUrl.slice(0, -4);
  return baseUrl;
}

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import type { DshDeliveryModeId } from '../../deliveryModes';
import { getDshDeliveryModes } from '../../deliveryModes';
import { getDshDeliveryChoiceCopy } from '../../checkoutConstants';
import type { DshPaymentMethodType } from '../../checkoutConstants';
import { rawFetch } from '@bthwani/api-clients';

const DELIVERY_TYPE_IDS: DshDeliveryModeId[] = ['platform_delivery', 'merchant_delivery', 'pickup', 'dark_store'];

interface auto_dsh_service_modes_resolveProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  route?: { params?: { paymentMethod?: DshPaymentMethodType; storeId?: string } };
}

export const auto_dsh_service_modes_resolve: React.FC<auto_dsh_service_modes_resolveProps> = ({
  onNavigate,
  navigation,
  route,
}) => {
  const { t } = useI18n();
  const deliveryModes = useMemo(() => getDshDeliveryModes(t), [t]);
  const [state, setState] = useState<ScreenState>('loading');
  const [availableModes, setAvailableModes] = useState<Record<DshDeliveryModeId, boolean>>({
    platform_delivery: true,
    merchant_delivery: true,
    pickup: true,
    dark_store: false,
  });
  const [selectedMode, setSelectedMode] = useState<DshDeliveryModeId>('platform_delivery');

  const storeId = route?.params?.storeId;

  const loadServiceModes = useCallback(async () => {
    try {
      if (!storeId) {
        setState('content');
        return;
      }
      const url = `${getBaseUrl()}/api/dsh/stores/${encodeURIComponent(storeId)}/service-modes`;
      const res = await rawFetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.success) throw new Error(json?.error || 'Fetch failed');
      const data = json?.data;
      const deliveryModes = data?.deliveryModes as Record<string, boolean> | undefined;
      if (deliveryModes && typeof deliveryModes === 'object') {
        setAvailableModes({
          platform_delivery: Boolean(deliveryModes.platform_delivery),
          merchant_delivery: Boolean(deliveryModes.merchant_delivery),
          pickup: Boolean(deliveryModes.pickup),
          dark_store: Boolean(deliveryModes.dark_store),
        });
        const firstEnabled =
          (DELIVERY_TYPE_IDS.find((id) => deliveryModes[id]) as DshDeliveryModeId) ?? 'platform_delivery';
        setSelectedMode(firstEnabled);
      } else if (data && typeof data.service_modes === 'object') {
        const sm = data.service_modes as { delivery?: { enabled?: boolean }; pickup?: { enabled?: boolean } };
        const modes: Record<DshDeliveryModeId, boolean> = {
          platform_delivery: Boolean(sm.delivery?.enabled),
          merchant_delivery: false,
          pickup: Boolean(sm.pickup?.enabled),
          dark_store: false,
        };
        setAvailableModes(modes);
        const firstEnabled: DshDeliveryModeId = modes.platform_delivery ? 'platform_delivery' : modes.pickup ? 'pickup' : 'platform_delivery';
        setSelectedMode(firstEnabled);
      }
      setState('content');
    } catch {
      setState('error');
    }
  }, [storeId]);

  useEffect(() => {
    void loadServiceModes();
  }, [loadServiceModes]);

  const handleRetry = () => {
    setState('loading');
    void loadServiceModes();
  };

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) {
      (navigation.navigate as (s: string, p?: Record<string, unknown>) => void)(screen, params);
    } else if (onNavigate) {
      (onNavigate as (s: string, p?: Record<string, unknown>) => void)(screen, params);
    }
  };

  const options = DELIVERY_TYPE_IDS.filter((id) => availableModes[id]);
  const showChoiceCopy = options.length > 1;

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.title')}</Text>
            <Text style={styles.subtitle}>
              {showChoiceCopy ? getDshDeliveryChoiceCopy(t) : t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.choiceCopyDefault')}
            </Text>
          </View>

          <View style={styles.modesGrid}>
            {options.map((modeId) => {
              const mode = deliveryModes[modeId];
              const isSelected = selectedMode === modeId;
              const isDefault = modeId === 'platform_delivery';
              return (
                <TouchableOpacity
                  key={modeId}
                  style={[styles.modeCard, isSelected && styles.selectedModeCard]}
                  onPress={() => setSelectedMode(modeId)}
                >
                  <Text style={styles.modeIcon}>{modeId === 'pickup' ? '🏪' : modeId === 'platform_delivery' ? '🚚' : '📦'}</Text>
                  <Text style={styles.modeName}>{mode.labelAr}</Text>
                  {isDefault && (
                    <View style={styles.recommendedBadge}>
                      <Text style={styles.recommendedText}>{t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.recommendedText')}</Text>
                    </View>
                  )}
                  {isSelected && (
                    <View style={styles.selectedIndicator}>
                      <Text style={styles.selectedText}>✓ محدد</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {options.length === 0 && (
            <View style={styles.emptyModes}>
              <Text style={styles.emptyModesText}>لا توجد طرق توصيل متاحة لهذا المتجر.</Text>
            </View>
          )}

          <TouchableOpacity
            style={[styles.confirmButton, options.length === 0 && styles.disabledButton]}
            onPress={() => {
              if (options.length === 0) return;
              handleNavigate('DshOrderCreate', {
                paymentMethod: route?.params?.paymentMethod ?? 'wlt',
                deliveryMode: selectedMode,
                ...(storeId != null && { storeId }),
              });
            }}
            disabled={options.length === 0}
          >
            <Text style={[styles.confirmText, options.length === 0 && styles.disabledText]}>
              {options.length ? t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.confirmOrderLabel') : t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.noModesText')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate('DshCheckoutGate', route?.params ? { storeId: route.params.storeId } : undefined)}>
            <Text style={styles.backText}>{t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.backText')}</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_service_modes_resolve.errorMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_service_modes_resolve"
      operationName="dsh_service_modes_resolve"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    padding: BTHWANI_SPACING.contentH,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
  },
  modesGrid: {
    padding: BTHWANI_SPACING.contentH,
  },
  modeCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    position: 'relative',
  },
  selectedModeCard: {
    borderColor: semanticRoles.primaryCTA,
    backgroundColor: semanticRoles.stateInfo.background,
  },
  modeIcon: {
    fontSize: 32,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  modeName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    textAlign: 'center',
  },
  recommendedBadge: {
    position: 'absolute',
    top: BTHWANI_SPACING.sm,
    start: BTHWANI_SPACING.sm,
    backgroundColor: semanticRoles.stateSuccess.icon,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: 2,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  recommendedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  selectedIndicator: {
    position: 'absolute',
    top: BTHWANI_SPACING.md,
    end: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  selectedText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
  emptyModes: {
    padding: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  emptyModesText: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
  },
  confirmButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: semanticRoles.surface,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  confirmText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
  disabledText: {
    color: semanticRoles.onSurfaceMuted,
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  backText: {
    color: semanticRoles.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_service_modes_resolve;

