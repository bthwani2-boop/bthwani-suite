import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { BthText } from '../../primitives';
import { spacing, radius } from '../../foundation/tokens';

export type QuickAmountGridProps = {
  amounts: number[];
  onSelect: (n: number) => void;
  selected?: number;
};

export const QuickAmountGrid: React.FC<QuickAmountGridProps> = ({ amounts, onSelect, selected }) => {
  return (
    <View style={styles.grid}>
      {amounts.map((a) => (
        <Pressable key={a} onPress={() => onSelect(a)} style={({ pressed }) => [styles.btn, pressed && styles.btnPressed, selected === a && styles.btnSelected]}>
          <BthText role="bodyStrong">{String(a)}</BthText>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: spacing[3], paddingHorizontal: spacing[4], marginTop: spacing[3] },
  btn: { width: '30%', backgroundColor: 'transparent', padding: spacing[3], borderRadius: radius.md, alignItems: 'center', borderWidth: 1, borderColor: '#E6E6E6' },
  btnPressed: { opacity: 0.85 },
  btnSelected: { backgroundColor: '#F3F6FB', borderColor: '#DDE7FB' }
});

export default QuickAmountGrid;
