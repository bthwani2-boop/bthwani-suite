import React from 'react';
import { Box, Text } from '@bthwani/ui-kit';
import styles from '../operations/dsh-surface.module.css';

export type ControlPanelDshActionQueueItem = {
  id: string;
  title: string;
  status: string;
  ownerSurface: string;
  blocker: string;
  evidence: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  evidenceActionLabel: string;
  tone?: 'best' | 'warning' | 'danger' | 'brand';
};

export type ControlPanelDshActionQueueProps = {
  title: string;
  purpose: string;
  items: readonly ControlPanelDshActionQueueItem[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  primaryAction: (item: ControlPanelDshActionQueueItem) => void;
  secondaryAction: (item: ControlPanelDshActionQueueItem) => void;
  evidenceAction: (item: ControlPanelDshActionQueueItem) => void;
  emptyLabel?: string;
};

export function ControlPanelDshActionQueue({
  title,
  purpose,
  items,
  selectedId,
  onSelect,
  primaryAction,
  secondaryAction,
  evidenceAction,
  emptyLabel = 'لا توجد عناصر حالياً',
}: ControlPanelDshActionQueueProps) {
  return (
    <div className={styles.liveOrdersScreen}>
      <div className={styles.liveOrdersHeaderRow}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <h2 className={styles.liveOrdersTitle}>{title}</h2>
          <p style={{ fontSize: '12px', color: '#64748B', fontWeight: 600 }}>{purpose}</p>
        </div>
        <button className={styles.liveOrdersFilterButton} onClick={() => window.location.reload()}>تحديث</button>
      </div>

      <div className={styles.liveOrdersCardsStack}>
        {!items.length ? (
          <div style={{ padding: '40px', textAlign: 'center', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.05)' }}>
            <Text tone="muted">{emptyLabel}</Text>
          </div>
        ) : (
          items.map((item) => {
            const isSelected = item.id === selectedId;
            const statusTone = item.tone || 'brand';
            const statusClassName = statusTone === 'best' ? styles.liveOrdersStatusBest :
                                   statusTone === 'warning' ? styles.liveOrdersStatusWarning :
                                   statusTone === 'danger' ? styles.liveOrdersStatusDanger : styles.liveOrdersStatusBrand;

            const cardClassName = [
              styles.liveOrdersOrderCard,
              statusTone === 'danger' ? styles.liveOrdersOrderCardDanger : '',
              statusTone === 'warning' ? styles.liveOrdersOrderCardWarning : '',
              isSelected ? styles.intelligenceGlow : '',
            ].filter(Boolean).join(' ');

            return (
              <div key={item.id} className={cardClassName} onClick={() => onSelect(item.id)} style={{ cursor: 'pointer' }}>
                <div className={styles.liveOrdersOrderMeta}>
                  <div className={styles.liveOrdersOrderTopRow}>
                    <span className={styles.liveOrdersOrderId}>{item.id}</span>
                    <span className={`${styles.liveOrdersOrderStatus} ${statusClassName}`}>{item.status}</span>
                    <span className={styles.liveOrdersRingHint}>{item.ownerSurface}</span>
                  </div>
                  <div className={styles.liveOrdersDestination}>{item.title}</div>
                  <div className={styles.liveOrdersMetaText}>{item.blocker}</div>
                  <div className={styles.liveOrdersNoteText}>{item.evidence}</div>
                </div>

                <div className={styles.systemSuggestion} style={{ flex: 1 }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <Text role="bodyStrong" style={{ color: '#0A2F5C', fontSize: '13px' }}>توصية النظام</Text>
                      <span style={{ fontSize: '10px', fontWeight: 700, padding: '2px 6px', borderRadius: '99px', backgroundColor: '#DCFCE7', color: '#16A34A' }}>ثقة عالية</span>
                   </div>
                   <Text role="bodySm" tone="muted" style={{ fontSize: '11px' }}>جاهز للتنفيذ بناءً على مراجعة المعايير الآلية.</Text>
                   <div className={styles.liveOrdersActionGrid} style={{ marginTop: '8px' }}>
                      <button className={styles.liveOrdersActionPrimary} onClick={(e) => { e.stopPropagation(); primaryAction(item); }}>{item.primaryActionLabel}</button>
                      <button className={styles.liveOrdersActionSecondary} onClick={(e) => { e.stopPropagation(); secondaryAction(item); }}>{item.secondaryActionLabel}</button>
                   </div>
                </div>

                <div className={styles.liveOrdersOrderActions}>
                  <div className={styles.liveOrdersTimelineTitle}>المسار الإجرائي</div>
                  <div className={styles.liveOrdersTimelineList}>
                    <div>• بانتظار القرار</div>
                  </div>
                  <div className={styles.liveOrdersActionGrid} style={{ marginTop: 'auto' }}>
                    <button className={styles.liveOrdersActionSecondary} onClick={(e) => { e.stopPropagation(); evidenceAction(item); }}>{item.evidenceActionLabel}</button>
                    <button className={styles.liveOrdersActionSecondary} onClick={(e) => { e.stopPropagation(); onSelect(item.id); }}>{isSelected ? 'قيد المعاينة' : 'معاينة'}</button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export default ControlPanelDshActionQueue;
