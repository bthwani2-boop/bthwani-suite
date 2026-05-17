import React from 'react';
import { WltDshCaptainFinancePreview } from './WltDshCaptainFinancePreview';

export type WltDshCaptainBridgeProps = React.ComponentProps<typeof WltDshCaptainFinancePreview>;

export function WltDshCaptainBridge(props: WltDshCaptainBridgeProps) {
  return <WltDshCaptainFinancePreview {...props} />;
}

export default WltDshCaptainBridge;
