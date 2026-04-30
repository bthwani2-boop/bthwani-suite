import { I18nManager } from 'react-native';

// BThwani mobile direction bootstrap.
// Device language must not auto-mirror this app.
// Direction is owned by BThwani UI Kit/root providers.
// NOTE (example-only): Bootstrap constants are canonical references and must not contain runtime secrets or tokens.
// Use placeholders and manage runtime values via secure configuration.

I18nManager.allowRTL(false);
I18nManager.forceRTL(false);
I18nManager.swapLeftAndRightInRTL(false);

globalThis.__BTHWANI_MOBILE_DIRECTION_BOOTSTRAPPED__ = true;
