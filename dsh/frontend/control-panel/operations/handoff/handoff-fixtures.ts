export type DshHandoffLane = {
  id: string;
  title: string;
  pickupReference: string;
  code: string;
  otp: string;
  contactless: string;
  notes: string;
  status: string;
};

export type DshHandoffSummary = {
  pickupVerified: number;
  dropoffVerified: number;
  failedVerification: number;
  contactlessAllowed: number;
};

const handoffSummary: DshHandoffSummary = {
  pickupVerified: 5,
  dropoffVerified: 4,
  failedVerification: 2,
  contactlessAllowed: 3,
};

const handoffLanes: readonly DshHandoffLane[] = [
  { id: 'HD-1001', title: 'pickup verified', pickupReference: 'PR-24018', code: 'BAR-1001', otp: '4231', contactless: 'allowed', notes: 'Captain pickup is verified and visible.', status: 'pickup verified' },
  { id: 'HD-1002', title: 'dropoff verified', pickupReference: 'PR-24019', code: 'BAR-1002', otp: '8074', contactless: 'blocked', notes: 'Dropoff handoff already passed verification.', status: 'dropoff verified' },
  { id: 'HD-1003', title: 'failed verification', pickupReference: 'PR-24020', code: 'BAR-1003', otp: '----', contactless: 'allowed', notes: 'The OTP did not match and needs manual review.', status: 'failed verification' },
];

export function getDshHandoffPreview() {
  return {
    summary: handoffSummary,
    lanes: handoffLanes,
  };
}