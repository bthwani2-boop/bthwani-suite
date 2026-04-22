import React from 'react';
import { StyleSheet, Text, TextInput, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { bthColors, bthRadius, bthSpacing } from '../foundation';

export type BthFieldProps = {
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function BthField({ label, hint, error, children, style }: BthFieldProps) {
  return (
    <View style={[styles.field, style]}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {!error && hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
}

export type BthInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder?: string;
  hint?: string;
  error?: string;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
};

export function BthInput({ label, value, onChangeText, placeholder, hint, error, style, inputStyle }: BthInputProps) {
  return (
    <BthField label={label} hint={hint} error={error} style={style}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={bthColors.text.muted}
        style={[styles.input, inputStyle]}
      />
    </BthField>
  );
}

export const BthTextInput = BthInput;

const styles = StyleSheet.create({
  field: {
    gap: bthSpacing.xs,
  },
  label: {
    color: bthColors.text.strong,
    fontSize: 14,
    fontWeight: '800',
  },
  input: {
    backgroundColor: bthColors.surface.card,
    borderColor: bthColors.line.soft,
    borderRadius: bthRadius.lg,
    borderWidth: 1,
    color: bthColors.text.strong,
    fontSize: 14,
    minHeight: 44,
    paddingHorizontal: bthSpacing.md,
  },
  hint: {
    color: bthColors.text.muted,
    fontSize: 12,
  },
  error: {
    color: bthColors.state.danger,
    fontSize: 12,
    fontWeight: '700',
  },
});
