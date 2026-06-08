import React from 'react';
import { WltDshClientPaymentPreview } from './WltDshClientPaymentPreview';

export type WltDshClientBridgeProps = React.ComponentProps<typeof WltDshClientPaymentPreview>;

export function WltDshClientBridge(props: WltDshClientBridgeProps) {
	return <WltDshClientPaymentPreview {...props} />;
}

export default WltDshClientBridge;
