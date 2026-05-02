import React from 'react';
import { ScrollView, View } from 'react-native';
import { Badge, Box, Button, Card, Icon, MobileScrollView, ScreenHeader, SearchField, Text, TopBar } from '@bthwani/ui-kit';
import { FieldStoreCard } from './FieldStoreCard';
import { fieldFilterOptions, matchesFieldStoreFilter, resolveFieldFilterCounts, type FieldLeadFilter, type FieldStoreFile } from './dshFieldStoresModel';

type DshFieldStoresScreenProps = {
  stores: readonly FieldStoreFile[];
  onOpenStore: (storeId: string) => void;
  onOpenAccount: () => void;
  onCreateStore: () => void;
};

export function DshFieldStoresScreen({ stores, onOpenStore, onOpenAccount, onCreateStore }: DshFieldStoresScreenProps) {
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

  return (
    <Box style={{ flex: 1 }} background="background">
      <TopBar
        variant="brand"
        title="بثواني"
        subtitle="تشغيل الميدان · Field Partner Onboarding"
        locationLabel="الرياض · قائمة المتاجر"
        actions={[
          {
            id: 'account',
            icon: <Icon name="person-outline" size={21} color="#FFFFFF" />,
            accessibilityLabel: 'الحساب',
            onPress: onOpenAccount,
          },
          {
            id: 'notifications',
            icon: <Icon name="notifications-outline" size={21} color="#FFFFFF" />,
            badgeCount: counts.pending,
            accessibilityLabel: 'التنبيهات',
          },
        ]}
      />

      <MobileScrollView fill padding={4} gap={4} contentContainerStyle={{ paddingBottom: 128 }}>
        <Card title="تشغيل الميدان اليوم" subtitle="قائمة سريعة للمتاجر والإجراء التالي.">
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
