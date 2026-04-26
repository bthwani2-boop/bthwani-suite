import React, { useState } from 'react';
import { FlatList, Pressable, View } from 'react-native';
import { colorPalette, spacing } from '../../foundation';
import { Button } from '../button';
import { Card } from '../card';
import { SheetFrame } from '../overlay';
import { Surface, Text } from '../../primitives';

export type CartLine = {
	id: string;
	title: string;
	subtitle?: string;
	price: number;
	qty: number;
	subtotal?: number;
};

export type CartDetailsProps = {
	visible: boolean;
	onClose: () => void;
	items: CartLine[];
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

export function CartDetails({ visible, onClose, items, currency = 'SAR', onChangeQty, onRemove, onCheckout }: CartDetailsProps) {
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

export type CartSummaryProps = {
	totalAmount: number;
	currency?: string;
	itemsCount?: number;
	storeName?: string;
	deliveryStatus?: string;
	onOpenCart?: () => void;
	onBack?: () => void;
	formatAmount?: (n: number) => string;
	showActions?: boolean;
	store?: {
		id?: string;
		name?: string;
		subtitle?: string;
		ratingLabel?: string;
		statusLabel?: string;
	};
	order?: {
		id?: string;
		title?: string;
		subtitle?: string;
		meta?: string;
		statusLabel?: string;
	};
};

export function CartSummary({
	totalAmount,
	currency = 'SAR',
	itemsCount,
	storeName,
	deliveryStatus,
	onOpenCart,
	onBack,
	formatAmount,
	showActions = true,
	store,
	order,
}: CartSummaryProps) {
	const format =
		formatAmount ??
		((value: number) => {
			try {
				return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(value);
			} catch {
				return `${value} ${currency}`;
			}
		});

	const [expanded, setExpanded] = useState(false);

	return (
		<View style={{ gap: spacing[3] }}>
			<Card title="Cart overview" subtitle="A compact view of everything in your cart.">
				<View style={{ gap: spacing[2], marginTop: spacing[2] }}>
					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
						<Text role="bodyMd">Items</Text>
						<Text role="bodySm" tone="muted">{itemsCount ?? (order ? 1 : 0)} items</Text>
					</View>

					{store || storeName ? (
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text role="bodyMd">Store</Text>
							<Text role="bodySm" tone="muted">{store?.name ?? storeName}</Text>
						</View>
					) : null}

					{deliveryStatus || store?.statusLabel ? (
						<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
							<Text role="bodyMd">Delivery status</Text>
							<Text role="bodySm" tone="muted">{deliveryStatus ?? store?.statusLabel}</Text>
						</View>
					) : null}

					{order ? (
						<Pressable onPress={() => setExpanded((current) => !current)}>
							<View style={{ marginTop: spacing[2] }}>
								<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
									<Text role="bodyMd">Order</Text>
									<Text role="bodySm" tone="muted">{order.title ?? ''}</Text>
								</View>

								{expanded ? (
									<View style={{ marginTop: spacing[2], gap: spacing[2] }}>
										{order.subtitle ? <Text role="bodySm">{order.subtitle}</Text> : null}
										{order.meta ? <Text role="caption" tone="muted">{order.meta}</Text> : null}
									</View>
								) : null}
							</View>
						</Pressable>
					) : null}

					<View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: spacing[2] }}>
						<Text role="titleSm">Total</Text>
						<Text role="titleSm">{format(totalAmount)}</Text>
					</View>
				</View>
			</Card>

			<Card title="Cart context confirmed" subtitle="One clear total keeps the next action obvious.">
				<View style={{ gap: spacing[3], marginTop: spacing[2] }}>
					<Text role="bodyMd" align="center">Initialize the cart session before moving into the checkout route.</Text>

					{showActions ? (
						<View style={{ gap: spacing[2], marginTop: spacing[3] }}>
							<Button label={`Open cart — ${format(totalAmount)}`} disabled={!onOpenCart} onPress={onOpenCart} />
							<Button label="Back" tone="secondary" disabled={!onBack} onPress={onBack} />
						</View>
					) : null}
				</View>
			</Card>
		</View>
	);
}

export default CartDetails;