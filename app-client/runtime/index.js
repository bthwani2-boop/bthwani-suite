// Pure CJS entry — do NOT mix ESM `import` here.
// Metro hoists all static `import` statements to the top of the module,
// which would run bthwaniDirectionBootstrap before expo/react-native are ready.
// Using `require()` preserves execution order and prevents:
//   "ExceptionsManager should be set up after React DevTools"
//   "TypeError: property is not writable"
const { registerRootComponent } = require('expo');

// Bootstrap runs AFTER expo initialises ExceptionsManager + DevTools hooks
require('./src/bootstrap/bthwaniDirectionBootstrap');

const { default: App } = require('./App');

registerRootComponent(App);
