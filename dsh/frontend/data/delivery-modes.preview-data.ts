export {
  DSH_DELIVERY_MODE_DEFINITIONS,
  getDshDeliveryModeDefinition,
} from '../shared/dsh-delivery-mode.model';
export type { DshFulfillmentDeliveryMode as DshDeliveryModeId } from '../shared/dsh-delivery-mode.model';

export const dshDeliveryModesPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
} as const;
