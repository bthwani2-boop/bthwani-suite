import { I18nManager } from 'react-native';

// BThwani mobile direction bootstrap.
// Device language must not auto-mirror this app.
// Direction is owned by BThwani UI Kit/root providers.

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL(false);

globalThis.__BTHWANI_MOBILE_DIRECTION_BOOTSTRAPPED__ = true;
