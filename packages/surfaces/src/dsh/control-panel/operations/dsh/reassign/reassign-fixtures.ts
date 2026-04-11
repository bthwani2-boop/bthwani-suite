import type { DshControlPanelText } from '@bthwani/ui-kit';

export type DshReassignCandidate = {
  deliveryId: string;
  orderId: string;
  currentCaptain: string;
  fallbackCaptain: string;
  reasonLabel: string;
  priorityLabel: string;
  statusLabel: string;
  note: string;
  tone: 'brand' | 'success' | 'warning' | 'danger';
};

export type DshReassignSummary = {
  activeCases: number;
  urgentCases: number;
  blockedCases: number;
  readyFallbacks: number;
};

export function getDshReassignSummary(text: DshControlPanelText): DshReassignSummary {
  return text.fixtures.reassign.summary;
}

export function getDshReassignCandidates(text: DshControlPanelText): ReadonlyArray<DshReassignCandidate> {
  return text.fixtures.reassign.candidates;
}