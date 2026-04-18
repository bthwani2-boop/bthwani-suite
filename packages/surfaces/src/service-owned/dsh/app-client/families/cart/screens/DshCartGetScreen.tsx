import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import {
  BthBox,
  BthButton,
  BthCard,
  BthMobileScrollView,
  BthSectionHeader,
  BthStateView,
  BthSurface,
  BthText,
  StickyActionBar,
  CartDetails,
  BthTextField,
  spacing,
  sizes,
  safeArea,
} from '@bthwani/ui-kit';

export type DshCartGetScreenState = 'ready' | 'loading' | 'empty' | 'error' | 'offline' | 'disabled';

export type DshCartStoreSummary = {
  id: string;
  name: string;
  subtitle: string;
  ratingLabel?: string;
  statusLabel?: string;
};

export type DshCartOrderSummary = {
  id: string;
  title: string;
  subtitle?: string;
  meta?: string;
  statusLabel?: string;
};

export type DshCartGetScreenProps = {
  state?: DshCartGetScreenState;
  store?: DshCartStoreSummary;
  activeOrder?: DshCartOrderSummary;
  items?: Array<{ id: string; title: string; subtitle?: string; priceValue?: number; qty?: number }>;
  statusTitle?: string;
  statusDescription?: string;
  onOpenStore?: (storeId: string) => void;
  onOpenOrder?: (orderId: string) => void;
  onRetry?: () => void;
  onContinue?: () => void;
};

function renderNonReadyState(state: DshCartGetScreenState, onRetry?: () => void, onContinue?: () => void) {
  if (state === 'loading') {
    return <BthStateView stateId="loading" />;
  }

  if (state === 'empty') {
    return (
      <BthStateView
        stateId="empty"
        title="Your cart is empty"
        description="Start from one store and keep the first order flow focused."
        actionLabel="Browse stores"
        onActionPress={onContinue}
      />
    );
  }

  if (state === 'offline') {
    return <BthStateView stateId="offline" onActionPress={onRetry} />;
  }

  if (state === 'disabled') {
    return (
      <BthStateView
        stateId="warning"
        title="Cart is temporarily unavailable"
        description="This step is currently paused. Keep fallback and retry visible."
        actionLabel="Retry"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <BthStateView
      stateId="recoverableError"
      title="Cart could not be loaded"
      description="Retry first. If the issue continues, use a safe fallback path."
      actionLabel="Retry"
      onActionPress={onRetry}
    />
  );
}

export default function DshCartGetScreen({
  state = 'ready',
  store,
  activeOrder,
  items,
  statusTitle = 'Ready for checkout',
  statusDescription = 'Review your order and continue to the next step.',
  onOpenStore,
  onOpenOrder,
  onRetry,
  onContinue,
}: DshCartGetScreenProps) {
  if (state !== 'ready') {
    return renderNonReadyState(state, onRetry, onContinue);
  }

  if (!store || !activeOrder) {
    return (
      <BthStateView
        stateId="blockingError"
        title="Cart data contract is missing"
        description="Store and active order summaries are required for ready state."
      />
    );
  }

  const parseAmount = (meta?: string) => {
    if (!meta) return 0;
    try {
      const digits = String(meta).replace(/[^0-9.,-]/g, '').replace(',', '.');
      const n = parseFloat(digits);
      return Number.isFinite(n) ? n : 0;
    } catch {
      return 0;
    }
  };

  type CartItem = {
    id: string;
    title: string;
    subtitle?: string;
    priceValue: number; // in SAR
    qty: number;
  };

  const initialItems = useMemo<CartItem[]>(() => {
    if (Array.isArray(items) && items.length) {
      return items.map((it) => ({
        id: it.id,
        title: it.title,
        subtitle: it.subtitle,
        priceValue: Number(it.priceValue ?? 0) || 0,
        qty: Math.max(1, Math.floor(Number(it.qty ?? 1) || 1)),
      }));
    }

    if (!activeOrder) return [];

    try {
      const parsed = JSON.parse(activeOrder.meta ?? 'null');
      if (Array.isArray(parsed) && parsed.length) {
        return parsed.map((it: any, idx: number) => ({
          id: it.id ?? `${activeOrder.id}-line-${idx}`,
          title: it.title ?? activeOrder.title ?? 'Item',
          subtitle: it.subtitle ?? undefined,
          priceValue: Number(it.priceValue ?? parseAmount(it.meta) ?? 0) || 0,
          qty: Math.max(1, Number(it.qty ?? 1) || 1),
        }));
      }
    } catch {
      // ignore
    }

    return [
      {
        id: `${activeOrder.id}-line`,
        title: activeOrder.title,
        subtitle: activeOrder.subtitle,
        priceValue: parseAmount(activeOrder.meta),
        qty: 1,
      },
    ];
  }, [items, activeOrder]);

  const [cartItems, setCartItems] = useState<CartItem[]>(initialItems);
  useEffect(() => setCartItems(initialItems), [initialItems]);

  const toHalalas = (value: number) => Math.round(value * 100);
  const fromHalalas = (halalas: number) => halalas / 100;

  const totalHalalas = useMemo(() => cartItems.reduce((acc, it) => acc + toHalalas(it.priceValue) * it.qty, 0), [cartItems]);
  const totalAmount = fromHalalas(totalHalalas);
  const formattedTotal = useMemo(() => {
    try {
      return new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(totalAmount);
    } catch {
      return `${totalAmount} ر.س`;
    }
  }, [totalAmount]);

  const [showCartDetails, setShowCartDetails] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const actionBarBottomPadding = spacing[4] + sizes.controlMd + (safeArea.comfortable ?? 0) + spacing[3];

  const updateItem = useCallback((id: string, patch: Partial<CartItem>) => {
    setCartItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }, []);

  const removeItem = useCallback((id: string) => {
    setCartItems((prev) => prev.filter((it) => it.id !== id));
  }, []);

  const increaseQty = useCallback((id: string) => updateItem(id, { qty: (cartItems.find((i) => i.id === id)?.qty ?? 1) + 1 }), [cartItems, updateItem]);
  const decreaseQty = useCallback((id: string) => {
    const current = cartItems.find((i) => i.id === id);
    if (!current) return;
    const next = Math.max(1, current.qty - 1);
    updateItem(id, { qty: next });
  }, [cartItems, updateItem]);

  return (
    <View style={{ flex: 1 }}>
      <BthMobileScrollView padding={4} gap={3} style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: actionBarBottomPadding }}>
        <BthSurface tone="inset" gap={2}>
          <BthBox gap={1}>
            <BthText role="bodySm" tone="muted">المجموع</BthText>
            <BthText role="titleLg" style={{ fontWeight: '700' }}>{formattedTotal}</BthText>
          </BthBox>
        </BthSurface>

        <BthSurface tone="raised" gap={2}>
          <BthSectionHeader title="السلة" subtitle={`عناصر: ${cartItems.length}`} />

          {cartItems.length === 0 ? (
            <BthBox gap={2}>
              <BthText role="bodySm" tone="muted">السلة فارغة. أضف عناصرًا بالأسفل.</BthText>
            </BthBox>
          ) : (
            cartItems.map((item) => {
              const formattedUnitPrice = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(item.priceValue);
              const lineTotal = item.priceValue * item.qty;
              const formattedLineTotal = new Intl.NumberFormat('ar-SA', { style: 'currency', currency: 'SAR' }).format(lineTotal);
              const subtitleWithPrice = item.subtitle ? `${item.subtitle} · ${formattedUnitPrice}` : formattedUnitPrice;

              return (
                <BthCard key={item.id} title={item.title} subtitle={subtitleWithPrice}>
                  <BthBox gap={2} layoutDirection="row" style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                    {editingId === item.id ? (
                      <BthBox gap={2} style={{ flex: 1 }}>
                        <BthTextField label="اسم العنصر" value={item.title} onChangeText={(v) => updateItem(item.id, { title: v })} />
                        <BthTextField label="السعر (ر.س)" value={String(item.priceValue)} onChangeText={(v) => updateItem(item.id, { priceValue: Number(String(v).replace(/[^0-9.,-]/g, '').replace(',', '.')) || 0 })} keyboardType="decimal-pad" />
                        <BthTextField label="الكمية" value={String(item.qty)} onChangeText={(v) => updateItem(item.id, { qty: Math.max(1, Math.floor(Number(v) || 1)) })} keyboardType="number-pad" />
                        <BthBox gap={2}>
                          <BthButton label="حفظ" onPress={() => setEditingId(null)} />
                          <BthButton label="إلغاء" tone="secondary" onPress={() => setEditingId(null)} />
                        </BthBox>
                      </BthBox>
                    ) : (
                      <BthBox gap={1} style={{ flex: 1 }}>
                        <BthBox layoutDirection="row" gap={2} style={{ alignItems: 'center', marginTop: 8 }}>
                          <BthButton label="-" tone="ghost" size="sm" fullWidth={false} onPress={() => decreaseQty(item.id)} />
                          <BthText role="bodyMd">{item.qty}</BthText>
                          <BthButton label="+" tone="ghost" size="sm" fullWidth={false} onPress={() => increaseQty(item.id)} />
                          <BthText role="bodyMd" tone="muted" style={{ marginStart: 12 }}>{formattedLineTotal}</BthText>
                        </BthBox>
                      </BthBox>
                    )}

                    <BthBox gap={1} style={{ alignItems: 'flex-end' }}>
                      <BthButton label="تعديل" tone="ghost" size="sm" fullWidth={false} onPress={() => setEditingId(item.id)} />
                      <BthButton label="حذف" tone="danger" size="sm" fullWidth={false} onPress={() => removeItem(item.id)} />
                    </BthBox>
                  </BthBox>
                </BthCard>
              );
            })
          )}

        </BthSurface>

      </BthMobileScrollView>

      <StickyActionBar
        fixed
        primaryLabel={`إتمام الطلب — ${formattedTotal}`}
        primaryOnPress={() => {
          if (onContinue) {
            onContinue();
          } else {
            setShowCartDetails(true);
          }
        }}
        total={formattedTotal}
      />

      <CartDetails
        visible={showCartDetails}
        onClose={() => setShowCartDetails(false)}
        items={cartItems.map((it) => ({ id: it.id, title: it.title, subtitle: it.subtitle, qty: it.qty, price: it.priceValue }))}
        onCheckout={() => {
          setShowCartDetails(false);
          onContinue && onContinue();
        }}
      />
    </View>
  );
}
