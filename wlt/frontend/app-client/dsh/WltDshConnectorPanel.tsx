import React from 'react';
import { Button } from '@bthwani/ui-kit';
import useWltDshWalletPreview from './useWltDshWalletPreview';

export type WltDshConnectorPanelProps = {
	onLinked?: () => void;
};

export function WltDshConnectorPanel({ onLinked }: WltDshConnectorPanelProps) {
	const { linked, link } = useWltDshWalletPreview();

	return (
		<Button
			label={linked ? 'محفظة متصلة' : 'ربط المحفظة'}
			tone={linked ? 'secondary' : 'primary'}
			onPress={async () => {
				if (!linked) {
					await link();
					onLinked?.();
				}
			}}
		/>
	);
}

export default WltDshConnectorPanel;
