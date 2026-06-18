import * as React from 'react';

import { colorPalette } from '@bthwani/ui-kit';
import { stylesTokens } from './store-screen.styles';

function hexToRgba(hex: string, alpha = 0.9) {
  const clean = (hex || colorPalette.white).replace('#', '').trim();
  const short = clean.length === 3;
  const red = parseInt(short ? clean[0] + clean[0] : clean.slice(0, 2), 16);
  const green = parseInt(short ? clean[1] + clean[1] : clean.slice(2, 4), 16);
  const blue = parseInt(short ? clean[2] + clean[2] : clean.slice(4, 6), 16);
  return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

type StoreAppearanceTokens = { colors: { accentOrange: string; surfaceRaised: string; surfacePrimary: string; glassBorder: string; borderSubtle: string; textPrimary: string; textSecondary: string; overlaySoft: string }; actionSelectedBackground: string; components: { commerce: { deliverySelectedBorder: string }; overlays: { modalBorder: string; modalSurface: string; modalBackdrop: string } }; glassSurface: string; appBackground: string };

export function useStoreAppearanceChrome({ isDarkGlass, tokens }: { isDarkGlass: boolean; tokens: StoreAppearanceTokens }) {
  return React.useMemo(() => ({
    accent: tokens.colors.accentOrange,
    activeActionBackground: tokens.actionSelectedBackground,
    activeActionBorder: tokens.components.commerce.deliverySelectedBorder,
    cardBackground: isDarkGlass ? tokens.colors.surfaceRaised : tokens.colors.surfacePrimary,
    cardBorder: isDarkGlass ? tokens.colors.glassBorder : tokens.colors.borderSubtle,
    modalBorder: tokens.components.overlays.modalBorder,
    modalSurface: tokens.components.overlays.modalSurface,
    overlay: tokens.components.overlays.modalBackdrop,
    overlaySoft: isDarkGlass ? tokens.colors.overlaySoft : stylesTokens.overlaySoft,
    primaryText: tokens.colors.textPrimary,
    screenBackground: tokens.appBackground,
    secondaryText: tokens.colors.textSecondary,
    subtleSurface: isDarkGlass ? tokens.glassSurface : tokens.colors.surfaceRaised,
    echoImageOpacity: isDarkGlass ? 0.6 : 1,
    cbWashColor: isDarkGlass ? hexToRgba(stylesTokens.black, 0.82) : hexToRgba(stylesTokens.white, 0.88),
  }), [isDarkGlass, tokens]);
}

type AppearanceChrome = ReturnType<typeof useStoreAppearanceChrome>;

export function useStoreMeasurementAppearance({ appearanceChrome, isDarkGlass, theme, tokens }: { appearanceChrome: AppearanceChrome; isDarkGlass: boolean; theme: { brandContrast: string }; tokens: { glassMutedText: string } }) {
  return React.useMemo(() => ({
    overlaySoft: appearanceChrome.overlaySoft,
    activeActionBackground: appearanceChrome.activeActionBackground,
    activeActionBorder: appearanceChrome.activeActionBorder,
    accent: appearanceChrome.accent,
    modalSurface: appearanceChrome.modalSurface,
    modalBorder: appearanceChrome.modalBorder,
    primaryText: appearanceChrome.primaryText,
    secondaryText: appearanceChrome.secondaryText,
    subtleSurface: appearanceChrome.subtleSurface,
    brandContrastColor: theme.brandContrast,
    glassMutedTextColor: tokens.glassMutedText,
    isDarkGlass,
  }), [appearanceChrome, isDarkGlass, theme.brandContrast, tokens.glassMutedText]);
}
