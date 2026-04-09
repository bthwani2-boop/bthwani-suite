// AMN Vehicle Types List — أنواع المركبات (عرض + CTA لطلب الرحلة)
// Surface: app-client | Service: amn

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';

interface auto_amn_vehicle_types_listProps {
  onNavigate?: (screen: string) => void;
  navigation?: {
    navigate: (screen: string, params?: Record<string, unknown>) => void;
  };
}

export const auto_amn_vehicle_types_list: React.FC<
  auto_amn_vehicle_types_listProps
> = ({ onNavigate, navigation }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );
  const vehicleTypes = useMemo(
    () => [
      {
        id: 'standard',
        name: t('amn.app-client.mobile.auto_amn_vehicle_types_list.15'),
        icon: '🚗',
        desc: t('amn.app-client.mobile.auto_amn_vehicle_types_list.15'),
        price: t('amn.app-client.mobile.auto_amn_vehicle_types_list.15'),
      },
      {
        id: 'premium',
        name: t('amn.app-client.mobile.auto_amn_vehicle_types_list.25'),
        icon: '🚙',
        desc: t('amn.app-client.mobile.auto_amn_vehicle_types_list.25'),
        price: t('amn.app-client.mobile.auto_amn_vehicle_types_list.25'),
      },
      {
        id: 'luxury',
        name: t('amn.app-client.mobile.auto_amn_vehicle_types_list.40'),
        icon: '🏎️',
        desc: t('amn.app-client.mobile.auto_amn_vehicle_types_list.40'),
        price: t('amn.app-client.mobile.auto_amn_vehicle_types_list.40'),
      },
    ],
    [t]
  );
  const [state, setState] = useState<ScreenState>('loading');

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) {
        if (params)
          (
            navigation as { navigate: (s: string, p?: object) => void }
          ).navigate(screen, params);
        else navigation.navigate(screen);
      } else if (onNavigate) onNavigate(screen);
    },
    [navigation, onNavigate]
  );

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      await new Promise(r => setTimeout(r, 400));
      if (!cancelled) setState('content');
    };
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 400);
  };

  if (state === 'content') {
    return (
      <ScreenWrapper state='content'>
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.scrollContent}
        >
          <Text style={[styles.title, textAlignStart]}>أنواع المركبات</Text>
          <Text style={[styles.subtitle, textAlignStart]}>
            اختر نوع الخدمة ثم اطلب الرحلة
          </Text>
          {vehicleTypes.map((v) => (
            <TouchableOpacity
              key={v.id}
              style={styles.card}
              onPress={() =>
                handleNavigate('AmnTripCreate', { rideType: v.id })
              }
              activeOpacity={0.8}
            >
              <Text style={styles.cardIcon}>{v.icon}</Text>
              <View style={styles.cardBody}>
                <Text style={[styles.cardName, textAlignStart]}>{v.name}</Text>
                <Text style={[styles.cardDesc, textAlignStart]}>{v.desc}</Text>
                <Text style={[styles.cardPrice, textAlignStart]}>
                  {v.price}
                </Text>
              </View>
              <Text style={styles.cardArrow}>←</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={styles.cta}
            onPress={() => handleNavigate('AmnTripCreate')}
          >
            <Text style={styles.ctaText}>طلب رحلة</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('amn.app-client.mobile.auto_amn_vehicle_types_list.loadingMessage')}
      errorMessage={t('amn.app-client.mobile.auto_amn_vehicle_types_list.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName='auto_amn_vehicle_types_list'
      operationName='amn_vehicle_types_list'
    />
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: semanticRoles.surfaceSubtle },
  scrollContent: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  title: { fontSize: 18, fontWeight: '600', color: semanticRoles.text },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.sm,
    marginBottom: BTHWANI_SPACING.lg,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.lg,
    marginBottom: BTHWANI_SPACING.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
  },
  cardIcon: { fontSize: 28, marginStart: BTHWANI_SPACING.md },
  cardBody: { flex: 1 },
  cardName: { fontSize: 16, fontWeight: '600', color: semanticRoles.text },
  cardDesc: { fontSize: 12, color: semanticRoles.textMuted, marginTop: 2 },
  cardPrice: { fontSize: 12, color: semanticRoles.primaryCTA, marginTop: 2 },
  cardArrow: { fontSize: 18, color: semanticRoles.textMuted },
  cta: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    marginTop: BTHWANI_SPACING.xl,
  },
  ctaText: {
    color: semanticRoles.primaryCTAText ?? semanticRoles.surface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_amn_vehicle_types_list;

