export const wltDshClientBridgeDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  moneySemantics: 'preview-only display values / not accounting source',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-client',
} as const;

export type WltDshClientBridgeContract = typeof wltDshClientBridgeDataContract;
