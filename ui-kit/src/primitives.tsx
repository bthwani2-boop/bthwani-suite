import React from 'react';
import {
  ScrollView as TamaguiScrollView,
  Text as TamaguiText,
  View as TamaguiView,
  } from 'tamagui';
import {
	StyleSheet,
  type ScrollViewProps,
  type StyleProp,
  type TextProps as RNTextNativeProps,
  type TextStyle,
  type ViewProps,
  type ViewStyle,
} from 'react-native';
import { useDirection, useTheme } from './providers';
import {
	borders,
	fontWeights,
	radius,
	resolveFontFamily,
	resolveLogicalPadding,
	resolveRowDirection,
	resolveTextAlign,
	resolveTextRole,
	shadowLaw,
	spacing,
	type BorderToken,
	type ElevationToken,
	type FontFamilyToken,
	type FontWeightToken,
	type RadiusToken,
	type SpacingToken,
	type TextRole,
} from './foundation';


const HostView = TamaguiView as unknown as React.ComponentType<ViewProps>;
const HostText = TamaguiText as unknown as React.ComponentType<RNTextNativeProps>;
const HostScrollView = TamaguiScrollView as unknown as React.ComponentType<ScrollViewProps>;
export type BoxBackground =
	| 'surface'
	| 'surfaceRaised'
	| 'surfaceInset'
	| 'background'
	| 'backgroundAlt'
	| 'brand'
	| 'brandSurface'
	| 'brandHeaderBackground'
	| 'successSurface'
	| 'warningSurface'
	| 'dangerSurface'
	| 'infoSurface'
	| 'overlaySoft'
	| 'disabledSurface';

	export type BoxBorderTone = 'line' | 'lineStrong' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type BoxProps = {
	children?: React.ReactNode;
	padding?: SpacingToken;
	paddingX?: SpacingToken;
	paddingY?: SpacingToken;
	paddingStart?: SpacingToken;
	paddingEnd?: SpacingToken;
	gap?: SpacingToken;
	radiusToken?: RadiusToken;
	background?: BoxBackground;
	elevationToken?: ElevationToken;
	border?: boolean;
	borderToken?: BorderToken;
	borderTone?: BoxBorderTone;
	align?: ViewStyle['alignItems'];
	justify?: ViewStyle['justifyContent'];
	layoutDirection?: 'column' | 'row';
	reversed?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function Box({
	children,
	padding = 0,
	paddingX,
	paddingY,
	paddingStart,
	paddingEnd,
	gap = 0,
	radiusToken = 'none',
	background,
	elevationToken = 'flat',
	border = false,
	borderToken = 'hairline',
	borderTone = 'line',
	align,
	justify,
	layoutDirection = 'column',
	reversed = false,
	style
}: BoxProps) {
	const { direction } = useDirection();
	const { theme } = useTheme();
	const backgroundColor = background ? theme[background] : undefined;
	const resolvedPaddingX = paddingX ?? padding;
	const resolvedPaddingY = paddingY ?? padding;
	const resolvedPaddingStart = paddingStart ?? resolvedPaddingX;
	const resolvedPaddingEnd = paddingEnd ?? resolvedPaddingX;
	const borderColor = {
		line: theme.line,
		lineStrong: theme.lineStrong,
		brand: theme.brand,
		success: theme.success,
		warning: theme.warning,
		danger: theme.danger,
		info: theme.info
	}[borderTone];

	return (
		<HostView
			style={StyleSheet.flatten([
				{
					paddingTop: spacing[resolvedPaddingY],
					paddingBottom: spacing[resolvedPaddingY],
					...resolveLogicalPadding(direction, spacing[resolvedPaddingStart], spacing[resolvedPaddingEnd]),
					gap: spacing[gap],
					borderRadius: radius[radiusToken],
					backgroundColor,
					borderWidth: border ? borders[borderToken] : 0,
					borderColor: border ? borderColor : undefined,
					alignItems: align,
					justifyContent: justify,
					flexDirection: layoutDirection === 'row' ? resolveRowDirection(direction, reversed) : 'column'
				},
				shadowLaw[elevationToken],
				style
			])}
		>
			{children}
		</HostView>
	);
}

export type DividerProps = {
	color?: string;
	style?: StyleProp<ViewStyle>;
};

export function Divider({ color, style }: DividerProps) {
	const { theme } = useTheme();
	return <HostView style={StyleSheet.flatten([{ height: 1, backgroundColor: color ?? theme.line, width: '100%' }, style])} />;
}

declare const process: { env: { NODE_ENV?: string } };

type SurfaceVariant = 'default' | 'raised' | 'inset' | 'brandHeader' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const surfaceToneLaw: Record<SurfaceVariant, { background: BoxBackground; borderTone: BoxBorderTone; elevationToken: ElevationToken }> = {
	default: { background: 'surface', borderTone: 'line', elevationToken: 'flat' },
	raised: { background: 'surfaceRaised', borderTone: 'lineStrong', elevationToken: 'raised' },
	inset: { background: 'surfaceInset', borderTone: 'line', elevationToken: 'flat' },
	brandHeader: { background: 'brandHeaderBackground', borderTone: 'brand', elevationToken: 'flat' },
	brand: { background: 'brandSurface', borderTone: 'brand', elevationToken: 'flat' },
	success: { background: 'successSurface', borderTone: 'success', elevationToken: 'flat' },
	warning: { background: 'warningSurface', borderTone: 'warning', elevationToken: 'flat' },
	danger: { background: 'dangerSurface', borderTone: 'danger', elevationToken: 'flat' },
	info: { background: 'infoSurface', borderTone: 'info', elevationToken: 'flat' }
} as const;

export type SurfaceTone = SurfaceVariant;

export type SurfaceProps = {
	children?: React.ReactNode;
	padding?: SpacingToken;
	paddingX?: SpacingToken;
	paddingY?: SpacingToken;
	gap?: SpacingToken;
	radiusToken?: RadiusToken;
	elevationToken?: ElevationToken;
	tone?: SurfaceVariant;
	border?: boolean;
	borderToken?: BorderToken;
	borderTone?: 'line' | 'lineStrong' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
	align?: ViewStyle['alignItems'];
	layoutDirection?: 'column' | 'row';
	style?: StyleProp<ViewStyle>;
};

export function Surface({
	children,
	padding = 5,
	paddingX,
	paddingY,
	gap = 3,
	radiusToken = 'xl',
	elevationToken,
	tone = 'default',
	border = true,
	borderToken = 'hairline',
	borderTone,
	align,
	layoutDirection,
	style
}: SurfaceProps) {
	const toneConfig = surfaceToneLaw[tone];
	if ((process.env.NODE_ENV ?? '') !== 'production' && !(tone in surfaceToneLaw)) {
		// eslint-disable-next-line no-console
		console.warn(`Surface: unknown tone "${String(tone)}" — falling back to 'default'`);
	}

	return (
		<Box
			padding={padding}
			paddingX={paddingX}
			paddingY={paddingY}
			gap={gap}
			radiusToken={radiusToken}
			elevationToken={elevationToken ?? toneConfig.elevationToken}
			background={toneConfig.background}
			border={border}
			borderToken={borderToken}
			borderTone={borderTone ?? toneConfig.borderTone}
			align={align}
			layoutDirection={layoutDirection}
			style={style}
		>
			{children}
		</Box>
	);
}

export type TextProps = {
	children: React.ReactNode;
	role?: TextRole;
	tone?: 'default' | 'muted' | 'soft' | 'inverse' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
	align?: 'start' | 'center' | 'end';
	family?: FontFamilyToken;
	weight?: FontWeightToken;
	allowFontScaling?: boolean;
	numberOfLines?: number;
	style?: StyleProp<TextStyle>;
};

export function Text({
	children,
	role = 'bodyMd',
	tone = 'default',
	align = 'start',
	family,
	weight,
	allowFontScaling = true,
	numberOfLines,
	style
}: TextProps) {
	const { direction } = useDirection();
	const { theme } = useTheme();
	const roleStyle = resolveTextRole(role);
	const resolvedFamily = family ?? (role === 'code' ? 'mono' : role.startsWith('display') || role === 'hero' ? 'display' : 'latin');
	const toneColor = {
		default: theme.text,
		muted: theme.textMuted,
		soft: theme.textSoft,
		inverse: theme.textInverse,
		brand: theme.brand,
		success: theme.success,
		warning: theme.warning,
		danger: theme.danger,
		info: theme.info
	}[tone];

	return (
		<HostText
			allowFontScaling={allowFontScaling}
			numberOfLines={numberOfLines}
			style={StyleSheet.flatten([
				{
					...roleStyle,
					fontWeight: weight ? fontWeights[weight] : roleStyle?.fontWeight,
					color: toneColor,
					textAlign: resolveTextAlign(direction, align),
					writingDirection: direction,
					fontFamily: resolveFontFamily(direction, resolvedFamily)
				},
				style
			])}
		>
			{children}
		</HostText>
	);
}

export type MobileScrollViewProps = Omit<ScrollViewProps, 'style' | 'contentContainerStyle'> & {
	children?: React.ReactNode;
	fill?: boolean;
	padding?: SpacingToken;
	gap?: SpacingToken;
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
};

export function MobileScrollView({
	children,
	fill = false,
	padding = 0,
	gap = 0,
	style,
	contentContainerStyle,
	...scrollProps
}: MobileScrollViewProps) {
	return (
		<HostScrollView
			{...scrollProps}
			style={StyleSheet.flatten([fill ? { flex: 1 } : undefined, style])}
			contentContainerStyle={StyleSheet.flatten([
				fill ? { flexGrow: 1 } : undefined,
				{ padding: spacing[padding], gap: spacing[gap] },
				contentContainerStyle,
			])}
		>
			{children}
		</HostScrollView>
	);
}
