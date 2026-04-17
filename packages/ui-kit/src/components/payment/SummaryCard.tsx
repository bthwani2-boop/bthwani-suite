import React from 'react';
import { View } from 'react-native';
import { BthCard } from '../display/BthCard';
import { BthKeyValueList } from '../display/BthKeyValueList';

export type SummaryItem = { label: string; value: React.ReactNode; helper?: string };

export type SummaryCardProps = {
  items: SummaryItem[];
  totalLabel?: string;
  totalValue?: React.ReactNode;
};

export const SummaryCard: React.FC<SummaryCardProps> = ({ items, totalLabel = 'Total', totalValue }) => {
  return (
    <BthCard>
      <BthKeyValueList items={items.map((it) => ({ label: it.label, value: it.value, helperText: it.helper }))} />
      {totalValue ? (
        <View style={{ marginTop: 12 }} />
      ) : null}
      {totalValue ? (
        <BthKeyValueList items={[{ label: totalLabel, value: totalValue }]} dense />
      ) : null}
    </BthCard>
  );
};

export default SummaryCard;
