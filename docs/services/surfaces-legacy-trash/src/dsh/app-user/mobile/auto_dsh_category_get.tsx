// Auto-generated screen for dsh_category_get
// Surface: app-client | Service: dsh
// §30 عند وجود categoryId في route نعرض DshCategoryDetail (بذرة الفئات)، وإلا الواجهة السابقة

import React, { useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import {ScreenState, ScreenWrapper, semanticRoles} from "@bthwani/ui-kit";
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { DshCategoryDetail } from '../../DshCategoryDetail';
import { getDshCategoryDetailSeed } from '../../dshCategoriesSeed';
import { buildDshCategoryGetMock, type CategoryItem } from '../../hooks';

interface auto_dsh_category_getProps {
  onNavigate?: (screen: string) => void;
  navigation?: { navigate: (screen: string) => void; goBack?: () => void };
  route?: { params?: { categoryId?: string; subcategoryId?: string } };
}

export const auto_dsh_category_get: React.FC<auto_dsh_category_getProps> = ({ onNavigate, navigation, route }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const categoryId = route?.params?.categoryId?.trim();
  const [state, setState] = useState<ScreenState>('loading');

  useEffect(() => {
    if (categoryId) return;
    const loadCategory = async () => {
      try {
        // Backend integration call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success (90% success rate)
        const mockSuccess = 0 > 0.1;

        if (!mockSuccess) {
          setState('error');
        } else {
          setState('content');
        }
      } catch (error) {
        setState('error');
      }
    };

    loadCategory();
  }, [categoryId]);

  const handleRetry = () => {
    setState('loading');
    setTimeout(() => setState('content'), 1500);
  };

  const handleNavigate = (screen: string) => {
    if (navigation?.navigate) {
      navigation.navigate(screen);
    } else if (onNavigate) {
      onNavigate(screen);
    }
  };

  if (categoryId) {
    return (
      <DshCategoryDetail
        getCategory={async (id) => getDshCategoryDetailSeed(id, t) ?? null}
        categoryId={categoryId}
        onBack={() => {
          if (typeof navigation?.goBack === 'function') {
            navigation.goBack();
          } else {
            onNavigate?.('DshHome');
          }
        }}
      />
    );
  }

  const { category, items } = useMemo(() => buildDshCategoryGetMock(t), [t]);

  const renderCategoryItem = ({ item }: { item: CategoryItem }) => (
    <TouchableOpacity
      style={styles.categoryItem}
      onPress={() => handleNavigate('DshStoreItemsList')}
    >
      <View style={styles.itemImage}>
        <Text style={styles.itemEmoji}>{item.image}</Text>
      </View>
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
        <View style={styles.itemMeta}>
          <Text style={styles.restaurantName}>{item.restaurant}</Text>
          <Text style={styles.rating}>⭐ {item.rating}</Text>
        </View>
        <View style={styles.itemFooter}>
          <Text style={styles.preparationTime}>⏱️ {item.preparationTime}</Text>
          <Text style={styles.itemPrice}>{item.price} ريال</Text>
        </View>
      </View>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => handleNavigate('DshCartItemAdd')}
      >
        <Text style={styles.addText}>+</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (state === 'content') {
    return (
      <ScreenWrapper state="content">
        <ScrollView style={styles.container}>
          <View style={styles.categoryHeader}>
            <Text style={styles.categoryIcon}>{category.icon}</Text>
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryDescription}>{category.description}</Text>
              <View style={styles.categoryStats}>
                <Text style={styles.categoryStat}>{category.totalItems} صنف</Text>
                <Text style={styles.categoryStat}>{category.restaurants} مطعم</Text>
              </View>
            </View>
          </View>

          <View style={styles.itemsSection}>
            <Text style={[styles.sectionTitle, textAlignStart]}>الأطباق المتاحة</Text>
            <FlatList
              data={items}
              keyExtractor={(item) => item.id}
              renderItem={renderCategoryItem}
              contentContainerStyle={styles.itemsList}
              showsVerticalScrollIndicator={false}
              scrollEnabled={false}
            />
          </View>

          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => handleNavigate('DshStoreItemsList')}
          >
            <Text style={styles.viewAllText}>عرض جميع الأطباق في هذا التصنيف</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.backButton} onPress={() => handleNavigate('DshHome')}>
            <Text style={styles.backText}>العودة للرئيسية</Text>
          </TouchableOpacity>
        </ScrollView>
      </ScreenWrapper>
    );
  }

  return (
    <ScreenWrapper
      state={state}
      loadingMessage={t('dsh.app-client.mobile.auto_dsh_category_get.loadingMessage')}
      errorMessage={t('dsh.app-client.mobile.auto_dsh_category_get.errorLoadMessage')}
      onErrorAction={handleRetry}
      screenName="auto_dsh_category_get"
      operationName="dsh_category_get"
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  categoryHeader: {
    backgroundColor: semanticRoles.surface,
    margin: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryIcon: {
    fontSize: 48,
    marginEnd: BTHWANI_SPACING.lg,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 24,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  categoryDescription: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.md,
    lineHeight: 20,
  },
  categoryStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryStat: {
    fontSize: 14,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  itemsSection: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  itemsList: {
    paddingBottom: BTHWANI_SPACING.md,
  },
  categoryItem: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.md,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: BTHWANI_RADIUS.md,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginEnd: BTHWANI_SPACING.md,
  },
  itemEmoji: {
    fontSize: 30,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  itemDescription: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
    marginBottom: BTHWANI_SPACING.sm,
    lineHeight: 16,
  },
  itemMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: BTHWANI_SPACING.xs,
  },
  restaurantName: {
    fontSize: 12,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  rating: {
    fontSize: 12,
    color: semanticRoles.primaryCTA,
    fontWeight: '500',
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  preparationTime: {
    fontSize: 12,
    color: semanticRoles.onSurfaceMuted,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: semanticRoles.primaryCTA,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: semanticRoles.primaryCTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addText: {
    color: semanticRoles.primaryCTAText,
    fontSize: 20,
    fontWeight: '600',
  },
  viewAllButton: {
    backgroundColor: semanticRoles.accent,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    margin: BTHWANI_SPACING.lg,
    alignItems: 'center',
  },
  viewAllText: {
    color: semanticRoles.textInverse,
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    backgroundColor: semanticRoles.surface,
    padding: BTHWANI_SPACING.contentH,
    borderRadius: BTHWANI_RADIUS.lg,
    marginHorizontal: BTHWANI_SPACING.contentH,
    marginBottom: BTHWANI_SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: semanticRoles.border,
  },
  backText: {
    color: semanticRoles.onSurface,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default auto_dsh_category_get;

