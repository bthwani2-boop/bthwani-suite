// ML-024: Captain offer decline sheet skeleton — reason collection triggers reassignment signal
// BLOCKED_BY_CONTRACT: wire to CG-015 (POST /dsh/captain/offers/:offerId/decline) once contract proven
import React from 'react';
import {
  Box,
  Button,
  SheetFrame,
  StateView,
  Text,
} from '@bthwani/ui-kit';

type DeclineReason =
  | 'too_far'
  | 'vehicle_issue'
  | 'already_on_delivery'
  | 'personal_reason'
  | 'other';

const declineReasons: ReadonlyArray<{ id: DeclineReason; label: string }> = [
  { id: 'too_far', label: 'المسافة بعيدة جداً' },
  { id: 'vehicle_issue', label: 'مشكلة في المركبة' },
  { id: 'already_on_delivery', label: 'أنا في توصيلة أخرى' },
  { id: 'personal_reason', label: 'سبب شخصي' },
  { id: 'other', label: 'سبب آخر' },
];

export type OfferDeclineSheetProps = {
  visible?: boolean;
  offerId?: string;
  state?: 'ready' | 'loading' | 'success' | 'error';
  onSelectReason?: (reason: DeclineReason) => void;
  onConfirmDecline?: (offerId: string, reason: DeclineReason) => void;
  onClose?: () => void;
};

export function OfferDeclineSheet({
  visible = false,
  offerId = '',
  state = 'ready',
  onSelectReason,
  onConfirmDecline,
  onClose,
}: OfferDeclineSheetProps) {
  const [selectedReason, setSelectedReason] = React.useState<DeclineReason | null>(null);

  function handleSelect(reason: DeclineReason) {
    setSelectedReason(reason);
    onSelectReason?.(reason);
  }

  return (
    <SheetFrame visible={visible} title="رفض العرض" onClose={onClose ?? (() => {})}>
      {state === 'loading' ? (
        <StateView stateId="loading" title="جاري تسجيل الرفض..." description="" />
      ) : state === 'success' ? (
        <StateView stateId="success" title="تم رفض العرض" description="سيتم إعادة توجيه العرض لكابتن آخر." actionLabel="إغلاق" onActionPress={onClose} />
      ) : state === 'error' ? (
        <StateView stateId="blockingError" title="فشل الرفض" description="يُرجى المحاولة مرة أخرى." actionLabel="إغلاق" onActionPress={onClose} />
      ) : (
        <Box gap={4} padding={4}>
          <Text role="bodyMd" tone="muted">لماذا تريد رفض هذا العرض؟</Text>
          <Box gap={2}>
            {declineReasons.map((reason) => (
              <Button
                key={reason.id}
                label={reason.label}
                tone={selectedReason === reason.id ? 'primary' : 'secondary'}
                onPress={() => handleSelect(reason.id)}
              />
            ))}
          </Box>
          <Button
            label="تأكيد الرفض"
            tone="danger"
            disabled={!selectedReason}
            onPress={() => selectedReason && onConfirmDecline?.(offerId, selectedReason)}
          />
        </Box>
      )}
    </SheetFrame>
  );
}

export default OfferDeclineSheet;
