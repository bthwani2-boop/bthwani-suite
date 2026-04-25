'use client';

import React from 'react';
import { Modal, Pressable } from 'react-native';
import { Box, Button, FormScreenShell, Surface, Text, TextField } from '@bthwani/ui-kit';

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

  const formFields = (
    <Box gap={3}>
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

      <TextField
        label="ملاحظات إضافية"
        value={notes}
        onChangeText={setNotes}
        editable={!isDisabled}
        hint="مثال: أولوية للون نفسه، أو بديل مقبول إذا نفد المقاس."
        placeholder="أي تفاصيل تساعد فريق العمليات"
      />

      {submitted ? (
        <Surface tone="success" gap={2}>
          <Text role="bodyStrong">تم تسجيل الطلب</Text>
          <Text role="bodySm" tone="muted">
            ستراجع العمليات الطلب ثم تضيفه إلى مسار الشراء والتجميع المناسب.
          </Text>
        </Surface>
      ) : null}

      {validationError ? <Text role="bodySm" tone="muted">{validationError}</Text> : null}

      {!embedded && onBack ? <Button label="العودة" tone="secondary" onPress={onBack} /> : null}
    </Box>
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
            <Box gap={2}>
              <Box style={{ alignSelf: 'center', width: 54, height: 5, borderRadius: 999, backgroundColor: '#D6DDE8' }} />
              <Box gap={1}>
                <Text role="titleSm">طلب شراء من SHEIN</Text>
                <Text role="bodySm" tone="muted">
                  لوح سفلي مختصر للطلب اليدوي، داخل نفس الصفحة.
                </Text>
              </Box>
            </Box>

            <Box gap={2}>
              {formFields}

              <Button label={submitted ? 'تم التسجيل' : 'إرسال الطلب'} tone="primary" onPress={handleSubmit} disabled={isDisabled} />
            </Box>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return (
    <FormScreenShell
      title="طلب شراء من SHEIN"
      subtitle="استمارة مباشرة وسهلة للعميل. أدخل الرابط والكمية والمقاس أو اللون والملاحظات ثم أرسل الطلب للعمليات."
      submitLabel={submitted ? 'تم تسجيل الطلب' : 'إرسال الطلب'}
      onSubmit={handleSubmit}
      submitDisabled={isDisabled}
    >
      <Box gap={3}>
        <Surface tone="brand" gap={2}>
          <Text role="bodyStrong">SHEIN</Text>
          <Text role="bodySm" tone="muted">طلب مباشر داخل نفس الصفحة.</Text>
        </Surface>

        {formFields}
      </Box>
    </FormScreenShell>
  );
}

export default DshSheinOrderCreateScreen;
