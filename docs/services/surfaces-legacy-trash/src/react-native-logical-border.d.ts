/**
 * Augment React Native ViewStyle with logical border block properties.
 * RN 0.81+ supports these at runtime; @types/react-native may lag.
 * Used for RTL-safe vertical borders (borderBlockEnd = bottom in LTR, top in RTL when block flow is vertical).
 */
import type { ViewStyle } from 'react-native';

declare module 'react-native' {
  interface ViewStyle {
    borderBlockEndWidth?: number;
    borderBlockStartWidth?: number;
    borderBlockEndColor?: string;
    borderBlockStartColor?: string;
  }
}
