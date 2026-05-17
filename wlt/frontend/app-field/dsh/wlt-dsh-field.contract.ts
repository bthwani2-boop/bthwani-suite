export const wltDshFieldBridgeDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  moneySemantics: 'preview-only display values / not commission source',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-field',
} as const;

export type WltDshFieldBridgeContract = typeof wltDshFieldBridgeDataContract;
