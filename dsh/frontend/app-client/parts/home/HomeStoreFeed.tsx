import { View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { Text } from '@bthwani/ui-kit';

export type HomeEmptyFeedStyles = {
	emptyFeed: StyleProp<ViewStyle>;
	emptyFeedEmoji: StyleProp<TextStyle>;
	emptyFeedTitle: StyleProp<TextStyle>;
	emptyFeedText: StyleProp<TextStyle>;
};

export function EmptyFeed({ query, styles }: { query?: string; styles: HomeEmptyFeedStyles }) {
	const isSearch = Boolean(query?.trim());
	return (
		<View style={styles.emptyFeed}>
			<Text style={styles.emptyFeedEmoji}>{isSearch ? '🔎' : '🍽️'}</Text>
			<Text role="titleSm" weight="black" style={styles.emptyFeedTitle}>
				{isSearch ? 'لا توجد نتائج داخل هذه الفئة' : 'لا توجد متاجر لهذه الفئة بعد'}
			</Text>
			<Text role="bodySm" style={styles.emptyFeedText}>
				{isSearch ? 'جرّب تغيير البحث أو انتقل إلى فئة أخرى.' : 'أضف متاجر لهذه الفئة كي تظهر هنا.'}
			</Text>
		</View>
	);
}
