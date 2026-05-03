import React, { useState } from 'react';
import { Pressable, View } from 'react-native';
import { spacing } from '../../foundation';
import { Button } from '../button';
import { Card } from '../card';
import { Text } from '../../primitives';

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

function formatAmount(value: number, currency: string) {
	try {
		return new Intl.NumberFormat('ar-SA', { style: 'currency', currency }).format(value);
	} catch {
		return `${value} ${currency}`;
	}
}

export function CartSummary({
	totalAmount,
	currency = 'SAR',
	itemsCount,
	storeName,
	deliveryStatus,
	onOpenCart,
	onBack,
	formatAmount: customFormatAmount,
	showActions = true,
	store,
	order,
}: CartSummaryProps) {
	const format =
		customFormatAmount ??
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

export default CartSummary;
