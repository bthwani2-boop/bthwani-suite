import React from 'react';
import { getCanonicalPreviewProductCard, type DshCanonicalProductCard } from '../../../shared/catalog/dshStoreProductCardModel';
import {
  Box,
  Button,
  Chip,
  KeyValueList,
  ListItem,
  MobileStickyPrimaryAction,
  SearchField,
  StateView,
  Surface,
  Text,
  TextField,
  resolveRowDirection,
  useDirection,
  useTheme,
} from '@bthwani/ui-kit';

type InventoryProduct = {
  id: string;
  name: string;
  sku: string;
  gtin: string;
  barcode: string;
  manufacturerCode: string;
  categoryLabel: string;
  catalogLinked: boolean;
  reviewNeeded: boolean;
  available: boolean;
  lowStock: boolean;
  stockCount: number;
  priceLabel: string;
  sourceRecordId?: string;
  canonicalStoreId?: string;
  canonicalProductId?: string;
  publishStage?: string;
  source?: string;
};

export type InventoryCatalogWorkspaceContentProps = {
  storeName: string;
  branchLabel: string;
  activeZoneLabel: string;
  todayHoursLabel: string;
};

type MetricTileProps = {
  label: string;
  value: string;
  tone?: 'default' | 'brand' | 'success' | 'warning' | 'danger' | 'info';
};

type CatalogProductRowProps = {
  product: InventoryProduct;
  selected: boolean;
  onEdit: () => void;
};

function mapCanonicalPreviewProductToInventoryProduct(product: DshCanonicalProductCard): InventoryProduct {
  return {
    id: product.id,
    name: product.name,
    sku: product.sku ?? `CANONICAL-${product.sourceRecordId.toUpperCase()}`,
    gtin: product.gtin ?? product.id,
    barcode: product.barcode ?? product.gtin ?? product.id,
    manufacturerCode: product.manufacturerCode ?? `FIELD-${product.sourceRecordId.toUpperCase()}`,
    categoryLabel: product.categoryLabel,
    catalogLinked: true,
    reviewNeeded: product.publishStage !== 'published-preview',
    available: product.isAvailable,
    lowStock: typeof product.stockCount === 'number' ? product.stockCount <= 3 : false,
    stockCount: product.stockCount ?? 0,
    priceLabel: product.priceLabel,
    sourceRecordId: product.sourceRecordId,
    canonicalStoreId: product.canonicalStoreId,
    canonicalProductId: product.canonicalProductId,
    publishStage: product.publishStage,
    source: product.source,
  };
}

const canonicalPreviewInventoryProducts: readonly InventoryProduct[] = (() => {
  const canonicalProduct = getCanonicalPreviewProductCard('canonical-product-field-lead-5-featured');
  return canonicalProduct ? [mapCanonicalPreviewProductToInventoryProduct(canonicalProduct)] : [];
})();

const initialProducts: readonly InventoryProduct[] = [
  {
    id: 'prod-1',
    name: 'برغر كلاسيك',
    sku: 'BL-BRG-001',
    gtin: '6280001000018',
    barcode: '6280001000018',
    manufacturerCode: 'MFR-CL-01',
    categoryLabel: 'برغر',
    catalogLinked: true,
    reviewNeeded: false,
    available: true,
    lowStock: false,
    stockCount: 42,
    priceLabel: '18.00 ر.س',
  },
  {
    id: 'prod-2',
    name: 'باول دجاج',
    sku: 'BL-BWL-014',
    gtin: '6280001000148',
    barcode: '6280001000148',
    manufacturerCode: 'MFR-CH-14',
    categoryLabel: 'وجبة',
    catalogLinked: true,
    reviewNeeded: false,
    available: true,
    lowStock: true,
    stockCount: 3,
    priceLabel: '24.50 ر.س',
  },
  {
    id: 'prod-3',
    name: 'بطاطس حارة',
    sku: 'BL-SID-022',
    gtin: '6280001000223',
    barcode: '6280001000223',
    manufacturerCode: 'MFR-SD-22',
    categoryLabel: 'إضافات',
    catalogLinked: false,
    reviewNeeded: true,
    available: true,
    lowStock: false,
    stockCount: 18,
    priceLabel: '8.00 ر.س',
  },
  {
    id: 'prod-4',
    name: 'عصير ليمون',
    sku: 'BL-DRK-090',
    gtin: '6280001000902',
    barcode: '6280001000902',
    manufacturerCode: 'MFR-DR-90',
    categoryLabel: 'مشروبات',
    catalogLinked: true,
    reviewNeeded: false,
    available: true,
    lowStock: true,
    stockCount: 2,
    priceLabel: '9.50 ر.س',
  },
  {
    id: 'prod-5',
    name: 'صوص خاص',
    sku: 'BL-SAU-003',
    gtin: '6280001000308',
    barcode: '6280001000308',
    manufacturerCode: 'MFR-SA-03',
    categoryLabel: 'إضافات',
    catalogLinked: true,
    reviewNeeded: true,
    available: true,
    lowStock: false,
    stockCount: 9,
    priceLabel: '2.50 ر.س',
  },
  {
    id: 'prod-6',
    name: 'سلطة سيزر',
    sku: 'BL-SLD-044',
    gtin: '6280001000445',
    barcode: '6280001000445',
    manufacturerCode: 'MFR-SL-44',
    categoryLabel: 'سلطات',
    catalogLinked: false,
    reviewNeeded: true,
    available: false,
    lowStock: false,
    stockCount: 0,
    priceLabel: '14.75 ر.س',
  },
  ...canonicalPreviewInventoryProducts,
];

function MetricTile({ label, value, tone = 'default' }: MetricTileProps) {
  const { theme } = useTheme();
  const borderColor = {
    default: theme.lineStrong,
    brand: theme.brand,
    success: theme.success,
    warning: theme.warning,
    danger: theme.danger,
    info: theme.info,
  }[tone];

  return (
    <Surface tone="default" padding={3} gap={1} style={{ flex: 1, minWidth: 118, borderWidth: 1, borderColor }}>
      <Text role="caption" tone="muted" numberOfLines={1}>
        {label}
      </Text>
      <Text role="bodyStrong" tone={tone} numberOfLines={2}>
        {value}
      </Text>
    </Surface>
  );
}

function CatalogProductRow({ product, selected, onEdit }: CatalogProductRowProps) {
  const { direction } = useDirection();
  const { theme } = useTheme();
  const linkedTone = product.catalogLinked ? 'success' : product.reviewNeeded ? 'warning' : 'brand';
  const stockTone = product.lowStock ? 'warning' : product.available ? 'success' : 'danger';

  return (
    <Surface
      tone="default"
      padding={3}
      gap={2}
      style={{
        borderWidth: 1,
        borderColor: selected ? theme.brand : theme.line,
      }}
    >
      <Box style={{ flexDirection: resolveRowDirection(direction), alignItems: 'center', gap: 12 }}>
        <Surface tone="inset" padding={2} gap={0} style={{ width: 42, height: 42, alignItems: 'center', justifyContent: 'center' }}>
          <Text role="bodyStrong">{product.name.slice(0, 1)}</Text>
        </Surface>

        <Box style={{ flex: 1, minWidth: 0, gap: 2, alignItems: direction === 'rtl' ? 'flex-end' : 'flex-start' }}>
          <Text role="bodyStrong" align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={1}>
            {product.name}
          </Text>
          <Text role="bodySm" tone="muted" align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={2}>
            SKU: {product.sku} · GTIN: {product.gtin} · الباركود: {product.barcode}
          </Text>
          <Text role="caption" tone="muted" align={direction === 'rtl' ? 'end' : 'start'} numberOfLines={1}>
            {product.manufacturerCode} · {product.categoryLabel}
          </Text>
        </Box>

        <Button label="تعديل" size="sm" tone="secondary" fullWidth={false} onPress={onEdit} />
      </Box>

      <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
        <Chip label={product.catalogLinked ? 'مرتبط بالكتالوج' : 'يحتاج مطابقة'} tone={linkedTone} selected />
        <Chip label={`السعر ${product.priceLabel}`} tone="brand" />
        <Chip label={`المخزون ${product.stockCount}`} tone={stockTone} />
        <Chip label={product.available ? 'متاح للبيع' : 'موقوف'} tone={product.available ? 'success' : 'danger'} />
        {product.lowStock ? <Chip label="منخفض المخزون" tone="warning" /> : null}
      </Box>
    </Surface>
  );
}

export function InventoryCatalogWorkspaceContent({ storeName, branchLabel, activeZoneLabel, todayHoursLabel }: InventoryCatalogWorkspaceContentProps) {
  const { direction } = useDirection();
  const [query, setQuery] = React.useState('');
  const [products, setProducts] = React.useState<InventoryProduct[]>(() => initialProducts.map((product) => ({ ...product })));
  const [toolMessage, setToolMessage] = React.useState('ابدأ بالبحث أولًا ثم اربط المنتج المعياري من الكتالوج المركزي.');
  const [selectedProductId, setSelectedProductId] = React.useState(products[0]?.id ?? null);
  const [draftPrice, setDraftPrice] = React.useState(products[0]?.priceLabel.replace(/[^0-9.]/g, '').trim() ?? '');
  const [draftStock, setDraftStock] = React.useState(String(products[0]?.stockCount ?? 0));
  const [draftAvailable, setDraftAvailable] = React.useState(Boolean(products[0]?.available ?? true));
  const [lastSavedLabel, setLastSavedLabel] = React.useState<string | null>(null);
  const [activeBulkTool, setActiveBulkTool] = React.useState<string | null>(null);

  const filteredProducts = React.useMemo(
    () =>
      products.filter((product) => {
        const normalizedQuery = query.trim().toLowerCase();
        if (!normalizedQuery) return true;

        return [product.name, product.sku, product.gtin, product.barcode, product.manufacturerCode, product.categoryLabel]
          .join(' ')
          .toLowerCase()
          .includes(normalizedQuery);
      }),
    [products, query],
  );

  const selectedProduct = React.useMemo(
    () => products.find((product) => product.id === selectedProductId) ?? products[0] ?? null,
    [products, selectedProductId],
  );

  React.useEffect(() => {
    if (!selectedProduct) return;

    setSelectedProductId(selectedProduct.id);
    setDraftPrice(selectedProduct.priceLabel.replace(/[^0-9.]/g, '').trim());
    setDraftStock(String(selectedProduct.stockCount));
    setDraftAvailable(selectedProduct.available);
  }, [selectedProduct]);

  const totalProducts = products.length;
  const lowStockCount = products.filter((product) => product.lowStock).length;
  const reviewCount = products.filter((product) => product.reviewNeeded).length;
  const linkedCount = products.filter((product) => product.catalogLinked).length;
  const publishLabel = reviewCount > 0 || lowStockCount > 0 ? 'مراجعة ونشر التغييرات' : 'حفظ تحديثات المخزون';

  const onSave = React.useCallback(() => {
    setLastSavedLabel(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
  }, []);

  const applyDraft = React.useCallback(() => {
    if (!selectedProduct) return;

    const parsedStock = Number(draftStock.replace(/[^0-9]/g, ''));
    const cleanedPrice = draftPrice.replace(/[^0-9.]/g, '').trim();
    const resolvedPrice = cleanedPrice.length > 0 ? `${Number(cleanedPrice).toFixed(2)} ر.س` : selectedProduct.priceLabel;
    const normalizedStock = Number.isFinite(parsedStock) ? parsedStock : selectedProduct.stockCount;

    setProducts((current) =>
      current.map((product) =>
        product.id === selectedProduct.id
          ? {
              ...product,
              priceLabel: resolvedPrice,
              stockCount: normalizedStock,
              available: draftAvailable,
              lowStock: normalizedStock <= 3,
              reviewNeeded: normalizedStock <= 3 || !draftAvailable || !product.catalogLinked,
            }
          : product,
      ),
    );
    setLastSavedLabel(new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' }));
    setToolMessage(`تم تحديث ${selectedProduct.name} محليًا.`);
  }, [draftAvailable, draftPrice, draftStock, selectedProduct]);

  if (!selectedProduct) {
    return <StateView stateId="empty" title="لا توجد منتجات" description="أضف منتجًا جديدًا أو أعد البحث في الكتالوج المركزي." />;
  }

  return (
    <Box gap={4}>
      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          الحالة المختصرة
        </Text>
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
          <MetricTile label="منتجات المتجر" value={String(totalProducts)} tone="brand" />
          <MetricTile label="منخفضة المخزون" value={String(lowStockCount)} tone={lowStockCount > 0 ? 'warning' : 'success'} />
          <MetricTile label="تحتاج مراجعة" value={String(reviewCount)} tone={reviewCount > 0 ? 'warning' : 'success'} />
          <MetricTile label="مرتبطة بالكتالوج المركزي" value={`${linkedCount}/${totalProducts}`} tone="success" />
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          بحث أولًا
        </Text>
        <SearchField
          label="بحث في الكتالوج المركزي"
          value={query}
          onChangeText={setQuery}
          placeholder="ابحث باسم المنتج / الباركود / SKU / GTIN"
          hint="ابدأ بالكتالوج المركزي ثم طابق السعر والتوفر والمخزون محليًا."
        />
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
          <Button
            label="مسح باركود"
            tone="secondary"
            fullWidth={false}
            onPress={() => {
              setQuery('6280001000018');
              setToolMessage('وضع المسح جاهز محليًا: وجّه الماسح نحو الباركود أو GTIN.');
            }}
          />
          <Button
            label="إدخال جماعي"
            tone="secondary"
            fullWidth={false}
            onPress={() => {
              setActiveBulkTool('Excel / CSV');
              setToolMessage('تم فتح مسار الإدخال الجماعي المحلي.');
            }}
          />
          <Button
            label="منتج جديد"
            tone="secondary"
            fullWidth={false}
            onPress={() => {
              setSelectedProductId(products[0]?.id ?? null);
              setToolMessage('ابدأ من المنتج القياسي في الكتالوج المركزي قبل إنشاء مسودة جديدة.');
            }}
          />
        </Box>
      </Surface>

      <Surface tone="inset" padding={3} gap={2}>
        <Text role="bodySm" tone="muted">
          {toolMessage}
        </Text>
        {activeBulkTool ? (
          <Text role="caption" tone="muted">
            وضع الإرسال الحالي: {activeBulkTool}
          </Text>
        ) : null}
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          مسار الإدخال الذكي
        </Text>
        <ListItem title="1. ابحث عن المنتج القياسي" subtitle="ابدأ بـ SKU أو GTIN أو barcode أو الاسم قبل أي إضافة جديدة." badgeLabel="1" meta="Lookup first" />
        <ListItem title="2. اختر المنتج من الكتالوج المركزي" subtitle="طابق القالب المعياري قبل تنفيذ أي تعديل محلي." badgeLabel="2" meta="Central catalog" />
        <ListItem title="3. عدّل السعر والتوفر والمخزون" subtitle="الشريك يضبط السعر أو التوفر أو الكمية فقط، لا يكرر اسم المنتج أو صورته." badgeLabel="3" meta="Local edit" />
        <ListItem title="4. راجع ثم انشر" subtitle="راجع المخرجات قبل حفظ الدفعة أو نشرها على المتجر." badgeLabel="4" meta="Publish" />
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          المنتجات الحالية
        </Text>
        <Box gap={3}>
          {filteredProducts.length ? (
            filteredProducts.map((product) => (
              <CatalogProductRow
                key={product.id}
                product={product}
                selected={selectedProductId === product.id}
                onEdit={() => {
                  setSelectedProductId(product.id);
                  setToolMessage(`فتح تعديل محلي لـ ${product.name}.`);
                }}
              />
            ))
          ) : (
            <StateView
              stateId="empty"
              title="لا توجد نتائج مطابقة"
              description="جرّب اسم المنتج أو SKU أو GTIN أو barcode مختلفًا."
              actionLabel="إعادة ضبط البحث"
              onActionPress={() => setQuery('')}
            />
          )}
        </Box>
      </Surface>

      <Surface tone="default" padding={3} gap={3}>
        <Text role="label" tone="muted">
          تعديل محلي سريع
        </Text>
        <KeyValueList
          dense
          items={[
            { label: 'المنتج', value: selectedProduct.name },
            { label: 'SKU', value: selectedProduct.sku },
            { label: 'GTIN', value: selectedProduct.gtin },
            { label: 'الباركود', value: selectedProduct.barcode },
            ...(selectedProduct.sourceRecordId ? [{ label: 'مرجع المصدر', value: selectedProduct.sourceRecordId }] : []),
            ...(selectedProduct.canonicalStoreId ? [{ label: 'مرجع المتجر الكانوني', value: selectedProduct.canonicalStoreId }] : []),
            ...(selectedProduct.canonicalProductId ? [{ label: 'مرجع المنتج الكانوني', value: selectedProduct.canonicalProductId }] : []),
            ...(selectedProduct.publishStage ? [{ label: 'مرحلة النشر', value: selectedProduct.publishStage }] : []),
            ...(selectedProduct.source ? [{ label: 'المصدر', value: selectedProduct.source }] : []),
            { label: 'الربط المركزي', value: selectedProduct.catalogLinked ? 'مرتبط' : 'يحتاج مطابقة', tone: selectedProduct.catalogLinked ? 'success' : 'warning' },
          ]}
        />
        <Box gap={3}>
          <TextField label="السعر" value={draftPrice} onChangeText={setDraftPrice} placeholder="18.00" />
          <TextField label="المخزون" value={draftStock} onChangeText={setDraftStock} placeholder="42" keyboardType="numeric" />
          <Button
            label={draftAvailable ? 'التوفر: مفعّل' : 'التوفر: موقوف'}
            tone={draftAvailable ? 'success' : 'danger'}
            fullWidth={false}
            onPress={() => setDraftAvailable((current) => !current)}
          />
          <Button label="تطبيق محلي" tone="secondary" fullWidth={false} onPress={applyDraft} />
        </Box>
      </Surface>

      <Surface tone="raised" padding={3} gap={3}>
        <Text role="label" tone="muted">
          الإجراءات الجماعية
        </Text>
        <Box style={{ flexDirection: resolveRowDirection(direction), flexWrap: 'wrap' }} gap={2}>
          <Button
            label="تحديث أسعار جماعي"
            tone="secondary"
            fullWidth={false}
            onPress={() => setToolMessage('تم فتح مسار تحديث الأسعار الجماعي محليًا.')}
          />
          <Button
            label="استيراد Excel/CSV"
            tone="secondary"
            fullWidth={false}
            onPress={() => setToolMessage('تم فتح مسار الاستيراد Excel / CSV محليًا.')}
          />
          <Button
            label="مراجعة المنتجات غير المطابقة"
            tone="secondary"
            fullWidth={false}
            onPress={() => setToolMessage('تم فتح قائمة المنتجات غير المطابقة محليًا.')}
          />
          <Button
            label="إصلاح التكرارات"
            tone="secondary"
            fullWidth={false}
            onPress={() => setToolMessage('تم فتح مسار إصلاح التكرارات محليًا.')}
          />
        </Box>
        {activeBulkTool ? (
          <KeyValueList
            dense
            items={[
              { label: 'نوع العملية', value: activeBulkTool },
              { label: 'الفرع', value: branchLabel },
              { label: 'ساعات اليوم', value: todayHoursLabel },
            ]}
          />
        ) : null}
      </Surface>

      <MobileStickyPrimaryAction
        label={publishLabel}
        helperText={lastSavedLabel ? `آخر حفظ: ${lastSavedLabel}` : 'الكتالوج المركزي هو المرجع الأول قبل النشر المحلي.'}
        onPress={onSave}
      />
    </Box>
  );
}

export default InventoryCatalogWorkspaceContent;

