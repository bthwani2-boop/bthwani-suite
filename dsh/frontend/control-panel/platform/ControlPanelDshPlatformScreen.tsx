'use client';

import React from 'react';
import { Box, Surface, Text } from '@bthwani/ui-kit';
import {
  WebControlPanelLaneTabs,
  WebSectionCard,
  WebSignalCard,
  WebControlPanelSubTabs,
} from '@bthwani/ui-kit/web';
import { DshPlatformVarsWorkspace } from './Vars';
import { DshPlatformServicesWorkspace } from './Services';
import { DshPlatformProvidersWorkspace } from './Providers';
import { DshPlatformRolloutsWorkspace } from './Rollouts';
import { DshPlatformHealthWorkspace } from './Health';
import { DshPlatformAuditWorkspace } from './Audit';
import { PlatformAuditProvider } from './usePlatformAuditState';
import { getDshControlPanelGovernanceEntry } from '../shared';
import styles from '../shared/control-panel-surface.module.css';

type ActiveWorkspaceId = 'overview' | 'services' | 'vars' | 'providers';
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
  { id: 'audit', label: 'السجل والتراجع', badge: '', active: true },
  { id: 'overview', label: 'نظرة عامة عن المنصة', badge: '', active: true },
] as const;

const SUB_TABS: Record<PlatformWorkspaceId, { id: string; label: string }[]> = {
  vars: [
    { id: 'dsh', label: 'عمليات DSH' },
    { id: 'wlt', label: 'جسر WLT' },
    { id: 'provider', label: 'المزودين' },
    { id: 'design', label: 'سياسات الهوية' },
    { id: 'policy', label: 'طبقات الأسبقية' },
  ],
  services: [
    { id: 'all', label: 'الكل' },
    { id: 'active', label: 'مفعلة' },
    { id: 'planned', label: 'مقررة (لم تُضَف)' },
  ],
  providers: [
    { id: 'all', label: 'الكل' },
    { id: 'active', label: 'نشط بالكامل' },
    { id: 'pending', label: 'بانتظار الاعتماد' },
    { id: 'inactive', label: 'غير نشط / فشل الاتصال' },
  ],
  rollouts: [
    { id: 'all', label: 'الكل' },
    { id: 'service', label: 'رول-أوت خدمة عليا' },
    { id: 'capability', label: 'رول-أوت قدرة DSH' },
  ],
  health: [
    { id: 'all', label: 'الكل' },
    { id: 'danger', label: 'تحذيرات حرجة' },
    { id: 'warning', label: 'تنبيهات عادية' },
  ],
  audit: [
    { id: 'all', label: 'الكل' },
    { id: 'success', label: 'نشط ومطبق' },
    { id: 'warning', label: 'معتمد وموثق' },
    { id: 'danger', label: 'تم التراجع / الطوارئ' },
  ],
  overview: [
    { id: 'all', label: 'الكل' },
    { id: 'governance', label: 'ملكية السياسات' },
    { id: 'sla', label: 'حدود الـ SLA' },
    { id: 'tools', label: 'أدوات السيطرة' },
  ],
};

function isActiveWorkspace(id: PlatformWorkspaceId): id is ActiveWorkspaceId | SimulationWorkspaceId {
  return true; // All are active now
}

// ─── Overview panel ─────────────────────────────────────────────────────────

function OverviewPanel({ platformGovernance, activeFilter }: { platformGovernance: any; activeFilter?: string }) {
  const showGovernance = !activeFilter || activeFilter === 'all' || activeFilter === 'governance';
  const showSla = !activeFilter || activeFilter === 'all' || activeFilter === 'sla';
  const showTools = !activeFilter || activeFilter === 'all' || activeFilter === 'tools';

  return (
    <Box gap={4}>
      {/* status strip notice */}
      <Surface tone="brand" padding={3} radiusToken="md" border>
        <Box layoutDirection="row" gap={2} align="center" justify="space-between" style={{ flexWrap: 'wrap' }}>
          <Text role="bodySm" tone="brand" weight="bold" style={{ }}>
            تنبيه النظام: تفضيلات المظهر والهوية البصرية خاصة بملف تعريف المستخدم (Shell Profile) وليست جزءاً من السياسات السيادية للمنصة.
          </Text>
          <span className={styles.surfaceMetaChip}>إقرار الحرس التشغيلي</span>
        </Box>
      </Surface>

      {/* Split Grid for Governance information */}
      {showGovernance && (
        <div className={styles.surfaceSplitGrid}>
          <div className={styles.surfaceInfoCard}>
            <div>
              <div className={styles.surfaceInfoCardTitle}>ملكية السياسات والأولوية السيادية</div>
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
              <div className={styles.surfaceInfoCardTitle}>حدود ملكية المنصة والـ SLA</div>
              <div className={styles.surfaceInfoCardDescription}>
                تكامل مباشر مع نظام العمليات وSLA، مع المراقبة الفورية وضمان توافق السياسات السيادية ومطابقة العقود.
              </div>
            </div>
            <div className={styles.surfaceMetaWrap}>
              <span className={styles.surfaceMetaChip}>إدارة تراجع الأداء</span>
              <span className={styles.surfaceMetaChip}>التراجع الآمن</span>
            </div>
          </div>
        </div>
      )}

      {showSla && (
        <>
          <Box layoutDirection="row" gap={2} style={{ flexWrap: 'wrap' }}>
            <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
              <WebSignalCard
                title="الخدمات العليا"
                value="9 خدمات"
                description="خارطة المنصة الكاملة: DSH، KNZ، WLT، AMN، ARB، MRF، KWD، SND، ESF."
                tone="neutral"
              />
            </Box>
            <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
              <WebSignalCard
                title="المفعلة حالياً"
                value="خدمتان"
                description="خدمة التوصيل DSH (ظاهرة للعملاء) والمحفظة WLT (API داخلي)."
                tone="neutral"
              />
            </Box>
            <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
              <WebSignalCard
                title="مخفية عن العملاء"
                value="خدمة واحدة"
                description="المحافظ والتسويات WLT: تعمل كـ API داخلي دون واجهة عميل مباشرة."
                tone="neutral"
              />
            </Box>
            <Box style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
              <WebSignalCard
                title="تحتاج مراجعة"
                value="7 خدمات"
                description="خدمات مقررة في خارطة المنصة ولم يكتمل تقييم الجاهزية والربط بعد."
                tone="neutral"
              />
            </Box>
          </Box>

          <WebSectionCard
            title="التكامل وحدود المسؤولية (Handoffs & Limits)"
            description="المهام المتخصصة محالة إلى مساحات التحكم التالية لتجنب تداخلها مع لوحة التحكم السيادية."
          >
            <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
              <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
                <Box gap={1}>
                  <Text role="titleMd" tone="brand">إدارة الكتالوجات (Catalogs)</Text>
                  <Text role="bodySm" tone="muted">
                    تعديل وتنسيق فئات المنتجات والقوائم، والأسعار المحلية.
                  </Text>
                </Box>
              </Surface>
              <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
                <Box gap={1}>
                  <Text role="titleMd" tone="brand">التسويق والعروض (Marketing)</Text>
                  <Text role="bodySm" tone="muted">
                    إدارة العروض الترويجية، برامج الولاء، وتوزيع الكوبونات للمستخدمين.
                  </Text>
                </Box>
              </Surface>
              <Surface tone="default" border padding={3} radiusToken="xl" style={{ flexGrow: 1, flexBasis: 200, minWidth: 0 }}>
                <Box gap={1}>
                  <Text role="titleMd" tone="brand">إدارة الصلاحيات (Administration)</Text>
                  <Text role="bodySm" tone="muted">
                    إدارة أدوار المشغلين، الهويات، وامتيازات الوصول الفني للمنصة.
                  </Text>
                </Box>
              </Surface>
            </Box>
          </WebSectionCard>
        </>
      )}

      {showTools && (
        <WebSectionCard
          title="أدوات السيطرة والسياسة (Sovereign Policy Tools)"
          description="تحاكي منصة التحكم الأثر المتوقع وتدفقات التراجع دون إحداث تعديلات فورية في بيئة التشغيل."
        >
          <Box layoutDirection="row" gap={3} style={{ flexWrap: 'wrap' }}>
            {[
              { title: 'محاكي أثر السياسات', note: 'معاينة المتغيرات + ترتيب الأسبقية + الأثر المتوقع للسياسة.' },
              { title: 'نطاق وتأثير التغيير', note: 'الخدمات المتأثرة + الشرائح التشغيلية + الأسطح والواجهات النشطة.' },
              { title: 'تراجع جودة الخدمات والمزودين', note: 'التحكم بالمزودين + مؤشر الصحة والأداء + نتائج فحوصات الاتصال.' },
              { title: 'البديل الآمن والرجوع التلقائي', note: 'الإطلاقات التدريجية + معاينة التراجع + حرس المالك المعتمد.' },
              { title: 'مخطط الاعتماديات الفنية', note: 'مخطط الاعتماد بين الخدمات العليا والمزودين ومراجع التدقيق.' },
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
      )}
    </Box>
  );
}

// ─── Main screen ─────────────────────────────────────────────────────────────

export function ControlPanelDshPlatformScreen() {
  const platformGovernance = React.useMemo(() => getDshControlPanelGovernanceEntry('platform'), []);
  const [activeWorkspace, setActiveWorkspace] =
    React.useState<PlatformWorkspaceId>('vars');
  const [activeSubTab, setActiveSubTab] = React.useState<string>('dsh');

  React.useEffect(() => {
    if (activeWorkspace === 'vars') {
      setActiveSubTab('dsh');
    } else {
      setActiveSubTab('all');
    }
  }, [activeWorkspace]);

  const subTabsForActiveWorkspace = SUB_TABS[activeWorkspace] || [];

  return (
    <PlatformAuditProvider>
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
                إدارة المتغيرات السيادية، والمزودين، وسياسات الإطلاق والتشغيل الآمن للمنصة.
              </p>
            </Box>
          </div>

          <div className={styles.surfaceHeaderActions}>
            <div className={styles.surfacePulseCompact}>
              <div className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>السياسات</span>
                <span className={styles.commandKpiValue}>13</span>
              </div>
              <div className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>المزودون</span>
                <span className={styles.commandKpiValue}>7</span>
              </div>
              <div className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>الإطلاقات النشطة</span>
                <span className={styles.commandKpiValue}>3</span>
              </div>
              <div className={styles.commandKpi}>
                <span className={styles.commandKpiLabel}>التنبيهات والتدقيق</span>
                <span className={`${styles.commandKpiValue} ${styles.commandKpiValueAlert}`}>2</span>
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

        {/* Sub-tabs for active workspace */}
        {subTabsForActiveWorkspace.length > 0 && (
          <WebControlPanelSubTabs
            items={subTabsForActiveWorkspace.map((s) => ({
              id: s.id,
              label: s.label,
              active: s.id === activeSubTab,
            }))}
            onSelect={(subId) => setActiveSubTab(subId)}
            ariaLabel="تصفية مساحة العمل الفرعية"
          />
        )}

        {/* Main content */}
        <main className={styles.surfaceMainPanel}>
          <div className={styles.surfaceInnerScroll}>
            <Box gap={3}>
              {activeWorkspace === 'overview' && <OverviewPanel platformGovernance={platformGovernance} activeFilter={activeSubTab} />}
              {activeWorkspace === 'services' && <DshPlatformServicesWorkspace activeFilter={activeSubTab} />}
              {activeWorkspace === 'vars' && <DshPlatformVarsWorkspace activeDomainFilter={activeSubTab as any} />}
              {activeWorkspace === 'providers' && <DshPlatformProvidersWorkspace activeFilter={activeSubTab} />}
              {activeWorkspace === 'rollouts' && <DshPlatformRolloutsWorkspace activeFilter={activeSubTab} />}
              {activeWorkspace === 'health' && <DshPlatformHealthWorkspace activeFilter={activeSubTab} />}
              {activeWorkspace === 'audit' && <DshPlatformAuditWorkspace activeFilter={activeSubTab} />}
            </Box>
          </div>
        </main>
      </div>
    </PlatformAuditProvider>
  );
}

export default ControlPanelDshPlatformScreen;
