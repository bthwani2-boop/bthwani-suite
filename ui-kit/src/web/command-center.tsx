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
  gap: 0;
  align-content: start;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 0;
  background: #f8fafc;
  color: var(--bth-text);
  overflow-x: hidden;
}

.ui-web-command-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  padding: 12px 24px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--bth-shell-line);
  position: sticky;
  top: 0;
  z-index: 100;
  height: 72px;
}

.ui-web-command-strip__identity {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.ui-web-command-strip__surface-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--bth-deep-blue);
  letter-spacing: -0.02em;
}

.ui-web-command-strip__search-container {
  flex: 1;
  max-width: 480px;
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
  left: 14px;
  transform: translateY(-50%);
  color: #64748b;
  font-size: 18px;
}

.ui-web-command-center-root[dir="rtl"] .ui-web-command-strip__search-icon {
  left: auto;
  right: 14px;
}

.ui-web-command-strip__filters {
  display: flex;
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
  min-height: calc(100vh - 72px);
  grid-template-columns: var(--rail-width) 1fr;
  grid-template-areas: "rail stage";
}

.ui-web-command-center__rail {
  grid-area: rail;
  background: #fff;
  border-inline-end: 1px solid var(--bth-shell-line);
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: sticky;
  top: 72px;
  height: calc(100vh - 72px);
  z-index: 90;
}

.ui-web-command-center__rail-nav {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.ui-web-command-center__rail-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: #64748b;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: start;
}

.ui-web-command-center__rail-item:hover {
  background: rgba(10, 47, 92, 0.03);
  color: var(--bth-deep-blue);
}

.ui-web-command-center__rail-item--active {
  background: rgba(255, 80, 13, 0.06);
  color: var(--bth-orange);
}

.ui-web-command-center__rail-item-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
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
  padding: 0 12px 8px;
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  color: #94a3b8;
  letter-spacing: 0.05em;
}

.ui-web-command-center__stage {
  grid-area: stage;
  padding: 24px;
  background: #f8fafc;
}

.ui-web-command-strip__alert-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 8px;
  height: 8px;
  background: var(--bth-orange);
  border-radius: 50%;
  border: 2px solid #fff;
}

.ui-web-command-center-root[dir="rtl"] .ui-web-command-strip__alert-badge {
  right: auto;
  left: 8px;
}

@media (max-width: 1024px) {
  --rail-width: 72px;
  .ui-web-command-center__rail-item span:not(.ui-web-command-center__rail-item-icon) {
    display: none;
  }
}
`;


function WebCommandCenterStyles() {
  return <style>{webControlSurfaceCss + webCommandCenterCss}</style>;
}

const webControlSurfaceCss = `
/* Reusing some existing styles if needed, but the main ones are in webCommandCenterCss */
`;

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
          <div className="ui-web-command-strip__surface-title" onClick={onBrandClick} style={{ cursor: 'pointer' }}>
            {surfaceTitle}
          </div>
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
            🔔
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
      <main className="ui-web-command-center-root" dir={direction}>
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
            {activeSubStack ? (
              <>
                <button
                  type="button"
                  className="ui-web-command-center__rail-back"
                  onClick={() => setActiveSubStack(null)}
                >
                  {direction === 'rtl' ? '← عودة' : '← Back'}
                </button>
                <div className="ui-web-command-center__rail-section-title">{activeSubStack.label}</div>
              </>
            ) : (
              <div className="ui-web-command-center__rail-section-title">{railTitle}</div>
            )}
            <nav className="ui-web-command-center__rail-nav">
              {displayedItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className={[
                    'ui-web-command-center__rail-item',
                    item.active ? 'ui-web-command-center__rail-item--active' : '',
                  ].join(' ')}
                  onClick={() => handleItemClick(item)}
                >
                  <span className="ui-web-command-center__rail-item-icon">
                    {item.icon ?? item.label.charAt(0)}
                  </span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && (
                    <span style={{
                      fontSize: 10,
                      fontWeight: 800,
                      padding: '2px 6px',
                      borderRadius: 6,
                      background: item.active ? 'var(--bth-orange)' : 'rgba(10, 47, 92, 0.08)',
                      color: item.active ? '#fff' : '#64748b',
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}
            </nav>
            {railSupplementary && (
              <div className="ui-web-command-center__rail-supplementary">{railSupplementary}</div>
            )}
          </aside>

          <section className="ui-web-command-center__stage">
            {showHero && (
              <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0A2F5C', margin: 0 }}>
                  {surfaceTitle}
                </h1>
                {surfaceSubtitle && (
                  <p style={{ color: '#64748b', fontSize: 16, margin: '8px 0 0' }}>
                    {surfaceSubtitle}
                  </p>
                )}
              </div>
            )}
            {children}
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


