/**
 * KWD-only bottom sheet layout constants and hook.
 * Replaces root ui-kit layout/adaptive usage for non-allowlisted KWD components.
 */

import { useWindowDimensions } from 'react-native';

/** Overlay/sheet max height as ratio of viewport (0–1). */
export const OVERLAY_MAX_HEIGHT_RATIO = 0.85;

export interface KwdLayoutDimensions {
  width: number;
  height: number;
}

export function useKwdLayoutDimensions(): KwdLayoutDimensions {
  const { width, height } = useWindowDimensions();
  return { width, height };
}
