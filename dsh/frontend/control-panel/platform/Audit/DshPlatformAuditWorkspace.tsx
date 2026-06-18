'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { usePlatformAuditState } from '../usePlatformAuditState';
import styles from '../../shared/control-panel-surface.module.css';

export function DshPlatformAuditWorkspace({ activeFilter }: { activeFilter: string }) {
  const { auditEvents, rollbackEvent } = usePlatformAuditState();
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);

  const filteredEvents = auditEvents.filter((event) => {
    if (activeFilter === 'all') return true;
    return event.status === activeFilter;
  });

  React.useEffect(() => {
    if (filteredEvents.length > 0) {
      if (!selectedEventId || !filteredEvents.some((e) => e.id === selectedEventId)) {
        setSelectedEventId(filteredEvents[0].id);
      }
    } else {
      setSelectedEventId(null);
    }
  }, [filteredEvents, selectedEventId]);

  const selectedEvent = auditEvents.find((e) => e.id === selectedEventId) || null;

  return (
    <Box gap={4}>
      <WebSectionCard
        title="سجل التغييرات والتراجع (Audit & Rollback)"
        description="تتبع من قام بالتغييرات، ومتى، والسبب، مع توفر خيار التراجع (Rollback) الفوري للإعدادات السابقة."
      >
        <div className={styles.surfaceSplitGrid}>
          {/* Left Column: Timeline List */}
          <div className={styles.surfaceListColumn}>
            <Box gap={2}>
              <Text role="titleMd">الجدول الزمني للأحداث ({filteredEvents.length})</Text>
              {filteredEvents.length === 0 ? (
                <Surface tone="default" border padding={4} radiusToken="xl">
                  <Text role="bodySm" tone="muted" align="center">لا توجد أحداث تدقيق حتى الآن.</Text>
                </Surface>
              ) : (
                filteredEvents.map((event) => {
                  const isActive = event.id === selectedEventId;
                  return (
                    <button
                      key={event.id}
                      type="button"
                      className={`${styles.surfaceInfoCard} ${styles.surfaceInfoCardButton} ${isActive ? styles.surfaceInfoCardActive : ''}`}
                      onClick={() => setSelectedEventId(event.id)}
                    >
                      <div className={styles.surfaceInfoCardTextBlock}>
                        <div className={styles.surfaceInfoCardTitle} style={{ textAlign: 'right' }}>{event.action}</div>
                        <div className={styles.surfaceInfoCardDescription}>
                          {event.operator} · {event.timestamp}
                        </div>
                      </div>
                      <div className={styles.surfaceMetaWrap}>
                        <Surface
                          tone={event.status === 'success' ? 'success' : event.status === 'warning' ? 'warning' : 'danger'}
                          padding={1}
                          radiusToken="pill"
                          border={false}
                        >
                          <Text role="caption" tone={event.status === 'warning' ? 'muted' : 'inverse'}>
                            {event.status === 'success'
                              ? 'نشط'
                              : event.status === 'warning'
                              ? 'معتمد'
                              : 'تراجع'}
                          </Text>
                        </Surface>
                      </div>
                    </button>
                  );
                })
              )}
            </Box>
          </div>

          {/* Right Column: Event detail inspector */}
          <aside className={styles.surfaceInspectorPanel}>
            {selectedEvent ? (
              <Box gap={3}>
                <div className={styles.surfaceSectionHeader}>
                  <h4 className={styles.surfaceSectionTitle}>تفاصيل حدث التدقيق</h4>
                  <p className={styles.surfaceSectionSubtitle}>{selectedEvent.timestamp}</p>
                </div>

                <div className={styles.surfaceInspectorMeta}>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>العملية</strong>
                    <span>{selectedEvent.action}</span>
                  </div>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>المسؤول</strong>
                    <span>{selectedEvent.operator}</span>
                  </div>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>نطاق الأثر</strong>
                    <span>{selectedEvent.scope}</span>
                  </div>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>الأثر المتوقع</strong>
                    <span>{selectedEvent.impact}</span>
                  </div>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>الحالة</strong>
                    <span style={{ fontWeight: 'bold', color: selectedEvent.status === 'success' ? 'var(--bthwani-success)' : selectedEvent.status === 'warning' ? 'var(--bthwani-warning)' : 'var(--bthwani-danger)' }}>
                      {selectedEvent.status === 'success' ? 'نشط ومطبّق' : selectedEvent.status === 'warning' ? 'معتمد وموثق' : 'تم التراجع / الطوارئ'}
                    </span>
                  </div>
                </div>

                <Surface tone="default" border padding={3} radiusToken="md">
                  <Box gap={2}>
                    <Box gap={1}>
                      <Text role="caption" tone="muted">القيمة السابقة:</Text>
                      <Text role="bodySm" tone="danger" style={{ textDecorationLine: 'line-through' }}>{selectedEvent.oldValue}</Text>
                    </Box>
                    <Box gap={1}>
                      <Text role="caption" tone="muted">القيمة الجديدة:</Text>
                      <Text role="bodySm" tone="success" weight="bold" style={{ }}>{selectedEvent.newValue}</Text>
                    </Box>
                    <Box gap={1}>
                      <Text role="caption" tone="muted">السبب للقرار:</Text>
                      <Text role="bodySm">{selectedEvent.reason}</Text>
                    </Box>
                  </Box>
                </Surface>

                <Button
                  variant="danger"
                  disabled={!selectedEvent.rollbackAvailable}
                  onClick={() => rollbackEvent(selectedEvent.id)}
                  style={{ width: '100%' }}
                >
                  تراجع محاكٍ في المعاينة (Rollback preview)
                </Button>
              </Box>
            ) : (
              <Box gap={3}>
                <div className={styles.surfaceSectionHeader}>
                  <h4 className={styles.surfaceSectionTitle}>معاينة تفاصيل التغيير</h4>
                  <p className={styles.surfaceSectionSubtitle}>اختر حدثاً من الجدول الزمني لمراجعته</p>
                </div>
                <Surface tone="default" border padding={3} radiusToken="md">
                  <Text role="bodySm" tone="muted" align="center">لا يوجد حدث محدد حالياً.</Text>
                </Surface>
              </Box>
            )}
          </aside>
        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformAuditWorkspace;
