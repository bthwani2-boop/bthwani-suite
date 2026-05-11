import React from 'react';
import { Chip } from '@bthwani/ui-kit';

export type WltDshBalancePreviewProps = {
	balance: number | null;
};

export function WltDshBalancePreview({ balance }: WltDshBalancePreviewProps) {
	if (balance == null) {
		return null;
	}

	return <Chip label={`الرصيد ${((balance ?? 0) / 100).toFixed(2)} SAR`} selected />;
}

export default WltDshBalancePreview;
