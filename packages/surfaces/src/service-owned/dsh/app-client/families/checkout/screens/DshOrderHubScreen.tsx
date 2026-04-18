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
  // wallet state
  const [walletLinked, setWalletLinked] = React.useState(false);
  const [walletBalance, setWalletBalance] = React.useState<number | null>(null);

  React.useEffect(() => {
    return () => {
      // clear any pending timeouts on unmount
      timeoutsRef.current.forEach((id) => clearTimeout(id));
      timeoutsRef.current = [];
    };
  }, []);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      const l = await walletAdapter.isWalletLinked();
      if (!mounted) return;
      setWalletLinked(l);
      if (l) {
        const bal = await walletAdapter.getWalletBalance();
        if (!mounted) return;
        setWalletBalance(bal);
      }
    })();
    return () => { mounted = false; };
  }, []);

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
          const resp = await walletAdapter.requestWalletPayment(totalHalalas);
          if (!resp.success) {
            // if insufficient, try partial from wallet then COD
            const bal = await walletAdapter.getWalletBalance();
            if (bal > 0) {
              // charge what we can
              const partial = Math.min(bal, totalHalalas);
              const pResp = await walletAdapter.requestWalletPayment(partial);
              // ignore pResp.success failure and continue as mixed/COD
            } else {
              // no wallet funds — fallback to COD flow
            }
          }
        } else if (paymentMethod === 'mixed') {
          const bal = await walletAdapter.getWalletBalance();
          const use = Math.min(bal, totalHalalas);
          if (use > 0) {
            // attempt partial wallet charge
            await walletAdapter.requestWalletPayment(use);
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
          { id: 'created', title: 'Order created', detail: 'Your request was confirmed.', done: true },
          { id: 'assigned', title: 'Captain assigned', detail: 'A captain accepted your order.', done: false },
          { id: 'pickup', title: 'Pickup in progress', detail: 'Captain is heading to pickup location.', done: false },
          { id: 'in_transit', title: 'On the way to dropoff', detail: 'Live tracking will appear here.', done: false },
          { id: 'delivered', title: 'Delivered', detail: 'Order was delivered to customer.', done: false },
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

  // Show focused full-screen smart confirm when requested from the review flow
  if (showSmartConfirm && localMode === 'review') {
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
          setLocalMode('create');
        }}
        onCancel={() => setShowSmartConfirm(false)}
      />
    );
  }

  if (localMode === 'create') {
    const isDisabled = processing || state === 'loading';

    return (
      <BthFormScreenShell
        title="Create order"
        subtitle="Capture only the essential fields before review."
        submitLabel="Continue to review"
        onSubmit={() => {
          onContinue?.();
          // If the host doesn't navigate, advance local mode.
          setLocalMode('review');
        }}
        submitDisabled={isDisabled}
      >
        {state === 'loading' ? <BthStateView stateId="loading" /> : null}

        <BthBox gap={3}>
          <BthSectionHeader title="Delivery details" subtitle="Keep the route context simple and focused." />
          <BthTextField label="Pickup address" value={values?.pickupAddress ?? ''} onChangeText={(v) => onChange?.('pickupAddress', v)} editable={!isDisabled} error={errors?.pickupAddress} />
          <BthTextField label="Dropoff address" value={values?.dropoffAddress ?? ''} onChangeText={(v) => onChange?.('dropoffAddress', v)} editable={!isDisabled} error={errors?.dropoffAddress} />
        </BthBox>

        <BthBox gap={3}>
          <BthSectionHeader title="Contact" subtitle="One reachable contact is enough." />
          <BthTextField label="Contact name" value={values?.contactName ?? ''} onChangeText={(v) => onChange?.('contactName', v)} editable={!isDisabled} error={errors?.contactName} />
          <BthTextField label="Contact phone" value={values?.contactPhone ?? ''} onChangeText={(v) => onChange?.('contactPhone', v)} editable={!isDisabled} keyboardType="phone-pad" error={errors?.contactPhone} />
        </BthBox>

        <BthBox gap={3}>
          <BthSectionHeader title="Optional note" subtitle="Keep this slice focused." />
          <BthTextField label="Order note" value={values?.note ?? ''} onChangeText={(v) => onChange?.('note', v)} editable={!isDisabled} hint="Keep this short and practical." error={errors?.note} />
        </BthBox>

        <BthText role="caption" tone="muted">Validation: required fields keep continue blocked.</BthText>
      </BthFormScreenShell>
    );
  }

  if (localMode === 'review') {
    if (state === 'loading') {
      return <BthStateView stateId="loading" />;
    }

    if (state === 'empty') {
      return <BthStateView stateId="empty" actionLabel="Back to create" onActionPress={() => { onEdit?.(); setLocalMode('create'); }} />;
    }

    return (
      <BthMobileScrollView padding={4} gap={3}>
        <BthBox gap={2}>
          <BthText role="titleLg">Review order</BthText>
          <BthText role="bodySm" tone="muted">Compact review only. Keep decision blocks short before submit.</BthText>
        </BthBox>

        {blocks ? (
          <DshCombinedReviewBlock
            blocks={blocks}
            onEdit={() => {
              onEdit?.();
              setLocalMode('create');
            }}
          />
        ) : null}

        <BthSurface tone="raised" gap={3}>
          <BthSectionHeader title="Payment" subtitle="Choose a payment method for this order." />
          <BthBox gap={2}>
            <BthListItem title="Card" subtitle="Pay with saved card" meta={paymentMethod === 'card' ? 'Selected' : undefined} onPress={() => setPaymentMethod('card')} />
            <BthListItem title="Apple/Google Pay" subtitle="Quick native pay" meta={paymentMethod === 'wallet' ? 'Selected' : undefined} onPress={() => setPaymentMethod('wallet')} />
            <BthListItem title="محفظة بثواني" subtitle={walletLinked ? `متصلة — ${(walletBalance ?? 0) / 100} SAR` : 'ربط ودفع سريع'} meta={paymentMethod === 'bthwallet' ? 'Selected' : undefined} onPress={() => setPaymentMethod('bthwallet')} />
            <BthListItem title="Cash on delivery" subtitle="Pay when received" meta={paymentMethod === 'cod' ? 'Selected' : undefined} onPress={() => setPaymentMethod('cod')} />
          </BthBox>
        </BthSurface>

        <DshStickyConfirmBar
          totalLabel="المبلغ النهائي"
          totalValue={blocks?.pricing?.[blocks.pricing.length - 1]?.value}
          primaryLabel={processing ? 'جارٍ المعالجة…' : 'تأكيد ودفع'}
          secondaryLabel="تعديل التفاصيل"
          processing={processing}
          onPrimary={() => setShowSmartConfirm(true)}
          onSecondary={() => { onEdit?.(); setLocalMode('create'); }}
        />

        

        {processing ? <BthStateView stateId="loading" /> : null}
        {success ? <BthStateView stateId="success" title="Order submitted" description="Your order is confirmed and ready for tracking." /> : null}
      </BthMobileScrollView>
    );
  }

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
        <BthSectionHeader title={screenId ? String(screenId) : 'Checkout'} subtitle="Quick checkout hub" />
      </BthSurface>

      <BthSurface tone="raised" gap={3}>
        <BthListItem title="Open review" subtitle="Proceed to order review" onPress={() => { onPrimaryAction?.(); setLocalMode('review'); }} />
        <BthListItem title="Support directory" subtitle="Open support options" onPress={() => onSecondaryAction?.()} />
      </BthSurface>

      <BthSurface tone="inset" gap={3}>
        <BthButton label="Retry" tone="secondary" onPress={() => onRetry?.()} />
      </BthSurface>
    </BthMobileScrollView>
  );
}

// Export legacy named components as thin wrappers so imports keep working.
export function DshCreateOrderScreen(props: any) {
  return <DshOrderHubScreen {...props} mode={props.mode ?? 'create'} />;
}

export function DshReviewOrderScreen(props: any) {
  return <DshOrderHubScreen {...props} mode={props.mode ?? 'review'} />;
}

export function DshCheckoutHubScreen(props: any) {
  return <DshOrderHubScreen {...props} mode={props.mode ?? 'checkout'} />;
}

export function DshIntakeHubScreen(props: any) {
  return <DshOrderHubScreen {...props} mode={props.mode ?? 'intake'} />;
}

export default DshOrderHubScreen;
