'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { OperationsSuggestionCard } from '../operations.ui';
import { AWNAK_OPERATIONAL_PREVIEW } from '../operations.preview-data';
import styles from '../dsh-surface.module.css';

export type AwnakScreenProps = {
  hubHref?: string;
};

const STATUS_CLASS_NAMES: Record<string, string> = {
  warning: styles.liveOrdersStatusWarning,
  danger: styles.liveOrdersStatusDanger,
  best: styles.liveOrdersStatusBest,
  brand: styles.liveOrdersStatusBrand,
};

export function AwnakScreen({ hubHref = '/operations' }: AwnakScreenProps) {
  const router = useRouter();
  const preview = AWNAK_OPERATIONAL_PREVIEW;

  return (
    <div className={styles.liveOrdersScreen}>
      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>عونك</h2>
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
          <div className={styles.liveOrdersSummaryLabel}>جاهز للمراجعة</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.underReview}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>قيد التأكيد</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.confirmed}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>في المتابعة</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.inFollowUp}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>يحتاج تصعيدًا</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.escalationNeeded}</div>
        </div>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {preview.rows.map((item) => {
          const statusClassName = STATUS_CLASS_NAMES[item.statusTone] ?? STATUS_CLASS_NAMES.brand;
          return (
            <div key={item.requestId} className={styles.liveOrdersOrderCard}>
              <div className={styles.liveOrdersOrderMeta}>
                <div className={styles.liveOrdersOrderTopRow}>
                  <span className={styles.liveOrdersOrderId}>{item.requestId}</span>
                  <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{item.status}</span>
                  <span className={styles.liveOrdersRingHint}>{item.workflowState}</span>
                </div>
                <div className={styles.liveOrdersDestination}>{item.type}</div>
                <div className={styles.liveOrdersMetaText}>{item.customer}</div>
                <div className={styles.liveOrdersNoteText}>المالك: {item.owner} | التخصيص: {item.assignmentStatus}</div>
                <div className={styles.liveOrdersNoteText}>{item.note}</div>
              </div>

              <OperationsSuggestionCard
                title="توصية"
                label={item.nextAction}
                reason={item.note}
                confidence={item.risk === 'مرتفع' ? 'low' : item.risk === 'متوسط' ? 'medium' : 'high'}
                actions={(
                  <>
                    <button className={styles.liveOrdersActionPrimary}>{item.nextAction}</button>
                    <button className={styles.liveOrdersActionSecondary}>فتح التفاصيل</button>
                  </>
                )}
              >
                <span className={styles.liveOrdersSuggestionChip}>{item.risk}</span>
              </OperationsSuggestionCard>

              <div className={styles.liveOrdersOrderActions}>
                <div className={styles.liveOrdersTimelineTitle}>الحالة التشغيلية</div>
                <div className={styles.liveOrdersTimelineList}>
                  <div>• {item.assignmentStatus}</div>
                  <div>• {item.workflowState}</div>
                  <div>• {item.nextAction}</div>
                </div>
                <div className={styles.liveOrdersPlanWrap}>
                  <span className={styles.liveOrdersPlanChip}>{item.risk}</span>
                  <span className={styles.liveOrdersPlanChip}>{item.owner}</span>
                </div>
                <div className={styles.liveOrdersActionGrid}>
                  <button className={styles.liveOrdersActionPrimary} onClick={() => router.push(`${hubHref}?workspace=proxy-shein-awnak`)}>عرض عونك</button>
                  <button className={styles.liveOrdersActionSecondary} onClick={() => router.push(`${hubHref}?workspace=sheinproxy`)}>عرض شي إن</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AwnakScreen;