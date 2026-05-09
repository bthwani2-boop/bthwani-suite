import React from 'react';
import { Box } from '@bthwani/ui-kit';
import { ControlPanelDshActionQueue, ControlPanelDshWorkspaceFrame, type ControlPanelDshActionQueueItem } from '../shared';
import styles from '../operations/dsh-surface.module.css';

type SupportLane = 'order' | 'partner' | 'captain' | 'field';

function buildSupportItems(kind: 'queue' | 'dispute') {
  const lanes: readonly SupportLane[] = ['order', 'partner', 'captain', 'field'];
  return lanes.map((lane) => ({
    id: `${kind}-${lane}`,
    title: `${lane === 'order' ? 'طلب' : lane === 'partner' ? 'شريك' : lane === 'captain' ? 'كابتن' : 'ميداني'} ${kind === 'dispute' ? 'نزاع' : 'دعم'}`,
    status: lane === 'order' ? 'نشط' : 'جاهز',
    ownerSurface: 'support',
    blocker: kind === 'dispute' ? 'يجب تأكيد الأدلة والملكية.' : 'خصص مالكًا واختر السطح المرتبط.',
    evidence: `إثبات سطح ${lane} المرتبط`,
    primaryActionLabel: kind === 'dispute' ? 'حل محلي' : 'فرز',
    secondaryActionLabel: 'تعيين مالك',
    evidenceActionLabel: `فتح ${lane} المرتبط`,
    tone: lane === 'order' ? 'brand' : lane === 'partner' ? 'best' : lane === 'captain' ? 'warning' : 'warning',
  })) satisfies readonly ControlPanelDshActionQueueItem[];
}

function SupportQueueBoard({
  title,
  purpose,
  kind,
}: {
  title: string;
  purpose: string;
  kind: 'queue' | 'dispute';
}) {
  const items = buildSupportItems(kind);
  const [selectedId, setSelectedId] = React.useState(items[0]?.id ?? null);
  const [note, setNote] = React.useState('جاهز للفرز');
  const selected = items.find((item) => item.id === selectedId) ?? items[0];

  const PULSE_METRICS = [
    { label: 'مفتوح', value: '8', color: '#D97706' },
    { label: 'قيد الحل', value: '14', color: '#0A2F5C' },
    { label: 'متجاوز SLA', value: '2', color: '#DC2626' },
  ];

  return (
    <div className={styles.operationsCockpit} dir="rtl">
      {/* 1. Header Area */}
      <header className={`${styles.operationsTopBar} ${styles.premiumGlass}`}>
        <div className={styles.operationsTitleBlock}>
          <div style={{
            width: '32px',
            height: '32px',
            backgroundColor: '#0A2F5C',
            borderRadius: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(10, 47, 92, 0.2)'
          }}>
            📞
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h1 style={{ fontSize: '18px', letterSpacing: '-0.01em' }}>دعم DSH</h1>
              <span style={{ fontSize: '9px', padding: '2px 6px', backgroundColor: '#FEF2F2', color: '#DC2626', borderRadius: '4px', fontWeight: '800' }}>تصعيد نشط</span>
            </div>
            <p style={{ fontSize: '10px', fontWeight: 600 }}>إدارة التذاكر والنزاعات المرتبطة بالعمليات</p>
          </div>
        </div>

        <div className={styles.operationsHeaderActions}>
          <div className={styles.operationsPulseCompact}>
            {PULSE_METRICS.map((metric) => (
              <div key={metric.label} className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>{metric.label}</span>
                <span className={styles.commandKpiValue} style={{ color: metric.color }}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>
      </header>

      {/* 2. Main Panel */}
      <main className={styles.operationsMainPanel}>
        <div className={styles.operationsInnerScroll}>
          <Box gap={4} style={{ padding: '16px' }}>
            <ControlPanelDshActionQueue
              title={title}
              purpose={purpose}
              items={items}
              selectedId={selectedId}
              onSelect={(id) => setSelectedId(id)}
              primaryAction={(item) => { setSelectedId(item.id); setNote(`${item.primaryActionLabel}: ${item.title}`); }}
              secondaryAction={(item) => { setSelectedId(item.id); setNote(`${item.secondaryActionLabel}: ${item.title}`); }}
              evidenceAction={(item) => { setSelectedId(item.id); setNote(`${item.evidenceActionLabel}: ${item.title}`); }}
            />

            <ControlPanelDshWorkspaceFrame
              eyebrow={kind === 'queue' ? 'صف الدعم' : 'حل النزاعات'}
              title={title}
              description="صف دعم مرتبط بـ DSH مع الفرز والتعيين وحل الأسطح المرتبطة."
              badges={['support', kind]}
              metaItems={[selected?.status ?? 'مفتوح', note]}
              decisionBoard={{
                title: `لوحة ${title}`,
                purpose,
                primaryDecision: selected?.status ?? 'مفتوح',
                nextAction: note,
                blockers: selected?.blocker ?? 'اختر مسار المشكلة.',
                ownerSurface: 'support',
                evidenceHint: selected?.evidence ?? 'إثبات السطح المرتبط',
                routeHint: '/operations?workspace=issues',
                decisionTone: kind === 'dispute' ? 'warning' : 'danger',
              }}
              primaryAction={{ label: 'فتح المشكلات', href: '/operations?workspace=issues' }}
              secondaryAction={{ label: 'فتح الأدلة', href: '/operations?workspace=evidence' }}
              signals={[
                { id: `${kind}-open`, title: 'مفتوح', value: 'مرئي', description: 'مسار المشكلة المفتوح.', tone: 'warning' },
                { id: `${kind}-assigned`, title: 'معين', value: 'محلي', description: 'مسار المالك المعين.', tone: 'best' },
                { id: `${kind}-linked`, title: 'مرتبط', value: 'مرئي', description: 'مسار السطح المرتبط.', tone: 'brand' },
                { id: `${kind}-escalated`, title: 'مصعد', value: 'متتبع', description: 'مسار التصعيد.', tone: 'danger' },
              ]}
            />
          </Box>
        </div>
      </main>
    </div>
  );
}

export function ControlPanelDshSupportQueueScreen() {
  return <SupportQueueBoard title="صف دعم عابر للأسطح" purpose="ابقِ الدعم مرتبطًا بالمشكلات المتعلقة بـ DSH بدلاً من صندوق وارد جذري عام." kind="queue" />;
}

export function ControlPanelDshDisputeResolutionScreen() {
  return <SupportQueueBoard title="دورة حياة النزاع" purpose="ابقِ النزاع في سياق مرتبط بـ DSH وليس مسار دعم عام." kind="dispute" />;
}

export default ControlPanelDshSupportQueueScreen;
