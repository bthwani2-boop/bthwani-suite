import React from 'react';
import { ScrollView, Text, View, type ScrollViewProps, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
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

export type BthBoxBackground =
	| 'surface'
	| 'surfaceRaised'
	| 'surfaceInset'
	| 'background'
	| 'backgroundAlt'
	| 'brand'
	| 'brandSurface'
	| 'successSurface'
	| 'warningSurface'
	| 'dangerSurface'
	| 'infoSurface'
	| 'overlaySoft'
	| 'disabledSurface';

export type BthBoxBorderTone = 'line' | 'lineStrong' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

export type BthBoxProps = {
	children?: React.ReactNode;
	padding?: SpacingToken;
	paddingX?: SpacingToken;
	paddingY?: SpacingToken;
	paddingStart?: SpacingToken;
	paddingEnd?: SpacingToken;
	gap?: SpacingToken;
	radiusToken?: RadiusToken;
	background?: BthBoxBackground;
	elevationToken?: ElevationToken;
	border?: boolean;
	borderToken?: BorderToken;
	borderTone?: BthBoxBorderTone;
	align?: ViewStyle['alignItems'];
	justify?: ViewStyle['justifyContent'];
	layoutDirection?: 'column' | 'row';
	reversed?: boolean;
	style?: StyleProp<ViewStyle>;
};

export function BthBox({
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
}: BthBoxProps) {
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
		<View
			style={[
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
			]}
		>
			{children}
		</View>
	);
}

export type BthDividerProps = {
	color?: string;
	style?: StyleProp<ViewStyle>;
};

export function BthDivider({ color, style }: BthDividerProps) {
	const { theme } = useTheme();
	return <View style={[{ height: 1, backgroundColor: color ?? theme.line, width: '100%' }, style]} />;
}

declare const process: { env: { NODE_ENV?: string } };

export type BthSurfaceTone = 'default' | 'raised' | 'inset' | 'brand' | 'success' | 'warning' | 'danger' | 'info';

const surfaceToneLaw: Record<BthSurfaceTone, { background: BthBoxBackground; borderTone: BthBoxBorderTone; elevationToken: ElevationToken }> = {
	default: { background: 'surface', borderTone: 'line', elevationToken: 'flat' },
	raised: { background: 'surfaceRaised', borderTone: 'lineStrong', elevationToken: 'raised' },
	inset: { background: 'surfaceInset', borderTone: 'line', elevationToken: 'flat' },
	brand: { background: 'brandSurface', borderTone: 'brand', elevationToken: 'flat' },
	success: { background: 'successSurface', borderTone: 'success', elevationToken: 'flat' },
	warning: { background: 'warningSurface', borderTone: 'warning', elevationToken: 'flat' },
	danger: { background: 'dangerSurface', borderTone: 'danger', elevationToken: 'flat' },
	info: { background: 'infoSurface', borderTone: 'info', elevationToken: 'flat' }
};

export type BthSurfaceProps = {
	children?: React.ReactNode;
	padding?: SpacingToken;
	gap?: SpacingToken;
	radiusToken?: RadiusToken;
	elevationToken?: ElevationToken;
	tone?: BthSurfaceTone;
	border?: boolean;
	borderToken?: BorderToken;
	borderTone?: 'line' | 'lineStrong' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
	style?: StyleProp<ViewStyle>;
};

export function BthSurface({
	children,
	padding = 5,
	gap = 3,
	radiusToken = 'xl',
	elevationToken,
	tone = 'default',
	border = true,
	borderToken = 'hairline',
	borderTone,
	style
}: BthSurfaceProps) {
	const toneConfig = surfaceToneLaw[tone];
	if ((process.env.NODE_ENV ?? '') !== 'production' && !(tone in surfaceToneLaw)) {
		// eslint-disable-next-line no-console
		console.warn(`BthSurface: unknown tone "${String(tone)}" — falling back to 'default'`);
	}

	return (
		<BthBox
			padding={padding}
			gap={gap}
			radiusToken={radiusToken}
			elevationToken={elevationToken ?? toneConfig.elevationToken}
			background={toneConfig.background}
			border={border}
			borderToken={borderToken}
			borderTone={borderTone ?? toneConfig.borderTone}
			style={style}
		>
			{children}
		</BthBox>
	);
}

export type BthTextProps = {
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

export function BthText({
	children,
	role = 'bodyMd',
	tone = 'default',
	align = 'start',
	family,
	weight,
	allowFontScaling = true,
	numberOfLines,
	style
}: BthTextProps) {
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
		<Text
			allowFontScaling={allowFontScaling}
			numberOfLines={numberOfLines}
			style={[
				{
					...roleStyle,
					fontWeight: weight ? fontWeights[weight] : roleStyle.fontWeight,
					color: toneColor,
					textAlign: resolveTextAlign(direction, align),
					writingDirection: direction,
					fontFamily: resolveFontFamily(direction, resolvedFamily)
				},
				style
			]}
		>
			{children}
		</Text>
	);
}

export type BthMobileScrollViewProps = Omit<ScrollViewProps, 'style' | 'contentContainerStyle'> & {
	children?: React.ReactNode;
	fill?: boolean;
	padding?: SpacingToken;
	gap?: SpacingToken;
	style?: StyleProp<ViewStyle>;
	contentContainerStyle?: StyleProp<ViewStyle>;
};

export function BthMobileScrollView({
	children,
	fill = false,
	padding = 0,
	gap = 0,
	style,
	contentContainerStyle,
	...scrollProps
}: BthMobileScrollViewProps) {
	return (
		<ScrollView
			{...scrollProps}
			style={[fill ? { flex: 1 } : undefined, style]}
			contentContainerStyle={[
				fill ? { flexGrow: 1 } : undefined,
				{ padding: spacing[padding], gap: spacing[gap] },
				contentContainerStyle,
			]}
		>
			{children}
		</ScrollView>
	);
}

