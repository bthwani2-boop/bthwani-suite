import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, Modal, Platform, Pressable, ScrollView, View } from 'react-native';
import {
  Button,
  Box,
  Card,
  colorPalette,
  DateTimePicker,
  Icon,
  MobileScrollView,
  OptionRow,
  PaymentDecisionList,
  safeArea,
  SegmentedControl,
  sizes,
  spacing,
  SummaryCard,
  Surface,
  Text,
  TextField,
  Toast,
  TopBar,
  useDirection,
  type PaymentDecisionOption,
} from '@bthwani/ui-kit';
import { DshCartDetails } from '../parts/CartDetails';
import { getDshClientStateMeta, type DshClientState } from '../data/client-state.preview-data';
import { getPartnerOfferItems } from '../../shared/partner-offer.preview-store';
import { isClientVisibleStatus, type CommercialLifecycleStatus } from '../../shared/commercial.preview-contract';
import { getEntitlements } from '../../shared/loyalty.preview-store';
import {
  resolveWltDshFinanceEventKindForPaymentMethod,
  useWltDshWalletPreview,
  type WltDshFinanceEventKind,
} from '../../../../wlt/frontend/app-client/dsh';
import { resolveDshImageSource } from '../shared/resolve-image-source';
import {
  type DshFulfillmentDeliveryMode,
  getDshFulfillmentDeliveryModeMeta,
} from '../contracts/dsh-client-binding.contracts';

const PAGE_BG = colorPalette.pageBackground;
const SURFACE_SOFT = colorPalette.surfaceSecondary;
const BORDER_SOFT = colorPalette.borderSubtle;
const TEXT_PRIMARY = colorPalette.textPrimary;
const TEXT_SECONDARY = colorPalette.textSecondary;
const ACCENT_BLUE = colorPalette.accentBlue;
const ACCENT_ORANGE = colorPalette.accentOrange;
const CTA_PRIMARY = colorPalette.accentOrange;
const SURFACE_WARM = colorPalette.brandSoft;
const SURFACE_WARM_BORDER = colorPalette.brandSurface;
const DANGER = colorPalette.danger;
const DANGER_SOFT = colorPalette.dangerSoft;
const EXPERIMENTAL_PAYMENT_ENABLED = true;

type ScreenNotice = {
  title: string;
  description?: string;
  tone?: 'neutral' | 'info' | 'success' | 'warning' | 'danger';
  actionLabel?: string;
  onActionPress?: () => void;
};

type QuickActionKey = 'coupon' | 'address' | 'note' | 'extra';

type QuickActionMeta = {
  title: string;
  placeholder: string;
  helper?: string;
  saveLabel: string;
  multiline?: boolean;
  icon?: string;
};

type RecommendationProduct = {
  id: string;
  title: string;
  priceLabel: string;
  priceValue: number;
  imageUri?: string;
  description?: string;
};

type PaymentMethodKey = 'cod' | 'wallet' | 'mixed' | 'official-wallets';

type PaymentSelection = {
  method: PaymentMethodKey;
  walletAmountMinorUnits: number;
  amountDueOnDeliveryMinorUnits: number;
  valid: boolean;
  isExperimental?: boolean;
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
  walletAmountMinorUnits: number;
  amountDueOnDeliveryMinorUnits: number;
  orderTotalMinorUnits: number;
  summary: string;
  financeEventKind: WltDshFinanceEventKind;
};

export type DshCartUnifiedScreenProps = {
  items?: CartItem[];
  clientState?: DshClientState;
  fulfillmentMode?: DshFulfillmentDeliveryMode;
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
    icon: 'pricetag-outline',
  },
  address: {
    title: 'موقع التوصيل',
    placeholder: 'اكتب العنوان أو حدده من الخريطة لاحقًا',
    helper: 'سيتم لاحقًا دعم تحديد الموقع بدبوس عبر Google Maps.',
    saveLabel: 'حفظ الموقع',
    multiline: true,
    icon: 'location-outline',
  },
  note: {
    title: 'ملاحظات الطلب',
    placeholder: 'أضف ملاحظة قصيرة للكابتن أو المتجر',
    helper: 'يمكن ترك الملاحظة فارغة إذا لم تكن هناك تعليمات إضافية.',
    saveLabel: 'حفظ الملاحظة',
    multiline: true,
    icon: 'document-text-outline',
  },
  extra: {
    title: 'طلب إضافي على الطريق',
    placeholder: 'مثال: ماء أو بسبس من أي ماركت على الطريق',
    helper: 'سيظهر الطلب الإضافي داخل نفس الشاشة كإضافة جاهزة للمراجعة.',
    saveLabel: 'حفظ الطلب',
    multiline: true,
    icon: 'add-circle-outline',
  },
};

const RECOMMENDED_PRODUCTS: RecommendationProduct[] = [
  { id: 'r1', title: 'تفاح طازج', priceLabel: '500', priceValue: 500, imageUri: 'dsh.product.apple.v1' },
  { id: 'r2', title: 'كيس خبز', priceLabel: '100', priceValue: 100, imageUri: 'dsh.product.bread.v1' },
  { id: 'r3', title: 'دجاج بروست', priceLabel: '1,500', priceValue: 1500, imageUri: 'dsh.product.chicken.v1' },
  { id: 'r4', title: 'شوكولاتة فاخرة', priceLabel: '400', priceValue: 400, imageUri: 'dsh.product.choco.v1' },
  { id: 'r5', title: 'كرواسون فرنسي', priceLabel: '300', priceValue: 300, imageUri: 'dsh.product.croissant.v1' },
  { id: 'r6', title: 'حليب طازج', priceLabel: '600', priceValue: 600, imageUri: 'dsh.product.milk.v1' },
  { id: 'r7', title: 'معكرونة إيطالية', priceLabel: '350', priceValue: 350, imageUri: 'dsh.product.pasta.v1' },
  { id: 'r8', title: 'بطاطس رول', priceLabel: '250', priceValue: 250, imageUri: 'dsh.product.roll.v1' },
  { id: 'r9', title: 'سلطة خضراء', priceLabel: '450', priceValue: 450, imageUri: 'dsh.product.salad.v1' },
  { id: 'r10', title: 'زبادي طازج', priceLabel: '150', priceValue: 150, imageUri: 'dsh.product.yogurt.v1' },
];

const PREVIEW_FALLBACK_ITEMS: CartItem[] = [
  { id: 'p1', title: 'دجاج فحم تركي مع التوابع', priceValue: 3000, qty: 1 },
  { id: 'p2', title: 'كريسبي رول مفرد', priceValue: 1500, qty: 2 },
  { id: 'p3', title: 'فتة دخن بالقشطة والعسل', priceValue: 1700, qty: 3 },
  { id: 'p4', title: 'فتة بالقشطة والعسل', priceValue: 1500, qty: 1 },
];

function toEnglishDigits(str: string): string {
  return str
    .replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 1632))
    .replace(/[۰-۹]/g, (d) => String(d.charCodeAt(0) - 1776));
}

function formatAmount(value: number) {
  try {
    const formatted = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(value);
    return `${formatted} ر.ي.`;
  } catch {
    return `${value} ر.ي.`;
  }
}

function formatMinorUnitsAmount(value: number) {
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

function normalizeRecommendationMatchKey(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, ' ');
}

function findCartItemForProduct(items: CartItem[], product: RecommendationProduct) {
  const normalizedProductTitle = normalizeRecommendationMatchKey(product.title);

  return items.find((item) => (
    item.id === product.id
    || normalizeRecommendationMatchKey(item.title) === normalizedProductTitle
  ));
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
  const dateChipFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'short', day: 'numeric', numberingSystem: 'latn' });
  const dateSummaryFormatter = new Intl.DateTimeFormat('ar-YE', { weekday: 'long', day: 'numeric', month: 'long', numberingSystem: 'latn' });
  const timeFormatter = new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit', numberingSystem: 'latn' });

  const dateOptions = Array.from({ length: 4 }, (_, index) => {
    const date = new Date(referenceDate);
    date.setHours(12, 0, 0, 0);
    date.setDate(referenceDate.getDate() + index + 1);

    return {
      value: `${date.getFullYear()}-${padSchedulePart(date.getMonth() + 1)}-${padSchedulePart(date.getDate())}`,
      label: index === 0 ? 'غدًا' : index === 1 ? 'بعد غد' : toEnglishDigits(dateChipFormatter.format(date)).replace('،', '').trim(),
      fullLabel: toEnglishDigits(dateSummaryFormatter.format(date)),
    };
  });

  const timeOptions = [9, 11, 13, 15, 17, 19].map((hour) => {
    const time = new Date(referenceDate);
    time.setHours(hour, 0, 0, 0);

    return {
      value: `${padSchedulePart(time.getHours())}:${padSchedulePart(time.getMinutes())}`,
      label: toEnglishDigits(timeFormatter.format(time)),
      fullLabel: toEnglishDigits(timeFormatter.format(time)),
    };
  });

  return { dateOptions, timeOptions };
}


function ExecutionSchedulePicker({ selectedDate, selectedTime, onConfirm }: { selectedDate: string, selectedTime: string, onConfirm: (date: Date, time: string) => void }) {
  const [visible, setVisible] = useState(false);

  // Format display labels
  const dateObj = new Date(selectedDate);
  const dateLabel = toEnglishDigits(new Intl.DateTimeFormat('ar-YE', { weekday: 'long', day: 'numeric', month: 'long', numberingSystem: 'latn' }).format(dateObj));

  const [h, m] = selectedTime.split(':');
  const timeLabel = toEnglishDigits(new Intl.DateTimeFormat('ar-YE', { hour: 'numeric', minute: '2-digit', numberingSystem: 'latn' }).format(new Date(2026, 0, 1, parseInt(h), parseInt(m))));

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <Surface tone="default" padding={3} gap={2} radiusToken="lg" style={{ backgroundColor: SURFACE_WARM, borderColor: SURFACE_WARM_BORDER, borderStyle: 'dashed', borderWidth: 1.5 }}>
          <Box layoutDirection="row" align="center" gap={3}>
            <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colorPalette.white, alignItems: 'center', justifyContent: 'center', shadowColor: colorPalette.black, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 }}>
              <Icon name="calendar-outline" size={22} color={ACCENT_ORANGE} />
            </View>
            <Box style={{ flex: 1 }} gap={0.5}>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{dateLabel}</Text>
              <Text role="caption" style={{ color: TEXT_SECONDARY }}>الساعة {timeLabel}</Text>
            </Box>
            <Icon name="chevron-forward" size={18} color={colorPalette.textMuted} />
          </Box>
        </Surface>
      </Pressable>

      <DateTimePicker
        visible={visible}
        onClose={() => setVisible(false)}
        initialDate={dateObj}
        initialTime={selectedTime}
        onConfirm={(date, time) => {
          onConfirm(date, time);
          setVisible(false);
        }}
      />
    </>
  );
}

function PromoBanner({ onPress }: { onPress: () => void }) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  return (
    <Surface
      tone="default"
      padding={2}
      style={{
        backgroundColor: colorPalette.warningSoft,
        borderWidth: 1,
        borderColor: colorPalette.warning,
        borderRadius: 16,
        paddingHorizontal: spacing[2],
        paddingVertical: spacing[1],
        minHeight: 60,
      }}
    >
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', minHeight: 36 }}>
        <View style={{ width: 96, alignItems: 'center' }}>
          <Button
            label="اشترك الآن"
            size="sm"
            fullWidth={false}
            onPress={onPress}
            style={{ minWidth: 92, minHeight: 36, backgroundColor: ACCENT_ORANGE, borderColor: ACCENT_ORANGE, borderRadius: 18 }}
          />
        </View>

        <View style={{ flex: 1, paddingHorizontal: spacing[2], alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, textAlign: 'center', lineHeight: 18 }}>
            اشترك بخدمة بثواني برو للاستفادة من أفضل العروض
          </Text>
        </View>

        <View style={{ width: 24, alignItems: 'center' }}>
          <Icon name="ribbon-outline" size={14} color={ACCENT_ORANGE} />
        </View>
      </View>
    </Surface>
  );
}

type RecommendationCardProps = {
  product: RecommendationProduct;
  cartQty: number;
  onOpenProductPreview: () => void;
};

function RecommendationCard({ product, cartQty, onOpenProductPreview }: RecommendationCardProps) {
  const imageSource = resolveDshImageSource(product.imageUri);

  return (
    <Pressable onPress={onOpenProductPreview} style={({ pressed }) => ({ opacity: pressed ? 0.94 : 1 })}>
      <Surface
        tone="default"
        style={{
          width: 140,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: BORDER_SOFT,
          backgroundColor: colorPalette.surfacePrimary,
          padding: spacing[2],
          gap: spacing[1.5],
          position: 'relative',
          justifyContent: 'space-between',
        }}
      >
        {cartQty > 0 && (
          <View style={{
            position: 'absolute',
            top: 6,
            right: 6,
            backgroundColor: ACCENT_ORANGE,
            borderRadius: 8,
            paddingHorizontal: 6,
            paddingVertical: 2,
            zIndex: 2,
          }}>
            <Text role="caption" style={{ color: colorPalette.white, fontWeight: '700', fontSize: 10 }}>
              {`مضاف (${cartQty})`}
            </Text>
          </View>
        )}

        <View style={{ height: 80, backgroundColor: SURFACE_SOFT, borderRadius: 12, justifyContent: 'center', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
          {imageSource ? (
            <Image source={imageSource} style={{ width: 64, height: 64, borderRadius: 32 }} resizeMode="cover" />
          ) : (
            <View style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: colorPalette.brandSoft }} />
          )}
          <View style={{ position: 'absolute', bottom: 4, left: 4, borderRadius: 6, backgroundColor: 'rgba(10, 47, 92, 0.75)', paddingHorizontal: 6, paddingVertical: 2 }}>
            <Text role="caption" style={{ color: colorPalette.white, fontWeight: '700', fontSize: 10 }}>
              {product.priceLabel}
            </Text>
          </View>
        </View>

        <View style={{ gap: 2 }}>
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: 'center', fontSize: 13 }} numberOfLines={1}>
            {product.title}
          </Text>
        </View>

        <Button
          label="عرض المنتج"
          tone="secondary"
          size="sm"
          fullWidth
          onPress={onOpenProductPreview}
          style={{ minHeight: 32, borderRadius: 10 }}
        />
      </Surface>
    </Pressable>
  );
}

type RecommendedSectionProps = {
  items: CartItem[];
  onOpenProductPreview: (product: RecommendationProduct) => void;
  onOpenStore?: () => void;
};

function RecommendedSection({
  items,
  onOpenProductPreview,
  onOpenStore,
}: RecommendedSectionProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  // Display a subset of products in horizontal view
  const horizontalProducts = RECOMMENDED_PRODUCTS.slice(0, 4);

  return (
    <View style={{ gap: spacing[1.5] }}>
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: spacing[1], gap: spacing[1] }}>
        <View style={{ flex: 1, gap: 2, alignItems: isRTL ? 'flex-end' : 'flex-start' }}>
          <Text role="bodyMd" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
            قد تعجبك هذه المنتجات أيضاً
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
            المعاينة هنا فقط، والإضافة من داخل البطاقة المفتوحة.
          </Text>
        </View>
        {onOpenStore && (
          <Button
            label="إضافة منتجات أخرى"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={onOpenStore}
            style={{ borderRadius: 10, minHeight: 32, paddingHorizontal: spacing[2] }}
          />
        )}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          gap: spacing[2],
          paddingHorizontal: spacing[1],
          paddingBottom: spacing[1],
        }}
      >
        {horizontalProducts.map((product) => {
          const cartItem = items.find((it) => it.title === product.title);
          const cartQty = cartItem ? (cartItem.qty ?? 0) : 0;
          return (
            <RecommendationCard
              key={product.id}
              product={product}
              cartQty={cartQty}
              onOpenProductPreview={() => onOpenProductPreview(product)}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

type PreviewFeedback = {
  message: string;
  tone: 'info' | 'success';
};

type ProductPreviewModalProps = {
  visible: boolean;
  product: RecommendationProduct | null;
  cartQty: number;
  feedback: PreviewFeedback | null;
  bottomInset: number;
  onClose: () => void;
  onPrimaryAction: () => void;
};

function ProductPreviewModal({
  visible,
  product,
  cartQty,
  feedback,
  bottomInset,
  onClose,
  onPrimaryAction,
}: ProductPreviewModalProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const imageSource = product ? resolveDshImageSource(product.imageUri) : undefined;
  const priceLabel = product ? formatAmount(product.priceValue) : '';
  const hasCartQty = cartQty > 0;
  const actionLabel = hasCartQty ? 'زيادة الكمية' : 'إضافة للسلة';
  const sheetBottomInset = Math.max(bottomInset, safeArea.comfortable) + spacing[2];
  const sheetTopInset = safeArea.comfortable + spacing[2];

  if (!visible || !product) {
    return null;
  }

  return (
    <Modal visible transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-end',
          paddingHorizontal: spacing[2],
          paddingTop: sheetTopInset,
          paddingBottom: sheetBottomInset,
          backgroundColor: 'rgba(10, 47, 92, 0.48)',
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="إغلاق معاينة المنتج"
          onPress={onClose}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(10, 47, 92, 0.36)',
          }}
        />

        <Surface
          tone="default"
          style={{
            zIndex: 1,
            borderRadius: 24,
            borderWidth: 1,
            borderColor: BORDER_SOFT,
            backgroundColor: colorPalette.surfacePrimary,
            overflow: 'hidden',
            maxHeight: '90%',
            shadowColor: colorPalette.black,
            shadowOpacity: 0.16,
            shadowRadius: 24,
            shadowOffset: { width: 0, height: 10 },
            elevation: 16,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              padding: spacing[3],
              gap: spacing[3],
              paddingBottom: spacing[4],
            }}
          >
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2] }}>
              <View style={{ flex: 1, gap: spacing[0.5] }}>
                <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>
                  معاينة المنتج
                </Text>
                <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
                  الفتح هنا فقط، والإضافة من زر داخل البطاقة
                </Text>
              </View>

              <Pressable
                accessibilityRole="button"
                accessibilityLabel="إغلاق المعاينة"
                onPress={onClose}
                style={({ pressed }) => ({
                  width: 36,
                  height: 36,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: BORDER_SOFT,
                  backgroundColor: colorPalette.surfaceSecondary,
                  opacity: pressed ? 0.8 : 1,
                })}
              >
                <Icon name="close" size={18} color={TEXT_PRIMARY} />
              </Pressable>
            </View>

            <View style={{ backgroundColor: SURFACE_SOFT, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: BORDER_SOFT }}>
              <View style={{ height: 240, position: 'relative', backgroundColor: colorPalette.surfaceSecondary }}>
                {imageSource ? (
                  <Image source={imageSource} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                ) : (
                  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colorPalette.brandSoft }}>
                    <Icon name="cart-outline" size={44} color={ACCENT_BLUE} />
                  </View>
                )}

                <View style={{ position: 'absolute', top: spacing[2], right: spacing[2], flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], borderRadius: 999, borderWidth: 1, borderColor: BORDER_SOFT, backgroundColor: colorPalette.white, paddingHorizontal: spacing[2], paddingVertical: spacing[1] }}>
                  <Icon name="cart-outline" size={14} color={ACCENT_ORANGE} />
                  <Text role="caption" style={{ color: TEXT_PRIMARY, fontWeight: '700' }}>
                    {hasCartQty ? `موجود في السلة · ${cartQty}` : 'غير موجود في السلة'}
                  </Text>
                </View>
              </View>

              <View style={{ gap: spacing[2], padding: spacing[3] }}>
                <View style={{ gap: spacing[0.5] }}>
                  <Text role="titleSm" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }} numberOfLines={2}>
                    {product.title}
                  </Text>
                  <Text role="titleMd" style={{ color: ACCENT_BLUE, textAlign: isRTL ? 'right' : 'left' }}>
                    {priceLabel}
                  </Text>
                </View>

                {product.description ? (
                  <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left', lineHeight: 20 }}>
                    {product.description}
                  </Text>
                ) : null}

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing[2], borderRadius: 14, borderWidth: 1, borderColor: BORDER_SOFT, backgroundColor: hasCartQty ? colorPalette.successSoft : colorPalette.surfaceSecondary, paddingHorizontal: spacing[2], paddingVertical: spacing[1.5] }}>
                  <Text role="bodySm" style={{ flex: 1, color: TEXT_PRIMARY, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
                    {hasCartQty ? 'موجود في السلة' : 'غير موجود في السلة'}
                  </Text>
                  <Text role="bodySm" style={{ color: hasCartQty ? colorPalette.success : TEXT_SECONDARY, fontWeight: '700' }}>
                    {hasCartQty ? `× ${cartQty}` : '0'}
                  </Text>
                </View>

                {feedback ? (
                  <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], borderRadius: 14, borderWidth: 1, borderColor: feedback.tone === 'success' ? colorPalette.success : BORDER_SOFT, backgroundColor: feedback.tone === 'success' ? colorPalette.successSoft : colorPalette.brandSoft, paddingHorizontal: spacing[2], paddingVertical: spacing[1.5] }}>
                    <Icon name={feedback.tone === 'success' ? 'checkmark-circle-outline' : 'information-circle-outline'} size={14} color={feedback.tone === 'success' ? colorPalette.success : ACCENT_BLUE} />
                    <Text role="caption" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: isRTL ? 'right' : 'left' }}>
                      {feedback.message}
                    </Text>
                  </View>
                ) : null}

                <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing[2] }}>
                  <Button
                    label={actionLabel}
                    tone="brand"
                    fullWidth={false}
                    onPress={onPrimaryAction}
                    style={{ flex: 1, minHeight: 48, borderRadius: 16, backgroundColor: CTA_PRIMARY, borderColor: CTA_PRIMARY }}
                  />
                  <Button
                    label="إغلاق"
                    tone="secondary"
                    fullWidth={false}
                    onPress={onClose}
                    style={{ flex: 1, minHeight: 48, borderRadius: 16 }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </Surface>
      </View>
    </Modal>
  );
}

type CartItemRowProps = {
  item: CartItem;
  index?: number;
  onChangeQty?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
};

function CartItemRow({ item, index, onChangeQty, onRemove }: CartItemRowProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const price = resolveCartItemPriceValue(item);
  const subtotal = price * (item.qty ?? 1);

  const displayIndex = index !== undefined ? `${index + 1}- ` : '';

  return (
    <View
      style={{
        flexDirection: isRTL ? 'row-reverse' : 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colorPalette.surfacePrimary,
        borderWidth: 1,
        borderColor: BORDER_SOFT,
        borderRadius: 16,
        padding: spacing[3],
        gap: spacing[2],
      }}
    >
      {/* Product Name & Unit Price */}
      <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: 4, paddingLeft: isRTL ? 0 : spacing[1], paddingRight: isRTL ? spacing[1] : 0 }}>
        <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }} numberOfLines={2}>
          {displayIndex}{item.title}
        </Text>
        <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
          سعر الوحدة: {formatAmount(price)}
        </Text>
      </View>

      {/* Controls and Subtotal */}
      <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'center', gap: spacing[3] }}>
        {/* Quantity controls: - / Qty / + */}
        <View style={{
          flexDirection: isRTL ? 'row-reverse' : 'row',
          alignItems: 'center',
          backgroundColor: SURFACE_SOFT,
          borderRadius: 12,
          padding: 2,
          gap: spacing[1]
        }}>
          <Button
            label="-"
            tone="ghost"
            size="sm"
            fullWidth={false}
            disabled={!onChangeQty}
            onPress={() => {
              if (onChangeQty) {
                onChangeQty(item.id, (item.qty ?? 1) - 1);
              }
            }}
            style={{ minWidth: 28, height: 28, paddingHorizontal: 0, borderRadius: 8 }}
          />
          <Text role="bodyStrong" style={{ minWidth: 20, textAlign: 'center', color: TEXT_PRIMARY }}>
            {item.qty ?? 1}
          </Text>
          <Button
            label="+"
            tone="brand"
            size="sm"
            fullWidth={false}
            disabled={!onChangeQty}
            onPress={() => {
              if (onChangeQty) {
                onChangeQty(item.id, (item.qty ?? 1) + 1);
              }
            }}
            style={{ minWidth: 28, height: 28, paddingHorizontal: 0, borderRadius: 8 }}
          />
        </View>

        {/* Subtotal */}
        <Text role="bodyStrong" style={{ color: ACCENT_BLUE, minWidth: 64, textAlign: isRTL ? 'left' : 'right' }}>
          {formatAmount(subtotal)}
        </Text>

        {/* Delete button */}
        {onRemove && (
          <Pressable
            onPress={() => onRemove(item.id)}
            style={({ pressed }) => [{
              padding: 8,
              borderRadius: 10,
              backgroundColor: DANGER_SOFT,
              minWidth: 32,
              minHeight: 32,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: pressed ? 0.7 : 1,
            }]}
          >
            <Icon name="trash-outline" size={16} color={DANGER} />
          </Pressable>
        )}
      </View>
    </View>
  );
}

type CartItemEditorProps = {
  items: CartItem[];
  onChangeQty?: (id: string, qty: number) => void;
  onRemove?: (id: string) => void;
  onClearCart?: () => void;
  onScrollToRecommendations?: () => void;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  couponCode?: string;
};

function CartItemEditor({
  items,
  onChangeQty,
  onRemove,
  onClearCart,
  onScrollToRecommendations,
  subtotal,
  deliveryFee,
  discount,
  grandTotal,
  couponCode,
}: CartItemEditorProps) {
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';

  return (
    <Card padding={3} gap={2}>
      {/* Header Row */}
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', paddingBottom: spacing[1] }}>
        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
          <Icon name="cart-outline" size={18} color={TEXT_PRIMARY} />
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, fontWeight: '800', fontSize: 16 }}>
            مراجعة السلة
          </Text>
          {items.length > 0 && (
            <View style={{ backgroundColor: SURFACE_SOFT, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 2 }}>
              <Text role="caption" style={{ color: TEXT_PRIMARY, fontWeight: '700' }}>
                {items.length} عناصر
              </Text>
            </View>
          )}
        </View>

        {items.length > 0 && onClearCart && (
          <Pressable onPress={onClearCart} style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1, paddingVertical: 4, paddingHorizontal: 8 }]}>
            <Text role="bodyStrong" style={{ color: DANGER, fontSize: 14 }}>
              حذف الكل
            </Text>
          </Pressable>
        )}
      </View>

      {/* Cart Items List or Empty View */}
      {items.length === 0 ? (
        <Surface
          tone="default"
          padding={4}
          gap={2}
          radiusToken="md"
          style={{
            backgroundColor: SURFACE_SOFT,
            borderColor: BORDER_SOFT,
            borderStyle: 'dashed',
            borderWidth: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name="basket-outline" size={32} color={colorPalette.textMuted} />
          <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: 'center' }}>
            السلة فارغة الآن
          </Text>
          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'center', maxWidth: '80%', lineHeight: 18 }}>
            أضف منتجات من المقترحات أدناه للبدء في تجهيز طلبك.
          </Text>
          {onScrollToRecommendations && (
            <Button
              label="إضافة منتجات"
              tone="brand"
              size="sm"
              fullWidth={false}
              onPress={onScrollToRecommendations}
              style={{ marginTop: spacing[1], borderRadius: 12 }}
            />
          )}
        </Surface>
      ) : (
        <>
          <View style={{ gap: spacing[2] }}>
            {items.map((item, index) => (
              <CartItemRow
                key={item.id}
                item={item}
                index={index}
                onChangeQty={onChangeQty}
                onRemove={onRemove}
              />
            ))}
          </View>

          {/* Divider */}
          <View style={{ height: 1, backgroundColor: BORDER_SOFT, marginVertical: spacing[1] }} />

          {/* Integrated Live Pricing Summary */}
          <View style={{ gap: spacing[1.5], paddingHorizontal: spacing[1] }}>
            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>إجمالي المنتجات</Text>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{formatAmount(subtotal)}</Text>
            </View>

            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>سعر التوصيل</Text>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY }}>{formatAmount(deliveryFee)}</Text>
            </View>

            {discount > 0 && (
              <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text role="bodySm" style={{ color: colorPalette.success, textAlign: isRTL ? 'right' : 'left' }}>الخصم (قسيمة: {couponCode})</Text>
                <Text role="bodyStrong" style={{ color: colorPalette.success }}>-{formatAmount(discount)}</Text>
              </View>
            )}

            {/* Grand Total Divider */}
            <View style={{ height: 1, backgroundColor: BORDER_SOFT, marginVertical: spacing[0.5] }} />

            <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, fontWeight: '800', fontSize: 15, textAlign: isRTL ? 'right' : 'left' }}>الإجمالي النهائي</Text>
              <Text role="titleMd" style={{ color: ACCENT_BLUE, fontWeight: '900' }}>{formatAmount(grandTotal)}</Text>
            </View>
          </View>
        </>
      )}
    </Card>
  );
}

type InlineActionEditorProps = {
  meta: QuickActionMeta;
  value: string;
  onChangeValue: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
  submitDisabled?: boolean;
};

function InlineActionEditor({ meta, value, onChangeValue, onSubmit, onClose, submitDisabled = false }: InlineActionEditorProps) {
  return (
    <Surface
      tone="default"
      padding={2}
      gap={1}
      style={{
        backgroundColor: colorPalette.surfacePrimary,
        borderWidth: 1,
        borderColor: colorPalette.borderStrong,
        borderRadius: 14,
      }}
    >
      <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
        {meta.icon ? <Icon name={meta.icon} size={15} color={ACCENT_ORANGE} /> : null}
        <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right', flex: 1 }}>
          {meta.title}
        </Text>
      </View>

      <TextField
        value={value}
        onChangeText={onChangeValue}
        placeholder={meta.placeholder}
        multiline={meta.multiline}
        style={meta.multiline ? { minHeight: 88, textAlignVertical: 'top' } : undefined}
      />

      {meta.helper ? (
        <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right' }}>
          {meta.helper}
        </Text>
      ) : null}

      <View style={{ flexDirection: 'row-reverse', gap: spacing[2] }}>
        <Button
          label={meta.saveLabel}
          fullWidth={false}
          disabled={submitDisabled}
          onPress={onSubmit}
          style={{ flex: 1, backgroundColor: ACCENT_ORANGE, borderColor: ACCENT_ORANGE }}
        />
        <Button
          label="إلغاء"
          tone="secondary"
          fullWidth={false}
          onPress={onClose}
          style={{ flex: 1 }}
        />
      </View>
    </Surface>
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
  const resolvedFulfillmentMode: DshFulfillmentDeliveryMode = props.fulfillmentMode ?? 'bthwani_delivery';
  const fulfillmentModeMeta = getDshFulfillmentDeliveryModeMeta(resolvedFulfillmentMode);
  // pickup carries no delivery fee; partner_delivery and bthwani_delivery carry a preview fee (PREVIEW_ONLY — real fee from WLT).
  const deliveryAmount = resolvedFulfillmentMode === 'pickup' ? 0 : 950;
  const [pickupAddr, setPickupAddr] = useState('جوار الجبل الجديد');
  const [note, setNote] = useState('لا يوجد ملاحظة');
  const [extraRequest, setExtraRequest] = useState('');
  const [scheduling, setScheduling] = useState<'now' | 'later'>('now');
  const executionScheduleOptions = useMemo(() => createExecutionScheduleOptions(), []);
  const [scheduledDate, setScheduledDate] = useState(() => executionScheduleOptions.dateOptions[0]?.value ?? '');
  const [scheduledTime, setScheduledTime] = useState(() => executionScheduleOptions.timeOptions[0]?.value ?? '');
  const [quickActionKey, setQuickActionKey] = useState<QuickActionKey | null>(null);
  const [quickActionDraft, setQuickActionDraft] = useState('');
  const [locationEditorVisible, setLocationEditorVisible] = useState(false);
  const [locationDraft, setLocationDraft] = useState('');
  const [locationFeedback, setLocationFeedback] = useState<string | null>(null);
  const [notice, setNotice] = useState<ScreenNotice | null>(null);
  const [previewProduct, setPreviewProduct] = useState<RecommendationProduct | null>(null);
  const [previewFeedback, setPreviewFeedback] = useState<PreviewFeedback | null>(null);
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
  } = useWltDshWalletPreview();

  const checkoutAction = props.onContinue ?? props.onOpenOrder;
  const { direction } = useDirection();
  const isRTL = direction === 'rtl';
  const quickActionMeta = quickActionKey ? QUICK_ACTION_META[quickActionKey] : null;
  const hasWltServiceRoute = typeof props.onOpenService === 'function';
  const totalItemsCount = useMemo(
    () => items.reduce((acc, item) => acc + (item.qty ?? 1), 0),
    [items],
  );
  const clientState = useMemo<DshClientState>(
    () => props.clientState ?? (totalItemsCount > 0 ? 'cart_ready' : 'cart_empty'),
    [props.clientState, totalItemsCount],
  );
  const isOrderSubmitted = clientState === 'order_created' || clientState === 'order_confirmed';
  const canEditOrder = !isOrderSubmitted && Boolean(props.onOpenStore ?? props.onOpenOrder ?? props.onContinue);
  const clientStateMeta = useMemo(() => getDshClientStateMeta(clientState), [clientState]);
  const paymentPendingMeta = useMemo(() => getDshClientStateMeta('payment_pending'), []);
  const walletCreditMeta = useMemo(() => getDshClientStateMeta('wallet_credit_visible'), []);

  const subtotalMinorUnits = useMemo(
    () => items.reduce((acc, item) => acc + Math.round(resolveCartItemPriceValue(item) * 100) * (item.qty ?? 1), 0),
    [items],
  );
  const subtotalAmount = subtotalMinorUnits / 100;
  const couponDiscount = couponCode ? 500 : 0;
  const grandTotalAmount = Math.max(subtotalAmount + deliveryAmount - couponDiscount, 0);
  const grandTotalMinorUnits = Math.max(subtotalMinorUnits + Math.round(deliveryAmount * 100) - Math.round(couponDiscount * 100), 0);
  const walletBalance = walletBalanceRaw ?? 0;
  const walletShortfallMinorUnits = Math.max(grandTotalMinorUnits - walletBalance, 0);
  const canUseWalletFull = walletLinked && walletBalance >= grandTotalMinorUnits;
  const canUseMixedPayment = walletLinked && walletBalance > 0 && walletBalance < grandTotalMinorUnits;
  const formattedSubtotal = formatAmount(subtotalAmount);
  const formattedDelivery = formatAmount(deliveryAmount);
  const formattedDiscount = couponDiscount > 0 ? `-${formatAmount(couponDiscount)}` : undefined;
  const formattedGrandTotal = formatAmount(grandTotalAmount);
  const formattedWalletBalance = formatAmount(walletBalance / 100);
  const formattedWalletShortfall = formatMinorUnitsAmount(walletShortfallMinorUnits);
  const canCheckout = totalItemsCount > 0;
  const deliveryNotice = 'قد تتغير رسوم التوصيل بعد اعتماد الموقع.';
  const androidSystemBottomInset = Platform.OS === 'android'
    ? Math.max(safeArea.compact, Dimensions.get('screen').height - Dimensions.get('window').height)
    : safeArea.comfortable;
  const footerSafePadding = androidSystemBottomInset + spacing[2];
  const resolvedFooterHeight = footerHeight > 0 ? footerHeight : sizes.controlMd + footerSafePadding + spacing[4];
  const actionBarBottomPadding = resolvedFooterHeight + spacing[2];
  const activePreviewCartItem = useMemo(
    () => (previewProduct ? findCartItemForProduct(items, previewProduct) : undefined),
    [items, previewProduct],
  );
  const previewCartQty = activePreviewCartItem?.qty ?? 0;

  const updateItemQty = (id: string, qty: number) => {
    const targetItem = items.find((item) => item.id === id);
    if (!targetItem) return;

    if (qty <= 0) {
      const index = items.findIndex((item) => item.id === id);
      const updated = items.filter((item) => item.id !== id);
      setItems(updated);

      showNotice(
        `تم حذف "${targetItem.title}" من السلة`,
        undefined,
        'warning',
        'تراجع',
        () => {
          const restored = [...updated];
          restored.splice(index, 0, targetItem);
          setItems(restored);
          showNotice(`تمت استعادة "${targetItem.title}"`, undefined, 'success');
        }
      );
      return;
    }

    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, qty } : item)));
  };

  const removeItem = (id: string) => {
    const targetItem = items.find((item) => item.id === id);
    if (!targetItem) return;

    const index = items.findIndex((item) => item.id === id);
    const updated = items.filter((item) => item.id !== id);
    setItems(updated);

    showNotice(
      `تم حذف "${targetItem.title}" من السلة`,
      undefined,
      'warning',
      'تراجع',
      () => {
        const restored = [...updated];
        restored.splice(index, 0, targetItem);
        setItems(restored);
        showNotice(`تمت استعادة "${targetItem.title}"`, undefined, 'success');
      }
    );
  };

  const showNotice = (
    title: string,
    description?: string,
    tone: ScreenNotice['tone'] = 'info',
    actionLabel?: string,
    onActionPress?: () => void,
  ) => {
    setNotice({ title, description, tone, actionLabel, onActionPress });
  };

  const dismissNotice = () => {
    setNotice(null);
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

  // PREVIEW_ONLY: in-memory simulation — no real ledger write
  const topUpWalletInline = async (amountMinorUnits: number) => {
    try {
      const normalizedAmount = Math.max(amountMinorUnits, 0);
      if (!normalizedAmount) {
        showNotice('لا يوجد مبلغ مطلوب للشحن', 'الرصيد الحالي يغطي الطلب أو لا توجد بيانات كافية.', 'info');
        return;
      }

      await topUpWallet(normalizedAmount);
      await refreshWallet();
      showNotice('تم شحن الرصيد', `تم شحن ${formatMinorUnitsAmount(normalizedAmount)} في المحفظة.`, 'success');
    } catch {
      showNotice('تعذر شحن الرصيد', 'حدث خطأ أثناء تحديث رصيد المحفظة.', 'danger');
    }
  };

  const paymentSelection = useMemo<PaymentSelection>(() => {
    if (paymentMethod === 'wallet') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'wallet',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'جاري التحقق من حالة المحفظة.',
          blockingReason: 'انتظر اكتمال مزامنة حالة الربط والرصيد ثم أعد المحاولة.',
          feedbackTone: 'info',
        };
      }

      if (!walletLinked) {
        if (EXPERIMENTAL_PAYMENT_ENABLED) {
          return {
            method: 'wallet',
            walletAmountMinorUnits: grandTotalMinorUnits,
            amountDueOnDeliveryMinorUnits: 0,
            valid: true,
            isExperimental: true,
            summary: 'دفع تجريبي من المحفظة — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'ادفع كامل الطلب من رصيد WLT الداخلي.',
          blockingReason: hasWltServiceRoute ? 'اربط المحفظة أو اشحنها عبر WLT أولًا ثم أعد الاختيار.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance < grandTotalMinorUnits) {
        if (EXPERIMENTAL_PAYMENT_ENABLED) {
          return {
            method: 'wallet',
            walletAmountMinorUnits: walletBalance,
            amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
            valid: true,
            isExperimental: true,
            summary: 'دفع تجريبي جزئي من المحفظة — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'wallet',
          walletAmountMinorUnits: walletBalance,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
          valid: false,
          summary: 'الرصيد الحالي أقل من إجمالي الطلب.',
          blockingReason: `تحتاج شحن ${formattedWalletShortfall} قبل اعتماد هذا الخيار.`,
          feedbackTone: 'info',
        };
      }

      return {
        method: 'wallet',
        walletAmountMinorUnits: grandTotalMinorUnits,
        amountDueOnDeliveryMinorUnits: 0,
        valid: true,
        summary: 'الرصيد يكفي، سيتم الدفع كاملًا من المحفظة.',
        feedbackTone: 'success',
      };
    }

    if (paymentMethod === 'mixed') {
      if (!walletHydrated || walletRefreshing) {
        return {
          method: 'mixed',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'جاري التحقق من حالة المحفظة.',
          blockingReason: 'انتظر اكتمال المزامنة قبل تفعيل الدفع المدمج.',
          feedbackTone: 'info',
        };
      }

      if (!walletLinked || walletBalance <= 0) {
        if (EXPERIMENTAL_PAYMENT_ENABLED) {
          return {
            method: 'mixed',
            walletAmountMinorUnits: 0,
            amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
            valid: true,
            isExperimental: true,
            summary: 'دفع مدمج تجريبي — سيُسجَّل محليًا فقط',
            feedbackTone: 'info',
          };
        }

        return {
          method: 'mixed',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
          valid: false,
          summary: 'الدفع المدمج يحتاج رصيدًا فعليًا في WLT.',
          blockingReason: 'لا يوجد رصيد لاستخدام الدفع المدمج الآن.',
          feedbackTone: 'info',
        };
      }

      if (walletBalance >= grandTotalMinorUnits) {
        return {
          method: 'mixed',
          walletAmountMinorUnits: grandTotalMinorUnits,
          amountDueOnDeliveryMinorUnits: 0,
          valid: false,
          summary: 'الرصيد يكفي للدفع الكامل من المحفظة.',
          blockingReason: 'الرصيد يكفي للدفع الكامل من المحفظة، لذلك الدفع المدمج غير ضروري.',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'mixed',
        walletAmountMinorUnits: walletBalance,
        amountDueOnDeliveryMinorUnits: grandTotalMinorUnits - walletBalance,
        valid: true,
        summary: `سيُخصم ${formattedWalletBalance} من المحفظة ويُدفع ${formatMinorUnitsAmount(grandTotalMinorUnits - walletBalance)} عند الاستلام.`,
        feedbackTone: 'info',
      };
    }

    if (paymentMethod === 'official-wallets') {
      if (!hasWltServiceRoute && EXPERIMENTAL_PAYMENT_ENABLED) {
        return {
          method: 'official-wallets',
          walletAmountMinorUnits: 0,
          amountDueOnDeliveryMinorUnits: 0,
          valid: true,
          isExperimental: true,
          summary: 'دفع تجريبي عبر محافظ رسمية — سيُسجَّل محليًا فقط',
          feedbackTone: 'info',
        };
      }

      return {
        method: 'official-wallets',
        walletAmountMinorUnits: 0,
        amountDueOnDeliveryMinorUnits: 0,
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
      walletAmountMinorUnits: 0,
      amountDueOnDeliveryMinorUnits: grandTotalMinorUnits,
      valid: true,
      summary: 'ستدفع كامل المبلغ عند الاستلام.',
      feedbackTone: 'info',
    };
  }, [formattedWalletBalance, formattedWalletShortfall, grandTotalMinorUnits, hasWltServiceRoute, paymentMethod, walletBalance, walletHydrated, walletLinked, walletRefreshing]);

  React.useEffect(() => {
    if (EXPERIMENTAL_PAYMENT_ENABLED) return;

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
          { label: 'من المحفظة', value: formatMinorUnitsAmount(0), tone: 'muted' },
          { label: 'عند الاستلام', value: formatMinorUnitsAmount(grandTotalMinorUnits), tone: 'brand' },
        ],
        helperText: paymentMethod === 'cod' ? 'لا يستخدم رصيد المحفظة.' : undefined,
        helperTone: 'info',
        onSelect: () => setPaymentMethod('cod'),
      },
      {
        id: 'wallet',
        title: 'من رصيد المحفظة',
        description: 'ادفع كامل الطلب من رصيد WLT الداخلي.',
        selected: paymentMethod === 'wallet',
        disabled: walletPending || (!canUseWalletFull && !EXPERIMENTAL_PAYMENT_ENABLED),
        statusLabel: paymentMethod === 'wallet' ? 'محدد' : walletPending ? 'قيد التحقق' : canUseWalletFull ? 'جاهز الآن' : EXPERIMENTAL_PAYMENT_ENABLED ? 'تجريبي' : !walletLinked ? 'يتطلب إجراء' : walletBalance <= 0 ? 'يتطلب إجراء' : 'يتطلب إجراء',
        statusTone: paymentMethod === 'wallet' ? 'brand' : walletPending ? 'info' : canUseWalletFull ? 'success' : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : !walletLinked || walletBalance <= 0 ? 'warning' : 'warning',
        amountRows: canUseWalletFull
          ? [
              { label: 'من المحفظة', value: formatMinorUnitsAmount(grandTotalMinorUnits), tone: 'brand' },
              { label: 'عند الاستلام', value: formatMinorUnitsAmount(0), tone: 'muted' },
            ]
          : walletLinked
            ? [
                { label: 'الرصيد الحالي', value: formattedWalletBalance, tone: 'brand' },
                { label: 'المطلوب شحنه', value: formattedWalletShortfall, tone: 'muted' },
              ]
            : [
                { label: 'إجمالي الطلب', value: formattedGrandTotal, tone: 'brand' },
                { label: 'حالة المحفظة', value: 'غير مرتبطة', tone: 'muted' },
              ],
        helperText: canUseWalletFull
          ? 'الرصيد يكفي للدفع الكامل.'
          : walletPending
            ? 'جاري التحقق من حالة الربط والرصيد...'
          : !walletLinked
            ? (hasWltServiceRoute ? 'اربط محفظتك أولًا عبر WLT.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.')
            : walletBalance <= 0
              ? 'لا يوجد رصيد متاح الآن.'
              : `المتبقي للشحن ${formattedWalletShortfall}.`,
        helperTone: canUseWalletFull ? 'success' : 'info',
        action: canUseWalletFull
          ? undefined
          : {
              label: walletLinked ? 'شحن الرصيد' : 'ربط المحفظة',
              tone: 'warning',
              onPress: walletLinked
                ? (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void topUpWalletInline(walletShortfallMinorUnits))
                : (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void linkWalletInline()),
              disabled: walletPending,
            },
        onSelect: (canUseWalletFull || EXPERIMENTAL_PAYMENT_ENABLED) ? () => setPaymentMethod('wallet') : undefined,
      },
      {
        id: 'mixed',
        title: 'محفظة + عند الاستلام',
        description: 'استخدم الرصيد المتاح وادفع المتبقي عند الاستلام.',
        selected: paymentMethod === 'mixed',
        disabled: walletPending || (!canUseMixedPayment && !EXPERIMENTAL_PAYMENT_ENABLED),
        statusLabel: paymentMethod === 'mixed' ? 'محدد' : walletPending ? 'قيد التحقق' : canUseMixedPayment ? 'جاهز الآن' : EXPERIMENTAL_PAYMENT_ENABLED ? 'تجريبي' : !walletLinked ? 'يتطلب إجراء' : walletBalance <= 0 ? 'يتطلب إجراء' : 'غير ضروري',
        statusTone: walletPending ? 'info' : canUseMixedPayment ? (paymentMethod === 'mixed' ? 'brand' : 'info') : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : !walletLinked || walletBalance <= 0 ? 'warning' : 'info',
        amountRows: canUseMixedPayment
          ? [
              { label: 'من المحفظة', value: formattedWalletBalance, tone: 'brand' },
              { label: 'عند الاستلام', value: formatMinorUnitsAmount(grandTotalMinorUnits - walletBalance), tone: 'brand' },
            ]
          : [
              { label: 'من المحفظة', value: walletLinked ? formattedWalletBalance : formatMinorUnitsAmount(0), tone: 'muted' },
              { label: 'عند الاستلام', value: formattedGrandTotal, tone: 'brand' },
            ],
        helperText: canUseMixedPayment
          ? `من المحفظة ${formattedWalletBalance}، وعند الاستلام ${formatMinorUnitsAmount(grandTotalMinorUnits - walletBalance)}.`
          : walletPending
            ? 'جاري التحقق من رصيد المحفظة...'
          : !walletLinked
            ? (hasWltServiceRoute ? 'افتح WLT لربط المحفظة.' : 'مسار شحن المحفظة غير موصول بعد داخل المضيف الحالي.')
            : walletBalance <= 0
              ? 'لا يوجد رصيد للدفع المدمج.'
              : 'الرصيد يكفي للدفع الكامل من المحفظة.',
        helperTone: 'info',
        action: canUseMixedPayment || walletBalance >= grandTotalMinorUnits
          ? undefined
          : {
              label: !walletLinked ? 'فتح WLT' : 'شحن الرصيد',
              tone: 'warning',
              onPress: !walletLinked
                ? (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void linkWalletInline())
                : (hasWltServiceRoute ? () => openWltService('wallet-topup') : () => void topUpWalletInline(walletShortfallMinorUnits)),
              disabled: walletPending,
            },
        onSelect: (canUseMixedPayment || EXPERIMENTAL_PAYMENT_ENABLED) ? () => setPaymentMethod('mixed') : undefined,
      },
      {
        id: 'official-wallets',
        title: 'الدفع عبر المحافظ الرسمية',
        description: 'اختر محفظة رسمية وأكمل عبر WLT.',
        selected: paymentMethod === 'official-wallets',
        disabled: !hasWltServiceRoute && !EXPERIMENTAL_PAYMENT_ENABLED,
        statusLabel: paymentMethod === 'official-wallets' ? 'محدد' : hasWltServiceRoute ? 'مسار خارجي' : EXPERIMENTAL_PAYMENT_ENABLED ? 'تجريبي' : 'غير موصول',
        statusTone: paymentMethod === 'official-wallets' ? 'brand' : EXPERIMENTAL_PAYMENT_ENABLED ? 'warning' : 'info',
        amountRows: [
          { label: 'إجمالي الطلب', value: formattedGrandTotal, tone: 'brand' },
        ],
        helperText: hasWltServiceRoute
          ? 'خيار مستقل عن رصيد المحفظة الداخلي.'
          : 'هذا الخيار يحتاج ربط مسار المحافظ الرسمية داخل المضيف الحالي.',
        helperTone: 'info',
        action: {
          label: hasWltServiceRoute ? (walletLinked ? 'اختيار محفظة رسمية' : 'فتح WLT') : 'المسار غير موصول',
          tone: 'secondary',
          onPress: hasWltServiceRoute ? () => openWltService('official-wallets') : undefined,
          disabled: !hasWltServiceRoute,
        },
        onSelect: (hasWltServiceRoute || EXPERIMENTAL_PAYMENT_ENABLED) ? () => setPaymentMethod('official-wallets') : undefined,
      },
    ];
  }, [canUseMixedPayment, canUseWalletFull, formattedGrandTotal, formattedWalletBalance, formattedWalletShortfall, grandTotalMinorUnits, hasWltServiceRoute, paymentMethod, topUpWalletInline, walletBalance, walletHydrated, walletLinked, walletRefreshing, walletShortfallMinorUnits]);

  const handleCheckoutPress = async () => {
    if (isOrderSubmitted) {
      showNotice('الطلب قيد التنفيذ', 'تم إرسال الطلب بالفعل. التعديل يتم عبر فريق العمليات فقط.', 'info');
      return;
    }

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

    if (paymentSelection.isExperimental) {
      showNotice('تم تسجيل الدفع التجريبي', paymentSelection.summary, 'success');
      await Promise.resolve(checkoutAction({
        paymentMethod: paymentSelection.method,
        walletAmountMinorUnits: paymentSelection.walletAmountMinorUnits,
        amountDueOnDeliveryMinorUnits: paymentSelection.amountDueOnDeliveryMinorUnits,
        orderTotalMinorUnits: grandTotalMinorUnits,
        summary: paymentSelection.summary,
        financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
      }));
      return;
    }

    if (paymentSelection.method === 'wallet') {
      setCheckoutLoading(true);
      try {
        const paymentResult = await requestWalletPayment(paymentSelection.walletAmountMinorUnits);
        await refreshWallet();
        if (!paymentResult.success) {
          showNotice('تعذر خصم مبلغ المحفظة', paymentResult.error === 'insufficient_balance' ? 'الرصيد لم يعد كافيًا بعد آخر تحديث.' : 'حدث خطأ أثناء تهيئة الدفع من المحفظة.', 'danger');
          return;
        }

        await Promise.resolve(checkoutAction({
          paymentMethod: paymentSelection.method,
          walletAmountMinorUnits: paymentSelection.walletAmountMinorUnits,
          amountDueOnDeliveryMinorUnits: paymentSelection.amountDueOnDeliveryMinorUnits,
          orderTotalMinorUnits: grandTotalMinorUnits,
          summary: paymentSelection.summary,
          financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
        }));
        return;
      } finally {
        setCheckoutLoading(false);
      }
    }

    await Promise.resolve(checkoutAction({
      paymentMethod: paymentSelection.method,
      walletAmountMinorUnits: paymentSelection.walletAmountMinorUnits,
      amountDueOnDeliveryMinorUnits: paymentSelection.amountDueOnDeliveryMinorUnits,
      orderTotalMinorUnits: grandTotalMinorUnits,
      summary: paymentSelection.summary,
      financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
    }));
  };

  const handleEditPress = () => {
    if (!canEditOrder) {
      showNotice('تعديل الطلب غير متاح الآن', 'زر التعديل يحتاج مسار رجوع أو تحرير موصول داخل المضيف.', 'info');
      return;
    }

    if (props.onOpenStore) {
      props.onOpenStore();
      return;
    }

    const editPayload: CheckoutActionPayload = {
      paymentMethod: paymentSelection.method,
      walletAmountMinorUnits: paymentSelection.walletAmountMinorUnits,
      amountDueOnDeliveryMinorUnits: paymentSelection.amountDueOnDeliveryMinorUnits,
      orderTotalMinorUnits: grandTotalMinorUnits,
      summary: paymentSelection.summary,
      financeEventKind: resolveWltDshFinanceEventKindForPaymentMethod(paymentSelection.method),
    };

    if (props.onOpenOrder) {
      props.onOpenOrder(editPayload);
      return;
    }

    props.onContinue?.(editPayload);
  };

  const openQuickAction = (actionKey: QuickActionKey) => {
    if (quickActionKey === actionKey) {
      setQuickActionKey(null);
      setQuickActionDraft('');
      return;
    }

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
    if (!quickActionKey) {
      return;
    }

    const trimmedValue = quickActionDraft.trim();

    if (quickActionKey === 'coupon') {
      if (trimmedValue) {
        const activeCouponOffers = getPartnerOfferItems().filter(
          o => o.offerType === 'coupon' && isClientVisibleStatus(o.status as CommercialLifecycleStatus),
        );
        const entitlements = getEntitlements();
        const hasCouponEntitlement = entitlements.some(
          e => isClientVisibleStatus(e.status as CommercialLifecycleStatus),
        );
        if (activeCouponOffers.length === 0 && !hasCouponEntitlement) {
          showNotice('لا توجد قسائم نشطة', 'لا يوجد عرض قسيمة نشط حالياً لهذا المتجر.', 'warning');
          return;
        }
      }
      setCouponCode(trimmedValue);
      showNotice(
        trimmedValue ? 'تم حفظ القسيمة' : 'أزلت القسيمة المحلية',
        trimmedValue ? `القسيمة الحالية: ${trimmedValue}` : 'لن يتم إرسال أي قسيمة مع الطلب الحالي.',
        'success',
      );
    }

    if (quickActionKey === 'address') {
      setPickupAddr(trimmedValue || 'العنوان غير محدد بعد');
      showNotice('تم تحديث العنوان', trimmedValue || 'تم حفظ العنوان كحالة غير محددة حتى يتم إدخاله لاحقًا.', 'success');
    }

    if (quickActionKey === 'note') {
      const nextNote = trimmedValue || 'لا يوجد ملاحظة';
      setNote(nextNote);
      showNotice('تم تحديث الملاحظة', nextNote, 'success');
    }

    if (quickActionKey === 'extra') {
      setExtraRequest(trimmedValue);
      showNotice(
        trimmedValue ? 'تم حفظ الطلب الإضافي' : 'لا يوجد طلب إضافي محفوظ',
        trimmedValue || 'يمكنك إضافة طلب إضافي لاحقًا عند الحاجة.',
        'success',
      );
    }

    setQuickActionKey(null);
    setQuickActionDraft('');
  };

  const openLocationEditor = () => {
    setQuickActionKey(null);
    setQuickActionDraft('');
    setLocationDraft(pickupAddr === 'العنوان غير محدد بعد' ? '' : pickupAddr);
    setLocationFeedback(null);
    setLocationEditorVisible(true);
  };

  const closeLocationEditor = () => {
    setLocationDraft(pickupAddr === 'العنوان غير محدد بعد' ? '' : pickupAddr);
    setLocationEditorVisible(false);
  };

  const applyLocationDraft = () => {
    const trimmedValue = locationDraft.trim();
    const nextLocation = trimmedValue || 'العنوان غير محدد بعد';

    setPickupAddr(nextLocation);
    setLocationFeedback(
      trimmedValue
        ? 'تم تحديث موقع التوصيل محليًا.'
        : 'تم حفظ الموقع كحالة غير محددة حتى يتم إدخاله لاحقًا.',
    );
    setLocationEditorVisible(false);
  };

  const openProductPreview = (product: RecommendationProduct) => {
    setPreviewProduct(product);
    setPreviewFeedback(null);
  };

  const closeProductPreview = () => {
    setPreviewProduct(null);
    setPreviewFeedback(null);
  };

  const handlePreviewPrimaryAction = () => {
    if (!previewProduct) {
      return;
    }

    const matchingCartItem = findCartItemForProduct(items, previewProduct);
    if (matchingCartItem) {
      setItems((prev) => prev.map((item) => (
        item.id === matchingCartItem.id
          ? { ...item, qty: (item.qty ?? 1) + 1 }
          : item
      )));
      setPreviewFeedback({ message: 'زادت الكمية', tone: 'success' });
      return;
    }

    setItems((prev) => [
      ...prev,
      {
        id: previewProduct.id,
        title: previewProduct.title,
        priceLabel: previewProduct.priceLabel,
        priceValue: previewProduct.priceValue,
        qty: 1,
      },
    ]);
    setPreviewFeedback({ message: 'تمت الإضافة', tone: 'success' });
  };

  const handleOpenFirstRecommendationPreview = () => {
    const firstProduct = RECOMMENDED_PRODUCTS[0];
    if (firstProduct) {
      openProductPreview(firstProduct);
    }
  };

  const handleSubscribePress = () => {
    showNotice('الاشتراك جاهز UI فقط', 'زر الاشتراك واضح وفعال، لكن تفعيل الميزة يحتاج ربطًا لاحقًا خارج هذا النطاق.', 'info');
  };

  const handleOpenStore = () => {
    if (props.onOpenStore) {
      props.onOpenStore();
    } else {
      showNotice('واجهة المتجر غير موصولة', 'زر إضافة منتجات أخرى جاهز، ولكن لم يتم تمرير مسار واجهة المتجر في هذا العرض التجريبي.', 'info');
    }
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
        actions={[]}
      />

      <MobileScrollView fill padding={1} gap={1} contentContainerStyle={{ paddingBottom: spacing[2] }}>
        <PromoBanner onPress={handleSubscribePress} />

        <Surface tone="default" gap={0} style={{ backgroundColor: colorPalette.surfacePrimary, borderWidth: 1, borderColor: BORDER_SOFT, borderRadius: 16, overflow: 'hidden' }}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingHorizontal: spacing[3], paddingVertical: spacing[2], borderBottomWidth: 1, borderColor: BORDER_SOFT }}>
            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1.5], flex: 1 }}>
              <Icon name={fulfillmentModeMeta.icon} size={15} color={TEXT_PRIMARY} />
              <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', textAlign: 'right' }}>
                {fulfillmentModeMeta.label}
              </Text>
            </View>
            <Text role="caption" style={{ color: TEXT_SECONDARY }}>وضع التنفيذ</Text>
          </View>
          <OptionRow
            title="هل لديك قسيمة تخفيض؟"
            subtitle={couponCode ? `القسيمة الحالية: ${couponCode}` : 'أدخل رمز التخفيض إن وجد'}
            actionLabel={couponCode ? 'تعديل' : 'إضافة'}
            onAction={() => openQuickAction('coupon')}
            style={{ borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'coupon' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                submitDisabled={quickActionDraft.trim().length === 0}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={() => { setQuickActionKey(null); setQuickActionDraft(''); }}
              />
            </View>
          )}
          <OptionRow
            title="موقع التوصيل"
            subtitle={pickupAddr}
            actionLabel="تغيير"
            onAction={openLocationEditor}
            style={{ borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
          />
          <OptionRow
            title="ملاحظات الطلب"
            subtitle={note}
            actionLabel={note === 'لا يوجد ملاحظة' ? 'إضافة' : 'تعديل'}
            onAction={() => openQuickAction('note')}
            style={{ borderBottomWidth: 1, borderColor: BORDER_SOFT, paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
          />
          {quickActionKey === 'note' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={() => { setQuickActionKey(null); setQuickActionDraft(''); }}
              />
            </View>
          )}
          {resolvedFulfillmentMode === 'bthwani_delivery' && (
            <OptionRow
              title="طلب إضافي على الطريق"
              subtitle={extraRequest || 'مثال: بسبس أو ماء من أي ماركت على طريق الكابتن'}
              actionLabel={extraRequest ? 'تعديل' : 'إضافة'}
              onAction={() => openQuickAction('extra')}
              style={{ paddingVertical: spacing[1], paddingHorizontal: spacing[3] }}
            />
          )}
          {quickActionKey === 'extra' && quickActionMeta && (
            <View style={{ paddingHorizontal: spacing[2], paddingBottom: spacing[2] }}>
              <InlineActionEditor
                meta={quickActionMeta}
                value={quickActionDraft}
                onChangeValue={setQuickActionDraft}
                onSubmit={applyQuickAction}
                onClose={() => { setQuickActionKey(null); setQuickActionDraft(''); }}
              />
            </View>
          )}
        </Surface>

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
                selectedDate={scheduledDate}
                selectedTime={scheduledTime}
                onConfirm={(date, time) => {
                  const val = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                  setScheduledDate(val);
                  setScheduledTime(time);
                }}
              />
            )}
          </View>
        </Card>

        <View style={{ gap: spacing[2] }}>
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[2], paddingHorizontal: spacing[1] }}>
            <Text role="bodySm" style={{ color: TEXT_PRIMARY, fontWeight: '700', flex: 1, textAlign: 'right' }}>قرار الدفع</Text>
            {EXPERIMENTAL_PAYMENT_ENABLED ? (
              <View style={{ backgroundColor: colorPalette.warningSoft, borderRadius: 8, paddingHorizontal: spacing[2], paddingVertical: 2 }}>
                <Text role="caption" style={{ color: colorPalette.warning, fontWeight: '700' }}>تجريبي</Text>
              </View>
            ) : null}
          </View>
          <PaymentDecisionList items={paymentDecisionOptions} />
        </View>

        <RecommendedSection
          items={items}
          onOpenProductPreview={openProductPreview}
          onOpenStore={handleOpenStore}
        />

        <Surface
          tone="default"
          padding={3}
          gap={2}
          style={{
            backgroundColor: colorPalette.surfacePrimary,
            borderWidth: 1,
            borderColor: BORDER_SOFT,
            borderRadius: 16,
          }}
        >
          <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[2] }}>
            <View style={{ flex: 1, alignItems: isRTL ? 'flex-end' : 'flex-start', gap: spacing[0.5] }}>
              <Text role="bodyStrong" style={{ color: TEXT_PRIMARY, textAlign: isRTL ? 'right' : 'left' }}>
                موقع التوصيل
              </Text>
              <Text role="bodySm" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
                {pickupAddr}
              </Text>
            </View>
            <Button
              label="تغيير الموقع"
              tone="secondary"
              size="sm"
              fullWidth={false}
              onPress={openLocationEditor}
            />
          </View>

          <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: isRTL ? 'right' : 'left' }}>
            {deliveryNotice}
          </Text>

          {locationFeedback ? (
            <Text role="caption" style={{ color: ACCENT_BLUE, textAlign: isRTL ? 'right' : 'left' }}>
              {locationFeedback}
            </Text>
          ) : null}

          {locationEditorVisible ? (
            <InlineActionEditor
              meta={QUICK_ACTION_META.address}
              value={locationDraft}
              onChangeValue={setLocationDraft}
              onSubmit={applyLocationDraft}
              onClose={closeLocationEditor}
            />
          ) : null}
        </Surface>

        <CartItemEditor
          items={items}
          onChangeQty={updateItemQty}
          onRemove={removeItem}
          onClearCart={() => {
            setItems([]);
            showNotice('تم تفريغ السلة', 'يمكنك فتح أول منتج مقترح أو اختيار أي بطاقة من المقترحات أدناه.', 'success');
          }}
          onScrollToRecommendations={handleOpenFirstRecommendationPreview}
          subtotal={subtotalAmount}
          deliveryFee={deliveryAmount}
          discount={couponDiscount}
          grandTotal={grandTotalAmount}
          couponCode={couponCode}
        />
        <View style={{ height: actionBarBottomPadding }} />
      </MobileScrollView>

      <View
        onLayout={(event) => setFooterHeight(event.nativeEvent.layout.height)}
        style={{
          position: 'absolute', left: 0, right: 0, bottom: 0,
          paddingHorizontal: spacing[3],
          paddingTop: spacing[2],
          paddingBottom: footerSafePadding,
          backgroundColor: colorPalette.surfacePrimary,
          borderTopWidth: 1,
          borderColor: BORDER_SOFT,
          zIndex: 5,
          elevation: 12,
          shadowColor: colorPalette.black,
          shadowOpacity: 0.1,
          shadowRadius: 20,
          shadowOffset: { width: 0, height: -4 },
        }}
      >
        {!canCheckout ? (
          <View style={{ flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1], paddingBottom: spacing[1] }}>
            <Icon name="cart-outline" size={13} color={TEXT_SECONDARY} />
            <Text role="caption" style={{ color: TEXT_SECONDARY, textAlign: 'right', flex: 1 }}>
              {clientStateMeta.label}
            </Text>
          </View>
        ) : null}
        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', gap: spacing[2] }}>
          <Button
            label={isOrderSubmitted ? 'الطلب قيد التنفيذ' : canCheckout ? 'تنفيذ الطلب' : 'أضف عناصر أولاً'}
            tone="brand"
            size="md"
            fullWidth={false}
            disabled={isOrderSubmitted || !canCheckout || checkoutLoading}
            loading={checkoutLoading}
            onPress={handleCheckoutPress}
            style={{ flex: 2, minHeight: 52, borderRadius: 18, opacity: isOrderSubmitted ? 0.6 : 1 }}
          />
          <Button
            label={isOrderSubmitted ? 'طلب تعديل عبر العمليات' : 'تعديل'}
            tone="secondary"
            size="md"
            fullWidth={false}
            disabled={!canEditOrder}
            onPress={isOrderSubmitted ? undefined : handleEditPress}
            style={{ flex: 1, minHeight: 52, borderRadius: 18 }}
          />
        </View>
      </View>

      <Toast
        visible={Boolean(notice)}
        title={notice?.title ?? ''}
        description={notice?.description}
        tone={notice?.tone ?? 'info'}
        onDismiss={dismissNotice}
        actionLabel={notice?.actionLabel}
        onActionPress={() => {
          notice?.onActionPress?.();
          dismissNotice();
        }}
      />

      <ProductPreviewModal
        visible={Boolean(previewProduct)}
        product={previewProduct}
        cartQty={previewCartQty}
        feedback={previewFeedback}
        bottomInset={androidSystemBottomInset}
        onClose={closeProductPreview}
        onPrimaryAction={handlePreviewPrimaryAction}
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
    </View>
  );
}

export { DshCartUnifiedScreen, DshCartUnifiedScreen as DshCartGetScreen };
