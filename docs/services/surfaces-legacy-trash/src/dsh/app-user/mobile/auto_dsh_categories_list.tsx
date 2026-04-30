// Auto-generated screen for dsh_categories_list
// Surface: app-client | Service: dsh
// §30 States: Content (بذرة الفئات من DSH_EXPERIMENTAL_CATEGORIES_REFERENCE)

import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { ScreenState, ScreenWrapper, semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS } from '@bthwani/ui-kit';
import { getDshCategoriesSeedList, DSH_CATEGORY_ICONS } from '../../dshCategoriesSeed';
import { getDshCategoryIconUrl } from '../../getDshCategoryIconUrl';

interface auto_dsh_categories_listProps {
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
}

/** يعرض صورة الأيقونة من URL مع fallback إلى الإيموجي (مسار موحّد — خلفيات بيضاء فقط) */
function CategoryIconImage({
  uri,
  emojiFallback,
}: {
  uri: string | null;
  emojiFallback: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!uri || failed) {
    return <Text style={styles.categoryIcon}>{emojiFallback}</Text>;
  }
  return (
    <Image
      source={{ uri }}
      style={styles.categoryIconImage}
      resizeMode="cover"
      onError={() => setFailed(true)}
    />
  );
}

export const auto_dsh_categories_list: React.FC<auto_dsh_categories_listProps> = ({ onNavigate, navigation }) => {
  const { t } = useI18n();
  const categories = useMemo(() => {
    return getDshCategoriesSeedList(t).map((c) => ({
      ...c,
      icon: DSH_CATEGORY_ICONS[c.id] ?? '📦',
    }));
  }, [t]);

  const handleNavigate = (screen: string, params?: Record<string, unknown>) => {
    if (navigation?.navigate) {
      navigation.navigate(screen, params);
    } else if (onNavigate) {
      onNavigate(screen, params);
    }
  };

  const renderCategoryItem = ({ item }: { item: (ReturnType<typeof getDshCategoriesSeedList>[0]) & { icon: string } }) => (
    <TouchableOpacity
      style={styles.categoryCard}
      onPress={() => handleNavigate('DshCategoryGet', { categoryId: item.id })}
      activeOpacity={0.7}
    >
      <View style={styles.categoryHeader}>
        <CategoryIconImage
          uri={getDshCategoryIconUrl(item.id)}
          emojiFallback={item.icon}
        />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <ScreenWrapper state="content">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{t('dsh.app-client.mobile.auto_dsh_categories_list.title')}</Text>
          <Text style={styles.subtitle}>{t('dsh.app-client.mobile.auto_dsh_categories_list.subtitle')}</Text>
        </View>
        <FlatList
          data={categories}
          keyExtractor={(item) => item.id}
          renderItem={renderCategoryItem}
          numColumns={2}
          contentContainerStyle={styles.gridContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </ScreenWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: semanticRoles.surfaceSubtle,
  },
  header: {
    backgroundColor: semanticRoles.surface,
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.xl,
    paddingBottom: BTHWANI_SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: semanticRoles.surfaceSubtle,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    marginBottom: BTHWANI_SPACING.xs,
  },
  subtitle: {
    fontSize: 14,
    color: semanticRoles.onSurfaceMuted,
  },
  gridContainer: {
    padding: BTHWANI_SPACING.contentH,
  },
  categoryCard: {
    backgroundColor: semanticRoles.surface,
    borderRadius: BTHWANI_RADIUS.lg,
    padding: BTHWANI_SPACING.contentH,
    margin: BTHWANI_SPACING.sm,
    flex: 1,
    alignItems: 'center',
    shadowColor: semanticRoles.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryHeader: {
    marginBottom: BTHWANI_SPACING.md,
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: semanticRoles.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryIcon: {
    fontSize: 40,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '700',
    color: semanticRoles.onSurface,
    textAlign: 'center',
  },
  categoryIconImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
});

export default auto_dsh_categories_list;

