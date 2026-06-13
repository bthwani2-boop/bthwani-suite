import React from 'react';
import { WltDshClientPaymentSelector } from './WltDshClientPaymentSelector';

export type WltDshClientBridgeProps = React.ComponentProps<typeof WltDshClientPaymentSelector>;

export function WltDshClientBridge(props: WltDshClientBridgeProps) {
	return <WltDshClientPaymentSelector {...props} />;
}

export default WltDshClientBridge;
