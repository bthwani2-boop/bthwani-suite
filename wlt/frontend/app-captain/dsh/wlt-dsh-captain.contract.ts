export const wltDshCaptainBridgeDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  moneySemantics: 'preview-only display values / not accounting source',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-captain',
} as const;

export type WltDshCaptainBridgeContract = typeof wltDshCaptainBridgeDataContract;
