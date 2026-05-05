'use client';

import React from 'react';
import { OperationsSuggestionCard } from '../operations.ui';
import { EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW } from '../operations.preview-data';
import styles from '../dsh-surface.module.css';

export type ExceptionsEscalationsScreenProps = { hubHref: string; };

const STATUS_CLASS_NAMES: Record<string, string> = {
  warning: styles.liveOrdersStatusWarning,
  danger: styles.liveOrdersStatusDanger,
  best: styles.liveOrdersStatusBest,
  brand: styles.liveOrdersStatusBrand,
};

export function ExceptionsEscalationsScreen({ hubHref }: ExceptionsEscalationsScreenProps) {
  const preview = EXCEPTIONS_ESCALATIONS_OPERATIONAL_PREVIEW;

  return (
    <div className={styles.liveOrdersScreen}>

      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>الاستثناءات والتصعيد</h2>
        <button className={styles.liveOrdersFilterButton}>فلاتر مختصرة</button>
      </div>

      <div className={styles.liveOrdersSummaryGrid}>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>مفتوحة</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.open}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>تصعيد</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.escalate}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>حل</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.resolve}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>إغلاق</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.close}</div>
        </div>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {preview.exceptions.map((exc) => {
          const statusClassName = STATUS_CLASS_NAMES[exc.statusTone] ?? STATUS_CLASS_NAMES.brand;
          const cardClassName = [
            styles.liveOrdersOrderCard,
            exc.statusTone === 'danger' ? styles.liveOrdersOrderCardDanger : '',
            exc.statusTone === 'warning' ? styles.liveOrdersOrderCardWarning : '',
          ].filter(Boolean).join(' ');

          return (
            <div key={exc.id} className={cardClassName}>
              <div className={styles.liveOrdersOrderMeta}>
                <div className={styles.liveOrdersOrderTopRow}>
                  <span className={styles.liveOrdersOrderId}>{exc.id}</span>
                  <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{exc.severity}</span>
                  <span className={styles.liveOrdersRingHint}>{exc.currentOwner}</span>
                </div>
                <div className={styles.liveOrdersDestination}>{exc.type}</div>
                <div className={styles.liveOrdersMetaText}>البداية: {exc.startTime}</div>
                <div className={styles.liveOrdersNoteText}>آخر إجراء: {exc.lastAction}</div>
                <div className={styles.liveOrdersNoteText}>{exc.note}</div>
              </div>

              <OperationsSuggestionCard
                label={exc.suggestedAction}
                reason={exc.note}
                confidence={exc.statusTone === 'danger' ? 'high' : exc.statusTone === 'warning' ? 'medium' : 'high'}
                actions={(
                  <>
                    <button className={styles.liveOrdersActionPrimary}>{exc.suggestedAction}</button>
                    <button className={styles.liveOrdersActionSecondary}>إغلاق</button>
                  </>
                )}
              >
                <span className={styles.liveOrdersSuggestionChip}>{exc.resolutionPath}</span>
              </OperationsSuggestionCard>

              <div className={styles.liveOrdersOrderActions}>
                <div className={styles.liveOrdersTimelineTitle}>مسار الإغلاق</div>
                <div className={styles.liveOrdersTimelineList}>
                  <div>• {exc.lastAction}</div>
                  <div>• {exc.currentOwner}</div>
                  <div>• {exc.suggestedAction}</div>
                </div>
                <div className={styles.liveOrdersPlanWrap}>
                  <span className={styles.liveOrdersPlanChip}>{exc.resolutionPath}</span>
                  <span className={styles.liveOrdersPlanChip}>{exc.severity}</span>
                </div>
                <div className={styles.liveOrdersActionGrid}>
                  <button className={styles.liveOrdersActionPrimary}>حل</button>
                  <button className={styles.liveOrdersActionSecondary}>تصعيد</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default ExceptionsEscalationsScreen;
