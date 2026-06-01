import { getWltDshClientPaymentPreview } from '../../control-panel/dsh/dshFinancePreview';
import { wltDshClientBridgeDataContract } from './wlt-dsh-client.contract';

export const wltDshClientPaymentPreviewData = {
  contract: wltDshClientBridgeDataContract,
  paymentPreview: getWltDshClientPaymentPreview(),
} as const;
