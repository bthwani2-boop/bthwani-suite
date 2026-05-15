// ML-016: Partner acceptance timer/countdown sheet skeleton
// BLOCKED_BY_CONTRACT: tie countdown to CG-021 (GET /dsh/partner/orders/:orderId) acceptance_window_seconds field
import React from 'react';
import {
  Box,
  Button,
  SheetFrame,
  StateView,
  Text,
} from '@bthwani/ui-kit';

export type AcceptanceTimerSheetProps = {
  visible?: boolean;
  orderId?: string;
  secondsRemaining?: number;
  orderSummary?: string;
  state?: 'countdown' | 'expired' | 'accepted' | 'loading';
  onAccept?: (orderId: string) => void;
  onDecline?: (orderId: string) => void;
  onClose?: () => void;
};

export function AcceptanceTimerSheet({
  visible = false,
  orderId = '',
  secondsRemaining = 60,
  orderSummary = 'طلب جديد',
  state = 'countdown',
  onAccept,
  onDecline,
  onClose,
}: AcceptanceTimerSheetProps) {
  const [remaining, setRemaining] = React.useState(secondsRemaining);

  React.useEffect(() => {
    if (state !== 'countdown' || remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [state, remaining]);

  React.useEffect(() => {
    setRemaining(secondsRemaining);
  }, [secondsRemaining, visible]);

  const isExpired = state === 'expired' || (state === 'countdown' && remaining <= 0);

  return (
    <SheetFrame visible={visible} title="طلب جديد يحتاج قبولك" onClose={onClose}>
      {state === 'loading' ? (
        <StateView stateId="loading" title="جاري تسجيل ردك..." description="" />
      ) : state === 'accepted' ? (
        <StateView stateId="success" title="تم قبول الطلب" description="يرجى الاستعداد لبدء التحضير." actionLabel="إغلاق" onActionPress={onClose} />
      ) : isExpired ? (
        <StateView stateId="empty" title="انتهت مهلة القبول" description="انتهت مهلة قبول الطلب. تم إعادة توجيهه تلقائياً." actionLabel="إغلاق" onActionPress={onClose} />
      ) : (
        <Box gap={4} padding={4}>
          <Box gap={1}>
            <Text role="titleMd">{orderSummary}</Text>
            <Text role="bodyMd" tone="muted">يُرجى القبول أو الرفض قبل:</Text>
            <Text role="titleLg" tone="brand" style={{ fontSize: 48, textAlign: 'center' }}>{remaining}s</Text>
          </Box>
          <Box gap={2}>
            <Button label="قبول الطلب" tone="primary" onPress={() => onAccept?.(orderId)} />
            <Button label="رفض الطلب" tone="danger" onPress={() => onDecline?.(orderId)} />
          </Box>
        </Box>
      )}
    </SheetFrame>
  );
}

export default AcceptanceTimerSheet;
