import React from 'react';
import { WltDshFieldFinancePreview } from './WltDshFieldFinancePreview';

export type WltDshFieldBridgeProps = React.ComponentProps<typeof WltDshFieldFinancePreview>;

export function WltDshFieldBridge(props: WltDshFieldBridgeProps) {
  return <WltDshFieldFinancePreview {...props} />;
}

export default WltDshFieldBridge;
