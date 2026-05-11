import { I18nManager } from 'react-native';

// BThwani app-client direction bootstrap.
// Device language must not auto-mirror app-client.
// UI Kit/root providers own direction decisions.
// Keep this bootstrap side-effect safe because React Native DevTools/Fabric
// may expose non-writable runtime globals during development reloads.

const BOOTSTRAP_FLAG = '__BTHWANI_APP_CLIENT_DIRECTION_BOOTSTRAPPED__';

function safeBootstrapCall(action) {
  try {
    action();
  } catch {
    // Direction bootstrap must never crash app startup.
  }
}

safeBootstrapCall(() => I18nManager.allowRTL(false));
safeBootstrapCall(() => I18nManager.forceRTL(false));
safeBootstrapCall(() => I18nManager.swapLeftAndRightInRTL(false));

try {
  const descriptor = Object.getOwnPropertyDescriptor(globalThis, BOOTSTRAP_FLAG);

  if (!descriptor) {
    Object.defineProperty(globalThis, BOOTSTRAP_FLAG, {
      value: true,
      writable: true,
      configurable: true,
      enumerable: false,
    });
  } else if ('writable' in descriptor && descriptor.writable) {
    globalThis[BOOTSTRAP_FLAG] = true;
  }
} catch {
  // Ignore non-writable runtime global state in dev-client.
}
