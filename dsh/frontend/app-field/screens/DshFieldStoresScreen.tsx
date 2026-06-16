import React from 'react';
import { ScrollView, View } from 'react-native';
import { Badge, Box, Button, Divider, colorPalette, Icon, MobileScrollView, ModernPremiumHeader, ScreenHeader, SearchField, StateView, Text, TopBar, useTheme,
  spacing,
} from '@bthwani/ui-kit';
import { FieldStoreCard } from '../parts/FieldStoreCard';
import { DSH_FIELD_BINDING_CONTRACTS } from '../contracts/dsh-field-binding.contracts';
import {
  fieldFilterOptions,
} from '../dsh-field.routes';
import {
  resolveFieldFilterCounts,
} from '../field.surface-model';
import type {
  FieldLeadFilter,
  FieldStoreFile,
} from '../dsh-field.routes';
import {
  resolveFilteredOnboardingStores,
  resolvePriorityOnboardingStore,
} from '../../shared/partner/onboarding/partner-onboarding-listing.model';

function resolveStoresBindingLabel() {
  return 'جسر قائمة المتاجر';
}

type DshFieldStoresScreenProps = {
  state?: 'ready' | 'loading' | 'empty' | 'error' | 'offline';
  stores: readonly FieldStoreFile[];
  onOpenStore: (storeId: string) => void;
  onOpenAccount: () => void;
  onCreateStore: () => void;
  onRetry?: () => void;
};

export function DshFieldStoresScreen({ state = 'ready', stores, onOpenStore, onOpenAccount, onCreateStore, onRetry }: DshFieldStoresScreenProps) {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<FieldLeadFilter>('today');

  const counts = React.useMemo(() => resolveFieldFilterCounts(stores), [stores]);

  const filteredStores = React.useMemo(() => {
    return resolveFilteredOnboardingStores(stores, activeFilter, searchQuery);
  }, [activeFilter, searchQuery, stores]);

  const priorityStore = React.useMemo(() => {
    return resolvePriorityOnboardingStore(filteredStores, stores);
  }, [filteredStores, stores]);

  const storesBinding = DSH_FIELD_BINDING_CONTRACTS.find((contract) => contract.surfaceId === 'stores');

  if (state === 'loading') {
    return <StateView stateId="loading" title="جارٍ تحميل ملفات الميدان" description="نقوم بمزامنة أحدث بيانات المتجر والمواقع الآن." />;
  }

  if (state === 'error' || state === 'offline') {
    return (
      <StateView
        stateId={state === 'offline' ? 'offline' : 'recoverableError'}
        title={state === 'offline' ? 'الاتصال مقطوع' : 'تعذر تحميل القائمة'}
        description="تأكد من الاتصال بالشبكة ثم حاول التحديث مرة أخرى."
        actionLabel="إعادة المحاولة"
        onActionPress={onRetry}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <ModernPremiumHeader
        title="بثواني"
        locationLabel="الرياض · جولة المتاجر"
        actions={[
          {
            id: 'account',
            icon: <Icon name="person-outline" size={21} color={colorPalette.white} />,
            accessibilityLabel: 'الحساب',
            onPress: onOpenAccount,
          },
          {
            id: 'notifications',
            icon: <Icon name="notifications-outline" size={21} color={colorPalette.white} />,
            badgeCount: counts.pending,
            accessibilityLabel: 'التنبيهات',
          },
        ]}
        direction="rtl"
      />

      <MobileScrollView fill padding={0} gap={0} contentContainerStyle={{ paddingBottom: 128 }}>
        <Box padding={4} gap={4}>
          {/* Section 1: خط الميداني الحالي */}
          <Box gap={3} paddingY={2}>
            <Box gap={1}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>خط الميداني الحالي</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                ابدأ ببطاقة متجر واحدة، ثم الزيارة، ثم الإرسال للمراجعة دون أي لوحة عامة خارج نطاقك.
              </Text>
            </Box>
            <Box gap={2}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>
                {priorityStore ? `المتجر التالي: ${priorityStore.name}` : 'لا يوجد متجر جاهز الآن'}
              </Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                {priorityStore
                  ? `${priorityStore.category} · ${priorityStore.location} · ${priorityStore.nextVisitLabel}`
                  : 'أنشئ ملفًا جديدًا أو وسّع البحث لاستئناف الجولة الميدانية.'}
              </Text>
              <Text role="caption" tone="soft" style={{ textAlign: 'right' }}>
                {storesBinding
                  ? `حالة الربط: ${resolveStoresBindingLabel()} · قائمة المتاجر والمفاضلة بينها.`
                  : 'حالة الربط: قائمة المتاجر.'}
              </Text>
              {priorityStore ? (
                <Button label="فتح المتجر التالي" onPress={() => onOpenStore(priorityStore.id)} />
              ) : (
                <Button label="إنشاء ملف جديد" onPress={onCreateStore} />
              )}
            </Box>
          </Box>

          <Divider />

          {/* Section 2: مؤشر الملفات اليوم */}
          <Box gap={3} paddingY={2}>
            <Box gap={1}>
              <Text role="bodyStrong" style={{ textAlign: 'right' }}>مؤشر الملفات اليوم</Text>
              <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                تلخيص سريع للجولة الحالية وحجم المتابعة داخل ملف المتجر فقط.
              </Text>
            </Box>
            <View style={{ flexDirection: 'row-reverse', flexWrap: 'wrap', gap: spacing[2] }}>
              <Badge label={`اليوم ${counts.today}`} tone="brand" />
              <Badge label={`جاهز للإضافة ${counts.ready}`} tone="success" />
              <Badge label={`تحتاج متابعة ${counts['follow-up']}`} tone="warning" />
              <Badge label={`مرسل ${counts.submitted}`} tone="info" />
            </View>
          </Box>

          <Divider />

          {/* Section 3: قائمة المتاجر */}
          <Box gap={3} paddingY={2}>
            <Box gap={3}>
              <SearchField
                label="ابحث في المتاجر"
                value={searchQuery}
                onChangeText={setSearchQuery}
                hint="الاسم، التصنيف، الموقع، أو الحالة"
              />

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                nestedScrollEnabled
                decelerationRate="fast"
                style={{ transform: [{ scaleX: -1 }] }}
                contentContainerStyle={{ flexDirection: 'row', gap: spacing[2], paddingHorizontal: 2 }}
              >
                {fieldFilterOptions.map((option) => {
                  const selected = activeFilter === option.id;

                  return (
                    <View key={option.id} style={{ transform: [{ scaleX: -1 }] }}>
                      <Button
                        label={`${option.label} ${counts[option.id]}`}
                        tone={selected ? 'primary' : 'secondary'}
                        size="sm"
                        fullWidth={false}
                        onPress={() => setActiveFilter(option.id)}
                      />
                    </View>
                  );
                })}
              </ScrollView>

              <ScreenHeader
                title="ملفات الانضمام"
                subtitle="البطاقات تبقى هي وحدة العمل الأساسية للميداني، بدون popup أو صفحات تشغيلية منفصلة."
                actionLabel="ملف جديد"
                onActionPress={onCreateStore}
              />

              <Box gap={3}>
                {filteredStores.length ? (
                  filteredStores.map((store) => (
                    <FieldStoreCard key={store.id} store={store} onPress={() => onOpenStore(store.id)} />
                  ))
                ) : (
                  <Box gap={2} paddingY={2}>
                    <Text role="bodyStrong" style={{ textAlign: 'right' }}>لا توجد نتائج مطابقة</Text>
                    <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                      بقي نمط البحث والشرائح والبطاقات كما هو، لكن لا توجد بطاقة تطابق الشرط الحالي.
                    </Text>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      </MobileScrollView>
    </View>
  );
}

export default DshFieldStoresScreen;
