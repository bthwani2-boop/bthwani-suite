// dsh/frontend/shared/partner/documents/partner-document.types.ts
// Authority: shared/partner/documents — types and statuses for contract document compliance.
// No JSX. No ui-kit. No Tamagui.

export type PartnerDocumentKind =
  | 'commercial_registration'
  | 'tax_certificate'
  | 'identity_proof'
  | 'storefront_photo'
  | 'interior_photo';

export type PartnerDocumentStatus = 'pending' | 'approved' | 'rejected';

export type PartnerCreateDocumentRequest = {
  readonly document_kind: PartnerDocumentKind;
  readonly media_key: string;
};

export type PartnerDocumentRecord = {
  readonly id: string;
  readonly store_id: string;
  readonly document_kind: PartnerDocumentKind;
  readonly media_key: string;
  readonly status: PartnerDocumentStatus;
  readonly created_at: string;
  readonly updated_at: string;
};

export type PartnerDocumentOfflineError = { readonly kind: 'offline' };
export type PartnerDocumentHttpError = {
  readonly kind: 'http';
  readonly status: number;
  readonly body: string;
};
export type PartnerDocumentError = PartnerDocumentOfflineError | PartnerDocumentHttpError;
