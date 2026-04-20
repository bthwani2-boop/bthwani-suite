import React from 'react';
import { Modal, Pressable } from 'react-native';
import { BthBox, BthButton, BthFormScreenShell, BthSectionHeader, BthStateView, BthSurface, BthTabs, BthText, BthTextField } from '@bthwani/ui-kit';

export type DshAwnakOrderCreateScreenState = 'ready' | 'loading' | 'disabled';

export type DshAwnakOrderCreateScreenProps = {
  state?: DshAwnakOrderCreateScreenState;
  embedded?: boolean;
  onClose?: () => void;
  onBack?: () => void;
  onContinue?: () => void;
};

type AwnakOrderType = 'PERSONAL_ITEMS' | 'FOOD' | 'HEAVY_WEIGHT' | 'LARGE_SIZE' | 'CAKE' | 'FRAGILE' | 'OTHER';
type AwnakTimeMode = 'now' | 'scheduled';

type PricingEstimate = {
  priceEstimate: number;
  currency: string;
};

function calculateEstimate(orderType: AwnakOrderType): PricingEstimate {
  const base = 15;
  const multiplier: Record<AwnakOrderType, number> = {
    PERSONAL_ITEMS: 1,
    FOOD: 1.1,
    HEAVY_WEIGHT: 1.6,
    LARGE_SIZE: 1.5,
    CAKE: 1.3,
    FRAGILE: 1.4,
    OTHER: 1.2,
  };

  return {
    priceEstimate: Math.round(base * multiplier[orderType]),
    currency: 'YER',
  };
}

export function DshAwnakOrderCreateScreen({ state = 'ready', embedded = false, onClose, onBack, onContinue }: DshAwnakOrderCreateScreenProps) {
  const isDisabled = state === 'disabled';
  const [pickupAddress, setPickupAddress] = React.useState('Sanaa Hadda Street');
  const [dropoffAddress, setDropoffAddress] = React.useState('Sanaa Bab Al-Yemen');
  const [orderType, setOrderType] = React.useState<AwnakOrderType>('PERSONAL_ITEMS');
  const [timeMode, setTimeMode] = React.useState<AwnakTimeMode>('now');
  const [scheduledDate, setScheduledDate] = React.useState('');
  const [scheduledTime, setScheduledTime] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const submitLabel = 'عرض الفاتورة';

  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  const validate = () => {
    const normalizedPickup = pickupAddress.trim();
    const normalizedDropoff = dropoffAddress.trim();

    if (!normalizedPickup || !normalizedDropoff) {
      setValidationError('حدد موقع البداية وموقع الوصول أولًا.');
      return false;
    }

    if (timeMode === 'scheduled' && (!scheduledDate.trim() || !scheduledTime.trim())) {
      setValidationError('اختر التاريخ والوقت عند تحديد تنفيذ لاحق.');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleSubmit = () => {
    if (!validate()) {
      return;
    }

    onContinue?.();
  };

  const formFields = (
    <BthBox gap={3}>
      <BthBox gap={2}>
        <BthSectionHeader title="المسار" subtitle="اختر من أين وإلى أين، ثم أكمل بقية التفاصيل." />
        <BthBox gap={2} layoutDirection="row" style={{ alignItems: 'center' }}>
          <BthBox style={{ flex: 1 }}>
            <Pressable onPress={() => setValidationError('Use the address field below to edit this location.')} disabled={isDisabled}>
              <BthSurface tone="raised" gap={2}>
                <BthText role="bodySm" tone="muted">من عنوان</BthText>
                <BthText role="bodyStrong">حدد الموقع</BthText>
              </BthSurface>
            </Pressable>
            <BthTextField value={pickupAddress} onChangeText={setPickupAddress} editable={!isDisabled} placeholder="حدد الموقع" />
          </BthBox>

          <BthBox style={{ width: 42, alignItems: 'center', justifyContent: 'center' }}>
            <BthSurface tone="raised" gap={0}>
              <BthText role="titleSm">⇄</BthText>
            </BthSurface>
          </BthBox>

          <BthBox style={{ flex: 1 }}>
            <Pressable onPress={() => setValidationError('Use the address field below to edit this location.')} disabled={isDisabled}>
              <BthSurface tone="raised" gap={2}>
                <BthText role="bodySm" tone="muted">إلى عنوان</BthText>
                <BthText role="bodyStrong">حدد الموقع</BthText>
              </BthSurface>
            </Pressable>
            <BthTextField value={dropoffAddress} onChangeText={setDropoffAddress} editable={!isDisabled} placeholder="حدد الموقع" />
          </BthBox>
        </BthBox>
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="نوع الطلب" subtitle="اختر التصنيف المناسب لهذا الطلب." />
        <BthTabs
          items={[
            { value: 'PERSONAL_ITEMS', label: 'أغراض شخصية' },
            { value: 'FOOD', label: 'طعام' },
            { value: 'HEAVY_WEIGHT', label: 'وزن ثقيل' },
            { value: 'LARGE_SIZE', label: 'حجم كبير' },
            { value: 'CAKE', label: 'قابل للكسر' },
            { value: 'FRAGILE', label: 'تورته' },
            { value: 'OTHER', label: 'أشياء أخرى' },
          ]}
          value={orderType}
          onValueChange={(value) => setOrderType(value as AwnakOrderType)}
          variant="pill"
        />
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="وقت تنفيذ الطلب" subtitle="اختر التنفيذ الآن أو لاحقًا." />
        <BthTabs
          items={[
            { value: 'now', label: 'الآن' },
            { value: 'scheduled', label: 'لاحقًا' },
          ]}
          value={timeMode}
          onValueChange={(value) => setTimeMode(value as AwnakTimeMode)}
          variant="pill"
        />
        {timeMode === 'scheduled' ? (
          <BthBox gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
            <BthBox style={{ flex: 1, minWidth: 150 }}>
              <BthTextField label="Date" value={scheduledDate} onChangeText={setScheduledDate} editable={!isDisabled} placeholder="YYYY-MM-DD" />
            </BthBox>
            <BthBox style={{ flex: 1, minWidth: 150 }}>
              <BthTextField label="Time" value={scheduledTime} onChangeText={setScheduledTime} editable={!isDisabled} placeholder="HH:MM" />
            </BthBox>
          </BthBox>
        ) : null}
      </BthBox>

      <BthBox gap={3}>
        <BthSectionHeader title="ملاحظات الطلب" subtitle="اكتب ملاحظاتك بشكل مختصر وواضح." />
        <BthTextField label="Order note" value={notes} onChangeText={setNotes} editable={!isDisabled} placeholder="اكتب ملاحظاتك هنا" />
      </BthBox>

      {validationError ? <BthText role="bodySm" tone="muted">{validationError}</BthText> : null}
    </BthBox>
  );

  if (embedded) {
    return (
      <Modal visible transparent animationType="slide" onRequestClose={onClose}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(15, 23, 42, 0.42)', justifyContent: 'flex-end' }} onPress={onClose}>
          <Pressable
            onPress={(event) => event.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 28,
              borderTopRightRadius: 28,
              paddingHorizontal: 18,
              paddingTop: 14,
              paddingBottom: 18,
              maxHeight: '88%',
              shadowColor: '#000',
              shadowOpacity: 0.16,
              shadowRadius: 24,
              shadowOffset: { width: 0, height: -6 },
              elevation: 18,
            }}
          >
            <BthBox gap={2}>
              <BthBox style={{ alignSelf: 'center', width: 54, height: 5, borderRadius: 999, backgroundColor: '#D6DDE8' }} />
              <BthBox gap={1}>
                <BthText role="titleSm">طلب عونك</BthText>
                <BthText role="bodySm" tone="muted">
                  نفس أسلوب SHEIN: داخل نفس الصفحة ولوح سفلي خفيف.
                </BthText>
              </BthBox>
            </BthBox>

            <BthBox gap={2}>
              <BthSurface tone="brand" gap={2}>
                <BthText role="bodyStrong">DSH</BthText>
                <BthText role="bodySm" tone="muted">طلب يدوي مباشر بدون تغيير الصفحة.</BthText>
                <BthText role="bodySm" tone="muted">المطلوب واضح: المسار، نوع الطلب، وقت التنفيذ، والملاحظات.</BthText>
              </BthSurface>

              {formFields}

              <BthButton label={submitLabel} tone="primary" onPress={handleSubmit} disabled={isDisabled} />
            </BthBox>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return (
    <BthFormScreenShell
      title="طلب عونك"
      subtitle="اطلب سائق لتوصيل أي غرض من مكان إلى مكان مع تحديد نوع الطلب ووقت التنفيذ."
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      submitDisabled={isDisabled}
    >
      <BthBox gap={3}>
        {formFields}
        <BthButton label={submitLabel} tone="primary" onPress={handleSubmit} disabled={isDisabled} />
      </BthBox>
    </BthFormScreenShell>
  );
}

export default DshAwnakOrderCreateScreen;

