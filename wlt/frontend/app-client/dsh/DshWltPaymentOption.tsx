import React from 'react';
import { ListItem } from '@bthwani/ui-kit';

type Props = {
  title: string;
  subtitle?: string;
  selected?: boolean;
  meta?: string;
  onPress?: () => void;
};

export default function DshWltPaymentOption({ title, subtitle, selected, meta, onPress }: Props) {
  return <ListItem title={title} subtitle={subtitle} meta={selected ? 'محدد' : meta} onPress={onPress} />;
}
