/*
 * Root app-shells export is intentionally web-only.
 * This prevents Next/control-panel from pulling Expo/React Native mobile entrypoints
 * through the package root during web bundling.
 *
 * Mobile apps must use explicit mobile subpaths:
 * - @bthwani/app-shells/mobile/client
 * - @bthwani/app-shells/mobile/partner
 * - @bthwani/app-shells/mobile/captain
 * - @bthwani/app-shells/mobile/field
 */
export * from './web';
