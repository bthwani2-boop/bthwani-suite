// Auto-generated screen for amn_captains_nearby
// Surface: app-client | Service: amn
// عند الضغط على «اختيار»: تأكيد ثم التوجيه إلى AmnTripCreate مع السائق المختار (لإكمال طلب الرحلة).

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';

interface Captain {
  id: string;
  name: string;
  vehicle: string;
  rating: number;
  distance: string;
  eta: string;
}

interface auto_amn_captains_nearbyProps {
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  route?: { params?: Record<string, unknown> };
}

export const auto_amn_captains_nearby: React.FC<
  auto_amn_captains_nearbyProps
> = ({ navigation, onNavigate, route }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [state, setState] = useState<ScreenState>('loading');

  const navigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        navigation.navigate(screen, params);
      } else if (onNavigate) {
        (onNavigate as (s: string, p?: Record<string, unknown>) => void)(
          screen,
          params
        );
      }
    },
    [navigation, onNavigate]
  );

  const handleSelectCaptain = useCallback(
    (captain: Captain) => {
      Alert.alert(
        t('amn.app-client.mobile.auto_amn_captains_nearby.selected'),
        `تم اختيار ${captain.name} (${captain.vehicle}). سيتم توجيهك لإنشاء الرحلة.`,
        [
          {
            text: t('amn.app-client.mobile.auto_amn_captains_nearby.cancelButton'),
            style: 'cancel',
          },
          {
            text: t('amn.app-client.mobile.auto_amn_captains_nearby.continue'),
            onPress: () => {
              const params = route?.params ?? {};
              navigate('AmnTripCreate', {
                ...params,
                selectedCaptainId: captain.id,
                selectedCaptainName: captain.name,
                selectedCaptainVehicle: captain.vehicle,
                selectedCaptainEta: captain.eta,
              });
            },
          },
        ]
      );
    },
    [navigate, route?.params]
  );

  useEffect(() => {
    // No dev preview simulation; when captain search is wired, replace empty state with live data.
    setState('empty');
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_captains_nearby.loadingMessage')}
      emptyMessage={t('amn.app-client.mobile.auto_amn_captains_nearby.noDriversAvailable')}
      emptyActionText={t('amn.app-client.mobile.auto_amn_captains_nearby.refreshSearch')}
      onEmptyAction={() => setState('loading')}
      errorMessage={t('amn.app-client.mobile.auto_amn_captains_nearby.errorMessage')}
      onErrorAction={handleRetry}
      screenName='auto_amn_captains_nearby'
      operationName='amn_captains_nearby'
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    textAlign: 'center',
    padding: BTHWANI_SPACING.contentH,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.onSurfaceMuted,
    textAlign: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  listContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  captainCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colorTokens.neutral['950'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  captainInfo: {
    flex: 1,
  },
  captainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  captainName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
  },
  ratingBadge: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.sm,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.sm,
  },
  ratingText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 12,
    fontWeight: '600',
  },
  vehicle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  locationInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  distance: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  eta: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  selectButton: {
    backgroundColor: semanticRoles.primaryCTA,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    marginStart: BTHWANI_SPACING.md,
  },
  selectText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default auto_amn_captains_nearby;

