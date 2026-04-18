import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { spacing } from '../../foundation/tokens';
import { BthBox } from '../../primitives';
import { BthButton } from '../actions/BthButton';

export type ScreenState = 'content' | 'loading' | 'success' | 'error';

export type ScreenWrapperProps = {
  state?: ScreenState;
  loadingMessage?: string;
  successMessage?: string;
  onSuccessAction?: () => void;
  children?: React.ReactNode;
};

export function ScreenWrapper({ state = 'content', loadingMessage, successMessage, onSuccessAction, children }: ScreenWrapperProps) {
  if (state === 'loading') {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        {loadingMessage ? <Text style={styles.message}>{loadingMessage}</Text> : null}
      </View>
    );
  }

  if (state === 'success') {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>{successMessage ?? 'Success'}</Text>
        {onSuccessAction ? <BthButton label="OK" onPress={onSuccessAction} /> : null}
      </View>
    );
  }

  if (state === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>حدث خطأ، الرجاء المحاولة لاحقًا</Text>
        {children}
      </View>
    );
  }

  return <>{children}</>;
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing[4] },
  message: { marginTop: spacing[3], textAlign: 'center' },
});

export default ScreenWrapper;
