import React from 'react';
import { View, type StyleProp, type ViewStyle } from 'react-native';
import { useTheme } from '../hooks';

export type BthDividerProps = {
  style?: StyleProp<ViewStyle>;
};

export function BthDivider({ style }: BthDividerProps) {
  const { theme } = useTheme();
  return <View style={[{ height: 1, backgroundColor: theme.line, width: '100%' }, style]} />;
}
