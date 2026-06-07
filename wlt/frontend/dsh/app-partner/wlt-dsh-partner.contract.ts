export const wltDshPartnerBridgeDataContract = {
  dataKind: 'RUNTIME_BOUND',
  runtimeTruth: true,
  backendSource: true,
  bindingSource: true,
  timezoneSemantics: 'not_applicable',
  moneySemantics: 'WLT-owned partner settlement references only',
  ownerKind: 'integration',
  ownerId: 'wlt.dsh',
  serviceId: 'wlt',
  linkedServiceId: 'dsh',
  surfaceId: 'app-partner',
} as const;
