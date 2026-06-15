import type { BthwaniFullStackCapabilityId, BthwaniFullStackSurfaceId } from './bthwani-full-stack-capabilities';
import type { DshControlPanelSectionId } from '../control-panel/dsh-governance.map';

export type BthwaniCapabilityCoverageStatus =
  | 'covered'
  | 'contract-required'
  | 'needs-runtime-evidence'
  | 'blocked-by-policy'
  | 'not-applicable';

export type BthwaniCapabilitySurfaceCoverage = {
  readonly surface: BthwaniFullStackSurfaceId;
  readonly status: BthwaniCapabilityCoverageStatus;
  readonly evidenceNote?: string;
};

export type BthwaniCapabilitySectionCoverage = {
  readonly section: DshControlPanelSectionId;
  readonly status: BthwaniCapabilityCoverageStatus;
};

export type BthwaniFullStackCapabilityCoverageRow = {
  readonly capabilityId: BthwaniFullStackCapabilityId;
  readonly backendStatus: BthwaniCapabilityCoverageStatus;
  readonly openapiStatus: BthwaniCapabilityCoverageStatus;
  readonly sharedStatus: BthwaniCapabilityCoverageStatus;
  readonly controlPanelSections: readonly BthwaniCapabilitySectionCoverage[];
  readonly mobileSurfaces: readonly BthwaniCapabilitySurfaceCoverage[];
  readonly wltStatus: BthwaniCapabilityCoverageStatus;
  readonly mediaStatus: BthwaniCapabilityCoverageStatus;
  readonly evidenceStatus: BthwaniCapabilityCoverageStatus;
  readonly overallClosureStatus: 'CLOSED_WITH_EVIDENCE' | 'HARD_BLOCKED_EXTERNAL_ONLY' | 'contract-required' | 'needs-runtime-evidence';
};

export type BthwaniFullStackCoverageMatrix = {
  readonly capabilities: readonly BthwaniFullStackCapabilityCoverageRow[];
  readonly totalCapabilities: number;
  readonly closedCount: number;
  readonly hardBlockedCount: number;
  readonly contractRequiredCount: number;
  readonly needsEvidenceCount: number;
};
