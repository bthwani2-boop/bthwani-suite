import React from 'react';
import { FlatList, View } from 'react-native';
import { Button, Card, SheetFrame, Surface, Text, colorPalette, spacing } from '@bthwani/ui-kit';

export type DshCartLine = {
	id: string;
	title: string;
	subtitle?: string;
	price: number;
	qty: number;
	subtotal?: number;
};

export type DshCartDetailsProps = {
	visible: boolean;
	onClose: () => void;
	items: DshCartLine[];
	currency?: string;
	onChangeQty?: (id: string, qty: number) => void;
	onRemove?: (id: string) => void;
	onCheckout?: () => void;
};

function toEnglishDigits(str: string): string {
	return str
		.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
		.replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
}

function formatAmount(value: number, currency: string) {
	try {
		const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
		const displayCurrency = currency === 'YER' ? 'ر.ي.' : currency;
		return `${formatted} ${displayCurrency}`;
	} catch {
		return `${value} ${currency}`;
	}
}

export function DshCartDetails({ visible, onClose, items, currency = 'YER', onChangeQty, onRemove, onCheckout }: DshCartDetailsProps) {
	const total = items.reduce((sum, item) => sum + (item.subtotal ?? item.price * item.qty), 0);

	function updateItemQty(itemId: string, nextQty: number) {
		if (nextQty <= 0) {
			onRemove?.(itemId);
			return;
		}

		onChangeQty?.(itemId, nextQty);
	}

	return (
		<SheetFrame visible={visible} onClose={onClose} title={`مراجعة السلة — ${formatAmount(total, currency)}`}>
			<View style={{ gap: spacing[2] }}>
				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					style={{ maxHeight: 360 }}
					contentContainerStyle={{ gap: spacing[1] }}
					ListEmptyComponent={(
						<Surface tone="default" gap={1} style={{ backgroundColor: colorPalette.surfaceSecondary, borderColor: colorPalette.borderSubtle }}>
							<Text role="bodyMd" align="center">لا توجد عناصر في السلة حتى الآن</Text>
							<Text role="bodySm" tone="muted" align="center">أضف منتجات جديدة حتى تتمكن من مراجعة الكميات والإجماليات قبل التنفيذ.</Text>
						</Surface>
					)}
					renderItem={({ item }) => (
						<Card
							title={item.title}
							subtitle={item.subtitle}
							padding={2}
							gap={1}
							footer={(
								<View style={{ gap: spacing[2] }}>
									<View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
										<Text role="caption" tone="muted">سعر الوحدة {formatAmount(item.price, currency)}</Text>
										<Text role="bodySm" tone="soft">{formatAmount(item.subtotal ?? item.price * item.qty, currency)}</Text>
									</View>

									<View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
										<View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2] }}>
											<Button
												label="-"
												tone="secondary"
												size="sm"
												fullWidth={false}
												disabled={!onChangeQty || item.qty <= 1}
												onPress={() => updateItemQty(item.id, item.qty - 1)}
											/>
											<Text role="bodyStrong">{item.qty}</Text>
											<Button
												label="+"
												tone="secondary"
												size="sm"
												fullWidth={false}
												disabled={!onChangeQty}
												onPress={() => updateItemQty(item.id, item.qty + 1)}
											/>
										</View>

										{onRemove ? (
											<Button
												label="حذف"
												tone="ghost"
												size="sm"
												fullWidth={false}
												onPress={() => onRemove(item.id)}
											/>
										) : null}
									</View>
								</View>
							)}
						/>
					)}
					ItemSeparatorComponent={() => <View style={{ height: spacing[2] }} />}
				/>

				<Surface tone="default" gap={1} style={{ backgroundColor: colorPalette.surfaceSecondary, borderColor: colorPalette.borderSubtle }}>
					<Text role="bodyMd">إجمالي السلة</Text>
					<Text role="titleSm">{formatAmount(total, currency)}</Text>
					<View style={{ flexDirection: 'row-reverse', gap: spacing[2], flexWrap: 'wrap' }}>
						<Button
							label="تأكيد الطلب"
							fullWidth={false}
							disabled={!onCheckout || items.length === 0}
							onPress={() => onCheckout?.()}
							style={{ backgroundColor: colorPalette.accentOrange, borderColor: colorPalette.accentOrange }}
						/>
						<Button label="إغلاق" tone="secondary" fullWidth={false} onPress={onClose} />
						{onRemove ? (
							<Button
								label="حذف الكل"
								tone="ghost"
								fullWidth={false}
								disabled={items.length === 0}
								onPress={() => items.forEach((item) => onRemove(item.id))}
							/>
						) : null}
					</View>
				</Surface>
			</View>
		</SheetFrame>
	);
}

export default DshCartDetails;
