import { I18nManager } from 'react-native';

// BThwani app-client direction bootstrap.
// Device language must not auto-mirror app-client.
// UI Kit/root providers own direction decisions.

try {
  I18nManager.allowRTL(false);
  I18nManager.forceRTL(false);
  I18nManager.swapLeftAndRightInRTL(false);
} catch (e) {
  // Silent fail for non-critical environment locks
}
