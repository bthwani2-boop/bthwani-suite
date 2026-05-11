import React from 'react';
import { Pressable } from 'react-native';
import { Box, Button, FormScreenShell, SectionHeader, StateView, Surface, Tabs, Text, TextField } from '@bthwani/ui-kit';

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
  const [pickupAddress, setPickupAddress] = React.useState('صنعاء - شارع حدة');
  const [dropoffAddress, setDropoffAddress] = React.useState('صنعاء - باب اليمن');
  const [orderType, setOrderType] = React.useState<AwnakOrderType>('PERSONAL_ITEMS');
  const [timeMode, setTimeMode] = React.useState<AwnakTimeMode>('now');
  const [scheduledDate, setScheduledDate] = React.useState('');
  const [scheduledTime, setScheduledTime] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const submitLabel = 'عرض الفاتورة';

  if (state === 'loading') {
    return <StateView stateId="loading" />;
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
    <Box gap={3}>
      <Box gap={2}>
        <SectionHeader title="المسار" subtitle="اختر من أين وإلى أين، ثم أكمل بقية التفاصيل." />
        <Box gap={2} layoutDirection="row" style={{ alignItems: 'center' }}>
          <Box style={{ flex: 1 }}>
            <Pressable onPress={() => setValidationError('استخدم حقل العنوان أدناه لتعديل هذا الموقع.')} disabled={isDisabled}>
              <Surface tone="raised" gap={2}>
                <Text role="bodySm" tone="muted">من عنوان</Text>
                <Text role="bodyStrong">حدد الموقع</Text>
              </Surface>
            </Pressable>
            <TextField value={pickupAddress} onChangeText={setPickupAddress} editable={!isDisabled} placeholder="حدد الموقع" />
          </Box>

          <Box style={{ width: 42, alignItems: 'center', justifyContent: 'center' }}>
            <Surface tone="raised" gap={0}>
              <Text role="titleSm">⇄</Text>
            </Surface>
          </Box>

          <Box style={{ flex: 1 }}>
            <Pressable onPress={() => setValidationError('استخدم حقل العنوان أدناه لتعديل هذا الموقع.')} disabled={isDisabled}>
              <Surface tone="raised" gap={2}>
                <Text role="bodySm" tone="muted">إلى عنوان</Text>
                <Text role="bodyStrong">حدد الموقع</Text>
              </Surface>
            </Pressable>
            <TextField value={dropoffAddress} onChangeText={setDropoffAddress} editable={!isDisabled} placeholder="حدد الموقع" />
          </Box>
        </Box>
      </Box>

      <Box gap={3}>
        <SectionHeader title="نوع الطلب" subtitle="اختر التصنيف المناسب لهذا الطلب." />
        <Tabs
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
      </Box>

      <Box gap={3}>
        <SectionHeader title="وقت تنفيذ الطلب" subtitle="اختر التنفيذ الآن أو لاحقًا." />
        <Tabs
          items={[
            { value: 'now', label: 'الآن' },
            { value: 'scheduled', label: 'لاحقًا' },
          ]}
          value={timeMode}
          onValueChange={(value) => setTimeMode(value as AwnakTimeMode)}
          variant="pill"
        />
        {timeMode === 'scheduled' ? (
          <Box gap={2} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
            <Box style={{ flex: 1, minWidth: 150 }}>
              <TextField label="التاريخ" value={scheduledDate} onChangeText={setScheduledDate} editable={!isDisabled} placeholder="YYYY-MM-DD" />
            </Box>
            <Box style={{ flex: 1, minWidth: 150 }}>
              <TextField label="الوقت" value={scheduledTime} onChangeText={setScheduledTime} editable={!isDisabled} placeholder="HH:MM" />
            </Box>
          </Box>
        ) : null}
      </Box>

      <Box gap={3}>
        <SectionHeader title="ملاحظات الطلب" subtitle="اكتب ملاحظاتك بشكل مختصر وواضح." />
        <TextField label="ملاحظة الطلب" value={notes} onChangeText={setNotes} editable={!isDisabled} placeholder="اكتب ملاحظاتك هنا" />
      </Box>

      {validationError ? <Text role="bodySm" tone="muted">{validationError}</Text> : null}
    </Box>
  );

  if (embedded) {
    return (
      <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 24, overflow: 'hidden' }}>
        <Box gap={1}>
          <Text role="titleSm">طلب عونك</Text>
          <Text role="bodySm" tone="muted">
            نموذج يدوي داخل نفس الصفحة بدون bottom sheet.
          </Text>
        </Box>

        {onClose ? <Button label="إخفاء" tone="secondary" size="sm" fullWidth={false} onPress={onClose} /> : null}

        <Box gap={2}>
          {formFields}

          <Button label={submitLabel} tone="primary" onPress={handleSubmit} disabled={isDisabled} />
        </Box>
      </Surface>
    );
  }

  return (
    <FormScreenShell
      title="طلب عونك"
      subtitle="اطلب سائق لتوصيل أي غرض من مكان إلى مكان مع تحديد نوع الطلب ووقت التنفيذ."
      submitLabel={submitLabel}
      onSubmit={handleSubmit}
      submitDisabled={isDisabled}
    >
      <Box gap={3}>
        {formFields}
        <Button label={submitLabel} tone="primary" onPress={handleSubmit} disabled={isDisabled} />
      </Box>
    </FormScreenShell>
  );
}

export default DshAwnakOrderCreateScreen;
