import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Text, radius, spacing, useTheme } from '@bthwani/ui-kit';

type Opt = {
	id: string;
	label: string;
	subtitle?: string;
	icon?: React.ReactNode;
	meta?: React.ReactNode;
};

export type WltDshPaymentOptionsRowProps = {
	options: Opt[];
	selectedId?: string;
	onSelect: (id: string) => void;
};

export function PaymentOptionItem({ opt, selected, onPress }: { opt: Opt; selected: boolean; onPress?: () => void }) {
	const { theme } = useTheme();
	const dynamicStyle = ({ pressed }: { pressed: boolean }) => [
		styles.item,
		{
			borderColor: selected ? theme.brand : theme.line,
			borderWidth: selected ? 2 : 1,
			backgroundColor: selected ? theme.brandSurface : theme.surface,
			transform: pressed ? [{ scale: 0.995 }] : selected ? [{ translateY: -4 }, { scale: 1.01 }] : undefined,
			...(selected
				? {
						shadowColor: '#000',
						shadowOpacity: 0.06,
						shadowRadius: 8,
						shadowOffset: { width: 0, height: 4 },
						elevation: 4,
					}
				: {}),
		},
	];

	const getGlyph = (id: string) => {
		if (id === 'cod') return '💵';
		if (id === 'wallet') return '👛';
		if (id === 'mixed') return '🔁';
		return id.charAt(0).toUpperCase();
	};

	return (
		<Pressable onPress={onPress} accessibilityRole="button" accessibilityState={{ selected }} style={dynamicStyle}>
			<View
				style={[
					styles.iconWrap,
					selected
						? { borderColor: theme.brand, backgroundColor: theme.brand }
						: { borderColor: theme.line, backgroundColor: theme.surfaceInset },
				]}
			>
				<View style={{ alignItems: 'center', justifyContent: 'center' }}>
					{opt.icon ? (
						<View style={{ alignItems: 'center', justifyContent: 'center' }}>{opt.icon}</View>
					) : (
						<Text role="bodyStrong" style={{ fontSize: 16, color: selected ? '#fff' : undefined }}>
							{getGlyph(opt.id)}
						</Text>
					)}
				</View>
			</View>

			<Text role="bodyStrong" style={{ marginTop: 8, textAlign: 'center' }}>
				{opt.label}
			</Text>
			{opt.subtitle ? (
				<Text role="caption" tone="muted" style={{ marginTop: 4, textAlign: 'center' }}>
					{opt.subtitle}
				</Text>
			) : null}
			{selected && opt.meta ? <View style={{ marginTop: 8 }}>{opt.meta}</View> : null}
		</Pressable>
	);
}

export function WltDshPaymentOptionsRow({ options, selectedId, onSelect }: WltDshPaymentOptionsRowProps) {
	return (
		<ScrollView horizontal contentContainerStyle={{ paddingHorizontal: spacing[4] }} showsHorizontalScrollIndicator={false}>
			<View style={styles.row}>
				{options.map((option) => (
					<PaymentOptionItem
						key={option.id}
						opt={option}
						selected={option.id === selectedId}
						onPress={() => onSelect(option.id)}
					/>
				))}
			</View>
		</ScrollView>
	);
}

export default WltDshPaymentOptionsRow;

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
	},
	item: {
		flex: 1,
		marginHorizontal: 8,
		borderRadius: radius.xl,
		borderWidth: 1,
		paddingVertical: spacing[3],
		paddingHorizontal: spacing[4],
		alignItems: 'center',
		minWidth: 112,
	},
	iconWrap: {
		width: 44,
		height: 44,
		borderRadius: 22,
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 6,
	},
});
