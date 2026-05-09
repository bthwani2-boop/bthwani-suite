'use client';

import React from 'react';
import { OperationsSuggestionCard } from './operations.ui';
import { AREA_CAPACITY_OPERATIONAL_PREVIEW } from './operations.preview-data';
import styles from './dsh-surface.module.css';

export type AreaCapacityScreenProps = { hubHref: string; subGroup?: string; };

const STATUS_CLASS_NAMES: Record<string, string> = {
  warning: styles.liveOrdersStatusWarning,
  danger: styles.liveOrdersStatusDanger,
  best: styles.liveOrdersStatusBest,
  brand: styles.liveOrdersStatusBrand,
};

export function AreaCapacityScreen({ hubHref, subGroup }: AreaCapacityScreenProps) {
  const preview = AREA_CAPACITY_OPERATIONAL_PREVIEW;

  return (
    <div className={styles.liveOrdersScreen}>

      <div className={styles.liveOrdersHeaderRow}>
        <h2 className={styles.liveOrdersTitle}>المناطق والسعة</h2>
        <button className={styles.liveOrdersFilterButton}>تحديث وتصفية</button>
      </div>

      <div className={styles.liveOrdersSummaryGrid}>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>حِمل المنطقة</div>
          <div className={styles.liveOrdersSummaryValueDanger}>{preview.summary.zoneLoad}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>المناطق المحمية</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.protectedZones}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>المناطق الحرة</div>
          <div className={styles.liveOrdersSummaryValueBrand}>{preview.summary.freeZones}</div>
        </div>
        <div className={styles.liveOrdersSummaryCard}>
          <div className={styles.liveOrdersSummaryLabel}>التوصية</div>
          <div className={styles.liveOrdersSummaryHint}>{preview.summary.recommendation}</div>
        </div>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {preview.zones.map((area) => {
          const statusClassName = STATUS_CLASS_NAMES[area.statusTone] ?? STATUS_CLASS_NAMES.brand;
          return (
            <div key={area.id} className={styles.liveOrdersOrderCard}>
              <div className={styles.liveOrdersOrderMeta}>
                <div className={styles.liveOrdersOrderTopRow}>
                  <span className={styles.liveOrdersOrderId}>{area.zone}</span>
                  <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{area.zoneLoad}</span>
                  <span className={styles.liveOrdersRingHint}>{area.recommendation}</span>
                </div>
                <div className={styles.liveOrdersDestination}>{area.id}</div>
                <div className={styles.liveOrdersMetaText}>محمية: {area.protectedZones} | حرة: {area.freeZones}</div>
                <div className={styles.liveOrdersNoteText}>{area.note}</div>
              </div>

              <OperationsSuggestionCard
                label={area.recommendation}
                reason={area.note}
                confidence={area.statusTone === 'danger' ? 'high' : area.statusTone === 'warning' ? 'medium' : 'high'}
                actions={(
                  <>
                    <button className={styles.liveOrdersActionPrimary}>{area.moveCapacity}</button>
                    <button className={styles.liveOrdersActionSecondary}>{area.reduceRadius}</button>
                  </>
                )}
              >
                {area.statusTone === 'danger' && <span className={styles.liveOrdersAuditChip}>خطر حرج</span>}
                <span className={styles.liveOrdersSuggestionChip}>{area.temporaryStop}</span>
              </OperationsSuggestionCard>

              <div className={styles.liveOrdersOrderActions}>
                <div className={styles.liveOrdersTimelineTitle}>إجراء المنطقة</div>
                <div className={styles.liveOrdersTimelineList}>
                  <div>• {area.surgeBonus}</div>
                  <div>• {area.reduceRadius}</div>
                  <div>• {area.moveCapacity}</div>
                </div>
                <div className={styles.liveOrdersPlanWrap}>
                  <span className={styles.liveOrdersPlanChip}>{area.temporaryStop}</span>
                  <span className={styles.liveOrdersPlanChip}>{area.protectedZones} محمية</span>
                </div>
                <div className={styles.liveOrdersActionGrid}>
                  <button className={styles.liveOrdersActionPrimary}>تفعيل حافز المنطقة</button>
                  <button className={styles.liveOrdersActionSecondary}>إيقاف مؤقت</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}

export default AreaCapacityScreen;
