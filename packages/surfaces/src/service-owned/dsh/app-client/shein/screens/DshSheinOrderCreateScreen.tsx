'use client';

import React from 'react';
import { Modal, Pressable } from 'react-native';
import { BthBox, BthButton, BthFormScreenShell, BthSurface, BthText, BthTextField } from '@bthwani/ui-kit';

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
    <BthBox gap={3}>
      <BthTextField
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

      <BthBox gap={3} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
        <BthBox style={{ flex: 1, minWidth: 160 }}>
          <BthTextField
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
        </BthBox>
        <BthBox style={{ flex: 1, minWidth: 160 }}>
          <BthTextField
            label="المقاس / اللون"
            value={sizeColor}
            onChangeText={setSizeColor}
            editable={!isDisabled}
            placeholder="M - Black"
          />
        </BthBox>
      </BthBox>

      <BthTextField
        label="ملاحظات إضافية"
        value={notes}
        onChangeText={setNotes}
        editable={!isDisabled}
        hint="مثال: أولوية للون نفسه، أو بديل مقبول إذا نفد المقاس."
        placeholder="أي تفاصيل تساعد فريق العمليات"
      />

      {submitted ? (
        <BthSurface tone="success" gap={2}>
          <BthText role="bodyStrong">تم تسجيل الطلب</BthText>
          <BthText role="bodySm" tone="muted">
            ستراجع العمليات الطلب ثم تضيفه إلى مسار الشراء والتجميع المناسب.
          </BthText>
        </BthSurface>
      ) : null}

      {validationError ? <BthText role="bodySm" tone="muted">{validationError}</BthText> : null}

      {!embedded && onBack ? <BthButton label="العودة" tone="secondary" onPress={onBack} /> : null}
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
                <BthText role="titleSm">طلب شراء من SHEIN</BthText>
                <BthText role="bodySm" tone="muted">
                  لوح سفلي مختصر للطلب اليدوي، داخل نفس الصفحة.
                </BthText>
              </BthBox>
            </BthBox>

            <BthBox gap={2}>
              <BthSurface tone="brand" gap={2}>
                <BthText role="bodyStrong">SHEIN</BthText>
                <BthText role="bodySm" tone="muted">لا يوجد شركاء لهذه الفئة.</BthText>
                <BthText role="bodySm" tone="muted">المنصة نفسها تشتري وتجمع الطلبات قبل التوصيل.</BthText>
              </BthSurface>

              {formFields}

              <BthButton label={submitted ? 'تم التسجيل' : 'إرسال الطلب'} tone="primary" onPress={handleSubmit} disabled={isDisabled} />
            </BthBox>
          </Pressable>
        </Pressable>
      </Modal>
    );
  }

  return (
    <BthFormScreenShell
      title="طلب شراء من SHEIN"
      subtitle="استمارة مباشرة وسهلة للعميل. أدخل الرابط والكمية والمقاس أو اللون والملاحظات ثم أرسل الطلب للعمليات."
      submitLabel={submitted ? 'تم تسجيل الطلب' : 'إرسال الطلب'}
      onSubmit={handleSubmit}
      submitDisabled={isDisabled}
    >
      <BthBox gap={3}>
        <BthSurface tone="brand" gap={2}>
          <BthText role="bodyStrong">SHEIN</BthText>
          <BthText role="bodySm" tone="muted">طلب مباشر داخل نفس الصفحة.</BthText>
        </BthSurface>

        {formFields}
      </BthBox>
    </BthFormScreenShell>
  );
}

export default DshSheinOrderCreateScreen;
