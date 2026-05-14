import { withAlpha, type ThemeMode } from './foundation';

// lightPremium = base light + selective glass.
// darkGlass = full dark glass foundation.
// No application adopts these modes in this phase.
export type BThwaniAppearanceMode = 'lightPremium' | 'darkGlass';

export type BThwaniGlassRole = 'surface' | 'surfaceStrong' | 'heroOverlay';

export type BThwaniAppearancePalette = {
  deepBlue: string;
  orange: string;
  white: string;
  offWhite: string;
  softWhite: string;
  navyNight: string;
  navyNightElevated: string;
  navyEmphasis: string;
  inkMuted: string;
};

export type BThwaniAppearanceShadow = {
  shadowColor: string;
  shadowOpacity: number;
  shadowRadius: number;
  shadowOffset: {
    width: number;
    height: number;
  };
  elevation: number;
};

export type BThwaniAppearanceTokens = {
  mode: BThwaniAppearanceMode;
  themeMode: ThemeMode;
  isDark: boolean;
  palette: BThwaniAppearancePalette;
  appBackground: string;
  appBackgroundElevated: string;
  surface: string;
  surfaceRaised: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  border: string;
  borderStrong: string;
  accent: string;
  accentMuted: string;
  success: string;
  warning: string;
  danger: string;
  glassSurface: string;
  glassSurfaceStrong: string;
  glassBorder: string;
  glassText: string;
  glassMutedText: string;
  heroOverlay: string;
  heroOverlayStrong: string;
  chipBackground: string;
  chipSelectedBackground: string;
  actionBackground: string;
  actionSelectedBackground: string;
  productCardBackground: string;
  promoCardBackground: string;
  shadowSoft: BThwaniAppearanceShadow;
  shadowPremium: BThwaniAppearanceShadow;
};

export type BThwaniGlassRecipe = {
  backgroundColor: string;
  borderColor: string;
  textColor: string;
  mutedTextColor: string;
};

export const bthwaniAppearanceModes = Object.freeze(['lightPremium', 'darkGlass'] as const);

export const defaultBThwaniAppearanceMode: BThwaniAppearanceMode = 'lightPremium';

const successColor = '#16A34A';
const warningColor = '#D97706';
const dangerColor = '#DC2626';

const appearancePaletteByMode = {
  lightPremium: {
    deepBlue: '#0A2F5C',
    orange: '#FF500D',
    white: '#FFFFFF',
    offWhite: '#F7F9FC',
    softWhite: '#FCFDFE',
    navyNight: '#0A2F5C',
    navyNightElevated: '#133A6A',
    navyEmphasis: '#35577D',
    inkMuted: '#6B809C',
  },
  darkGlass: {
    deepBlue: '#0A2F5C',
    orange: '#FF500D',
    white: '#FFFFFF',
    offWhite: '#F5F7FA',
    softWhite: '#FBFCFE',
    navyNight: '#08111E',
    navyNightElevated: '#0E1A2A',
    navyEmphasis: '#13233B',
    inkMuted: '#9FB0C8',
  },
} as const satisfies Record<BThwaniAppearanceMode, BThwaniAppearancePalette>;

const appearanceTokensByMode = {
  lightPremium: {
    mode: 'lightPremium',
    themeMode: 'light',
    isDark: false,
    palette: appearancePaletteByMode.lightPremium,
    appBackground: appearancePaletteByMode.lightPremium.offWhite,
    appBackgroundElevated: appearancePaletteByMode.lightPremium.white,
    surface: appearancePaletteByMode.lightPremium.white,
    surfaceRaised: appearancePaletteByMode.lightPremium.softWhite,
    surfaceMuted: '#F1F5F9',
    textPrimary: appearancePaletteByMode.lightPremium.deepBlue,
    textSecondary: appearancePaletteByMode.lightPremium.navyEmphasis,
    textMuted: appearancePaletteByMode.lightPremium.inkMuted,
    border: withAlpha(appearancePaletteByMode.lightPremium.deepBlue, 0.1),
    borderStrong: withAlpha(appearancePaletteByMode.lightPremium.deepBlue, 0.18),
    accent: appearancePaletteByMode.lightPremium.orange,
    accentMuted: withAlpha(appearancePaletteByMode.lightPremium.orange, 0.14),
    success: successColor,
    warning: warningColor,
    danger: dangerColor,
    glassSurface: withAlpha(appearancePaletteByMode.lightPremium.white, 0.72),
    glassSurfaceStrong: withAlpha(appearancePaletteByMode.lightPremium.white, 0.86),
    glassBorder: withAlpha(appearancePaletteByMode.lightPremium.deepBlue, 0.12),
    glassText: appearancePaletteByMode.lightPremium.deepBlue,
    glassMutedText: appearancePaletteByMode.lightPremium.inkMuted,
    heroOverlay: withAlpha(appearancePaletteByMode.lightPremium.deepBlue, 0.12),
    heroOverlayStrong: withAlpha(appearancePaletteByMode.lightPremium.deepBlue, 0.22),
    chipBackground: appearancePaletteByMode.lightPremium.white,
    chipSelectedBackground: withAlpha(appearancePaletteByMode.lightPremium.orange, 0.12),
    actionBackground: appearancePaletteByMode.lightPremium.white,
    actionSelectedBackground: appearancePaletteByMode.lightPremium.orange,
    productCardBackground: appearancePaletteByMode.lightPremium.white,
    promoCardBackground: withAlpha(appearancePaletteByMode.lightPremium.orange, 0.08),
    shadowSoft: {
      shadowColor: appearancePaletteByMode.lightPremium.deepBlue,
      shadowOpacity: 0.08,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    shadowPremium: {
      shadowColor: appearancePaletteByMode.lightPremium.deepBlue,
      shadowOpacity: 0.14,
      shadowRadius: 28,
      shadowOffset: { width: 0, height: 12 },
      elevation: 10,
    },
  },
  darkGlass: {
    mode: 'darkGlass',
    themeMode: 'dark',
    isDark: true,
    palette: appearancePaletteByMode.darkGlass,
    appBackground: appearancePaletteByMode.darkGlass.navyNight,
    appBackgroundElevated: appearancePaletteByMode.darkGlass.navyNightElevated,
    surface: withAlpha(appearancePaletteByMode.darkGlass.navyEmphasis, 0.9),
    surfaceRaised: withAlpha(appearancePaletteByMode.darkGlass.navyEmphasis, 0.98),
    surfaceMuted: withAlpha(appearancePaletteByMode.darkGlass.white, 0.06),
    textPrimary: appearancePaletteByMode.darkGlass.offWhite,
    textSecondary: withAlpha(appearancePaletteByMode.darkGlass.offWhite, 0.82),
    textMuted: withAlpha(appearancePaletteByMode.darkGlass.offWhite, 0.56),
    border: withAlpha(appearancePaletteByMode.darkGlass.white, 0.12),
    borderStrong: withAlpha(appearancePaletteByMode.darkGlass.white, 0.22),
    accent: appearancePaletteByMode.darkGlass.orange,
    accentMuted: withAlpha(appearancePaletteByMode.darkGlass.orange, 0.22),
    success: '#4ADE80',
    warning: '#FBBF24',
    danger: '#F87171',
    glassSurface: withAlpha(appearancePaletteByMode.darkGlass.white, 0.08),
    glassSurfaceStrong: withAlpha(appearancePaletteByMode.darkGlass.white, 0.16),
    glassBorder: withAlpha(appearancePaletteByMode.darkGlass.white, 0.18),
    glassText: appearancePaletteByMode.darkGlass.white,
    glassMutedText: withAlpha(appearancePaletteByMode.darkGlass.white, 0.68),
    heroOverlay: withAlpha(appearancePaletteByMode.darkGlass.navyNight, 0.42),
    heroOverlayStrong: withAlpha(appearancePaletteByMode.darkGlass.navyNight, 0.64),
    chipBackground: withAlpha(appearancePaletteByMode.darkGlass.white, 0.06),
    chipSelectedBackground: withAlpha(appearancePaletteByMode.darkGlass.orange, 0.18),
    actionBackground: withAlpha(appearancePaletteByMode.darkGlass.white, 0.08),
    actionSelectedBackground: appearancePaletteByMode.darkGlass.orange,
    productCardBackground: withAlpha(appearancePaletteByMode.darkGlass.navyEmphasis, 0.88),
    promoCardBackground: withAlpha(appearancePaletteByMode.darkGlass.white, 0.1),
    shadowSoft: {
      shadowColor: '#000000',
      shadowOpacity: 0.18,
      shadowRadius: 20,
      shadowOffset: { width: 0, height: 8 },
      elevation: 6,
    },
    shadowPremium: {
      shadowColor: '#000000',
      shadowOpacity: 0.26,
      shadowRadius: 32,
      shadowOffset: { width: 0, height: 14 },
      elevation: 12,
    },
  },
} as const satisfies Record<BThwaniAppearanceMode, BThwaniAppearanceTokens>;

export const bthwaniAppearancePaletteByMode = Object.freeze(appearancePaletteByMode);
export const bthwaniAppearanceTokensByMode = Object.freeze(appearanceTokensByMode);

export function getBThwaniAppearanceTokens(mode: BThwaniAppearanceMode = defaultBThwaniAppearanceMode) {
  return bthwaniAppearanceTokensByMode[mode];
}

export function getBThwaniAppearanceThemeMode(mode: BThwaniAppearanceMode) {
  return getBThwaniAppearanceTokens(mode).themeMode;
}

export function resolveBThwaniAppearanceMode(themeMode: ThemeMode): BThwaniAppearanceMode {
  return themeMode === 'dark' || themeMode === 'high-contrast' ? 'darkGlass' : 'lightPremium';
}

export function getBThwaniGlassRecipe(mode: BThwaniAppearanceMode, role: BThwaniGlassRole): BThwaniGlassRecipe {
  const tokens = getBThwaniAppearanceTokens(mode);

  if (role === 'surfaceStrong') {
    return {
      backgroundColor: tokens.glassSurfaceStrong,
      borderColor: tokens.glassBorder,
      textColor: tokens.glassText,
      mutedTextColor: tokens.glassMutedText,
    };
  }

  if (role === 'heroOverlay') {
    return {
      backgroundColor: tokens.heroOverlayStrong,
      borderColor: tokens.glassBorder,
      textColor: tokens.glassText,
      mutedTextColor: tokens.glassMutedText,
    };
  }

  return {
    backgroundColor: tokens.glassSurface,
    borderColor: tokens.glassBorder,
    textColor: tokens.glassText,
    mutedTextColor: tokens.glassMutedText,
  };
}
