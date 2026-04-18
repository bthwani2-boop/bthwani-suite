import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import {
  BthStateView,
  BthText,
  radius,
  resolveRowDirection,
  resolveTextAlign,
  spacing,
  type Direction,
  useDirection,
} from '@bthwani/ui-kit';
import { DSH_CATEGORY_ICONS } from '../fixtures/dshCategoriesFixtures';
import { getDshCategoryIconUrl } from '../utils/getDshCategoryIconUrl';

export type DshCategoriesListItem = {
  id: string;
  label: string;
  subtitle: string;
  countLabel?: string;
};

export type DshCategoriesListScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  items: DshCategoriesListItem[];
  onOpenCategory?: (categoryId: string) => void;
  onOpenFavorites?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

function CategoryIconImage({
  uri,
  emojiFallback,
  style,
  fallbackStyle,
}: {
  uri: string | null;
  emojiFallback: string;
  style?: any;
  fallbackStyle?: any;
}) {
  const [failed, setFailed] = useState(false);

  if (!uri || failed) {
    return <BthText role="titleLg" style={fallbackStyle ?? { fontSize: 40, lineHeight: 42 }}>{emojiFallback}</BthText>;
  }

  return <Image source={{ uri }} style={style ?? { width: '100%', height: '100%' }} resizeMode="cover" onError={() => setFailed(true)} />;
}

function renderState(state: NonNullable<DshCategoriesListScreenProps['state']>, onRetry?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" title="جاري تحميل الفئات" description="نُحضّر شبكة الفئات وصورها الآن." onActionPress={onRetry} />;
  }

  if (state === 'empty') {
    return <BthStateView stateId="empty" title="لا توجد فئات" description="أعد المحاولة أو ارجع إلى الشاشة السابقة." onActionPress={onRetry} />;
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return <BthStateView stateId="warning" title="الفئات غير متاحة مؤقتًا" description="أعد المحاولة عندما تعود البيانات." onActionPress={onRetry} />;
  }

  return <BthStateView stateId="recoverableError" title="تعذر تحميل الفئات" description="حاول مرة أخرى أو ارجع للشاشة السابقة." onActionPress={onRetry} />;
}

export function DshCategoriesListScreen({ state = 'ready', items, onOpenCategory, onOpenFavorites, onBack, onRetry, onSupport }: DshCategoriesListScreenProps) {
  const { direction } = useDirection();
  const styles = useMemo(() => createStyles(direction), [direction]);

  if (state !== 'ready') {
    return renderState(state, onRetry);
  }

  if (!items.length) {
    return renderState('empty', onRetry);
  }

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.headerAction} onPress={onBack} hitSlop={10}>
          <BthText role="bodySm" style={styles.headerActionText}>رجوع</BthText>
        </Pressable>

        <View style={styles.headerTextWrap}>
          <BthText role="titleLg" style={styles.title}>الفئات</BthText>
          <BthText role="bodySm" style={styles.subtitle}>استعرض البطاقات الأساسية مع الصور والأيقونات كما في المسار القديم.</BthText>
        </View>

        <Pressable style={styles.headerAction} onPress={onSupport} hitSlop={10}>
          <BthText role="bodySm" style={styles.headerActionText}>مساعدة</BthText>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.grid}>
          {items.map((item) => {
            const icon = DSH_CATEGORY_ICONS[item.id] ?? '📂';
            const iconUrl = getDshCategoryIconUrl(item.id);

            return (
              <Pressable key={item.id} style={styles.card} onPress={() => onOpenCategory?.(item.id)}>
                <View style={styles.iconShell}>
                  <CategoryIconImage uri={iconUrl} emojiFallback={icon} style={styles.categoryIconImage} fallbackStyle={styles.categoryIconFallback} />
                </View>
                <BthText role="bodyMd" style={styles.cardTitle} numberOfLines={1}>{item.label}</BthText>
                <BthText role="bodySm" style={styles.cardSubtitle} numberOfLines={2}>{item.subtitle}</BthText>
                <BthText role="caption" tone="muted" style={styles.cardMeta}>{item.countLabel ?? 'فئة رئيسية'}</BthText>
              </Pressable>
            );
          })}
        </View>

        {onOpenFavorites ? (
          <Pressable style={styles.favoritesCard} onPress={onOpenFavorites}>
            <BthText role="titleSm" style={styles.favoritesTitle}>المفضلة</BthText>
            <BthText role="bodySm" style={styles.favoritesSubtitle}>انتقل إلى العناصر المحفوظة دون كسر سياق الاستكشاف.</BthText>
          </Pressable>
        ) : null}
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
    title: {
      color: '#111827',
      textAlign: 'center',
    },
    subtitle: {
      color: '#6B7280',
      marginTop: spacing[1],
      textAlign: 'center',
      lineHeight: 18,
    },
    content: {
      padding: spacing[4],
      gap: spacing[4],
    },
    grid: {
      flexDirection: rowDirection,
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: spacing[3],
    },
    card: {
      width: '48%',
      backgroundColor: '#FFFFFF',
      borderRadius: radius.lg,
      padding: spacing[3],
      borderWidth: 1,
      borderColor: '#E5E7EB',
      shadowColor: '#000000',
      shadowOpacity: 0.06,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
      alignItems: 'center',
      gap: spacing[2],
      minHeight: 190,
    },
    iconShell: {
      width: 84,
      height: 84,
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
    cardTitle: {
      color: '#111827',
      fontWeight: '800',
      textAlign: 'center',
    },
    cardSubtitle: {
      color: '#4B5563',
      textAlign,
      lineHeight: 18,
    },
    cardMeta: {
      color: '#6B7280',
      textAlign: 'center',
      marginTop: 'auto',
    },
    favoritesCard: {
      backgroundColor: '#0F172A',
      borderRadius: radius.lg,
      padding: spacing[4],
      gap: spacing[1],
    },
    favoritesTitle: {
      color: '#FFFFFF',
      textAlign: 'center',
      fontWeight: '800',
    },
    favoritesSubtitle: {
      color: 'rgba(255,255,255,0.88)',
      textAlign: 'center',
      lineHeight: 18,
    },
  });
}