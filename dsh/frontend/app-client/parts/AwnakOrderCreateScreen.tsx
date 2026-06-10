import React from 'react';
import { Pressable } from 'react-native';
import { Box, Button, FormScreenShell, SectionHeader, StateView, Surface, Tabs, Text, TextField,
  radius,
} from '@bthwani/ui-kit';

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

export function DshAwnakOrderCreateScreen({ state = 'ready', embedded = false, onClose, onBack, onContinue }: DshAwnakOrderCreateScreenProps) {
  const isDisabled = state === 'disabled';
  const [pickupAddress, setPickupAddress] = React.useState('صنعاء - شارع حدة');
  const [dropoffAddress, setDropoffAddress] = React.useState('صنعاء - باب اليمن');
  const [orderType, setOrderType] = React.useState<AwnakOrderType>('PERSONAL_ITEMS');
  const [timeMode, setTimeMode] = React.useState<AwnakTimeMode>('now');
  const [scheduledDate, setScheduledDate] = React.useState('');
  const [scheduledTime, setScheduledTime] = React.useState('');
  const [captainNotes, setCaptainNotes] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);
  const [submitted, setSubmitted] = React.useState(false);

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

    setSubmitted(true);
    onContinue?.();
  };

  const handleReset = () => {
    setSubmitted(false);
    setValidationError(null);
    setPickupAddress('صنعاء - شارع حدة');
    setDropoffAddress('صنعاء - باب اليمن');
    setOrderType('PERSONAL_ITEMS');
    setTimeMode('now');
    setScheduledDate('');
    setScheduledTime('');
    setCaptainNotes('');
  };

  if (submitted) {
    const submittedContent = (
      <Box gap={3}>
        <Surface tone="success" gap={2}>
          <Text role="bodyStrong">قيد مراجعة العمليات</Text>
          <Text role="bodySm" tone="muted">
            تم استلام طلبك. سيراجع فريق العمليات التفاصيل ويتواصل معك لتأكيد السعر وتحديد الكابتن المناسب.
          </Text>
        </Surface>
        <Surface tone="raised" gap={2}>
          <Text role="bodySm" tone="muted">
            الخطوة التالية: انتظر تأكيد العمليات عبر الإشعارات أو التواصل المباشر.
          </Text>
        </Surface>
        <Button label="طلب جديد" tone="secondary" onPress={handleReset} />
      </Box>
    );

    if (embedded) {
      return (
        <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
          <Box gap={1}>
            <Text role="titleSm">طلب عونك</Text>
          </Box>
          {onClose ? <Button label="إخفاء" tone="secondary" size="sm" fullWidth={false} onPress={onClose} /> : null}
          {submittedContent}
        </Surface>
      );
    }

    return (
      <FormScreenShell title="طلب عونك" subtitle="تم إرسال طلبك بنجاح." submitLabel="طلب جديد" onSubmit={handleReset} submitDisabled={false}>
        {submittedContent}
      </FormScreenShell>
    );
  }

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
            { value: 'CAKE', label: 'تورتة' },
            { value: 'FRAGILE', label: 'قابل للكسر' },
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
        <SectionHeader title="ملاحظات للكابتن" subtitle="أي تفاصيل تساعد الكابتن أو فريق العمليات." />
        <TextField
          label="ملاحظة"
          value={captainNotes}
          onChangeText={setCaptainNotes}
          editable={!isDisabled}
          placeholder="مثال: الغرض هش، أو التسليم للحارس في البوابة"
        />
      </Box>

      <Surface tone="inset" gap={2}>
        <Text role="bodySm" tone="muted">
          سيراجع فريق العمليات طلبك ويتواصل معك لتأكيد السعر والكابتن قبل التنفيذ.
        </Text>
      </Surface>

      {validationError ? <Text role="bodySm" tone="muted">{validationError}</Text> : null}
    </Box>
  );

  if (embedded) {
    return (
      <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: radius.xl, overflow: 'hidden' }}>
        <Box gap={1}>
          <Text role="titleSm">طلب عونك</Text>
          <Text role="bodySm" tone="muted">
            اطلب سائقًا ينقل أغراضك بين موقعين داخل المدينة.
          </Text>
        </Box>

        {onClose ? <Button label="إخفاء" tone="secondary" size="sm" fullWidth={false} onPress={onClose} /> : null}

        <Box gap={2}>
          {formFields}
          <Button label="إرسال الطلب" tone="primary" onPress={handleSubmit} disabled={isDisabled} />
        </Box>
      </Surface>
    );
  }

  return (
    <FormScreenShell
      title="طلب عونك"
      subtitle="اطلب سائقًا لتوصيل أي غرض من مكان إلى مكان مع تحديد نوع الطلب ووقت التنفيذ."
      submitLabel="إرسال الطلب"
      onSubmit={handleSubmit}
      submitDisabled={isDisabled}
    >
      <Box gap={3}>
        {formFields}
        <Button label="إرسال الطلب" tone="primary" onPress={handleSubmit} disabled={isDisabled} />
      </Box>
    </FormScreenShell>
  );
}

export default DshAwnakOrderCreateScreen;
