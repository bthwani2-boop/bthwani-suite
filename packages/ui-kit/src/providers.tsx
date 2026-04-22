/**
 * Lean UI Kit providers facade.
 *
 * Canonical rule:
 * - src/providers.tsx is only a thin public facade.
 * - real provider implementation now lives in top-level provider files.
 * - this keeps ../providers imports stable while the legacy folder is retired.
 */

export * from './foundation';
export * from './components';


// AUTO-BRIDGE:UIKIT_THIN_FAMILY_PROVIDERS:BEGIN
// Purpose: keep provider and shell exports here while the component families move to src/components.tsx.
export { BTH_ROOT_DEFAULTS } from './BthRootDefaults';
export { BthBox } from './primitives';
export { BthHighlightsRail } from './List';
export { BthMobileProviders } from './BthMobileProviders';
export { BthMobileRoot } from './BthMobileRoot';
export { BthPortalHost } from './BthPortalHost';
export { BthPortalLayer } from './BthPortalHost';
export { BthRootProviders } from './BthRootProviders';
export { bthStateIds } from './states';
export { BthText } from './primitives';
export { BthWebDocumentShell } from './BthWebDocumentShell';
export { BthWebMissionHeroCard } from './BthWebMissionHeroCard';
export { BthWebRootLayout } from './BthWebRootLayout';
export { buildWebRootMetadata } from './buildWebRootMetadata';
export { DirectionProvider } from './DirectionProvider';
export { getBthStateDefinition } from './states';
export { ThemeProvider } from './ThemeProvider';
export { UiKitProvider } from './UiKitProvider';
export { useDirection } from './hooks';
export { useDirectionContext } from './DirectionProvider';
export { useI18n } from './hooks';
export { useTheme } from './hooks';
export { useThemeContext } from './ThemeProvider';
export { useUiLanguage } from './hooks';
export { useUiText } from './hooks';
export type { BthBoxBackground } from './primitives';
export type { BthBoxBorderTone } from './primitives';
export type { BthBoxProps } from './primitives';
export type { BthHighlightsRailItem } from './List';
export type { BthHighlightsRailProps } from './List';
export type { BthMobileRootProps } from './BthMobileRoot';
export type { BthPortalLayerProps } from './BthPortalHost';
export type { BthRootConfig } from './BthRootConfig';
export type { BthRootProvidersProps } from './BthRootProviders';
export type { BthStateDefinition } from './states';
export type { BthStateId } from './states';
export type { BthStateKind } from './states';
export type { BthStateTone } from './states';
export type { BthTextProps } from './primitives';
export type { BthWebMissionHeroCardProps } from './BthWebMissionHeroCard';
export type { BthWebRootLayoutProps } from './BthWebRootLayout';
export type { DirectionProviderProps } from './DirectionProvider';
export type { ThemeProviderProps } from './ThemeProvider';
export type { UiKitProviderProps } from './UiKitProvider';
// AUTO-BRIDGE:UIKIT_THIN_FAMILY_PROVIDERS:END

