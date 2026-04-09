// WLT Rewards Home — مكافآت والخصومات (أيقون منفصل في واجهة WLT فقط)
// §86 UI: نفس شكل قائمة شحن الرصيد — بطاقة + دائرة اختيار + أيقونة ظاهرة دائماً + نص
// أيقونات: صورة من dev media إن وُجدت، وإلا أيقونة متجهة (Ionicons) — لا اعتماد على emoji قديم

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
import { Ionicons } from '@expo/vector-icons';
import { semanticRoles } from '@bthwani/ui-kit';
import { useI18n } from '@bthwani/ui-kit';
import { BTHWANI_SPACING, BTHWANI_RADIUS, BTHWANI_COLORS } from '@bthwani/ui-kit';
import { colorTokens } from '@bthwani/ui-kit';
import { resolveDevMediaUrl } from '../../../config';

const BORDER_COLOR = colorTokens.neutral['200'];

/** احتياطي عند عدم توفر أيقونة — لا يُستخدم نصاً؛ الأيقونات من Ionicons */
const FALLBACK_EMOJI = '🎁';

/** أيقونات متجهة للعناصر الأربعة — استحقاقي، نقاط ولاء، سحوبات، خصومات تلقائية */
const REWARD_IONICON: Record<string, keyof typeof Ionicons.glyphMap> = {
  entitlements: 'ticket-outline',
  loyalty: 'star',
  draws: 'trophy-outline',
  auto_discounts: 'pricetag-outline',
};

export interface RewardItem {
  id: string;
  nameAr: string;
  iconPath: string;
  screen?: string;
  description?: string;
}

interface AutoWltRewardsHomeProps {
  navigation?: { navigate: (screen: string, params?: Record<string, unknown>) => void };
  onNavigate?: (screen: string, params?: Record<string, unknown>) => void;
}

export const AutoWltRewardsHome: React.FC<AutoWltRewardsHomeProps> = ({ navigation, onNavigate }) => {
  const { t, isRTL } = useI18n();
  const textAlignStart = useMemo(() => ({ textAlign: (isRTL ? 'right' : 'left') as 'right' | 'left' }), [isRTL]);
  const REWARDS_ITEMS: RewardItem[] = useMemo(
    () => [
      {
        id: 'entitlements',
        nameAr: t('surfaces.استحقاقي'),
        iconPath: 'wlt/rewards/icon_rewards_entitlements.png',
        screen: 'DshEntitlementsGet',
        description: t('wlt.app-client.mobile.auto_wlt_rewards_home.entitlementsAndBenefits'),
      },
      {
        id: 'loyalty',
        nameAr: t('surfaces.نقاط_ولاء'),
        iconPath: 'wlt/rewards/icon_rewards_loyalty.png',
        screen: 'DshLoyaltyPointsUserBalance',
        description: t('wlt.app-client.mobile.auto_wlt_rewards_home.redeemPointsForBenefits'),
      },
      {
        id: 'draws',
        nameAr: t('surfaces.سحوبات'),
        iconPath: 'wlt/rewards/icon_rewards_draws.png',
        description: t('wlt.app-client.mobile.auto_wlt_rewards_home.withdrawalsAndRewards'),
      },
      {
        id: 'auto_discounts',
        nameAr: t('surfaces.خصومات_تلقائية'),
        iconPath: 'wlt/rewards/icon_rewards_discounts.png',
        description: t('wlt.app-client.mobile.auto_wlt_rewards_home.autoAppliedDiscounts'),
      },
    ],
    [t]
  );
  const [refreshing, setRefreshing] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const handleNavigate = useCallback(
    (screen: string, params?: Record<string, unknown>) => {
      if (navigation?.navigate) navigation.navigate(screen, params);
      else if (onNavigate) onNavigate(screen, params);
    },
    [navigation, onNavigate]
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await new Promise((r) => setTimeout(r, 500));
    setRefreshing(false);
  }, []);

  const handleItemPress = useCallback(
    (item: RewardItem) => {
      setSelectedId(item.id);
      if (item.screen) {
        handleNavigate(item.screen);
        return;
      }
      Alert.alert(t('wlt.app-client.mobile.auto_wlt_rewards_home.ok'), `"${item.nameAr}" — سيتم تفعيل هذه الخدمة قريباً.`, [{ text: t('wlt.app-client.mobile.auto_wlt_rewards_home.ok') }]);
    },
    [handleNavigate, t]
  );

  const renderItemIcon = (iconPath: string, itemId: string, isSelected: boolean) => {
    const url = resolveDevMediaUrl(iconPath);
    const iconName = REWARD_IONICON[itemId] ?? 'gift-outline';
    const iconColor = isSelected ? BTHWANI_COLORS.primary : colorTokens.primary['600'];
    const a11yLabel = url ? undefined : FALLBACK_EMOJI;
    return (
      <View style={styles.providerIconWrap} accessibilityLabel={a11yLabel}>
        {url ? (
          <Image source={{ uri: url }} style={styles.providerIcon} resizeMode="cover" />
        ) : (
          <View style={[styles.providerIconPlaceholder, isSelected && styles.providerIconPlaceholderSelected]}>
            <Ionicons name={iconName} size={26} color={iconColor} />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('wlt.app-client.mobile.auto_wlt_rewards_home.title')}</Text>
        <Text style={styles.subtitle}>{t('wlt.app-client.mobile.auto_wlt_rewards_home.subtitle')}</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[semanticRoles.primaryCTA]} />
        }
      >
        <View style={styles.paymentList}>
          {REWARDS_ITEMS.map((item) => {
            const isSelected = selectedId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                style={[styles.paymentCard, isSelected && styles.paymentCardSelected]}
                onPress={() => handleItemPress(item)}
                activeOpacity={0.85}
              >
                <View style={[styles.radio, isSelected && styles.radioSelected]} />
                {renderItemIcon(item.iconPath, item.id, isSelected)}
                <View style={styles.labelWrap}>
                  <Text style={[styles.paymentRowLabel, textAlignStart, isSelected && styles.paymentLabelSelected]}>{item.nameAr}</Text>
                  {item.description ? (
                    <Text style={[styles.itemDesc, textAlignStart]} numberOfLines={1}>{item.description}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            );
          })}
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
  providerIcon: { width: 44, height: 44 },
  providerIconPlaceholder: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorTokens.primary['50'],
  },
  providerIconPlaceholderSelected: {
    backgroundColor: colorTokens.primary['100'],
  },
  labelWrap: { flex: 1, marginStart: BTHWANI_SPACING.md },
  paymentRowLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: BTHWANI_COLORS.onSurface,
  },
  paymentLabelSelected: { color: BTHWANI_COLORS.primary, fontWeight: '700' },
  itemDesc: {
    fontSize: 13,
    color: BTHWANI_COLORS.onSurfaceMuted,
    marginTop: 2,
  },
});

export default AutoWltRewardsHome;

