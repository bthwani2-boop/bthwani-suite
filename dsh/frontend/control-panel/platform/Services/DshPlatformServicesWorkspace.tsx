'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import { WebSectionCard, WebControlPanelWorkspaceTabs } from '@bthwani/ui-kit/web';
import { useDemoPlatformState } from '../useDemoPlatformState';

// Top-level platform services: dsh, knz, wlt, amn, arb, mrf, kwd, snd, esf.
// Currently live: DSH, WLT. The remaining 7 are planned and will be registered later.
// Sub-capabilities (عونك, شي إن, Store Pickup, Scheduled Orders) are DSH-internal.
// Their sovereign control lives in Platform > Vars and Platform > Rollouts — NOT here.
type PlatformTopService = {
  code: 'DSH' | 'KNZ' | 'WLT' | 'AMN' | 'ARB' | 'MRF' | 'KWD' | 'SND' | 'ESF';
  name: string;
  sovereignStatus: string;
  customerVisibility: string;
  scope: string;
  financialDependency: string;
  risks: string;
  impactIfStopped: string;
  lastModified: string;
  tone: 'brand' | 'warning' | 'danger' | 'success' | 'default';
  filterGroup: 'active' | 'planned';
};

const PLANNED_SERVICE_DEFAULTS = {
  sovereignStatus: 'مقررة — لم تُضَف بعد',
  customerVisibility: 'لا ينطبق',
  scope: '[TBD]',
  financialDependency: '[TBD]',
  risks: '[TBD]',
  impactIfStopped: '[TBD]',
  lastModified: '[TBD]',
  tone: 'default' as const,
  filterGroup: 'planned' as const,
};

const PLATFORM_TOP_SERVICES: readonly PlatformTopService[] = [
  {
    code: 'DSH',
    name: 'دليفري وخدمات اللوجستية',
    sovereignStatus: 'مفعلة (Active)',
    customerVisibility: 'ظاهر للعملاء',
    scope: 'Global (جميع المدن المعتمدة)',
    financialDependency: 'يعتمد على WLT للتسويات المالية',
    risks: 'عالي جداً — توقفه يوقف جميع عمليات التوصيل فوراً',
    impactIfStopped: 'توقف كامل لخدمة التوصيل في كل المناطق المعتمدة',
    lastModified: 'قبل 3 أيام • System',
    tone: 'success',
    filterGroup: 'active',
  },
  {
    code: 'WLT',
    name: 'المحافظ والمالية',
    sovereignStatus: 'مفعلة (Active)',
    customerVisibility: 'مخفي (API داخلي)',
    scope: 'Global',
    financialDependency: 'صاحب القرار المالي — يمتلك التسويات ومحافظ الكباتن والمتاجر',
    risks: 'حرج — أي توقف يجمد كل المعاملات المالية',
    impactIfStopped: 'تجميد التسويات، إيقاف محافظ الكباتن، توقف مدفوعات المتاجر',
    lastModified: 'قبل أسبوع • Finance Team',
    tone: 'warning',
    filterGroup: 'active',
  },
  { code: 'AMN', name: 'الأمن والتحقق', ...PLANNED_SERVICE_DEFAULTS },
  { code: 'KNZ', name: '[TBD]', ...PLANNED_SERVICE_DEFAULTS },
  { code: 'ARB', name: '[TBD]', ...PLANNED_SERVICE_DEFAULTS },
  { code: 'MRF', name: '[TBD]', ...PLANNED_SERVICE_DEFAULTS },
  { code: 'KWD', name: '[TBD]', ...PLANNED_SERVICE_DEFAULTS },
  { code: 'SND', name: '[TBD]', ...PLANNED_SERVICE_DEFAULTS },
  { code: 'ESF', name: '[TBD]', ...PLANNED_SERVICE_DEFAULTS },
] as const;

type ServiceCardProps = { service: PlatformTopService };

function PlatformTopServiceCard({ service }: ServiceCardProps) {
  const { addAuditEvent } = useDemoPlatformState();
  const [showConfirm, setShowConfirm] = React.useState<string | null>(null);
  const [currentStatus, setCurrentStatus] = React.useState(service.sovereignStatus);
  const [currentVisibility, setCurrentVisibility] = React.useState(service.customerVisibility);
  const [currentTone, setCurrentTone] = React.useState(service.tone);
  const [rollbackSnapshot, setRollbackSnapshot] = React.useState({
    status: service.sovereignStatus,
    tone: service.tone,
  });

  const isPlanned = service.filterGroup === 'planned';

  const handleConfirm = (action: string) => {
    const prevStatus = currentStatus;
    const prevVisibility = currentVisibility;
    let newStatus = currentStatus;
    let newVisibility = currentVisibility;
    let newTone = currentTone;

    if (action === 'تشغيل تجريبي') {
      setRollbackSnapshot({ status: currentStatus, tone: currentTone });
      newStatus = 'مفعلة (Active)';
      newTone = 'success';
    } else if (action === 'إيقاف تجريبي') {
      setRollbackSnapshot({ status: currentStatus, tone: currentTone });
      newStatus = 'متوقفة (Inactive)';
      newTone = 'danger';
    } else if (action === 'وضع الصيانة') {
      setRollbackSnapshot({ status: currentStatus, tone: currentTone });
      newStatus = 'صيانة (Maintenance)';
      newTone = 'warning';
    } else if (action === 'إظهار للعملاء') {
      newVisibility = 'ظاهر للعملاء';
    } else if (action === 'إخفاء عن العملاء') {
      newVisibility = 'مخفي عن العملاء';
    } else if (action === 'rollback تجريبي') {
      newStatus = rollbackSnapshot.status;
      newTone = rollbackSnapshot.tone;
    }

    setCurrentStatus(newStatus);
    setCurrentVisibility(newVisibility);
    setCurrentTone(newTone);
    setShowConfirm(null);

    addAuditEvent({
      action: `تغيير خدمة عليا (${service.code}): ${action}`,
      operator: 'Demo Admin',
      status: action.includes('إيقاف') ? 'danger' : 'success',
      oldValue: `${prevStatus} / ${prevVisibility}`,
      newValue: `${newStatus} / ${newVisibility}`,
      reason: 'تغيير تجريبي (Demo Mode)',
      scope: service.scope,
      impact: action === 'إيقاف تجريبي' ? service.impactIfStopped : 'تغيير في حالة الخدمة',
      rollbackAvailable: true,
    });
  };

  return (
    <Surface tone="raised" border padding={4} radiusToken="xl">
      <Box gap={3}>
        {/* Header: code badge + name + status */}
        <Box layoutDirection="row" justify="space-between" align="flex-start" style={{ flexWrap: 'wrap', rowGap: 8 }}>
          <Box gap={1}>
            <Box layoutDirection="row" gap={2} align="center">
              <Surface tone={currentTone} padding={1} radiusToken="xs" border={false}>
                <Text role="caption" weight="bold" tone={currentTone === 'default' ? 'muted' : 'inverse'}>
                  {service.code}
                </Text>
              </Surface>
              <Text role="titleLg" tone="brand">{service.name}</Text>
            </Box>
            <Box layoutDirection="row" gap={2} align="center" style={{ flexWrap: 'wrap' }}>
              <Surface tone={currentTone} padding={1} radiusToken="pill" border={false}>
                <Text role="caption" tone={currentTone === 'default' ? 'muted' : 'inverse'}>{currentStatus}</Text>
              </Surface>
              <Text role="caption" tone="muted">•</Text>
              <Text role="caption" tone="muted">{currentVisibility}</Text>
            </Box>
          </Box>
          <Box gap={1} align="flex-end">
            <Text role="caption" tone="muted">مستوى الخطورة</Text>
            <Text role="bodySm" weight="bold" tone={currentTone === 'danger' ? 'danger' : 'default'}>
              {service.risks}
            </Text>
          </Box>
        </Box>

        {/* Details grid */}
        <Surface tone="default" border padding={3} radiusToken="md">
          <Box gap={2}>
            <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
              <Box gap={1} style={{ flexGrow: 1 }}>
                <Text role="caption" tone="muted">النطاق</Text>
                <Text role="bodySm" weight="medium">{service.scope}</Text>
              </Box>
              <Box gap={1} style={{ flexGrow: 1 }}>
                <Text role="caption" tone="muted">آخر تعديل</Text>
                <Text role="bodySm">{service.lastModified}</Text>
              </Box>
            </Box>
            <Box layoutDirection="row" gap={4} style={{ flexWrap: 'wrap' }}>
              <Box gap={1} style={{ flexGrow: 1 }}>
                <Text role="caption" tone="muted">الاعتماد المالي</Text>
                <Text role="bodySm">{service.financialDependency}</Text>
              </Box>
              <Box gap={1} style={{ flexGrow: 1 }}>
                <Text role="caption" tone="muted">الأثر عند الإيقاف</Text>
                <Text role="bodySm">{service.impactIfStopped}</Text>
              </Box>
            </Box>
          </Box>
        </Surface>

        {/* Actions */}
        {isPlanned ? (
          <Surface tone="default" border padding={2} radiusToken="md">
            <Text role="caption" tone="muted" align="center">
              هذه الخدمة مقررة في خارطة المنصة ولم تُضَف بعد. الإجراءات محجوبة حتى التسجيل الرسمي.
            </Text>
          </Surface>
        ) : showConfirm ? (
          <Surface tone="warning" border padding={3} radiusToken="md" style={{ marginTop: 8 }}>
            <Box gap={2}>
              <Text role="titleSm">تأكيد الإجراء التجريبي: {showConfirm}</Text>
              <Box layoutDirection="row" gap={4}>
                <Box gap={1}>
                  <Text role="caption" tone="muted">الحالة الحالية</Text>
                  <Text role="bodySm">{currentStatus} / {currentVisibility}</Text>
                </Box>
                <Box gap={1}>
                  <Text role="caption" tone="muted">الأثر المتوقع</Text>
                  <Text role="bodySm">
                    {showConfirm.includes('إيقاف') ? service.impactIfStopped : 'تغيير آمن في الحالة'}
                  </Text>
                </Box>
              </Box>
              <Box layoutDirection="row" gap={2} style={{ marginTop: 8 }}>
                <Button variant="primary" onClick={() => handleConfirm(showConfirm)}>تأكيد المحاكاة</Button>
                <Button variant="secondary" onClick={() => setShowConfirm(null)}>إلغاء</Button>
              </Box>
            </Box>
          </Surface>
        ) : (
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap', marginTop: 8 }}>
            <Button variant="primary" onClick={() => setShowConfirm('تشغيل تجريبي')}>تشغيل تجريبي</Button>
            <Button variant="danger" onClick={() => setShowConfirm('إيقاف تجريبي')}>إيقاف تجريبي</Button>
            <Button variant="secondary" onClick={() => setShowConfirm('إظهار للعملاء')}>إظهار للعملاء</Button>
            <Button variant="secondary" onClick={() => setShowConfirm('إخفاء عن العملاء')}>إخفاء عن العملاء</Button>
            <Button variant="warning" onClick={() => setShowConfirm('وضع الصيانة')}>وضع الصيانة</Button>
            <Box style={{ flexGrow: 1 }} />
            <Button variant="secondary" onClick={() => setShowConfirm('rollback تجريبي')}>Rollback (تجريبي)</Button>
          </Box>
        )}
      </Box>
    </Surface>
  );
}

export function DshPlatformServicesWorkspace() {
  const [activeFilter, setActiveFilter] = React.useState('all');

  const filterTabs = [
    { id: 'all', label: 'الكل', badge: '9', active: activeFilter === 'all' },
    { id: 'active', label: 'مفعلة', badge: '2', active: activeFilter === 'active' },
    { id: 'planned', label: 'مقررة (لم تُضَف)', badge: '7', active: activeFilter === 'planned' },
  ];

  const filteredServices = activeFilter === 'all'
    ? PLATFORM_TOP_SERVICES
    : PLATFORM_TOP_SERVICES.filter((s) => s.filterGroup === activeFilter);

  return (
    <Box gap={4}>
      <WebSectionCard
        title="خدمات المنصة العليا"
        description="الخدمات السيادية العليا: DSH، KNZ، WLT، AMN، ARB، MRF، KWD، SND، ESF. القدرات الفرعية كعونك وشي إن تُدار عبر Vars وRollouts وليست خدمات عليا."
      >
        <Box gap={4}>
          <WebControlPanelWorkspaceTabs
            ariaLabel="تصفية الخدمات العليا"
            items={filterTabs}
            onSelect={(id) => setActiveFilter(id)}
          />
          <Box gap={4}>
            {filteredServices.map((service) => (
              <PlatformTopServiceCard key={service.code} service={service} />
            ))}
          </Box>
        </Box>
      </WebSectionCard>
    </Box>
  );
}
