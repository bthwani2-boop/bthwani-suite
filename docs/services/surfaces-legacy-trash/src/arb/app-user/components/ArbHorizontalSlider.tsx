// ARB UX Design System — ArbHorizontalSlider
// حاوية ScrollView أفقية لعرض قائمة عناصر (فئات أو بطاقات عروض)
// ARB_UX_DESIGN_SYSTEM §4.3

import React from 'react';
import { ScrollView, StyleSheet, ViewStyle } from 'react-native';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';

export interface ArbHorizontalSliderProps {
  children: React.ReactNode;
  contentContainerStyle?: ViewStyle;
  spacing?: number;
}

export const ArbHorizontalSlider: React.FC<ArbHorizontalSliderProps> = ({
  children,
  contentContainerStyle,
  spacing = BTHWANI_SPACING.md,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={[
        styles.content,
        { paddingEnd: spacing },
        contentContainerStyle,
      ]}
      style={styles.scroll}
    >
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 0,
  },
  content: {
    paddingStart: BTHWANI_SPACING.lg,
    alignItems: 'stretch',
  },
});

export default ArbHorizontalSlider;
