'use client';

import React from 'react';
import { OperationsSuggestionCard } from './operations.ui';
import { DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW } from './operations.preview-data';
import styles from './dsh-surface.module.css';

export type DispatchAssignmentScreenProps = { hubHref: string; subGroup?: string; };

const STATUS_CLASS_NAMES: Record<string, string> = {
  warning: styles.liveOrdersStatusWarning,
  danger: styles.liveOrdersStatusDanger,
  best: styles.liveOrdersStatusBest,
  brand: styles.liveOrdersStatusBrand,
};

export function DispatchAssignmentScreen({ hubHref, subGroup }: DispatchAssignmentScreenProps) {
  const preview = DISPATCH_ASSIGNMENT_OPERATIONAL_PREVIEW;

  return (
    <div className={styles.liveOrdersScreen}>

      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>الإسناد والتوزيع</h2>
        <div>
          <button className={styles.liveOrdersFilterButton}>تحديث النظام</button>
        </div>
      </div>

      <div className={styles.liveOrdersSummaryGrid}>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>طلبات بانتظار الإسناد</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.waitingAssignment}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>كباتن متاحون</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.availableCaptains}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>جاهزون للاستلام</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.readyForPickup}</div>
        </div>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {preview.rows.map((item) => {
          const statusClassName = STATUS_CLASS_NAMES[item.statusTone] ?? STATUS_CLASS_NAMES.brand;
          const cardClassName = [
            styles.liveOrdersOrderCard,
            item.statusTone === 'danger' ? styles.liveOrdersOrderCardDanger : '',
            item.statusTone === 'warning' ? styles.liveOrdersOrderCardWarning : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={item.id} className={cardClassName}>
              <div className={styles.liveOrdersOrderMeta}>
                <div className={styles.liveOrdersOrderTopRow}>
                  <span className={styles.liveOrdersOrderId}>{item.id}</span>
                  <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{item.status}</span>
                  <span className={styles.liveOrdersRingHint}>{item.readyForPickup}</span>
                </div>
                <div className={styles.liveOrdersDestination}>{item.captain}</div>
                <div className={styles.liveOrdersMetaText}>المسافة: {item.distance} | زمن الاستلام: {item.pickupEta} | زمن التسليم: {item.dropoffEta}</div>
                <div className={styles.liveOrdersNoteText}>{item.note}</div>
              </div>

              <OperationsSuggestionCard
                label={item.recommendation}
                reason={item.blocker}
                confidence={item.confidence === 'ثقة عالية' ? 'high' : item.confidence === 'ثقة منخفضة' ? 'low' : 'medium'}
                actions={(
                  <>
                    <button className={styles.liveOrdersActionPrimary}>تأكيد الإسناد</button>
                    <button className={styles.liveOrdersActionSecondary}>إعادة تعيين</button>
                  </>
                )}
              >
                <span className={styles.liveOrdersSuggestionChip}>{item.readyForPickup}</span>
              </OperationsSuggestionCard>

              <div className={styles.liveOrdersOrderActions}>
                <div className={styles.liveOrdersTimelineTitle}>ملاحظة التوزيع</div>
                <div className={styles.liveOrdersTimelineList}>
                  {item.actionPlans.map((plan) => <div key={plan}>• {plan}</div>)}
                </div>
                <div className={styles.liveOrdersPlanWrap}>
                  <span className={styles.liveOrdersPlanChip}>المسافة {item.distance}</span>
                  <span className={styles.liveOrdersPlanChip}>{item.blocker}</span>
                </div>
                <div className={styles.liveOrdersActionGrid}>
                  <button className={styles.liveOrdersActionPrimary}>تأكيد الإسناد</button>
                  <button className={styles.liveOrdersActionSecondary}>إعادة تعيين</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default DispatchAssignmentScreen;
