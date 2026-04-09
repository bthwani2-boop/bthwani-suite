/**
 * DSH Partner Store Get — dsh_partner_store_get
 * Surface: app-partner | Service: dsh
 * Operation: GET /dsh/partner/profile (via api-clients)
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - Full states: Loading/Error/Empty/Offline/Success
 */

import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import {ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { getDshPartnerStoreProfile } from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface AutoDshPartnerStoreGetProps {
  navigation?: any;
  route?: { params?: { storeId?: string } };
}

export const AutoDshPartnerStoreGet: React.FC<AutoDshPartnerStoreGetProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const selectedStoreId = route?.params?.storeId?.trim() || '';
  const [storeData, setStoreData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const loadStore = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);
      setIsOffline(false);

      const data = await getDshPartnerStoreProfile();
      if (!data) {
        throw new Error(t('dsh.app-partner.mobile.auto_dsh_partner_store_get.errorLoadMessage'));
      }
      setStoreData({
        name: data.name ?? '',
        status: data.status ?? 'open',
        address: data.address ?? '',
        phone: data.phone ?? '',
        email: data.email ?? '',
      });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_store_get.errorLoadMessage');
      setError(errorMessage);
      
      if (errorMessage.includes('timeout') || errorMessage.includes('network')) {
        setIsOffline(true);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadStore();
  }, [loadStore]);

  const handleEdit = () => {
    navigation?.navigate('dsh_partner_store_update');
  };

  const getState = (): 'loading' | 'error' | 'empty' | 'offline' | 'content' => {
    if (isLoading && !isRefreshing) return 'loading';
    if (isOffline) return 'offline';
    if (error) return 'error';
    if (!storeData) return 'empty';
    return 'content';
  };

  const currentState = getState();
  const screenState: 'loading' | 'empty' | 'error' | 'content' = 
    currentState === 'offline' ? 'error' : currentState;

  return (
    <ScreenWrapper
      state={screenState}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_store_get.loadingMessage')}
      errorMessage={isOffline ? t('dsh.app-partner.mobile.auto_dsh_partner_store_get.errorMessage') : (error || t('dsh.app-partner.mobile.auto_dsh_partner_store_get.errorMessage'))}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_get.retryButton')}
      onErrorAction={() => loadStore()}
      emptyMessage={t('dsh.app-partner.mobile.auto_dsh_partner_store_get.storeNotFound')}
      emptyActionText={t('dsh.app-partner.mobile.auto_dsh_partner_store_get.retryButton_100')}
      onEmptyAction={() => loadStore()}
      screenName="auto_dsh_partner_store_get"
      operationName="dsh_partner_store_get"
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadStore(true)} />
        }
      >
        <View style={styles.header}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.title}>{storeData?.name || t('dsh.app-partner.mobile.auto_dsh_partner_store_get.store')}</Text>
            {selectedStoreId ? <Text style={styles.storeIdMeta}>ID: {selectedStoreId}</Text> : null}
          </View>
          <View style={[styles.statusBadge, storeData?.status === 'open' ? styles.statusOpen : styles.statusClosed]}>
            <Text style={styles.statusText}>
              {storeData?.status === 'open' ? t('dsh.app-partner.mobile.auto_dsh_partner_store_get.closed') : t('dsh.app-partner.mobile.auto_dsh_partner_store_get.closed')}
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>معلومات الاتصال</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>العنوان:</Text>
            <Text style={[styles.infoValue, textAlignStart]}>{storeData?.address || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>الهاتف:</Text>
            <Text style={[styles.infoValue, textAlignStart]}>{storeData?.phone || '-'}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>البريد الإلكتروني:</Text>
            <Text style={[styles.infoValue, textAlignStart]}>{storeData?.email || '-'}</Text>
          </View>
        </View>

        <View style={styles.actionsSection}>
          <Text style={styles.actionsTitle}>إدارة المتجر</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation?.navigate('dsh_partner_store_update')}
          >
            <Text style={styles.actionButtonText}>✏️ تحديث معلومات المتجر</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation?.navigate('dsh_partner_store_status_update')}
          >
            <Text style={styles.actionButtonText}>🔄 تحديث حالة المتجر</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation?.navigate('dsh_partner_listing_status_update')}
          >
            <Text style={styles.actionButtonText}>📋 تحديث حالة القائمة</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation?.navigate('dsh_partner_auction_status_update')}
          >
            <Text style={styles.actionButtonText}>🔨 تحديث حالة المزاد</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation?.navigate('dsh_partner_delivery_zones_update')}
          >
            <Text style={styles.actionButtonText}>📍 تحديث مناطق التوصيل</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation?.navigate('dsh_partner_hours_update')}
          >
            <Text style={styles.actionButtonText}>🕐 تحديث ساعات العمل</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => navigation?.navigate('dsh_partner_items_upsert')}
          >
            <Text style={styles.actionButtonText}>📦 إدارة المنتجات</Text>
          </TouchableOpacity>
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
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.lg,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: semanticRoles.text,
    flex: 1,
  },
  headerTextWrap: {
    flex: 1,
  },
  storeIdMeta: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    marginTop: BTHWANI_SPACING.xs,
  },
  statusBadge: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
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
    fontWeight: '600',
    fontSize: 12,
  },
  section: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: BTHWANI_SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
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
  },
  actionsSection: {
    marginTop: BTHWANI_SPACING.lg,
  },
  actionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.md,
  },
  actionButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.md,
    marginBottom: BTHWANI_SPACING.sm,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  actionButtonText: {
    fontSize: 16,
    color: semanticRoles.text,
    fontWeight: '500',
  },
});

export default AutoDshPartnerStoreGet;

