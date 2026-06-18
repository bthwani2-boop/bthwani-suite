'use client';

import React from 'react';
import { Box, Text, Surface, TextField, KeyValueList } from '@bthwani/ui-kit';
import { Pressable } from 'react-native';
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
} from '../../shared/catalog';
import {
  PARTNER_FULFILLMENT_AGREEMENTS,
  getPartnerCatalogOverrides,
  upsertPartnerCatalogOverride,
  deletePartnerCatalogOverride,
  type DshPartnerCatalogOverride,
} from './workflow';
import styles from '../shared/control-panel-surface.module.css';

export function PartnerCatalogOverridesWorkspace() {
  const [selectedPartnerId, setSelectedPartnerId] = React.useState('partner-saha');
  const [overrides, setOverrides] = React.useState<Record<string, DshPartnerCatalogOverride[]>>({});
  const [selectedProductId, setSelectedProductId] = React.useState<string | null>(null);
  const [actionMessage, setActionMessage] = React.useState('اختر منتجاً لتعديل تجاوزات الشريك المحلية.');

  const [formPrice, setFormPrice] = React.useState('');
  const [formStock, setFormStock] = React.useState('0');
  const [formAvailable, setFormAvailable] = React.useState(true);
  const [formPrepNote, setFormPrepNote] = React.useState('');

  React.useEffect(() => {
    const initialOverrides: Record<string, DshPartnerCatalogOverride[]> = {};
    for (const partner of PARTNER_FULFILLMENT_AGREEMENTS) {
      initialOverrides[partner.partnerId] = getPartnerCatalogOverrides(partner.partnerId);
    }
    setOverrides(initialOverrides);
  }, []);

  const centralItems = React.useMemo(() => buildCentralPartnerInventoryItems(), []);

  const partnerItems = React.useMemo(() => {
    if (selectedPartnerId === 'partner-saha') {
      return centralItems.filter(i => ['item-choco-2', 'item-apple-1', 'item-milk-1', 'item-yogurt-1'].includes(i.id));
    }
    if (selectedPartnerId === 'partner-shorouq') {
      return centralItems.filter(i => ['item-chicken-2', 'item-salad-2', 'prd-restaurant-burger'].includes(i.id));
    }
    if (selectedPartnerId === 'partner-zawya') {
      return centralItems.filter(i => ['item-bread-1', 'item-croissant-2', 'item-roll-1'].includes(i.id));
    }
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

  const selectedProductDetail = selectedProductId ? (CENTRAL_PRODUCT_DETAIL_LOOKUP[selectedProductId] ?? {
    id: selectedProductId,
    sku: deriveProductSku(selectedProductId),
    gtin: deriveProductGtin(selectedProductId),
    barcode: deriveProductGtin(selectedProductId) ?? '—',
  }) : null;

  const selectedCentralItem = selectedProductId ? centralItems.find(i => i.id === selectedProductId) : null;

  return (
    <Box gap={4}>
      <Box gap={2}>
        <Text role="caption" tone="brand">اختر الشريك لإدارة تجاوزات الكتالوج</Text>
        <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
          {PARTNER_FULFILLMENT_AGREEMENTS.map((partner) => {
            const isSelected = selectedPartnerId === partner.partnerId;
            const overridesCount = (overrides[partner.partnerId] ?? []).length;

            return (
              <Pressable
                key={partner.partnerId}
                onPress={() => handlePartnerChange(partner.partnerId)}
                style={{ cursor: 'pointer' }}
              >
                <Surface
                  padding={2}
                  radiusToken="sm"
                  border
                  borderTone={isSelected ? 'brand' : 'line'}
                  tone={isSelected ? 'brand' : 'default'}
                  layoutDirection="row"
                  align="center"
                  gap={2}
                >
                  <Text role="bodySm" tone={isSelected ? 'brand' : 'default'}>{partner.storeName}</Text>
                  {overridesCount > 0 && (
                    <Surface padding={1} radiusToken="pill" tone="brand" border={false}>
                      <Text role="caption" tone="inverse">
                        {overridesCount}
                      </Text>
                    </Surface>
                  )}
                </Surface>
              </Pressable>
            );
          })}
        </Box>
      </Box>

      <WebControlPanelKpiStrip
        items={[
          { id: 'total-items', label: 'منتجات معروضة للشريك', value: String(partnerItems.length), tone: 'neutral' },
          { id: 'overridden-items', label: 'منتجات معدلة (Overrides)', value: String(currentPartnerOverrides.length), tone: 'warning' },
          { id: 'active-overrides', label: 'تجاوزات نشطة للعملاء', value: String(currentPartnerOverrides.filter(o => o.availableOverride !== false).length), tone: 'success' },
        ]}
      />

      <div className={styles.surfaceSplitGrid}>
        <Surface tone="raised" padding={5} gap={4} radiusToken="lg">
          <Box gap={1}>
            <Text role="titleLg" tone="brand">
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

        <Box gap={4}>
          {selectedProductId && selectedProductDetail && selectedCentralItem ? (
            <WebControlPanelInspectorShell
              title={`تجاوز المنتج — ${selectedCentralItem.name}`}
              onClose={() => setSelectedProductId(null)}
            >
              <Box gap={4} padding={4}>
                <Surface tone="inset" padding={3} gap={1} radiusToken="sm">
                  <Text role="caption" tone="brand">ℹ الهوية المركزية للمنتج (قراءة فقط لمنع التكرار)</Text>
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

                <Box gap={3}>
                  <Text role="titleSm" tone="default">المتغيرات المحلية للشريك</Text>

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

                  <Box gap={2}>
                    <Text role="caption" tone="muted">حالة التوفر للطلب</Text>
                    <Box layoutDirection="row" gap={2}>
                      <Pressable
                        onPress={() => setFormAvailable(true)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Surface
                          padding={2}
                          radiusToken="sm"
                          border
                          borderTone={formAvailable ? 'success' : 'line'}
                          tone={formAvailable ? 'success' : 'default'}
                        >
                          <Text role="bodySm" tone={formAvailable ? 'success' : 'default'}>
                            متاح للطلب
                          </Text>
                        </Surface>
                      </Pressable>
                      <Pressable
                        onPress={() => setFormAvailable(false)}
                        style={{ cursor: 'pointer' }}
                      >
                        <Surface
                          padding={2}
                          radiusToken="sm"
                          border
                          borderTone={!formAvailable ? 'danger' : 'line'}
                          tone={!formAvailable ? 'danger' : 'default'}
                        >
                          <Text role="bodySm" tone={!formAvailable ? 'danger' : 'default'}>
                            غير متوفر (موقوف)
                          </Text>
                        </Surface>
                      </Pressable>
                    </Box>
                  </Box>

                  <TextField
                    label="ملاحظة التحضير للعملاء (Prep Note)"
                    value={formPrepNote}
                    onChangeText={setFormPrepNote}
                    placeholder="مثال: يستغرق التحضير ١٥ دقيقة"
                  />
                </Box>

                <Surface tone="inset" padding={3} gap={1} radiusToken="sm">
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
              auditTag="NEEDS_BINDING_LATER"
            />
          )}

          <Surface tone="raised" padding={4} gap={2} radiusToken="lg">
            <Text role="titleSm" tone="default">مبدأ عدم تكرار المنتج</Text>
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
