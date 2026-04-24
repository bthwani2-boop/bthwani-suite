import React from 'react';
import { ListItem } from '@bthwani/ui-kit';

type Props = {
  title: string;
  subtitle?: string;
  selected?: boolean;
  meta?: React.ReactNode;
  onPress?: () => void;
};

export default function DshWltPaymentOption({ title, subtitle, selected, meta, onPress }: Props) {
  return <ListItem title={title} subtitle={subtitle} meta={selected ? 'Selected' : (meta as any)} onPress={onPress} />;
}
