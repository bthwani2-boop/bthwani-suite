'use client';

import React from 'react';
import { OperationsSuggestionCard } from '../operations.ui';
import { LIVE_ORDERS_OPERATIONAL_PREVIEW } from '../operations.preview-data';
import styles from '../dsh-surface.module.css';

export type LiveOrdersScreenProps = { hubHref: string; };

const STATUS_CLASS_NAMES: Record<string, string> = {
  warning: styles.liveOrdersStatusWarning,
  danger: styles.liveOrdersStatusDanger,
  best: styles.liveOrdersStatusBest,
  brand: styles.liveOrdersStatusBrand,
};

export function LiveOrdersScreen({ hubHref }: LiveOrdersScreenProps) {
  const preview = LIVE_ORDERS_OPERATIONAL_PREVIEW;

  return (
    <div className={styles.liveOrdersScreen}>

      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>الطلبات الحية</h2>
        <button className={styles.liveOrdersFilterButton}>فلاتر مختصرة</button>
      </div>

      <div className={styles.liveOrdersSummaryGrid}>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>بانتظار التأكيد</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.awaitingAcknowledgement}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>رنينات محجوبة</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.blockedRings}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>{preview.summary.ringLabel}</div>
          <div className={styles.liveOrdersSummaryHint}>{preview.summary.actionHint}</div>
        </div>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {preview.rows.map((order) => {
          const statusClassName = STATUS_CLASS_NAMES[order.statusTone] ?? STATUS_CLASS_NAMES.brand;
          const cardClassName = [
            styles.liveOrdersOrderCard,
            order.statusTone === 'danger' ? styles.liveOrdersOrderCardDanger : '',
            order.statusTone === 'warning' ? styles.liveOrdersOrderCardWarning : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={order.id} className={cardClassName}>
              <div className={styles.liveOrdersOrderMeta}>
                <div className={styles.liveOrdersOrderTopRow}>
                  <span className={styles.liveOrdersOrderId}>{order.id}</span>
                  <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{order.status}</span>
                  <span className={`${styles.liveOrdersRingHint} ${order.statusTone === 'danger' ? styles.liveOrdersRingHintDanger : ''}`}>{order.ringLabel}</span>
                </div>
                <div className={styles.liveOrdersDestination}>{order.destination}</div>
                <div className={styles.liveOrdersMetaText}>زمن الوصول: {order.eta} | الكابتن: {order.captain}</div>
                <div className={styles.liveOrdersNoteText}>{order.notes}</div>
              </div>

              <OperationsSuggestionCard
                label={order.suggestion.label}
                reason={order.suggestion.reason}
                confidence={order.suggestion.confidence}
                actions={(
                  <>
                    <button className={styles.liveOrdersActionPrimary}>{order.suggestion.action}</button>
                    {order.suggestion.secondary && <button className={styles.liveOrdersActionSecondary}>{order.suggestion.secondary}</button>}
                  </>
                )}
              >
                {order.suggestion.auditRequired && <span className={styles.liveOrdersAuditChip}>يتطلب تدقيق</span>}
                <span className={styles.liveOrdersSuggestionChip}>{order.actionHint}</span>
              </OperationsSuggestionCard>

              <div className={styles.liveOrdersOrderActions}>
                <div className={styles.liveOrdersTimelineTitle}>المسار الزمني</div>
                <div className={styles.liveOrdersTimelineList}>
                  {order.arrivalTimeline.map((step) => <div key={step}>• {step}</div>)}
                </div>
                <div className={styles.liveOrdersPlanWrap}>
                  {order.actionPlans.map((plan) => (
                    <span key={plan} className={styles.liveOrdersPlanChip}>{plan}</span>
                  ))}
                </div>
                <div className={styles.liveOrdersActionGrid}>
                  <button className={styles.liveOrdersActionPrimary}>إعادة إسناد</button>
                  <button className={styles.liveOrdersActionSecondary}>تفاصيل</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default LiveOrdersScreen;
