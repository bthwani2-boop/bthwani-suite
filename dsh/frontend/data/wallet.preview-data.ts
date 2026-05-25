export const dshWalletPreviewDataContract = {
  dataKind: 'UI_PREVIEW_ONLY',
  runtimeTruth: false,
  backendSource: false,
  bindingSource: false,
  moneySemantics: 'WLT-owned read-only preview reference',
} as const;

export type DshWalletReferencePreview = {
  id: string;
  ownerId: string;
  ownerKind: 'customer' | 'partner' | 'captain';
  label: string;
  balanceLabel: string;
  wltOwned: true;
};

export const dshWalletReferencePreviews: readonly DshWalletReferencePreview[] = [
  { id: 'wallet-customer-preview', ownerId: 'customer-360-001', ownerKind: 'customer', label: 'محفظة العميل', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-captain-preview', ownerId: 'captain-preview-001', ownerKind: 'captain', label: 'رصيد الكابتن', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
  { id: 'wallet-partner-preview', ownerId: 'store-101', ownerKind: 'partner', label: 'تسوية الشريك', balanceLabel: 'مرجع WLT فقط', wltOwned: true },
];
