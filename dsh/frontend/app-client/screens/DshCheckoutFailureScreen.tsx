import React from 'react';
import { StyleSheet } from 'react-native';

import {
  Box,
  Button,
  Surface,
  Text,
  TopBar,
  colorPalette,
  spacing,
  radius,
  StateView,
} from '@bthwani/ui-kit';

export type DshCheckoutFailureReason =
  | 'insufficient_balance'
  | 'policy_block'
  | 'fraud_hold'
  | 'expired'
  | 'unknown';

export type DshCheckoutFailureScreenProps = {
  state?: 'loading' | 'error' | 'retry' | 'cancelled';
  failureReason?: DshCheckoutFailureReason;
  cartPreserved?: boolean;
  onRetry?: () => void;
  onCancel?: () => void;
  onContactSupport?: () => void;
};

const FAILURE_REASON_LABELS: Record<DshCheckoutFailureReason, string> = {
  insufficient_balance: 'رصيد المحفظة غير كافٍ لإتمام الدفع.',
  policy_block: 'تم تعليق الدفع بسبب سياسة الأمان. يُرجى التواصل مع الدعم.',
  fraud_hold: 'تم تعليق الدفع لأسباب أمنية. يُرجى التواصل مع الدعم.',
  expired: 'انتهت صلاحية جلسة الدفع. يُرجى إعادة المحاولة.',
  unknown: 'تعذّر إتمام الدفع. يُرجى المحاولة مرة أخرى.',
};

export function DshCheckoutFailureScreen({
  state = 'error',
  failureReason = 'unknown',
  cartPreserved = true,
  onRetry,
  onCancel,
  onContactSupport,
}: DshCheckoutFailureScreenProps) {
  if (state === 'loading') {
    return (
      <Surface style={styles.root}>
        <TopBar title="فشل الدفع" />
        <StateView stateId="loading" title="جاري معالجة الطلب..." description="يُرجى الانتظار." />
      </Surface>
    );
  }

  if (state === 'cancelled') {
    return (
      <Surface style={styles.root}>
        <TopBar title="تم الإلغاء" />
        <StateView
          stateId="success"
          title="تم إلغاء عملية الدفع"
          description={cartPreserved ? 'تم الاحتفاظ بعناصر السلة. يمكنك المحاولة مرة أخرى في أي وقت.' : 'تم إلغاء العملية.'}
          actionLabel="العودة إلى السلة"
          onActionPress={onCancel}
        />
      </Surface>
    );
  }

  if (state === 'retry') {
    return (
      <Surface style={styles.root}>
        <TopBar title="فشل الدفع" />
        <StateView stateId="loading" title="جاري إعادة المحاولة..." description="نُعيد تهيئة جلسة الدفع." />
      </Surface>
    );
  }

  // state === 'error' (payment_failed)
  const message = FAILURE_REASON_LABELS[failureReason];

  return (
    <Surface style={styles.root}>
      <TopBar title="فشل الدفع" />
      <StateView
        stateId="error"
        title="تعذّر إتمام الدفع"
        description={message}
      />

      {cartPreserved && (
        <Box
          margin={spacing[4]}
          padding={spacing[4]}
          backgroundColor={colorPalette.lightSurface}
          borderRadius={radius.md}
        >
          <Text role="bodySm" style={styles.cartNotice}>
            تم الاحتفاظ بعناصر سلتك — يمكنك إعادة المحاولة دون إعادة الإضافة.
          </Text>
        </Box>
      )}

      <Box
        margin={spacing[4]}
        padding={spacing[4]}
        backgroundColor={colorPalette.lightSurface}
        borderRadius={radius.md}
      >
        <Text role="titleSm" style={styles.boundaryTitle}>حدود الدفع والاسترداد</Text>
        <Text role="bodySm" style={styles.boundaryBody}>
          قرار الدفع والاسترداد يبقى لدى WLT. هذه الشاشة تعرض سبب الفشل وخيارات الاسترداد فقط، ولا تنفّذ أي تعديل مالي.
        </Text>
      </Box>

      <Box padding={spacing[4]} style={styles.actions}>
        <Button label="إعادة المحاولة" tone="primary" onPress={onRetry} style={styles.button} />
        {(failureReason === 'policy_block' || failureReason === 'fraud_hold') && (
          <Button label="التواصل مع الدعم" tone="secondary" onPress={onContactSupport} style={styles.button} />
        )}
        <Button label="إلغاء والعودة للسلة" tone="ghost" onPress={onCancel} style={styles.button} />
      </Box>
    </Surface>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colorPalette.white,
  },
  cartNotice: {
    color: colorPalette.deepBlue,
    lineHeight: 20,
  },
  boundaryTitle: {
    color: colorPalette.deepBlue,
    marginBottom: spacing[1],
  },
  boundaryBody: {
    color: colorPalette.deepBlueLighter,
    lineHeight: 20,
  },
  actions: {
    gap: spacing[3],
  },
  button: {
    width: '100%',
  },
});
