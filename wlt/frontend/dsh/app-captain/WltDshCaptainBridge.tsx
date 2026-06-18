import React from 'react';
import { WltDshCaptainFinanceSummary } from './WltDshCaptainFinanceSummary';

export type WltDshCaptainBridgeProps = React.ComponentProps<typeof WltDshCaptainFinanceSummary>;

export function WltDshCaptainBridge(props: WltDshCaptainBridgeProps) {
  return <WltDshCaptainFinanceSummary {...props} />;
}

export default WltDshCaptainBridge;
