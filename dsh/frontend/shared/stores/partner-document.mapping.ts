// dsh/frontend/shared/partner/documents/partner-document.mapping.ts
// Authority: shared/partner/documents — mappings, labels and typed error helpers.
// No JSX. No ui-kit. No Tamagui.

import type { PartnerDocumentKind, PartnerDocumentStatus } from './partner-document.types';

export const PARTNER_DOCUMENT_KIND_LABELS: Record<PartnerDocumentKind, string> = {
  commercial_registration: 'السجل التجاري',
  tax_certificate: 'الشهادة الضريبية',
  identity_proof: 'إثبات هوية المالك',
  storefront_photo: 'صورة واجهة المتجر',
  interior_photo: 'صورة المتجر من الداخل',
};

export const PARTNER_DOCUMENT_STATUS_LABELS: Record<PartnerDocumentStatus, string> = {
  pending: 'قيد المراجعة',
  approved: 'معتمد',
  rejected: 'مرفوض',
};

export function parseDocumentUploadError(err: unknown): string {
  if (err && typeof err === 'object') {
    const errorObj = err as Record<string, unknown>;
    if (errorObj.kind === 'offline') {
      return 'تعذر الاتصال بالخادم. أنت غير متصل بالإنترنت حاليًا.';
    }
    if (errorObj.kind === 'http' && errorObj.body) {
      return String(errorObj.body);
    }
    if (errorObj.message) {
      return String(errorObj.message);
    }
  }
  return 'فشل إرسال المستند، يرجى المحاولة لاحقًا.';
}

// ── Display properties moved from UI ──────────────────────────────────────────

export type PartnerDocumentDisplayItem = {
  id: PartnerDocumentKind;
  label: string;
  description: string;
  icon: string;
};

export const PARTNER_DOCUMENT_DISPLAY_ITEMS: readonly PartnerDocumentDisplayItem[] = [
  {
    id: 'commercial_registration',
    label: 'السجل التجاري',
    description: 'نسخة سارية وصالحة من السجل التجاري الرسمي.',
    icon: 'assignment',
  },
  {
    id: 'tax_certificate',
    label: 'الشهادة الضريبية',
    description: 'الرقم الضريبي الموحد للمتجر.',
    icon: 'text-snippet',
  },
  {
    id: 'identity_proof',
    label: 'إثبات هوية المالك',
    description: 'بطاقة الهوية الوطنية أو جواز السفر للمالك.',
    icon: 'badge',
  },
  {
    id: 'storefront_photo',
    label: 'صورة واجهة المتجر',
    description: 'صورة خارجية واضحة تُظهر اللوحة والمدخل الرئيسي.',
    icon: 'photo-camera',
  },
  {
    id: 'interior_photo',
    label: 'صورة المتجر من الداخل',
    description: 'صورة توضح الأقسام الرئيسية وتنسيق المنتجات.',
    icon: 'image',
  },
];

import type { OnboardingStoreFile } from './partner-onboarding-draft.model';

export function applyFieldDocumentUploadToStore(
  store: OnboardingStoreFile,
  kind: PartnerDocumentKind | string,
  uploadedRef: string,
): OnboardingStoreFile {
  const docs = { ...store.draft.documents };
  const photos = { ...store.draft.photos };

  if (kind === 'commercial_registration') {
    docs.commercialRegistrationStatus = 'uploaded';
    docs.commercialRegistrationRef = uploadedRef;
  } else if (kind === 'identity_proof') {
    docs.identityProofStatus = 'uploaded';
    docs.identityProofRef = uploadedRef;
  } else if (kind === 'tax_certificate') {
    docs.taxCertificateStatus = 'uploaded';
    docs.taxCertificateRef = uploadedRef;
  } else if (kind === 'storefront_photo') {
    photos.storefrontPhotoRef = uploadedRef;
  } else if (kind === 'interior_photo') {
    photos.interiorPhotoRef = uploadedRef;
  }

  return {
    ...store,
    lastUpdatedLabel: 'الآن',
    draft: {
      ...store.draft,
      documents: docs,
      photos,
    },
  };
}

import type { PartnerOnboardingDraft, PartnerDocumentRuntimeStatus } from './partner-onboarding.types';

export type PartnerDocumentItemSummary = {
  id: PartnerDocumentKind;
  label: string;
  required: boolean;
  status: PartnerDocumentRuntimeStatus;
  referenceLabel: string;
};

export function resolvePartnerDocumentItems(draft: PartnerOnboardingDraft): PartnerDocumentItemSummary[] {
  return [
    {
      id: 'commercial_registration',
      label: 'السجل التجاري',
      required: true,
      status: draft.documents.commercialRegistrationStatus,
      referenceLabel: draft.documents.commercialRegistrationRef || 'لا يوجد مرجع مرفوع بعد',
    },
    {
      id: 'identity_proof',
      label: 'إثبات هوية المالك',
      required: true,
      status: draft.documents.identityProofStatus,
      referenceLabel: draft.documents.identityProofRef || 'لا يوجد مرجع مرفوع بعد',
    },
  ];
}
