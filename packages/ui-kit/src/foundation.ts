import { uiKitLocales } from './locales';

export const tokenSourceMetadata = {
	authorityPackage: '@bthwani/ui-kit',
	authorityFile: 'src/foundation.ts',
	format: 'bth-token-source.v1',
	version: '2026.04.23',
	stage: 'phase-c-hardening'
} as const;

export const rawColorPalettes = {
	neutral: {
		0: '#FFFFFF',
		50: '#F8FAFC',
		100: '#F1F5F9',
		200: '#E2E8F0',
		300: '#CBD5E1',
		400: '#94A3B8',
		500: '#64748B',
		600: '#475569',
		700: '#334155',
		800: '#1E293B',
		900: '#0F172A',
		950: '#020617'
	},
	brand: {
		50: '#FFF4ED',
		100: '#FFE6D9',
		500: '#FF500D',
		600: '#0A2F5C',
		700: '#07213F'
	},
	success: {
		50: '#ECFDF3',
		100: '#DCFCE7',
		600: '#16A34A',
		700: '#15803D'
	},
	warning: {
		50: '#FFFBEB',
		100: '#FEF3C7',
		600: '#D97706',
		700: '#B45309'
	},
	danger: {
		50: '#FEF2F2',
		100: '#FEE2E2',
		600: '#DC2626',
		700: '#B91C1C'
	},
	info: {
		50: '#EFF6FF',
		100: '#DBEAFE',
		600: '#2563EB',
		700: '#1D4ED8'
	}
} as const;

export const brandColorRoles = {
	brand: rawColorPalettes.brand[500],
	brandStrong: rawColorPalettes.brand[600],
	brandSurface: rawColorPalettes.brand[100],
	brandSoft: rawColorPalettes.brand[50]
} as const;

export const surfaceContainerRoles = {
	background: rawColorPalettes.neutral[50],
	backgroundAlt: rawColorPalettes.neutral[0],
	surface: rawColorPalettes.neutral[0],
	surfaceRaised: rawColorPalettes.neutral[0],
	surfaceInset: rawColorPalettes.neutral[100],
	line: rawColorPalettes.neutral[200],
	lineStrong: rawColorPalettes.neutral[300],
	disabledSurface: rawColorPalettes.neutral[100]
} as const;

export function withAlpha(hex: string, alpha: number) {
	const normalized = hex.replace('#', '');
	const offset = normalized.length === 3 ? 1 : 2;
	const values = normalized.length === 3
		? normalized.split('').map((value) => parseInt(`${value}${value}`, 16))
		: [0, 1, 2].map((index) => parseInt(normalized.slice(index * offset, index * offset + offset), 16));

	return `rgba(${values[0]}, ${values[1]}, ${values[2]}, ${alpha})`;
}

export const semanticColorRoles = {
	brand: brandColorRoles.brand,
	brandStrong: brandColorRoles.brandStrong,
	brandSoft: brandColorRoles.brandSoft,
	brandSurface: brandColorRoles.brandSurface,
	ink: rawColorPalettes.neutral[900],
	inkMuted: rawColorPalettes.neutral[600],
	inkSoft: rawColorPalettes.neutral[500],
	line: rawColorPalettes.neutral[200],
	lineStrong: rawColorPalettes.neutral[300],
	surface: rawColorPalettes.neutral[0],
	surfaceAlt: rawColorPalettes.neutral[50],
	surfaceInset: rawColorPalettes.neutral[100],
	surfaceRaised: rawColorPalettes.neutral[0],
	success: rawColorPalettes.success[600],
	successStrong: rawColorPalettes.success[700],
	successSoft: rawColorPalettes.success[50],
	warning: rawColorPalettes.warning[600],
	warningStrong: rawColorPalettes.warning[700],
	warningSoft: rawColorPalettes.warning[50],
	danger: rawColorPalettes.danger[600],
	dangerStrong: rawColorPalettes.danger[700],
	dangerSoft: rawColorPalettes.danger[50],
	info: rawColorPalettes.info[600],
	infoStrong: rawColorPalettes.info[700],
	infoSoft: rawColorPalettes.info[50],
	overlay: withAlpha(rawColorPalettes.neutral[950], 0.48),
	overlaySoft: withAlpha(rawColorPalettes.neutral[950], 0.24),
	focusRing: withAlpha(rawColorPalettes.brand[500], 0.32),
	disabledSurface: rawColorPalettes.neutral[100],
	disabledInk: rawColorPalettes.neutral[400],
	black: rawColorPalettes.neutral[950],
	white: rawColorPalettes.neutral[0]
} as const;

export const rawSpacingScale = {
	0: 0,
	1: 4,
	2: 8,
	3: 12,
	4: 16,
	5: 20,
	6: 24,
	8: 32,
	10: 40,
	12: 48,
	14: 56,
	16: 64
} as const;

export const rawRadiusScale = {
	none: 0,
	xs: 6,
	sm: 10,
	md: 14,
	lg: 18,
	xl: 24,
	pill: 999
} as const;

export const rawElevationScale = {
	flat: 0,
	raised: 1,
	overlay: 2,
	floating: 3
} as const;

export const shadowPresets = {
	flat: undefined,
	raised: {
		shadowColor: '#000000',
		shadowOpacity: 0.06,
		shadowRadius: 10,
		shadowOffset: { width: 0, height: 2 },
		elevation: 2
	},
	overlay: {
		shadowColor: '#000000',
		shadowOpacity: 0.08,
		shadowRadius: 18,
		shadowOffset: { width: 0, height: 6 },
		elevation: 6
	},
	floating: {
		shadowColor: '#000000',
		shadowOpacity: 0.12,
		shadowRadius: 28,
		shadowOffset: { width: 0, height: 10 },
		elevation: 10
	}
} as const;

export const shadowLaw = shadowPresets;

export const rawMotionScale = {
	instant: 0,
	quick: 120,
	standard: 180,
	calm: 240,
	emphasized: 320
} as const;

export const rawSizingScale = {
	controlSm: 36,
	controlMd: 44,
	controlLg: 52,
	iconSm: 16,
	iconMd: 20,
	iconLg: 24,
	avatarSm: 28,
	avatarMd: 40,
	avatarLg: 56
} as const;

export const rawBreakpointScale = {
	xs: 0,
	sm: 480,
	md: 768,
	lg: 1024,
	xl: 1280,
	wide: 1440
} as const;

export const rawSafeAreaScale = {
	none: 0,
	compact: 8,
	comfortable: 16,
	spacious: 24
} as const;

export const rawZIndexScale = {
	base: 0,
	dropdown: 100,
	sticky: 200,
	overlay: 300,
	modal: 400,
	toast: 500
} as const;

export const rawOpacityScale = {
	disabled: 0.48,
	pressed: 0.9,
	subtle: 0.72,
	overlay: 0.4
} as const;

export const rawBorderScale = {
	none: 0,
	hairline: 1,
	strong: 2
} as const;

export const rawTypographyScale = {
	fontFamilies: {
		arabic: 'System',
		latin: 'System',
		display: 'System',
		mono: 'monospace'
	},
	fontWeights: {
		regular: '400',
		medium: '500',
		semibold: '600',
		bold: '700',
		black: '800'
	},
	letterSpacings: {
		tighter: -0.8,
		tight: -0.4,
		normal: 0,
		wide: 0.2,
		wider: 0.4
	},
	textRoles: {
		displayXl: { fontSize: 40, lineHeight: 46, fontWeight: '800', letterSpacing: -0.8 },
		displayLg: { fontSize: 34, lineHeight: 40, fontWeight: '700', letterSpacing: -0.4 },
		hero: { fontSize: 30, lineHeight: 36, fontWeight: '700', letterSpacing: -0.4 },
		titleXl: { fontSize: 28, lineHeight: 34, fontWeight: '700', letterSpacing: -0.4 },
		titleLg: { fontSize: 24, lineHeight: 30, fontWeight: '700', letterSpacing: -0.4 },
		titleMd: { fontSize: 20, lineHeight: 27, fontWeight: '600', letterSpacing: 0 },
		titleSm: { fontSize: 18, lineHeight: 24, fontWeight: '600', letterSpacing: 0 },
		bodyLg: { fontSize: 17, lineHeight: 26, fontWeight: '400', letterSpacing: 0 },
		bodyMd: { fontSize: 15, lineHeight: 23, fontWeight: '400', letterSpacing: 0 },
		bodySm: { fontSize: 14, lineHeight: 20, fontWeight: '400', letterSpacing: 0 },
		bodyStrong: { fontSize: 15, lineHeight: 23, fontWeight: '600', letterSpacing: 0 },
		labelLg: { fontSize: 14, lineHeight: 18, fontWeight: '600', letterSpacing: 0.2 },
		label: { fontSize: 13, lineHeight: 17, fontWeight: '600', letterSpacing: 0.2 },
		caption: { fontSize: 12, lineHeight: 16, fontWeight: '500', letterSpacing: 0.2 },
		overline: { fontSize: 11, lineHeight: 15, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase' as const },
		code: { fontSize: 13, lineHeight: 18, fontWeight: '500', letterSpacing: 0 }
	}
} as const;

export const typographyRoles = rawTypographyScale.textRoles;

export type PaletteKey = keyof typeof colorPalette;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radius;
export type ElevationToken = keyof typeof elevation;
export type MotionToken = keyof typeof motion;
export type BreakpointToken = keyof typeof breakpoints;
export type SafeAreaToken = keyof typeof safeArea;
export type BorderToken = keyof typeof borders;
export type TextRole = keyof typeof textRoles;
export type FontFamilyToken = keyof typeof fontFamilies;
export type FontWeightToken = keyof typeof fontWeights;
export type Direction = 'rtl' | 'ltr';
export type Language = 'ar' | 'en' | string;
export type LogicalTextAlign = 'start' | 'center' | 'end';

export const neutralPalette = rawColorPalettes.neutral;
export const brandPalette = rawColorPalettes.brand;
export const successPalette = rawColorPalettes.success;
export const warningPalette = rawColorPalettes.warning;
export const dangerPalette = rawColorPalettes.danger;
export const infoPalette = rawColorPalettes.info;

export const colorPalette = semanticColorRoles;
export const spacing = rawSpacingScale;
export const radius = rawRadiusScale;
export const elevation = rawElevationScale;
export const shadowByElevation = shadowPresets;
export const motion = rawMotionScale;
export const sizes = rawSizingScale;
export const breakpoints = rawBreakpointScale;
export const safeArea = rawSafeAreaScale;
export const zIndex = rawZIndexScale;
export const opacities = rawOpacityScale;
export const borders = rawBorderScale;
export const fontFamilies = rawTypographyScale.fontFamilies;
export const fontWeights = rawTypographyScale.fontWeights;
export const letterSpacings = rawTypographyScale.letterSpacings;
export const textRoles = rawTypographyScale.textRoles;

export function resolveFontFamily(direction: Direction, family: FontFamilyToken = 'latin') {
	if (family === 'mono') {
		return fontFamilies.mono;
	}

	if (family === 'display') {
		return fontFamilies.display;
	}

	return direction === 'rtl' ? fontFamilies.arabic : fontFamilies.latin;
}

export function resolveTextRole(role: TextRole) {
	return textRoles[role];
}

export const directionConfig = {
	defaultDirection: 'rtl' as Direction,
	defaultLanguage: 'ar',
	languageStorageKey: 'bth-language',
	supportedDirections: ['rtl', 'ltr'] as const,
	rtlLanguages: ['ar', 'fa', 'he', 'ur'] as const,
	useLogicalStartEnd: true,
	mirroredDirectionalIcons: true
};

export function isRtl(direction: Direction) {
	return direction === 'rtl';
}

export function isRtlLanguage(language?: Language) {
	if (!language) {
		return directionConfig.defaultDirection === 'rtl';
	}

	const normalized = language.toLowerCase();
	return directionConfig.rtlLanguages.some((candidate) => normalized === candidate || normalized.startsWith(`${candidate}-`));
}

export function resolveDirectionFromLanguage(language?: Language, fallback: Direction = directionConfig.defaultDirection) {
	if (!language) {
		return fallback;
	}

	return isRtlLanguage(language) ? 'rtl' : 'ltr';
}

export function resolveLogicalInsets(direction: Direction, start: number, end: number, property: 'padding' | 'margin' = 'padding') {
	if (property === 'margin') {
		return isRtl(direction)
			? { marginRight: start, marginLeft: end }
			: { marginLeft: start, marginRight: end };
	}

	return isRtl(direction)
		? { paddingRight: start, paddingLeft: end }
		: { paddingLeft: start, paddingRight: end };
}

export function resolveLogicalPadding(direction: Direction, start: number, end: number) {
	return resolveLogicalInsets(direction, start, end, 'padding');
}

export function resolveLogicalMargin(direction: Direction, start: number, end: number) {
	return resolveLogicalInsets(direction, start, end, 'margin');
}

export function resolveLogicalBorderRadius(direction: Direction, start: number, end: number) {
	return isRtl(direction)
		? {
				borderTopRightRadius: start,
				borderBottomRightRadius: start,
				borderTopLeftRadius: end,
				borderBottomLeftRadius: end
			}
		: {
				borderTopLeftRadius: start,
				borderBottomLeftRadius: start,
				borderTopRightRadius: end,
				borderBottomRightRadius: end
			};
}

export function resolveTextAlign(direction: Direction, align: LogicalTextAlign = 'start') {
	if (align === 'center') return 'center';
	if (align === 'start') return isRtl(direction) ? 'right' : 'left';
	return isRtl(direction) ? 'left' : 'right';
}

export function resolveRowDirection(direction: Direction, reversed = false) {
	const baseDirection = isRtl(direction) ? 'row-reverse' : 'row';

	if (!reversed) {
		return baseDirection;
	}

	return baseDirection === 'row' ? 'row-reverse' : 'row';
}

export type CssVariableMap = Record<string, string>;

function toKebabCase(value: string) {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[_\s]+/g, '-')
		.toLowerCase();
}

function toPixel(value: number) {
	return value === 0 ? '0' : `${value}px`;
}

function toMilliseconds(value: number) {
	return value === 0 ? '0ms' : `${value}ms`;
}

function appendVariables(target: CssVariableMap, entries: Record<string, string>) {
	for (const [name, value] of Object.entries(entries)) {
		target[name] = value;
	}
}

function createPaletteCssVariables() {
	const variables: CssVariableMap = {};

	for (const [paletteName, paletteValues] of Object.entries(rawColorPalettes)) {
		for (const [tokenName, tokenValue] of Object.entries(paletteValues)) {
			variables[`--bth-palette-${toKebabCase(paletteName)}-${tokenName}`] = tokenValue;
		}
	}

	for (const [semanticRole, tokenValue] of Object.entries(semanticColorRoles)) {
		variables[`--bth-color-${toKebabCase(semanticRole)}`] = tokenValue;
	}

	return variables;
}

function createScaleCssVariables(prefix: string, values: Record<string, number>, formatter: (value: number) => string) {
	const variables: CssVariableMap = {};

	for (const [tokenName, tokenValue] of Object.entries(values)) {
		variables[`--bth-${prefix}-${toKebabCase(tokenName)}`] = formatter(tokenValue);
	}

	return variables;
}

function createTypographyCssVariables() {
	const variables: CssVariableMap = {};

	for (const [familyName, familyValue] of Object.entries(rawTypographyScale.fontFamilies)) {
		variables[`--bth-font-family-${toKebabCase(familyName)}`] = familyValue;
	}

	for (const [weightName, weightValue] of Object.entries(rawTypographyScale.fontWeights)) {
		variables[`--bth-font-weight-${toKebabCase(weightName)}`] = weightValue;
	}

	for (const [spacingName, spacingValue] of Object.entries(rawTypographyScale.letterSpacings)) {
		variables[`--bth-letter-spacing-${toKebabCase(spacingName)}`] = `${spacingValue}px`;
	}

	for (const [roleName, roleValues] of Object.entries(rawTypographyScale.textRoles)) {
		for (const [propertyName, propertyValue] of Object.entries(roleValues)) {
			const variableName = `--bth-text-role-${toKebabCase(roleName)}-${toKebabCase(propertyName)}`;

			if (typeof propertyValue === 'number') {
				variables[variableName] = `${propertyValue}px`;
			} else {
				variables[variableName] = String(propertyValue);
			}
		}
	}

	return variables;
}

export function createTokenCssVariables() {
	const variables: CssVariableMap = {};

	appendVariables(variables, createPaletteCssVariables());
	appendVariables(variables, createScaleCssVariables('spacing', rawSpacingScale, toPixel));
	appendVariables(variables, createScaleCssVariables('radius', rawRadiusScale, toPixel));
	appendVariables(variables, createScaleCssVariables('size', rawSizingScale, toPixel));
	appendVariables(variables, createScaleCssVariables('breakpoint', rawBreakpointScale, toPixel));
	appendVariables(variables, createScaleCssVariables('safe-area', rawSafeAreaScale, toPixel));
	appendVariables(variables, createScaleCssVariables('motion', rawMotionScale, toMilliseconds));
	appendVariables(variables, createScaleCssVariables('border', rawBorderScale, toPixel));
	appendVariables(variables, createScaleCssVariables('z-index', rawZIndexScale, String));
	appendVariables(variables, createScaleCssVariables('opacity', rawOpacityScale, String));
	appendVariables(variables, createScaleCssVariables('elevation', rawElevationScale, String));
	appendVariables(variables, createTypographyCssVariables());

	return variables;
}

export function createTokenCssDeclarations() {
	return Object.entries(createTokenCssVariables())
		.map(([variableName, variableValue]) => `  ${variableName}: ${variableValue};`)
		.join('\n');
}

export function createTokenCssBlock(selector = ':root') {
	return `${selector} {\n${createTokenCssDeclarations()}\n}`;
}

export function createNativeTokenOutput() {
	return {
		metadata: tokenSourceMetadata,
		colors: {
			raw: rawColorPalettes,
			semantic: semanticColorRoles
		},
		spacing: rawSpacingScale,
		radius: rawRadiusScale,
		elevation: rawElevationScale,
		motion: rawMotionScale,
		sizing: rawSizingScale,
		breakpoints: rawBreakpointScale,
		safeArea: rawSafeAreaScale,
		borders: rawBorderScale,
		zIndex: rawZIndexScale,
		opacity: rawOpacityScale,
		typography: rawTypographyScale
	};
}

export const tokenCssVariables = createTokenCssVariables();
export const nativeTokenOutput = createNativeTokenOutput();

export type ThemeMode = 'light' | 'dark' | 'high-contrast';

export type SemanticTheme = {
	mode: ThemeMode;
	background: string;
	backgroundAlt: string;
	surface: string;
	surfaceRaised: string;
	surfaceInset: string;
	line: string;
	lineStrong: string;
	text: string;
	textMuted: string;
	textSoft: string;
	textInverse: string;
	brand: string;
	brandContrast: string;
	brandSurface: string;
	success: string;
	successSurface: string;
	successText: string;
	warning: string;
	warningSurface: string;
	warningText: string;
	danger: string;
	dangerSurface: string;
	dangerText: string;
	info: string;
	infoSurface: string;
	infoText: string;
	focusRing: string;
	overlay: string;
	overlaySoft: string;
	disabledSurface: string;
	disabledText: string;
	fieldBackground: string;
	fieldBorder: string;
	fieldBorderActive: string;
	fieldPlaceholder: string;
};

export const lightTheme: SemanticTheme = {
	mode: 'light',
	background: surfaceContainerRoles.background,
	backgroundAlt: surfaceContainerRoles.backgroundAlt,
	surface: surfaceContainerRoles.surface,
	surfaceRaised: surfaceContainerRoles.surfaceRaised,
	surfaceInset: surfaceContainerRoles.surfaceInset,
	line: surfaceContainerRoles.line,
	lineStrong: surfaceContainerRoles.lineStrong,
	text: colorPalette.ink,
	textMuted: colorPalette.inkMuted,
	textSoft: colorPalette.inkSoft,
	textInverse: colorPalette.white,
	brand: brandColorRoles.brand,
	brandContrast: colorPalette.white,
	brandSurface: brandColorRoles.brandSurface,
	success: colorPalette.success,
	successSurface: colorPalette.successSoft,
	successText: colorPalette.successStrong,
	warning: colorPalette.warning,
	warningSurface: colorPalette.warningSoft,
	warningText: colorPalette.warningStrong,
	danger: colorPalette.danger,
	dangerSurface: colorPalette.dangerSoft,
	dangerText: colorPalette.dangerStrong,
	info: colorPalette.info,
	infoSurface: colorPalette.infoSoft,
	infoText: colorPalette.infoStrong,
	focusRing: colorPalette.focusRing,
	overlay: colorPalette.overlay,
	overlaySoft: colorPalette.overlaySoft,
	disabledSurface: surfaceContainerRoles.disabledSurface,
	disabledText: colorPalette.disabledInk,
	fieldBackground: surfaceContainerRoles.surface,
	fieldBorder: surfaceContainerRoles.line,
	fieldBorderActive: brandColorRoles.brand,
	fieldPlaceholder: colorPalette.inkSoft
};

export const darkTheme: SemanticTheme = {
	mode: 'dark',
	background: '#020617',
	backgroundAlt: '#0F172A',
	surface: '#111827',
	surfaceRaised: '#182232',
	surfaceInset: '#0B1324',
	line: '#22304A',
	lineStrong: '#334155',
	text: '#F8FAFC',
	textMuted: '#CBD5E1',
	textSoft: '#94A3B8',
	textInverse: colorPalette.ink,
	brand: '#FF500D',
	brandContrast: '#FFFFFF',
	brandSurface: withAlpha('#FF500D', 0.16),
	success: '#4ADE80',
	successSurface: withAlpha('#4ADE80', 0.16),
	successText: '#BBF7D0',
	warning: '#FBBF24',
	warningSurface: withAlpha('#FBBF24', 0.16),
	warningText: '#FDE68A',
	danger: '#F87171',
	dangerSurface: withAlpha('#F87171', 0.16),
	dangerText: '#FECACA',
	info: '#60A5FA',
	infoSurface: withAlpha('#60A5FA', 0.16),
	infoText: '#BFDBFE',
	focusRing: withAlpha('#FF500D', 0.4),
	overlay: withAlpha('#020617', 0.72),
	overlaySoft: withAlpha('#020617', 0.36),
	disabledSurface: '#1E293B',
	disabledText: '#64748B',
	fieldBackground: '#0F172A',
	fieldBorder: '#334155',
	fieldBorderActive: '#FF500D',
	fieldPlaceholder: '#64748B'
};

export const highContrastTheme: SemanticTheme = {
	mode: 'high-contrast',
	background: '#000000',
	backgroundAlt: '#000000',
	surface: '#000000',
	surfaceRaised: '#0A0A0A',
	surfaceInset: '#000000',
	line: '#FFFFFF',
	lineStrong: '#FFFFFF',
	text: '#FFFFFF',
	textMuted: '#FFFFFF',
	textSoft: '#E5E7EB',
	textInverse: '#000000',
	brand: '#FFD60A',
	brandContrast: '#000000',
	brandSurface: '#FFD60A',
	success: '#7CFC00',
	successSurface: '#0F2F00',
	successText: '#FFFFFF',
	warning: '#FFD60A',
	warningSurface: '#3D2F00',
	warningText: '#FFFFFF',
	danger: '#FF453A',
	dangerSurface: '#3B0600',
	dangerText: '#FFFFFF',
	info: '#59C3FF',
	infoSurface: '#002A3D',
	infoText: '#FFFFFF',
	focusRing: '#FFFFFF',
	overlay: withAlpha('#000000', 0.88),
	overlaySoft: withAlpha('#000000', 0.72),
	disabledSurface: '#1A1A1A',
	disabledText: '#B3B3B3',
	fieldBackground: '#000000',
	fieldBorder: '#FFFFFF',
	fieldBorderActive: '#FFD60A',
	fieldPlaceholder: '#D1D5DB'
};

export const semanticThemeByMode: Record<ThemeMode, SemanticTheme> = {
	light: lightTheme,
	dark: darkTheme,
	'high-contrast': highContrastTheme
};

export const themeByMode = semanticThemeByMode;

export function resolveSemanticTheme(mode: ThemeMode) {
	return semanticThemeByMode[mode];
}

export type ThemeCssVariableMap = Record<string, string>;

function toThemeKebabCase(value: string) {
	return value
		.replace(/([a-z0-9])([A-Z])/g, '$1-$2')
		.replace(/[_\s]+/g, '-')
		.toLowerCase();
}

function resolveColorScheme(mode: ThemeMode) {
	return mode === 'dark' || mode === 'high-contrast' ? 'dark' : 'light';
}

export function createThemeCssVariables(theme: SemanticTheme) {
	const variables: ThemeCssVariableMap = {};

	for (const [themeKey, themeValue] of Object.entries(theme)) {
		if (themeKey === 'mode') {
			continue;
		}

		variables[`--bth-${toThemeKebabCase(themeKey)}`] = themeValue;
	}

	variables['--bth-color-scheme'] = resolveColorScheme(theme.mode);

	return variables;
}

export function createThemeCssDeclarations(theme: SemanticTheme) {
	return Object.entries(createThemeCssVariables(theme))
		.map(([variableName, variableValue]) => `  ${variableName}: ${variableValue};`)
		.concat(`  color-scheme: ${resolveColorScheme(theme.mode)};`)
		.join('\n');
}

export function createThemeCssBlock(theme: SemanticTheme, selector: string) {
	return `${selector} {\n${createThemeCssDeclarations(theme)}\n}`;
}

export function buildWebThemeStyleSheet(rootSelector = '[data-bth-root="true"]') {
	return [
		createTokenCssBlock(rootSelector),
		createThemeCssBlock(lightTheme, `${rootSelector}, ${rootSelector}[data-bth-theme='light']`),
		createThemeCssBlock(darkTheme, `${rootSelector}[data-bth-theme='dark']`),
		createThemeCssBlock(highContrastTheme, `${rootSelector}[data-bth-theme='high-contrast']`)
	].join('\n\n');
}

export function createNativeThemeOutput(mode: ThemeMode) {
	return {
		mode,
		theme: resolveSemanticTheme(mode),
		tokens: createNativeTokenOutput()
	};
}

export const themeModes = Object.freeze(Object.keys(semanticThemeByMode) as ThemeMode[]);

export const nativeThemeOutputs = Object.freeze(
	Object.fromEntries(themeModes.map((mode) => [mode, createNativeThemeOutput(mode)])) as Record<ThemeMode, ReturnType<typeof createNativeThemeOutput>>
);

type TamaguiThemeBridge = Record<ThemeMode, Omit<SemanticTheme, 'mode'>>;

function stripThemeMode(theme: SemanticTheme): Omit<SemanticTheme, 'mode'> {
	const { mode, ...themeTokens } = theme;
	return themeTokens;
}

export type TamaguiBridge = {
	themes: TamaguiThemeBridge;
	tokens: ReturnType<typeof createNativeTokenOutput>;
	defaultTheme: 'light';
	defaultThemeByMode: Record<ThemeMode, 'light' | 'dark'>;
	logicalDirection: typeof directionConfig;
};

export function createTamaguiBridge(): TamaguiBridge {
	return {
		themes: {
			light: stripThemeMode(lightTheme),
			dark: stripThemeMode(darkTheme),
			'high-contrast': stripThemeMode(highContrastTheme)
		},
		tokens: nativeTokenOutput,
		defaultTheme: 'light',
		defaultThemeByMode: {
			light: 'light',
			dark: 'dark',
			'high-contrast': 'dark'
		},
		logicalDirection: directionConfig
	};
}

export const tamaguiBridge = createTamaguiBridge();

export type Locale = 'ar' | 'en';

export type UiTextCatalogStringLeafShape<T> = {
	readonly [K in keyof T]: T[K] extends string
		? string
		: UiTextCatalogStringLeafShape<T[K]>;
};

export type UiTextCatalogShape = UiTextCatalogStringLeafShape<typeof uiKitLocales.ar.common>;

export const uiTextCatalog = {
	ar: uiKitLocales.ar.common,
	en: uiKitLocales.en.common,
} as const satisfies Record<Locale, UiTextCatalogShape>;

export function getUiText(locale: Locale = 'ar') {
	return uiTextCatalog[locale];
}

export function amountToArabicText(n: number, t: (key: string) => string): string {
	if (n <= 0) return t('surfaces.صفر');
	const ones = ['', 'واحد', 'اثنان', 'ثلاثة', 'أربعة', 'خمسة', 'ستة', 'سبعة', 'ثمانية', 'تسعة'];
	const tens = ['', 'عشرة', 'عشرون', 'ثلاثون', 'أربعون', 'خمسون', 'ستون', 'سبعون', 'ثمانون', 'تسعون'];
	const hundreds = ['', 'مائة', 'مئتان', 'ثلاثمائة', 'أربعمائة', 'خمسمائة', 'ستمائة', 'سبعمائة', 'ثمانمائة', 'تسعمائة'];
	const andStr = t('surfaces.and') || ' و ';
	const hundredStr = t('surfaces.hundred') || ' مائة ';

	function inner(x: number): string {
		if (x >= 1000) {
			const k = Math.floor(x / 1000);
			const rest = x % 1000;
			const kStr = k <= 19 ? (k === 10 ? 'عشرة' : k === 11 ? 'أحد عشر' : k < 10 ? ones[k] : ones[k % 10] + ' عشر') : k < 100 ? (tens[Math.floor(k / 10)] + (k % 10 ? andStr + ones[k % 10] : '')) : hundreds[Math.floor(k / 100)] + (k % 100 ? andStr + inner(k % 100) : '');
			const thousandWord = k === 2 ? t('surfaces.ألفان') : k >= 3 && k <= 10 ? ones[k] + ' آلاف' : kStr + ' ألف';
			return rest > 0 ? thousandWord + andStr + inner(rest) : thousandWord;
		}
		if (x >= 100) {
			const h = Math.floor(x / 100);
			const r = x % 100;
			return (hundreds[h] || inner(h) + hundredStr) + (r > 0 ? andStr + inner(r) : '');
		}
		if (x >= 20) return (x % 10 ? ones[x % 10] + andStr : '') + tens[Math.floor(x / 10)];
		if (x >= 10) return x === 10 ? t('surfaces.عشرة') : ones[x % 10] + ' عشر';
		return ones[x] || String(x);
	}

	return inner(n);
}

