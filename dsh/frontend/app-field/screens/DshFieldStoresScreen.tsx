import React from 'react';
import { ScrollView, View } from 'react-native';
import { Badge, Box, Button, Card, colorPalette, Icon, MobileScrollView, ModernPremiumHeader, ScreenHeader, SearchField, StateView, Text, TopBar } from '@bthwani/ui-kit';
import { FieldStoreCard } from '../parts/FieldStoreCard';
import { DSH_FIELD_BINDING_CONTRACTS } from '../contracts/dsh-field-binding.contracts';
import { fieldFilterOptions, matchesFieldStoreFilter, resolveFieldFilterCounts, type FieldLeadFilter, type FieldStoreFile } from '../data/field-stores.preview-data';

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
  const [searchQuery, setSearchQuery] = React.useState('');
  const [activeFilter, setActiveFilter] = React.useState<FieldLeadFilter>('today');

  const counts = React.useMemo(() => resolveFieldFilterCounts(stores), [stores]);

  const filteredStores = React.useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return stores.filter((store) => {
      if (!matchesFieldStoreFilter(store, activeFilter)) {
        return false;
      }

      if (!query) {
        return true;
      }

      const haystack = `${store.name} ${store.category} ${store.location}`.toLowerCase();
      return haystack.includes(query);
    });
  }, [activeFilter, searchQuery, stores]);

  const priorityStore = React.useMemo(() => {
    return filteredStores.find((store) => matchesFieldStoreFilter(store, 'ready'))
      ?? filteredStores[0]
      ?? stores.find((store) => matchesFieldStoreFilter(store, 'today'))
      ?? stores[0];
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
    <Box style={{ flex: 1 }} background="background">
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

      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 128 }}>
        <Card title="خط الميداني الحالي" subtitle="ابدأ ببطاقة متجر واحدة، ثم الزيارة، ثم الإرسال للمراجعة دون أي لوحة عامة خارج نطاقك.">
          <Box gap={2}>
            <Text role="bodyStrong">
              {priorityStore ? `المتجر التالي: ${priorityStore.name}` : 'لا يوجد متجر جاهز الآن'}
            </Text>
            <Text role="bodySm" tone="muted">
              {priorityStore
                ? `${priorityStore.category} · ${priorityStore.location} · ${priorityStore.nextVisitLabel}`
                : 'أنشئ ملفًا جديدًا أو وسّع البحث لاستئناف الجولة الميدانية.'}
            </Text>
            <Text role="caption" tone="soft">
              {storesBinding
                ? `حالة الربط: ${resolveStoresBindingLabel()} · معاينة محلية لقائمة المتاجر والمفاضلة بينها.`
                : 'حالة الربط: معاينة محلية لقائمة المتاجر.'}
            </Text>
            {priorityStore ? (
              <Button label="فتح المتجر التالي" onPress={() => onOpenStore(priorityStore.id)} />
            ) : (
              <Button label="إنشاء ملف جديد" onPress={onCreateStore} />
            )}
          </Box>
        </Card>

        <Card title="مؤشر الملفات اليوم" subtitle="تلخيص سريع للجولة الحالية وحجم المتابعة داخل ملف المتجر فقط.">
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
            <Badge label={`اليوم ${counts.today}`} tone="brand" />
            <Badge label={`جاهز للإضافة ${counts.ready}`} tone="success" />
            <Badge label={`تحتاج متابعة ${counts['follow-up']}`} tone="warning" />
            <Badge label={`مرسل ${counts.submitted}`} tone="info" />
          </View>
        </Card>

        <Card title="قائمة المتاجر" subtitle="كل بطاقة تمثل ملف انضمام واحد حي يمكن استكماله والعودة له.">
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
              contentContainerStyle={{ flexDirection: 'row', gap: 8, paddingHorizontal: 2 }}
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
                <Card title="لا توجد نتائج مطابقة" subtitle="امسح البحث أو بدّل الشريحة للعودة إلى القائمة الكاملة.">
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                    بقي نمط البحث والشرائح والبطاقات كما هو، لكن لا توجد بطاقة تطابق الشرط الحالي.
                  </Text>
                </Card>
              )}
            </Box>
          </Box>
        </Card>
      </MobileScrollView>
    </Box>
  );
}

export default DshFieldStoresScreen;
