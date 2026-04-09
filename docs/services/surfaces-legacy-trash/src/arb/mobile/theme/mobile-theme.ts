/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */

// ARB Mobile Theme Configuration
// Mobile-specific theme for ARB surface
// Using semantic tokens from ui-kit (no raw hex colors per P1-2)

import { semanticRoles } from '@bthwani/ui-kit';

export const arbMobileTheme = {
  // ARB color scheme (using semantic tokens)
  colors: {
    primary: semanticRoles.accent,      // Orange (accent)
    primaryLight: semanticRoles.accentHover, // Light orange
    primaryDark: semanticRoles.accentStrong,  // Dark orange

    secondary: semanticRoles.primaryCTA,    // Navy (primary CTA)
    secondaryLight: semanticRoles.surfaceSubtle, // Light navy
    secondaryDark: semanticRoles.primaryCTA, // Dark navy (same as primary CTA)

    accent: semanticRoles.accent,       // Orange accent

    background: semanticRoles.bg,
    surface: semanticRoles.surface,
    surfaceSecondary: semanticRoles.surfaceSubtle,

    text: semanticRoles.text,
    textSecondary: semanticRoles.textMuted,
    textDisabled: semanticRoles.textDisabled,

    error: semanticRoles.stateError.icon,
    errorLight: semanticRoles.stateError.background,
    success: semanticRoles.stateInfo.icon,
    successLight: semanticRoles.stateInfo.background,
    warning: semanticRoles.stateWarning.icon,
    warningLight: semanticRoles.stateWarning.background,

    border: semanticRoles.border,
    borderLight: semanticRoles.border,
    divider: semanticRoles.divider,
  },

  // Mobile spacing system (4pt grid)
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
    xxxl: 64,
  },

  // Mobile typography
  typography: {
    fontFamily: {
      regular: 'System',
      medium: 'System',
      bold: 'System',
    },
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
      huge: 40,
    },
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
  },

  // Mobile component styles
  components: {
    // Button styles
    button: {
      height: 48,           // Minimum touch target
      borderRadius: 8,
      paddingHorizontal: 16,
      paddingVertical: 12,
    },

    // Input styles
    input: {
      height: 48,
      borderRadius: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      fontSize: 16,         // Prevent zoom on iOS
    },

    // Card styles
    card: {
      borderRadius: 12,
      padding: 16,
      marginVertical: 4,
      marginHorizontal: 8,
      shadowColor: semanticRoles.shadow,
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
    },

    // List item styles
    listItem: {
      height: 64,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
    },

    // Modal styles
    modal: {
      borderRadius: 16,
      margin: 20,
      maxHeight: '80%',
    },

    // Bottom sheet styles
    bottomSheet: {
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
    },

    // FAB styles
    fab: {
      width: 56,
      height: 56,
      borderRadius: 28,
      shadowColor: semanticRoles.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },

    // Tab bar styles
    tabBar: {
      height: 64,
      paddingTop: 8,
      paddingBottom: 8,
      borderTopWidth: 1,
    },
  },

  // ARB-specific animations
  animations: {
    duration: {
      fast: 150,
      normal: 300,
      slow: 500,
    },
    easing: {
      standard: 'ease-in-out',
      decelerate: 'ease-out',
      accelerate: 'ease-in',
    },
  },

  // Screen dimensions (will be set dynamically)
  screen: {
    width: 0,
    height: 0,
    isSmallScreen: false,
  },

} as const;
