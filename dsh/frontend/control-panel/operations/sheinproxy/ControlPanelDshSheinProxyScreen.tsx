'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OperationsSuggestionCard } from '../operations.ui';
import { SHEIN_PROXY_OPERATIONAL_PREVIEW } from '../operations.preview-data';
import styles from '../dsh-surface.module.css';

export type ControlPanelDshSheinProxyScreenProps = {
  hubHref?: string;
};

const STATUS_CLASS_NAMES: Record<string, string> = {
  warning: styles.liveOrdersStatusWarning,
  danger: styles.liveOrdersStatusDanger,
  best: styles.liveOrdersStatusBest,
  brand: styles.liveOrdersStatusBrand,
};

export function ControlPanelDshSheinProxyScreen({ hubHref = '/operations' }: ControlPanelDshSheinProxyScreenProps) {
  const router = useRouter();
  const preview = SHEIN_PROXY_OPERATIONAL_PREVIEW;

  return (
    <div className={styles.liveOrdersScreen}>
      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>شي إن</h2>
        <div>
          <button className={styles.liveOrdersFilterButton} onClick={() => router.refresh()}>
            تحديث
          </button>
          <button className={styles.liveOrdersFilterButton} onClick={() => router.push(hubHref)}>
            العودة إلى القيادة
          </button>
        </div>
      </div>

      <div className={styles.liveOrdersSummaryGrid}>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>قيد المراجعة</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.underReview}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>مقدّرة</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.estimated}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>العرض المرسل</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.offered}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>مجدولة</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.scheduled}</div>
        </div>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {preview.requests.map((request) => {
          const statusClassName = STATUS_CLASS_NAMES[request.statusTone] ?? STATUS_CLASS_NAMES.brand;
          return (
            <div key={request.id} className={styles.liveOrdersOrderCard}>
              <div className={styles.liveOrdersOrderMeta}>
                <div className={styles.liveOrdersOrderTopRow}>
                  <span className={styles.liveOrdersOrderId}>{request.id}</span>
                  <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{request.statusLabel}</span>
                  <span className={styles.liveOrdersRingHint}>{request.updated}</span>
                </div>
                <div className={styles.liveOrdersDestination}>{request.customer}</div>
                <div className={styles.liveOrdersMetaText}>الإجمالي: {request.total}</div>
                <div className={styles.liveOrdersNoteText}>المبلغ: {request.amount} | الشحن: {request.shipping} | الرسوم: {request.fee}</div>
                <div className={styles.liveOrdersNoteText}>{request.note}</div>
              </div>

              <OperationsSuggestionCard
                title="توصية"
                label={request.nextStep}
                reason={request.note}
                confidence={request.statusTone === 'danger' ? 'low' : request.statusTone === 'warning' ? 'medium' : 'high'}
                actions={(
                  <>
                    <button className={styles.liveOrdersActionPrimary}>{request.nextStep}</button>
                    <button className={styles.liveOrdersActionSecondary}>عرض التفاصيل</button>
                  </>
                )}
              />

              <div className={styles.liveOrdersOrderActions}>
                <div className={styles.liveOrdersTimelineTitle}>حالة الطلب</div>
                <div className={styles.liveOrdersTimelineList}>
                  <div>• المرحلة: {request.statusLabel}</div>
                  <div>• {request.updated}</div>
                  <div>• {request.nextStep}</div>
                </div>
                <div className={styles.liveOrdersPlanWrap}>
                  <span className={styles.liveOrdersPlanChip}>{request.statusLabel}</span>
                  <span className={styles.liveOrdersPlanChip}>{request.total}</span>
                </div>
                <div className={styles.liveOrdersActionGrid}>
                  <button className={styles.liveOrdersActionPrimary} onClick={() => router.push(`${hubHref}?workspace=sheinproxy&requestId=${request.id}`)}>افحص الطلب</button>
                  <button className={styles.liveOrdersActionSecondary} onClick={() => router.push(`${hubHref}?workspace=proxy-shein-awnak`)}>عرض عونك</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ControlPanelDshSheinProxyScreen;
