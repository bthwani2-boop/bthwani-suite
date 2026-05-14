"use client";
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { colorPalette, radius, resolveTextAlign, spacing } from '../foundation';
import { useDirection } from '../providers';
import { Text } from '../primitives';

export type OrbitAnchorLayout = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type OrbitCarouselPlacement = 'bottom-sheet';

export type OrbitCarouselItem = {
  id: string;
  key: string;
  title: string;
  shortLabel?: string;
  subtitle?: string;
  iconUrl: string | null;
  emojiFallback?: string;
};

export type OrbitCarouselProps = {
  visible: boolean;
  items: OrbitCarouselItem[];
  onClose: () => void;
  onSelect: (item: OrbitCarouselItem) => void;
  anchorLayout?: OrbitAnchorLayout | null;
  placement?: OrbitCarouselPlacement;
};

function BentoCategoryTile({
  item,
  onPress,
}: {
  item: OrbitCarouselItem;
  onPress: () => void;
}) {
  const { direction } = useDirection();
  return (
    <View style={styles.tileSlot}>
      <Pressable onPress={onPress} style={({ pressed }) => [styles.tilePressable, { opacity: pressed ? 0.94 : 1 }]}>
        <View style={styles.tileCard}>
          <View style={styles.tileIconBox}>
            {item.iconUrl ? (
              <Image source={{ uri: item.iconUrl }} style={styles.tileIcon} resizeMode="contain" />
            ) : (
              <Text role="titleLg" style={styles.tileEmoji}>{item.emojiFallback || '📦'}</Text>
            )}
          </View>

          <View style={styles.tileTextContent}>
            <Text role="bodySm" numberOfLines={2} align="center" style={styles.tileTitle}>
              {item.shortLabel ?? item.title}
            </Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
}

function OrbitCarouselBase({
  visible,
  items,
  onClose,
  onSelect,
  anchorLayout,
}: OrbitCarouselProps) {
  const { direction } = useDirection();
  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const contentTopInset = React.useMemo(() => {
    const anchorBottom = anchorLayout ? anchorLayout.y + anchorLayout.height : spacing[14];
    return Math.max(spacing[6], Math.min(screenHeight * 0.28, anchorBottom + spacing[4]));
  }, [anchorLayout, screenHeight]);
  const maxHeight = Math.max(280, screenHeight - contentTopInset - spacing[5]);
  const contentWidth = Math.min(screenWidth - spacing[6], 560);

  if (!visible) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.portalRoot}>
      <Pressable accessibilityRole="button" accessibilityLabel="إغلاق قائمة الفئات" onPress={onClose} style={styles.backdropPressable}>
        <View style={styles.backdrop} />
      </Pressable>

      <View
        accessibilityViewIsModal
        importantForAccessibility="yes"
        style={[
          styles.hubContainer,
          {
            width: contentWidth,
            maxHeight,
          },
        ]}
      >
        <View style={[styles.hubHeader, { alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }]}>
          <View style={styles.headerLine} />
          <Text role="titleMd" align="start" style={styles.hubHeaderTitle}>
            كل التصنيفات
          </Text>
          <Text role="bodySm" align="start" style={styles.hubHeaderSubtitle}>
            تصفح الفئات المتاحة واختر المسار المناسب مباشرة.
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.gridContent}
          showsVerticalScrollIndicator={false}
          bounces
        >
          <View style={styles.bentoGrid}>
            {items.map((item) => (
              <BentoCategoryTile
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

        <View style={styles.hubFooter}>
          <Pressable style={({ pressed }) => [styles.closeBtn, { opacity: pressed ? 0.94 : 1 }]} onPress={onClose}>
            <Text role="bodySm" style={styles.closeBtnText}>إغلاق</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export function OrbitCarousel(props: OrbitCarouselProps) {
  return <OrbitCarouselBase {...props} />;
}

export function CategoryOrbitCarousel(props: Omit<OrbitCarouselProps, 'placement'>) {
  return <OrbitCarouselBase {...props} placement="bottom-sheet" />;
}

export function ServiceOrbitCarousel(props: Omit<OrbitCarouselProps, 'placement'>) {
  return <OrbitCarouselBase {...props} placement="bottom-sheet" />;
}

const styles = StyleSheet.create({
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
    backgroundColor: 'rgba(10, 47, 92, 0.36)',
  },
  hubContainer: {
    backgroundColor: colorPalette.white,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colorPalette.line,
    overflow: 'hidden',
    marginBottom: spacing[5],
    shadowColor: colorPalette.black,
    shadowOpacity: 0.16,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 16,
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
    borderRadius: 999,
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
  tileSlot: {
    width: '31.5%',
    aspectRatio: 0.9,
    marginBottom: spacing[2],
  },
  tilePressable: {
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
  tileIconBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tileIcon: {
    width: 44,
    height: 44,
  },
  tileEmoji: {
    fontSize: 30,
  },
  tileTextContent: {
    alignItems: 'center',
    marginTop: spacing[1],
  },
  tileTitle: {
    color: colorPalette.brandStrong,
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
