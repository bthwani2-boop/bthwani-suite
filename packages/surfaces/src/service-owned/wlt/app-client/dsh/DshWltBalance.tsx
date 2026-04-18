import React from 'react';
import { BthChip } from '@bthwani/ui-kit';

export default function DshWltBalance({ balance }: { balance: number | null }) {
  if (balance == null) return null;
  return <BthChip label={`الرصيد ${((balance ?? 0) / 100).toFixed(2)} SAR`} selected />;
}
