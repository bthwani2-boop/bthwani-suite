// WLT Sudad Home — سداد ودفع الفواتير وشحن الاتصالات
// Surface: app-client (shared with captain, partner, field via route maps)
// §86 UI: نفس شكل قائمة شحن الرصيد (بطاقة + دائرة اختيار + أيقونة + نص). مكافآت والخصومات أيقون منفصل في WLT فقط.
// Icons: resolveDevMediaUrl('wlt/sudad/icon_*.png') — مع fallback ظاهر دائماً

import React, { useCallback, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  RefreshControl,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { resolveDevMediaUrl } from '../../../config';

const BORDER_COLOR = colorTokens.neutral['200'];

export interface SudadItem {
  id: string;
  nameAr: string;
  iconPath: string;
}

export interface SudadCategory {
  id: string;
  name: string;
  nameAr: string;
  iconPath: string;
  items: SudadItem[];
}

/** Translation keys only at module load; resolved in buildSudadCategories(t). */
const SUDAD_CATEGORIES_KEYS: Array<{
  id: string;
  name: string;
  nameArKey: string;
  iconPath: string;
  items: Array<{ id: string; nameArKey: string; iconPath: string }>;
}> = [
  {
    id: 'bills',
    name: 'bills',
    nameArKey: 'surfaces.دفع_وسداد_الفواتير',
    iconPath: 'wlt/sudad/icon_sudad_bills.png',
    items: [
      { id: 'electricity', nameArKey: 'surfaces.فواتير_الكهرباء', iconPath: 'wlt/sudad/icon_item_electricity.png' },
      { id: 'water', nameArKey: 'surfaces.فواتير_الماء', iconPath: 'wlt/sudad/icon_item_water.png' },
      { id: 'internet', nameArKey: 'surfaces.الإنترنت_يمن_نت_تليمن_WiFi', iconPath: 'wlt/sudad/icon_item_internet.png' },
      { id: 'internet_bundles', nameArKey: 'surfaces.تسديد_باقات_الإنترنت_والشبكات', iconPath: 'wlt/sudad/icon_item_bundles.png' },
    ],
  },
  {
    id: 'telecom',
    name: 'telecom',
    nameArKey: 'surfaces.شحن_رصيد_الاتصالات',
    iconPath: 'wlt/sudad/icon_sudad_telecom.png',
    items: [
      { id: 'yemen_mobile', nameArKey: 'surfaces.يمن_موبايل', iconPath: 'wlt/sudad/icon_item_yemen_mobile.png' },
      { id: 'sabafon', nameArKey: 'surfaces.سبأفون', iconPath: 'wlt/sudad/icon_item_sabafon.png' },
      { id: 'you', nameArKey: 'YOU', iconPath: 'wlt/sudad/icon_item_you.png' },
      { id: 'y', nameArKey: 'واي', iconPath: 'wlt/sudad/icon_item_y.png' },
    ],
  },
  {
    id: 'digital',
    name: 'digital',
    nameArKey: 'surfaces.دفع_اشتراكات_رقمية',
    iconPath: 'wlt/sudad/icon_sudad_digital.png',
    items: [
      { id: 'games', nameArKey: 'surfaces.شحن_الألعاب', iconPath: 'wlt/sudad/icon_item_games.png' },
      { id: 'subscriptions', nameArKey: 'surfaces.اشتراكات_تطبيقات_أو_مواقع', iconPath: 'wlt/sudad/icon_item_subscriptions.png' },
    ],
  },
];

function buildSudadCategories(t: (key: string) => string): SudadCategory[] {
  return SUDAD_CATEGORIES_KEYS.map((cat) => ({
    id: cat.id,
    name: cat.name,
    nameAr: cat.nameArKey.includes('.') ? t(cat.nameArKey) : cat.nameArKey,
    iconPath: cat.iconPath,
    items: cat.items.map((item) => ({
      id: item.id,
      nameAr: item.nameArKey.includes('.') ? t(item.nameArKey) : item.nameArKey,
      iconPath: item.iconPath,
    })),
  }));
}

interface AutoWltSudadHomeProps {
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
}

const ITEM_FALLBACK_EMOJI: Record<string, string> = {
  electricity: '⚡',
  water: '💧',
  internet: '🌐',
  internet_bundles: '📶',
  yemen_mobile: '📱',
  sabafon: '📱',
  you: '📱',
  y: '📱',
  games: '🎮',
  subscriptions: '📲',
};

export const AutoWltSudadHome: React.FC<AutoWltSudadHomeProps> = ({ navigation, onNavigate }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const categories = useMemo(() => buildSudadCategories(t), [t]);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 600));
    setRefreshing(false);
  }, []);

  const handleItemPress = useCallback((catId: string, itemId: string, nameAr: string) => {
    setSelectedKey(`${catId}.${itemId}`);
    Alert.alert(
      t('surfaces.سداد'),
      `"${nameAr}" — سيتم تفعيل هذه الخدمة عند الربط مع المزود المحلي من لوحة التحكم.`,
      [{ text: 'حسناً' }]
    );
  }, [t]);

  /** أيقونة ظاهرة دائماً: إما صورة من DEV_MEDIA أو صندوق بلون خلفية + إيموجي */
  const renderItemIcon = (iconPath: string, itemId: string) => {
    const url = resolveDevMediaUrl(iconPath);
    const fallback = ITEM_FALLBACK_EMOJI[itemId] ?? '•';
    return (
      <View style={styles.providerIconWrap}>
        {url ? (
          <Image source={{ uri: url }} style={styles.providerIcon} resizeMode="cover" />
        ) : (
          <View style={styles.providerIconPlaceholder}>
            <Text style={styles.providerIconEmoji}>{fallback}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('wlt.app-client.mobile.auto_wlt_sudad_home.title')}</Text>
        <Text style={styles.subtitle}>{t('wlt.app-client.mobile.auto_wlt_sudad_home.subtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[semanticRoles.primaryCTA]} />
        }
      >
        {categories.map((cat) => (
          <View key={cat.id} style={styles.categoryBlock}>
            <Text style={[styles.categoryTitle, textAlignStart]}>{cat.nameAr}</Text>
            <View style={styles.paymentList}>
              {cat.items.map((item) => {
                const key = `${cat.id}.${item.id}`;
                const isSelected = selectedKey === key;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
                    onPress={() => handleItemPress(cat.id, item.id, item.nameAr)}
                    activeOpacity={0.85}
                  >
                    <View style={[styles.radio, isSelected && styles.radioSelected]} />
                    {renderItemIcon(item.iconPath, item.id)}
                    <Text
                      style={[styles.paymentRowLabel, textAlignStart, isSelected && styles.paymentLabelSelected]}
                      numberOfLines={2}
                    >
                      {item.nameAr}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={styles.footerNote}>
          <Text style={styles.footerText}>
            {t('wlt.app-client.mobile.auto_wlt_sudad_home.footerNote')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
  },
  header: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingTop: BTHWANI_SPACING.sm,
    paddingBottom: BTHWANI_SPACING.md,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: BTHWANI_COLORS.onSurface,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginTop: 4,
    textAlign: 'center',
  },
  scrollView: { flex: 1 },
  scrollContent: {
    paddingHorizontal: BTHWANI_SPACING.contentH,
    paddingBottom: BTHWANI_SPACING.xl,
  },
  categoryBlock: {
    marginBottom: BTHWANI_SPACING.xl,
  },
  categoryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
    marginBottom: BTHWANI_SPACING.md,
  },
  paymentList: {
    gap: BTHWANI_SPACING.md,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: BTHWANI_SPACING.md,
    paddingHorizontal: BTHWANI_SPACING.lg,
    borderRadius: BTHWANI_RADIUS.lg,
    borderWidth: 1.5,
    borderColor: BORDER_COLOR,
    backgroundColor: BTHWANI_COLORS.surface,
    ...Platform.select({
      ios: { shadowColor: colorTokens.neutral['900'], shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3 },
      android: { elevation: 2 },
    }),
  },
  paymentCardSelected: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: colorTokens.primary['50'],
    elevation: 3,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: BORDER_COLOR,
    marginStart: BTHWANI_SPACING.md,
  },
  radioSelected: {
    borderColor: BTHWANI_COLORS.primary,
    backgroundColor: BTHWANI_COLORS.primary,
  },
  providerIconWrap: {
    width: 44,
    height: 44,
    marginStart: BTHWANI_SPACING.md,
    borderRadius: BTHWANI_RADIUS.sm,
    backgroundColor: BTHWANI_COLORS.surfaceSubtle,
    overflow: 'hidden',
  },
  providerIcon: {
    width: 44,
    height: 44,
  },
  providerIconPlaceholder: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorTokens.primary['100'],
  },
  providerIconEmoji: { fontSize: 22 },
  paymentRowLabel: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: BTHWANI_COLORS.onSurface,
    marginStart: BTHWANI_SPACING.md,
  },
  paymentLabelSelected: {
    color: BTHWANI_COLORS.primary,
    fontWeight: '700',
  },
  footerNote: {
    marginTop: BTHWANI_SPACING.lg,
    padding: BTHWANI_SPACING.md,
    backgroundColor: BTHWANI_COLORS.surface,
    borderRadius: BTHWANI_RADIUS.sm,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },
  footerText: {
    fontSize: 12,
    color: BTHWANI_COLORS.onSurfaceMuted,
    textAlign: 'center',
  },
});

export default AutoWltSudadHome;

