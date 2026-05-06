'use client';

import React from 'react';
import { OperationsSuggestionCard } from './operations.ui';
import { AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW } from './operations.preview-data';
import styles from './dsh-surface.module.css';

export type AuditSupportSlaScreenProps = { hubHref: string; };

const STATUS_CLASS_NAMES: Record<string, string> = {
  warning: styles.liveOrdersStatusWarning,
  danger: styles.liveOrdersStatusDanger,
  best: styles.liveOrdersStatusBest,
  brand: styles.liveOrdersStatusBrand,
};

export function AuditSupportSlaScreen({ hubHref }: AuditSupportSlaScreenProps) {
  const preview = AUDIT_SUPPORT_SLA_OPERATIONAL_PREVIEW;

  return (
    <div className={styles.liveOrdersScreen}>

      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>التدقيق والدعم وSLA</h2>
        <div>
          <button className={styles.liveOrdersFilterButton}>فلاتر مختصرة</button>
          <button className={styles.liveOrdersFilterButton}>عرض التقرير التفصيلي</button>
          <button className={styles.liveOrdersFilterButton}>تصدير CSV</button>
        </div>
      </div>

      <div className={styles.liveOrdersSummaryGrid}>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>التدقيقات اليدوية</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.manualAudits}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>تذاكر الدعم</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.supportTickets}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>خطر SLA</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.slaRisk}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>اكتمال الإثبات</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.evidenceComplete}%</div>
        </div>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {preview.audits.map((item) => {
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
                  <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{item.permissionResult}</span>
                  <span className={styles.liveOrdersRingHint}>{item.evidenceState}</span>
                </div>
                <div className={styles.liveOrdersDestination}>{item.who}</div>
                <div className={styles.liveOrdersMetaText}>{item.why}</div>
                <div className={styles.liveOrdersNoteText}>الوقت: {item.when}</div>
                <div className={styles.liveOrdersNoteText}>سبب SLA: {item.slaBreachReason}</div>
              </div>

              <OperationsSuggestionCard
                label={item.resolutionPath}
                reason={item.proofRequired}
                confidence={item.statusTone === 'danger' ? 'low' : item.statusTone === 'warning' ? 'medium' : 'high'}
                actions={(
                  <>
                    <button className={styles.liveOrdersActionPrimary}>حل</button>
                    <button className={styles.liveOrdersActionSecondary}>تصعيد</button>
                  </>
                )}
              >
                <span className={styles.liveOrdersSuggestionChip}>{item.supportTicketLink}</span>
              </OperationsSuggestionCard>

              <div className={styles.liveOrdersOrderActions}>
                <div className={styles.liveOrdersTimelineTitle}>مطلوب للتدقيق</div>
                <div className={styles.liveOrdersTimelineList}>
                  <div>• {item.proofRequired}</div>
                  <div>• {item.evidenceState}</div>
                  <div>• {item.resolutionPath}</div>
                </div>
                <div className={styles.liveOrdersPlanWrap}>
                  <span className={styles.liveOrdersPlanChip}>{item.supportTicketLink}</span>
                  <span className={styles.liveOrdersPlanChip}>{item.permissionResult}</span>
                </div>
                <div className={styles.liveOrdersActionGrid}>
                  <button className={styles.liveOrdersActionPrimary}>إغلاق</button>
                  <button className={styles.liveOrdersActionSecondary}>عرض التفاصيل</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default AuditSupportSlaScreen;
