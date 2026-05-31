'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  WebControlPanelDecisionRow,
  WebControlPanelKpiStrip,
} from '@bthwani/ui-kit/web';
import { Box } from '@bthwani/ui-kit';
import styles from '../shared/control-panel-surface.module.css';
import { buildOperationsHref } from './operations.registry';

export type PartnerStoresScreenProps = { hubHref: string; subGroup?: string; };

import { PARTNER_STORES_PREVIEW, type StoreDeliveryMode } from '../../data';

const STORES = PARTNER_STORES_PREVIEW;


const runPreviewOperation = () => undefined; // fallback for non-routable preview actions

export function PartnerStoresScreen({ hubHref: _hubHref, subGroup: _subGroup }: PartnerStoresScreenProps) {
  const router = useRouter();

  return (
    <div className={styles.surfaceCockpitContent} style={{ overflowY: 'auto', paddingInlineEnd: '4px' }}>
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
              id: `${store.id}-primary`,
              label: store.suggestion.action,
              onAction: () => {
                if (store.suggestion.action === 'توجيه كباتن') {
                  router.push(buildOperationsHref('dispatch-assignment'));
                } else if (store.suggestion.action === 'تواصل مع المتجر') {
                  router.push(buildOperationsHref('partner-stores', { orderId: store.id }));
                } else {
                  runPreviewOperation();
                }
              },
            }}
            secondaryAction={store.suggestion.secondary ? {
              id: `${store.id}-secondary`,
              label: store.suggestion.secondary,
              onAction: () => {
                if (store.suggestion.secondary === 'إيقاف مؤقت' || store.suggestion.secondary === 'إيقاف استقبال') {
                  router.push(buildOperationsHref('exceptions-escalations'));
                } else {
                  runPreviewOperation();
                }
              },
            } : undefined}
          />
        ))}
      </Box>
    </div>
  );
}

export default PartnerStoresScreen;
