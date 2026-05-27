'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';
import styles from '../../shared/control-panel-surface.module.css';

import { PREVIEW_ROLLOUT_RECORDS, type RolloutLevel, type RolloutRecord } from '../../../data/platform.preview-data';

function RolloutLevelBadge({ level }: { level: RolloutLevel }) {
  return (
    <Surface
      tone={level === 'service' ? 'brand' : 'warning'}
      padding={1}
      radiusToken="pill"
      border={false}
    >
      <Text role="caption" tone="inverse" weight="bold">
        {level === 'service' ? 'رول-أوت خدمة عليا' : 'رول-أوت قدرة DSH'}
      </Text>
    </Surface>
  );
}

export function DshPlatformRolloutsWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();
  const [selectedKey, setSelectedKey] = React.useState<string>('DSH:sanaa-pilot');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  const [rolloutStates, setRolloutStates] = React.useState<Record<string, {
    activeStage: string;
  }>>({
    'DSH:sanaa-pilot': { activeStage: 'تفعيل تجريبي (Pilot)' },
    'DSH:capability:store-pickup': { activeStage: 'داخلي فقط (Internal Only)' },
    'DSH:capability:awnak': { activeStage: 'نشط (Active)' },
  });

  const selectedRecord = PREVIEW_ROLLOUT_RECORDS.find((r) => r.key === selectedKey) || PREVIEW_ROLLOUT_RECORDS[0];
  const currentState = rolloutStates[selectedRecord.key] || { activeStage: selectedRecord.initialStage };

  const isKillSwitch = currentState.activeStage.includes('Kill') || currentState.activeStage.includes('موقوف');

  const handleConfirm = (action: string) => {
    let newStage = currentState.activeStage;
    if (action === 'إيقاف فوري (Kill Switch)') {
      newStage = 'موقوف (Kill Switch)';
    } else if (selectedRecord.stageOptions.includes(action)) {
      newStage = action;
    } else if (action === 'استعادة الحالة (Rollback)') {
      newStage = selectedRecord.initialStage;
    }

    setRolloutStates((prev) => ({
      ...prev,
      [selectedRecord.key]: { activeStage: newStage },
    }));

    addAuditEvent({
      action: `إطلاق تدريجي (${selectedRecord.key}): ${action}`,
      operator: 'Ahmed.Sharif',
      status: action.includes('Kill') || action.includes('موقوف') || action.includes('إيقاف') ? 'danger' : 'success',
      oldValue: currentState.activeStage,
      newValue: newStage,
      reason: 'تعديل مرحلة الإطلاق وتأكيد استقرار النظام التشغيلي',
      scope: selectedRecord.scope,
      impact: `تغيير مرحلة الإطلاق إلى ${newStage}`,
      rollbackAvailable: true,
    });
    setShowConfirm(null);
  };

  return (
    <Box gap={4}>
      <WebSectionCard
        title="الإطلاق التدريجي (Rollouts)"
        description="رول-أوت الخدمات العليا يؤثر على الخدمة كاملاً في النطاق المحدد. رول-أوت القدرات يُفعّل ميزة داخل خدمة قائمة تدريجياً."
      >
        <div className={styles.surfaceSplitGrid}>
          {/* Left Column: Rollouts List */}
          <div className={styles.surfaceListColumn}>
            <Box gap={2}>
              {PREVIEW_ROLLOUT_RECORDS.map((record) => {
                const rState = rolloutStates[record.key] || { activeStage: record.initialStage };
                const isActive = record.key === selectedKey;
                const rIsKill = rState.activeStage.includes('Kill') || rState.activeStage.includes('موقوف');

                return (
                  <button
                    key={record.key}
                    type="button"
                    className={`${styles.surfaceInfoCard} ${styles.surfaceInfoCardButton} ${isActive ? styles.surfaceInfoCardActive : ''}`}
                    onClick={() => {
                      setSelectedKey(record.key);
                      setShowConfirm(null);
                    }}
                  >
                    <div className={styles.surfaceInfoCardTextBlock}>
                      <div className={styles.surfaceHeaderTextRow} style={{ gap: 6 }}>
                        <RolloutLevelBadge level={record.level} />
                        <div className={styles.surfaceInfoCardTitle}>{record.title}</div>
                      </div>
                      <div className={styles.surfaceInfoCardDescription}>
                        النطاق: {record.scope} · المرحلة الحالية: {rState.activeStage}
                      </div>
                    </div>
                    <div className={styles.surfaceMetaWrap}>
                      <Surface tone={rIsKill ? 'danger' : 'brand'} padding={1} radiusToken="pill" border={false}>
                        <Text role="caption" tone="inverse">
                          {rState.activeStage.split(' ')[0]}
                        </Text>
                      </Surface>
                    </div>
                  </button>
                );
              })}
            </Box>
          </div>

          {/* Right Column: Inspector and controls */}
          <aside className={styles.surfaceInspectorPanel}>
            <div className={styles.surfaceSectionHeader}>
              <h4 className={styles.surfaceSectionTitle}>{selectedRecord.title}</h4>
              <p className={styles.surfaceSectionSubtitle}>أدوات الإطلاق والتحكم في المتغيرات</p>
            </div>

            <div className={styles.surfaceInspectorMeta}>
              <div className={styles.surfaceInspectorRow}>
                <strong>معرف الرول-أوت</strong>
                <span>{selectedRecord.key}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>المستوى</strong>
                <span>{selectedRecord.level === 'service' ? 'خدمة عليا' : 'قدرة فرعية'}</span>
              </div>
              {selectedRecord.parentService && (
                <div className={styles.surfaceInspectorRow}>
                  <strong>الخدمة الأب</strong>
                  <span>{selectedRecord.parentService}</span>
                </div>
              )}
              <div className={styles.surfaceInspectorRow}>
                <strong>النطاق الجغرافي</strong>
                <span>{selectedRecord.scope}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>المرحلة الحالية</strong>
                <span style={{ fontWeight: 'bold' }}>{currentState.activeStage}</span>
              </div>
            </div>

            {showConfirm ? (
              <Surface tone="warning" border padding={3} radiusToken="md">
                <Box gap={2}>
                  <Text role="titleSm">تأكيد الإجراء التشغيلي: {showConfirm}</Text>
                  <Text role="bodySm">هل أنت متأكد من تطبيق هذا التغيير على مرحلة الإطلاق للخدمة؟</Text>
                  <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                    <Button variant="primary" onClick={() => handleConfirm(showConfirm)} disabled={showConfirm === null}>تأكيد وتطبيق التغيير</Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
                  </Box>
                </Box>
              </Surface>
            ) : (
              <Box gap={3}>
                <Text role="titleSm">أدوات تعديل المرحلة</Text>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  {selectedRecord.stageOptions.map((opt) => (
                    <Button key={opt} variant="secondary" onClick={() => setShowConfirm(opt)} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>
                      {opt}
                    </Button>
                  ))}
                </Box>
                <Box gap={2}>
                  <Button variant="primary" onClick={() => setShowConfirm('تأكيد وإطلاق التغيير')} disabled={showConfirm !== null} style={{ width: '100%' }}>
                    تأكيد وإطلاق التغيير
                  </Button>
                  <Box layoutDirection="row" gap={2}>
                    <Button variant="danger" onClick={() => setShowConfirm('إيقاف فوري (Kill Switch)')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>
                      إيقاف فوري (Kill)
                    </Button>
                    <Button variant="secondary" onClick={() => setShowConfirm('استعادة الحالة (Rollback)')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>
                      استعادة الحالة (Rollback)
                    </Button>
                  </Box>
                </Box>
              </Box>
            )}
          </aside>
        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformRolloutsWorkspace;
