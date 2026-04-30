export type SafeGoBackNavigation = {
  canGoBack?: () => boolean;
  goBack?: () => void;
  navigate?: (routeName: string, params?: unknown) => void;
};

/**
 * SafeGoBack — prevents "exit app" behaviour when the current screen is already the root
 * of the navigation stack (Android hardware/UI back).
 *
 * It prefers `canGoBack()` when available; otherwise it falls back to `goBack()`.
 */
export function safeGoBack(
  navigation: SafeGoBackNavigation | undefined | null,
  fallbackRouteName: string,
): void {
  if (!navigation) return;

  try {
    if (typeof navigation.canGoBack === 'function') {
      if (navigation.canGoBack()) {
        navigation.goBack?.();
        return;
      }
      // Root stack: don't call goBack() to avoid app exit; route explicitly.
      navigation.navigate?.(fallbackRouteName);
      return;
    }
  } catch {
    // If canGoBack throws for any reason, we will attempt goBack and only then fallback.
  }

  try {
    if (typeof navigation.goBack === 'function') {
      navigation.goBack();
      return;
    }
  } catch {
    // ignored
  }

  navigation.navigate?.(fallbackRouteName);
}

