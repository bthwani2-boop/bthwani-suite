export const wltDshFieldBridgeDataContract = {
  dataKind: 'RUNTIME_BOUND',
  runtimeTruth: true,
  backendSource: true,
  bindingSource: true,
  moneySemantics: 'WLT-owned field commission and payout references only',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-field',
} as const;

export type WltDshFieldBridgeContract = typeof wltDshFieldBridgeDataContract;
