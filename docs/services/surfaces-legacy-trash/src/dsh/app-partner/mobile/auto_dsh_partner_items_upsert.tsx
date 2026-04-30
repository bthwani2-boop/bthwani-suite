/**
 * DSH Partner Items Upsert — dsh_partner_items_upsert
 * Surface: app-partner | Service: dsh
 * Operation: POST /api/dsh/partner/items/upsert
 *
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * - Full states: Loading/Error/Empty/Offline/Success
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_COLORS, BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import {
  getDshPartnerItems,
  upsertDshPartnerItems,
  DshPartnerItem,
} from '@bthwani/api-clients/dsh/dsh-field-partner-api';

interface AutoDshPartnerItemsUpsertProps {
  navigation?: any;
}

interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isAvailable: boolean;
}

export const AutoDshPartnerItemsUpsert: React.FC<AutoDshPartnerItemsUpsertProps> = ({ navigation }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);

  const loadItems = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);
      setIsOffline(false);

      const list = await getDshPartnerItems();
      setItems(list as Item[]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.errorLoadMessage');
      setError(errorMessage);
      if (errorMessage.includes('timeout') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) setIsOffline(true);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const toggleAvailability = (itemId: string) => {
    setItems(items.map(item =>
      item.id === itemId ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const handleSave = useCallback(async () => {
    if (items.length === 0) return;
    try {
      setIsSaving(true);
      setError(null);
      const ok = await upsertDshPartnerItems(items as unknown as DshPartnerItem[]);
      if (!ok) throw new Error('فشل في الحفظ');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.errorSaveMessage'));
    } finally {
      setIsSaving(false);
    }
  }, [items]);

  const getState = (): 'loading' | 'error' | 'empty' | 'content' => {
    if (isLoading && !isRefreshing) return 'loading';
    if (isOffline) return 'error';
    if (error) return 'error';
    if (items.length === 0) return 'empty';
    return 'content';
  };

  const renderItem = ({ item }: { item: Item }) => (
    <View style={styles.itemCard}>
      <View style={[styles.itemHeader, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.itemName}>{item.name}</Text>
        <TouchableOpacity
          style={[styles.availabilityToggle, item.isAvailable && styles.availabilityToggleActive]}
          onPress={() => toggleAvailability(item.id)}
        >
          <Text style={[styles.availabilityText, item.isAvailable && styles.availabilityTextActive]}>
            {item.isAvailable ? t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.unavailable') : t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.unavailable')}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.itemDescription}>{item.description}</Text>
      <View style={[styles.itemFooter, { flexDirection: 'row', direction: layoutDirection }]}>
        <Text style={styles.itemCategory}>{item.category}</Text>
        <Text style={styles.itemPrice}>{item.price} ر.س</Text>
      </View>
    </View>
  );

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.loadingMessage')}
      errorMessage={isOffline ? t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.errorMessage') : (error || t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.errorMessage'))}
      errorActionText={t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.retryButton')}
      onErrorAction={() => loadItems()}
      emptyMessage={t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.noProducts')}
      emptyActionText={t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.addProduct')}
      onEmptyAction={() => {/* Navigate to add item */}}
      screenName="auto_dsh_partner_items_upsert"
      operationName="dsh_partner_items_upsert"
    >
      <View style={styles.container}>
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadItems(true)} />
          }
        />
        <TouchableOpacity
          style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isSaving || items.length === 0}
        >
          <Text style={styles.saveButtonText}>{isSaving ? t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.saveChanges') : t('dsh.app-partner.mobile.auto_dsh_partner_items_upsert.saveChanges')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.addButton} disabled={isSaving}>
          <Text style={styles.addButtonText}>+ إضافة منتج</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  listContent: {
    padding: BTHWANI_SPACING.contentH,
  },
  itemCard: {
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.sm,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    flex: 1,
  },
  availabilityToggle: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingVertical: BTHWANI_SPACING.xs,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  availabilityToggleActive: {
    backgroundColor: colorTokens.success['600'],
    borderColor: colorTokens.success['600'],
  },
  availabilityText: {
    fontSize: 12,
    color: semanticRoles.textMuted,
    fontWeight: '600',
  },
  availabilityTextActive: {
    color: 'white',
  },
  itemDescription: {
    fontSize: 14,
    color: semanticRoles.textMuted,
    marginBottom: BTHWANI_SPACING.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemCategory: {
    fontSize: 12,
    color: semanticRoles.textMuted,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: semanticRoles.primaryCTA,
  },
  saveButton: {
    backgroundColor: semanticRoles.primaryCTA,
    padding: BTHWANI_SPACING.md,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.sm,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
  },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: BTHWANI_COLORS.surface,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
    borderStyle: 'dashed',
  },
  addButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 18,
    fontWeight: '600',
  },
});

export default AutoDshPartnerItemsUpsert;

