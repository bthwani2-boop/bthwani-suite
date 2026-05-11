import React from 'react';
import { ListItem } from '@bthwani/ui-kit';

export type WltDshPaymentOptionProps = {
	title: string;
	subtitle?: string;
	selected?: boolean;
	meta?: string;
	onPress?: () => void;
};

export function WltDshPaymentOption({ title, subtitle, selected, meta, onPress }: WltDshPaymentOptionProps) {
	return <ListItem title={title} subtitle={subtitle} meta={selected ? 'محدد' : meta} onPress={onPress} />;
}

export default WltDshPaymentOption;
