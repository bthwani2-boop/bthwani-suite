'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebControlPanelWorkspaceTabs } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';
import { PREVIEW_TOP_SERVICES, type PlatformTopService } from '../../../data/platform.preview-data';
import styles from '../../shared/control-panel-surface.module.css';

export function DshPlatformServicesWorkspace() {
  const { addAuditEvent } = useDemoPlatformState();
  const [activeFilter, setActiveFilter] = React.useState('all');
  const [selectedServiceCode, setSelectedServiceCode] = React.useState<string>('DSH');
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);

  // Maintain local states for live statuses
  const [serviceStates, setServiceStates] = React.useState<Record<string, {
    status: string;
    visibility: string;
    tone: 'brand' | 'warning' | 'danger' | 'success' | 'default';
    rollbackStatus: string;
    rollbackTone: 'brand' | 'warning' | 'danger' | 'success' | 'default';
  }>>({
    DSH: { status: 'مفعلة (Active)', visibility: 'ظاهر للعملاء', tone: 'success', rollbackStatus: 'مفعلة (Active)', rollbackTone: 'success' },
    WLT: { status: 'مفعلة (Active)', visibility: 'مخفي (API داخلي)', tone: 'warning', rollbackStatus: 'مفعلة (Active)', rollbackTone: 'warning' },
  });

  const filterTabs = [
    { id: 'all', label: 'الكل', badge: '9', active: activeFilter === 'all' },
    { id: 'active', label: 'مفعلة', badge: '2', active: activeFilter === 'active' },
    { id: 'planned', label: 'مقررة (لم تُضَف)', badge: '7', active: activeFilter === 'planned' },
  ];

  const filteredServices = activeFilter === 'all'
    ? PREVIEW_TOP_SERVICES
    : PREVIEW_TOP_SERVICES.filter((s) => s.filterGroup === activeFilter);

  const selectedService = PREVIEW_TOP_SERVICES.find((s) => s.code === selectedServiceCode) || PREVIEW_TOP_SERVICES[0];
  const serviceState = serviceStates[selectedService.code] || {
    status: selectedService.sovereignStatus,
    visibility: selectedService.customerVisibility,
    tone: selectedService.tone,
    rollbackStatus: selectedService.sovereignStatus,
    rollbackTone: selectedService.tone,
  };

  const isPlanned = selectedService.filterGroup === 'planned';

  const handleConfirm = (action: string) => {
    const prevStatus = serviceState.status;
    const prevVisibility = serviceState.visibility;
    let newStatus = serviceState.status;
    let newVisibility = serviceState.visibility;
    let newTone = serviceState.tone;

    if (action === 'تفعيل الخدمة') {
      newStatus = 'مفعلة (Active)';
      newTone = 'success';
    } else if (action === 'تعطيل الخدمة') {
      newStatus = 'متوقفة (Inactive)';
      newTone = 'danger';
    } else if (action === 'وضع الصيانة') {
      newStatus = 'صيانة (Maintenance)';
      newTone = 'warning';
    } else if (action === 'إظهار للعملاء') {
      newVisibility = 'ظاهر للعملاء';
    } else if (action === 'إخفاء عن العملاء') {
      newVisibility = 'مخفي عن العملاء';
    } else if (action === 'استعادة الحالة (Rollback)') {
      newStatus = serviceState.rollbackStatus;
      newTone = serviceState.rollbackTone;
    }

    setServiceStates((prev) => ({
      ...prev,
      [selectedService.code]: {
        status: newStatus,
        visibility: newVisibility,
        tone: newTone,
        rollbackStatus: action === 'استعادة الحالة (Rollback)' ? prevStatus : serviceState.rollbackStatus,
        rollbackTone: action === 'استعادة الحالة (Rollback)' ? prevStatus === 'متوقفة (Inactive)' ? 'danger' : prevStatus === 'صيانة (Maintenance)' ? 'warning' : 'success' : serviceState.rollbackTone,
      },
    }));

    setShowConfirm(null);

    addAuditEvent({
      action: `تحكم خدمة عليا (${selectedService.code}): ${action}`,
      operator: 'Ahmed.Sharif',
      status: action.includes('تعطيل') ? 'danger' : 'success',
      oldValue: `${prevStatus} / ${prevVisibility}`,
      newValue: `${newStatus} / ${newVisibility}`,
      reason: 'تحديث الحالة التشغيلية للمنصة بطلب من المسؤول',
      scope: selectedService.scope,
      impact: action === 'تعطيل الخدمة' ? selectedService.impactIfStopped : 'تحديث وتأكيد مسار تشغيل الخدمة',
      rollbackAvailable: true,
    });
  };

  return (
    <Box gap={4}>
      <WebSectionCard
        title="خدمات المنصة العليا"
        description="الخدمات السيادية العليا: DSH، KNZ، WLT، AMN، ARB، MRF، KWD، SND، ESF. القدرات الفرعية كعونك وشي إن تُدار عبر Vars وRollouts وليست خدمات عليا."
      >
        <div className={styles.surfaceSplitGrid}>
          {/* Left Column: Services list */}
          <div className={styles.surfaceListColumn}>
            <Box gap={2}>
              <Text role="titleMd">تصفية الخدمات</Text>
              <WebControlPanelWorkspaceTabs
                ariaLabel="تصفية الخدمات العليا"
                items={filterTabs}
                onSelect={(id) => {
                  setActiveFilter(id);
                  const filtered = id === 'all'
                    ? PREVIEW_TOP_SERVICES
                    : PREVIEW_TOP_SERVICES.filter((s) => s.filterGroup === id);
                  if (filtered.length > 0) {
                    setSelectedServiceCode(filtered[0].code);
                  }
                }}
              />
            </Box>

            <Box gap={2} style={{ marginTop: 8 }}>
              {filteredServices.map((service) => {
                const sState = serviceStates[service.code] || {
                  status: service.sovereignStatus,
                  visibility: service.customerVisibility,
                  tone: service.tone,
                };
                const isActive = service.code === selectedServiceCode;
                return (
                  <button
                    key={service.code}
                    type="button"
                    className={`${styles.surfaceInfoCard} ${styles.surfaceInfoCardButton} ${isActive ? styles.surfaceInfoCardActive : ''}`}
                    onClick={() => {
                      setSelectedServiceCode(service.code);
                      setShowConfirm(null);
                    }}
                  >
                    <div className={styles.surfaceInfoCardTextBlock}>
                      <div className={styles.surfaceHeaderTextRow} style={{ gap: 6 }}>
                        <Surface tone={sState.tone} padding={1} radiusToken="xs" border={false}>
                          <Text role="caption" weight="bold" tone={sState.tone === 'default' ? 'muted' : 'inverse'}>
                            {service.code}
                          </Text>
                        </Surface>
                        <div className={styles.surfaceInfoCardTitle}>{service.name}</div>
                      </div>
                      <div className={styles.surfaceInfoCardDescription}>
                        {sState.status} · {sState.visibility}
                      </div>
                    </div>
                    <div className={styles.surfaceMetaWrap}>
                      <span className={styles.surfaceMetaChip}>{service.filterGroup === 'active' ? 'نشطة' : 'مقررة'}</span>
                    </div>
                  </button>
                );
              })}
            </Box>
          </div>

          {/* Right Column: Inspector and control panel */}
          <aside className={styles.surfaceInspectorPanel}>
            <div className={styles.surfaceSectionHeader}>
              <h4 className={styles.surfaceSectionTitle}>{selectedService.name} ({selectedService.code})</h4>
              <p className={styles.surfaceSectionSubtitle}>إدارة الحالة التشغيلية والاعتمادية للمنصة</p>
            </div>

            <div className={styles.surfaceInspectorMeta}>
              <div className={styles.surfaceInspectorRow}>
                <strong>معرف الخدمة</strong>
                <span>{selectedService.code}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>الحالة السيادية</strong>
                <span style={{ fontWeight: 'bold' }}>{serviceState.status}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>ظهور العملاء</strong>
                <span>{serviceState.visibility}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>مستوى المخاطر</strong>
                <span>{selectedService.risks}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>النطاق الجغرافي</strong>
                <span>{selectedService.scope}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>الارتباط المالي</strong>
                <span>{selectedService.financialDependency}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>الأثر عند التعطيل</strong>
                <span>{selectedService.impactIfStopped}</span>
              </div>
              <div className={styles.surfaceInspectorRow}>
                <strong>آخر تعديل</strong>
                <span>{selectedService.lastModified}</span>
              </div>
            </div>

            {isPlanned ? (
              <Surface tone="default" border padding={2} radiusToken="md">
                <Text role="bodySm" tone="muted" align="center">
                  هذه الخدمة مقررة في خارطة المنصة ولم تُضَف بعد. الإجراءات والتحكم بها محجوبان حتى التسجيل الرسمي.
                </Text>
              </Surface>
            ) : showConfirm ? (
              <Surface tone="warning" border padding={3} radiusToken="md">
                <Box gap={2}>
                  <Text role="titleSm">تأكيد إجراء التحكم: {showConfirm}</Text>
                  <Text role="bodySm">
                    {showConfirm.includes('تعطيل') ? selectedService.impactIfStopped : 'تحديث وتأكيد مسار تشغيل الخدمة.'}
                  </Text>
                  <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                    <Button variant="primary" onClick={() => handleConfirm(showConfirm)} disabled={showConfirm === null}>تأكيد وتطبيق الإجراء</Button>
                    <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
                  </Box>
                </Box>
              </Surface>
            ) : (
              <Box gap={2}>
                <Text role="titleSm">أدوات التحكم والسيادة</Text>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <Button variant="primary" onClick={() => setShowConfirm('تفعيل الخدمة')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تفعيل الخدمة</Button>
                  <Button variant="danger" onClick={() => setShowConfirm('تعطيل الخدمة')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>تعطيل الخدمة</Button>
                </Box>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <Button variant="secondary" onClick={() => setShowConfirm('إظهار للعملاء')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>إظهار للعملاء</Button>
                  <Button variant="secondary" onClick={() => setShowConfirm('إخفاء عن العملاء')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>إخفاء عن العملاء</Button>
                </Box>
                <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
                  <Button variant="warning" onClick={() => setShowConfirm('وضع الصيانة')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>وضع الصيانة</Button>
                  <Button variant="secondary" onClick={() => setShowConfirm('استعادة الحالة (Rollback)')} disabled={showConfirm !== null} style={{ flexGrow: 1 }}>استعادة الحالة</Button>
                </Box>
              </Box>
            )}
          </aside>
        </div>
      </WebSectionCard>
    </Box>
  );
}

export default DshPlatformServicesWorkspace;
