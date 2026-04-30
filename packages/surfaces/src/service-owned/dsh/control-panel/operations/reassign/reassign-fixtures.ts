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

type DshReassignTextSource = {
  fixtures: {
    reassign: {
      summary: DshReassignSummary;
      candidates: ReadonlyArray<{
        deliveryId: string;
        orderId: string;
        currentCaptain: string;
        fallbackCaptain: string;
        reasonLabel: string;
        priorityLabel: string;
        statusLabel: string;
        note: string;
        tone: string;
      }>;
    };
  };
};

export function getDshReassignSummary(text: DshReassignTextSource): DshReassignSummary {
  return text.fixtures.reassign.summary;
}

export function getDshReassignCandidates(text: DshReassignTextSource): ReadonlyArray<DshReassignCandidate> {
  return text.fixtures.reassign.candidates as ReadonlyArray<DshReassignCandidate>;
}