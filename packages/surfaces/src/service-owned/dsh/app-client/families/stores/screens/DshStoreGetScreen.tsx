import React from 'react';
import {
  Pressable,
  ScrollView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BthStateView, BthText, useDirection, useUiText } from '@bthwani/ui-kit';

export type DshStoreGetMenuItem = {
  id: string;
  name: string;
  subtitle: string;
  priceLabel: string;
  categoryId: string;
  categoryLabel: string;
  statusLabel?: string;
  isAvailable?: boolean;
  hasOptions?: boolean;
  preparationTime?: string;
};

export type DshStoreGetScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';
  store?: {
    id: string;
    name: string;
    subtitle: string;
    statusLabel: string;
    etaLabel: string;
    deliveryFeeLabel: string;
    followersLabel?: string;
    priceMatchLabel?: string;
    tags?: string[];
    categories?: Array<{ id: string; label: string; itemCount: number; isPopular?: boolean }>;
    deliveryModes?: Array<{ id: 'delivery' | 'pickup'; name: string; isAvailable: boolean; estimatedTime?: string; fee?: number }>;
  };
  menuItems?: DshStoreGetMenuItem[];
  onOpenItems?: () => void;
  onBack?: () => void;
  onRetry?: () => void;
  onSupport?: () => void;
};

type DeliveryMode = 'delivery' | 'pickup' | 'store_delivery';

function getDeliveryModes(storeText: ReturnType<typeof useUiText>['storeScreen']): Array<{
  id: DeliveryMode;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
}> {
  return [
    { id: 'store_delivery', label: storeText.get.storeDelivery, icon: 'storefront-outline' },
    { id: 'pickup', label: storeText.get.pickup, icon: 'bag-handle-outline' },
    { id: 'delivery', label: storeText.get.platformDelivery, icon: 'bicycle-outline' },
  ];
}

const CATEGORY_EMOJI: Record<string, string> = {
  fresh: '🥦',
  dairy: '🥛',
  bakery: '🥐',
  meals: '🍲',
  healthy: '🥗',
  sweets: '🍰',
};

const CATEGORY_ICON: Record<string, string> = {
  all: '•',
  fresh: '🥦',
  dairy: '🥛',
  bakery: '🥐',
  meals: '🍲',
  healthy: '🥗',
  sweets: '🍰',
};

function getStatusLabel(statusLabel: string, storeText: ReturnType<typeof useUiText>['storeScreen']) {
  const normalized = statusLabel.trim().toLowerCase();
  if (normalized.includes('open') || normalized.includes('مفتوح')) return 'مفتوح';
  if (normalized.includes('busy') || normalized.includes('مشغول')) return 'مشغول';
  if (normalized.includes('closed') || normalized.includes('مغلق')) return 'مغلق';
  return statusLabel || storeText.get.platformDelivery;
}

function normalizeFollowersLabel(label: string | undefined, suffix: string) {
  if (!label) {
    return undefined;
  }

  if (label.includes(suffix)) {
    return label;
  }

  const digits = label.match(/[\d.,]+/g)?.join('')?.trim();
  return digits ? `${digits} ${suffix}` : label;
}

function normalizePriceMatchLabel(label: string | undefined, fallback: string) {
  if (!label) {
    return fallback;
  }

  const normalized = label.trim().toLowerCase();
  if (normalized.includes('price') || normalized.includes('standard')) {
    return fallback;
  }

  return label;
}

function normalizeTagLabel(tag: string, storeText: ReturnType<typeof useUiText>['storeScreen']) {
  const normalized = tag.trim().toLowerCase();

  if (normalized.includes('pro')) return 'بثواني برو';
  if (normalized.includes('pickup')) return storeText.get.pickup;
  if (normalized.includes('partner delivery') || normalized.includes('store delivery')) return storeText.get.storeDelivery;
  if (normalized.includes('offer')) return 'عرض مباشر';
  if (normalized.includes('km')) return tag.replace(/km/i, 'كم');

  return tag;
}

function getItemEmoji(item: DshStoreGetMenuItem) {
  return CATEGORY_EMOJI[item.categoryId] ?? '🍽️';
}

function renderNonReadyState(
  state: 'loading' | 'empty' | 'error' | 'offline' | 'disabled',
  storeText: ReturnType<typeof useUiText>['storeScreen'],
  onRetry?: () => void,
) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title={storeText.states.storeEmptyTitle}
        description={storeText.states.storeEmptyDescription}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title={storeText.states.storeErrorTitle}
      description={storeText.states.storeErrorDescription}
      actionLabel={storeText.states.retry}
      onActionPress={onRetry}
    />
  );
}

function IconActionButton({ icon, onPress }: { icon: keyof typeof Ionicons.glyphMap; onPress?: () => void }) {
  return (
    <TouchableOpacity
      style={styles.iconButton}
      onPress={onPress}
      activeOpacity={0.8}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      <Ionicons name={icon} size={20} color={stylesTokens.dark} />
    </TouchableOpacity>
  );
}

function ModePill({
  label,
  icon,
  active,
  onPress,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  active: boolean;
  onPress?: () => void;
}) {
  return (
    <TouchableOpacity
      style={[styles.modePill, active && styles.modePillActive]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <View style={[styles.modePillInner, active && styles.modePillInnerActive]}>
        <Text style={[styles.modePillLabel, active && styles.modePillLabelActive]} numberOfLines={1}>
          {label}
        </Text>
        <Ionicons
          name={icon}
          size={18}
          color={active ? stylesTokens.orange : stylesTokens.white}
        />
      </View>
    </TouchableOpacity>
  );
}

function MenuItemCard({
  item,
  isRTL,
  labels,
}: {
  item: DshStoreGetMenuItem;
  isRTL: boolean;
  labels: { available: string; options: string; unavailable: string };
}) {
  const badgeLabel = item.isAvailable === false ? labels.unavailable : item.hasOptions ? labels.options : labels.available;

  return (
    <View style={[styles.menuCard, isRTL && styles.menuCardRTL]}>
      <View style={[styles.menuActionRail, isRTL && styles.menuActionRailRTL]}>
        <View style={styles.menuActionBadge}>
          <Ionicons
            name={item.hasOptions ? 'hand-left-outline' : 'cart-outline'}
            size={18}
            color={stylesTokens.white}
          />
        </View>
      </View>

      <View style={[styles.menuBody, isRTL && styles.menuBodyRTL]}>
        <Text style={[styles.menuTitle, isRTL && styles.textAlignRight]} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={[styles.menuSubtitle, isRTL && styles.textAlignRight]} numberOfLines={2}>
          {item.subtitle}
        </Text>
        <View style={[styles.menuMetaRow, isRTL && styles.rowReverse]}>
          <Text style={styles.menuPrice} numberOfLines={1}>
            {item.priceLabel}
          </Text>
          {item.preparationTime ? (
            <Text style={styles.menuPrep} numberOfLines={1}>
              {item.preparationTime}
            </Text>
          ) : null}
        </View>
        <View style={[styles.menuChipRow, isRTL && styles.rowReverse]}>
          {item.statusLabel ? (
            <View style={styles.smallChipPrimary}>
              <Text style={styles.smallChipPrimaryText}>{item.statusLabel}</Text>
            </View>
          ) : null}
          <View style={styles.smallChipLight}>
            <Text style={styles.smallChipLightText}>{item.categoryLabel}</Text>
          </View>
          {item.isAvailable === false ? (
            <View style={styles.smallChipDanger}>
              <Text style={styles.smallChipDangerText}>{labels.unavailable}</Text>
            </View>
          ) : null}
          {item.hasOptions ? (
            <View style={styles.smallChipLight}>
              <Text style={styles.smallChipLightText}>{labels.options}</Text>
            </View>
          ) : null}
        </View>
      </View>

      <View style={styles.menuImageWrap}>
        <View style={styles.menuImageCard}>
          <View style={styles.menuImageBadge}>
            <Text style={styles.menuImageBadgeText}>{badgeLabel}</Text>
          </View>
          <Text style={styles.menuEmoji}>{getItemEmoji(item)}</Text>
          <TouchableOpacity style={styles.favoriteButton} activeOpacity={0.85}>
            <Ionicons name="heart" size={18} color={stylesTokens.orange} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export function DshStoreGetScreen({
  state = 'ready',
  store,
  menuItems = [],
  onOpenItems,
  onBack,
  onRetry,
  onSupport,
}: DshStoreGetScreenProps) {
  const { direction } = useDirection();
  const uiText = useUiText();
  const storeText = uiText.storeScreen;
  const isRTL = direction === 'rtl';
  const [selectedMode, setSelectedMode] = React.useState<DeliveryMode>('store_delivery');
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');

  const deliveryModes = React.useMemo(() => getDeliveryModes(storeText), [storeText]);
  const itemLabels = React.useMemo(
    () => ({
      available: storeText.items.available,
      options: storeText.items.options,
      unavailable: storeText.items.unavailable,
    }),
    [storeText],
  );

  const categories = React.useMemo(() => {
    const storeCategories = store?.categories ?? [];
    return [{ id: 'all', label: storeText.get.allCategories, itemCount: menuItems.length, isPopular: true }, ...storeCategories];
  }, [menuItems.length, store?.categories, storeText]);

  const visibleItems = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return menuItems;
    }

    return menuItems.filter((item) => item.categoryId === selectedCategory);
  }, [menuItems, selectedCategory]);

  if (state !== 'ready') {
    return <View style={styles.blockingState}>{renderNonReadyState(state, storeText, onRetry)}</View>;
  }

  if (!store) {
    return (
      <BthStateView
        stateId="blockingError"
        title={storeText.states.contextMissingTitle}
        description={storeText.states.contextMissingDescription}
      />
    );
  }

  const normalizedFollowersLabel = normalizeFollowersLabel(store.followersLabel, storeText.get.followersSuffix);
  const normalizedPriceMatchLabel = normalizePriceMatchLabel(store.priceMatchLabel, storeText.get.priceMatch);

  return (
    <View style={styles.screen}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topChrome}>
          <View style={[styles.topChromeRow, isRTL && styles.rowReverse]}>
            <View style={[styles.actionsRow, isRTL && styles.rowReverse]}>
              <IconActionButton icon="person-outline" onPress={onSupport} />
              <IconActionButton icon="search-outline" />
              <IconActionButton icon="cart-outline" onPress={onOpenItems} />
              <IconActionButton icon="share-social-outline" onPress={onSupport} />
            </View>

            <View style={[styles.titleBlock, isRTL && styles.titleBlockRTL]}>
              <Text style={[styles.storeName, isRTL && styles.textAlignRight]} numberOfLines={1}>
                {store.name}
              </Text>
              <Text style={[styles.storeSubtitle, isRTL && styles.textAlignRight]} numberOfLines={1}>
                {store.subtitle}
              </Text>
            </View>

            <TouchableOpacity
              style={styles.backButton}
              onPress={onBack}
              activeOpacity={0.8}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name={isRTL ? 'arrow-forward' : 'arrow-back'} size={24} color={stylesTokens.orange} />
            </TouchableOpacity>
          </View>

          <View style={[styles.headerMetaRow, isRTL && styles.rowReverse]}>
            <Text style={styles.headerMetaText} numberOfLines={1}>
              {store.etaLabel}
            </Text>
            <View style={styles.statusPill}>
              <Text style={styles.statusPillText}>{getStatusLabel(store.statusLabel, storeText)}</Text>
            </View>
            <Text style={styles.ratingText} numberOfLines={1}>
              {storeText.get.ratingValue} ★
            </Text>
          </View>
        </View>

        <View style={styles.heroCard}>
          <View style={[styles.heroIdentityRow, isRTL && styles.rowReverse]}>
            <View style={styles.heroAvatar}>
              <Text style={styles.heroAvatarText}>{store.name.trim().slice(0, 1).toUpperCase()}</Text>
            </View>

            <View style={[styles.heroIdentityContent, isRTL && styles.heroIdentityContentRTL]}>
              <Text style={[styles.heroTitle, isRTL && styles.textAlignRight]} numberOfLines={1}>
                {store.name}
              </Text>
              <Text style={[styles.heroSubtitle, isRTL && styles.textAlignRight]} numberOfLines={2}>
                {store.subtitle}
              </Text>
            </View>
          </View>

          <View style={[styles.trustRow, isRTL && styles.rowReverse]}>
            <View style={styles.trustChip}>
              <Text style={styles.trustChipText}>{normalizedPriceMatchLabel}</Text>
            </View>
            {normalizedFollowersLabel ? (
              <View style={styles.trustChip}>
                <Text style={styles.trustChipText}>{normalizedFollowersLabel}</Text>
              </View>
            ) : null}
          </View>

          {store.tags?.length ? (
            <View style={styles.subscriptionBlock}>
              <BthText role="caption" tone="muted">
                {storeText.get.subscriptionsTitle}
              </BthText>
              <View style={[styles.tagRow, isRTL && styles.rowReverse]}>
                {store.tags.map((tag) => (
                  <View key={`${store.id}-${tag}`} style={styles.tagChip}>
                    <Text style={styles.tagChipText}>{normalizeTagLabel(tag, storeText)}</Text>
                  </View>
                ))}
              </View>
            </View>
          ) : null}
        </View>

        <View style={styles.modeStripWrap}>
          <View style={[styles.modeStrip, isRTL && styles.rowReverse]}>
            {deliveryModes.map((mode) => (
              <ModePill
                key={mode.id}
                label={mode.label}
                icon={mode.icon}
                active={selectedMode === mode.id}
                onPress={() => setSelectedMode(mode.id)}
              />
            ))}
          </View>
        </View>

        <View style={styles.sectionBlock}>
          <BthText role="caption" tone="muted">
            {storeText.get.availableCategories}
          </BthText>
          <View style={[styles.categoryRow, isRTL && styles.rowReverse]}>
            {categories.map((category) => {
              const selected = selectedCategory === category.id;
              return (
                <TouchableOpacity
                  key={category.id}
                  style={[styles.categoryPill, selected && styles.categoryPillSelected]}
                  onPress={() => setSelectedCategory(category.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.categoryPillIcon, selected && styles.categoryPillIconSelected]} numberOfLines={1}>
                    {CATEGORY_ICON[category.id] ?? CATEGORY_ICON.all}
                  </Text>
                  <Text style={[styles.categoryPillText, selected && styles.categoryPillTextSelected]} numberOfLines={1}>
                    {category.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.signalSection}>
          <View style={[styles.signalRow, isRTL && styles.rowReverse]}>
            <View style={styles.signalChipAccent}>
              <Text style={styles.signalChipAccentText}>{storeText.get.favoritesChip}</Text>
            </View>
            <View style={styles.signalChipAccent}>
              <Text style={styles.signalChipAccentText}>{storeText.get.popularChip}</Text>
            </View>
            <View style={styles.signalChipLight}>
              <Text style={styles.signalChipLightText}>{storeText.get.allCategories}</Text>
            </View>
          </View>
        </View>

        <View style={styles.feedSection}>
          <View style={[styles.feedHeaderRow, isRTL && styles.rowReverse]}>
            <View style={styles.feedHeaderPill}>
              <Ionicons name="grid-outline" size={16} color={stylesTokens.orange} />
              <Text style={styles.feedHeaderPillText}>{storeText.get.allCategories}</Text>
            </View>
            <Text style={styles.feedCount} numberOfLines={1}>
              {visibleItems.length} {storeText.get.itemSuffix}
            </Text>
          </View>

          <View style={styles.feedList}>
            {visibleItems.length > 0 ? (
              visibleItems.map((item) => <MenuItemCard key={item.id} item={item} isRTL={isRTL} labels={itemLabels} />)
            ) : (
              <View style={styles.emptyFeed}>
                <Text style={styles.emptyFeedEmoji}>🍽️</Text>
                <Text style={styles.emptyFeedTitle}>{storeText.get.emptyCategoryTitle}</Text>
                <Text style={styles.emptyFeedText}>{storeText.get.emptyCategoryDescription}</Text>
              </View>
            )}
          </View>
        </View>

        {onOpenItems ? (
          <TouchableOpacity style={styles.fullMenuLink} onPress={onOpenItems} activeOpacity={0.8}>
            <Text style={styles.fullMenuLinkText}>{storeText.get.fullMenu}</Text>
            <Ionicons name={isRTL ? 'chevron-back' : 'chevron-forward'} size={18} color={stylesTokens.orange} />
          </TouchableOpacity>
        ) : null}

        <View style={styles.footerNoteWrap}>
          <BthText role="caption" tone="muted">
            {storeText.get.menuNote}
          </BthText>
        </View>
      </ScrollView>
    </View>
  );
}

const stylesTokens = {
  orange: '#ff6a00',
  orangeSoft: '#ffefe3',
  orangeBorder: '#f2a15b',
  white: '#ffffff',
  dark: '#1f2937',
  muted: '#6b7280',
  light: '#f8fafc',
  line: '#e5e7eb',
  chip: '#f3f4f6',
  chipText: '#4b5563',
  green: '#16a34a',
  blue: '#1d4ed8',
  red: '#dc2626',
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: stylesTokens.white,
  },
  blockingState: {
    flex: 1,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
    backgroundColor: stylesTokens.white,
  },
  scrollContent: {
    paddingBottom: 28,
  },
  rowReverse: {
    flexDirection: 'row-reverse',
  },
  textAlignRight: {
    textAlign: 'right',
  },

  topChrome: {
    backgroundColor: stylesTokens.white,
    paddingTop: 12,
    paddingHorizontal: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: stylesTokens.line,
  },
  topChromeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: stylesTokens.line,
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleBlock: {
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'flex-start',
  },
  titleBlockRTL: {
    alignItems: 'flex-end',
  },
  storeName: {
    color: stylesTokens.dark,
    fontSize: 18,
    fontWeight: '800',
    lineHeight: 22,
  },
  storeSubtitle: {
    color: stylesTokens.muted,
    fontSize: 11,
    marginTop: 2,
    lineHeight: 14,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerMetaRow: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    justifyContent: 'flex-end',
  },
  headerMetaText: {
    color: stylesTokens.muted,
    fontSize: 11,
    fontWeight: '600',
  },
  statusPill: {
    backgroundColor: '#d9f99d',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusPillText: {
    color: stylesTokens.green,
    fontSize: 11,
    fontWeight: '700',
  },
  ratingText: {
    color: stylesTokens.dark,
    fontSize: 12,
    fontWeight: '800',
  },

  heroCard: {
    marginTop: 10,
    marginHorizontal: 12,
    backgroundColor: '#fffdfb',
    borderRadius: 24,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    ...Platform.select({
      ios: {
        shadowColor: '#ff6a00',
        shadowOpacity: 0.08,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  heroIdentityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  heroAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroAvatarText: {
    color: stylesTokens.dark,
    fontSize: 18,
    fontWeight: '800',
  },
  heroIdentityContent: {
    flex: 1,
    alignItems: 'flex-start',
  },
  heroIdentityContentRTL: {
    alignItems: 'flex-end',
  },
  heroTitle: {
    color: stylesTokens.dark,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 30,
  },
  heroSubtitle: {
    color: stylesTokens.muted,
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  trustRow: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-end',
    flexWrap: 'wrap',
  },
  trustChip: {
    backgroundColor: stylesTokens.light,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  trustChipText: {
    color: stylesTokens.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  subscriptionBlock: {
    marginTop: 12,
  },
  tagRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  tagChip: {
    backgroundColor: stylesTokens.chip,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagChipText: {
    color: stylesTokens.chipText,
    fontSize: 12,
    fontWeight: '600',
  },

  modeStripWrap: {
    marginTop: 10,
    paddingHorizontal: 12,
  },
  modeStrip: {
    backgroundColor: stylesTokens.orange,
    borderWidth: 1,
    borderColor: stylesTokens.orangeBorder,
    borderRadius: 999,
    padding: 5,
    gap: 6,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: stylesTokens.orange,
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 2,
      },
    }),
  },
  modePill: {
    flex: 1,
    borderRadius: 999,
    backgroundColor: stylesTokens.orange,
    borderWidth: 1.5,
    borderColor: 'transparent',
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  modePillActive: {
    backgroundColor: stylesTokens.white,
    borderColor: stylesTokens.orange,
  },
  modePillInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  modePillInnerActive: {
    flexDirection: 'row',
  },
  modePillLabel: {
    color: stylesTokens.white,
    fontSize: 13,
    fontWeight: '700',
  },
  modePillLabelActive: {
    color: stylesTokens.orange,
  },

  sectionBlock: {
    marginTop: 14,
    paddingHorizontal: 12,
  },
  categoryRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  categoryPill: {
    backgroundColor: stylesTokens.chip,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  categoryPillSelected: {
    backgroundColor: '#dbeafe',
    borderColor: stylesTokens.blue,
  },
  categoryPillIcon: {
    fontSize: 12,
    color: stylesTokens.chipText,
    fontWeight: '800',
  },
  categoryPillIconSelected: {
    color: stylesTokens.blue,
  },
  categoryPillText: {
    color: stylesTokens.chipText,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryPillTextSelected: {
    color: stylesTokens.blue,
  },

  signalSection: {
    marginTop: 12,
    paddingHorizontal: 12,
  },
  signalRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    justifyContent: 'flex-end',
  },
  signalChipAccent: {
    backgroundColor: stylesTokens.orangeSoft,
    borderWidth: 1,
    borderColor: stylesTokens.orangeBorder,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signalChipAccentText: {
    color: stylesTokens.orange,
    fontSize: 12,
    fontWeight: '800',
  },
  signalChipLight: {
    backgroundColor: stylesTokens.chip,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  signalChipLightText: {
    color: stylesTokens.chipText,
    fontSize: 12,
    fontWeight: '700',
  },

  feedSection: {
    marginTop: 14,
    paddingHorizontal: 12,
  },
  feedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  feedHeaderPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: stylesTokens.orangeSoft,
    borderWidth: 1,
    borderColor: stylesTokens.orangeBorder,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  feedHeaderPillText: {
    color: stylesTokens.orange,
    fontSize: 13,
    fontWeight: '800',
  },
  feedCount: {
    color: stylesTokens.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  feedList: {
    gap: 10,
  },

  menuCard: {
    backgroundColor: stylesTokens.white,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: stylesTokens.line,
    flexDirection: 'row-reverse',
    alignItems: 'stretch',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
      },
      android: {
        elevation: 1,
      },
    }),
  },
  menuCardRTL: {
    flexDirection: 'row-reverse',
  },
  menuActionRail: {
    width: 38,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 4,
  },
  menuActionRailRTL: {
    alignItems: 'center',
  },
  menuActionBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#1d4ed8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuBody: {
    flex: 1,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  menuBodyRTL: {
    alignItems: 'flex-end',
  },
  menuTitle: {
    color: stylesTokens.dark,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 21,
  },
  menuSubtitle: {
    color: stylesTokens.muted,
    fontSize: 12,
    marginTop: 3,
    lineHeight: 17,
  },
  menuMetaRow: {
    marginTop: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    flexWrap: 'wrap',
  },
  menuPrice: {
    color: stylesTokens.dark,
    fontSize: 13,
    fontWeight: '800',
  },
  menuPrep: {
    color: stylesTokens.muted,
    fontSize: 12,
    fontWeight: '600',
  },
  menuChipRow: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'flex-end',
  },
  smallChipPrimary: {
    backgroundColor: '#fee2e2',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  smallChipPrimaryText: {
    color: stylesTokens.red,
    fontSize: 11,
    fontWeight: '800',
  },
  smallChipLight: {
    backgroundColor: stylesTokens.chip,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  smallChipLightText: {
    color: stylesTokens.chipText,
    fontSize: 11,
    fontWeight: '700',
  },
  smallChipDanger: {
    backgroundColor: '#fef2f2',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  smallChipDangerText: {
    color: stylesTokens.red,
    fontSize: 11,
    fontWeight: '700',
  },
  menuImageWrap: {
    width: 86,
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginStart: 6,
  },
  menuImageCard: {
    width: 86,
    height: 86,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  menuImageBadge: {
    position: 'absolute',
    top: 6,
    start: 6,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    zIndex: 1,
  },
  menuImageBadgeText: {
    color: stylesTokens.orange,
    fontSize: 10,
    fontWeight: '800',
  },
  menuEmoji: {
    fontSize: 38,
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 6,
    end: 6,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: stylesTokens.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fed7aa',
  },

  emptyFeed: {
    paddingVertical: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: stylesTokens.line,
    borderRadius: 18,
    backgroundColor: stylesTokens.light,
  },
  emptyFeedEmoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emptyFeedTitle: {
    color: stylesTokens.dark,
    fontSize: 15,
    fontWeight: '800',
  },
  emptyFeedText: {
    marginTop: 4,
    color: stylesTokens.muted,
    fontSize: 12,
    textAlign: 'center',
  },

  fullMenuLink: {
    marginTop: 14,
    marginHorizontal: 12,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: stylesTokens.orangeSoft,
    borderWidth: 1,
    borderColor: stylesTokens.orangeBorder,
  },
  fullMenuLinkText: {
    color: stylesTokens.orange,
    fontSize: 13,
    fontWeight: '800',
  },
  footerNoteWrap: {
    marginTop: 12,
    paddingHorizontal: 12,
  },
});

export default DshStoreGetScreen;
