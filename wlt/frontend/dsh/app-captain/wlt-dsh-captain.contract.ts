export const wltDshCaptainBridgeDataContract = {
  dataKind: 'RUNTIME_BOUND',
  runtimeTruth: true,
  backendSource: true,
  bindingSource: true,
  moneySemantics: 'WLT-owned captain eligibility, COD, and earning references only',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-captain',
} as const;

export type WltDshCaptainBridgeContract = typeof wltDshCaptainBridgeDataContract;
