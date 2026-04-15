import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { BthStateView, BthText, radius, resolveRowDirection, resolveTextAlign, spacing, type Direction, useDirection } from '@bthwani/ui-kit';
import { DSH_CATEGORY_ICONS } from '../fixtures/dshCategoriesFixtures';
import { getDshCategoryIconUrl } from '../utils/getDshCategoryIconUrl';

export type DshCategoryGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  category?: {
    id: string;
    label: string;
    subtitle: string;
    summary: string;
    itemCountLabel?: string;
    subcategories?: Array<{ id: string; label: string; subtitle: string }>;
  };
  onOpenList?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

const subcategoryIconMap: Record<string, string> = {
  grocery_vegetables_fruits: '🥬',
  grocery_meat_fish_chicken: '🥩',
  grocery_roasted_spices: '🌰',
  grocery_bakeries: '🍞',
  grocery_deals_bundle: '🎁',
  sweets_juices_fresh: '🧃',
  sweets_juices_sweets: '🍰',
  sweets_juices_icecream: '🍦',
  anaqati_perfumes: '🌸',
  anaqati_accessories_beauty: '💄',
  anaqati_clothing: '👕',
  gas_refill_refill: '🧯',
  gas_refill_repair: '🛠️',
  gas_refill_buy: '🧰',
};

function CategoryIconImage({ uri, emojiFallback }: { uri: string | null; emojiFallback: string }) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return <BthText role="titleLg" style={styles.categoryIconFallback}>{emojiFallback}</BthText>;
  }

  return <Image source={{ uri }} style={styles.categoryIconImage} resizeMode="cover" onError={() => setFailed(true)} />;
}

function getCategoryIcon(categoryId: string) {
  return DSH_CATEGORY_ICONS[categoryId] ?? '📂';
}

function getSubcategoryIcon(subcategoryId: string) {
  return subcategoryIconMap[subcategoryId] ?? '📌';
}

function renderState(state: Exclude<NonNullable<DshCategoryGetScreenProps['state']>, 'ready'>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" title="جاري تحميل الفئة" description="نسترجع البيانات والفرعيات الآن." onActionPress={onRetry} />;
  }

  if (state === 'empty') {
    return <BthStateView stateId="empty" title="لا توجد بيانات فئة" description="أعد المحاولة أو عد إلى قائمة الفئات." onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <BthStateView stateId="warning" title="الفئة متوقفة مؤقتًا" description="أعد المحاولة عند عودة البيانات." onActionPress={onRetry} />;
  }

  return <BthStateView stateId="recoverableError" title="تعذر تحميل الفئة" description="أعد المحاولة ثم انتقل إلى القائمة." onActionPress={onRetry} />;
}

export function DshCategoryGetScreen({ state = 'ready', category, onOpenList, onBack, onRetry, onSupport }: DshCategoryGetScreenProps) {
  const { direction } = useDirection();
  const styles = useMemo(() => createStyles(direction), [direction]);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  if (!category) {
    return <BthStateView stateId="blockingError" title="سياق الفئة مفقود" description="مرر بيانات الفئة قبل عرض الصفحة." />;
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.headerAction} onPress={onBack} hitSlop={10}>
          <BthText role="bodySm" style={styles.headerActionText}>رجوع</BthText>
        </Pressable>

        <View style={styles.headerTextWrap}>
          <BthText role="titleSm" style={styles.headerTitle}>{category.label}</BthText>
          <BthText role="bodySm" style={styles.headerSubtitle}>تفاصيل الفئة والفرعيات كما في المسار القديم.</BthText>
        </View>

        <Pressable style={styles.headerAction} onPress={onSupport} hitSlop={10}>
          <BthText role="bodySm" style={styles.headerActionText}>مساعدة</BthText>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <View style={styles.categoryIconShell}>
              <CategoryIconImage uri={getDshCategoryIconUrl(category.id)} emojiFallback={getCategoryIcon(category.id)} />
            </View>

            <View style={styles.summaryTextWrap}>
              <BthText role="titleLg" style={styles.summaryTitle}>{category.label}</BthText>
              <BthText role="bodySm" style={styles.summarySubtitle}>{category.subtitle}</BthText>
              <BthText role="caption" tone="muted" style={styles.summaryMeta}>{category.itemCountLabel ?? 'فئة رئيسية جاهزة'}</BthText>
            </View>
          </View>

          <View style={styles.summaryDetailCard}>
            <BthText role="bodyMd" style={styles.summaryDetailTitle}>{category.summary}</BthText>
            <BthText role="bodySm" tone="muted" style={styles.summaryDetailText}>استخدم هذه الفئة للانتقال إلى أقرب خطوة استكشاف.</BthText>
          </View>
        </View>

        {category.subcategories?.length ? (
          <View style={styles.sectionCard}>
            <BthText role="titleSm" style={styles.sectionTitle}>الفرعيات</BthText>
            <View style={styles.subGrid}>
              {category.subcategories.map((subCategory) => (
                <View key={subCategory.id} style={styles.subCard}>
                  <View style={styles.subIconShell}>
                    <CategoryIconImage uri={getDshCategoryIconUrl(subCategory.id)} emojiFallback={getSubcategoryIcon(subCategory.id)} />
                  </View>
                  <BthText role="bodySm" style={styles.subTitle} numberOfLines={2}>{subCategory.label}</BthText>
                  <BthText role="caption" tone="muted" style={styles.subHint} numberOfLines={2}>{subCategory.subtitle}</BthText>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        <Pressable style={styles.primaryCta} onPress={onOpenList}>
          <BthText role="bodyMd" style={styles.primaryCtaText}>عرض قائمة الفئات</BthText>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function createStyles(direction: Direction) {
  const rowDirection = resolveRowDirection(direction);
  const textAlign = resolveTextAlign(direction);

  return StyleSheet.create({
    screen: {
      flex: 1,
      backgroundColor: '#F5F7FB',
    },
    header: {
      flexDirection: rowDirection,
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: spacing[4],
      paddingTop: spacing[5],
      paddingBottom: spacing[4],
      backgroundColor: '#FFFFFF',
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    headerTextWrap: {
      flex: 1,
      alignItems: 'center',
      paddingHorizontal: spacing[3],
    },
    headerAction: {
      minWidth: 62,
      minHeight: 38,
      borderRadius: radius.pill,
      backgroundColor: '#FFF4E8',
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing[3],
    },
    headerActionText: {
      color: '#D97706',
      fontWeight: '800',
      textAlign: 'center',
    },
    headerTitle: {
      color: '#111827',
      textAlign: 'center',
      fontWeight: '800',
    },
    headerSubtitle: {
      color: '#6B7280',
      marginTop: spacing[1],
      textAlign: 'center',
      lineHeight: 18,
    },
    content: {
      padding: spacing[4],
      gap: spacing[4],
    },
    summaryCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: radius.lg,
      padding: spacing[4],
      borderWidth: 1,
      borderColor: '#E5E7EB',
      shadowColor: '#000000',
      shadowOpacity: 0.06,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
      gap: spacing[3],
    },
    summaryRow: {
      flexDirection: rowDirection,
      alignItems: 'center',
      gap: spacing[3],
    },
    categoryIconShell: {
      width: 86,
      height: 86,
      borderRadius: 24,
      backgroundColor: '#F8FAFC',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
    },
    categoryIconFallback: {
      fontSize: 40,
      lineHeight: 42,
    },
    categoryIconImage: {
      width: '100%',
      height: '100%',
    },
    summaryTextWrap: {
      flex: 1,
      gap: spacing[1],
    },
    summaryTitle: {
      color: '#111827',
      textAlign,
      fontWeight: '800',
    },
    summarySubtitle: {
      color: '#4B5563',
      textAlign,
      lineHeight: 18,
    },
    summaryMeta: {
      color: '#6B7280',
      textAlign,
    },
    summaryDetailCard: {
      backgroundColor: '#FFF7ED',
      borderRadius: radius.md,
      padding: spacing[3],
      borderWidth: 1,
      borderColor: '#FED7AA',
      gap: spacing[1],
    },
    summaryDetailTitle: {
      color: '#9A3412',
      textAlign,
      fontWeight: '800',
    },
    summaryDetailText: {
      color: '#7C2D12',
      textAlign,
      lineHeight: 18,
    },
    sectionCard: {
      backgroundColor: '#FFFFFF',
      borderRadius: radius.lg,
      padding: spacing[4],
      gap: spacing[3],
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    sectionTitle: {
      color: '#111827',
      fontWeight: '800',
      textAlign,
    },
    subGrid: {
      flexDirection: rowDirection,
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    subCard: {
      width: '48%',
      borderRadius: radius.md,
      borderWidth: 1,
      borderColor: '#E5E7EB',
      backgroundColor: '#F8FAFC',
      padding: spacing[3],
      alignItems: 'center',
      gap: spacing[2],
    },
    subIconShell: {
      width: 64,
      height: 64,
      borderRadius: 18,
      backgroundColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: '#E5E7EB',
    },
    subTitle: {
      color: '#111827',
      textAlign: 'center',
      fontWeight: '800',
      minHeight: 36,
    },
    subHint: {
      color: '#6B7280',
      textAlign: 'center',
      lineHeight: 16,
    },
    primaryCta: {
      backgroundColor: '#0F172A',
      borderRadius: radius.lg,
      paddingVertical: spacing[3],
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryCtaText: {
      color: '#FFFFFF',
      fontWeight: '800',
      textAlign: 'center',
    },
  });
}