import React, { useMemo, useState } from 'react';
import { I18nManager, View } from 'react-native';
import {
  Button,
  Card,
  CartDetails,
  colorPalette,
  Icon,
  MobileScrollView,
  OptionRow,
  Radio,
  safeArea,
  SegmentedControl,
  sizes,
  spacing,
  SummaryCard,
  Surface,
  Text,
  TopBar,
} from '@bthwani/ui-kit';

const HEADER_RED = colorPalette.brandStrong ?? colorPalette.brand ?? '#F97316';
const SURFACE_PINK = colorPalette.brandSoft ?? '#FFF7ED';
const SURFACE_PINK_BORDER = colorPalette.brandSurface ?? '#FDBA74';
const ACCENT_GOLD = colorPalette.brand ?? '#F97316';
const TEXT_DARK = colorPalette.ink ?? '#243247';
const PAGE_BG = '#F9FAFB';
const STORAGE_KEY_BALANCE = 'dsh_bth_wallet_balance';

function formatAmount(value: number) {
  try {
    return new Intl.NumberFormat('ar-YE', { style: 'currency', currency: 'YER' }).format(value);
  } catch {
    return `${value} ر.ي`;
  }
}

function ensureBalanceLocal() {
  try {
    if (!localStorage.getItem(STORAGE_KEY_BALANCE)) {
      localStorage.setItem(STORAGE_KEY_BALANCE, String(10000));
    }
  } catch {
    // ignore
  }
}

async function localGetWalletBalance() {
  try {
    ensureBalanceLocal();
    return Number(localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0');
  } catch {
    return 0;
  }
}

async function localTopUpWallet(amountHalalas: number) {
  ensureBalanceLocal();
  const bal = Number(localStorage.getItem(STORAGE_KEY_BALANCE) ?? '0');
  const newBal = bal + amountHalalas;
  localStorage.setItem(STORAGE_KEY_BALANCE, String(newBal));
  await new Promise((resolve) => setTimeout(resolve, 220));
  return { success: true, balance: newBal };
}

function PromoBanner() {
  const isRTL = I18nManager.isRTL;

  return (
    <Surface
      tone="default"
      padding={2}
      style={{
        backgroundColor: SURFACE_PINK,
        borderWidth: 1,
        borderColor: SURFACE_PINK_BORDER,
        borderRadius: 16,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[2],
        minHeight: 72,
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', minHeight: 40 }}>
        <View style={{ width: 86, alignItems: 'center' }}>
          <View style={{ width: 86, height: 36, borderRadius: 18, backgroundColor: HEADER_RED, alignItems: 'center', justifyContent: 'center' }}>
            <Text role="bodySm" style={{ color: colorPalette.white, fontWeight: '700' }}>
              اشترك الآن
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing[2], alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyMd" style={{ color: TEXT_DARK, textAlign: 'center', lineHeight: 19 }}>
            اشترك بخدمة بثواني برو لا ستفاده من افضل العروض
          </Text>
        </View>

        <View style={{ width: 24, alignItems: 'center' }}>
          <Icon name="ribbon-outline" size={14} color={ACCENT_GOLD} />
        </View>
      </View>
    </Surface>
  );
}

type PaymentOptionCardProps = {
  title: string;
  subtitle: string;
  checked: boolean;
  onSelect: () => void;
  actionLabel?: string;
  onAction?: () => void;
};

function PaymentOptionCard({ title, subtitle, checked, onSelect, actionLabel, onAction }: PaymentOptionCardProps) {
  return (
    <Surface tone={checked ? 'raised' : 'inset'} padding={2} gap={2} borderTone={checked ? 'brand' : 'line'}>
      <Radio label={title} description={subtitle} selected={checked} onSelect={onSelect} />

      {actionLabel ? (
        <Button
          label={actionLabel}
          tone="secondary"
          size="sm"
          fullWidth={false}
          onPress={onAction ?? onSelect}
          style={{ alignSelf: 'flex-start' }}
        />
      ) : null}
    </Surface>
  );
}

type RecommendationCardProps = {
  title: string;
  price: string;
};

function RecommendationCard({ title, price }: RecommendationCardProps) {
  return (
    <View style={{ width: 146, borderRadius: 18, overflow: 'hidden', backgroundColor: colorPalette.white, borderWidth: 1, borderColor: colorPalette.line ?? '#E5E7EB' }}>
      <View style={{ height: 118, backgroundColor: colorPalette.surfaceInset ?? '#F8FAFC', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 82, height: 82, borderRadius: 41, backgroundColor: colorPalette.white, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#FDE68A' }} />
        </View>

        <View style={{ position: 'absolute', bottom: 8, left: 8, borderRadius: 8, backgroundColor: ACCENT_GOLD, paddingHorizontal: 10, paddingVertical: 4 }}>
          <Text role="bodySm" style={{ color: '#111827', fontWeight: '600' }}>
            {price}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing[2], paddingTop: spacing[1], paddingBottom: spacing[2] }}>
        <Text role="bodySm" style={{ color: TEXT_DARK, textAlign: 'center' }}>
          {title}
        </Text>
      </View>
    </View>
  );
}

function RecommendedSection() {
  const products = [
    { id: 'r1', title: 'كيس خبز', price: '100' },
    { id: 'r2', title: 'دجاج بروست', price: '1,500' },
    { id: 'r3', title: 'بطاطس', price: '250' },
  ];

  return (
    <Surface tone="inset" padding={2} gap={1}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text role="bodyMd" style={{ color: HEADER_RED, fontWeight: '600' }}>
          عرض الكل
        </Text>
        <Text role="bodyMd" style={{ color: TEXT_DARK, fontWeight: '600' }}>
          قد تعجبك هذه المنتجات أيضاً
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing[1], overflow: 'hidden' }}>
        {products.map((product) => (
          <RecommendationCard key={product.id} title={product.title} price={product.price} />
        ))}
      </View>
    </Surface>
  );
}

type ItemsTableProps = {
  items: Array<{ id: string; title: string; priceValue?: number; qty?: number }>;
  onOpenDetails: () => void;
};

function ItemsTable({ items, onOpenDetails }: ItemsTableProps) {
  return (
    <Card
      title="تفاصيل السلة"
      subtitle={`عناصر: ${items.length}`}
      footer={(
        <Button
          label="التفاصيل"
          tone="secondary"
          size="sm"
          fullWidth={false}
          onPress={onOpenDetails}
        />
      )}
    >
      <View style={{ borderWidth: 1, borderColor: colorPalette.line ?? '#CFCFCF', borderRadius: 16, overflow: 'hidden', backgroundColor: colorPalette.white }}>
        <View style={{ flexDirection: 'row-reverse', backgroundColor: colorPalette.surfaceInset ?? '#FAFAFA', borderBottomWidth: 1, borderColor: colorPalette.line ?? '#CFCFCF', paddingVertical: spacing[1] }}>
          <View style={{ flex: 3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'right' }}>المنتج</Text>
          </View>
          <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'center' }}>السعر</Text>
          </View>
          <View style={{ flex: 1, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'center' }}>الكمية</Text>
          </View>
          <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'center' }}>الإجمالي</Text>
          </View>
        </View>

        {items.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: colorPalette.line ?? '#D9D9D9', paddingVertical: spacing[1] }}>
            <View style={{ flex: 3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_DARK, textAlign: 'right' }}>{item.title}</Text>
            </View>
            <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_DARK, textAlign: 'center' }}>{formatAmount(item.priceValue ?? 0)}</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: spacing[1], alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_DARK }}>{item.qty ?? 1}</Text>
            </View>
            <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_DARK, textAlign: 'center' }}>{formatAmount((item.priceValue ?? 0) * (item.qty ?? 1))}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

export default function DshCartUnifiedScreen(props: any) {
  const [items, setItems] = useState<any[]>(
    props.items ?? [
      { id: 'p1', title: 'دجاج فحم تركي مع التوابع', priceValue: 3000, qty: 1 },
      { id: 'p2', title: 'كريسبي رول مفرد', priceValue: 1500, qty: 2 },
      { id: 'p3', title: 'فتة دخن بالقشطة والعسل', priceValue: 1700, qty: 3 },
      { id: 'p4', title: 'فتة بالقشطة والعسل', priceValue: 1500, qty: 1 },
    ],
  );

  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'wallet' | 'mixed' | 'main-wallets'>('cod');
  const [walletBalance, setWalletBalance] = useState<number | null>(null);
  const [pickupAddr] = useState('جوار الجبل الجديد');
  const [note] = useState('لا يوجد ملاحظة');
  const [scheduling, setScheduling] = useState<'now' | 'later'>('now');
  const [cartDetailsVisible, setCartDetailsVisible] = useState(false);

  const checkoutAction = props.onContinue ?? props.onOpenOrder ?? (() => {});
  const editAction = props.onOpenOrder ?? props.onContinue ?? (() => {});

  const subtotalHalalas = useMemo(
    () => items.reduce((acc, item) => acc + Math.round((item.priceValue ?? 0) * 100) * (item.qty ?? 1), 0),
    [items],
  );
  const subtotalAmount = subtotalHalalas / 100;
  const deliveryAmount = 950;
  const grandTotalAmount = subtotalAmount + deliveryAmount;
  const formattedSubtotal = formatAmount(subtotalAmount);
  const formattedDelivery = formatAmount(deliveryAmount);
  const formattedGrandTotal = formatAmount(grandTotalAmount);
  const footerBottomInset = safeArea.spacious ?? safeArea.comfortable ?? 0;
  const actionBarBottomPadding = footerBottomInset + sizes.controlMd + spacing[4];

  const updateItemQty = (id: string, qty: number) => {
    if (qty <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== id));
      return;
    }

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <TopBar
        variant="secondary"
        title="تأكيد الطلب"
        titleSlot={(
          <Text style={{ color: TEXT_DARK, fontSize: 17, fontWeight: '900', lineHeight: 20, maxWidth: '100%', flexShrink: 1, minWidth: 0, textAlign: 'center' }} numberOfLines={1}>
            تأكيد الطلب
          </Text>
        )}
        actions={[
          {
            id: 'clear-cart',
            icon: <Icon name="trash-outline" size={20} color={TEXT_DARK} />,
            accessibilityLabel: 'تفريغ السلة',
            onPress: () => setItems([]),
          },
        ]}
        trailingAction={{
          id: 'exit-checkout',
          icon: <Icon name="arrow-back" size={24} color={ACCENT_GOLD} />,
          mirrorInRtl: true,
          accessibilityLabel: 'الرجوع',
          onPress: () => props.onExit?.(),
        }}
      />

      <MobileScrollView fill padding={2} gap={2} contentContainerStyle={{ paddingBottom: actionBarBottomPadding }}>
        <PromoBanner />

        <Card title="الخيارات السريعة" subtitle="القسيمة والعنوان والملاحظات">
          <View style={{ gap: spacing[2] }}>
            <OptionRow title="هل لديك قسيمة تخفيض؟" actionLabel="إضافة" onAction={() => {}} />
            <OptionRow title="عنوان التوصيل" subtitle={pickupAddr} actionLabel="تغيير" onAction={() => {}} />
            <OptionRow title="ملاحظات الطلب" subtitle={note} actionLabel="إضافة" onAction={() => {}} />
            <OptionRow
              title="طلب إضافي على الطريق"
              subtitle="مثال: بسبس أو ماء من أي ماركت على طريق الكابتن"
              actionLabel="إضافة"
              onAction={() => {}}
            />
          </View>
        </Card>

        <Card title="وقت التنفيذ" subtitle="اختر وقت تنفيذ الطلب">
          <View style={{ gap: spacing[2] }}>
            <SegmentedControl
              options={[
                { value: 'now', label: 'الآن' },
                { value: 'later', label: 'في وقت لاحق' },
              ]}
              value={scheduling}
              onValueChange={(nextValue) => setScheduling(nextValue)}
              size="md"
            />
            <Text role="caption" tone="muted">
              {scheduling === 'now' ? 'سيتم تنفيذ الطلب مباشرة' : 'سيتم تنفيذ الطلب في الوقت الذي اخترته'}
            </Text>
          </View>
        </Card>

        <Card title="الدفع" subtitle="اختر وسيلة الدفع المناسبة">
          <View style={{ gap: spacing[2] }}>
            <PaymentOptionCard
              title="الدفع عند الاستلام"
              subtitle="ادفع نقدًا عند استلام الطلب"
              checked={paymentMethod === 'cod'}
              onSelect={() => setPaymentMethod('cod')}
            />

            <PaymentOptionCard
              title="الدفع من رصيد المحفظة"
              subtitle={`الرصيد ${(walletBalance ?? 0) / 100} · محفظتنا WLT`}
              checked={paymentMethod === 'wallet'}
              actionLabel="إضافة رصيد"
              onSelect={() => setPaymentMethod('wallet')}
              onAction={async () => {
                await localTopUpWallet(5000);
                const balance = await localGetWalletBalance();
                setWalletBalance(balance);
                setPaymentMethod('wallet');
              }}
            />

            <PaymentOptionCard
              title="مدمج ( كاش + محفظة )"
              subtitle="ادفع جزءًا بالمحفظة والباقي عند الاستلام"
              checked={paymentMethod === 'mixed'}
              onSelect={() => setPaymentMethod('mixed')}
            />

            <PaymentOptionCard
              title="المحافظ الرئيسية"
              subtitle="اختر المحفظة الرسمية ثم اشحن رصيدك"
              checked={paymentMethod === 'main-wallets'}
              actionLabel="شحن رصيد"
              onSelect={() => setPaymentMethod('main-wallets')}
              onAction={async () => {
                await localTopUpWallet(5000);
                const balance = await localGetWalletBalance();
                setWalletBalance(balance);
                setPaymentMethod('main-wallets');
              }}
            />
          </View>
        </Card>

        <RecommendedSection />

        <SummaryCard
          items={[
            { label: 'الإجمالي', value: formattedSubtotal },
            { label: 'التوصيل', value: formattedDelivery },
          ]}
          totalLabel="الإجمالي الكلي"
          totalValue={formattedGrandTotal}
        />

        <ItemsTable items={items} onOpenDetails={() => setCartDetailsVisible(true)} />
      </MobileScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: footerBottomInset, paddingHorizontal: spacing[2], paddingTop: spacing[1], paddingBottom: spacing[2], backgroundColor: colorPalette.white, borderTopWidth: 1, borderColor: '#D6D6D6' }}>
        <View style={{ flexDirection: 'row', gap: spacing[1] }}>
          <Button label="تنفيذ الطلب" size="md" fullWidth={false} onPress={checkoutAction} style={{ flex: 1, minHeight: 46, backgroundColor: HEADER_RED, borderRadius: 16 }} />
          <Button label="تعديل الطلب" tone="secondary" size="md" fullWidth={false} onPress={editAction} style={{ flex: 1, minHeight: 46, borderRadius: 16 }} />
        </View>
      </View>

      <CartDetails
        visible={cartDetailsVisible}
        onClose={() => setCartDetailsVisible(false)}
        currency="YER"
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          subtotal: (item.priceValue ?? 0) * (item.qty ?? 1),
          qty: item.qty,
          price: item.priceValue,
        }))}
        onChangeQty={updateItemQty}
        onRemove={removeItem}
        onCheckout={() => {
          setCartDetailsVisible(false);
          checkoutAction();
        }}
      />
    </View>
  );
}
