'use client';

import React from 'react';
import { Box, Button, FormScreenShell, SectionHeader, Surface, Text, TextField } from '@bthwani/ui-kit';

export type DshSheinOrderCreateScreenState = 'ready' | 'loading' | 'disabled';

export type DshSheinOrderCreateScreenProps = {
  state?: DshSheinOrderCreateScreenState;
  embedded?: boolean;
  onClose?: () => void;
  onBack?: () => void;
};

export function DshSheinOrderCreateScreen({ state = 'ready', embedded = false, onClose, onBack }: DshSheinOrderCreateScreenProps) {
  const isDisabled = state !== 'ready';
  const [productUrl, setProductUrl] = React.useState('');
  const [quantity, setQuantity] = React.useState('1');
  const [sizeColor, setSizeColor] = React.useState('');
  const [alternates, setAlternates] = React.useState('');
  const [notes, setNotes] = React.useState('');
  const [submitted, setSubmitted] = React.useState(false);
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const handleSubmit = () => {
    const normalizedUrl = productUrl.trim();
    const normalizedQuantity = quantity.trim();

    if (!normalizedUrl) {
      setValidationError('أدخل رابط المنتج من SHEIN أولًا.');
      return;
    }

    if (!normalizedQuantity || Number.isNaN(Number(normalizedQuantity)) || Number(normalizedQuantity) < 1) {
      setValidationError('الكمية يجب أن تكون رقمًا يبدأ من 1.');
      return;
    }

    setValidationError(null);
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setValidationError(null);
    setProductUrl('');
    setQuantity('1');
    setSizeColor('');
    setAlternates('');
    setNotes('');
  };

  const proxyIntro = (
    <Surface tone="inset" gap={2}>
      <Text role="bodyStrong">كيف يعمل طلب SHEIN؟</Text>
      <Text role="bodySm" tone="muted">
        بثواني تشتري من SHEIN عبر حسابها الخاص، تجمّع الطلبات، تستقبلها، تفرزها، ثم تسلّمها إليك. المدة التقديرية قد تصل إلى 15 يومًا حسب توفر المنتج والدفعة.
      </Text>
      <Text role="caption" tone="muted">
        يحتاج طلبك مراجعة العمليات وموافقتهم قبل الشراء.
      </Text>
    </Surface>
  );

  const submittedContent = (
    <Box gap={3}>
      {proxyIntro}
      <Surface tone="success" gap={2}>
        <Text role="bodyStrong">قيد مراجعة رابط المنتج والتسعير</Text>
        <Text role="bodySm" tone="muted">
          تم استلام طلبك. سيراجع فريق العمليات الرابط والتسعير ويتواصل معك للموافقة قبل الشراء.
        </Text>
      </Surface>
      <Surface tone="raised" gap={2}>
        <Text role="bodySm" tone="muted">
          الخطوة التالية: انتظر تأكيد العمليات عبر الإشعارات قبل إتمام عملية الشراء.
        </Text>
      </Surface>
      <Button label="طلب جديد" tone="secondary" onPress={handleReset} />
    </Box>
  );

  if (submitted) {
    if (embedded) {
      return (
        <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 24, overflow: 'hidden' }}>
          <Box gap={1}>
            <Text role="titleSm">طلب شراء من SHEIN</Text>
          </Box>
          {onClose ? <Button label="إخفاء" tone="secondary" size="sm" fullWidth={false} onPress={onClose} /> : null}
          {submittedContent}
        </Surface>
      );
    }

    return (
      <FormScreenShell title="طلب شراء من SHEIN" subtitle="قيد مراجعة رابط المنتج والتسعير." submitLabel="طلب جديد" onSubmit={handleReset} submitDisabled={false}>
        {submittedContent}
      </FormScreenShell>
    );
  }

  const formFields = (
    <Box gap={3}>
      {proxyIntro}

      <TextField
        label="رابط المنتج"
        value={productUrl}
        onChangeText={(value) => {
          setProductUrl(value);
          setValidationError(null);
        }}
        editable={!isDisabled}
        placeholder="https://www.shein.com/..."
        hint="انسخ الرابط كما هو من صفحة المنتج."
        error={validationError ?? undefined}
      />

      <Box gap={3} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
        <Box style={{ flex: 1, minWidth: 160 }}>
          <TextField
            label="الكمية"
            value={quantity}
            onChangeText={(value) => {
              setQuantity(value);
              setValidationError(null);
            }}
            editable={!isDisabled}
            keyboardType="number-pad"
            placeholder="1"
          />
        </Box>
        <Box style={{ flex: 1, minWidth: 160 }}>
          <TextField
            label="المقاس / اللون"
            value={sizeColor}
            onChangeText={setSizeColor}
            editable={!isDisabled}
            placeholder="M - Black"
          />
        </Box>
      </Box>

      <Box gap={3}>
        <SectionHeader title="بدائل مقبولة" subtitle="إذا نفد المقاس أو اللون، ما البديل الذي تقبله؟" />
        <TextField
          value={alternates}
          onChangeText={setAlternates}
          editable={!isDisabled}
          placeholder="مثال: L مقبول، أو اللون الأزرق بديل"
          hint="اترك فارغًا إذا لم تقبل أي بديل."
        />
      </Box>

      <TextField
        label="ملاحظات إضافية"
        value={notes}
        onChangeText={setNotes}
        editable={!isDisabled}
        hint="أي تفاصيل تساعد فريق العمليات في إتمام الطلب."
        placeholder="أي تفاصيل تساعد فريق العمليات"
      />

      <Surface tone="inset" gap={2}>
        <Text role="bodySm" tone="muted">
          بإرسال هذا الطلب تقر بأن الشراء يحتاج موافقة مسبقة من العمليات وأن مدة التسليم قد تصل إلى 15 يومًا.
        </Text>
      </Surface>

      {validationError ? <Text role="bodySm" tone="muted">{validationError}</Text> : null}
    </Box>
  );

  if (embedded) {
    return (
      <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: 24, overflow: 'hidden' }}>
        <Box gap={1}>
          <Text role="titleSm">طلب شراء من SHEIN</Text>
          <Text role="bodySm" tone="muted">
            اطلب منتجًا من SHEIN وبثواني تتولى الشراء والتجميع والتسليم.
          </Text>
        </Box>

        {onClose ? <Button label="إخفاء" tone="secondary" size="sm" fullWidth={false} onPress={onClose} /> : null}

        <Box gap={3}>
          {formFields}
          <Button label="إرسال الطلب" tone="primary" onPress={handleSubmit} disabled={isDisabled} />
        </Box>
      </Surface>
    );
  }

  return (
    <FormScreenShell
      title="طلب شراء من SHEIN"
      subtitle="بثواني تشتري عبر حسابها وتسلّم إليك — المدة التقديرية حتى 15 يومًا."
      submitLabel="إرسال الطلب"
      onSubmit={handleSubmit}
      submitDisabled={isDisabled}
    >
      <Box gap={3}>
        {formFields}
      </Box>
    </FormScreenShell>
  );
}

export default DshSheinOrderCreateScreen;
