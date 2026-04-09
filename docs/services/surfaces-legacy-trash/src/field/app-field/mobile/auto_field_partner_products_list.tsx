/**
 * Field Partner Products List — field_partner_products_list
 * Surface: app-field | Service: field
 * Operation: GET /api/field/partners/{partner_id}/products
 * §UX-SUPREME-001: Minimum Clicks + Zero Ambiguity + Perfect States
 * WAVE 7: Central i18n only; mock product names from t(); loadProducts has t in deps.
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';

interface AutoFieldPartnerProductsListProps {
  navigation?: any;
  route?: any;
}

const NS = 'field.app-field.mobile.auto_field_partner_products_list';

const AutoFieldPartnerProductsList: React.FC<AutoFieldPartnerProductsListProps> = ({ navigation, route }) => {
  const { t, isRTL } = useI18n();
  const layoutDirection = isRTL ? ('rtl' as const) : ('ltr' as const);
  const textAlignStart = isRTL ? 'right' : 'left';
  const partnerId = route?.params?.partnerId || 'unknown';
  const serviceType = route?.params?.serviceType || null; // DSH | ARB | null
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProducts = useCallback(async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }
      setError(null);

      // const data = await getFieldPartnerProducts(partnerId, serviceType);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setProducts([
        { id: '1', name: t(`${NS}.mockProduct_1`), price: 50, serviceType: 'DSH' },
        { id: '2', name: t(`${NS}.mockProduct_2`), price: 75, serviceType: 'ARB' },
      ]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : t(`${NS}.loadProductsFailed`);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [partnerId, serviceType, t]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleProductPress = (productId: string) => {
    navigation?.navigate('field_partner_product_update', { partnerId, productId });
  };

  const handleAddProduct = () => {
    
    };

  const renderProductItem = ({ item }: { item: any }) => {
    const displayName = item.name;
    return (
    <TouchableOpacity
      style={[styles.productCard, { flexDirection: 'row', direction: layoutDirection }]}
      onPress={() => handleProductPress(item.id)}
      activeOpacity={0.7}
    >
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{displayName}</Text>
        <Text style={styles.productPrice}>{item.price} {t(`${NS}.priceUnit`)}</Text>
        <Text style={styles.productServiceType}>
          {item.serviceType === 'DSH' ? `🏪 ${t(`${NS}.serviceTypeDsh`)}` : `🎭 ${t(`${NS}.serviceTypeArb`)}`}
        </Text>
      </View>
      <Text style={styles.arrow}>›</Text>
    </TouchableOpacity>
  );
  };

  const getState = (): 'loading' | 'error' | 'empty' | 'content' => {
    if (isLoading && !isRefreshing) return 'loading';
    if (error) return 'error';
    if (products.length === 0) return 'empty';
    return 'content';
  };

  return (
    <ScreenWrapper
      state={getState()}
      loadingMessage={t(`${NS}.loadingMessage`)}
      errorMessage={error || t(`${NS}.errorMessage`)}
      errorActionText={t(`${NS}.errorActionText`)}
      onErrorAction={() => loadProducts()}
      emptyMessage={t(`${NS}.emptyMessage`)}
      emptyActionText={t(`${NS}.emptyActionText`)}
      onEmptyAction={handleAddProduct}
      screenName="field_partner_products_list"
      operationName="field_partner_products_list"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>📦 {t(`${NS}.title`)}</Text>
          <Text style={styles.subtitle}>
            {serviceType ? t(`${NS}.subtitleService`, { type: serviceType }) : t(`${NS}.subtitleAll`)}
          </Text>
        </View>

        <FlatList
          data={products}
          renderItem={renderProductItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={() => loadProducts(true)} />
          }
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
          activeOpacity={0.8}
        >
          <Text style={styles.addButtonText}>➕ {t(`${NS}.addProduct`)}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.navigate('field_partner_draft_create')}
        >
          <Text style={styles.backButtonText}>← {t(`${NS}.backToList`)}</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.bg,
  },
  header: {
    padding: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.border,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 16,
    color: semanticRoles.textMuted,
  },
  listContent: {
    padding: BTHWANI_SPACING.md,
    paddingBottom: 100,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.md,
    padding: BTHWANI_SPACING.md,
    marginBottom: BTHWANI_SPACING.md,
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.text,
    marginBottom: BTHWANI_SPACING.xs,
  },
  productPrice: {
    fontSize: 16,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
    marginBottom: BTHWANI_SPACING.xs,
  },
  productServiceType: {
    fontSize: 14,
    color: semanticRoles.textMuted,
  },
  arrow: {
    fontSize: 24,
    color: semanticRoles.textMuted,
    marginStart: BTHWANI_SPACING.sm,
  },
  addButton: {
    position: 'absolute',
    bottom: 60,
    start: BTHWANI_SPACING.md,
    end: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.primaryCTA,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    position: 'absolute',
    bottom: 10,
    start: BTHWANI_SPACING.md,
    end: BTHWANI_SPACING.md,
    backgroundColor: semanticRoles.surface,
    paddingVertical: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  backButtonText: {
    color: semanticRoles.text,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AutoFieldPartnerProductsList;
