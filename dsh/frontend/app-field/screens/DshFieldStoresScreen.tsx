import React from 'react';
import { ScrollView, View } from 'react-native';
import { Badge, Box, Button, Divider, colorPalette, Icon, MobileScrollView, ModernPremiumHeader, ScreenHeader, SearchField, StateView, Text, TopBar, useTheme,
  spacing,
  Surface,
  radius,
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
} from '../../shared/stores/partner-onboarding-listing.model';

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
  const [showSearch, setShowSearch] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState<FieldLeadFilter>('today');

  const handleToggleSearch = React.useCallback(() => {
    setShowSearch((prev) => {
      const next = !prev;
      if (!next) {
        setSearchQuery('');
      }
      return next;
    });
  }, []);

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
        onSearchPress={handleToggleSearch}
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
          {/* Section 1: خط الميداني الحالي (بطاقة ذكية وديناميكية) */}
          {priorityStore ? (
            <Surface tone="raised" padding={4} gap={3} style={{ borderRadius: radius.md2 }}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box gap={1} style={{ flex: 1, alignItems: 'flex-end' }}>
                  <Text role="caption" tone="brand" style={{ textAlign: 'right' }}>المتجر التالي في جولتك</Text>
                  <Text role="titleSm" style={{ textAlign: 'right' }}>{priorityStore.name}</Text>
                  <Text role="bodySm" tone="muted" style={{ textAlign: 'right' }}>
                    {priorityStore.category} · {priorityStore.location}
                  </Text>
                </Box>
                <Button
                  label="البدء الآن"
                  size="sm"
                  fullWidth={false}
                  onPress={() => onOpenStore(priorityStore.id)}
                />
              </View>
            </Surface>
          ) : (
            <Box paddingY={2} gap={1} style={{ alignItems: 'flex-end' }}>
              <Text role="bodyStrong" tone="muted" style={{ textAlign: 'right' }}>جولتك الميدانية مكتملة</Text>
              <Text role="bodySm" tone="soft" style={{ textAlign: 'right' }}>
                لا توجد متاجر مجدولة حالياً. استخدم البحث أو زر الإضافة بالأسفل لإنشاء ملف جديد.
              </Text>
            </Box>
          )}

          <Divider />

          {/* Section 2: قائمة المتاجر */}
          <Box gap={3} paddingY={2}>
            <Box gap={3}>
              {showSearch && (
                <SearchField
                  label="ابحث في المتاجر"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  hint="الاسم، التصنيف، الموقع، أو الحالة"
                />
              )}

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
