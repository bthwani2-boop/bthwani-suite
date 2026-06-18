// dsh/frontend/app-field/screens/DshFieldStoreProductsUploadScreen.tsx
// Dedicated smart product builder screen for field onboarding.
// No Tamagui. No custom component extensions.

import React from 'react';
import { Pressable, View } from 'react-native';
import {
  Box,
  Button,
  Divider,
  Icon,
  MobileScrollView,
  SectionHeader,
  SelectField,
  Text,
  TextField,
  TopBar,
  useTheme,
  radius,
  spacing,
  borders,
} from '@bthwani/ui-kit';
import type { FieldStoreFile, OnboardingProductItem } from '../dsh-field.routes';
import {
  validateOnboardingProduct,
  normalizeDigits,
  PARTNER_STORE_TYPE_OPTIONS,
  PARTNER_MAIN_CATEGORY_OPTIONS,
  PARTNER_SUB_CATEGORY_OPTIONS,
  getOptionsWithFallback,
} from '../../shared';

type DshFieldStoreProductsUploadScreenProps = {
  store: FieldStoreFile;
  onBack: () => void;
  onStoreChange: (updater: (store: FieldStoreFile) => FieldStoreFile) => void;
  onSaveDraft: () => void;
};

export function DshFieldStoreProductsUploadScreen({
  store,
  onBack,
  onStoreChange,
  onSaveDraft,
}: DshFieldStoreProductsUploadScreenProps) {
  const { theme } = useTheme();

  // Local state for the product being added
  const [newProductName, setNewProductName] = React.useState('');
  const [newProductPrice, setNewProductPrice] = React.useState('');
  const [errorName, setErrorName] = React.useState<string | undefined>(undefined);
  const [errorPrice, setErrorPrice] = React.useState<string | undefined>(undefined);

  const draft = store.draft;
  const items = draft.products.items || [];

  const changeClassificationField = (fieldKey: 'storeType' | 'mainCategory' | 'subCategory', value: string) => {
    onStoreChange((current) => ({
      ...current,
      draft: {
        ...current.draft,
        classification: {
          ...current.draft.classification,
          [fieldKey]: value,
        },
      },
    }));
  };

  const handleAddProduct = () => {
    // Validate name
    if (!newProductName.trim()) {
      setErrorName('اسم المنتج مطلوب لإضافته للقائمة');
      return;
    } else {
      setErrorName(undefined);
    }

    // Validate price
    const normalizedPrice = normalizeDigits(newProductPrice.trim());
    if (!normalizedPrice) {
      setErrorPrice('سعر المنتج مطلوب');
      return;
    }
    const numericPrice = parseFloat(normalizedPrice);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setErrorPrice('سعر المنتج يجب أن يكون قيمة موجبة صالحة');
      return;
    } else {
      setErrorPrice(undefined);
    }

    // Generate unique ID
    const newProduct: OnboardingProductItem = {
      id: `prod-${items.length}-${normalizedPrice}`,
      name: newProductName.trim(),
      price: normalizedPrice,
    };

    onStoreChange((current) => ({
      ...current,
      draft: {
        ...current.draft,
        products: {
          ...current.draft.products,
          items: [...(current.draft.products.items || []), newProduct],
        },
      },
    }));

    // Reset local inputs
    setNewProductName('');
    setNewProductPrice('');
    setErrorName(undefined);
    setErrorPrice(undefined);
  };

  const handleRemoveProduct = (productId: string) => {
    onStoreChange((current) => ({
      ...current,
      draft: {
        ...current.draft,
        products: {
          ...current.draft.products,
          items: (current.draft.products.items || []).filter((item) => item.id !== productId),
        },
      },
    }));
  };

  const handleSaveAndExit = () => {
    onSaveDraft();
    onBack();
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.surface }}>
      <TopBar
        variant="surface"
        title="المنتجات والتصنيف"
        trailingAction={{
          id: 'back',
          icon: <Icon name="arrow-back" size={24} tone="brand" />,
          mirrorInRtl: true,
          accessibilityLabel: 'رجوع',
          onPress: onBack,
        }}
      />

      <MobileScrollView fill padding={0} gap={0}>
        <Box padding={4} gap={4}>
          {/* Header Brief */}
          <Box gap={1} style={{ alignItems: 'flex-end', paddingHorizontal: spacing[3] }}>
            <Text role="titleSm" weight="black" style={{ textAlign: 'right' }}>
              تصنيف المتجر ومنتجاته: {draft.basics.storeName || store.name}
            </Text>
            <Text role="caption" tone="muted" style={{ textAlign: 'right', marginTop: spacing[1] }}>
              قم بتحديد تصنيف المتجر وإدخال قائمة المنتجات التأسيسية.
            </Text>
          </Box>

          <Divider />

          {/* Section 1: Classification */}
          <Box gap={3} style={{ backgroundColor: theme.surfaceSecondary, padding: spacing[3], borderRadius: radius.md }}>
            <SectionHeader title="النوع والتصنيف التشغيلي" />

            <SelectField
              label="نوع المتجر"
              value={draft.classification.storeType}
              options={getOptionsWithFallback(PARTNER_STORE_TYPE_OPTIONS, draft.classification.storeType)}
              placeholder="اختر نوع المنفذ الميداني"
              onValueChange={(value) => changeClassificationField('storeType', value)}
            />

            <SelectField
              label="التصنيف الرئيسي"
              value={draft.classification.mainCategory}
              options={getOptionsWithFallback(PARTNER_MAIN_CATEGORY_OPTIONS, draft.classification.mainCategory)}
              placeholder="اختر الفئة الرئيسية في بثواني"
              onValueChange={(value) => changeClassificationField('mainCategory', value)}
            />

            <SelectField
              label="التصنيف الفرعي للمتجر"
              value={draft.classification.subCategory}
              options={getOptionsWithFallback(PARTNER_SUB_CATEGORY_OPTIONS, draft.classification.subCategory)}
              placeholder="اختر التصنيف الأكثر دقة للفرع"
              onValueChange={(value) => changeClassificationField('subCategory', value)}
            />
          </Box>

          <Divider />

          {/* Form Zone: Add new product */}
          <Box gap={3} style={{ backgroundColor: theme.surfaceSecondary, padding: spacing[3], borderRadius: radius.md }}>
            <SectionHeader title="إضافة منتج جديد" />

            <TextField
              label="اسم المنتج"
              value={newProductName}
              onChangeText={(val) => {
                setNewProductName(val);
                if (val.trim()) setErrorName(undefined);
              }}
              error={errorName}
              placeholder="مثال: برجر دجاج كلاسيك، حليب طازج"
            />

            <TextField
              label="سعر المنتج"
              value={newProductPrice}
              onChangeText={(val) => {
                setNewProductPrice(val);
                if (val.trim()) setErrorPrice(undefined);
              }}
              error={errorPrice}
              keyboardType="decimal-pad"
              placeholder="السعر شامل الضريبة"
              hint="سيتم تحويل الأرقام العربية إلى صيغتها الرياضية تلقائياً"
            />

            <Button
              label="إضافة المنتج للقائمة"
              tone="brand"
              onPress={handleAddProduct}
              style={{ marginTop: spacing[2] }}
            />
          </Box>

          {/* Current Products List */}
          <Box gap={3}>
            <SectionHeader
              title={`المنتجات المضافة (${items.length})`}
              subtitle="يجب إضافة منتج واحد على الأقل ليكون المتجر جاهزاً للعمل."
            />

            {items.length === 0 ? (
              <Box
                paddingY={4}
                gap={2}
                style={{
                  borderWidth: 1.5,
                  borderStyle: 'dashed',
                  borderColor: theme.line,
                  borderRadius: radius.md,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon name="basket-outline" size={32} tone="muted" />
                <Text role="bodyStrong" tone="muted" style={{ textAlign: 'center' }}>
                  لا توجد منتجات مضافة بعد
                </Text>
                <Text role="caption" tone="muted" style={{ textAlign: 'center', paddingHorizontal: spacing[4] }}>
                  استخدم الاستمارة في الأعلى لإدخال أولى المنتجات للكتالوج.
                </Text>
              </Box>
            ) : (
              <Box gap={2}>
                {items.map((item) => (
                  <View
                    key={item.id}
                    style={{
                      flexDirection: 'row-reverse',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: spacing[3],
                      borderWidth: borders.hairline,
                      borderColor: theme.line,
                      borderRadius: radius.sm,
                      backgroundColor: theme.surface,
                    }}
                  >
                    {/* Right side: Product Name + Price */}
                    <Box gap={1} style={{ alignItems: 'flex-end', flex: 1, paddingEnd: spacing[3] }}>
                      <Text role="bodyStrong" style={{ textAlign: 'right', color: theme.text }}>
                        {item.name}
                      </Text>
                      <Text role="bodySm" tone="success" style={{ textAlign: 'right' }}>
                        {item.price} ر.ي
                      </Text>
                    </Box>

                    {/* Left side: Delete Button */}
                    <Pressable
                      onPress={() => handleRemoveProduct(item.id)}
                      style={({ pressed }) => ({
                        width: 36,
                        height: 36,
                        borderRadius: radius.xs,
                        backgroundColor: theme.surfaceSecondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: theme.line,
                        opacity: pressed ? 0.8 : 1,
                      })}
                    >
                      <Icon name="trash-outline" size={18} tone="danger" />
                    </Pressable>
                  </View>
                ))}
              </Box>
            )}
          </Box>
        </Box>
      </MobileScrollView>

      {/* Bottom Bar */}
      <Box
        padding={3}
        style={{
          borderTopWidth: 1,
          borderTopColor: theme.line,
          backgroundColor: theme.surface,
        }}
      >
        <Button
          label="حفظ وإغلاق"
          tone={items.length > 0 ? 'success' : 'secondary'}
          onPress={handleSaveAndExit}
          style={{ width: '100%' }}
        />
      </Box>
    </View>
  );
}

export default DshFieldStoreProductsUploadScreen;
