import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';

export const SND_MIN_TOUCH_TARGET = 44;
export const SND_INTERACTIVE_HIT_SLOP = {
  top: 6,
  bottom: 6,
  left: 6,
  right: 6,
} as const;

export function useSndReducedMotion() {
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(false);

  useEffect(() => {
    let isMounted = true;

    AccessibilityInfo.isReduceMotionEnabled()
      .then(enabled => {
        if (isMounted) {
          setReduceMotionEnabled(Boolean(enabled));
        }
      })
      .catch(() => {
        // Ignore unavailable platforms and keep motion enabled by default.
      });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      enabled => {
        setReduceMotionEnabled(Boolean(enabled));
      }
    );

    return () => {
      isMounted = false;
      subscription?.remove?.();
    };
  }, []);

  return reduceMotionEnabled;
}