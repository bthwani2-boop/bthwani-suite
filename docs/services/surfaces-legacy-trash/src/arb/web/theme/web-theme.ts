/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// ARB Web Theme Configuration
// Web-specific theme overrides for ARB surface
// Using semantic tokens from ui-kit (no raw hex colors per P1-2)

import type { BthwaniTheme } from '@bthwani/ui-kit';
import { semanticRoles } from '@bthwani/ui-kit';

export const arbWebTheme = {
  // ARB-specific web theme overrides (using semantic tokens)
  colors: {
    primary: semanticRoles.accent,      // Orange (accent)
    onPrimary: semanticRoles.textInverse,    // White text on orange
    primaryContainer: semanticRoles.accentHover, // Light orange background
    onPrimaryContainer: semanticRoles.accent, // Orange text on light orange

    secondary: semanticRoles.primaryCTA,    // Navy (primary CTA)
    onSecondary: semanticRoles.textInverse,  // White text on navy
    secondaryContainer: semanticRoles.surfaceSubtle, // Light navy background
    onSecondaryContainer: semanticRoles.primaryCTA, // Navy text on light navy

    tertiary: semanticRoles.accent,     // Orange as tertiary
    onTertiary: semanticRoles.textInverse,
    tertiaryContainer: semanticRoles.accentHover,
    onTertiaryContainer: semanticRoles.accent,

    error: semanticRoles.stateError.icon,
    onError: semanticRoles.textInverse,
    errorContainer: semanticRoles.stateError.background,
    onErrorContainer: semanticRoles.stateError.icon,

    background: semanticRoles.bg,
    onBackground: semanticRoles.text,
    surface: semanticRoles.surface,
    onSurface: semanticRoles.text,
    surfaceVariant: semanticRoles.surfaceSubtle,
    onSurfaceVariant: semanticRoles.textMuted,

    outline: semanticRoles.border,
    outlineVariant: semanticRoles.border,

    shadow: semanticRoles.shadow,
    scrim: semanticRoles.overlay,

    inverseSurface: semanticRoles.primaryCTA,
    inverseOnSurface: semanticRoles.textInverse,
    inversePrimary: semanticRoles.textInverse,

    surfaceDim: semanticRoles.surfaceSubtle,
    surfaceBright: semanticRoles.surface,
    surfaceContainerLowest: semanticRoles.surface,
    surfaceContainerLow: semanticRoles.surfaceSubtle,
    surfaceContainer: semanticRoles.surfaceSubtle,
    surfaceContainerHigh: semanticRoles.surfaceSubtle,
    surfaceContainerHighest: semanticRoles.surfaceSubtle,
  },

  // Web-specific spacing and layout
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  // Web-specific typography scales
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.8,
    },
  },

  // ARB-specific component overrides
  components: {
    button: {
      borderRadius: 8,
      minHeight: 44, // WCAG AA compliance
    },
    input: {
      borderRadius: 8,
      minHeight: 48,
    },
    card: {
      borderRadius: 12,
      shadowColor: semanticRoles.shadow,
      shadowOpacity: 0.1,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
  },
} as unknown as BthwaniTheme;
