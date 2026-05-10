"use client";
import React, { type ReactNode } from 'react';
import { useDirection, useUiLanguage, useUiText } from '../providers';

const webCommandCenterCss = `
.ui-web-command-center-root {
  --rail-width: 240px;
  --bth-shell-line: rgba(10, 47, 92, 0.06);
  --bth-deep-blue: #0A2F5C;
  --bth-orange: #FF500D;
  display: grid;
  grid-template-rows: 56px minmax(0, 1fr);
  gap: 0;
  align-content: start;
  height: 100vh;
  height: 100dvh;
  min-height: 100vh;
  min-height: 100dvh;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #f8fafc;
  color: var(--bth-text);
  overflow: hidden;
  overflow-x: hidden;
}

.ui-web-command-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 0 24px;
  min-width: 0;
  background: #ffffff;
  border-bottom: 1px solid var(--bth-shell-line);
  position: relative;
  z-index: 100;
  height: 56px;
}

.ui-web-command-strip__identity {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  flex-shrink: 0;
}

.ui-web-command-strip__surface-title {
  appearance: none;
  border: none;
  background: transparent;
  padding: 0;
  font-family: inherit;
  font-size: 18px;
  font-weight: 800;
  color: var(--bth-deep-blue);
  letter-spacing: -0.02em;
  cursor: pointer;
}

.ui-web-command-strip__search-container {
  flex: 1;
  min-width: 0;
  max-width: 420px;
  position: relative;
}

.ui-web-command-strip__search-input {
  width: 100%;
  height: 42px;
  padding: 0 44px;
  border-radius: 12px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: rgba(10, 47, 92, 0.03);
  font-size: 14px;
  color: var(--bth-deep-blue);
  transition: all 0.2s ease;
}

.ui-web-command-strip__search-input:focus {
  outline: none;
  background: #fff;
  border-color: var(--bth-orange);
  box-shadow: 0 0 0 4px rgba(255, 80, 13, 0.08);
}

.ui-web-command-strip__search-icon {
  position: absolute;
  top: 50%;
  inset-inline-start: 14px;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 18px;
}

.ui-web-command-strip__filters {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  background: rgba(10, 47, 92, 0.04);
  padding: 4px;
  border-radius: 10px;
}

.ui-web-command-strip__filter-chip {
  height: 32px;
  padding: 0 12px;
  border-radius: 7px;
  border: none;
  background: transparent;
  color: #64748b;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}

.ui-web-command-strip__filter-chip--active {
  background: #fff;
  color: var(--bth-deep-blue);
  box-shadow: 0 2px 8px rgba(10, 47, 92, 0.08);
}

.ui-web-command-strip__actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.ui-web-command-strip__action-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 18px;
}

.ui-web-command-strip__action-btn:hover {
  background: rgba(10, 47, 92, 0.05);
  color: var(--bth-deep-blue);
}

.ui-web-command-strip__user-profile {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--bth-deep-blue), #1e4b8a);
  border: 2px solid #fff;
  box-shadow: 0 4px 10px rgba(10, 47, 92, 0.15);
  cursor: pointer;
}

.ui-web-command-center__workspace {
  display: grid;
  min-height: 0;
  height: 100%;
  grid-template-columns: var(--rail-width) minmax(0, 1fr);
  grid-template-areas: "rail stage";
  transition: grid-template-columns 0.22s ease;
  overflow: hidden;
}

.ui-web-command-center-root[dir="rtl"] .ui-web-command-center__workspace {
  grid-template-columns: var(--rail-width) minmax(0, 1fr);
  grid-template-areas: "rail stage";
}

.ui-web-command-center__rail {
  grid-area: rail;
  background: #fff;
  border-inline-end: 1px solid var(--bth-shell-line);
  padding: 14px 10px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;
  height: 100%;
  min-height: 0;
  z-index: 90;
  overflow: hidden;
}

.ui-web-command-center__rail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 10px;
}

.ui-web-command-center__rail-header-main {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.ui-web-command-center__rail-navigation-label {
  color: #64748b;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.02em;
}

.ui-web-command-center__rail-status-label {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 4px 8px;
  border-radius: 999px;
  background: rgba(10, 47, 92, 0.06);
  color: var(--bth-deep-blue);
  font-size: 11px;
  font-weight: 800;
}

.ui-web-command-center__rail-toggle {
  appearance: none;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
  color: var(--bth-deep-blue);
  width: 32px;
  height: 32px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  font-weight: 900;
  box-shadow: 0 4px 12px rgba(10, 47, 92, 0.06);
}

.ui-web-command-center__rail-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-height: 0;
  overflow: hidden;
}

.ui-web-command-center__rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: start;
  overflow: hidden;
}

.ui-web-command-center__rail-item:hover {
  background: rgba(10, 47, 92, 0.04);
  color: var(--bth-deep-blue);
}

.ui-web-command-center__rail-item--active {
  background: rgba(255, 80, 13, 0.1);
  color: var(--bth-orange);
  border-color: rgba(255, 80, 13, 0.18);
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.6);
}

.ui-web-command-center__rail-item-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex: 0 0 auto;
}

.ui-web-command-center__rail-item-text {
  flex: 1;
  min-width: 0;
}

.ui-web-command-center__rail-item-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex: 0 0 auto;
  padding: 3px 7px;
  border-radius: 999px;
  background: rgba(10, 47, 92, 0.08);
  color: #64748b;
  font-size: 10px;
  font-weight: 800;
  white-space: nowrap;
}

.ui-web-command-center__rail-back {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  margin-bottom: 8px;
  border: none;
  background: transparent;
  color: var(--bth-orange);
  font-weight: 800;
  font-size: 13px;
  cursor: pointer;
}

.ui-web-command-center__rail-section-title {
  padding: 0;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.ui-web-command-center__stage {
  grid-area: stage;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 18px 20px;
  background: #f8fafc;
  height: 100%;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.ui-web-command-center__stage-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 0;
  overflow: hidden;
}

.ui-web-command-strip__alert-badge {
  position: absolute;
  top: 8px;
  inset-inline-end: 8px;
  width: 8px;
  height: 8px;
  background: var(--bth-orange);
  border-radius: 50%;
  border: 2px solid #fff;
}

.ui-web-command-center-root[data-rail-collapsed="true"] {
  --rail-width: 64px;
}

.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail {
  padding-inline: 8px;
  align-items: center;
}

.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-header {
  width: 100%;
  justify-content: center;
}

.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-header-main,
.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-section-title,
.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-navigation-label,
.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-status-label,
.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-supplementary {
  display: none;
}

.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-nav {
  width: 100%;
}

.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-item {
  width: 44px;
  min-height: 44px;
  margin-inline: auto;
  padding: 0;
  border-radius: 14px;
  justify-content: center;
}

.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-item-text,
.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-item-badge {
  display: none;
}

.ui-web-command-center-root[data-rail-collapsed="true"] .ui-web-command-center__rail-item-icon {
  width: 28px;
  height: 28px;
  font-size: 20px;
}

/* === ControlPanel: KpiStrip === */
.ui-web-cp-kpi-strip {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  padding: 8px 14px;
  background: #FFFFFF;
  border-bottom: 1px solid rgba(10,47,92,0.06);
  overflow: hidden;
}
.ui-web-cp-kpi-item {
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
  background: #FFFFFF;
  border: 1px solid rgba(10,47,92,0.08);
  border-radius: 12px;
  min-width: 110px;
  flex-shrink: 0;
}
.ui-web-cp-kpi-item__label {
  font-size: 11px;
  font-weight: 800;
  color: #64748B;
  letter-spacing: 0;
}
.ui-web-cp-kpi-item__value {
  font-size: 16px;
  font-weight: 900;
  color: #0A2F5C;
  line-height: 1.2;
}
.ui-web-cp-kpi-item--danger .ui-web-cp-kpi-item__value { color: #DC2626; }
.ui-web-cp-kpi-item--warning .ui-web-cp-kpi-item__value { color: #D97706; }
.ui-web-cp-kpi-item--success .ui-web-cp-kpi-item__value { color: #16A34A; }

/* === ControlPanel: WorkspaceTabs === */
.ui-web-cp-workspace-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 10px 14px 8px;
  background: #FFFFFF;
  border-bottom: 1px solid rgba(10,47,92,0.08);
  overflow: hidden;
}
.ui-web-cp-workspace-tab {
  flex-shrink: 0;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 700;
  color: #64748B;
  background: #FFFFFF;
  border: 1px solid rgba(10,47,92,0.12);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  gap: 6px;
}
.ui-web-cp-workspace-tab:hover { background: rgba(10,47,92,0.03); color: #0A2F5C; }
.ui-web-cp-workspace-tab--active { background: #FF500D; color: #FFFFFF; border-color: #FF500D; box-shadow: 0 8px 18px rgba(255, 80, 13, 0.18); }
.ui-web-cp-workspace-tab--active:hover { background: #e94900; }

/* === ControlPanel: SubTabs === */
.ui-web-cp-sub-tabs {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
  padding: 8px 14px 10px;
  background: #F8FAFC;
  border-bottom: 1px solid rgba(10,47,92,0.06);
  overflow: hidden;
}
.ui-web-cp-sub-tab {
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #64748B;
  background: #FFFFFF;
  border: 1px solid rgba(10,47,92,0.08);
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s ease;
}
.ui-web-cp-sub-tab:hover { background: rgba(10,47,92,0.03); color: #0A2F5C; }
.ui-web-cp-sub-tab--active { background: rgba(255, 80, 13, 0.1); color: #FF500D; border-color: rgba(255, 80, 13, 0.22); }

.ui-web-command-center__hero { margin-bottom: 16px; }
.ui-web-command-center__hero-title {
  font-size: 32px;
  font-weight: 900;
  color: #0A2F5C;
  margin: 0;
}
.ui-web-command-center__hero-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 8px 0 0;
}
`;


function WebCommandCenterStyles() {
  return <style>{webCommandCenterCss}</style>;
}

export type WebCommandCenterFilter = {
  id: string;
  label: string;
  icon?: string;
  metaLabel?: string;
  active?: boolean;
};

export type WebCommandCenterNavItem = {
  id: string;
  label: string;
  href?: string;
  icon?: string;
  description?: string;
  badge?: string;
  active?: boolean;
  children?: ReadonlyArray<WebCommandCenterNavItem>;
};

export type WebCommandStripFilter = WebCommandCenterFilter;

export type WebCommandStripProps = {
  brandLabel: string;
  surfaceTitle?: string;
  searchPlaceholder?: string;
  languageLabel?: string;
  alertCountLabel?: string;
  refreshLabel?: string;
  filters?: ReadonlyArray<WebCommandStripFilter>;
  onFilterSelect?: (filterId: string) => void;
  onBrandClick?: () => void;
  onSearchClick?: () => void;
  onRefreshClick?: () => void;
  onLanguageClick?: () => void;
  onAlertClick?: () => void;
};

export function WebCommandStrip({
  brandLabel,
  surfaceTitle = 'لوحة التحكم',
  searchPlaceholder,
  languageLabel,
  alertCountLabel = '1',
  filters = [],
  onFilterSelect,
  onBrandClick,
  onSearchClick,
  onRefreshClick,
  onLanguageClick,
  onAlertClick,
}: WebCommandStripProps) {
  const { direction } = useDirection();
  const { toggleLanguage } = useUiLanguage();
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const resolvedSearchPlaceholder = searchPlaceholder ?? panelText.ui.searchPlaceholder;
  const resolvedLanguageLabel = languageLabel ?? panelText.ui.languageLabel;
  const resolvedLanguageClick = onLanguageClick ?? toggleLanguage;

  return (
    <>
      <WebCommandCenterStyles />
      <header className="ui-web-command-strip" dir={direction}>
        <div className="ui-web-command-strip__identity">
          <button type="button" className="ui-web-command-strip__surface-title" onClick={onBrandClick}>
            {surfaceTitle}
          </button>
          <div className="ui-web-command-strip__filters">
            {filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={[
                  'ui-web-command-strip__filter-chip',
                  filter.active ? 'ui-web-command-strip__filter-chip--active' : '',
                ].join(' ')}
                onClick={() => onFilterSelect?.(filter.id)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <div className="ui-web-command-strip__search-container">
          <span className="ui-web-command-strip__search-icon">⌕</span>
          <input
            type="text"
            className="ui-web-command-strip__search-input"
            placeholder={resolvedSearchPlaceholder}
            readOnly
            onClick={onSearchClick}
          />
        </div>

        <div className="ui-web-command-strip__actions">
          <button type="button" className="ui-web-command-strip__action-btn" onClick={onAlertClick}>
            ⊙
            {parseInt(alertCountLabel) > 0 && <span className="ui-web-command-strip__alert-badge" />}
          </button>
          <button type="button" className="ui-web-command-strip__action-btn" onClick={onRefreshClick}>
            ↻
          </button>
          <button type="button" className="ui-web-command-strip__action-btn" onClick={resolvedLanguageClick}>
            {resolvedLanguageLabel}
          </button>
          <div className="ui-web-command-strip__user-profile" title="User Profile" />
        </div>
      </header>
    </>
  );
}

export type WebCommandCenterFrameProps = {
  brandLabel: string;
  surfaceTitle: string;
  surfaceSubtitle?: string;
  showHero?: boolean;
  searchPlaceholder?: string;
  languageLabel?: string;
  alertCountLabel?: string;
  refreshLabel?: string;
  topFilters?: ReadonlyArray<WebCommandCenterFilter>;
  onTopFilterSelect?: (filterId: string) => void;
  onBrandClick?: () => void;
  onSearchClick?: () => void;
  onRefreshClick?: () => void;
  onAlertClick?: () => void;
  onRailItemSelect?: (itemId: string) => void;
  railTitle: string;
  railNavigationLabel?: string;
  railStatusLabel?: string;
  railItems: ReadonlyArray<WebCommandCenterNavItem>;
  railSupplementary?: ReactNode;
  children?: ReactNode;
};

export function WebCommandCenterFrame({
  brandLabel,
  surfaceTitle,
  surfaceSubtitle,
  showHero = true,
  searchPlaceholder,
  languageLabel,
  alertCountLabel = '1',
  refreshLabel,
  topFilters = [],
  onTopFilterSelect,
  onBrandClick,
  onSearchClick,
  onRefreshClick,
  onAlertClick,
  onRailItemSelect,
  railTitle,
  railNavigationLabel,
  railStatusLabel,
  railItems,
  railSupplementary,
  children,
}: WebCommandCenterFrameProps) {
  const { direction } = useDirection();
  const [activeSubStack, setActiveSubStack] = React.useState<WebCommandCenterNavItem | null>(null);
  const [isRailCollapsed, setIsRailCollapsed] = React.useState(false);

  const displayedItems = activeSubStack?.children ?? railItems;

  const handleItemClick = (item: WebCommandCenterNavItem) => {
    if (item.children && item.children.length > 0) {
      setActiveSubStack(item);
    } else {
      onRailItemSelect?.(item.id);
    }
  };

  return (
    <>
      <WebCommandCenterStyles />
      <main className="ui-web-command-center-root" dir={direction} data-rail-collapsed={isRailCollapsed ? 'true' : 'false'}>
        <WebCommandStrip
          brandLabel={brandLabel}
          surfaceTitle={surfaceTitle}
          searchPlaceholder={searchPlaceholder}
          languageLabel={languageLabel}
          alertCountLabel={alertCountLabel}
          refreshLabel={refreshLabel}
          filters={topFilters}
          onFilterSelect={onTopFilterSelect}
          onBrandClick={onBrandClick}
          onSearchClick={onSearchClick}
          onRefreshClick={onRefreshClick}
          onAlertClick={onAlertClick}
        />

        <div className="ui-web-command-center__workspace">
          <aside className="ui-web-command-center__rail">
            <div className="ui-web-command-center__rail-header">
              <div className="ui-web-command-center__rail-header-main">
                <div className="ui-web-command-center__rail-section-title">{activeSubStack ? activeSubStack.label : railTitle}</div>
                {railNavigationLabel ? <div className="ui-web-command-center__rail-navigation-label">{railNavigationLabel}</div> : null}
                {railStatusLabel ? <div className="ui-web-command-center__rail-status-label">{railStatusLabel}</div> : null}
              </div>

              <button
                type="button"
                className="ui-web-command-center__rail-toggle"
                aria-label={isRailCollapsed ? 'فتح الشريط الجانبي' : 'طي الشريط الجانبي'}
                title={isRailCollapsed ? 'فتح الشريط الجانبي' : 'طي الشريط الجانبي'}
                onClick={() => setIsRailCollapsed((current) => !current)}
              >
                {direction === 'rtl'
                  ? (isRailCollapsed ? '‹' : '›')
                  : (isRailCollapsed ? '›' : '‹')}
              </button>
            </div>

            {activeSubStack ? (
              <button
                type="button"
                className="ui-web-command-center__rail-back"
                onClick={() => setActiveSubStack(null)}
                title={direction === 'rtl' ? 'عودة' : 'Back'}
              >
                {direction === 'rtl' ? '← عودة' : '← Back'}
              </button>
            ) : null}

            <nav className="ui-web-command-center__rail-nav">
              {displayedItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'ui-web-command-center__rail-item',
                    item.active ? 'ui-web-command-center__rail-item--active' : '',
                  ].join(' ')}
                  aria-current={item.active ? 'page' : undefined}
                  title={item.description ? `${item.label} — ${item.description}` : item.label}
                  onClick={() => handleItemClick(item)}
                >
                  <span className="ui-web-command-center__rail-item-icon">
                    {item.icon ?? item.label.charAt(0)}
                  </span>
                  <span className="ui-web-command-center__rail-item-text">{item.label}</span>
                  {item.badge && (
                    <span className="ui-web-command-center__rail-item-badge">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            {railSupplementary && !isRailCollapsed && (
              <div className="ui-web-command-center__rail-supplementary">{railSupplementary}</div>
            )}
          </aside>

          <section className="ui-web-command-center__stage">
            {showHero && (
              <div className="ui-web-command-center__hero">
                <h1 className="ui-web-command-center__hero-title">{surfaceTitle}</h1>
                {surfaceSubtitle && (
                  <p className="ui-web-command-center__hero-subtitle">{surfaceSubtitle}</p>
                )}
              </div>
            )}
            <div className="ui-web-command-center__stage-content">{children}</div>
          </section>
        </div>
      </main>
    </>
  );
}

export type WebSegmentedTabItem = {
  id: string;
  label: string;
  metaLabel?: string;
  active?: boolean;
};

export type WebSegmentedTabsProps = {
  items: ReadonlyArray<WebSegmentedTabItem>;
  ariaLabel: string;
  onSelect?: (itemId: string) => void;
};

export function WebSegmentedTabs({ items, ariaLabel, onSelect }: WebSegmentedTabsProps) {
  const { direction } = useDirection();
  return (
    <div className="ui-web-segmented-tabs" aria-label={ariaLabel} dir={direction}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className={[
            'ui-web-segmented-tabs__tab',
            item.active ? 'ui-web-segmented-tabs__tab--active' : '',
          ].join(' ')}
          onClick={() => onSelect?.(item.id)}
        >
          <span className="ui-web-segmented-tabs__label">{item.label}</span>
          {item.metaLabel && <span className="ui-web-segmented-tabs__meta">{item.metaLabel}</span>}
        </button>
      ))}
    </div>
  );
}

export type WebRailServiceItem = {
  id: string;
  label: string;
  status?: string;
};

export type WebRailServiceListProps = {
  title: string;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  selectedServiceId?: string;
  onServiceSelect?: (serviceId: string) => void;
  items: ReadonlyArray<WebRailServiceItem>;
};

export function WebRailServiceList({
  title,
  items,
  selectedServiceId,
  onServiceSelect,
}: WebRailServiceListProps) {
  return (
    <section className="ui-web-rail-service-list">
      <h3 className="ui-web-rail-service-list__title">{title}</h3>
      <div className="ui-web-rail-service-list__list">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onServiceSelect?.(item.id)}
            className={[
              'ui-web-command-center__rail-item',
              selectedServiceId === item.id ? 'ui-web-command-center__rail-item--active' : '',
            ].join(' ')}
          >
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}


// ─── Control Panel Lane Primitives ────────────────────────────────────────────

/** Alias — WebCommandCenterFrame as the ControlPanel root shell. */
export const WebControlPanelFrame = WebCommandCenterFrame;
export type WebControlPanelFrameProps = WebCommandCenterFrameProps;

export type WebControlPanelKpiTone = 'neutral' | 'success' | 'warning' | 'danger';
export type WebControlPanelKpiItem = { id: string; label: string; value: string; tone?: WebControlPanelKpiTone };
export type WebControlPanelKpiStripProps = { items: ReadonlyArray<WebControlPanelKpiItem> };
export function WebControlPanelKpiStrip({ items }: WebControlPanelKpiStripProps) {
  return (
    <>
      <WebCommandCenterStyles />
      <div className="ui-web-cp-kpi-strip">
        {items.map((item) => (
          <div
            key={item.id}
            className={['ui-web-cp-kpi-item', item.tone && item.tone !== 'neutral' ? `ui-web-cp-kpi-item--${item.tone}` : ''].filter(Boolean).join(' ')}
          >
            <span className="ui-web-cp-kpi-item__label">{item.label}</span>
            <span className="ui-web-cp-kpi-item__value">{item.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export type WebControlPanelWorkspaceTabItem = { id: string; label: string; badge?: string; active?: boolean };
export type WebControlPanelWorkspaceTabsProps = {
  items: ReadonlyArray<WebControlPanelWorkspaceTabItem>;
  onSelect?: (id: string) => void;
  ariaLabel?: string;
};
export function WebControlPanelWorkspaceTabs({ items, onSelect, ariaLabel }: WebControlPanelWorkspaceTabsProps) {
  return (
    <>
      <WebCommandCenterStyles />
      <nav className="ui-web-cp-workspace-tabs" aria-label={ariaLabel}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={['ui-web-cp-workspace-tab', item.active ? 'ui-web-cp-workspace-tab--active' : ''].filter(Boolean).join(' ')}
            aria-current={item.active ? 'page' : undefined}
            onClick={() => onSelect?.(item.id)}
          >
            {item.label}{item.badge && <span>{item.badge}</span>}
          </button>
        ))}
      </nav>
    </>
  );
}

export type WebControlPanelSubTabItem = { id: string; label: string; active?: boolean };
export type WebControlPanelSubTabsProps = {
  items: ReadonlyArray<WebControlPanelSubTabItem>;
  onSelect?: (id: string) => void;
  ariaLabel?: string;
};
export function WebControlPanelSubTabs({ items, onSelect, ariaLabel }: WebControlPanelSubTabsProps) {
  return (
    <>
      <WebCommandCenterStyles />
      <nav className="ui-web-cp-sub-tabs" aria-label={ariaLabel}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={['ui-web-cp-sub-tab', item.active ? 'ui-web-cp-sub-tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => onSelect?.(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </>
  );
}
