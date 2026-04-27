import React, { type ReactNode } from 'react';
import { useDirection, useUiLanguage, useUiText } from '../providers';

const webCommandCenterCss = `
.bth-web-command-center-root {
  display: grid;
  gap: 20px;
}

.bth-web-command-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 18px;
  border-radius: 18px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: linear-gradient(135deg, rgba(10, 47, 92, 0.02) 0%, rgba(255, 80, 13, 0.015) 100%);
  box-shadow: 0 2px 12px rgba(10, 47, 92, 0.04);
  flex-wrap: wrap;
}

.bth-web-command-strip__top-row,
.bth-web-command-strip__secondary-row,
.bth-web-command-strip__identity,
.bth-web-command-strip__actions,
.bth-web-rail-service-list__list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.bth-web-command-strip__filter-row {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-shrink: 0;
  max-width: 100%;
}

.bth-web-command-strip__filter-row::-webkit-scrollbar {
  display: none;
}

.bth-web-command-strip__top-row,
.bth-web-command-strip__secondary-row {
  justify-content: space-between;
  align-items: center;
}

.bth-web-command-strip__identity {
  align-items: center;
}

.bth-web-command-strip__pill,
.bth-web-command-strip__filter-chip,
.bth-web-command-strip__refresh,
.bth-web-command-strip__search,
.bth-web-command-strip__language,
.bth-web-command-strip__alert,
.bth-web-rail-service-list__item {
  border: 1px solid rgba(10, 47, 92, 0.14);
  background: #ffffff;
  border-radius: 999px;
  padding: 10px 14px;
  font: inherit;
  color: #0A2F5C;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
}

.bth-web-command-strip__pill:hover,
.bth-web-command-strip__filter-chip:hover,
.bth-web-command-strip__refresh:hover,
.bth-web-command-strip__search:hover,
.bth-web-command-strip__language:hover,
.bth-web-command-strip__alert:hover {
  border-color: #FF500D;
  transform: translateY(-1px);
}

.bth-web-command-strip__brand {
  background: #FF500D;
  color: #ffffff;
  border-color: #FF500D;
  font-weight: 700;
}

.bth-web-command-strip__brand:hover {
  background: #E64A00;
  border-color: #E64A00;
  transform: translateY(-1px);
}

.bth-web-command-strip__search {
  min-width: 240px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
}

.bth-web-command-strip__search-icon {
  font-size: 18px;
  line-height: 1;
  color: #FF500D;
}

.bth-web-command-strip__search-placeholder {
  color: #64748b;
}

.bth-web-command-strip__filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.bth-web-command-strip__filter-chip--active,
.bth-web-rail-service-list__item--active {
  border-color: #FF500D;
  background: #FFF4ED;
  color: #0A2F5C;
}

.bth-web-command-strip__filter-meta,
.bth-web-rail-service-list__status {
  color: #64748b;
  font-size: 12px;
}

.bth-web-command-strip__filter-label,
.bth-web-rail-service-list__label,
.bth-web-segmented-tabs__label {
  font-weight: 600;
}

.bth-web-command-center__hero {
  display: none;
}

.bth-web-command-center__eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #FF500D;
  font-weight: 700;
}

.bth-web-command-center__title {
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  color: #0A2F5C;
}

.bth-web-command-center__subtitle {
  margin: 0;
  font-size: 14px;
  line-height: 1.5;
  color: #475569;
}

 .bth-web-command-center__workspace {
   display: grid;
   grid-template-columns: minmax(0, 1fr) 288px;
   gap: 24px;
   align-items: start;
   direction: rtl;
 }

 [dir="ltr"] .bth-web-command-center__workspace {
   grid-template-columns: 288px minmax(0, 1fr);
   direction: ltr;
 }

@media (max-width: 900px) {
  .bth-web-command-center__workspace {
    grid-template-columns: 1fr;
  }
}

.bth-web-command-center__stage,
.bth-web-command-center__rail {
  display: grid;
  gap: 16px;
}

.bth-web-command-center__rail {
  position: sticky;
  top: 20px;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: linear-gradient(180deg, rgba(10, 47, 92, 0.015) 0%, rgba(255, 255, 255, 1) 40%);
  box-shadow: 0 4px 16px rgba(10, 47, 92, 0.04);
  backdrop-filter: blur(8px);
}

.bth-web-command-center__rail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid rgba(10, 47, 92, 0.06);
}

.bth-web-command-center__rail-title {
  margin: 0;
  font-size: 15px;
  color: #0A2F5C;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.bth-web-command-center__rail-status {
  font-size: 11px;
  color: #64748b;
  font-weight: 700;
  background: rgba(10, 47, 92, 0.04);
  padding: 4px 10px;
  border-radius: 999px;
}

.bth-web-command-center__rail-nav {
  display: grid;
  gap: 10px;
}

.bth-web-command-center__rail-item {
  display: grid;
  gap: 4px;
  text-align: start;
  border-radius: 18px;
  border: 1px solid rgba(10, 47, 92, 0.1);
  background: #ffffff;
  padding: 14px;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease;
}

.bth-web-command-center__rail-item:hover {
  border-color: rgba(255, 80, 13, 0.3);
  transform: translateY(-1px);
}

.bth-web-command-center__rail-item--active {
  border-color: #FF500D;
  background: #FFF4ED;
}

.bth-web-command-center__rail-item-title {
  font-weight: 700;
  color: #0A2F5C;
}

.bth-web-command-center__rail-item-description,
.bth-web-command-center__rail-supplementary {
  color: #475569;
  font-size: 14px;
  line-height: 1.6;
}

.bth-web-command-center__rail-badge {
  display: inline-flex;
  align-self: flex-start;
  padding: 4px 8px;
  border-radius: 999px;
  background: #FFEDD5;
  color: #0A2F5C;
  font-size: 12px;
  font-weight: 700;
}

.bth-web-rail-service-list {
  display: grid;
  gap: 12px;
}

.bth-web-rail-service-list__title {
  margin: 0;
  font-size: 18px;
  color: #0A2F5C;
  font-weight: 700;
}

.bth-web-rail-service-list__search {
  border: 1px solid rgba(10, 47, 92, 0.14);
  border-radius: 18px;
  padding: 12px 14px;
  font: inherit;
  color: #0A2F5C;
}

.bth-web-rail-service-list__search:focus {
  outline: none;
  border-color: #FF500D;
}

.bth-web-rail-service-list__list {
  flex-direction: column;
}

.bth-web-segmented-tabs {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px;
  scroll-snap-type: x mandatory;
}

.bth-web-segmented-tabs::-webkit-scrollbar {
  display: none;
}

.bth-web-segmented-tabs__tab {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  border: 1px solid rgba(10, 47, 92, 0.14);
  background: #ffffff;
  border-radius: 999px;
  padding: 10px 18px;
  font: inherit;
  color: #0A2F5C;
  cursor: pointer;
  white-space: nowrap;
  scroll-snap-align: start;
  transition: border-color 0.15s ease, background 0.15s ease, box-shadow 0.15s ease;
}

.bth-web-segmented-tabs__tab:hover {
  border-color: rgba(255, 80, 13, 0.3);
}

.bth-web-segmented-tabs__tab--active {
  border-color: #FF500D;
  background: linear-gradient(180deg, #FFF4ED 0%, #FFE6D9 100%);
  box-shadow: 0 2px 12px rgba(255, 80, 13, 0.15);
  color: #0A2F5C;
}

.bth-web-segmented-tabs__meta {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.bth-web-segmented-tabs__tab--active .bth-web-segmented-tabs__meta {
  color: #FF500D;
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
  description?: string;
  badge?: string;
  active?: boolean;
};

export type WebCommandStripFilter = WebCommandCenterFilter;

export type WebCommandStripProps = {
  brandLabel: string;
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
  searchPlaceholder,
  languageLabel,
  alertCountLabel = '1',
  refreshLabel,
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
  const resolvedRefreshLabel = refreshLabel ?? panelText.ui.refreshLabel;
  const resolvedLanguageClick = onLanguageClick ?? toggleLanguage;

  return (
    <>
      <WebCommandCenterStyles />
      <header className="bth-web-command-strip" dir={direction}>
        <div className="bth-web-command-strip__identity">
          <button type="button" className="bth-web-command-strip__pill bth-web-command-strip__brand" onClick={onBrandClick}>
            {brandLabel}
          </button>
          <button type="button" className="bth-web-command-strip__pill bth-web-command-strip__alert" onClick={onAlertClick} aria-label={panelText.ui.alertCountLabel}>
            {alertCountLabel}
          </button>
        </div>

        <div className="bth-web-command-strip__filter-row">
          {filters.length > 0 ? filters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              className={['bth-web-command-strip__filter-chip', filter.active ? 'bth-web-command-strip__filter-chip--active' : ''].filter(Boolean).join(' ')}
              onClick={() => onFilterSelect?.(filter.id)}
            >
              {filter.icon ? <span className="bth-web-command-strip__filter-icon">{filter.icon}</span> : null}
              <span className="bth-web-command-strip__filter-label">{filter.label}</span>
              {filter.metaLabel ? <span className="bth-web-command-strip__filter-meta">{filter.metaLabel}</span> : null}
            </button>
          )) : null}
        </div>

        <div className="bth-web-command-strip__actions">
          <button type="button" className="bth-web-command-strip__pill bth-web-command-strip__search" onClick={onSearchClick}>
            <span className="bth-web-command-strip__search-icon">⌕</span>
            <span className="bth-web-command-strip__search-placeholder">{resolvedSearchPlaceholder}</span>
          </button>
          <button type="button" className="bth-web-command-strip__pill bth-web-command-strip__refresh" onClick={onRefreshClick}>
            {resolvedRefreshLabel}
          </button>
          <button type="button" className="bth-web-command-strip__pill bth-web-command-strip__language" onClick={resolvedLanguageClick}>
            {resolvedLanguageLabel}
          </button>
        </div>
      </header>
    </>
  );
}

function renderRailItems(
  items: ReadonlyArray<WebCommandCenterNavItem>,
  railNavigationLabel: string,
  onRailItemSelect?: (itemId: string) => void,
) {
  return (
    <nav className="bth-web-command-center__rail-nav" aria-label={railNavigationLabel}>
      {items.map((item) => {
        const className = ['bth-web-command-center__rail-item', item.active ? 'bth-web-command-center__rail-item--active' : ''].filter(Boolean).join(' ');

        if (item.href) {
          return (
            <a
              key={item.id}
              href={item.href}
              onClick={(event) => {
                if (onRailItemSelect) {
                  event.preventDefault();
                }

                onRailItemSelect?.(item.id);
              }}
              className={className}
            >
              <span className="bth-web-command-center__rail-item-title">{item.label}</span>
              {item.description ? <span className="bth-web-command-center__rail-item-description">{item.description}</span> : null}
              {item.badge ? <span className="bth-web-command-center__rail-badge">{item.badge}</span> : null}
            </a>
          );
        }

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onRailItemSelect?.(item.id)}
            className={className}
          >
            <span className="bth-web-command-center__rail-item-title">{item.label}</span>
            {item.description ? <span className="bth-web-command-center__rail-item-description">{item.description}</span> : null}
            {item.badge ? <span className="bth-web-command-center__rail-badge">{item.badge}</span> : null}
          </button>
        );
      })}
    </nav>
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
  const uiText = useUiText();
  const panelText = uiText.controlPanel;
  const resolvedSearchPlaceholder = searchPlaceholder ?? panelText.ui.searchPlaceholder;
  const resolvedLanguageLabel = languageLabel ?? panelText.ui.languageLabel;
  const resolvedRefreshLabel = refreshLabel ?? panelText.ui.refreshLabel;
  const resolvedRailNavigationLabel = railNavigationLabel ?? panelText.ui.railNavigationLabel;

  return (
    <>
      <WebCommandCenterStyles />
      <main className="bth-web-command-center-root" dir={direction}>
        <WebCommandStrip
          brandLabel={brandLabel}
          searchPlaceholder={resolvedSearchPlaceholder}
          languageLabel={resolvedLanguageLabel}
          alertCountLabel={alertCountLabel}
          refreshLabel={resolvedRefreshLabel}
          filters={topFilters}
          onFilterSelect={onTopFilterSelect}
          onBrandClick={onBrandClick}
          onSearchClick={onSearchClick}
          onRefreshClick={onRefreshClick}
          onAlertClick={onAlertClick}
        />

        {showHero ? (
          <section className="bth-web-command-center__hero">
            <p className="bth-web-command-center__eyebrow">{brandLabel}</p>
            <h1 className="bth-web-command-center__title">{surfaceTitle}</h1>
            {surfaceSubtitle ? <p className="bth-web-command-center__subtitle">{surfaceSubtitle}</p> : null}
          </section>
        ) : null}

        <div className="bth-web-command-center__workspace">
          <section className="bth-web-command-center__stage">{children}</section>

          <aside className="bth-web-command-center__rail">
            <div className="bth-web-command-center__rail-header">
              <h2 className="bth-web-command-center__rail-title">{railTitle}</h2>
              {railStatusLabel ? <span className="bth-web-command-center__rail-status">{railStatusLabel}</span> : null}
            </div>
            {renderRailItems(railItems, resolvedRailNavigationLabel, onRailItemSelect)}
            {railSupplementary ? <div className="bth-web-command-center__rail-supplementary">{railSupplementary}</div> : null}
          </aside>
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
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const activeTab = container.querySelector('.bth-web-segmented-tabs__tab--active') as HTMLElement | null;
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }, [items]);

  return (
    <>
      <WebCommandCenterStyles />
      <div ref={containerRef} className="bth-web-segmented-tabs" aria-label={ariaLabel} dir={direction}>
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className={['bth-web-segmented-tabs__tab', item.active ? 'bth-web-segmented-tabs__tab--active' : ''].filter(Boolean).join(' ')}
            onClick={() => onSelect?.(item.id)}
          >
            <span className="bth-web-segmented-tabs__label">{item.label}</span>
            {item.metaLabel ? <span className="bth-web-segmented-tabs__meta">{item.metaLabel}</span> : null}
          </button>
        ))}
      </div>
    </>
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
  searchPlaceholder = 'بحث سريع...',
  searchValue = '',
  onSearchChange,
  selectedServiceId,
  onServiceSelect,
  items,
}: WebRailServiceListProps) {
  const visibleItems = React.useMemo(() => {
    const value = searchValue.trim().toLowerCase();

    if (!value) return items;

    return items.filter((item) => item.label.toLowerCase().includes(value));
  }, [items, searchValue]);

  return (
    <>
      <WebCommandCenterStyles />
      <section className="bth-web-rail-service-list">
        <h3 className="bth-web-rail-service-list__title">{title}</h3>
        <input
          className="bth-web-rail-service-list__search"
          type="search"
          value={searchValue}
          onChange={(event) => onSearchChange?.(event.target.value)}
          placeholder={searchPlaceholder}
        />
        <div className="bth-web-rail-service-list__list">
          {visibleItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => onServiceSelect?.(item.id)}
              className={['bth-web-command-center__rail-item', selectedServiceId === item.id ? 'bth-web-command-center__rail-item--active' : ''].filter(Boolean).join(' ')}
            >
              <span className="bth-web-rail-service-list__label">{item.label}</span>
              {item.status ? <span className="bth-web-rail-service-list__status">{item.status}</span> : null}
            </button>
          ))}
        </div>
      </section>
    </>
  );
}

