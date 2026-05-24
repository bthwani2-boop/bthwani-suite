import * as React from 'react';
import {
	Image,
	Pressable,
	View,
	type ImageStyle,
	type StyleProp,
	type TextStyle,
	type ViewStyle,
} from 'react-native';
import { Icon, Text, colorPalette } from '@bthwani/ui-kit';

export type HomeCategorySelectorStyles = {
	categorySelectorCard: StyleProp<ViewStyle>;
	categoryIconContainer: StyleProp<ViewStyle>;
	categoryHubIconContainer: StyleProp<ViewStyle>;
	videoIconContainer: StyleProp<ViewStyle>;
	categoryIconContainerSelected: StyleProp<ViewStyle>;
	categoryNameContainer: StyleProp<ViewStyle>;
	categoryName: StyleProp<TextStyle>;
};

export type HomeCategorySelectorTheme = {
	brand: string;
};

export function CategoryIconImage({
	uri,
	emojiFallback,
	style,
}: {
	uri: string | null;
	emojiFallback: string;
	style: StyleProp<ImageStyle | TextStyle>;
}) {
	const [failed, setFailed] = React.useState(false);

	if (!uri || failed) {
		return <Text role="titleLg" style={style as StyleProp<TextStyle>}>{emojiFallback}</Text>;
	}

	return (
		<Image
			source={{ uri }}
			style={style as StyleProp<ImageStyle>}
			resizeMode="cover"
			onError={() => setFailed(true)}
		/>
	);
}

export function CategoryHubIcon() {
	return (
		<Icon name="grid-outline" size={22} color={colorPalette.brand} />
	);
}

export const CategorySelectorItem = React.memo(function CategorySelectorItem({
	label,
	icon,
	onPress,
	isSelected,
	isHub,
	isVideo,
	styles,
	theme,
}: {
	label: string;
	icon: React.ReactNode;
	onPress: () => void;
	isSelected?: boolean;
	isHub?: boolean;
	isVideo?: boolean;
	styles: HomeCategorySelectorStyles;
	theme: HomeCategorySelectorTheme;
}) {
	return (
		<Pressable style={styles.categorySelectorCard} onPress={onPress}>
			<View
				style={[
					styles.categoryIconContainer,
					isHub && styles.categoryHubIconContainer,
					isVideo && styles.videoIconContainer,
					isSelected && styles.categoryIconContainerSelected,
				]}
			>
				{icon}
			</View>
			<View style={[styles.categoryNameContainer]}>
				<Text role="bodySm" style={[styles.categoryName, isSelected && { color: theme.brand }]} numberOfLines={1}>
					{label}
				</Text>
			</View>
		</Pressable>
	);
});
