// dsh/frontend/shared/partner/documents/partner-document.policy.ts
// Authority: shared/partner/documents — contract compliance and verification policy rules.
// No JSX. No ui-kit. No Tamagui.

import type { PartnerDocumentKind } from './partner-document.types';

export type PartnerDocumentPolicyItem = {
  id: PartnerDocumentKind;
  label: string;
  required: boolean;
  hint: string;
};

export const PARTNER_DOCUMENT_POLICIES: readonly PartnerDocumentPolicyItem[] = [
  {
    id: 'commercial_registration',
    label: 'السجل التجاري',
    required: true,
    hint: 'مطلوب للمطابقة القانونية والتحقق من الاسم والنشاط التجاري.',
  },
  {
    id: 'identity_proof',
    label: 'هوية المالك',
    required: true,
    hint: 'مطلوب للتحقق من هوية صاحب المتجر أو المفوض بالتوقيع.',
  },
  {
    id: 'tax_certificate',
    label: 'رخصة التجارة',
    required: false,
    hint: 'اختياري — وثيقة إضافية لتسوية الحسابات الضريبية.',
  },
] as const;

export function isDocumentRequired(kind: PartnerDocumentKind): boolean {
  return PARTNER_DOCUMENT_POLICIES.find((p) => p.id === kind)?.required ?? false;
}
