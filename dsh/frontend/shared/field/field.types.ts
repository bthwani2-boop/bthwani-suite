// DSH Field App — store routing, navigation, and visit contracts.
// No JSX. No ui-kit. No Tamagui.

import type { DshFulfillmentDeliveryMode } from '../delivery';
import type {
  PartnerFulfillmentModeAgreement,
  PartnerOnboardingSectionId,
  PartnerDocumentRuntimeStatus,
  PartnerOnboardingDraft,
  OnboardingStoreFile,
  PartnerSectionSummary,
} from '../partner/onboarding';

export type FieldFulfillmentMode = DshFulfillmentDeliveryMode;
export type FieldFulfillmentModeAgreement = PartnerFulfillmentModeAgreement;

export type FieldStatusTone = 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
export type FieldLeadSource = 'candidate' | 'manual' | 'local-ui-draft' | 'backend';

export type FieldLeadStatus =
  | 'new-lead'
  | 'visit-planned'
  | 'offer-pending-approval'
  | 'offer-approved'
  | 'appointment-scheduled'
  | 'visited'
  | 'follow-up-required'
  | 'ready-for-onboarding'
  | 'submitted';

export type FieldLeadFilter = 'all' | 'today' | 'ready' | 'follow-up' | 'pending' | 'submitted' | 'done';

export type DshFieldSurfaceId = 'stores' | 'onboarding' | 'visits' | 'finance' | 'profile';

export type FieldOnboardingSectionId = PartnerOnboardingSectionId;
export type FieldDocumentRuntimeStatus = PartnerDocumentRuntimeStatus;
/** @deprecated Use FieldDocumentRuntimeStatus */
export type FieldDocumentPreviewStatus = FieldDocumentRuntimeStatus;
export type FieldDocumentStatus = FieldDocumentRuntimeStatus;

export type FieldOnboardingDraft = PartnerOnboardingDraft;
export type FieldStoreFile = OnboardingStoreFile;
export type FieldSectionSummary = PartnerSectionSummary;

// ── Surface routing types ──────────────────────────────────────────────────

export type DshFieldRoute =
  | 'stores'
  | 'onboarding'
  | 'visit'
  | 'account'
  | 'profile'
  | 'history'
  | 'finance'
  | 'readiness-escalation'
  | 'document-upload';

export type DshFieldRouteState =
  | { kind: 'stores' }
  | { kind: 'onboarding'; storeId: string }
  | { kind: 'visit'; backendStoreId: string }
  | { kind: 'account' }
  | { kind: 'profile' }
  | { kind: 'history' }
  | { kind: 'finance' }
  | { kind: 'readiness-escalation'; storeId: string }
  | { kind: 'document-upload'; storeId: string };

export type DshFieldCommandTarget = DshFieldRoute;

export type DshFieldNavigationCommand = {
  token: number;
  target: DshFieldCommandTarget;
  storeId?: string;
};

export type DshFieldSurfaceProps = {
  command?: DshFieldNavigationCommand;
  onExit?: () => void;
};

export type DshFieldSurfaceHostProps = DshFieldSurfaceProps;

// ── Visit contract ─────────────────────────────────────────────────────────

export const dshFieldVisitContractMeta = {
  dataKind: 'BACKEND_RUNTIME_BINDING_REQUIRED',
  runtimeTruth: true,
  backendSource: true,
  bindingSource: true,
} as const;

export type DshFieldStoreVisitState =
  | 'ready'
  | 'loading'
  | 'empty'
  | 'error'
  | 'success'
  | 'offline'
  | 'disabled';

export type DshFieldVisitEvidenceItem = {
  id: string;
  title: string;
  subtitle: string;
  statusLabel: string;
  capturedAtLabel: string;
};

export type DshFieldStoreVisitValues = {
  visitSummary: string;
  followUpAction: string;
};

export type DshFieldStoreVisitErrors = Partial<Record<keyof DshFieldStoreVisitValues, string>>;

// ── Labels and constants (delegated or mapped to partner) ───────────────────

import {
  onboardingStatusLabels,
  onboardingStatusTones,
  partnerSectionOrder,
  partnerSectionLabels,
} from '../partner/onboarding';

export const fieldStatusLabels: Record<FieldLeadStatus, string> = {
  'new-lead': onboardingStatusLabels['new-lead'],
  'visit-planned': 'زيارة مخططة',
  'offer-pending-approval': onboardingStatusLabels['offer-pending-approval'],
  'offer-approved': onboardingStatusLabels['offer-approved'],
  'appointment-scheduled': 'جاهز للزيارة',
  visited: 'بانتظار تسجيل النتيجة',
  'follow-up-required': onboardingStatusLabels['follow-up-required'],
  'ready-for-onboarding': onboardingStatusLabels['ready-for-onboarding'],
  submitted: onboardingStatusLabels['submitted'],
};

export const fieldStatusTones: Record<FieldLeadStatus, FieldStatusTone> = {
  'new-lead': onboardingStatusTones['new-lead'],
  'visit-planned': 'info',
  'offer-pending-approval': onboardingStatusTones['offer-pending-approval'],
  'offer-approved': onboardingStatusTones['offer-approved'],
  'appointment-scheduled': 'brand',
  visited: 'info',
  'follow-up-required': onboardingStatusTones['follow-up-required'],
  'ready-for-onboarding': onboardingStatusTones['ready-for-onboarding'],
  submitted: onboardingStatusTones['submitted'],
};

export const fieldFilterOptions: readonly { id: FieldLeadFilter; label: string; tone: FieldStatusTone }[] = [
  { id: 'all', label: 'الكل', tone: 'default' },
  { id: 'today', label: 'اليوم', tone: 'brand' },
  { id: 'ready', label: 'جاهز للإضافة', tone: 'success' },
  { id: 'follow-up', label: 'تحتاج متابعة', tone: 'warning' },
  { id: 'pending', label: 'بانتظار اعتماد', tone: 'info' },
  { id: 'submitted', label: 'مرسل', tone: 'brand' },
  { id: 'done', label: 'منتهٍ للميداني', tone: 'success' },
] as const;

export const fieldSectionOrder = partnerSectionOrder;
export const fieldSectionLabels = partnerSectionLabels;
