import React from 'react';
import {
  PartnerDshWalletBridgeView,
  type PartnerDshWalletBridgeProps,
} from './wlt-dsh-partner.parts';

export type WltDshPartnerBridgeProps = PartnerDshWalletBridgeProps;

export function WltDshPartnerBridge(props: WltDshPartnerBridgeProps) {
  return <PartnerDshWalletBridgeView {...props} />;
}

export default WltDshPartnerBridge;
