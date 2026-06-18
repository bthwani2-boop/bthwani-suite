export const wltDshClientBridgeDataContract = {
  dataKind: 'RUNTIME_BOUND',
  runtimeTruth: true,
  backendSource: true,
  bindingSource: true,
  moneySemantics: 'WLT-owned runtime wallet/payment session references only',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-client',
} as const;

export type WltDshClientBridgeContract = typeof wltDshClientBridgeDataContract;
