'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelKpiStrip,
  WebControlPanelWorkspaceTabs,
  WebSectionCard,
  WebSignalCard,
} from '@bthwani/ui-kit/web';
import { DshPlatformVarsWorkspace } from './Vars';
import { DshPlatformAppearanceWorkspace } from './Appearance';
import { DshPlatformServicesWorkspace } from './Services';
import { DshPlatformProvidersWorkspace } from './Providers';
import { DshPlatformRolloutsWorkspace } from './Rollouts';
import { DshPlatformHealthWorkspace } from './Health';
import { DshPlatformAuditWorkspace } from './Audit';
import { DemoPlatformProvider } from './useDemoPlatformState';
import { getDshControlPanelGovernanceEntry } from '../shared';
import styles from '../shared/control-panel-surface.module.css';

type ActiveWorkspaceId = 'overview' | 'services' | 'vars' | 'providers' | 'appearance';
type SimulationWorkspaceId = 'rollouts' | 'health' | 'audit';
type PlatformWorkspaceId = ActiveWorkspaceId | SimulationWorkspaceId;

type WorkspaceTab = {
  id: PlatformWorkspaceId;
  label: string;
  badge: string;
  active: boolean;
};

const WORKSPACE_TABS: readonly WorkspaceTab[] = [
  { id: 'overview', label: 'نظرة عامة', badge: '', active: true },
  { id: 'services', label: 'الخدمات', badge: '', active: true },
  { id: 'vars', label: 'المتغيرات', badge: '', active: true },
  { id: 'providers', label: 'المزودون', badge: '', active: true },
  { id: 'appearance', label: 'المظهر', badge: '', active: true },
  { id: 'rollouts', label: 'الإطلاق التدريجي', badge: '', active: true },
  { id: 'health', label: 'الصحة والأداء', badge: '', active: true },
  { id: 'audit', label: 'السجل والتراجع', badge: '', active: true },
] as const;

const ACTIVE_WORKSPACE_IDS: readonly ActiveWorkspaceId[] = [
  'overview',
  'services',
  'vars',
  'providers',
  'appearance',
];

function isActiveWorkspace(id: PlatformWorkspaceId): id is ActiveWorkspaceId | SimulationWorkspaceId {
  return true; // All are active now
}

// ─── Overview panel ─────────────────────────────────────────────────────────

function OverviewPanel() {
  return (
    <Box gap={4}>
      <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="الخدمات العليا"
            value="9"
            description="DSH، KNZ، WLT، AMN، ARB، MRF، KWD، SND، ESF — خارطة المنصة الكاملة."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="المفعلة حالياً"
            value="2"
            description="DSH (ظاهر للعملاء) و WLT (API داخلي). 7 خدمات مقررة ولم تُضَف بعد."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="مخفية عن العملاء"
            value="1"
            description="WLT: API داخلي للمحافظ والتسويات — لا واجهة مباشرة للعملاء."
            tone="neutral"
          />
        </Box>
        <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
          <WebSignalCard
            title="تحتاج مراجعة"
            value="7"
            description="خدمات مقررة في خارطة المنصة ولم يُحدَّد وقت إضافتها بعد."
            tone="neutral"
          />
        </Box>
      </Box>

      <WebSectionCard
        title="التكامل مع الأقسام المتخصصة (Handoffs)"
        description="المهام التشغيلية اليومية محالة إلى مساحات التحكم المتخصصة التالية لتجنب تسربها إلى لوحة التحكم السيادية."
      >
        <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
          <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
            <Box gap={1}>
              <Text role="titleMd" tone="brand">الكتالوجات (Catalogs)</Text>
              <Text role="bodySm" tone="muted">
                إدارة الفئات، المنتجات، وأقسام العرض.
              </Text>
            </Box>
          </Surface>
          <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
            <Box gap={1}>
              <Text role="titleMd" tone="brand">التسويق (Marketing)</Text>
              <Text role="bodySm" tone="muted">
                إدارة الحملات، العروض، والبنرات الترويجية.
              </Text>
            </Box>
          </Surface>
          <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
            <Box gap={1}>
              <Text role="titleMd" tone="brand">الإدارة (Administration)</Text>
              <Text role="bodySm" tone="muted">
                إدارة المستخدمين، الأدوار، والصلاحيات.
              </Text>
            </Box>
          </Surface>
        </Box>
      </WebSectionCard>

      <WebSectionCard
        title="أدوات السيطرة والسياسة"
        description="المنصة تشرح التأثير والـ blast radius والـ fallback والاعتماديات من دون أي runtime mutation."
      >
        <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
          {[
            { title: 'Policy impact simulator', note: 'Vars + precedence + expected impact' },
            { title: 'Blast radius', note: 'Services + audiences + affected surfaces' },
            { title: 'Provider degradation', note: 'Provider control + health + test result' },
            { title: 'Safe fallback', note: 'Rollouts + rollback preview + owner guard' },
            { title: 'Dependency graph', note: 'Services / Providers / Audit references only' },
          ].map((item) => (
            <Surface key={item.title} tone="raised" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 220, minWidth: 0 }}>
              <Box gap={1}>
                <Text role="titleMd" tone="brand">{item.title}</Text>
                <Text role="bodySm" tone="muted">{item.note}</Text>
              </Box>
            </Surface>
          ))}
        </Box>
      </WebSectionCard>
    </Box>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function ControlPanelDshPlatformScreen() {
  const platformGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('platform'), []);
  const operationsGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('operations'), []);
  const [activeWorkspace, setActiveWorkspace] =
    React.useState<PlatformWorkspaceId>('overview');

  const activeTab = WORKSPACE_TABS.find((w) => w.id === activeWorkspace);

  return (
    <DemoPlatformProvider>
      <div className={styles.surfaceCockpit}>
      {/* Top bar */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>منصة DSH</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>لوحة التحكم السيادية</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              للمسؤولين المفوّضين فقط — تحكم مركزي بالخدمات والمتغيرات والمزودين والمظهر.
            </p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المساحات</span>
              <span className={styles.commandKpiValue}>{String(WORKSPACE_TABS.length)}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>النشطة</span>
              <span className={styles.commandKpiValue}>
                {String(WORKSPACE_TABS.filter((w) => w.active).length)}
              </span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>نمط المرحلة</span>
              <span className={styles.commandKpiValue}>وضع تجريبي (محاكاة محلية)</span>
            </div>
          </div>
        </div>
      </header>

      {/* Demo Warning Banner */}
      <Box paddingX={4} paddingY={3}>
        <Surface tone="warning" border padding={3} radiusToken="md">
          <Text role="bodySm" tone="warning" align="center">
            وضع تجريبي: جميع الإجراءات preview فقط. لا يوجد backend أو env binding ولا يتم تعديل مزودين أو Vars حقيقية في هذه المرحلة.
          </Text>
        </Surface>
      </Box>

      {/* KPI strip */}
      <WebControlPanelKpiStrip
        items={[
          {
            id: 'active-workspace',
            label: 'المجال الحالي',
            value: activeTab?.label ?? '—',
            tone: 'success',
          },
          { id: 'platform-mode', label: 'نمط المرحلة', value: 'preview policy only', tone: 'neutral' },
          { id: 'financial-owner', label: 'المالك المالي', value: 'WLT bridge', tone: 'warning' },
          { id: 'mutations', label: 'تعديل الإعدادات', value: 'غير مسموح في Phase 4', tone: 'danger' },
        ]}
      />

      {/* Workspace tabs */}
      <div className={`${styles.filterDock} ${styles.filterDockTint}`}>
        <WebControlPanelWorkspaceTabs
          ariaLabel="مساحات منصة DSH"
          items={WORKSPACE_TABS.map((w) => ({
            id: w.id,
            label: w.label,
            badge: w.badge,
            active: w.id === activeWorkspace,
          }))}
          onSelect={(id) => {
            if (isActiveWorkspace(id as PlatformWorkspaceId)) {
              setActiveWorkspace(id as PlatformWorkspaceId);
            }
          }}
        />
      </div>

      <Box paddingX={4} paddingY={2}>
        <Box style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          <Surface tone="inset" padding={3} gap={1} style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">ملكية المنصة والسياسات</Text>
            <Text role="bodySm" tone="muted">
              {platformGovernance?.notes ?? 'المنصة تملك Vars وproviders وrollouts وaudit كمعاينات محكومة فقط.'}
            </Text>
            <Text role="caption" tone="muted">
              {platformGovernance?.onDemandPolicySummary ?? 'الملخص أولًا ثم تفاصيل السياسات عند الفتح فقط.'}
            </Text>
          </Surface>
          <Surface tone="default" padding={3} gap={1} style={{ flexGrow: 1, minWidth: 280 }}>
            <Text role="titleSm">حدود التشغيل</Text>
            <Text role="bodySm" tone="muted">
              {`أي تنفيذ حي أو SLA تشغيلي يبقى تحت ${operationsGovernance?.sectionLabel ?? 'Operations'}، بينما هذه المساحة تشرح السياسة ولا تنفذها.`}
            </Text>
            <Text role="caption" tone="muted">
              لا يوجد هنا حفظ أسرار أو provider switching فعلي أو rollout mutation.
            </Text>
          </Surface>
        </Box>
      </Box>

      {/* Main content */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box gap={3}>
            {activeWorkspace === 'overview' && <OverviewPanel />}
            {activeWorkspace === 'services' && <DshPlatformServicesWorkspace />}
            {activeWorkspace === 'vars' && <DshPlatformVarsWorkspace />}
            {activeWorkspace === 'providers' && <DshPlatformProvidersWorkspace />}
            {activeWorkspace === 'appearance' && <DshPlatformAppearanceWorkspace />}
            {activeWorkspace === 'rollouts' && <DshPlatformRolloutsWorkspace />}
            {activeWorkspace === 'health' && <DshPlatformHealthWorkspace />}
            {activeWorkspace === 'audit' && <DshPlatformAuditWorkspace />}
          </Box>
        </div>
      </main>
      </div>
    </DemoPlatformProvider>
  );
}

export default ControlPanelDshPlatformScreen;
