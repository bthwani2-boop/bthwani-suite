'use client';

import React from 'react';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
} from '@bthwani/ui-kit/web';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type PartnerStoresScreenProps = { hubHref: string; subGroup?: string; };

type StoreDeliveryMode = 'bthwani_delivery' | 'partner_delivery';

const STORES: readonly {
  id: string; name: string; branch: string; status: string;
  deliveryMode: StoreDeliveryMode;
  prepTime: string; readyOrders: number; issue: string;
  suggestion: { label: string; reason: string; confidence: 'high' | 'medium'; action: string; secondary: string | null; auditRequired: boolean };
  statusTone: 'warning' | 'danger' | 'success';
}[] = [
  {
    id: 'STR-402', name: 'متجر الرياض', branch: 'العليا', status: 'مضغوط',
    deliveryMode: 'bthwani_delivery',
    prepTime: '18 دقيقة', readyOrders: 3, issue: 'تأخير مستمر: تجاوز المعدل بـ 8 دقائق',
    suggestion: { label: 'تواصل مع المتجر فوراً', reason: 'وقت التجهيز تجاوز المعدل بـ 8 دقائق', confidence: 'high', action: 'تواصل', secondary: 'إيقاف مؤقت', auditRequired: false },
    statusTone: 'warning',
  },
  {
    id: 'STR-405', name: 'مقهى الشرق', branch: 'الملز', status: 'تأخير',
    deliveryMode: 'bthwani_delivery',
    prepTime: '24 دقيقة', readyOrders: 5, issue: '5 طلبات جاهزة لم يستلمها كابتن',
    suggestion: { label: 'وجّه كابتن للاستلام فوراً', reason: '5 طلبات جاهزة بلا كابتن ووقت انتظار مرتفع', confidence: 'high', action: 'توجيه كباتن', secondary: 'إيقاف استقبال', auditRequired: false },
    statusTone: 'danger',
  },
  {
    id: 'STR-412', name: 'مخبز الورد', branch: 'اليرموك', status: 'مفتوح',
    deliveryMode: 'partner_delivery',
    prepTime: '8 دقائق', readyOrders: 0, issue: '',
    suggestion: { label: 'لا تدخل مطلوب', reason: 'وضع المتجر طبيعي ولا طلبات معلقة', confidence: 'high', action: 'عرض تفاصيل', secondary: null, auditRequired: false },
    statusTone: 'success',
  },
  {
    id: 'STR-415', name: 'مطعم الساحل', branch: 'النفل', status: 'مفتوح',
    deliveryMode: 'partner_delivery',
    prepTime: '12 دقيقة', readyOrders: 1, issue: '',
    suggestion: { label: 'تابع الطلب الواحد الجاهز', reason: 'طلب جاهز — موصل المتجر يتولى التوصيل', confidence: 'medium', action: 'تواصل مع المتجر', secondary: null, auditRequired: false },
    statusTone: 'success',
  },
];

const runPreviewOperation = () => undefined;

export function PartnerStoresScreen({ hubHref: _hubHref, subGroup: _subGroup }: PartnerStoresScreenProps) {
  return (
    <div className={styles.surfaceCockpitContent}>
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>المتاجر والشركاء</h2>
      </div>

      <WebControlPanelKpiStrip
        items={[
          { id: 'open', label: 'مفتوحة الآن', value: '١٤٢', tone: 'success' },
          { id: 'closed', label: 'مغلقة', value: '٣٨', tone: 'neutral' },
          { id: 'surged', label: 'متاجر مضغوطة', value: '١٢', tone: 'warning' },
          { id: 'delay', label: 'تأخير التجهيز', value: '٥', tone: 'danger' },
          { id: 'store-delivery', label: 'توصيل المتجر', value: '٢', tone: 'success' },
        ]}
      />

      <Box gap={2} style={{}}>
        {STORES.map((store) => (
          <WebControlPanelDecisionRow
            key={store.id}
            entityId={store.id}
            entityLabel={`${store.name} — فرع: ${store.branch}`}
            status={store.status}
            statusTone={store.statusTone}
            risk={store.statusTone === 'danger' ? 'danger' : store.statusTone === 'warning' ? 'warning' : 'neutral'}
            recommendation={store.suggestion.label}
            reason={store.suggestion.reason}
            sla={`التجهيز: ${store.prepTime} | جاهزة: ${store.readyOrders} | ${store.deliveryMode === 'partner_delivery' ? 'توصيل المتجر' : 'توصيل بثواني'}`}
            primaryAction={{
              id: 'primary',
              label: store.suggestion.action,
              onAction: runPreviewOperation,
            }}
            secondaryAction={store.suggestion.secondary ? {
              id: 'secondary',
              label: store.suggestion.secondary,
              onAction: runPreviewOperation,
            } : undefined}
          />
        ))}
      </Box>
    </div>
  );
}

export default PartnerStoresScreen;
