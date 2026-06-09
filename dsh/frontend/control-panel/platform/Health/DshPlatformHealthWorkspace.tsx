'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';
import styles from '../../shared/control-panel-surface.module.css';

import { PREVIEW_SYSTEM_WARNINGS, type SystemWarning } from '../../../data/platform.preview-data';

export function DshPlatformHealthWorkspace({ activeFilter }: { activeFilter: string }) {
  const { addAuditEvent } = useDemoPlatformState();
  const [dismissedWarnings, setDismissedWarnings] = React.useState<Set<string>>(new Set());
  const [selectedWarningId, setSelectedWarningId] = React.useState<string | null>('store-pickup');
  const [lastHealthCheck, setLastHealthCheck] = React.useState<string>('لم يتم الفحص بعد');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  const activeWarnings = PREVIEW_SYSTEM_WARNINGS.filter((w) => {
    if (dismissedWarnings.has(w.id)) return false;
    if (activeFilter === 'all') return true;
    return w.severity === activeFilter;
  });

  React.useEffect(() => {
    if (activeWarnings.length > 0) {
      if (!selectedWarningId || !activeWarnings.some((w) => w.id === selectedWarningId)) {
        setSelectedWarningId(activeWarnings[0].id);
      }
    } else {
      setSelectedWarningId(null);
    }
  }, [dismissedWarnings, activeWarnings, selectedWarningId]);

  const selectedWarning = PREVIEW_SYSTEM_WARNINGS.find((w) => w.id === selectedWarningId) || null;

  const handleHealthCheck = (checkType: string) => {
    const now = 'الآن';
    setLastHealthCheck(now);

    addAuditEvent({
      action: `محاكاة فحص صحة المنصة: ${checkType}`,
      operator: 'Ahmed.Sharif',
      status: 'success',
      oldValue: lastHealthCheck,
      newValue: 'نتيجة الفحص: سليم ومؤمن (معاينة)',
      reason: 'محاكاة فحص دوري للتحقق من سلامة البنية التحتية المعروضة',
      scope: 'Global',
      impact: 'تحديث وتوثيق مؤشرات الصحة والأداء في المعاينة',
      rollbackAvailable: false,
    });
    setShowConfirm(null);
  };

  const handleDismissWarning = (warning: SystemWarning) => {
    setDismissedWarnings((prev) => new Set([...prev, warning.id]));
    addAuditEvent({
      action: `إقرار تحذير: ${warning.actionLogName}`,
      operator: 'Ahmed.Sharif',
      status: 'warning',
      oldValue: 'تحذير نشط',
      newValue: 'إقرار وإغلاق التحذير في السجل المعتمد',
      reason: warning.reason,
      scope: warning.scope,
      impact: warning.impact,
      rollbackAvailable: false,
    });
  };

  return (
    <Box gap={4}>
      <WebSectionCard
        title="مراقبة التحذيرات والصحة العامة"
        description="فحص قنوات الاتصال النشطة بالخدمات والمزودين وإقرار التحذيرات والعيوب المسجلة."
      >
        <div className={styles.surfaceSplitGrid}>
          {/* Left Column: Active Warnings List */}
          <div className={styles.surfaceListColumn}>
            {/* KPI Cards Strip - moved inside left column */}
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', marginBottom: 12 }}>
              <Box style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
                <WebSignalCard
                  title="الخدمات العليا"
                  value="2 نشطة"
                  description="DSH وWLT تعمل بشكل طبيعي."
                  tone="neutral"
                />
              </Box>
              <Box style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
                <WebSignalCard
                  title="المزودون"
                  value="يحتاج اختبار"
                  description="Telr ينتظر الاختبار."
                  tone="neutral"
                />
              </Box>
              <Box style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
                <WebSignalCard
                  title="آخر تحديث"
                  value={lastHealthCheck === 'لم يتم الفحص بعد' ? 'قبل ساعتين' : lastHealthCheck}
                  description="تحديث رصيد المحفظة."
                  tone="neutral"
                />
              </Box>
              <Box style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
                <WebSignalCard
                  title="آخر Rollback"
                  value="لا يوجد"
                  description="لم يتراجع أي إعداد."
                  tone="neutral"
                />
              </Box>
            </Box>

            <Box gap={2}>
              <Text role="titleMd">التحذيرات النشطة ({activeWarnings.length})</Text>
              {activeWarnings.length === 0 ? (
                <Surface tone="success" border padding={3} radiusToken="xl">
                  <Text role="bodySm" tone="success" align="center">
                    جميع التحذيرات تمت معالجتها وإقرارها. لا توجد تحذيرات نشطة حالياً.
                  </Text>
                </Surface>
              ) : (
                activeWarnings.map((warning) => {
                  const isActive = warning.id === selectedWarningId;
                  return (
                    <button
                      key={warning.id}
                      type="button"
                      className={`${styles.surfaceInfoCard} ${styles.surfaceInfoCardButton} ${isActive ? styles.surfaceInfoCardActive : ''}`}
                      onClick={() => {
                        setSelectedWarningId(warning.id);
                        setShowConfirm(null);
                      }}
                    >
                      <div className={styles.surfaceInfoCardTextBlock}>
                        <div className={styles.surfaceHeaderTextRow} style={{ gap: 6 }}>
                          <span
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              backgroundColor: warning.severity === 'danger' ? 'var(--bthwani-danger)' : 'var(--bthwani-warning)',
                            }}
                          />
                          <div className={styles.surfaceInfoCardTitle}>{warning.title}</div>
                        </div>
                        <div className={styles.surfaceInfoCardDescription} style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                          {warning.description}
                        </div>
                      </div>
                      <div className={styles.surfaceMetaWrap}>
                        <span className={styles.surfaceMetaChip}>{warning.targetWorkspace}</span>
                      </div>
                    </button>
                  );
                })
              )}
            </Box>
          </div>

          {/* Right Column: Diagnostic controls and Warning inspector */}
          <aside className={styles.surfaceInspectorPanel}>
            {selectedWarning ? (
              <Box gap={3}>
                <div className={styles.surfaceSectionHeader}>
                  <h4 className={styles.surfaceSectionTitle}>{selectedWarning.title}</h4>
                  <p className={styles.surfaceSectionSubtitle}>تشخيص المشكلة وتوثيق الإقرار</p>
                </div>

                <div className={styles.surfaceInspectorMeta}>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>نوع التحذير</strong>
                    <span style={{ color: selectedWarning.severity === 'danger' ? 'var(--bthwani-danger)' : 'var(--bthwani-warning)', fontWeight: 'bold' }}>
                      {selectedWarning.severity === 'danger' ? 'حرج' : 'تنبيه'}
                    </span>
                  </div>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>مكان التعديل</strong>
                    <span>{selectedWarning.targetWorkspace}</span>
                  </div>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>نطاق الأثر</strong>
                    <span>{selectedWarning.scope}</span>
                  </div>
                  <div className={styles.surfaceInspectorRow}>
                    <strong>سبب التحذير</strong>
                    <span>{selectedWarning.description}</span>
                  </div>
                </div>

                <Button
                  variant="secondary"
                  onClick={() => handleDismissWarning(selectedWarning)}
                  disabled={showConfirm !== null}
                  style={{ width: '100%' }}
                >
                  إقرار وإغلاق التحذير
                </Button>
              </Box>
            ) : (
              <Box gap={3}>
                <div className={styles.surfaceSectionHeader}>
                  <h4 className={styles.surfaceSectionTitle}>لوحة الفحوصات التشغيلية</h4>
                  <p className={styles.surfaceSectionSubtitle}>لا توجد تحذيرات نشطة محددة حالياً</p>
                </div>
                <Surface tone="success" border padding={3} radiusToken="md">
                  <Text role="bodySm" align="center" tone="success">النظام سليم ومؤمن بالكامل.</Text>
                </Surface>
              </Box>
            )}

            <hr style={{ border: 0, borderTop: '1px solid var(--bthwani-control-panel-border)', margin: '8px 0' }} />

            {showConfirm ? (
              <Surface tone="warning" border padding={3} radiusToken="md">
                <Box gap={2}>
                  <Text role="titleSm">تأكيد محاكاة فحص الصحة: {showConfirm}</Text>
                  <Text role="bodySm">سيتم محاكاة التحقق من مؤشرات الاتصال والجاهزية لخدمات ومزودي المنصة (UI preview).</Text>
                  <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                    <Box style={{ flexGrow: 1 }}><Button variant="primary" onClick={() => handleHealthCheck(showConfirm)} disabled={showConfirm === null} style={{ width: '100%' }}>تأكيد معاينة الفحص</Button></Box>
                    <Box style={{ flexGrow: 1 }}><Button variant="secondary" onClick={() => setShowConfirm(null)} style={{ width: '100%' }}>إلغاء</Button></Box>
                  </Box>
                </Box>
              </Surface>
            ) : (
              <Box gap={2}>
                <Text role="titleSm">أدوات محاكاة فحص الصحة</Text>
                <Button variant="secondary" onClick={() => setShowConfirm('محاكاة فحص مؤشرات الخدمات')} disabled={showConfirm !== null} style={{ width: '100%' }}>محاكاة فحص الخدمات</Button>
                <Button variant="secondary" onClick={() => setShowConfirm('محاكاة فحص مؤشرات المزودين')} disabled={showConfirm !== null} style={{ width: '100%' }}>محاكاة فحص المزودين</Button>
                <Button variant="primary" onClick={() => setShowConfirm('محاكاة تشغيل فحص الصحة المتكامل')} disabled={showConfirm !== null} style={{ width: '100%' }}>محاكاة تشغيل فحص الصحة المتكامل</Button>
              </Box>
            )}
          </aside>
        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformHealthWorkspace;
