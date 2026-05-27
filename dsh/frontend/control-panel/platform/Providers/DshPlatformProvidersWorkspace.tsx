'use client';

import React from 'react';
import { Box, Button, Surface, Text } from '@bthwani/ui-kit';
import { WebSectionCard } from '@bthwani/ui-kit/web';
import { PREVIEW_PROVIDER_RECORDS } from '../../../data/platform.preview-data';
import { useDemoPlatformState } from '../useDemoPlatformState';
import styles from '../../shared/control-panel-surface.module.css';

type ProviderRecord = (typeof PREVIEW_PROVIDER_RECORDS)[number];
type ProviderTone = 'brand' | 'warning' | 'danger' | 'default' | 'success';

type ProviderPreviewActionId =
  | 'masked-key-preview'
  | 'connectivity-preview'
  | 'traffic-shift-preview'
  | 'degradation-preview'
  | 'fallback-preview'
  | 'return-plan-preview';

const ACTION_LABELS: Record<ProviderPreviewActionId, string> = {
  'masked-key-preview': 'فحص المفتاح المقنّع',
  'connectivity-preview': 'فحص الاتصال الفوري',
  'traffic-shift-preview': 'تحويل الحركة الفعلي',
  'degradation-preview': 'تعطيل وتحويل تلقائي',
  'fallback-preview': 'تطبيق سياسة البديل',
  'return-plan-preview': 'تفعيل خطة الرجوع',
};

const ACTION_DESCRIPTIONS: Record<ProviderPreviewActionId, string> = {
  'masked-key-preview':
    'عرض نموذج مفتاح الربط المقنّع والمشفر للمزود الحالي.',
  'connectivity-preview':
    'إجراء فحص فوري وموثق للاتصال بالمزود والتحقق من الاستجابة.',
  'traffic-shift-preview':
    'تحويل الحركة التشغيلية الفعلية وتوجيهها للمزود المعتمد.',
  'degradation-preview':
    'تعطيل المزود الحالي قسريًا وتحويل الطلبات تلقائيًا إلى المزود البديل.',
  'fallback-preview':
    'تطبيق وضبط سياسة البديل النشطة (Fallback Policy) لهذا المزود.',
  'return-plan-preview':
    'استعادة خط الأساس للمزود (Rollback) واعتماد التراجع في سجل التدقيق.',
};

function resolveProviderTone(record: ProviderRecord): ProviderTone {
  if (record.status === 'active' && record.lastTestResult === 'pass') return 'success';
  if (record.status === 'pending-approval' || record.lastTestResult === 'not-run') return 'warning';
  if (record.status === 'inactive' || record.lastTestResult === 'fail') return 'danger';
  return 'default';
}

function resolveProviderStatusLabel(status: ProviderRecord['status']) {
  if (status === 'active') return 'نشط بالكامل (Active)';
  if (status === 'inactive') return 'غير نشط (Inactive)';
  if (status === 'test-only') return 'اختبار فقط (Test)';
  return 'بانتظار الاعتماد (Pending)';
}

function resolveEnvironmentLabel(environment: ProviderRecord['environment']) {
  if (environment === 'production') return 'بيئة التشغيل الفعلية (Production)';
  if (environment === 'sandbox') return 'بيئة المعاينة الآمنة (Sandbox)';
  return 'بيئة الاختبار (Test)';
}

function resolveLastTestLabel(result: ProviderRecord['lastTestResult']) {
  if (result === 'pass') return 'نجح آخر فحص للاتصال (Pass)';
  if (result === 'fail') return 'فشل آخر فحص للاتصال (Fail)';
  return 'لم يتم فحص الاتصال بعد';
}

function resolveActionImpact(
  action: ProviderPreviewActionId,
  record: ProviderRecord,
  statusLabel: string,
) {
  if (action === 'masked-key-preview') {
    return `فحص مفتاح الربط المشفر للمزود ${record.selectedProvider}.`;
  }

  if (action === 'connectivity-preview') {
    return `تحديث حالة فحص الاتصال للمزود ${record.selectedProvider}.`;
  }

  if (action === 'traffic-shift-preview') {
    return `تحويل الحركة التشغيلية بالكامل إلى المزود ${record.selectedProvider}.`;
  }

  if (action === 'degradation-preview') {
    return `تعطيل المزود وتفعيل التوجيه التلقائي إلى البديل: ${record.fallbackProvider ?? 'غير محدد'}.`;
  }

  if (action === 'fallback-preview') {
    return `تحديث سياسة البديل النشطة إلى: ${record.fallbackProvider ?? 'غير محدد'}.`;
  }

  return `تطبيق التراجع الفوري من الحالة ${statusLabel} إلى خط الأساس المعتمد.`;
}

export function DshPlatformProvidersWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();
  const [selectedProviderId, setSelectedProviderId] = React.useState<string>('maps');
  const [showConfirm, setShowConfirm] = React.useState<ProviderPreviewActionId | null>(null);

  const [providerStates, setProviderStates] = React.useState<Record<string, {
    statusLabel: string;
    tone: ProviderTone;
    lastTestLabel: string;
  }>>({});

  const selectedRecord = PREVIEW_PROVIDER_RECORDS.find((r) => r.id === selectedProviderId) || PREVIEW_PROVIDER_RECORDS[0];

  const currentRecordState = providerStates[selectedRecord.id] || {
    statusLabel: resolveProviderStatusLabel(selectedRecord.status),
    tone: resolveProviderTone(selectedRecord),
    lastTestLabel: resolveLastTestLabel(selectedRecord.lastTestResult),
  };

  const fallbackProvider = selectedRecord.fallbackProvider ?? 'غير محدد';
  const rollbackTarget = selectedRecord.rollbackTarget ?? 'baseline provider policy';

  const handleConfirm = (action: ProviderPreviewActionId) => {
    const previousStatus = currentRecordState.statusLabel;
    let nextStatus = currentRecordState.statusLabel;
    let nextTone = currentRecordState.tone;
    let nextLastTest = currentRecordState.lastTestLabel;

    if (action === 'connectivity-preview') {
      nextLastTest = 'الآن — نجح فحص الاتصال الفعلي';
      nextTone = 'success';
    }

    if (action === 'traffic-shift-preview') {
      nextStatus = 'نشط (تم تحويل الحركة)';
      nextTone = 'success';
    }

    if (action === 'degradation-preview') {
      nextStatus = 'معطل وموجه للبديل';
      nextTone = 'danger';
    }

    if (action === 'fallback-preview') {
      nextStatus = `البديل المعتمد: ${fallbackProvider}`;
      nextTone = 'warning';
    }

    if (action === 'return-plan-preview') {
      nextStatus = `تم التراجع إلى: ${rollbackTarget}`;
      nextTone = 'warning';
    }

    setProviderStates((prev) => ({
      ...prev,
      [selectedRecord.id]: {
        statusLabel: nextStatus,
        tone: nextTone,
        lastTestLabel: nextLastTest,
      },
    }));

    setShowConfirm(null);

    addAuditEvent({
      action: `إدارة وتوجيه مزود ${selectedRecord.label}: ${ACTION_LABELS[action]}`,
      operator: 'Ahmed.Sharif',
      status: nextTone === 'danger' ? 'warning' : 'success',
      oldValue: previousStatus,
      newValue: nextStatus,
      reason: 'تحديث حالة المزود التشغيلية بطلب من المسؤول المعتمد',
      scope: selectedRecord.environment,
      impact: resolveActionImpact(action, selectedRecord, previousStatus),
      rollbackAvailable: true,
    });
  };

  return (
    <Box gap={4}>
      <WebSectionCard
        title="المزودون الأساسيون للبنية التحتية"
        description="ضبط وإدارة سياسات مزودي الخدمات اللوجستية، فحص الاتصال الفوري، وإدارة البدائل وخطط التراجع السريع."
      >
        <div className={styles.surfaceSplitGrid}>
          {/* Left Column: Providers list */}
          <div className={styles.surfaceListColumn}>
            {PREVIEW_PROVIDER_RECORDS.map((record) => {
              const rState = providerStates[record.id] || {
                statusLabel: resolveProviderStatusLabel(record.status),
                tone: resolveProviderTone(record),
                lastTestLabel: resolveLastTestLabel(record.lastTestResult),
              };
              const isActive = record.id === selectedProviderId;

              return (
                <button
                  key={record.id}
                  type="button"
                  className={`${styles.surfaceInfoCard} ${styles.surfaceInfoCardButton} ${isActive ? styles.surfaceInfoCardActive : ''}`}
                  onClick={() => {
                    setSelectedProviderId(record.id);
                    setShowConfirm(null);
                  }}
                >
                  <div className={styles.surfaceInfoCardTextBlock}>
                    <div className={styles.surfaceInfoCardTitle}>{record.label}</div>
                    <div className={styles.surfaceInfoCardDescription}>
                      المزود: {record.selectedProvider} · البديل: {record.fallbackProvider || 'بدون'}
                    </div>
                  </div>
                  <div className={styles.surfaceMetaWrap}>
                    <Surface tone={rState.tone} padding={1} radiusToken="pill" border={false}>
                      <Text role="caption" tone={rState.tone === 'default' || rState.tone === 'warning' ? 'muted' : 'inverse'}>
                        {rState.statusLabel.split(' ')[0]}
                      </Text>
                    </Surface>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Inspector and control panel */}
          <aside className={styles.surfaceInspectorPanel}>
            <div className={styles.surfaceSectionHeader}>
              <h4 className={styles.surfaceSectionTitle}>{selectedRecord.label}</h4>
              <p className={styles.surfaceSectionSubtitle}>إدارة وتوجيه مزودي البنية التحتية</p>
            </div>

            <div className={styles.surfaceInspectorMeta}>
              <div className={styles.surfaceInspectorRow}>
                <strong>المزود الحالي</strong>
                <span>{selectedRecord.selectedProvider}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>المزود البديل</strong>
                <span>{fallbackProvider}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>الحالة التشغيلية</strong>
                <span style={{ fontWeight: 'bold' }}>{currentRecordState.statusLabel}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>البيئة التشغيلية</strong>
                <span>{resolveEnvironmentLabel(selectedRecord.environment)}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>حالة الاتصال</strong>
                <span>{currentRecordState.lastTestLabel}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>الأولوية</strong>
                <span>{selectedRecord.priority}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>المالك الرئيسي</strong>
                <span>{selectedRecord.owner}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>الفئة</strong>
                <span>{selectedRecord.category}</span>
              </div>
            </div>

            <Surface tone="default" border padding={3} radiusToken="md">
              <Box gap={1}>
                <Text role="caption" tone="muted">مفتاح الربط المشفر (Credentials)</Text>
                <Text role="bodySm" weight="bold">{selectedRecord.maskedCredential}</Text>
              </Box>
            </Surface>

            <Surface tone="default" border padding={3} radiusToken="md">
              <Box gap={1}>
                <Text role="caption" tone="muted">حدود التنفيذ والسيادة</Text>
                <Text role="bodySm">
                  أي تغيير لمفاتيح الربط أو سياسات التوجيه يتطلب تفويضاً مباشراً ويسجل في سجلات التدقيق السيادية للمنصة.
                </Text>
              </Box>
            </Surface>

            <Text role="bodySm" tone="muted" style={{ fontStyle: 'italic' }}>{selectedRecord.activationNote}</Text>

            {showConfirm ? (
              <Surface tone="warning" border padding={3} radiusToken="md">
                <Box gap={2}>
                  <Text role="titleSm">تأكيد الإجراء التشغيلي: {ACTION_LABELS[showConfirm]}</Text>
                  <Text role="bodySm">{ACTION_DESCRIPTIONS[showConfirm]}</Text>

                  {showConfirm === 'masked-key-preview' ? (
                    <Surface tone="default" border padding={2} radiusToken="md">
                      <Text role="bodySm" tone="muted">{selectedRecord.maskedCredential} (أمن الوصول موثق وسجل)</Text>
                    </Surface>
                  ) : null}

                  <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                    <Button variant="primary" onClick={() => handleConfirm(showConfirm)} disabled={showConfirm === null}>تأكيد وتطبيق التغيير</Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
                  </Box>
                </Box>
              </Surface>
            ) : (
              <Box gap={2}>
                <Text role="titleSm">أدوات التحكم والسيادة</Text>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <Button variant="secondary" onClick={() => setShowConfirm('masked-key-preview')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>فحص المفتاح</Button>
                  <Button variant="secondary" onClick={() => setShowConfirm('connectivity-preview')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>فحص الاتصال</Button>
                </Box>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <Button variant="primary" onClick={() => setShowConfirm('traffic-shift-preview')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تحويل الحركة</Button>
                  <Button variant="danger" onClick={() => setShowConfirm('degradation-preview')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تعطيل المزود</Button>
                </Box>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <Button variant="secondary" onClick={() => setShowConfirm('fallback-preview')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تغيير البديل</Button>
                  <Button variant="secondary" onClick={() => setShowConfirm('return-plan-preview')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>خطة الرجوع</Button>
                </Box>
              </Box>
            )}
          </aside>
        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformProvidersWorkspace;
