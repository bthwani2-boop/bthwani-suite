/**
 * MRF-only adaptive layout hook.
 * Replaces root ui-kit useAdaptiveLayout for non-allowlisted MRF components.
 */

import { useWindowDimensions } from 'react-native';

export type SizeClass = 'COMPACT' | 'MEDIUM' | 'EXPANDED';

const MEDIUM_MIN = 600;
const EXPANDED_MIN = 840;

function getSizeClass(width: number): SizeClass {
  if (width >= EXPANDED_MIN) return 'EXPANDED';
  if (width >= MEDIUM_MIN) return 'MEDIUM';
  return 'COMPACT';
}

export interface MrfAdaptiveLayout {
  width: number;
  height: number;
  sizeClass: SizeClass;
}

export function useMrfAdaptiveLayout(): MrfAdaptiveLayout {
  const { width, height } = useWindowDimensions();
  return {
    width,
    height,
    sizeClass: getSizeClass(width),
  };
}
