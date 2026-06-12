'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebSignalCard } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';
import { PREVIEW_APPEARANCE_ITEMS, type AppearanceCustomization } from '../../../data/legacy-preview/platform.preview-data';
import styles from '../../shared/control-panel-surface.module.css';

export function DshPlatformAppearanceWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();
  const [selectedId, setSelectedId] = React.useState<string>('client-header');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  const [activeTones, setActiveTones] = React.useState<Record<string, 'brand' | 'warning'>>({
    'client-header': 'brand',
    'partner-header': 'brand',
  });

  const selectedItem = PREVIEW_APPEARANCE_ITEMS.find((item) => item.id === selectedId) || PREVIEW_APPEARANCE_ITEMS[0];
  const activeTone = activeTones[selectedItem.id] || 'brand';

  const handleConfirm = (action: string) => {
    if (action === 'تفعيل المعاينة الحية') {
      setActiveTones((prev) => ({
        ...prev,
        [selectedItem.id]: selectedItem.proposedTone,
      }));
      addAuditEvent({
        action: `تحديث الهوية البصرية: ${selectedItem.component}`,
        operator: 'Ahmed.Sharif',
        status: 'success',
        oldValue: 'Brand Primary',
        newValue: 'Brand Accent',
        reason: 'تعديل وتطبيق اللون المعتمد للمظهر وتحديث الهوية',
        scope: selectedItem.app,
        impact: `تحديث لون المكون إلى البرتقالي لتعزيز تباين العمليات`,
        rollbackAvailable: true,
      });
    } else {
      addAuditEvent({
        action: `إجراء المظهر (${selectedItem.component}): ${action}`,
        operator: 'Ahmed.Sharif',
        status: 'warning',
        oldValue: activeTone,
        newValue: selectedItem.proposedTone,
        reason: 'حفظ وتأكيد التعديل الحالي للهوية البصرية',
        scope: selectedItem.app,
        impact: 'بانتظار المزامنة التلقائية مع قنوات التوزيع',
        rollbackAvailable: true,
      });
    }
    setShowConfirm(null);
  };

  return (
    <Box gap={4}>
      <WebSectionCard
        title="تخصيص هوية التطبيقات"
        description="التحكم بألوان وهوية كل تطبيق من النظام المركزي. لا يتم استخدام هذه الواجهة للحملات التسويقية."
      >
        <div className={styles.surfaceSplitGrid}>
          {/* Left Column: UI Components list & KPIs */}
          <div className={styles.surfaceListColumn}>
            {/* KPI Cards Strip - moved inside left column */}
            <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', marginBottom: 12 }}>
              <Box style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
                <WebSignalCard
                  title="نظام الألوان المركزي"
                  value="مفعل ومقفل"
                  description="مرتبط بالـ Tokens."
                  tone="brand"
                />
              </Box>
              <Box style={{ flexGrow: 1, flexBasis: 140, minWidth: 0 }}>
                <WebSignalCard
                  title="فحص التباين"
                  value="ضمن المعاينة"
                  description="لا تعارض بصري بارز."
                  tone="neutral"
                />
              </Box>
            </Box>
            {PREVIEW_APPEARANCE_ITEMS.map((item) => {
              const currentTone = activeTones[item.id] || 'brand';
              const isActive = item.id === selectedId;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`${styles.surfaceInfoCard} ${styles.surfaceInfoCardButton} ${isActive ? styles.surfaceInfoCardActive : ''}`}
                  onClick={() => {
                    setSelectedId(item.id);
                    setShowConfirm(null);
                  }}
                >
                  <div className={styles.surfaceInfoCardTextBlock}>
                    <div className={styles.surfaceInfoCardTitle}>{item.component}</div>
                    <div className={styles.surfaceInfoCardDescription}>
                      التطبيق: {item.app}
                    </div>
                  </div>
                  <div className={styles.surfaceMetaWrap}>
                    <span className={styles.surfaceMetaChip}>
                      {currentTone === 'brand' ? 'Primary' : 'Accent'}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Right Column: Previews and controls */}
          <aside className={styles.surfaceInspectorPanel}>
            <div className={styles.surfaceSectionHeader}>
              <h4 className={styles.surfaceSectionTitle}>{selectedItem.component}</h4>
              <p className={styles.surfaceSectionSubtitle}>{selectedItem.app}</p>
            </div>

            <div className={styles.surfaceInspectorMeta}>
              <div className={styles.surfaceInspectorRow}>
                <strong>معرف المكون</strong>
                <span>{selectedItem.id}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>المالك الفني</strong>
                <span>{selectedItem.owner}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>نسبة التباين</strong>
                <span>Contrast Ratio: {selectedItem.contrastRatio}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>شرح المكون</strong>
                <span>{selectedItem.description}</span>
              </div>
            </div>

            <Box gap={2}>
              <Text role="titleSm">معاينة وتحديث الألوان</Text>
              <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
                <Box gap={1} style={{ flexGrow: 1, minWidth: 100 }}>
                  <Text role="caption" tone="muted">اللون النشط</Text>
                  <Surface tone={activeTone} padding={2} radiusToken="md">
                    <Text role="caption" tone="inverse" align="center">
                      {activeTone === 'brand' ? 'Primary' : 'Accent'}
                    </Text>
                  </Surface>
                </Box>
                <Box gap={1} style={{ flexGrow: 1, minWidth: 100 }}>
                  <Text role="caption" tone="muted">اللون المقترح</Text>
                  <Surface tone={selectedItem.proposedTone} padding={2} radiusToken="md">
                    <Text role="caption" tone="inverse" align="center">
                      {selectedItem.proposedTone === 'brand' ? 'Primary' : 'Accent'}
                    </Text>
                  </Surface>
                </Box>
              </Box>
            </Box>

            {showConfirm ? (
              <Surface tone="warning" border padding={3} radiusToken="md" style={{ marginTop: 24 }}>
                <Box gap={2}>
                  <Text role="titleSm">تأكيد تعديل المظهر: {showConfirm}</Text>
                  <Text role="bodySm">هل أنت متأكد من حفظ وتطبيق هذا التعديل البصري في النظام المركزي؟</Text>
                  <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                    <Button variant="primary" onClick={() => handleConfirm(showConfirm)} disabled={showConfirm === null}>تأكيد وحفظ التغيير</Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
                  </Box>
                </Box>
              </Surface>
            ) : (
              <Box gap={2}>
                <Text role="titleSm">أدوات التحكم البصري</Text>
                <Box layoutDirection="row" gap={2}>
                  <Button variant="secondary" onClick={() => setShowConfirm('تفعيل المعاينة الحية')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تفعيل المعاينة</Button>
                  <Button variant="primary" onClick={() => setShowConfirm('طلب اعتماد التعديل')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>طلب الاعتماد</Button>
                </Box>
                <Box layoutDirection="row" gap={2}>
                  <Button variant="secondary" onClick={() => setShowConfirm('تأكيد الطلب المجدول')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تأكيد المجدول</Button>
                  <Button variant="danger" onClick={() => setShowConfirm('استعادة الهوية الأساسية')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>استعادة الهوية</Button>
                </Box>
              </Box>
            )}
          </aside>
        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformAppearanceWorkspace;
