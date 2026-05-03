import React from 'react';
import { Chip } from '@bthwani/ui-kit';

export default function DshWltBalance({ balance }: { balance: number | null }) {
  if (balance == null) return null;
  return <Chip label={`الرصيد ${((balance ?? 0) / 100).toFixed(2)} SAR`} selected />;
}
