'use client';

import React from 'react';
import { Box, Surface, Text, Button } from '@bthwani/ui-kit';
import {
  WebControlPanelLaneTabs,
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
  { id: 'vars', label: 'المتغيرات', badge: '', active: true },
  { id: 'services', label: 'الخدمات', badge: '', active: true },
  { id: 'providers', label: 'المزودون', badge: '', active: true },
  { id: 'rollouts', label: 'الإطلاق التدريجي', badge: '', active: true },
  { id: 'health', label: 'الصحة والأداء', badge: '', active: true },
  { id: 'appearance', label: 'المظهر', badge: '', active: true },
  { id: 'audit', label: 'السجل والتراجع', badge: '', active: true },
  { id: 'overview', label: 'نظرة عامة (عن المنصة)', badge: '', active: true },
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

function OverviewPanel({ platformGovernance }: { platformGovernance: any }) {
  return (
    <Box gap={4}>
      {/* Split Grid for Governance information */}
      <div className={styles.surfaceSplitGrid}>
        <div className={styles.surfaceInfoCard}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>ملكية المنصة والسياسات السيادية</div>
            <div className={styles.surfaceInfoCardDescription}>
              {platformGovernance?.notes ?? 'إدارة المتغيرات السيادية والمزودين والإطلاق التدريجي وسجل التدقيق الفعلي للمنصة.'}
            </div>
          </div>
          <div className={styles.surfaceMetaWrap}>
            <span className={styles.surfaceMetaChip}>إدارة السياسات</span>
            <span className={styles.surfaceMetaChip}>تتبع التغيير</span>
          </div>
        </div>

        <div className={styles.surfaceInfoCard}>
          <div>
            <div className={styles.surfaceInfoCardTitle}>حدود التشغيل والـ SLA</div>
            <div className={styles.surfaceInfoCardDescription}>
              تكامل مباشر مع نظام العمليات وSLA، مع المراقبة الفورية وضمان توافق السياسات السيادية.
            </div>
          </div>
          <div className={styles.surfaceMetaWrap}>
            <span className={styles.surfaceMetaChip}>إدارة تراجع الأداء</span>
            <span className={styles.surfaceMetaChip}>التراجع الآمن</span>
          </div>
        </div>
      </div>

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
    React.useState<PlatformWorkspaceId>('vars');

  const activeTab = WORKSPACE_TABS.find((w) => w.id === activeWorkspace);

  return (
    <DemoPlatformProvider>
      <div className={styles.surfaceCockpit}>
      {/* Top bar */}
      <header className={styles.surfaceTopBar}>
        <div className={styles.surfaceTitleBlock}>
          <div className={styles.surfaceHeaderIconBox} aria-hidden="true">
            <div className={styles.surfaceHeaderGlyph}>
              <div className={styles.surfaceHeaderGlyphMinus} style={{ transform: 'rotate(90deg)' }} />
              <div className={styles.surfaceHeaderGlyphMinus} />
            </div>
          </div>
          <Box gap={0}>
            <div className={styles.surfaceHeaderTextRow}>
              <h1 className={styles.surfaceHeaderTitle}>منصة DSH السيادية</h1>
              <Box paddingX={1} paddingY={0} background="brandSurface" radiusToken="xs">
                <span className={styles.surfaceHeaderBadgeText}>لوحة التحكم الفنية</span>
              </Box>
            </div>
            <p className={styles.surfaceHeaderSubtitle}>
              التحكم في المتغيرات السيادية والمزودين والمظهر العام عبر هيكلية النظام المركزي.
            </p>
          </Box>
        </div>

        <div className={styles.surfaceHeaderActions}>
          <div className={styles.surfacePulseCompact}>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>المساحات النشطة</span>
              <span className={styles.commandKpiValue}>{String(WORKSPACE_TABS.length)}</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>حالة النظام</span>
              <span className={`${styles.commandKpiValue} ${styles.commandKpiValueSuccess}`}>نشط ومؤمن</span>
            </div>
            <div className={styles.commandKpi}>
              <span className={styles.commandKpiLabel}>نمط المرحلة</span>
              <span className={styles.commandKpiValue}>بوابة سيادية نشطة</span>
            </div>
          </div>
        </div>
      </header>

      {/* Workspace tabs in Lane Tabs style */}
      <nav className={styles.navigationDock}>
        <WebControlPanelLaneTabs
          items={WORKSPACE_TABS.map((w) => ({
            id: w.id,
            label: w.label,
            active: w.id === activeWorkspace,
          }))}
          onSelect={(id) => {
            if (isActiveWorkspace(id as PlatformWorkspaceId)) {
              setActiveWorkspace(id as PlatformWorkspaceId);
            }
          }}
        />
      </nav>

      {/* Main content */}
      <main className={styles.surfaceMainPanel}>
        <div className={styles.surfaceInnerScroll}>
          <Box gap={3}>
            {activeWorkspace === 'overview' && <OverviewPanel platformGovernance={platformGovernance} />}
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
