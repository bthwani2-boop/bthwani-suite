/**
 * SND-only layout helpers for sheet/screen content.
 * Replaces root ui-kit layout/adaptive usage for non-allowlisted SND components.
 */

import { useWindowDimensions } from 'react-native';
import { BTHWANI_SPACING } from '@bthwani/ui-kit';

/** Canonical ScrollView/FlatList contentContainerStyle for SND sheets. */
export const sndScrollContentContainerStyle = {
  paddingHorizontal: BTHWANI_SPACING.md,
  paddingBottom: BTHWANI_SPACING.xl,
  flexGrow: 1 as const,
};

/** Overlay/sheet max height as ratio of viewport (0–1). */
export const OVERLAY_MAX_HEIGHT_RATIO = 0.85;

export function useSndLayoutDimensions(): { width: number; height: number } {
  const { width, height } = useWindowDimensions();
  return { width, height };
}
