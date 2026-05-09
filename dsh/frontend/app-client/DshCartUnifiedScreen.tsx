import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, I18nManager, Platform, Pressable, View } from 'react-native';
import {
  Button,
  Card,
  Chip,
  colorPalette,
  Icon,
  MobileScrollView,
  OptionRow,
  PaymentDecisionList,
  safeArea,
  SegmentedControl,
  SheetFrame,
  sizes,
  spacing,
  SummaryCard,
  Surface,
  Text,
  TextField,
  Toast,
  TopBar,
  type PaymentDecisionOption,
} from '@bthwani/ui-kit';
import { DshCartDetails } from './DshCartDetails';
import { getDshClientStateMeta, type DshClientState } from './dshClientStateModel';
import { resolveDshFinanceEventKindForPayment, type DshFinanceEventKind } from '../shared/dshFinancePreviewModel';
import useWlt from '../../../wlt/frontend/app-client/dsh/hooks/useWlt';

const PAGE_BG = colorPalette.pageBackground;
const SURFACE_SOFT = colorPalette.surfaceSecondary;
const BORDER_SOFT = colorPalette.borderSubtle;
const TEXT_PRIMARY = colorPalette.textPrimary;
const TEXT_SECONDARY = colorPalette.textSecondary;
const ACCENT_BLUE = colorPalette.accentBlue;
const ACCENT_ORANGE = colorPalette.accentOrange;
const CTA_PRIMARY = colorPalette.accentOrange;
const CTA_SECONDARY = colorPalette.ctaSecondary;
const SURFACE_WARM = colorPalette.brandSoft;
const SURFACE_WARM_BORDER = colorPalette.brandSurface;

type ScreenNotice = {
  title: string;
  description?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
};

type QuickActionKey = 'coupon' | 'address' | 'note' | 'extra';

type QuickActionMeta = {
  title: string;
  placeholder: string;
  helper?: string;
  saveLabel: string;
  multiline?: boolean;
};

type RecommendationProduct = {
  id: string;
  title: string;
  priceLabel: string;
  priceValue: number;
};

type PaymentMethodKey = 'cod' | 'wallet' | 'mixed' | 'official-wallets';

type PaymentSelection = {
  method: PaymentMethodKey;
  walletAmountHalalas: number;
  amountDueOnDeliveryHalalas: number;
  valid: boolean;
  summary: string;
  blockingReason?: string;
  feedbackTone: NonNullable<ScreenNotice['tone']>;
};

type CartItem = {
  id: string;
  title: string;
  priceLabel?: string;
  priceValue?: number;
  qty?: number;
  storeId?: string;
  storeName?: string;
};

type CheckoutActionPayload = {
  paymentMethod: PaymentMethodKey;
  walletAmountHalalas: number;
  amountDueOnDeliveryHalalas: number;
  orderTotalHalalas: number;
  summary: string;
  financeEventKind: DshFinanceEventKind;
};

export type DshCartUnifiedScreenProps = {
  items?: CartItem[];
  clientState?: DshClientState;
  store?: {
    id: string;
    name: string;
    subtitle: string;
    statusLabel: string;
    ratingLabel?: string;
  };
  activeOrder?: {
    id: string;
    title: string;
    subtitle: string;
    meta: string;
    statusLabel: string;
  };
  statusTitle?: string;
  statusDescription?: string;
  onContinue?: (payload: CheckoutActionPayload) => void | Promise<void>;
  onOpenOrder?: (payload?: CheckoutActionPayload) => void | Promise<void>;
  onOpenStore?: () => void;
  onRetry?: () => void;
  onExit?: () => void;
  onOpenService?: (serviceId: string) => void;
};

const QUICK_ACTION_META: Record<QuickActionKey, QuickActionMeta> = {
  coupon: {
    title: 'إضافة قسيمة',
    placeholder: 'أدخل رمز التخفيض',
    helper: 'سيتم حفظ القسيمة داخل هذه الجلسة فقط حتى يكتمل الربط الخلفي.',
    saveLabel: 'حفظ القسيمة',
  },
  address: {
    title: 'تحديث عنوان التوصيل',
    placeholder: 'اكتب عنوان التوصيل بالتفصيل',
    helper: 'العنوان المحلي سيظهر مباشرة في ملخص الطلب الحالي.',
    saveLabel: 'حفظ العنوان',
    multiline: true,
  },
  note: {
    title: 'ملاحظات الطلب',
    placeholder: 'أضف ملاحظة قصيرة للكابتن أو المتجر',
    helper: 'يمكن ترك الملاحظة فارغة إذا لم تكن هناك تعليمات إضافية.',
    saveLabel: 'حفظ الملاحظة',
    multiline: true,
  },
  extra: {
    title: 'طلب إضافي على الطريق',
    placeholder: 'مثال: ماء أو بسبس من أي ماركت على الطريق',
    helper: 'سيظهر الطلب الإضافي داخل نفس الشاشة كإضافة جاهزة للمراجعة.',
    saveLabel: 'حفظ الطلب',
    multiline: true,
  },
};

const RECOMMENDED_PRODUCTS: RecommendationProduct[] = [
  { id: 'r1', title: 'كيس خبز', priceLabel: '100', priceValue: 100 },
  { id: 'r2', title: 'دجاج بروست', priceLabel: '1,500', priceValue: 1500 },
  { id: 'r3', title: 'بطاطس', priceLabel: '250', priceValue: 250 },
];

const PREVIEW_FALLBACK_ITEMS: CartItem[] = [
  { id: 'p1', title: 'دجاج فحم تركي مع التوابع', priceValue: 3000, qty: 1 },
  { id: 'p2', title: 'كريسبي رول مفرد', priceValue: 1500, qty: 2 },
  { id: 'p3', title: 'فتة دخن بالقشطة والعسل', priceValue: 1700, qty: 3 },
  { id: 'p4', title: 'فتة بالقشطة والعسل', priceValue: 1500, qty: 1 },
];

function formatAmount(value: number) {
  try {
    return new Intl.NumberFormat('ar-YE', { style: 'currency', currency: 'YER' }).format(value);
  } catch {
    return `${value} ر.ي`;
  }
}

function formatHalalasAmount(value: number) {
  return formatAmount(value / 100);
}

function resolveCartItemPriceValue(item: CartItem): number {
  if (typeof item.priceValue === 'number' && Number.isFinite(item.priceValue)) {
    return item.priceValue;
  }

  if (typeof item.priceLabel === 'string' && item.priceLabel.trim()) {
    const normalizedValue = Number(item.priceLabel.replace(/[^\d.]/g, ''));
    if (Number.isFinite(normalizedValue)) {
      return normalizedValue;
    }
  }

  return 0;
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
  const resolvedDate = dateOptions.find((option) => option.value === selectedDate) ?? dateOptions[0];
  const resolvedTime = timeOptions.find((option) => option.value === selectedTime) ?? timeOptions[0];

  return (
    <Surface tone="inset" padding={3} gap={3} style={{ borderRadius: 16 }}>
      <Box gap={2}>
        <Text role="bodySm" style={{ fontWeight: '700' }}>التاريخ</Text>
        <Box flexDirection="row" flexWrap="wrap" gap={2}>
          {dateOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={option.value === resolvedDate?.value}
              tone="brand"
              onPress={() => onDateChange(option.value)}
            />
          ))}
        </Box>
      </Box>

      <Box gap={2}>
        <Text role="bodySm" style={{ fontWeight: '700' }}>الوقت</Text>
        <Box flexDirection="row" flexWrap="wrap" gap={2}>
          {timeOptions.map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              selected={option.value === resolvedTime?.value}
              tone="brand"
              onPress={() => onTimeChange(option.value)}
            />
          ))}
        </Box>
      </Box>

      {resolvedDate && resolvedTime ? (
        <Surface tone="brand" padding={2} style={{ borderRadius: 12 }}>
          <Text role="caption" style={{ color: colorPalette.white }}>
            سيتم تنفيذ الطلب {resolvedDate.fullLabel} عند {resolvedTime.fullLabel}
          </Text>
        </Surface>
      ) : null}
    </Surface>
  );
}

function PromoBanner({ onPress }: { onPress: () => void }) {
  return (
    <Surface
      tone="brand"
      padding={3}
      style={{ borderRadius: 20 }}
    >
      <Box flexDirection="row" alignItems="center" gap={3}>
        <Box flex={1}>
          <Text role="bodyStrong" style={{ color: colorPalette.white }}>
            بثواني برو
          </Text>
          <Text role="caption" style={{ color: colorPalette.white, opacity: 0.9 }}>
            اشترك الآن للحصول على توصيل مجاني وعروض حصرية.
          </Text>
        </Box>
        <Button label="اشترك" size="sm" tone="secondary" onPress={onPress} />
      </Box>
    </Surface>
  );
}

function RecommendationCard({ title, price, onPress }: RecommendationCardProps) {
  return (
    <Surface
      tone="raised"
      padding={3}
      gap={2}
      style={{ width: 140, borderRadius: 20 }}
    >
      <Box height={80} backgroundColor="surfaceSecondary" alignItems="center" justifyContent="center" style={{ borderRadius: 16 }}>
        <Icon name="fast-food-outline" size={32} color={colorPalette.brand} />
      </Box>
      <Box gap={1}>
        <Text role="bodyStrong" numberOfLines={1}>{title}</Text>
        <Text role="caption" tone="brand" style={{ fontWeight: '700' }}>{price}</Text>
      </Box>
      <Button label="أضف" size="sm" tone="secondary" onPress={onPress} />
    </Surface>
  );
}

function RecommendedSection({ onShowAll, onAddProduct }: { onShowAll: () => void; onAddProduct: (product: RecommendationProduct) => void }) {
  return (
    <Box gap={2}>
      <Box flexDirection="row" justifyContent="space-between" alignItems="center">
        <Text role="bodyStrong">قد يعجبك أيضاً</Text>
        <Button label="عرض الكل" tone="ghost" size="sm" onPress={onShowAll} />
      </Box>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: spacing[3], paddingRight: spacing[4] }}>
        {RECOMMENDED_PRODUCTS.map((product) => (
          <RecommendationCard key={product.id} title={product.title} price={product.priceLabel} onPress={() => onAddProduct(product)} />
        ))}
      </ScrollView>
    </Box>
  );
}

function ItemsTable({ items, onOpenDetails }: ItemsTableProps) {
  return (
    <Card
      title="تفاصيل السلة"
      subtitle={`عناصر: ${items.length}`}
      footer={items.length > 0 ? (
        <Button label="تعديل السلة" tone="secondary" size="sm" onPress={onOpenDetails} />
      ) : undefined}
    >
      {items.length === 0 ? (
        <Box padding={4} alignItems="center" gap={1}>
          <Text role="bodyStrong">السلة فارغة</Text>
          <Text role="caption" tone="muted">أضف منتجات من المتجر للبدء.</Text>
        </Box>
      ) : (
        <Box gap={2}>
          {items.map((item) => (
            <Box key={item.id} flexDirection="row" justifyContent="space-between" alignItems="center">
              <Box flex={1}>
                <Text role="bodyStrong">{item.title}</Text>
                <Text role="caption" tone="muted">{item.qty ?? 1} × {formatAmount(resolveCartItemPriceValue(item))}</Text>
              </Box>
              <Text role="bodyStrong" tone="brand">
                {formatAmount(resolveCartItemPriceValue(item) * (item.qty ?? 1))}
              </Text>
            </Box>
          ))}
        </Box>
      )}
    </Card>
  );
}

function QuickActionSheet({ visible, meta, value, submitDisabled = false, onChangeValue, onClose, onSubmit }: QuickActionSheetProps) {
  if (!meta) return null;

  return (
    <SheetFrame visible={visible} onClose={onClose} title={meta.title}>
      <Box gap={4} padding={3}>
        <TextField
          value={value}
          onChangeText={onChangeValue}
          placeholder={meta.placeholder}
          multiline={meta.multiline}
          style={meta.multiline ? { minHeight: 120 } : undefined}
        />
        {meta.helper && <Text role="caption" tone="muted">{meta.helper}</Text>}
        <Box flexDirection="row" gap={3}>
          <Button label={meta.saveLabel} tone="brand" style={{ flex: 1 }} disabled={submitDisabled} onPress={onSubmit} />
          <Button label="إلغاء" tone="secondary" style={{ flex: 1 }} onPress={onClose} />
        </Box>
      </Box>
    </SheetFrame>
  );
}

export default function DshCartUnifiedScreen(props: DshCartUnifiedScreenProps) {
  const [items, setItems] = useState<CartItem[]>(
    props.items !== undefined ? props.items : PREVIEW_FALLBACK_ITEMS,
  );

  useEffect(() => {
    if (props.items !== undefined) {
      setItems(props.items);
    }
  }, [props.items]);

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodKey>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [pickupAddr, setPickupAddr] = useState('جوار الجبل الجديد');
  const [note, setNote] = useState('لا يوجد ملاحظة');
  const [extraRequest, setExtraRequest] = useState('');
  const [scheduling, setScheduling] = useState<'now' | 'later'>('now');
  const executionScheduleOptions = useMemo(() => createExecutionScheduleOptions(), []);
  const [scheduledDate, setScheduledDate] = useState(() => executionScheduleOptions.dateOptions[0]?.value ?? '');
  const [scheduledTime, setScheduledTime] = useState(() => executionScheduleOptions.timeOptions[0]?.value ?? '');
  const [quickActionKey, setQuickActionKey] = useState<QuickActionKey | null>(null);
  const [quickActionDraft, setQuickActionDraft] = useState('');
  const [notice, setNotice] = useState<ScreenNotice | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [cartDetailsVisible, setCartDetailsVisible] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);
  const {
    linked: walletLinked,
    balance: walletBalanceRaw,
    hydrated: walletHydrated,
    refreshing: walletRefreshing,
    refresh: refreshWallet,
    requestPayment: requestWalletPayment,
    link: linkWallet,
    topUp: topUpWallet,
  } = useWlt();

  const checkoutAction = props.onContinue ?? props.onOpenOrder;
  const canEditOrder = Boolean(props.onOpenStore ?? props.onOpenOrder ?? props.onContinue);
  const backAction = props.onOpenStore ?? props.onRetry ?? props.onExit;
  const quickActionMeta = quickActionKey ? QUICK_ACTION_META[quickActionKey] : null;
  const hasWltServiceRoute = typeof props.onOpenService === 'function';
  const clientState = useMemo<DshClientState>(
    () => props.clientState ?? (items.length > 0 ? 'cart_ready' : 'cart_empty'),
    [items.length, props.clientState],
  );
  const clientStateMeta = useMemo(() => getDshClientStateMeta(clientState), [clientState]);
  const paymentPendingMeta = useMemo(() => getDshClientStateMeta('payment_pending'), []);
  const walletCreditMeta = useMemo(() => getDshClientStateMeta('wallet_credit_visible'), []);

  const subtotalHalalas = useMemo(
    () => items.reduce((acc, item) => acc + Math.round(resolveCartItemPriceValue(item) * 100) * (item.qty ?? 1), 0),
    [items],
  );
  const subtotalAmount = subtotalHalalas / 100;
  const deliveryAmount = 950;
  const grandTotalAmount = subtotalAmount + deliveryAmount;
  const grandTotalHalalas = subtotalHalalas + Math.round(deliveryAmount * 100);
  const walletBalance = walletBalanceRaw ?? 0;
  const walletShortfallHalalas = Math.max(grandTotalHalalas - walletBalance, 0);
  const canUseWalletFull = walletLinked && walletBalance >= grandTotalHalalas;
  const canUseMixedPayment = walletLinked && walletBalance > 0 && walletBalance < grandTotalHalalas;
  const formattedSubtotal = formatAmount(subtotalAmount);
  const formattedDelivery = formatAmount(deliveryAmount);
  const formattedGrandTotal = formatAmount(grandTotalAmount);
  const formattedWalletBalance = formatAmount(walletBalance / 100);
  const formattedWalletShortfall = formatHalalasAmount(walletShortfallHalalas);
  const canCheckout = items.length > 0;
  const resolvedFooterHeight = footerHeight > 0 ? footerHeight : 80;

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

  const showNotice = (title: string, description?: string, tone: ScreenNotice['tone'] = 'info') => {
    setNotice({ title, description, tone });
  };

  const openWltService = (mode: 'wallet-topup' | 'official-wallets') => {
    if (hasWltServiceRoute) {
      props.onOpenService?.('wlt');
      return;
    }

    showNotice(
      mode === 'official-wallets' ? 'مسار المحافظ الرسمية غير موصول بعد' : 'مسار شحن المحفظة غير موصول بعد',
      mode === 'official-wallets'
        ? 'لا يوجد مسار مثبت داخل المضيف الحالي لفتح المحافظ الرسمية عبر WLT.'
        : 'لا يوجد مسار مثبت داخل المضيف الحالي لفتح شحن المحفظة عبر WLT.',
      'info',
    );
  };

  const linkWalletInline = async () => {
    try {
      const result = await linkWallet();
      if (!result.success) {
        showNotice('تعذر ربط المحفظة', 'لم يكتمل الربط، حاول مرة أخرى.', 'danger');
        return;
      }

      await refreshWallet();
      showNotice('تم ربط المحفظة', 'أصبح خيار الدفع من الرصيد متاحًا عند كفاية الرصيد.', 'success');
    } catch {
      showNotice('تعذر ربط المحفظة', 'حدث خطأ أثناء الربط المحلي للمحفظة.', 'danger');
    }
  };

  const topUpWalletInline = async (amountHalalas: number) => {
    try {
      const normalizedAmount = Math.max(amountHalalas, 0);
      if (!normalizedAmount) {
        showNotice('لا يوجد مبلغ مطلوب للشحن', 'الرصيد الحالي يغطي الطلب أو لا توجد بيانات كافية.', 'info');
        return;
      }

      await topUpWallet(normalizedAmount);
      await refreshWallet();
      showNotice('تم شحن الرصيد', `تم شحن ${formatHalalasAmount(normalizedAmount)} في المحفظة.`, 'success');
    } catch {
      showNotice('تعذر شحن الرصيد', 'حدث خطأ أثناء تحديث رصيد المحفظة.', 'danger');
    }
  };

  const paymentSelection = useMemo<PaymentSelection>(() => {
    if (paymentMethod === 'wallet') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'wallet',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'جاري التحقق من حالة المحفظة.',
          blockingReason: 'انتظر اكتمال مزامنة حالة الربط والرصيد ثم أعد المحاولة.',
          feedbackTone: 'info',
        };
      }

      if (!walletLinked) {
        return {
          method: 'wallet',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'ادفع كامل الطلب من رصيد WLT الداخلي.',
          blockingReason: hasWltServiceRoute ? 'اربط المحفظة أو اشحنها عبر WLT أولًا ثم أعد الاختيار.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance < grandTotalHalalas) {
        return {
          method: 'wallet',
          walletAmountHalalas: walletBalance,
          amountDueOnDeliveryHalalas: grandTotalHalalas - walletBalance,
          valid: false,
          summary: 'الرصيد الحالي أقل من إجمالي الطلب.',
          blockingReason: `تحتاج شحن ${formattedWalletShortfall} قبل اعتماد هذا الخيار.`,
          feedbackTone: 'info',
        };
      }

      return {
        method: 'wallet',
        walletAmountHalalas: grandTotalHalalas,
        amountDueOnDeliveryHalalas: 0,
        valid: true,
        summary: 'الرصيد يكفي، سيتم الدفع كاملًا من المحفظة.',
        feedbackTone: 'success',
      };
    }

    if (paymentMethod === 'mixed') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'mixed',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'جاري التحقق من حالة المحفظة.',
          blockingReason: 'انتظر اكتمال المزامنة قبل تفعيل الدفع المدمج.',
          feedbackTone: 'info',
        };
      }

      if (!walletLinked || walletBalance <= 0) {
        return {
          method: 'mixed',
          walletAmountHalalas: 0,
          amountDueOnDeliveryHalalas: grandTotalHalalas,
          valid: false,
          summary: 'الدفع المدمج يحتاج رصيدًا فعليًا في WLT.',
          blockingReason: 'لا يوجد رصيد لاستخدام الدفع المدمج الآن.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance >= grandTotalHalalas) {
        return {
          method: 'mixed',
          walletAmountHalalas: grandTotalHalalas,
          amountDueOnDeliveryHalalas: 0,
          valid: false,
          summary: 'الرصيد يكفي للدفع الكامل من المحفظة.',
          blockingReason: 'الرصيد يكفي للدفع الكامل من المحفظة، لذلك الدفع المدمج غير ضروري.',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'mixed',
        walletAmountHalalas: walletBalance,
        amountDueOnDeliveryHalalas: grandTotalHalalas - walletBalance,
        valid: true,
        summary: `سيُخصم ${formattedWalletBalance} من المحفظة ويُدفع ${formatHalalasAmount(grandTotalHalalas - walletBalance)} عند الاستلام.`,
        feedbackTone: 'info',
      };
    }

    if (paymentMethod === 'official-wallets') {
      return {
        method: 'official-wallets',
        walletAmountHalalas: 0,
        amountDueOnDeliveryHalalas: 0,
        valid: false,
        summary: hasWltServiceRoute
          ? 'سيتم تحويلك إلى WLT لاختيار محفظة رسمية وإكمال الدفع أو الشحن خارج هذه الشاشة.'
          : 'مسار المحافظ الرسمية غير موصول بعد داخل المضيف الحالي.',
        blockingReason: hasWltServiceRoute
          ? 'أكمل الدفع أو الشحن عبر WLT أولًا ثم عد لإتمام الطلب.'
          : 'مسار المحافظ الرسمية غير موصول بعد داخل المضيف الحالي.',
        feedbackTone: 'info',
      };
    }

    return {
      method: 'cod',
      walletAmountHalalas: 0,
      amountDueOnDeliveryHalalas: grandTotalHalalas,
      valid: true,
      summary: 'ستدفع كامل المبلغ عند الاستلام.',
      feedbackTone: 'info',
    };
  }, [formattedWalletBalance, formattedWalletShortfall, grandTotalHalalas, hasWltServiceRoute, paymentMethod, walletBalance, walletHydrated, walletLinked, walletRefreshing]);

  React.useEffect(() => {
    if (paymentMethod === 'wallet' && !canUseWalletFull) {
      setPaymentMethod(canUseMixedPayment ? 'mixed' : 'cod');
    }

    if (paymentMethod === 'mixed' && !canUseMixedPayment) {
      setPaymentMethod(canUseWalletFull ? 'wallet' : 'cod');
    }
  }, [canUseMixedPayment, canUseWalletFull, paymentMethod]);

  const paymentDecisionOptions = useMemo<PaymentDecisionOption[]>(() => {
    const walletPending = !walletHydrated || walletRefreshing;

    return [
      {
        id: 'cod',
        title: 'عند الاستلام',
        description: 'ادفع كامل الطلب عند الاستلام.',
        selected: paymentMethod === 'cod',
        statusLabel: paymentMethod === 'cod' ? 'محدد' : 'جاهز الآن',
        statusTone: paymentMethod === 'cod' ? 'brand' : 'info',
        amountRows: [
          { label: 'من المحفظة', value: formatHalalasAmount(0), tone: 'muted' },
          { label: 'عند الاستلام', value: formatHalalasAmount(grandTotalHalalas), tone: 'brand' },
        ],
        onSelect: () => setPaymentMethod('cod'),
      },
      {
        id: 'wallet',
        title: 'من رصيد المحفظة',
        description: 'ادفع كامل الطلب من رصيد WLT الداخلي.',
        selected: paymentMethod === 'wallet',
        disabled: walletPending || !canUseWalletFull,
        statusLabel: paymentMethod === 'wallet' ? 'محدد' : walletPending ? 'قيد التحقق' : canUseWalletFull ? 'جاهز الآن' : 'يتطلب إجراء',
        statusTone: paymentMethod === 'wallet' ? 'brand' : walletPending ? 'info' : canUseWalletFull ? 'success' : 'warning',
        amountRows: canUseWalletFull
          ? [
              { label: 'من المحفظة', value: formatHalalasAmount(grandTotalHalalas), tone: 'brand' },
            ]
          : walletLinked
            ? [
                { label: 'الرصيد الحالي', value: formattedWalletBalance, tone: 'brand' },
                { label: 'المطلوب شحنه', value: formattedWalletShortfall, tone: 'muted' },
              ]
            : [
                { label: 'إجمالي الطلب', value: formattedGrandTotal, tone: 'brand' },
              ],
        action: canUseWalletFull
          ? undefined
          : {
              label: walletLinked ? 'شحن الرصيد' : 'ربط المحفظة',
              tone: 'primary',
              onPress: walletLinked
                ? (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void topUpWalletInline(walletShortfallHalalas))
                : (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void linkWalletInline()),
              disabled: walletPending,
            },
        onSelect: canUseWalletFull ? () => setPaymentMethod('wallet') : undefined,
      },
      {
        id: 'mixed',
        title: 'محفظة + عند الاستلام',
        description: 'استخدم الرصيد المتاح وادفع المتبقي عند الاستلام.',
        selected: paymentMethod === 'mixed',
        disabled: walletPending || !canUseMixedPayment,
        statusLabel: paymentMethod === 'mixed' ? 'محدد' : canUseMixedPayment ? 'جاهز الآن' : 'غير ضروري',
        statusTone: canUseMixedPayment ? (paymentMethod === 'mixed' ? 'brand' : 'info') : 'info',
        amountRows: canUseMixedPayment
          ? [
              { label: 'من المحفظة', value: formattedWalletBalance, tone: 'brand' },
              { label: 'عند الاستلام', value: formatHalalasAmount(grandTotalHalalas - walletBalance), tone: 'brand' },
            ]
          : [],
        onSelect: canUseMixedPayment ? () => setPaymentMethod('mixed') : undefined,
      },
    ];
  }, [canUseMixedPayment, canUseWalletFull, formattedGrandTotal, formattedWalletBalance, formattedWalletShortfall, grandTotalHalalas, hasWltServiceRoute, paymentMethod, topUpWalletInline, walletBalance, walletHydrated, walletLinked, walletRefreshing, walletShortfallHalalas]);

  const handleBackPress = () => {
    if (backAction) {
      backAction();
      return;
    }

    showNotice('الرجوع غير متاح الآن', 'لا يوجد مسار رجوع موصول في هذا العرض الحالي.', 'info');
  };

  const handleCheckoutPress = async () => {
    if (!canCheckout) {
      showNotice(clientStateMeta.label, clientStateMeta.description, 'info');
      return;
    }

    if (!checkoutAction) {
      showNotice('تنفيذ الطلب محجوب', 'زر التنفيذ جاهز UI لكن المسار التالي غير موصول في هذا العرض.', 'info');
      return;
    }

    if (!paymentSelection.valid) {
      const blockedStateMeta = paymentSelection.method === 'official-wallets' ? walletCreditMeta : paymentPendingMeta;
      showNotice(blockedStateMeta.label, paymentSelection.blockingReason ?? blockedStateMeta.description, paymentSelection.feedbackTone);
      return;
    }

    if (paymentSelection.method === 'wallet') {
      setCheckoutLoading(true);
      try {
        const paymentResult = await requestWalletPayment(paymentSelection.walletAmountHalalas);
        await refreshWallet();
        if (!paymentResult.success) {
          showNotice('تعذر خصم مبلغ المحفظة', paymentResult.error === 'insufficient_balance' ? 'الرصيد لم يعد كافيًا بعد آخر تحديث.' : 'حدث خطأ أثناء تهيئة الدفع من المحفظة.', 'danger');
          return;
        }

        await Promise.resolve(checkoutAction({
          paymentMethod: paymentSelection.method,
          walletAmountHalalas: paymentSelection.walletAmountHalalas,
          amountDueOnDeliveryHalalas: paymentSelection.amountDueOnDeliveryHalalas,
          orderTotalHalalas: grandTotalHalalas,
          summary: paymentSelection.summary,
          financeEventKind: resolveDshFinanceEventKindForPayment(paymentSelection.method),
        }));
        return;
      } finally {
        setCheckoutLoading(false);
      }
    }

    await Promise.resolve(checkoutAction({
      paymentMethod: paymentSelection.method,
      walletAmountHalalas: paymentSelection.walletAmountHalalas,
      amountDueOnDeliveryHalalas: paymentSelection.amountDueOnDeliveryHalalas,
      orderTotalHalalas: grandTotalHalalas,
      summary: paymentSelection.summary,
      financeEventKind: resolveDshFinanceEventKindForPayment(paymentSelection.method),
    }));
  };

  const handleEditPress = () => {
    if (props.onOpenStore) {
      props.onOpenStore();
      return;
    }

    const editPayload: CheckoutActionPayload = {
      paymentMethod: paymentSelection.method,
      walletAmountHalalas: paymentSelection.walletAmountHalalas,
      amountDueOnDeliveryHalalas: paymentSelection.amountDueOnDeliveryHalalas,
      orderTotalHalalas: grandTotalHalalas,
      summary: paymentSelection.summary,
      financeEventKind: resolveDshFinanceEventKindForPayment(paymentSelection.method),
    };

    if (props.onOpenOrder) {
      props.onOpenOrder(editPayload);
      return;
    }

    props.onContinue?.(editPayload);
  };

  const openQuickAction = (actionKey: QuickActionKey) => {
    const initialValue = {
      coupon: couponCode,
      address: pickupAddr,
      note: note === 'لا يوجد ملاحظة' ? '' : note,
      extra: extraRequest,
    }[actionKey];

    setQuickActionKey(actionKey);
    setQuickActionDraft(initialValue);
  };

  const applyQuickAction = () => {
    if (!quickActionKey) return;
    const trimmedValue = quickActionDraft.trim();
    if (quickActionKey === 'coupon') setCouponCode(trimmedValue);
    if (quickActionKey === 'address') setPickupAddr(trimmedValue || 'العنوان غير محدد بعد');
    if (quickActionKey === 'note') setNote(trimmedValue || 'لا يوجد ملاحظة');
    if (quickActionKey === 'extra') setExtraRequest(trimmedValue);
    setQuickActionKey(null);
    setQuickActionDraft('');
  };

  const handleAddRecommendedProduct = (product: RecommendationProduct) => {
    setItems((previousItems) => {
      const matchedItem = previousItems.find((item) => item.title === product.title);
      if (matchedItem) {
        return previousItems.map((item) => (item.title === product.title ? { ...item, qty: (item.qty ?? 1) + 1 } : item));
      }

      return [...previousItems, { id: `recommended-${product.id}`, title: product.title, priceValue: product.priceValue, qty: 1 }];
    });

    showNotice('أضيف المنتج إلى السلة', `${product.title} أصبح ضمن الطلب الحالي.`, 'success');
  };

  const handleShowAllRecommendations = () => {
    showNotice('يعرض هذا النموذج 3 اقتراحات فقط', 'سيظهر كامل عرض التوصيات بعد ربط كتالوج المتجر داخل نفس الرحلة.', 'info');
  };

  const handleSubscribePress = () => {
    showNotice('الاشتراك جاهز UI فقط', 'زر الاشتراك واضح وفعال، لكن تفعيل الميزة يحتاج ربطًا لاحقًا خارج هذا النطاق.', 'info');
  };

  const actionBarBottomPadding = resolvedFooterHeight + spacing[2];

  return (
    <Box dir="rtl" flex={1} backgroundColor="pageBackground">
      <TopBar
        variant="secondary"
        title="تأكيد الطلب"
        actions={[
          {
            id: 'clear-cart',
            icon: <Icon name="trash-outline" size={20} color={colorPalette.brand} />,
            accessibilityLabel: 'تفريغ السلة',
            disabled: !items.length,
            onPress: () => {
              setItems([]);
              showNotice('تم تفريغ السلة', 'يمكنك الرجوع للمتجر أو إضافة عنصر من المقترحات أدناه.', 'success');
            },
          },
        ]}
        onBack={handleBackPress}
      />

      <MobileScrollView fill padding={3} gap={3} contentContainerStyle={{ paddingBottom: spacing[4] }}>
        <PromoBanner onPress={handleSubscribePress} />

        <Card title="الخيارات السريعة" subtitle="القسيمة والعنوان والملاحظات">
          <Box gap={2}>
            <OptionRow
              title="هل لديك قسيمة تخفيض؟"
              subtitle={couponCode ? `القسيمة الحالية: ${couponCode}` : 'أدخل رمز التخفيض إن وجد'}
              actionLabel={couponCode ? 'تعديل' : 'إضافة'}
              onAction={() => openQuickAction('coupon')}
            />
            <OptionRow
              title="عنوان التوصيل"
              subtitle={pickupAddr}
              actionLabel="تغيير"
              onAction={() => openQuickAction('address')}
            />
            <OptionRow
              title="ملاحظات الطلب"
              subtitle={note}
              actionLabel={note === 'لا يوجد ملاحظة' ? 'إضافة' : 'تعديل'}
              onAction={() => openQuickAction('note')}
            />
            <OptionRow
              title="طلب إضافي على الطريق"
              subtitle={extraRequest || 'مثال: بسبس أو ماء من أي ماركت على طريق الكابتن'}
              actionLabel={extraRequest ? 'تعديل' : 'إضافة'}
              onAction={() => openQuickAction('extra')}
            />
          </Box>
        </Card>

        <Card title="وقت التنفيذ" subtitle="اختر وقت تنفيذ الطلب">
          <Box gap={3}>
            <SegmentedControl
              options={[
                { value: 'now', label: 'الآن' },
                { value: 'later', label: 'في وقت لاحق' },
              ]}
              value={scheduling}
              onValueChange={(nextValue: any) => {
                setScheduling(nextValue);
                if (nextValue === 'later') {
                  setScheduledDate((current) => current || (executionScheduleOptions.dateOptions[0]?.value ?? ''));
                  setScheduledTime((current) => current || (executionScheduleOptions.timeOptions[0]?.value ?? ''));
                }
              }}
              size="sm"
            />
            {scheduling === 'now' ? (
              <Text role="caption" tone="muted">
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
          </Box>
        </Card>

        <Card title="قرار الدفع" subtitle="اختر ما سيحدث ماليًا">
          <PaymentDecisionList items={paymentDecisionOptions} />
        </Card>

        <RecommendedSection onShowAll={handleShowAllRecommendations} onAddProduct={handleAddRecommendedProduct} />

        <SummaryCard
          items={[
            { label: 'حالة السلة', value: clientStateMeta.label },
            { label: 'الإجمالي', value: formattedSubtotal },
            { label: 'التوصيل', value: formattedDelivery },
          ]}
          totalLabel="الإجمالي الكلي"
          totalValue={formattedGrandTotal}
        />
        <Text role="caption" tone="muted" style={{ textAlign: 'right' }}>
          {clientStateMeta.description}
        </Text>

        <ItemsTable items={items} onOpenDetails={() => setCartDetailsVisible(true)} />
        <Box style={{ height: actionBarBottomPadding }} />
      </MobileScrollView>

      <Surface
        tone="raised"
        padding={3}
        style={{ position: 'absolute', left: 0, right: 0, bottom: 0, borderTopWidth: 1, borderColor: colorPalette.borderSubtle, zIndex: 5, elevation: 8 }}
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
      >
        <Box flexDirection="row" gap={3}>
          <Button
            label="تنفيذ الطلب"
            tone="brand"
            size="md"
            style={{ flex: 1 }}
            disabled={!canCheckout || checkoutLoading}
            loading={checkoutLoading}
            onPress={handleCheckoutPress}
          />
          <Button
            label="تعديل السلة"
            tone="secondary"
            size="md"
            style={{ flex: 1 }}
            disabled={!canEditOrder}
            onPress={handleEditPress}
          />
        </Box>
      </Surface>

      <QuickActionSheet
        visible={Boolean(quickActionKey)}
        meta={quickActionMeta}
        value={quickActionDraft}
        submitDisabled={quickActionKey === 'coupon' ? quickActionDraft.trim().length === 0 : false}
        onChangeValue={setQuickActionDraft}
        onClose={() => {
          setQuickActionKey(null);
          setQuickActionDraft('');
        }}
        onSubmit={applyQuickAction}
      />

      <Toast
        visible={Boolean(notice)}
        title={notice?.title ?? ''}
        description={notice?.description}
        tone={notice?.tone ?? 'info'}
        onDismiss={() => setNotice(null)}
      />

      <DshCartDetails
        visible={cartDetailsVisible}
        onClose={() => setCartDetailsVisible(false)}
        currency="YER"
        items={items.map((item) => ({
          id: item.id,
          title: item.title,
          subtotal: resolveCartItemPriceValue(item) * (item.qty ?? 1),
          qty: item.qty ?? 1,
          price: resolveCartItemPriceValue(item),
        }))}
        onChangeQty={updateItemQty}
        onRemove={removeItem}
        onCheckout={() => {
          setCartDetailsVisible(false);
          handleCheckoutPress();
        }}
      />
    </Box>
  );
}

export { DshCartUnifiedScreen, DshCartUnifiedScreen as DshCartGetScreen };
