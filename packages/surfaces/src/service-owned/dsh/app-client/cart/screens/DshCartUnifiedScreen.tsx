import React, { useEffect, useMemo, useState } from 'react';
import { View, I18nManager, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  Button,
  Icon,
  MobileScrollView,
  SectionHeader,
  Surface,
  Text,
  CartDetails,
  colorPalette,
  safeArea,
  sizes,
  spacing,
  TopBar,
} from '@bthwani/ui-kit';

const HEADER_RED = colorPalette.brandStrong ?? colorPalette.brand ?? '#F97316';
const SURFACE_PINK = colorPalette.brandSoft ?? '#FFF7ED';
const SURFACE_PINK_BORDER = colorPalette.brandSurface ?? '#FDBA74';
const ACCENT_GOLD = colorPalette.brand ?? '#F97316';
const LINK_BLUE = colorPalette.brand ?? '#F97316';
const TEXT_DARK = colorPalette.ink ?? '#243247';
const MUTED_TEXT = colorPalette.inkMuted ?? '#64748B';
const PAGE_BG = '#F9FAFB';
const STORAGE_KEY_BALANCE = 'dsh_bth_wallet_balance';

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
  const [activeQuickAction, setActiveQuickAction] = useState<'coupon' | 'address' | 'note' | 'bring' | null>(null);
  const [cartDetailsVisible, setCartDetailsVisible] = useState(false);
  const checkoutAction = props.onContinue ?? props.onOpenOrder ?? (() => {});
  const editAction = props.onOpenOrder ?? props.onContinue ?? (() => {});

  const totalHalalas = useMemo(
    () => items.reduce((acc, item) => acc + Math.round((item.priceValue ?? 0) * 100) * (item.qty ?? 1), 0),
    [items],
  );
  const totalAmount = totalHalalas / 100;
  const formattedTotal = useMemo(() => {
    try {
      return new Intl.NumberFormat('ar-YE', { style: 'currency', currency: 'YER' }).format(totalAmount);
    } catch {
      return `${totalAmount} ر.ي`;
    }
  }, [totalAmount]);

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

  function HeaderIconButton({ icon, background, color, size = 42, onPress }: { icon: any; background: string; color: string; size?: number; onPress?: () => void }) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => ({ width: size, height: size, borderRadius: size / 2, backgroundColor: background, alignItems: 'center', justifyContent: 'center', opacity: pressed ? 0.82 : 1 })}>
        <Ionicons name={icon} size={Math.max(16, Math.round(size * 0.43))} color={color} />
      </Pressable>
    );
  }

  function BadgeDot({ selected }: { selected: boolean }) {
    return (
      <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: selected ? ACCENT_GOLD : TEXT_DARK, alignItems: 'center', justifyContent: 'center' }}>
        {selected ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: ACCENT_GOLD }} /> : null}
      </View>
    );
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
            <Ionicons name="ribbon-outline" size={13} color={ACCENT_GOLD} />
          </View>
        </View>
      </Surface>
    );
  }

  function ActionRow({ id, icon, title, subtitle, actionLabel, actionColor = LINK_BLUE }: any) {
    const selected = activeQuickAction === id;
    return (
      <Pressable onPress={() => setActiveQuickAction(id)} style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: spacing[1], paddingHorizontal: spacing[1], minHeight: 54, borderBottomWidth: 1, borderColor: '#E5E7EB', backgroundColor: selected ? colorPalette.brandSoft : 'transparent' }}>
        <View style={{ width: 44, alignItems: 'center' }}>
          <HeaderIconButton icon={icon} size={40} background={HEADER_RED} color={colorPalette.white} onPress={() => setActiveQuickAction(id)} />
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end', paddingHorizontal: spacing[1] }}>
          <Text role="bodyStrong" style={{ textAlign: 'right', color: TEXT_DARK }}>
            {title}
          </Text>
          {subtitle ? (
            <Text role="bodySm" style={{ textAlign: 'right', color: MUTED_TEXT, lineHeight: 18 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={{ width: 62, alignItems: 'flex-start' }}>
          {actionLabel ? <Text role="bodyMd" style={{ color: actionColor, fontWeight: '600' }}>{actionLabel}</Text> : null}
        </View>

      </Pressable>
    );
  }

  function SchedulePanel() {
    return (
      <View style={{ marginTop: spacing[1], borderRadius: 18, backgroundColor: SURFACE_PINK, borderWidth: 1, borderColor: SURFACE_PINK_BORDER, padding: spacing[2], flexDirection: 'row-reverse', alignItems: 'center', gap: spacing[1] }}>
        <HeaderIconButton size={40} icon="time-outline" background={HEADER_RED} color={colorPalette.white} onPress={() => setScheduling((prev) => (prev === 'now' ? 'later' : 'now'))} />

        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text role="bodyStrong" style={{ textAlign: 'right', color: TEXT_DARK }}>
            تحديد وقت الطلب
          </Text>
          <Text role="bodySm" style={{ textAlign: 'right', color: MUTED_TEXT }}>
            وقت تنفيذ الطلب
          </Text>
        </View>

        <View style={{ width: 96, alignItems: 'flex-start', gap: 6 }}>
          <Button
            label={scheduling === 'now' ? 'الآن ✓' : 'الآن'}
            tone="danger"
            size="sm"
            fullWidth={false}
            onPress={() => setScheduling('now')}
            style={{ width: 78, minHeight: 32 }}
          />
          <Button
            label="في وقت لاحق"
            tone="secondary"
            size="sm"
            fullWidth={false}
            onPress={() => setScheduling('later')}
            style={{ width: 94, minHeight: 32 }}
          />
        </View>
      </View>
    );
  }

  function PaymentRow({ icon, title, subtitle, checked, actionLabel, onAction, onSelect }: any) {
    return (
      <Pressable onPress={onSelect} style={{ flexDirection: 'row-reverse', alignItems: 'center', paddingVertical: spacing[1], opacity: checked ? 1 : 0.98 }}>
        <View style={{ width: 30, alignItems: 'flex-end' }}>
          <BadgeDot selected={checked} />
        </View>

        <View style={{ width: 44, alignItems: 'center' }}>
          <HeaderIconButton icon={icon} size={40} background={HEADER_RED} color={colorPalette.white} onPress={onSelect} />
        </View>

        <View style={{ flex: 1, alignItems: 'flex-end', paddingHorizontal: spacing[1] }}>
          <Text role="bodyStrong" style={{ textAlign: 'right', color: TEXT_DARK }}>
            {title}
          </Text>
          {subtitle ? (
            <Text role="bodySm" style={{ textAlign: 'right', color: MUTED_TEXT, lineHeight: 18 }}>
              {subtitle}
            </Text>
          ) : null}
        </View>

        <View style={{ width: 76, alignItems: 'flex-start' }}>
          {actionLabel ? (
            <Button
              label={actionLabel}
              tone="primary"
              size="sm"
              fullWidth={false}
              onPress={onAction ?? (() => {})}
              style={{ width: 78, minHeight: 34 }}
            />
          ) : null}
        </View>

      </Pressable>
    );
  }

  function RecommendationCard({ title, price }: { title: string; price: string }) {
    return (
      <View style={{ width: 148, borderRadius: 16, overflow: 'hidden', backgroundColor: colorPalette.white, borderWidth: 1, borderColor: '#E5E7EB' }}>
        <View style={{ height: 124, backgroundColor: '#F8FAFC', position: 'relative', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 84, height: 84, borderRadius: 42, backgroundColor: '#FFFFFF', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, elevation: 2, alignItems: 'center', justifyContent: 'center' }}>
            <View style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#FDE68A' }} />
          </View>
          <View style={{ position: 'absolute', bottom: 8, left: 8, borderRadius: 6, backgroundColor: ACCENT_GOLD, paddingHorizontal: 10, paddingVertical: 3 }}>
            <Text role="bodySm" style={{ color: '#111827', fontWeight: '600' }}>
              {price}
            </Text>
          </View>
        </View>
        <View style={{ paddingHorizontal: spacing[1], paddingTop: spacing[1], paddingBottom: spacing[1] }}>
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

  function ItemsTable() {
    const formatAmount = (value: number) => {
      try {
        return new Intl.NumberFormat('ar-YE').format(value);
      } catch {
        return String(value);
      }
    };

    return (
      <Surface tone="raised" padding={2} gap={1}>
        <SectionHeader
          title="تفاصيل السلة"
          subtitle={`عناصر: ${items.length}`}
          trailing={(
              <Button
              label="التفاصيل"
              tone="secondary"
              size="sm"
              fullWidth={false}
              onPress={() => setCartDetailsVisible(true)}
            />
          )}
        />

        <View style={{ borderWidth: 1, borderColor: '#CFCFCF', borderRadius: 12, overflow: 'hidden', backgroundColor: colorPalette.white }}>
          <View style={{ flexDirection: 'row-reverse', backgroundColor: '#FAFAFA', borderBottomWidth: 1, borderColor: '#CFCFCF', paddingVertical: 4 }}>
            <View style={{ flex: 3, paddingHorizontal: 6 }}><Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'right' }}>المنتج</Text></View>
            <View style={{ flex: 1.3, paddingHorizontal: 6 }}><Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'center' }}>السعر</Text></View>
            <View style={{ flex: 1, paddingHorizontal: 6 }}><Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'center' }}>الكمية</Text></View>
            <View style={{ flex: 1.3, paddingHorizontal: 6 }}><Text role="bodySm" style={{ fontWeight: '700', color: TEXT_DARK, textAlign: 'center' }}>الإجمالي</Text></View>
          </View>

          {items.map((item) => (
            <View key={item.id} style={{ flexDirection: 'row-reverse', alignItems: 'center', borderBottomWidth: 1, borderColor: '#D9D9D9', paddingVertical: 6 }}>
              <View style={{ flex: 3, paddingHorizontal: 6 }}>
                <Text role="bodySm" style={{ color: TEXT_DARK, textAlign: 'right' }}>{item.title}</Text>
              </View>
              <View style={{ flex: 1.3, paddingHorizontal: 6 }}>
                <Text role="bodySm" style={{ color: TEXT_DARK, textAlign: 'center' }}>{formatAmount(item.priceValue)}</Text>
              </View>
              <View style={{ flex: 1, paddingHorizontal: 6, alignItems: 'center' }}>
                <Text role="bodySm" style={{ color: TEXT_DARK }}>{item.qty}</Text>
              </View>
              <View style={{ flex: 1.3, paddingHorizontal: 6 }}>
                <Text role="bodySm" style={{ color: TEXT_DARK, textAlign: 'center' }}>{formatAmount((item.priceValue ?? 0) * (item.qty ?? 1))}</Text>
              </View>
            </View>
          ))}
        </View>
      </Surface>
    );
  }

  const actionBarBottomPadding = spacing[2] + sizes.controlSm + (safeArea.comfortable ?? 0) + spacing[1];

  return (
    <View style={{ flex: 1, backgroundColor: PAGE_BG }}>
      <TopBar
        variant="surface"
        title="تأكيد الطلب"
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

        <MobileScrollView fill padding={2} gap={1} contentContainerStyle={{ paddingBottom: actionBarBottomPadding }}>

        <PromoBanner />

        <Surface tone="raised" padding={1} gap={1} style={{ overflow: 'hidden' }}>
          <ActionRow icon="pricetag-outline" title="هل لديك قسيمة تخفيض؟" actionLabel="إضافة" />
          <ActionRow icon="location-outline" title="عنوان التوصيل:" subtitle={pickupAddr} actionLabel="تغيير" />
          <ActionRow icon="document-text-outline" title="ملاحظات الطلب" subtitle={note} actionLabel="إضافة" />
          <ActionRow
            icon="basket-outline"
            title="ماذا تريد أن أحضره لك على طريقي؟"
            subtitle={`مثال: بسبس أو ماء من أي ماركت على طريق الكابتن\nويُحسب مع الكابتن ولا يدخل في قيمة الطلب`}
            actionLabel="إضافة"
          />
          <SchedulePanel />
        </Surface>

        <Surface tone="raised" padding={2} gap={1}>
          <SectionHeader title="الدفع" subtitle="( الدفع عند الاستلام )" />
          <View style={{ gap: spacing[1] }}>
            <PaymentRow icon="wallet-outline" title="الدفع عند الاستلام" subtitle="الدفع عند الاستلام" checked={paymentMethod === 'cod'} onSelect={() => setPaymentMethod('cod')} />
            <PaymentRow
              icon="cash-outline"
              title="الدفع من رصيد المحفظة ( 0 )"
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
            <PaymentRow
              icon="swap-horizontal-outline"
              title="مدمج ( كاش + محفظة )"
              subtitle="ادفع جزءاً بالمحفظة والباقي عند الاستلام"
              checked={paymentMethod === 'mixed'}
              onSelect={() => setPaymentMethod('mixed')}
            />
            <PaymentRow
              icon="card-outline"
              title="الدفع باستخدام المحافظ الرئيسية"
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
        </Surface>

        <RecommendedSection />

        <View style={{ paddingHorizontal: 0 }}>
          <View style={{ marginTop: spacing[1], marginBottom: spacing[1], gap: 6 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ alignItems: 'flex-end' }}>
                <Text role="bodySm" style={{ color: TEXT_DARK }}>
                  الإجمالي
                </Text>
                <Text role="bodySm" style={{ color: TEXT_DARK }}>
                  التوصيل
                </Text>
              </View>
              <View style={{ alignItems: 'flex-start' }}>
                <Text role="bodySm" style={{ color: TEXT_DARK }}>
                  12,600 ر.ي
                </Text>
                <Text role="bodySm" style={{ color: TEXT_DARK }}>
                  950 ر.ي
                </Text>
              </View>
            </View>
          </View>

          <View style={{ backgroundColor: ACCENT_GOLD, borderRadius: 14, paddingHorizontal: spacing[2], paddingVertical: spacing[2], marginVertical: spacing[1] }}>
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text role="bodyMd" style={{ color: '#111827', fontWeight: '600' }}>
                الإجمالي الكلي
              </Text>
              <Text role="titleLg" style={{ fontWeight: '700', color: '#111827' }}>
                13,550 ر.ي
              </Text>
            </View>
          </View>
        </View>

        <ItemsTable />
      </MobileScrollView>

      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: spacing[2], paddingTop: spacing[1], paddingBottom: safeArea.comfortable ?? spacing[1], backgroundColor: colorPalette.white, borderTopWidth: 1, borderColor: '#D6D6D6' }}>
        <View style={{ flexDirection: 'row', gap: spacing[1] }}>
          <Button label="تنفيذ الطلب" size="sm" fullWidth={false} onPress={checkoutAction} style={{ flex: 1, minHeight: 42, backgroundColor: HEADER_RED, borderRadius: 14 }} />
          <Button label="تعديل الطلب" tone="secondary" size="sm" fullWidth={false} onPress={editAction} style={{ flex: 1, minHeight: 42, borderRadius: 14 }} />
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

