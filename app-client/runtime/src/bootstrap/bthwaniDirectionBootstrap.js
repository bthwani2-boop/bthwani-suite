// BThwani app-client direction bootstrap.
// MUST be pure CJS — this file is require()'d from index.js AFTER expo initializes.
// An ESM `import` here gets hoisted by Metro before the require('expo') call,
// which breaks ExceptionsManager initialization order.
'use strict';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const RN = require('react-native');
const I18nManager = RN.I18nManager;

// Device language must not auto-mirror app-client.
// UI Kit / root providers own direction decisions.
try {
  if (I18nManager) {
    I18nManager.allowRTL(false);
    I18nManager.forceRTL(false);
    I18nManager.swapLeftAndRightInRTL(false);
  }
} catch (e) {
  // Silent fail for non-critical environment locks
}
