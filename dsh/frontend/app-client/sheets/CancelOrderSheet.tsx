// ML-007: Client order cancellation sheet skeleton
// TODO: wire to CG-009 (POST /dsh/orders/:orderId/cancel) once contract is proven
// NOTE: if refund applies, WLT owns the refund flow — DSH only triggers the cancellation
import React from 'react';
import {
  Box,
  Button,
  SheetFrame,
  StateView,
  Text,
} from '@bthwani/ui-kit';

type CancelReason =
  | 'changed_mind'
  | 'wrong_address'
  | 'taking_too_long'
  | 'found_alternative'
  | 'other';

const cancelReasons: ReadonlyArray<{ id: CancelReason; label: string }> = [
  { id: 'changed_mind', label: 'غيّرت رأيي' },
  { id: 'wrong_address', label: 'العنوان خاطئ' },
  { id: 'taking_too_long', label: 'التوصيل يستغرق وقتاً طويلاً' },
  { id: 'found_alternative', label: 'وجدت بديلاً' },
  { id: 'other', label: 'سبب آخر' },
];

export type CancelOrderSheetProps = {
  visible?: boolean;
  orderId?: string;
  state?: 'ready' | 'loading' | 'success' | 'error';
  onSelectReason?: (reason: CancelReason) => void;
  onConfirmCancel?: (reason: CancelReason) => void;
  onClose?: () => void;
};

export function CancelOrderSheet({
  visible = false,
  orderId: _orderId,
  state = 'ready',
  onSelectReason,
  onConfirmCancel,
  onClose,
}: CancelOrderSheetProps) {
  const [selectedReason, setSelectedReason] = React.useState<CancelReason | null>(null);

  function handleSelect(reason: CancelReason) {
    setSelectedReason(reason);
    onSelectReason?.(reason);
  }

  return (
    <SheetFrame visible={visible} title="إلغاء الطلب" onClose={onClose}>
      {state === 'loading' ? (
        <StateView stateId="loading" title="جاري إلغاء الطلب..." description="يُرجى الانتظار." />
      ) : state === 'success' ? (
        <StateView stateId="success" title="تم إلغاء الطلب" description="سيتم معالجة الاسترداد إن وجد من خلال المحفظة." actionLabel="حسناً" onActionPress={onClose} />
      ) : state === 'error' ? (
        <StateView stateId="error" title="فشل الإلغاء" description="لا يمكن إلغاء الطلب الآن. يُرجى التواصل مع الدعم." actionLabel="إغلاق" onActionPress={onClose} />
      ) : (
        <Box gap={4} padding={4}>
          <Text role="bodyMd" tone="muted">اختر سبب الإلغاء:</Text>
          <Box gap={2}>
            {cancelReasons.map((reason) => (
              <Button
                key={reason.id}
                label={reason.label}
                tone={selectedReason === reason.id ? 'primary' : 'secondary'}
                onPress={() => handleSelect(reason.id)}
              />
            ))}
          </Box>
          <Button
            label="تأكيد الإلغاء"
            tone="danger"
            disabled={!selectedReason}
            onPress={() => selectedReason && onConfirmCancel?.(selectedReason)}
          />
        </Box>
      )}
    </SheetFrame>
  );
}

export default CancelOrderSheet;
