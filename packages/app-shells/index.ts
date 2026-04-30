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

// NOTE (example-only): Exports and identifiers here may reference canonical package IDs.
// Do not hard-code runtime secrets in package entry points. Use placeholders and secure secret stores.
