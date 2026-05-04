export type DshProofReviewLane = {
  id: string;
  proofType: string;
  required: boolean;
  capturedBy: string;
  capturedAt: string;
  assetUrl: string;
  verificationResult: string;
  failureReason: string;
  impact: string;
};

export type DshProofReviewSummary = {
  accepted: number;
  needsReview: number;
  rejected: number;
  proofRequired: number;
};

const proofReviewSummary: DshProofReviewSummary = {
  accepted: 5,
  needsReview: 3,
  rejected: 2,
  proofRequired: 8,
};

const proofReviewLanes: readonly DshProofReviewLane[] = [
  { id: 'PR-1101', proofType: 'photo', required: true, capturedBy: 'captain', capturedAt: '10:14', assetUrl: '/proofs/photo-1101.jpg', verificationResult: 'accepted', failureReason: 'none', impact: 'No refund impact' },
  { id: 'PR-1102', proofType: 'signature', required: true, capturedBy: 'support', capturedAt: '10:22', assetUrl: '/proofs/sign-1102.jpg', verificationResult: 'needs-review', failureReason: 'blurry signature', impact: 'Payout review pending' },
  { id: 'PR-1103', proofType: 'otp', required: false, capturedBy: 'captain', capturedAt: '10:31', assetUrl: '/proofs/otp-1103.txt', verificationResult: 'rejected', failureReason: 'otp mismatch', impact: 'Refund likely' },
  { id: 'PR-1104', proofType: 'barcode', required: true, capturedBy: 'partner', capturedAt: '10:41', assetUrl: '/proofs/barcode-1104.png', verificationResult: 'accepted', failureReason: 'none', impact: 'No payout change' },
];

export function getDshProofReviewPreview() {
  return {
    summary: proofReviewSummary,
    lanes: proofReviewLanes,
  };
}