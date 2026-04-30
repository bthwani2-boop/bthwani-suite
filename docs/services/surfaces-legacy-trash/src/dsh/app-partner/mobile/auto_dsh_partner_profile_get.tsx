/**
 * DSH Partner Profile Get — dsh_partner_profile_get
 * Surface: app-partner | Service: dsh
 * Operation: GET /api/dsh/partner/profile
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - Full states: Loading/Error/Empty/Offline/Success
 * - Store hero shared with Account hub (PartnerAccountStoreHero)
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import {
  ScreenWrapper,
  semanticRoles,
  BTHWANI_COLORS,
  BTHWANI_SPACING,
  BTHWANI_RADIUS,
} from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import {
  buildPartnerProfileScreenFixture,
  type PartnerProfileHeroFixture,
} from '../../fixtures/partnerStaff';
import { PartnerAccountStoreHero } from '../../../mobile/app-partner/components/PartnerAccountStoreHero';

const I18N_NS = 'dsh.app-partner.mobile.auto_dsh_partner_profile_get';

export interface PartnerProfileData {
  name: string;
  email: string;
  phone: string;
  registration_number: string;
  tax_number: string;
  hero: PartnerProfileHeroFixture;
}

interface AutoDshPartnerProfileGetProps {
  navigation?: unknown;
}

export const AutoDshPartnerProfileGet: React.FC<
  AutoDshPartnerProfileGetProps
> = () => {
  const { t, isRTL } = useI18n();

  const [profileData, setProfileData] = useState<PartnerProfileData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const infoRowDir = useMemo(
    () => (isRTL ? styles.rowReverse : styles.rowLtr),
    [isRTL],
  );

  const valueTextAlign = useMemo<'left' | 'right'>(
    () => (isRTL ? 'left' : 'right'),
    [isRTL],
  );

  const loadProfile = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setIsOffline(false);

      await new Promise(resolve => setTimeout(resolve, 600));
      const base = buildPartnerProfileScreenFixture();
      setProfileData({
        ...base,
        name: t(`${I18N_NS}.mockStoreName`),
      });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : t(`${I18N_NS}.errorLoadMessage`);
      setError(errorMessage);

      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        setIsOffline(true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [t]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const getState = (): 'loading' | 'error' | 'empty' | 'content' => {
    if (isLoading && !isRefreshing) return 'loading';
    if (isOffline) return 'error';
    if (error) return 'error';
    if (!profileData) return 'empty';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t(`${I18N_NS}.loadingMessage`)}
      errorMessage={
        isOffline
          ? t(`${I18N_NS}.errorMessage`)
          : error || t(`${I18N_NS}.errorMessage`)
      }
      errorActionText={t(`${I18N_NS}.retryButton`)}
      onErrorAction={() => void loadProfile()}
      emptyMessage={t(`${I18N_NS}.profileNotFound`)}
      emptyActionText={t(`${I18N_NS}.retryButton_82`)}
      onEmptyAction={() => void loadProfile()}
      screenName="auto_dsh_partner_profile_get"
      operationName="dsh_partner_profile_get"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void loadProfile(true)}
          />
        }
      >
        {profileData?.hero ? (
          <PartnerAccountStoreHero hero={profileData.hero} />
        ) : null}

        <View style={styles.header}>
          <Text style={styles.title}>{t(`${I18N_NS}.screenTitle`)}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t(`${I18N_NS}.sectionStoreInfo`)}
          </Text>
          <View style={[styles.infoRow, infoRowDir]}>
            <Text style={styles.infoLabel}>{t(`${I18N_NS}.labelName`)}:</Text>
            <Text style={[styles.infoValue, { textAlign: valueTextAlign }]}>
              {profileData?.name ?? '-'}
            </Text>
          </View>
          <View style={[styles.infoRow, infoRowDir]}>
            <Text style={styles.infoLabel}>
              {t(`${I18N_NS}.labelEmail`)}:
            </Text>
            <Text style={[styles.infoValue, { textAlign: valueTextAlign }]}>
              {profileData?.email ?? '-'}
            </Text>
          </View>
          <View style={[styles.infoRow, infoRowDir, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>
              {t(`${I18N_NS}.labelPhone`)}:
            </Text>
            <Text style={[styles.infoValue, { textAlign: valueTextAlign }]}>
              {profileData?.phone ?? '-'}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {t(`${I18N_NS}.sectionRegistration`)}
          </Text>
          <View style={[styles.infoRow, infoRowDir]}>
            <Text style={styles.infoLabel}>
              {t(`${I18N_NS}.labelRegistrationNumber`)}:
            </Text>
            <Text style={[styles.infoValue, { textAlign: valueTextAlign }]}>
              {profileData?.registration_number ?? '-'}
            </Text>
          </View>
          <View style={[styles.infoRow, infoRowDir, styles.infoRowLast]}>
            <Text style={styles.infoLabel}>
              {t(`${I18N_NS}.labelTaxNumber`)}:
            </Text>
            <Text style={[styles.infoValue, { textAlign: valueTextAlign }]}>
              {profileData?.tax_number ?? '-'}
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  content: {
    padding: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl * 2,
  },
  rowLtr: {
    flexDirection: 'row',
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  header: {
    marginBottom: BTHWANI_SPACING.md,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: semanticRoles.text,
  },
  section: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  infoRow: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
    gap: BTHWANI_SPACING.sm,
  },
  infoRowLast: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    color: semanticRoles.text,
    flex: 1,
    fontWeight: '600',
  },
});

export default AutoDshPartnerProfileGet;
