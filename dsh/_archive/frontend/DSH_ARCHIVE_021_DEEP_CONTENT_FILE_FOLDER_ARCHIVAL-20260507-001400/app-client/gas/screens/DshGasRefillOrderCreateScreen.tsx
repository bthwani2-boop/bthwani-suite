import React from 'react';
import { DshIntakeHubScreen, type DshIntakeHubScreenProps } from '../../checkout/screens';

export type DshGasRefillOrderCreateScreenProps = Omit<DshIntakeHubScreenProps, 'screenId'>;

export function DshGasRefillOrderCreateScreen(props: DshGasRefillOrderCreateScreenProps) {
  return <DshIntakeHubScreen screenId="gas-refill-order-create" {...props} />;
}
