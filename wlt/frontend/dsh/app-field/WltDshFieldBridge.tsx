import React from 'react';
import { WltDshFieldFinanceSummary } from './WltDshFieldFinanceSummary';

export type WltDshFieldBridgeProps = React.ComponentProps<typeof WltDshFieldFinanceSummary>;

export function WltDshFieldBridge(props: WltDshFieldBridgeProps) {
  return <WltDshFieldFinanceSummary {...props} />;
}

export default WltDshFieldBridge;
