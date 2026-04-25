import React, { useMemo, useState } from 'react';
import { Dimensions, I18nManager, Platform, StatusBar, View, useWindowDimensions } from 'react-native';
import {
  Chip,
  Button,
  Card,
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
import { DshCartDetails } from '../components/DshCartDetails';

const PAGE_BG = colorPalette.pageBackground;
const SURFACE_SOFT = colorPalette.surfaceSecondary;
const BORDER_SOFT = colorPalette.borderSubtle;
const TEXT_PRIMARY = colorPalette.textPrimary;
const TEXT_SECONDARY = colorPalette.textSecondary;
const ACCENT_BLUE = colorPalette.accentBlue;
const ACCENT_ORANGE = colorPalette.accentOrange;
const CTA_PRIMARY = colorPalette.ctaPrimary;
const CTA_SECONDARY = colorPalette.ctaSecondary;
const SURFACE_WARM = colorPalette.brandSoft;
const SURFACE_WARM_BORDER = colorPalette.brandSurface;
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

type ExecutionScheduleOption = {
  value: string;
  label: string;
  fullLabel: string;
};

type ExecutionScheduleOptions = {
  dateOptions: ExecutionScheduleOption[];
  timeOptions: ExecutionScheduleOption[];
};

function padSchedulePart(value: number) {
  return String(value).padStart(2, '0');
}

function createExecutionScheduleOptions(referenceDate = new Date()): ExecutionScheduleOptions {
  const dateChipFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'short', day: 'numeric' });
  const dateSummaryFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeFormatter = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit' });

  const dateOptions = Array.from({ length: 4 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(referenceDate.getDate() + index + 1);

    return {
      value: `${date.getFullYear()}-${padSchedulePart(date.getMonth() + 1)}-${padSchedulePart(date.getDate())}`,
      label: index === 0 ? 'غدًا' : index === 1 ? 'بعد غد' : dateChipFormatter.format(date).replace('،', '').trim(),
      fullLabel: dateSummaryFormatter.format(date),
    };
  });

  const timeOptions = [9, 11, 13, 15, 17, 19].map((hour) => {
    const time = new Date(referenceDate);
    time.setHours(hour, 0, 0, 0);

    return {
      value: `${padSchedulePart(time.getHours())}:${padSchedulePart(time.getMinutes())}`,
      label: timeFormatter.format(time),
      fullLabel: timeFormatter.format(time),
    };
  });

  return { dateOptions, timeOptions };
}

type ExecutionSchedulePickerProps = {
  dateOptions: ExecutionScheduleOption[];
  timeOptions: ExecutionScheduleOption[];
  selectedDate: string;
  selectedTime: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
};

function ExecutionSchedulePicker({ dateOptions, timeOptions, selectedDate, selectedTime, onDateChange, onTimeChange }: ExecutionSchedulePickerProps) {
  const isRTL = I18nManager.isRTL;
  const resolvedDate = dateOptions.find((option) => option.value === selectedDate) ?? dateOptions[0];
  const resolvedTime = timeOptions.find((option) => option.value === selectedTime) ?? timeOptions[0];

  return (
    <Surface tone="default" padding={2} gap={1} style={{ backgroundColor: SURFACE_SOFT, borderColor: BORDER_SOFT }}>
      <View style={{ gap: spacing[1] }}>
        <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700' }}>
          التاريخ
        </Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: spacing[1] }}>
          {dateOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={option.value === resolvedDate?.value}
              tone="brand"
              onPress={() => onDateChange(option.value)}
            />
          ))}
        </View>
      </View>

      <View style={{ gap: spacing[1] }}>
        <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700' }}>
          الوقت
        </Text>
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', flexWrap: 'wrap', gap: spacing[1] }}>
          {timeOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={option.value === resolvedTime?.value}
              tone="brand"
              onPress={() => onTimeChange(option.value)}
            />
          ))}
        </View>
      </View>

      {resolvedDate && resolvedTime ? (
        <Surface tone="default" padding={1} gap={0} style={{ backgroundColor: SURFACE_WARM, borderColor: SURFACE_WARM_BORDER }}>
          <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '600' }}>
            سيتم تنفيذ الطلب {resolvedDate.fullLabel} عند {resolvedTime.fullLabel}
          </Text>
        </Surface>
      ) : null}
    </Surface>
  );
}

function PromoBanner() {
  const isRTL = I18nManager.isRTL;

  return (
    <Surface
      tone="default"
      padding={2}
      style={{
        backgroundColor: SURFACE_WARM,
        borderWidth: 1,
        borderColor: SURFACE_WARM_BORDER,
        borderRadius: 16,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        minHeight: 60,
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', minHeight: 36 }}>
        <View style={{ width: 84, alignItems: 'center' }}>
          <View style={{ width: 84, height: 34, borderRadius: 17, backgroundColor: CTA_PRIMARY, alignItems: 'center', justifyContent: 'center' }}>
            <Text role="bodySm" style={{ color: colorPalette.white, fontWeight: '700' }}>
              اشترك الآن
            </Text>
          </View>
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing[2], alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, textAlign: 'center', lineHeight: 18 }}>
            اشترك بخدمة بثواني برو لا ستفاده من افضل العروض
          </Text>
        </View>

        <View style={{ width: 24, alignItems: 'center' }}>
          <Icon name="ribbon-outline" size={14} color={ACCENT_ORANGE} />
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
    <Surface
      tone="default"
      padding={1}
      gap={0}
      style={{
        backgroundColor: checked ? SURFACE_WARM : SURFACE_SOFT,
        borderColor: checked ? ACCENT_ORANGE : BORDER_SOFT,
        borderWidth: 1,
      }}
    >
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
    <View style={{ width: 132, borderRadius: 18, overflow: 'hidden', backgroundColor: colorPalette.surfacePrimary, borderWidth: 1, borderColor: BORDER_SOFT }}>
      <View style={{ height: 96, backgroundColor: SURFACE_SOFT, position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: colorPalette.white, shadowColor: colorPalette.black, shadowOpacity: 0.06, shadowRadius: 8, elevation: 1, alignItems: 'center', justifyContent: 'center' }}>
          <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colorPalette.brandSoft }} />
        </View>

        <View style={{ position: 'absolute', bottom: 6, left: 6, borderRadius: 8, backgroundColor: ACCENT_ORANGE, paddingHorizontal: 8, paddingVertical: 3 }}>
          <Text role="bodySm" style={{ color: colorPalette.white, fontWeight: '700' }}>
            {price}
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: spacing[2], paddingTop: spacing[1], paddingBottom: spacing[1] }}>
        <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>
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
    <Surface tone="default" padding={2} gap={1} style={{ backgroundColor: SURFACE_SOFT, borderColor: BORDER_SOFT }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <Text role="bodyMd" style={{ color: ACCENT_BLUE, fontWeight: '600' }}>
          عرض الكل
        </Text>
        <Text role="bodyMd" style={{ color: TEXT_PRIMARY, fontWeight: '600' }}>
          قد تعجبك هذه المنتجات أيضاً
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing[1], overflow: 'hidden', paddingTop: spacing[0] }}>
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
      padding={2}
      gap={1}
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
      <View style={{ borderWidth: 1, borderColor: BORDER_SOFT, borderRadius: 16, overflow: 'hidden', backgroundColor: colorPalette.surfacePrimary }}>
        <View style={{ flexDirection: 'row-reverse', backgroundColor: SURFACE_SOFT, borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0] }}>
          <View style={{ flex: 3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'right' }}>المنتج</Text>
          </View>
          <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'center' }}>السعر</Text>
          </View>
          <View style={{ flex: 1, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'center' }}>الكمية</Text>
          </View>
          <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ fontWeight: '700', color: TEXT_PRIMARY, textAlign: 'center' }}>الإجمالي</Text>
          </View>
        </View>

        {items.map((item) => (
          <View key={item.id} style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0] }}>
            <View style={{ flex: 3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'right' }}>{item.title}</Text>
            </View>
            <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>{formatAmount(item.priceValue ?? 0)}</Text>
            </View>
            <View style={{ flex: 1, paddingHorizontal: spacing[1], alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY }}>{item.qty ?? 1}</Text>
            </View>
            <View style={{ flex: 1.3, paddingHorizontal: spacing[1] }}>
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>{formatAmount((item.priceValue ?? 0) * (item.qty ?? 1))}</Text>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}

export default function DshCartUnifiedScreen(props: any) {
  const { height: windowHeight } = useWindowDimensions();
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
  const executionScheduleOptions = useMemo(() => createExecutionScheduleOptions(), []);
  const [scheduledDate, setScheduledDate] = useState(() => executionScheduleOptions.dateOptions[0]?.value ?? '');
  const [scheduledTime, setScheduledTime] = useState(() => executionScheduleOptions.timeOptions[0]?.value ?? '');
  const [cartDetailsVisible, setCartDetailsVisible] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

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
  const androidSystemBottomInset = Platform.OS === 'android'
    ? Math.max(0, Dimensions.get('screen').height - windowHeight - (StatusBar.currentHeight ?? 0))
    : safeArea.comfortable;
  const footerBottomInset = androidSystemBottomInset + spacing[2];
  const resolvedFooterHeight = footerHeight > 0 ? footerHeight : sizes.controlMd + spacing[3];
  const actionBarBottomPadding = footerBottomInset + resolvedFooterHeight + spacing[4];

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
          <Text style={{ color: TEXT_PRIMARY, fontSize: 17, fontWeight: '900', lineHeight: 20, maxWidth: '100%', flexShrink: 1, minWidth: 0, textAlign: 'center' }} numberOfLines={1}>
            تأكيد الطلب
          </Text>
        )}
        actions={[
          {
            id: 'clear-cart',
            icon: <Icon name="trash-outline" size={20} color={ACCENT_BLUE} />,
            accessibilityLabel: 'تفريغ السلة',
            onPress: () => setItems([]),
          },
        ]}
        trailingAction={{
          id: 'exit-checkout',
          icon: <Icon name="arrow-back" size={24} color={ACCENT_ORANGE} />,
          mirrorInRtl: true,
          accessibilityLabel: 'الرجوع',
          onPress: () => props.onExit?.(),
        }}
      />

      <MobileScrollView fill padding={1} gap={1} contentContainerStyle={{ paddingBottom: actionBarBottomPadding }}>
        <PromoBanner />

        <Card title="الخيارات السريعة" subtitle="القسيمة والعنوان والملاحظات" padding={2} gap={1}>
          <View style={{ gap: spacing[1] }}>
            <OptionRow title="هل لديك قسيمة تخفيض؟" actionLabel="إضافة" onAction={() => {}} style={{ backgroundColor: SURFACE_SOFT, borderWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0], paddingHorizontal: spacing[2] }} />
            <OptionRow title="عنوان التوصيل" subtitle={pickupAddr} actionLabel="تغيير" onAction={() => {}} style={{ backgroundColor: SURFACE_SOFT, borderWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0], paddingHorizontal: spacing[2] }} />
            <OptionRow title="ملاحظات الطلب" subtitle={note} actionLabel="إضافة" onAction={() => {}} style={{ backgroundColor: SURFACE_SOFT, borderWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0], paddingHorizontal: spacing[2] }} />
            <OptionRow
              title="طلب إضافي على الطريق"
              subtitle="مثال: بسبس أو ماء من أي ماركت على طريق الكابتن"
              actionLabel="إضافة"
              onAction={() => {}}
              style={{ backgroundColor: SURFACE_SOFT, borderWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[0], paddingHorizontal: spacing[2] }}
            />
          </View>
        </Card>

        <Card title="وقت التنفيذ" subtitle="اختر وقت تنفيذ الطلب" padding={2} gap={1}>
          <View style={{ gap: spacing[1] }}>
            <SegmentedControl
              options={[
                { value: 'now', label: 'الآن' },
                { value: 'later', label: 'في وقت لاحق' },
              ]}
              value={scheduling}
              onValueChange={(nextValue) => {
                setScheduling(nextValue);
                if (nextValue === 'later') {
                  setScheduledDate((current) => current || (executionScheduleOptions.dateOptions[0]?.value ?? ''));
                  setScheduledTime((current) => current || (executionScheduleOptions.timeOptions[0]?.value ?? ''));
                }
              }}
              size="sm"
              style={{ backgroundColor: SURFACE_SOFT, borderColor: BORDER_SOFT, padding: spacing[0] }}
            />
            {scheduling === 'now' ? (
              <Text role="caption" style={{ color: TEXT_SECONDARY }}>
                سيتم تنفيذ الطلب مباشرة بعد اعتماد السلة.
              </Text>
            ) : (
              <ExecutionSchedulePicker
                dateOptions={executionScheduleOptions.dateOptions}
                timeOptions={executionScheduleOptions.timeOptions}
                selectedDate={scheduledDate}
                selectedTime={scheduledTime}
                onDateChange={setScheduledDate}
                onTimeChange={setScheduledTime}
              />
            )}
          </View>
        </Card>

        <Card title="الدفع" subtitle="اختر وسيلة الدفع المناسبة" padding={2} gap={1}>
          <View style={{ gap: spacing[1] }}>
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
          padding={2}
          gap={1}
          items={[
            { label: 'الإجمالي', value: formattedSubtotal },
            { label: 'التوصيل', value: formattedDelivery },
          ]}
          totalLabel="الإجمالي الكلي"
          totalValue={formattedGrandTotal}
        />

        <ItemsTable items={items} onOpenDetails={() => setCartDetailsVisible(true)} />
      </MobileScrollView>

      <View
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
        style={{ position: 'absolute', left: 0, right: 0, bottom: footerBottomInset, paddingHorizontal: spacing[2], paddingTop: spacing[1], paddingBottom: spacing[1], backgroundColor: colorPalette.surfacePrimary, borderTopWidth: 1, borderColor: BORDER_SOFT, zIndex: 5, elevation: 4 }}
      >
        <View style={{ flexDirection: 'row', gap: spacing[1] }}>
          <Button label="تنفيذ الطلب" size="md" fullWidth={false} onPress={checkoutAction} style={{ flex: 1, minHeight: 46, backgroundColor: CTA_PRIMARY, borderColor: CTA_PRIMARY, borderRadius: 16 }} />
          <Button label="تعديل الطلب" tone="secondary" size="md" fullWidth={false} onPress={editAction} style={{ flex: 1, minHeight: 46, backgroundColor: CTA_SECONDARY, borderColor: BORDER_SOFT, borderRadius: 16 }} />
        </View>
      </View>

      <DshCartDetails
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
