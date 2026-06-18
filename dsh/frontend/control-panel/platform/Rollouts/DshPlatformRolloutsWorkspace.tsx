'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { usePlatformAuditState } from '../usePlatformAuditState';
import styles from '../../shared/control-panel-surface.module.css';

type RolloutLevel = 'service' | 'capability';

type RolloutRecord = {
  key: string;
  title: string;
  level: RolloutLevel;
  parentService?: string;
  scope: string;
  initialStage: string;
  stageOptions: readonly string[];
};

const PREVIEW_ROLLOUT_RECORDS: RolloutRecord[] = [];
import { FeatureFlagsRegistry } from '../../../shared/platform/feature-flags';

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

export function DshPlatformRolloutsWorkspace({ activeFilter }: { activeFilter: string }) {
  const { addAuditEvent } = usePlatformAuditState();
  const [selectedKey, setSelectedKey] = React.useState<string>('DSH:sanaa-pilot');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  React.useEffect(() => {
    const filtered = PREVIEW_ROLLOUT_RECORDS.filter((record) => {
      if (activeFilter === 'all') return true;
      return record.level === activeFilter;
    });
    if (filtered.length > 0) {
      setSelectedKey(filtered[0].key);
    }
  }, [activeFilter]);

  const [rolloutStates, setRolloutStates] = React.useState<Record<string, {
    activeStage: string;
  }>>(() => {
    FeatureFlagsRegistry.initialize();
    return {
      'DSH:sanaa-pilot': {
        activeStage: FeatureFlagsRegistry.get('DSH:sanaa-pilot') ? 'تفعيل تجريبي (Pilot)' : 'موقوف في المعاينة (Kill preview)'
      },
      'DSH:capability:store-pickup': {
        activeStage: FeatureFlagsRegistry.get('DSH:capability:store-pickup') ? 'فتح للجميع' : 'داخلي فقط (Internal Only)'
      },
      'DSH:capability:awnak': {
        activeStage: FeatureFlagsRegistry.get('DSH:capability:awnak') ? 'نشط (Active)' : 'موقوف في المعاينة (Kill preview)'
      },
    };
  });

  const selectedRecord = PREVIEW_ROLLOUT_RECORDS.find((r) => r.key === selectedKey) || PREVIEW_ROLLOUT_RECORDS[0];
  if (!selectedRecord) return null;
  const currentState = rolloutStates[selectedRecord.key] || { activeStage: selectedRecord.initialStage };

  const isKillSwitch = currentState.activeStage.includes('Kill') || currentState.activeStage.includes('موقوف');

  const handleConfirm = (action: string) => {
    let newStage = currentState.activeStage;
    if (action === 'إيقاف فوري في المعاينة (Kill preview)') {
      newStage = 'موقوف في المعاينة (Kill preview)';
    } else if (selectedRecord.stageOptions.includes(action)) {
      newStage = action;
    } else if (action === 'استعادة الحالة في المعاينة (Rollback preview)') {
      newStage = selectedRecord.initialStage;
    }

    setRolloutStates((prev) => ({
      ...prev,
      [selectedRecord.key]: { activeStage: newStage },
    }));

    // Determine flag state based on newStage name
    const isKilled = newStage.includes('Kill') || newStage.includes('موقوف') || newStage.includes('إيقاف') || newStage.includes('داخلي فقط');
    const enabled = !isKilled;

    // Propagate feature flag change to the active app runtime
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('dsh-flag-override', {
          detail: {
            key: selectedRecord.key,
            enabled,
          },
        })
      );
    }

    addAuditEvent({
      action: `إطلاق تدريجي محاكٍ (${selectedRecord.key}): ${action}`,
      operator: 'Ahmed.Sharif',
      status: action.includes('Kill') || action.includes('موقوف') || action.includes('إيقاف') ? 'danger' : 'success',
      oldValue: currentState.activeStage,
      newValue: newStage,
      reason: 'محاكاة تعديل مرحلة الإطلاق وتأكيد استقرار النظام',
      scope: selectedRecord.scope,
      impact: `تغيير مرحلة المعاينة للإطلاق إلى ${newStage}`,
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
              {PREVIEW_ROLLOUT_RECORDS.filter((record) => {
                if (activeFilter === 'all') return true;
                return record.level === activeFilter;
              }).map((record) => {
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
                <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{selectedRecord.key}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>المستوى</strong>
                <span>{selectedRecord.level === 'service' ? 'خدمة عليا' : 'قدرة فرعية'}</span>
              </div>
              {selectedRecord.parentService && (
                <div className={styles.surfaceInspectorRow}>
                  <strong>الخدمة الأب</strong>
                  <span dir="ltr" style={{ unicodeBidi: 'isolate' }}>{selectedRecord.parentService}</span>
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
                  <Text role="titleSm">تأكيد محاكاة المعاينة: {showConfirm}</Text>
                  <Text role="bodySm">هل أنت متأكد من تطبيق هذه المحاكاة لمرحلة الإطلاق؟ التغيير لمعاينة أثر التوجيه فقط (UI preview).</Text>
                  <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                    <Box style={{ flexGrow: 1 }}><Button variant="primary" onClick={() => handleConfirm(showConfirm)} disabled={showConfirm === null} style={{ width: '100%' }}>تأكيد معاينة التغيير</Button></Box>
                    <Box style={{ flexGrow: 1 }}><Button variant="secondary" onClick={() => setShowConfirm(null)} style={{ width: '100%' }}>إلغاء</Button></Box>
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
                  <Button variant="primary" onClick={() => setShowConfirm('تأكيد معاينة الإطلاق')} disabled={showConfirm !== null} style={{ width: '100%' }}>
                    تأكيد معاينة الإطلاق
                  </Button>
                  <Box layoutDirection="row" gap={2}>
                    <Button variant="danger" onClick={() => setShowConfirm('إيقاف فوري في المعاينة (Kill preview)')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>
                      إيقاف فوري (Kill)
                    </Button>
                    <Button variant="secondary" onClick={() => setShowConfirm('استعادة الحالة في المعاينة (Rollback preview)')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>
                      استعادة الحالة
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
