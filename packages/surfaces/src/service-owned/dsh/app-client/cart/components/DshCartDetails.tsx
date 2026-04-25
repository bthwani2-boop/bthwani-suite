import React, { useState } from 'react';
import { FlatList, View } from 'react-native';
import { colorPalette, spacing } from '@bthwani/ui-kit';
import { Button, Card, SheetFrame, Surface, Text } from '@bthwani/ui-kit';

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

function formatAmount(value: number, currency: string) {
	try {
		return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(value);
	} catch {
		return `${value} ${currency}`;
	}
}

export function DshCartDetails({ visible, onClose, items, currency = 'SAR', onChangeQty, onRemove, onCheckout }: DshCartDetailsProps) {
	const total = items.reduce((sum, item) => sum + (item.subtotal ?? item.price * item.qty), 0);

	function updateItemQty(itemId: string, nextQty: number) {
		if (nextQty <= 0) {
			onRemove?.(itemId);
			return;
		}

		onChangeQty?.(itemId, nextQty);
	}

	return (
		<SheetFrame visible={visible} onClose={onClose} title={`Cart — ${formatAmount(total, currency)}`}>
			<View style={{ gap: spacing[2] }}>
				<FlatList
					data={items}
					keyExtractor={(item) => item.id}
					style={{ maxHeight: 360 }}
					contentContainerStyle={{ gap: spacing[1] }}
					ListEmptyComponent={(
						<Surface tone="default" gap={1} style={{ backgroundColor: colorPalette.surfaceSecondary, borderColor: colorPalette.borderSubtle }}>
							<Text role="bodyMd" align="center">No items in the cart yet.</Text>
							<Text role="bodySm" tone="muted" align="center">Add products to review quantities and totals here.</Text>
						</Surface>
					)}
					renderItem={({ item }) => (
						<Card
							title={item.title}
							subtitle={item.subtitle}
							padding={3}
							gap={2}
							footer={(
								<View style={{ gap: spacing[2] }}>
									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
										<Text role="caption" tone="muted">{formatAmount(item.price, currency)} each</Text>
										<Text role="bodySm" tone="soft">{formatAmount(item.subtotal ?? item.price * item.qty, currency)}</Text>
									</View>

									<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing[2] }}>
										<View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing[2] }}>
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
												label="Remove"
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
					<Text role="bodyMd">Order total</Text>
					<Text role="titleSm">{formatAmount(total, currency)}</Text>
					<View style={{ flexDirection: 'row', gap: spacing[3] }}>
						<Button label="Proceed to checkout" disabled={!onCheckout || items.length === 0} onPress={() => onCheckout?.()} />
						<Button label="Close" tone="secondary" onPress={onClose} />
						{onRemove ? <Button label="Remove all" tone="ghost" disabled={items.length === 0} onPress={() => items.forEach((item) => onRemove(item.id))} /> : null}
					</View>
				</Surface>
			</View>
		</SheetFrame>
	);
}

export default DshCartDetails;
