import React from 'react';
import { BthListItem } from '@bthwani/ui-kit';

type Props = {
  title: string;
  subtitle?: string;
  selected?: boolean;
  meta?: React.ReactNode;
  onPress?: () => void;
};

export default function DshWltPaymentOption({ title, subtitle, selected, meta, onPress }: Props) {
  return <BthListItem title={title} subtitle={subtitle} meta={selected ? 'Selected' : meta == null ? undefined : String(meta)} onPress={onPress} />;
}
