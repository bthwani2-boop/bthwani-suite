import React from 'react';
import {
  BthBox,
  BthButton,
  BthFormScreenShell,
  BthKeyValueList,
  BthListItem,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
  BthTextField,
  BthChip,
} from '@bthwani/ui-kit';
import { type DshOperationScreenState } from '../../../patterns/screens/DshOperationScreen';
import DshSmartConfirm from '../components/DshSmartConfirm';
import DshWalletButton from '../components/DshWalletButton';
import DshStickyConfirmBar from '../components/DshStickyConfirmBar';
import DshCombinedReviewBlock from '../components/DshCombinedReviewBlock';
import * as walletAdapter from '../adapters/DshWalletAdapter';
import useWlt from '../../../../../wlt/app-client/dsh/hooks/useWlt';
import DshWltPaymentOptionsRow from '../../../../../wlt/app-client/dsh/DshWltPaymentOptionsRow';
import DshWltBalance from '../../../../../wlt/app-client/dsh/DshWltBalance';
import DshWltConnector from '../../../../../wlt/app-client/dsh/DshWltConnector';

// Small unified screen that consolidates the create → review → checkout flows
// Exports wrapper components that match the original file-level APIs so host
// imports keep working while the implementation lives in one file.

export type DshCreateOrderFormValues = {
  pickupAddress: string;
  dropoffAddress: string;
  contactName: string;
  contactPhone: string;
  note?: string;
};

export type DshCreateOrderFormErrors = Partial<Record<keyof DshCreateOrderFormValues, string>>;

type ReviewLineItem = { id: string; label: string; value: string };

type ReviewBlocks = {
  route: ReviewLineItem[];
  contact: ReviewLineItem[];
  pricing: ReviewLineItem[];
};

type CheckoutScreenId = 'checkout-gate' | 'estimate-get' | 'pricing-preview' | 'pricing-snapshot-get' | 'promo-apply';
type IntakeScreenId = 'booking-create' | 'estimate-create' | 'external-order-create' | 'gas-refill-order-create';

export type DshOrderHubScreenProps = {
  // create props
  values?: DshCreateOrderFormValues;
  errors?: DshCreateOrderFormErrors;
  onChange?: (field: keyof DshCreateOrderFormValues, value: string) => void;
  onContinue?: () => void;
  // review props
  state?: 'ready' | 'loading' | 'empty';
  blocks?: ReviewBlocks;
  onSubmit?: () => void;
  onEdit?: () => void;
  // checkout / intake hub props
  screenId?: CheckoutScreenId | IntakeScreenId;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
  // mode override: if provided, force the view
  mode?: 'create' | 'review' | 'checkout' | 'intake';
};

export type DshIntakeHubScreenProps = {
  screenId: IntakeScreenId;
  state?: DshOperationScreenState;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onRetry?: () => void;
};

function ReviewBlock({ title, items }: { title: string; items: ReviewLineItem[] }) {
  return (
    <BthSurface tone="raised" gap={3}>
      <BthSectionHeader title={title} />
      <BthBox gap={2}>
        {items.map((item) => (
          <BthBox key={item.id} gap={1}>
            <BthText role="caption" tone="muted">{item.label}</BthText>
            <BthText role="bodyStrong">{item.value}</BthText>
          </BthBox>
        ))}
      </BthBox>
    </BthSurface>
  );
}

export function DshOrderHubScreen({
  values,
  errors,
  onChange,
  onContinue,
  state = 'ready',
  blocks,
  onSubmit,
  onEdit,
  screenId,
  onPrimaryAction,
  onSecondaryAction,
  onRetry,
  mode,
}: DshOrderHubScreenProps) {
  const [localMode, setLocalMode] = React.useState<'create' | 'review' | 'checkout' | 'intake' | 'tracking' | 'completed'>(() => {
    if (mode) return mode;
    return blocks ? 'review' : values ? 'create' : 'checkout';
  });

  React.useEffect(() => {
    if (mode) setLocalMode(mode);
  }, [mode]);

  // Simple internal payment selection state for the merged screen.
  // Payment model: wallet-first. Options: 'bthwallet' | 'mixed' (wallet + cash) | 'cod'
  const [paymentMethod, setPaymentMethod] = React.useState<'bthwallet' | 'mixed' | 'cod'>('bthwallet');
  const [processing, setProcessing] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  // Smart confirmation overlay state
  const [showSmartConfirm, setShowSmartConfirm] = React.useState(false);

  // Order lifecycle / tracking state
  const [orderId, setOrderId] = React.useState<string | null>(null);
  const [orderStage, setOrderStage] = React.useState<'created' | 'assigned' | 'pickup' | 'in_transit' | 'delivered' | 'completed' | null>(null);
  const [timelineSteps, setTimelineSteps] = React.useState<{ id: string; title: string; detail?: string; done?: boolean }[]>([]);
  const timeoutsRef = React.useRef<number[]>([]);

  // Rating state (shared rating for order + captain)
  const [orderRating, setOrderRating] = React.useState<number | null>(null);
  const [captainRating, setCaptainRating] = React.useState<number | null>(null);
  const [ratingComment, setRatingComment] = React.useState('');
  const captainSuggestedRef = React.useRef<boolean>(false);

  React.useEffect(() => {
    return () => {
      // clear any pending timeouts on unmount
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  
  // wallet state via shared WLT hook
  const { linked: walletLinked, balance: walletBalance, requestPayment: requestWltPayment, getBalance: wltGetBalance } = useWlt();

  const handleSubmit = React.useCallback(() => {
    if (onSubmit) {
      onSubmit();
      return;
    }

    // fallback: simulate processing, with optional wallet payment first
    const perform = async () => {
      setProcessing(true);
      // derive total from blocks.pricing last value (extract digits)
      const raw = blocks?.pricing?.[blocks.pricing.length - 1]?.value ?? '';
      const num = Number(String(raw).replace(/[^0-9.]/g, '')) || 0;
      const totalHalalas = Math.round(num * 100);

      try {
        if (paymentMethod === 'bthwallet') {
          // full wallet payment
          const resp = await requestWltPayment(totalHalalas);
          if (!resp.success) {
            // if insufficient, try partial from wallet then COD
            const bal = await wltGetBalance();
            if (bal > 0) {
              // charge what we can
              const partial = Math.min(bal, totalHalalas);
              const pResp = await requestWltPayment(partial);
              // ignore pResp.success failure and continue as mixed/COD
            } else {
              // no wallet funds — fallback to COD flow
            }
          }
        } else if (paymentMethod === 'mixed') {
          const bal = await wltGetBalance();
          const use = Math.min(bal, totalHalalas);
          if (use > 0) {
            // attempt partial wallet charge
            await requestWltPayment(use);
          }
          // remaining will be COD
        } else {
          // 'cod' — nothing to charge now
        }
      } catch (e) {
        // ignore adapter errors and continue with simulated creation
      }

      setTimeout(() => {
        setProcessing(false);
        setSuccess(true);
        // generate order id and start tracking lifecycle
        const oid = `dsh-${Date.now()}`;
        setOrderId(oid);
        setOrderStage('created');
        setTimelineSteps([
          { id: 'created', title: 'تم إنشاء الطلب', detail: 'تم تأكيد طلبك.', done: true },
          { id: 'assigned', title: 'تم تعيين السائق', detail: 'تم قبول الطلب من قبل السائق.', done: false },
          { id: 'pickup', title: 'جارٍ الاستلام', detail: 'السائق في طريقه لاستلام الطلب.', done: false },
          { id: 'in_transit', title: 'في الطريق للتسليم', detail: 'سيظهر التتبع هنا.', done: false },
          { id: 'delivered', title: 'تم التسليم', detail: 'تم تسليم الطلب.', done: false },
        ]);

        // switch to tracking view
        setLocalMode('tracking');

        // simulate timeline progression
        const t1 = window.setTimeout(() => {
          setOrderStage('assigned');
          setTimelineSteps((s) => s.map((it) => (it.id === 'assigned' ? { ...it, done: true } : it)));
        }, 1200);

        const t2 = window.setTimeout(() => {
          setOrderStage('pickup');
          setTimelineSteps((s) => s.map((it) => (it.id === 'pickup' ? { ...it, done: true } : it)));
        }, 2600);

        const t3 = window.setTimeout(() => {
          setOrderStage('in_transit');
          setTimelineSteps((s) => s.map((it) => (it.id === 'in_transit' ? { ...it, done: true } : it)));
        }, 4200);

        const t4 = window.setTimeout(() => {
          setOrderStage('delivered');
          setTimelineSteps((s) => s.map((it) => (it.id === 'delivered' ? { ...it, done: true } : it)));
        }, 6200);

        timeoutsRef.current.push(t1 as unknown as number, t2 as unknown as number, t3 as unknown as number, t4 as unknown as number);

        // call host primary action as notification (optional navigation)
        onPrimaryAction?.();
      }, 900);
    };

    void perform();
  }, [onSubmit, onPrimaryAction, paymentMethod, blocks, onRetry]);

  const handleSetOrderRating = React.useCallback((n: number) => {
    setOrderRating(n);
    // smart suggestion: if captain rating not set explicitly, suggest same rating
    if (captainRating == null || captainSuggestedRef.current) {
      setCaptainRating(n);
      captainSuggestedRef.current = true;
    }
  }, [captainRating]);

  const handleSetCaptainRating = React.useCallback((n: number) => {
    setCaptainRating(n);
    captainSuggestedRef.current = false;
  }, []);

  const handleSubmitRating = React.useCallback(() => {
    // mark completed and show final success
    setOrderStage('completed');
    setLocalMode('completed');
    // clear any pending timers
    timeoutsRef.current.forEach((id) => clearTimeout(id));
    timeoutsRef.current = [];
    // notify host: allow navigation back to orders list
    onPrimaryAction?.();
  }, [onPrimaryAction]);

  // Show focused full-screen smart confirm when requested
  if (showSmartConfirm) {
    return (
      <DshSmartConfirm
        pickupAddress={values?.pickupAddress ?? blocks?.route?.[0]?.value}
        dropoffAddress={values?.dropoffAddress ?? blocks?.route?.[1]?.value}
        contactName={values?.contactName}
        contactPhone={values?.contactPhone}
        pricingLines={blocks?.pricing ?? []}
        paymentMethod={paymentMethod}
        processing={processing}
        onConfirm={() => {
          setShowSmartConfirm(false);
          handleSubmit();
        }}
        onEdit={() => {
          setShowSmartConfirm(false);
          onEdit?.();
        }}
        onCancel={() => setShowSmartConfirm(false)}
      />
    );
  }

  // tracking / completed keep their existing full-screen behaviors
  if (localMode === 'tracking') {
    if (!orderStage) {
      return <BthStateView stateId="loading" />;
    }

    return (
      <BthMobileScrollView padding={4} gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title="متابعة الطلب" subtitle={orderId ? `طلب ${orderId}` : 'جاري التتبع'} trailing={<BthChip label={orderStage ?? 'غير معروف'} selected />} />
        </BthSurface>

        <BthSurface tone="raised" gap={3}>
          <BthSectionHeader title="الجدول الزمني" subtitle="تابع تقدم الطلب." />
          <BthBox gap={3}>
            {timelineSteps.map((step) => (
              <BthBox key={step.id} gap={1}>
                <BthText role="bodyStrong">{step.title}</BthText>
                {step.detail ? <BthText role="bodySm" tone="muted">{step.detail}</BthText> : null}
                <BthChip label={step.done ? 'مكتمل' : 'قيد الانتظار'} selected={Boolean(step.done)} />
              </BthBox>
            ))}
          </BthBox>
        </BthSurface>

        {orderStage !== 'delivered' ? (
          <BthSurface tone="inset" gap={3}>
            <BthSectionHeader title="الدعم" subtitle="إذا احتجت مساعدة، تواصل مع الدعم." />
            <BthBox layoutDirection="row" gap={2}>
                <BthButton label="تواصل مع الدعم" tone="secondary" onPress={() => onSecondaryAction?.()} />
                <BthButton label="الطلبات" onPress={() => onPrimaryAction?.()} />
              </BthBox>
          </BthSurface>
        ) : (
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="تم التسليم" subtitle="يرجى التأكيد وتقييم تجربتك." />
            <BthBox gap={2}>
              <BthText role="bodySm" tone="muted">التقييم مشترك: قيّم الطلب والكابتن. الاقتراح ذكي بناءً على تقييمك للطلب.</BthText>

              <BthBox gap={2}>
                <BthText role="caption" tone="muted">قيم الطلب</BthText>
                <BthBox layoutDirection="row" gap={1}>
                  {[1,2,3,4,5].map((n) => (
                    <BthButton key={n} label={orderRating && orderRating >= n ? '★' : '☆'} onPress={() => handleSetOrderRating(n)} />
                  ))}
                </BthBox>
              </BthBox>

              <BthBox gap={2}>
                <BthText role="caption" tone="muted">تقييم مقترح للسائق</BthText>
                <BthBox layoutDirection="row" gap={1}>
                  {[1,2,3,4,5].map((n) => (
                    <BthButton key={n} label={captainRating && captainRating >= n ? '★' : '☆'} onPress={() => handleSetCaptainRating(n)} />
                  ))}
                </BthBox>
              </BthBox>

              <BthTextField label="تعليق (اختياري)" value={ratingComment} onChangeText={setRatingComment} />

              <BthBox layoutDirection="row" gap={2}>
                <BthButton label="إرسال التقييم" onPress={handleSubmitRating} />
                <BthButton label="تخطي" tone="secondary" onPress={() => { setOrderStage('completed'); setLocalMode('completed'); onPrimaryAction?.(); }} />
              </BthBox>
            </BthBox>
          </BthSurface>
        )}
      </BthMobileScrollView>
    );
  }

  if (localMode === 'completed') {
    return (
      <BthMobileScrollView padding={4} gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title="Thank you" subtitle="Order complete" />
        </BthSurface>

        <BthSurface tone="raised" gap={3}>
          <BthBox gap={2}>
            <BthText role="titleMd">Order completed</BthText>
            <BthText role="bodySm" tone="muted">شكراً لتقييمك — يساعدنا ذلك في تحسين التجربة.</BthText>
            <BthBox layoutDirection="row" gap={2}>
              <BthButton label="Open orders" onPress={() => onPrimaryAction?.()} />
              <BthButton label="Home" tone="secondary" onPress={() => onRetry?.()} />
            </BthBox>
          </BthBox>
        </BthSurface>
      </BthMobileScrollView>
    );
  }

  // Merged single-screen view: show form, compact review, payment, and confirm in one continuous page
  const isDisabled = processing || state === 'loading';

  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthBox gap={2}>
        <BthText role="titleLg">إنشاء الطلب</BthText>
        <BthText role="bodyMd" tone="muted">أدخل الحقول الأساسية فقط للمراجعة.</BthText>
      </BthBox>

      <BthSurface gap={3}>
        <BthSectionHeader title="تفاصيل التوصيل" subtitle="اجعل سياق المسار بسيطًا ومركّزًا." />
        <BthTextField label="عنوان الاستلام" value={values?.pickupAddress ?? ''} onChangeText={(v) => onChange?.('pickupAddress', v)} editable={!isDisabled} error={errors?.pickupAddress} />
        <BthTextField label="عنوان التسليم" value={values?.dropoffAddress ?? ''} onChangeText={(v) => onChange?.('dropoffAddress', v)} editable={!isDisabled} error={errors?.dropoffAddress} />
      </BthSurface>

      <BthSurface gap={3}>
        <BthSectionHeader title="جهة الاتصال" subtitle="جهة اتصال واحدة كافية." />
        <BthTextField label="اسم جهة الاتصال" value={values?.contactName ?? ''} onChangeText={(v) => onChange?.('contactName', v)} editable={!isDisabled} error={errors?.contactName} />
        <BthTextField label="هاتف جهة الاتصال" value={values?.contactPhone ?? ''} onChangeText={(v) => onChange?.('contactPhone', v)} editable={!isDisabled} keyboardType="phone-pad" error={errors?.contactPhone} />
      </BthSurface>

      <BthSurface gap={3}>
        <BthSectionHeader title="ملاحظة (اختياري)" subtitle="اجعل هذه الجزئية مركّزة." />
        <BthTextField label="ملاحظة الطلب" value={values?.note ?? ''} onChangeText={(v) => onChange?.('note', v)} editable={!isDisabled} hint="اجعلها قصيرة وعملية." error={errors?.note} />
      </BthSurface>

      {blocks ? (
        <BthSurface tone="raised" gap={3}>
          <BthSectionHeader title="مراجعة" subtitle="مراجعة موجزة فقط. احتفظ بكتل القرار قصيرة قبل الإرسال." />
          <DshCombinedReviewBlock
            blocks={blocks}
            values={{
              pickupAddress: values?.pickupAddress,
              dropoffAddress: values?.dropoffAddress,
              contactName: values?.contactName,
              contactPhone: values?.contactPhone,
            }}
            onEdit={() => {
              onEdit?.();
            }}
          />
        </BthSurface>
      ) : null}

      <BthSurface tone="raised" gap={3}>
        <BthSectionHeader title="الدفع" subtitle="اختر طريقة الدفع لهذا الطلب." trailing={<DshWltBalance balance={walletBalance} />} />
        <BthBox gap={2}>
          <DshWltPaymentOptionsRow
            options={[
              { id: 'cod', label: 'كاش عند الوصول', subtitle: 'الدفع عند الاستلام' },
              { id: 'bthwallet', label: 'محفظة بثواني', subtitle: `الرصيد ${(walletBalance ?? 0) / 100} ر.س.`, meta: <BthText role="caption" tone="muted">سيتم خصم قيمة الطلب من رصيد المحفظة عند التأكيد</BthText> },
              { id: 'mixed', label: 'محفظة + كاش', subtitle: 'استخدم المحفظة أولاً، والباقي كاش عند الوصول' }
            ]}
            selectedId={paymentMethod}
            onSelect={(id) => setPaymentMethod(id as 'bthwallet' | 'mixed' | 'cod')}
          />
        </BthBox>
      </BthSurface>

      <DshStickyConfirmBar
        totalLabel="المبلغ النهائي"
        totalValue={blocks?.pricing?.[blocks.pricing.length - 1]?.value}
        primaryLabel={processing ? 'جارٍ المعالجة…' : 'تأكيد ودفع'}
        secondaryLabel="تعديل التفاصيل"
        processing={processing}
        onPrimary={() => setShowSmartConfirm(true)}
        onSecondary={() => { onEdit?.(); }}
      />

      {processing ? <BthStateView stateId="loading" /> : null}
      {success ? <BthStateView stateId="success" title="تم إرسال الطلب" description="تم تأكيد طلبك وهو جاهز للتتبع." /> : null}
    </BthMobileScrollView>
  );

  if (localMode === 'tracking') {
    if (!orderStage) {
      return <BthStateView stateId="loading" />;
    }

    return (
      <BthMobileScrollView padding={4} gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title="Order tracking" subtitle={orderId ? `Order ${orderId}` : 'Tracking in progress'} trailing={<BthChip label={orderStage ?? 'unknown'} selected />} />
        </BthSurface>

        <BthSurface tone="raised" gap={3}>
          <BthSectionHeader title="Timeline" subtitle="Follow the order progress." />
          <BthBox gap={3}>
            {timelineSteps.map((step) => (
              <BthBox key={step.id} gap={1}>
                <BthText role="bodyStrong">{step.title}</BthText>
                {step.detail ? <BthText role="bodySm" tone="muted">{step.detail}</BthText> : null}
                <BthChip label={step.done ? 'Done' : 'Pending'} selected={Boolean(step.done)} />
              </BthBox>
            ))}
          </BthBox>
        </BthSurface>

        {orderStage !== 'delivered' ? (
          <BthSurface tone="inset" gap={3}>
            <BthSectionHeader title="Support" subtitle="If you need help, contact support." />
            <BthBox layoutDirection="row" gap={2}>
              <BthButton label="Contact support" tone="secondary" onPress={() => onSecondaryAction?.()} />
              <BthButton label="Open orders" onPress={() => onPrimaryAction?.()} />
            </BthBox>
          </BthSurface>
        ) : (
          <BthSurface tone="raised" gap={3}>
            <BthSectionHeader title="Delivered" subtitle="Please confirm and rate your experience." />
            <BthBox gap={2}>
              <BthText role="bodySm" tone="muted">التقييم مشترك: قيّم الطلب والكابتن. الاقتراح ذكي بناءً على تقييمك للطلب.</BthText>

              <BthBox gap={2}>
                <BthText role="caption" tone="muted">Rate order</BthText>
                <BthBox layoutDirection="row" gap={1}>
                  {[1,2,3,4,5].map((n) => (
                    <BthButton key={n} label={orderRating && orderRating >= n ? '★' : '☆'} onPress={() => handleSetOrderRating(n)} />
                  ))}
                </BthBox>
              </BthBox>

              <BthBox gap={2}>
                <BthText role="caption" tone="muted">Suggested captain rating</BthText>
                <BthBox layoutDirection="row" gap={1}>
                  {[1,2,3,4,5].map((n) => (
                    <BthButton key={n} label={captainRating && captainRating >= n ? '★' : '☆'} onPress={() => handleSetCaptainRating(n)} />
                  ))}
                </BthBox>
              </BthBox>

              <BthTextField label="Comment (optional)" value={ratingComment} onChangeText={setRatingComment} />

              <BthBox layoutDirection="row" gap={2}>
                <BthButton label="Submit rating" onPress={handleSubmitRating} />
                <BthButton label="Skip" tone="secondary" onPress={() => { setOrderStage('completed'); setLocalMode('completed'); onPrimaryAction?.(); }} />
              </BthBox>
            </BthBox>
          </BthSurface>
        )}
      </BthMobileScrollView>
    );
  }

  if (localMode === 'completed') {
    return (
      <BthMobileScrollView padding={4} gap={3}>
        <BthSurface tone="brand" gap={3}>
          <BthSectionHeader title="Thank you" subtitle="Order complete" />
        </BthSurface>

        <BthSurface tone="raised" gap={3}>
          <BthBox gap={2}>
            <BthText role="titleMd">Order completed</BthText>
            <BthText role="bodySm" tone="muted">شكراً لتقييمك — يساعدنا ذلك في تحسين التجربة.</BthText>
            <BthBox layoutDirection="row" gap={2}>
              <BthButton label="Open orders" onPress={() => onPrimaryAction?.()} />
              <BthButton label="Home" tone="secondary" onPress={() => onRetry?.()} />
            </BthBox>
          </BthBox>
        </BthSurface>
      </BthMobileScrollView>
    );
  }

  // Simplified checkout / intake fallback view to preserve compatibility.
  return (
    <BthMobileScrollView padding={4} gap={3}>
      <BthSurface tone="brand" gap={3}>
        <BthSectionHeader title={screenId ? String(screenId) : 'الدفع السريع'} subtitle="مركز الدفع السريع" />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthListItem title="افتح المراجعة" subtitle="انتقل إلى مراجعة الطلب" onPress={() => { onPrimaryAction?.(); setLocalMode('review'); }} />
        <BthListItem title="دليل الدعم" subtitle="افتح خيارات الدعم" onPress={() => onSecondaryAction?.()} />
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthButton label="إعادة المحاولة" tone="secondary" onPress={() => onRetry?.()} />
      </BthSurface>
    </BthMobileScrollView>
  );
}

// Export legacy named components as thin wrappers so imports keep working.
export function DshCreateOrderScreen(props: any) {
  return <DshOrderHubScreen {...props} mode={props.mode ?? 'create'} />;
}

export function DshIntakeHubScreen(props: any) {
  return <DshOrderHubScreen {...props} mode={props.mode ?? 'intake'} />;
}

export default DshOrderHubScreen;
