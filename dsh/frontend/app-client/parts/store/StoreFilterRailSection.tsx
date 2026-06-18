import * as React from 'react';
import { Animated, Platform, View } from 'react-native';
import { BThwaniFilterRail, Text,
  spacing,
} from '@bthwani/ui-kit';
import type { useStoreAppearanceChrome } from './store-appearance-chrome';
import type { styles as storeScreenStyles } from './store-screen.styles';

type StoreFilterRailSectionProps = {
  categoryRailItems: import('@bthwani/ui-kit').BThwaniFilterRailItem[];
  selectedCategory: string;
  changeCategory: (id: string) => void;
  isDarkGlass: boolean;
  scrollY: Animated.Value;
  stickyThreshold: number;
  appearanceChrome: ReturnType<typeof useStoreAppearanceChrome>;
  styles: typeof storeScreenStyles;
  mode?: 'inline' | 'sticky';
};

export const StoreFilterRailSection = React.memo(function StoreFilterRailSection({
  categoryRailItems,
  selectedCategory,
  changeCategory,
  isDarkGlass,
  scrollY,
  stickyThreshold,
  appearanceChrome,
  styles,
  mode = 'inline',
}: StoreFilterRailSectionProps) {
  if (mode === 'sticky') {
    return (
      <Animated.View
        style={[
          styles.stickyCategoriesOverlay,
          {
            backgroundColor: isDarkGlass ? 'rgba(22, 22, 28, 0.94)' : 'rgba(255, 255, 255, 0.94)',
            borderBottomColor: appearanceChrome.modalBorder,
            transform: [{
              translateY: scrollY.interpolate({
                inputRange: [0, Math.max(1, stickyThreshold)],
                outputRange: [stickyThreshold, 0],
                extrapolate: 'clamp',
              }),
            }],
            opacity: scrollY.interpolate({
              inputRange: [stickyThreshold - 120, stickyThreshold - 20],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            }),
            paddingTop: Platform.OS === 'ios' ? 48 : 28,
          },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.stickyCategoriesContent}>
          <View style={[styles.sectionHeader, { paddingHorizontal: spacing[4], marginBottom: spacing[2] }]}>
            <Text role="labelLg" weight="black" style={[styles.sectionTitle, { color: appearanceChrome.primaryText }]}>قائمة الأصناف</Text>
          </View>
          <View style={styles.sectionBlock}>
            <BThwaniFilterRail
              items={categoryRailItems}
              selectedId={selectedCategory}
              onSelectedIdChange={changeCategory}
              variant={isDarkGlass ? 'glass' : 'default'}
              sticky
              testID="store-category-rail-sticky"
            />
          </View>
        </View>
      </Animated.View>
    );
  }

  return (
    <View style={styles.sectionBlock}>
      <BThwaniFilterRail
        items={categoryRailItems}
        selectedId={selectedCategory}
        onSelectedIdChange={changeCategory}
        variant={isDarkGlass ? 'glass' : 'default'}
        testID="store-category-rail"
      />
    </View>
  );
});
