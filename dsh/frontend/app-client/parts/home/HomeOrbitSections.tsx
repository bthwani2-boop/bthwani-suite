import * as React from 'react';
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type ImageSourcePropType,
} from 'react-native';
import { ServiceOrbitCarousel, colorPalette, radius, spacing, useDirection, withAlpha, shadowPresets,
  typographyRoles,
} from '@bthwani/ui-kit';
import { Text } from '@bthwani/ui-kit';

import type { DshServiceId } from '../../contracts/dsh-home-types';
import type { HomeScreenShellProps } from './HomeScreenShell';
import type { DshHomeServiceDialItem } adapters/home-service-config';
import { DSH_HOME_SERVICE_DIAL_ITEMS as dshHomeServiceDialFixtures } adapters/home-service-config';
import { resolveDshImageSource } media/resolve-dsh-image-source';

// --------------------------------------------------------------------------
// Local DSH category tile — uses runtime media resolution or emoji fallback.
// Does NOT rely on getDshCategoryIconUrl (which needs an env var HTTP base URL).
// --------------------------------------------------------------------------

type DshCategoryDialItem = {
  id: string;
  key: string;
  title: string;
  shortLabel?: string;
  subtitle?: string;
  /** Central media key — dsh.category.main.<id>.v1 */
  mediaKey?: string;
  emojiFallback?: string;
};

function DshCategoryTile({
  item,
  onPress,
}: {
  item: DshCategoryDialItem;
  onPress: () => void;
}) {
  const imageSource: ImageSourcePropType | undefined = item.mediaKey
    ? resolveDshImageSource(item.mediaKey)
    : undefined;

  return (
    <View style={tileStyles.slot}>
      <Pressable onPress={onPress} style={({ pressed }) => [tileStyles.pressable, { opacity: pressed ? 0.94 : 1 }]}>
        <View style={tileStyles.tileCard}>
          <View style={tileStyles.iconBox}>
            {imageSource ? (
              <Image source={imageSource} style={tileStyles.icon} resizeMode="cover" />
            ) : (
              <Text role="titleLg" style={tileStyles.emoji}>{item.emojiFallback ?? '📦'}</Text>
            )}
          </View>
          <View style={tileStyles.textContent}>
            <Text role="bodySm" numberOfLines={2} align="center" style={tileStyles.title}>
              {item.shortLabel ?? item.title}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

function DshCategoryOrbitCarouselBase({
  visible,
  items,
  onClose,
  onSelect,
}: {
  visible: boolean;
  items: DshCategoryDialItem[];
  onClose: () => void;
  onSelect: (item: DshCategoryDialItem) => void;
}) {
  const { direction } = useDirection();

  if (!visible) return null;

  return (
    <View pointerEvents="box-none" style={carouselStyles.portalRoot}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="إغلاق قائمة الفئات"
        onPress={onClose}
        style={carouselStyles.backdropPressable}
      >
        <View style={carouselStyles.backdrop} />
      </Pressable>

      <View
        accessibilityViewIsModal
        importantForAccessibility="yes"
        style={carouselStyles.hubContainer}
      >
        <View style={[carouselStyles.hubHeader, { alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }]}>
          <View style={carouselStyles.headerLine} />
          <Text role="titleMd" align="start" style={carouselStyles.hubHeaderTitle}>
            كل التصنيفات
          </Text>
          <Text role="bodySm" align="start" style={carouselStyles.hubHeaderSubtitle}>
            تصفح الفئات المتاحة واختر المسار المناسب مباشرة.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={carouselStyles.gridContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={carouselStyles.bentoGrid}>
            {items.map((item) => (
              <DshCategoryTile
                key={item.id}
                item={item}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              />
            ))}
          </View>
        </ScrollView>

        <View style={carouselStyles.hubFooter}>
          <Pressable
            style={({ pressed }) => [carouselStyles.closeBtn, { opacity: pressed ? 0.94 : 1 }]}
            onPress={onClose}
          >
            <Text role="bodySm" style={carouselStyles.closeBtnText}>إغلاق</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

// --------------------------------------------------------------------------
// Exports
// --------------------------------------------------------------------------

export const HomeCategoryDialSection = React.memo(function HomeCategoryDialSection({
  props,
  homeState,
  categoriesDialItems,
  selectCategoryPage,
}: Pick<HomeScreenShellProps, 'props' | 'homeState' | 'selectCategoryPage'> & { categoriesDialItems: DshCategoryDialItem[] }) {
  return (
    <DshCategoryOrbitCarouselBase
      visible={homeState.categoriesSheetVisible}
      items={categoriesDialItems}
      onClose={() => homeState.setCategoriesSheetVisible(false)}
      onSelect={(item: DshCategoryDialItem) => {
        selectCategoryPage(item.key);
        homeState.setCategoriesSheetVisible(false);
        if (item.key === 'awnak') {
          props.onOpenCategory?.('awnak');
          return;
        }
        if (item.key === 'shein') {
          props.onOpenSheinInfo?.();
        }
      }}
    />
  );
});

export const HomeServiceDialSection = React.memo(function HomeServiceDialSection({
  props,
  homeState,
}: Pick<HomeScreenShellProps, 'props' | 'homeState'>) {
  return (
    <ServiceOrbitCarousel
      visible={homeState.serviceDialVisible}
      anchorLayout={{
        x: spacing[3],
        y: spacing[14],
        width: 46,
        height: 46,
      }}
      items={dshHomeServiceDialFixtures}
      onClose={() => homeState.setServiceDialVisible(false)}
      onSelect={(item: { key: string }) => {
        homeState.setServiceDialVisible(false);
        if (item.key === 'dsh') return;
        if (item.key === 'wlt') {
          props.onOpenWallet?.();
          return;
        }
        props.onOpenService?.(item.key as DshServiceId);
      }}
    />
  );
});

// --------------------------------------------------------------------------
// Styles — mirrors CategoryOrbitCarousel from ui-kit for visual parity
// --------------------------------------------------------------------------

const tileStyles = StyleSheet.create({
  slot: {
    width: '31.5%',
    aspectRatio: 0.9,
    marginBottom: spacing[2],
  },
  pressable: {
    flex: 1,
  },
  tileCard: {
    flex: 1,
    borderRadius: radius.lg,
    backgroundColor: colorPalette.white,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[3],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colorPalette.brandSurface,
  },
  iconBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    width: 52,
    height: 52,
    borderRadius: radius.sm,
  },
  emoji: {
    fontSize: typographyRoles.hero.fontSize,
  },
  textContent: {
    alignItems: 'center',
    marginTop: spacing[1],
  },
  title: {
    color: colorPalette.brandStrong,
  },
});

const carouselStyles = StyleSheet.create({
  portalRoot: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    zIndex: 400,
  },
  backdropPressable: {
    ...StyleSheet.absoluteFillObject,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: withAlpha(colorPalette.brandStrong, 0.36),
  },
  hubContainer: {
    backgroundColor: colorPalette.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colorPalette.line,
    overflow: 'hidden',
    marginBottom: spacing[5],
    width: '90%',
    maxWidth: 560,
    maxHeight: 520,
    ...shadowPresets.floating,
  },
  hubHeader: {
    paddingTop: spacing[5],
    paddingBottom: spacing[3],
    paddingHorizontal: spacing[5],
    gap: spacing[1],
  },
  headerLine: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: colorPalette.brand,
    marginBottom: spacing[1],
  },
  hubHeaderTitle: {
    color: colorPalette.brandStrong,
    width: '100%',
  },
  hubHeaderSubtitle: {
    color: colorPalette.inkMuted,
    width: '100%',
  },
  gridContent: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  hubFooter: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
  },
  closeBtn: {
    height: 48,
    borderRadius: radius.lg,
    backgroundColor: colorPalette.brandSurface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colorPalette.brand,
  },
  closeBtnText: {
    color: colorPalette.brandStrong,
  },
});
