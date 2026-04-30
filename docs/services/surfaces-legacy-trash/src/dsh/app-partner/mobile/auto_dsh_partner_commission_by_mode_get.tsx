import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import {
  BTHWANI_COLORS,
  BTHWANI_RADIUS,
  BTHWANI_SPACING,
  ScreenWrapper,
  semanticRoles,
  useI18n,
} from '@bthwani/ui-kit';

type ModeCommission = {
  mode: 'platform_delivery' | 'merchant_delivery' | 'pickup';
  commissionPercent: number;
  descriptionKey: string;
};

const MODE_COMMISSIONS: ModeCommission[] = [
  {
    mode: 'platform_delivery',
    commissionPercent: 22,
    descriptionKey:
      'dsh.app-partner.mobile.auto_dsh_partner_commission_by_mode_get.descPlatformDelivery',
  },
  {
    mode: 'merchant_delivery',
    commissionPercent: 12,
    descriptionKey:
      'dsh.app-partner.mobile.auto_dsh_partner_commission_by_mode_get.descMerchantDelivery',
  },
  {
    mode: 'pickup',
    commissionPercent: 8,
    descriptionKey:
      'dsh.app-partner.mobile.auto_dsh_partner_commission_by_mode_get.descPickup',
  },
];

export const AutoDshPartnerCommissionByModeGet: React.FC = () => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(
    () => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }),
    [isRTL]
  );

  return (
    <ScreenWrapper state='content'>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.title, textAlignStart]}>
          {t(
            'dsh.app-partner.mobile.auto_dsh_partner_commission_by_mode_get.title'
          )}
        </Text>
        <Text style={[styles.subtitle, textAlignStart]}>
          {t(
            'dsh.app-partner.mobile.auto_dsh_partner_commission_by_mode_get.subtitle'
          )}
        </Text>

        {MODE_COMMISSIONS.map((item) => (
          <View key={item.mode} style={styles.card}>
            <View style={styles.row}>
              <Text style={[styles.modeName, textAlignStart]}>
                {t(
                  `dsh.app-partner.mobile.auto_dsh_partner_commission_by_mode_get.mode.${item.mode}`
                )}
              </Text>
              <Text style={styles.percent}>{item.commissionPercent}%</Text>
            </View>
            <Text style={[styles.desc, textAlignStart]}>{t(item.descriptionKey)}</Text>
          </View>
        ))}

        <View style={styles.noteCard}>
          <Text style={[styles.noteText, textAlignStart]}>
            {t(
              'dsh.app-partner.mobile.auto_dsh_partner_commission_by_mode_get.note'
            )}
          </Text>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: BTHWANI_SPACING.contentH,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 13,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.md,
  },
  card: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.outline,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  modeName: {
    fontSize: 15,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    flex: 1,
  },
  percent: {
    fontSize: 18,
    fontWeight: '800',
    color: semanticRoles.primaryCTA,
  },
  desc: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    lineHeight: 18,
  },
  noteCard: {
    marginTop: BTHWANI_SPACING.sm,
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.md,
    borderWidth: 1,
    borderColor: semanticRoles.border,
    padding: BTHWANI_SPACING.md,
  },
  noteText: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    lineHeight: 18,
  },
});

export default AutoDshPartnerCommissionByModeGet;
