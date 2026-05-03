import { I18nManager } from 'react-native';

// BThwani app-client direction bootstrap.
// Device language must not auto-mirror app-client.
// UI Kit/root providers own direction decisions.

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL(false);

globalThis.__BTHWANI_APP_CLIENT_DIRECTION_BOOTSTRAPPED__ = true;
