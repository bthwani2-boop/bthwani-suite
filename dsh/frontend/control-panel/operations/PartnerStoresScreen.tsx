'use client';

import React from 'react';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
} from '@bthwani/ui-kit/web';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';

export type PartnerStoresScreenProps = { hubHref: string; subGroup?: string; };

const STORES = [
  {
    id: 'STR-402', name: 'متجر الرياض', branch: 'العليا', status: 'مضغوط',
    prepTime: '18 دقيقة', readyOrders: 3, issue: 'تأخير مستمر: تجاوز المعدل بـ 8 دقائق',
    suggestion: { label: 'تواصل مع المتجر فوراً', reason: 'وقت التجهيز تجاوز المعدل بـ 8 دقائق', confidence: 'high' as const, action: 'تواصل', secondary: 'إيقاف مؤقت', auditRequired: false },
    statusTone: 'warning' as const,
  },
  {
    id: 'STR-405', name: 'مقهى الشرق', branch: 'الملز', status: 'تأخير',
    prepTime: '24 دقيقة', readyOrders: 5, issue: '5 طلبات جاهزة لم يستلمها كابتن',
    suggestion: { label: 'وجّه كابتن للاستلام فوراً', reason: '5 طلبات جاهزة بلا كابتن ووقت انتظار مرتفع', confidence: 'high' as const, action: 'توجيه كباتن', secondary: 'إيقاف استقبال', auditRequired: false },
    statusTone: 'danger' as const,
  },
  {
    id: 'STR-412', name: 'مخبز الورد', branch: 'اليرموك', status: 'مفتوح',
    prepTime: '8 دقائق', readyOrders: 0, issue: '',
    suggestion: { label: 'لا تدخل مطلوب', reason: 'وضع المتجر طبيعي ولا طلبات معلقة', confidence: 'high' as const, action: 'عرض تفاصيل', secondary: null, auditRequired: false },
    statusTone: 'success' as const,
  },
  {
    id: 'STR-415', name: 'مطعم الساحل', branch: 'النفل', status: 'مفتوح',
    prepTime: '12 دقيقة', readyOrders: 1, issue: '',
    suggestion: { label: 'تابع الطلب الواحد الجاهز', reason: 'طلب جاهز — تأكد من وجود كابتن مسند', confidence: 'medium' as const, action: 'تواصل مع الكابتن', secondary: null, auditRequired: false },
    statusTone: 'success' as const,
  },
] as const;

export function PartnerStoresScreen({ hubHref, subGroup }: PartnerStoresScreenProps) {
  return (
    <div className={styles.surfaceCockpitContent} dir="rtl">
      <div className={styles.surfaceSectionHeader}>
        <h2 className={styles.surfaceSectionTitle}>المتاجر والشركاء</h2>
      </div>

      <WebControlPanelKpiStrip
        items={[
          { id: 'open', label: 'مفتوحة الآن', value: '١٤٢', tone: 'success' },
          { id: 'closed', label: 'مغلقة', value: '٣٨', tone: 'neutral' },
          { id: 'surged', label: 'متاجر مضغوطة', value: '١٢', tone: 'warning' },
          { id: 'delay', label: 'تأخير التجهيز', value: '٥', tone: 'danger' }
        ]}
      />

      <Box gap={2} style={{ display: 'grid' }}>
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
            sla={`التجهيز: ${store.prepTime} | جاهزة: ${store.readyOrders}`}
            primaryAction={{
              id: 'primary',
              label: store.suggestion.action,
              onAction: () => console.log('Store Primary Action', store.id)
            }}
            secondaryAction={store.suggestion.secondary ? {
              id: 'secondary',
              label: store.suggestion.secondary,
              onAction: () => console.log('Store Secondary Action', store.id)
            } : undefined}
          />
        ))}
      </Box>
    </div>
  );
}

export default PartnerStoresScreen;
