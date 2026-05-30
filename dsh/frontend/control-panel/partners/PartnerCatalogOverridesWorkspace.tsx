'use client';

import React from 'react';
import { Box, Text, useTheme, Surface, TextField, KeyValueList } from '@bthwani/ui-kit';
import {
  WebControlPanelDecisionRow,
  WebControlPanelInspectorShell,
  WebControlPanelActionCluster,
  WebControlPanelRecommendation,
  WebControlPanelKpiStrip,
} from '@bthwani/ui-kit/web';
import {
  buildCentralPartnerInventoryItems,
  CENTRAL_PRODUCT_DETAIL_LOOKUP,
  deriveProductSku,
  deriveProductGtin,
  type CatalogPartnerInventoryItem,
} from '../../shared/catalog-central-adapter';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  getPartnerCatalogOverrides,
  upsertPartnerCatalogOverride,
  deletePartnerCatalogOverride,
  type DshPartnerCatalogOverride,
} from './workflow';

export function PartnerCatalogOverridesWorkspace() {
  const { theme } = useTheme();
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [overrides, setOverrides] = React.useState<Record<string, DshPartnerCatalogOverride[]>>({});
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState('اختر منتجاً لتعديل تجاوزات الشريك المحلية.');

  // Form states for selected product override
  const [formPrice, setFormPrice] = React.useState('');
  const [formStock, setFormStock] = React.useState('0');
  const [formAvailable, setFormAvailable] = React.useState(true);
  const [formPrepNote, setFormPrepNote] = React.useState('');

  const currentPartner = PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === selectedPartnerId) || PARTNER_FULFILLMENT_AGREEMENTS[0];

  // Load all partner overrides from central SSoT on mount
  React.useEffect(() => {
    const initialOverrides: Record<string, DshPartnerCatalogOverride[]> = {};
    for (const partner of PARTNER_FULFILLMENT_AGREEMENTS) {
      initialOverrides[partner.partnerId] = getPartnerCatalogOverrides(partner.partnerId);
    }
    setOverrides(initialOverrides);
  }, []);

  // Fetch all central products
  const centralItems = React.useMemo(() => buildCentralPartnerInventoryItems(), []);

  // Filter products relevant to partner category domain (e.g. cafe, buffet, dates/grocery)
  const partnerItems = React.useMemo(() => {
    // For Saha (cafe/sweets): show choco, apple, croissant, milk, yogurt
    // For Shorouq (buffet/restaurant): show chicken, salad, burger
    // For Zawya (bakery): show bread, croissant, roll
    // For Nokhba (grocery/dates): show dates-box, honey, apple, milk
    if (selectedPartnerId === 'partner-saha') {
      return centralItems.filter(i => ['item-choco-2', 'item-apple-1', 'item-milk-1', 'item-yogurt-1'].includes(i.id));
    }
    if (selectedPartnerId === 'partner-shorouq') {
      return centralItems.filter(i => ['item-chicken-2', 'item-salad-2', 'prd-restaurant-burger'].includes(i.id));
    }
    if (selectedPartnerId === 'partner-zawya') {
      return centralItems.filter(i => ['item-bread-1', 'item-croissant-2', 'item-roll-1'].includes(i.id));
    }
    // Nokhba or default
    return centralItems.filter(i => ['canonical-product-field-lead-5-featured', 'item-apple-1', 'item-milk-1'].includes(i.id));
  }, [selectedPartnerId, centralItems]);

  const currentPartnerOverrides = overrides[selectedPartnerId] ?? [];

  const handlePartnerChange = (partnerId: string) => {
    setSelectedPartnerId(partnerId);
    setSelectedProductId(null);
    setActionMessage(`تغيير الشريك إلى: ${PARTNER_FULFILLMENT_AGREEMENTS.find(p => p.partnerId === partnerId)?.storeName}`);
  };

  const handleProductSelect = (productId: string) => {
    setSelectedProductId(productId);
    const existingOverride = currentPartnerOverrides.find(o => o.productId === productId);
    const centralItem = centralItems.find(i => i.id === productId);

    setFormPrice(existingOverride?.priceOverride ?? centralItem?.priceLabel ?? '0.00 ر.س');
    setFormStock(String(existingOverride?.stockOverride ?? centralItem?.stockCount ?? 20));
    setFormAvailable(existingOverride?.availableOverride ?? centralItem?.available ?? true);
    setFormPrepNote(existingOverride?.prepNoteOverride ?? '');
    setActionMessage(`تعديل تجاوزات المنتج: ${centralItem?.name}`);
  };

  const handleSaveOverride = () => {
    if (!selectedProductId) return;

    const newOverride: DshPartnerCatalogOverride = {
      productId: selectedProductId,
      priceOverride: formPrice,
      stockOverride: parseInt(formStock, 10) || 0,
      availableOverride: formAvailable,
      prepNoteOverride: formPrepNote.trim() || undefined,
      owner: 'cp_manager',
      state: 'active',
      lastUpdated: 'الآن',
    };

    upsertPartnerCatalogOverride(selectedPartnerId, newOverride);

    const otherOverrides = currentPartnerOverrides.filter(o => o.productId !== selectedProductId);
    const updatedOverrides = { ...overrides, [selectedPartnerId]: [...otherOverrides, newOverride] };

    setOverrides(updatedOverrides);
    setActionMessage('تم حفظ التجاوز المحلي للمنتج وتحديث حالة العميل.');
  };

  const handleResetOverride = () => {
    if (!selectedProductId) return;

    deletePartnerCatalogOverride(selectedPartnerId, selectedProductId);

    const updatedOverrides = {
      ...overrides,
      [selectedPartnerId]: currentPartnerOverrides.filter(o => o.productId !== selectedProductId),
    };

    setOverrides(updatedOverrides);
    setSelectedProductId(null);
    setActionMessage('تم إزالة التجاوز واستعادة بيانات الكتالوج المركزي الافتراضية.');
  };

  // Resolve detail for selected product (to avoid duplicate product truth)
  const selectedProductDetail = selectedProductId ? (CENTRAL_PRODUCT_DETAIL_LOOKUP[selectedProductId] ?? {
    id: selectedProductId,
    sku: deriveProductSku(selectedProductId),
    gtin: deriveProductGtin(selectedProductId),
    barcode: deriveProductGtin(selectedProductId) ?? '—',
  }) : null;

  const selectedCentralItem = selectedProductId ? centralItems.find(i => i.id === selectedProductId) : null;

  return (
    <Box gap={4} style={{ direction: 'rtl' }}>
      {/* Partner dropdown selector */}
      <Box gap={2}>
        <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>اختر الشريك لإدارة تجاوزات الكتالوج</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const isSelected = selectedPartnerId === partner.partnerId;
            const overridesCount = (overrides[partner.partnerId] ?? []).length;

            return (
              <button
                key={partner.partnerId}
                type="button"
                onClick={() => handlePartnerChange(partner.partnerId)}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  border: `1px solid ${isSelected ? theme.brand : theme.line}`,
                  background: isSelected ? theme.brandSurface : theme.surface,
                  color: isSelected ? theme.brand : theme.text,
                  fontWeight: 700,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>{partner.storeName}</span>
                {overridesCount > 0 && (
                  <span style={{
                    background: theme.brand,
                    color: theme.surface,
                    borderRadius: '99px',
                    padding: '2px 6px',
                    fontSize: '10px',
                    fontWeight: 900
                  }}>
                    {overridesCount}
                  </span>
                )}
              </button>
            );
          })}
        </Box>
      </Box>

      {/* KPI Strip */}
      <WebControlPanelKpiStrip
        items={[
          { id: 'total-items', label: 'منتجات معروضة للشريك', value: String(partnerItems.length), tone: 'neutral' },
          { id: 'overridden-items', label: 'منتجات معدلة (Overrides)', value: String(currentPartnerOverrides.length), tone: 'warning' },
          { id: 'active-overrides', label: 'تجاوزات نشطة للعملاء', value: String(currentPartnerOverrides.filter(o => o.availableOverride !== false).length), tone: 'success' },
        ]}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '20px', alignItems: 'start' }}>
        {/* Products list with override states */}
        <Surface tone="raised" padding={5} gap={4} style={{ borderRadius: '16px' }}>
          <Box gap={1}>
            <Text role="titleLg" style={{ fontWeight: '900', color: theme.brandHeaderBackground }}>
              تجاوزات منتجات الشريك
            </Text>
            <Text role="caption" tone="muted">
              الشريك لا يكرر الكتالوج المركزي (Identity SSoT). يمكنه فقط تعديل السعر المحلي والتوفر والمخزون وملاحظة التحضير.
            </Text>
          </Box>

          <Box gap={3}>
            {partnerItems.map((item) => {
              const localOverride = currentPartnerOverrides.find(o => o.productId === item.id);
              const hasOverride = !!localOverride;

              const displayPrice = localOverride?.priceOverride ?? item.priceLabel;
              const displayStock = localOverride?.stockOverride !== undefined ? localOverride.stockOverride : item.stockCount;
              const displayAvailable = localOverride?.availableOverride !== undefined ? localOverride.availableOverride : item.available;

              return (
                <WebControlPanelDecisionRow
                  key={item.id}
                  entityId={item.id}
                  entityLabel={item.name}
                  status={displayAvailable ? 'متاح ومباشر' : 'غير متوفر'}
                  statusTone={displayAvailable ? 'success' : 'danger'}
                  risk={hasOverride ? 'warning' : 'neutral'}
                  recommendation={localOverride?.prepNoteOverride ?? 'لا توجد ملاحظة تحضير مخصصة.'}
                  reason={hasOverride
                    ? `تجاوز نشط: سعر الشريك ${displayPrice} · مخزون ${displayStock} (محدث: ${localOverride.lastUpdated})`
                    : `بيانات الكتالوج المركزي الافتراضية: سعر ${displayPrice} · مخزون ${displayStock}`
                  }
                  sla={item.categoryLabel}
                  primaryAction={{
                    id: `${item.id}-edit`,
                    label: selectedProductId === item.id ? 'قيد التعديل' : 'تعديل التجاوز',
                    onAction: () => handleProductSelect(item.id),
                  }}
                />
              );
            })}
          </Box>
        </Surface>

        {/* Editor Inspector Drawer */}
        <Box gap={4}>
          {selectedProductId && selectedProductDetail && selectedCentralItem ? (
            <WebControlPanelInspectorShell
              title={`تجاوز المنتج — ${selectedCentralItem.name}`}
              onClose={() => setSelectedProductId(null)}
            >
              <Box gap={4} padding={4}>
                {/* STRICT SSoT identity block - read-only */}
                <Surface tone="inset" padding={3} gap={1} style={{ borderRadius: '10px' }}>
                  <Text role="caption" tone="brand" style={{ fontWeight: '800' }}>ℹ الهوية المركزية للمنتج (قراءة فقط لمنع التكرار)</Text>
                  <KeyValueList
                    dense
                    items={[
                      { label: 'الاسم المركزي', value: selectedCentralItem.name },
                      { label: 'فئة الكتالوج', value: selectedCentralItem.categoryLabel },
                      { label: 'رمز SKU المركزي', value: selectedProductDetail.sku },
                      { label: 'الباركود / GTIN', value: selectedProductDetail.barcode ?? '—' },
                      { label: 'سعر الكتالوج الافتراضي', value: selectedCentralItem.priceLabel },
                    ]}
                  />
                </Surface>

                {/* Overridable field forms */}
                <Box gap={3}>
                  <Text role="titleSm" style={{ fontWeight: '800' }}>المتغيرات المحلية للشريك</Text>

                  <TextField
                    label="سعر الشريك المخصص (Price Override)"
                    value={formPrice}
                    onChangeText={setFormPrice}
                    placeholder="مثال: 15.00 ر.س"
                  />

                  <TextField
                    label="كمية المخزون المحلي (Stock Count)"
                    value={formStock}
                    onChangeText={setFormStock}
                    keyboardType="numeric"
                    placeholder="مثال: 50"
                  />

                  <Box gap={1}>
                    <Text role="caption" tone="muted">حالة التوفر للطلب</Text>
                    <Box layoutDirection="row" gap={2}>
                      <button
                        type="button"
                        onClick={() => setFormAvailable(true)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: '8px',
                          border: `1px solid ${formAvailable ? theme.success : theme.line}`,
                          background: formAvailable ? theme.successSurface : theme.surface,
                          color: formAvailable ? theme.success : theme.text,
                          fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                        }}
                      >
                        متاح للطلب
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormAvailable(false)}
                        style={{
                          flex: 1, padding: '8px', borderRadius: '8px',
                          border: `1px solid ${!formAvailable ? theme.danger : theme.line}`,
                          background: !formAvailable ? theme.dangerSurface : theme.surface,
                          color: !formAvailable ? theme.danger : theme.text,
                          fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                        }}
                      >
                        غير متوفر (موقوف)
                      </button>
                    </Box>
                  </Box>

                  <TextField
                    label="ملاحظة التحضير للعملاء (Prep Note)"
                    value={formPrepNote}
                    onChangeText={setFormPrepNote}
                    placeholder="مثال: يستغرق التحضير ١٥ دقيقة"
                  />
                </Box>

                {/* Metadata & Effect details */}
                <Surface tone="inset" padding={3} gap={1} style={{ borderRadius: '8px' }}>
                  <KeyValueList
                    dense
                    items={[
                      { label: 'مالك التجاوز', value: currentPartnerOverrides.find(o => o.productId === selectedProductId)?.owner === 'partner' ? 'الشريك' : 'بوابة العمليات (CP)', tone: 'brand' },
                      { label: 'حالة التجاوز', value: 'نشط ومباشر للعميل', tone: 'success' },
                      { label: 'أثر الظهور', value: formAvailable ? `العميل يرى سعر ${formPrice}` : 'المنتج يظهر غير متوفر للعميل', tone: 'default' },
                    ]}
                  />
                </Surface>

                <WebControlPanelActionCluster
                  primary={{
                    id: 'btn-save-override',
                    label: 'حفظ وتطبيق التجاوز',
                    onAction: handleSaveOverride,
                  }}
                  secondary={{
                    id: 'btn-reset-override',
                    label: 'إلغاء التجاوز (استعادة)',
                    onAction: handleResetOverride,
                  }}
                />
              </Box>
            </WebControlPanelInspectorShell>
          ) : (
            <WebControlPanelRecommendation
              title="توجيه التجاوزات"
              reason={actionMessage}
              confidence="high"
              auditTag="UI_PREVIEW_ONLY"
            />
          )}

          <Surface tone="raised" padding={4} gap={2} style={{ borderRadius: '12px' }}>
            <Text role="titleSm" style={{ fontWeight: '800' }}>مبدأ عدم تكرار المنتج</Text>
            <Text role="bodySm" tone="muted">
              لتفادي تشتت البيانات، يتم دمج كل التجاوزات على معرف المنتج المركزي. أي تعديل في الصورة أو الاسم أو الباركود يجب أن يتم عبر إدارة الكتالوج العام وليس من هنا.
            </Text>
          </Surface>
        </Box>
      </div>
    </Box>
  );
}

export default PartnerCatalogOverridesWorkspace;
