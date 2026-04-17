import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BthTextField } from '../fields';
import { BthText } from '../../primitives';
import { spacing, radius, borders } from '../../foundation/tokens';

export type AmountInputProps = {
  value: string;
  onChange: (v: string) => void;
  label?: string;
  placeholder?: string;
  currencyLabel?: string;
};

export const AmountInput: React.FC<AmountInputProps> = ({ value, onChange, label, placeholder = '0.00', currencyLabel }) => {
  return (
    <View style={{ gap: spacing[2] }}>
      {label ? <BthText role="label">{label}</BthText> : null}
      <View style={styles.row}>
        <BthTextField
          value={value}
          onChangeText={(t) => onChange(t.replace(/[^0-9.]/g, ''))}
          placeholder={placeholder}
          style={styles.input}
        />
      </View>
      {currencyLabel ? <BthText role="caption" tone="muted">{currencyLabel}</BthText> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    minWidth: 120
  }
});

export default AmountInput;
