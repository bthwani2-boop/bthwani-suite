import React from 'react';
import { BthBox, BthButton, BthFormScreenShell, BthKeyValueList, BthListItem, BthStatCard, BthSurface, BthText, BthTextField } from '@bthwani/ui-kit';
import { DshOperationScreen, type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import { clientSupportDefinitions, type ClientSupportScreenId } from '../../support/screens/DshClientGeneratedSupportScreens';

type IntakeScreenId = 'booking-create' | 'estimate-create' | 'external-order-create' | 'gas-refill-order-create';

export type DshIntakeHubScreenProps = {
  screenId: IntakeScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

function getDraftPlaceholder(screenId: IntakeScreenId) {
  if (screenId === 'external-order-create') {
    return 'External ref: EXT-2048';
  }

  if (screenId === 'gas-refill-order-create') {
    return 'Gas station, cylinder count, arrival note';
  }

  if (screenId === 'estimate-create') {
    return 'Pickup, dropoff, weight, and urgency';
  }

  return 'Service date, location, and customer note';
}

export function DshIntakeHubScreen({
  screenId,
  state = 'ready',
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
}: DshIntakeHubScreenProps) {
  const definition = clientSupportDefinitions[screenId as ClientSupportScreenId];
  const [draft, setDraft] = React.useState('');
  const [productUrl, setProductUrl] = React.useState('');
  const [quantity, setQuantity] = React.useState('1');
  const [sizeColor, setSizeColor] = React.useState('');
  const [customerNotes, setCustomerNotes] = React.useState('');
  const [referenceImages, setReferenceImages] = React.useState('');
  const [validationError, setValidationError] = React.useState<string | null>(null);

  const isExternalOrderCreate = screenId === 'external-order-create';

  const handleExternalOrderSubmit = () => {
    const normalizedUrl = productUrl.trim();
    const normalizedQuantity = quantity.trim();

    if (!normalizedUrl || normalizedUrl === 'https://www.shein.com/...') {
      setValidationError('أدخل رابط المنتج من SHEIN أولًا.');
      return;
    }

    if (!normalizedQuantity || Number.isNaN(Number(normalizedQuantity)) || Number(normalizedQuantity) < 1) {
      setValidationError('الكمية يجب أن تكون رقمًا يبدأ من 1.');
      return;
    }

    setValidationError(null);
    onPrimaryAction?.();
  };

  if (isExternalOrderCreate) {
    return (
      <BthFormScreenShell
        title="طلب شراء من SHEIN"
        subtitle="أدخل فقط ما تحتاجه العمليات: الرابط، الكمية، المقاس أو اللون، ثم ملاحظاتك. المنصة تتولى الشراء والتوصيل بنفسها."
        submitLabel="إرسال الطلب"
        onSubmit={handleExternalOrderSubmit}
        submitDisabled={state !== 'ready'}
      >
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Source" value="SHEIN" deltaLabel="منصة واحدة، بدون شركاء" tone="info" />
            <BthStatCard label="Mode" value="Manual request" deltaLabel="فريق العمليات يراجع ثم يشتري" tone="success" />
          </BthSurface>
        </BthBox>

        <BthBox gap={3}>
          <BthTextField
            label="رابط المنتج"
            value={productUrl}
            onChangeText={(value) => {
              setProductUrl(value);
              setValidationError(null);
            }}
            editable={state === 'ready'}
            placeholder="https://www.shein.com/..."
            hint="انسخ الرابط كما هو من صفحة المنتج."
          />
        </BthBox>

        <BthBox gap={3} layoutDirection="row" style={{ flexWrap: 'wrap' }}>
          <BthBox style={{ flex: 1, minWidth: 160 }}>
            <BthTextField
              label="الكمية"
              value={quantity}
              onChangeText={(value) => {
                setQuantity(value);
                setValidationError(null);
              }}
              editable={state === 'ready'}
              keyboardType="number-pad"
              placeholder="1"
            />
          </BthBox>
          <BthBox style={{ flex: 1, minWidth: 160 }}>
            <BthTextField
              label="المقاس / اللون"
              value={sizeColor}
              onChangeText={setSizeColor}
              editable={state === 'ready'}
              placeholder="M - Black"
            />
          </BthBox>
        </BthBox>

        <BthBox gap={3}>
          <BthTextField
            label="ملاحظات إضافية"
            value={customerNotes}
            onChangeText={setCustomerNotes}
            editable={state === 'ready'}
            hint="مثال: أولوية للون نفسه، أو بديل مقبول إذا نفد المقاس."
            placeholder="أي تفاصيل تساعد فريق العمليات"
          />
        </BthBox>

        <BthBox gap={3}>
          <BthTextField
            label="روابط الصور / المراجع"
            value={referenceImages}
            onChangeText={setReferenceImages}
            editable={state === 'ready'}
            hint="اختياري. يمكن وضع حتى 3 روابط أو مراجع مفصولة بفواصل."
            placeholder="upl_123, upl_456, upl_789"
          />
        </BthBox>

        <BthBox gap={2}>
          <BthSurface tone="raised" gap={2}>
            <BthKeyValueList
              items={[
                { label: 'Source', value: 'SHEIN' },
                { label: 'Fulfillment', value: 'Platform-owned' },
                { label: 'Batch delivery', value: 'Multi-customer route' },
              ]}
            />
          </BthSurface>
          {validationError ? <BthText role="bodySm" tone="muted">{validationError}</BthText> : null}
          <BthButton label="العودة إلى الدعم" tone="secondary" onPress={onSecondaryAction} />
        </BthBox>
      </BthFormScreenShell>
    );
  }

  return (
    <DshOperationScreen
      state={state}
      title={definition.title}
      subtitle={definition.subtitle}
      primaryActionLabel={screenId === 'estimate-create' ? 'Create estimate' : 'Continue intake'}
      secondaryActionLabel="Back to support"
      onPrimaryAction={onPrimaryAction}
      onSecondaryAction={onSecondaryAction}
      onRetry={onRetry}
      content={
        <BthBox gap={3}>
          <BthSurface tone="brand" gap={3}>
            <BthStatCard label="Intake lane" value="Focused" deltaLabel={definition.stageLabel} tone="info" />
            <BthStatCard label="Transition" value={screenId === 'estimate-create' ? 'Quote first' : 'Order-ready'} deltaLabel="No route noise" tone="success" />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthTextField
              label="Request draft"
              value={draft}
              onChangeText={setDraft}
              placeholder={getDraftPlaceholder(screenId)}
              hint="Keep special intake details visible before moving into the canonical order flow."
            />
          </BthSurface>

          <BthSurface tone="raised" gap={3}>
            <BthKeyValueList
              items={[
                { label: 'Surface', value: definition.title },
                { label: 'Stage', value: definition.stageLabel },
                { label: 'Primary outcome', value: definition.primaryOutcome, tone: 'brand' },
              ]}
            />
          </BthSurface>

          <BthSurface tone="raised" gap={2}>
            {[
              { title: 'Specialized intake', subtitle: 'Preserve the unique fields of this request type before entering the standard flow.', meta: 'Intake', badgeLabel: 'Specific' },
              { title: 'Canonical handoff', subtitle: 'Move into review or order creation without losing the source context.', meta: 'Handoff', badgeLabel: 'Flow' },
            ].map((item) => (
              <BthListItem key={item.title} title={item.title} subtitle={item.subtitle} meta={item.meta} badgeLabel={item.badgeLabel} />
            ))}
          </BthSurface>
        </BthBox>
      }
    />
  );
}

export default DshIntakeHubScreen;