import React, { type ReactNode } from 'react';
import { useDirection, useUiLanguage, useUiText } from '../providers';

const webCommandCenterCss = `
.ui-web-command-center-root {
  --rail-width: 292px;
  --bth-shell-line: rgba(10, 47, 92, 0.1);
  display: grid;
  gap: 14px;
  align-content: start;
  min-height: 100vh;
  box-sizing: border-box;
  width: 100%;
  margin: 0;
  padding: 12px 14px 18px;
  background:
    linear-gradient(180deg, #f7f9fc 0%, #eef3f8 100%) !important;
  color: var(--bth-text);
}

.ui-web-command-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 14px;
  border: 1px solid var(--bth-shell-line);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.92) 0%, rgba(246, 249, 252, 0.94) 100%),
    var(--bth-surface, #ffffff) !important;
  box-shadow: 0 8px 22px rgba(10, 47, 92, 0.05) !important;
  flex-wrap: wrap;
  position: sticky;
  top: 12px;
  z-index: 30;
  backdrop-filter: blur(12px) saturate(110%);
}
.ui-web-command-strip__top-row,
.ui-web-command-strip__secondary-row,
.ui-web-command-strip__identity,
.ui-web-command-strip__actions,
.ui-web-rail-service-list__list {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.ui-web-command-strip__filter-row {
  display: flex;
  gap: 7px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  flex-shrink: 0;
  max-width: 100%;
}

.ui-web-command-strip__filter-row::-webkit-scrollbar {
  display: none;
}

.ui-web-command-strip__top-row,
.ui-web-command-strip__secondary-row {
  justify-content: space-between;
  align-items: center;
}

.ui-web-command-strip__identity {
  align-items: center;
}

.ui-web-command-strip__pill,
.ui-web-command-strip__filter-chip,
.ui-web-command-strip__refresh,
.ui-web-command-strip__search,
.ui-web-command-strip__language,
.ui-web-command-strip__alert,
.ui-web-rail-service-list__item {
  border: 1px solid var(--bth-shell-line);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96) 0%, rgba(246, 249, 252, 0.9) 100%);
  border-radius: 999px;
  padding: 10px 14px;
  font: inherit;
  color: #0A2F5C;
  cursor: pointer;
  transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
}

.ui-web-command-strip__pill:hover,
.ui-web-command-strip__filter-chip:hover,
.ui-web-command-strip__refresh:hover,
.ui-web-command-strip__search:hover,
.ui-web-command-strip__language:hover,
.ui-web-command-strip__alert:hover {
  border-color: #FF500D;
  transform: translateY(-1px);
  box-shadow: 0 10px 24px rgba(10, 47, 92, 0.08);
}

.ui-web-command-strip__brand {
  background: linear-gradient(135deg, #ff6a2f 0%, #FF500D 58%, #e94900 100%);
  color: #ffffff;
  border-color: #FF500D;
  font-weight: 800;
  letter-spacing: 0;
  box-shadow: 0 16px 30px rgba(255, 80, 13, 0.24);
}

.ui-web-command-strip__brand:hover {
  background: linear-gradient(135deg, #ff7340 0%, #FF500D 58%, #db4600 100%);
  border-color: #E64A00;
  transform: translateY(-1px);
}

.ui-web-command-strip__alert {
  min-width: 48px;
  justify-content: center;
  font-weight: 800;
}

.ui-web-command-strip__search {
  min-width: 220px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  justify-content: flex-start;
}

.ui-web-command-strip__search-icon {
  font-size: 18px;
  line-height: 1;
  color: #FF500D;
}

.ui-web-command-strip__search-placeholder {
  color: #64748b;
}

.ui-web-command-strip__filter-chip {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.ui-web-command-strip__filter-chip--active,
.ui-web-rail-service-list__item--active {
  border-color: #FF500D;
  background: linear-gradient(180deg, #fff4ed 0%, #ffe9de 100%);
  color: #0A2F5C;
  box-shadow: inset 0 0 0 1px rgba(255, 80, 13, 0.08);
}

  .ui-web-command-strip__filter-meta,
  .ui-web-rail-service-list__status {
    color: #64748b;
    font-size: 12px;
  }

  .ui-web-command-strip__filter-label,
  .ui-web-rail-service-list__label,
  .ui-web-segmented-tabs__label {
    font-weight: 600;
  }

  .ui-web-command-center__hero {
    display: none;
  }

  .ui-web-command-center__eyebrow {
    margin: 0;
    font-size: 12px;
    letter-spacing: 0.6px;
    text-transform: uppercase;
    color: #FF500D;
    font-weight: 700;
  }

  .ui-web-command-center__title {
    margin: 0;
    font-size: 24px;
    line-height: 1.2;
    color: #0A2F5C;
  }

  .ui-web-command-center__subtitle {
    margin: 0;
    font-size: 14px;
    line-height: 1.5;
    color: #475569;
  }

  .ui-web-command-center__workspace {
    display: grid;
    gap: 14px;
    align-items: stretch;
    min-height: calc(100vh - 116px);
    direction: ltr;
    /* Desktop: reserve space for a rail column so it does not overlay the stage */
    grid-template-columns: minmax(0, 1fr) var(--rail-width);
    grid-template-areas: "stage rail";
  }

  @media (max-width: 900px) {
    .ui-web-command-strip {
      position: static;
    }

    .ui-web-command-center__workspace {
      grid-template-columns: 1fr;
      grid-template-areas:
        "stage"
        "rail";
      min-height: auto;
    }
  }

  .ui-web-command-center__stage,
  .ui-web-command-center__rail {
    display: grid;
    gap: 16px;
  }

  .ui-web-command-center__stage {
    grid-area: stage;
    min-width: 0;
    align-content: start;
    min-height: calc(100vh - 132px);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    padding-inline-end: 6px;
    margin: 0;
  }

  .ui-web-command-center__rail {
    grid-area: rail;
  }

  @media (max-width: 900px) {
    .ui-web-command-center__stage,
    .ui-web-command-center__rail {
      min-height: auto;
      max-height: none;
      overflow: visible;
      padding-inline-end: 0;
    }
  }

  /* ensure direction is resolved from the component root only */
  .ui-web-command-center-root[dir="rtl"] .ui-web-command-center__stage,
  .ui-web-command-center-root[dir="rtl"] .ui-web-command-center__rail {
    direction: rtl;
  }

  .ui-web-command-center-root[dir="ltr"] .ui-web-command-center__stage,
  .ui-web-command-center-root[dir="ltr"] .ui-web-command-center__rail {
    direction: ltr;
  }

  .ui-web-command-center__rail {
    position: sticky;
    top: 78px;
    align-self: start;
    padding: 12px;
    border-radius: 14px;
    border: 1px solid var(--bth-shell-line);
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.94) 0%, rgba(244, 248, 252, 0.95) 100%),
      var(--bth-surface);
    box-shadow: 0 10px 24px rgba(10, 47, 92, 0.05);
    backdrop-filter: blur(12px) saturate(110%);
    width: var(--rail-width);
    overflow: auto;
    overscroll-behavior: contain;
    scrollbar-gutter: stable;
    transition: width 180ms ease;
    z-index: 40;
    height: calc(100vh - 96px);
  }

  @media (max-width: 900px) {
    .ui-web-command-center__rail {
      position: static;
      top: auto;
      width: 100%;
      max-height: none;
      overflow: visible;
      height: auto;
      z-index: auto;
    }
  }

  .ui-web-command-center-root[dir="rtl"] .ui-web-command-center__workspace {
    grid-template-columns: minmax(0, 1fr) var(--rail-width);
    grid-template-areas: "stage rail";
  }

  .ui-web-command-center-root[dir="ltr"] .ui-web-command-center__workspace {
    grid-template-columns: var(--rail-width) minmax(0, 1fr);
    grid-template-areas: "rail stage";
  }

  .ui-web-command-center-root[data-rail-collapsed="1"] {
    --rail-width: 72px;
  }

  .ui-web-command-center__rail[data-collapsed="1"] {
    width: var(--rail-width);
    overflow-x: hidden;
  }

  .ui-web-command-center__rail[data-collapsed="1"] .ui-web-command-center__rail-item-title,
  .ui-web-command-center__rail[data-collapsed="1"] .ui-web-command-center__rail-item-description,
  .ui-web-command-center__rail[data-collapsed="1"] .ui-web-command-center__rail-badge,
  .ui-web-command-center__rail[data-collapsed="1"] .ui-web-command-center__rail-status,
  .ui-web-command-center__rail[data-collapsed="1"] .ui-web-command-center__rail-title {
    display: none;
  }

  .ui-web-command-center-root[dir="rtl"] .ui-web-command-center__stage {
    margin: 0;
  }

  .ui-web-command-center-root[dir="ltr"] .ui-web-command-center__stage {
    margin: 0;
  }

  .ui-web-command-center__rail-item::before {
    content: attr(data-icon);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 10px;
    margin-inline-end: 8px;
    background: linear-gradient(180deg, rgba(10, 47, 92, 0.08) 0%, rgba(10, 47, 92, 0.02) 100%);
    color: #0A2F5C;
    font-weight: 800;
    box-shadow: inset 0 0 0 1px rgba(10, 47, 92, 0.04);
  }

  .ui-web-command-center-root[data-rail-collapsed="1"] .ui-web-command-center__rail-item::before {
    margin-inline: 0;
  }

  .ui-web-command-center__rail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding-bottom: 10px;
    border-bottom: 1px solid rgba(10, 47, 92, 0.06);
  }

  .ui-web-command-center__rail-title {
    margin: 0;
    font-size: 15px;
    color: #0A2F5C;
    font-weight: 900;
    letter-spacing: 0;
  }

  .ui-web-command-center__rail-status {
    font-size: 12px;
    color: #64748b;
    font-weight: 800;
    background: rgba(10, 47, 92, 0.04);
    padding: 6px 10px;
    border-radius: 999px;
  }

  .ui-web-command-center__rail-nav {
    display: grid;
    gap: 8px;
  }

  .ui-web-command-center__rail-item {
    display: grid;
    gap: 4px;
    text-align: start;
    border-radius: 10px;
    border: 1px solid rgba(10, 47, 92, 0.08);
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(244, 248, 252, 0.94) 100%);
    padding: 10px;
    cursor: pointer;
    transition: border-color 0.15s ease, background 0.15s ease, transform 0.1s ease, box-shadow 0.15s ease;
  }

  .ui-web-command-center__rail-item:hover {
    border-color: rgba(255, 80, 13, 0.3);
    transform: translateY(-1px);
    box-shadow: 0 6px 16px rgba(10, 47, 92, 0.05);
  }

  .ui-web-command-center__rail-item--active {
    border-color: #FF500D;
    background: linear-gradient(180deg, rgba(255, 244, 237, 0.98) 0%, rgba(255, 235, 224, 0.92) 100%);
    box-shadow: 0 8px 18px rgba(255, 80, 13, 0.1);
  }

  .ui-web-command-center__rail-item-title {
    font-size: 14px;
    font-weight: 900;
    color: #0A2F5C;
  }

  .ui-web-command-center__rail-item-description,
  .ui-web-command-center__rail-supplementary {
    color: #475569;
    font-size: 14px;
    line-height: 1.6;
  }

  .ui-web-command-center__rail-badge {
    display: inline-flex;
    align-self: flex-start;
    padding: 5px 9px;
    border-radius: 999px;
    background: linear-gradient(180deg, #fff0e6 0%, #ffe2d3 100%);
    color: #0A2F5C;
    font-size: 12px;
    font-weight: 800;
  }

  .ui-web-rail-service-list {
    display: grid;
    gap: 12px;
  }

  .ui-web-rail-service-list__title {
    margin: 0;
    font-size: 18px;
    color: #0A2F5C;
    font-weight: 700;
  }

  .ui-web-rail-service-list__search {
    border: 1px solid rgba(10, 47, 92, 0.14);
    border-radius: 18px;
    padding: 12px 14px;
    font: inherit;
    color: #0A2F5C;
  }

  .ui-web-rail-service-list__search:focus {
    outline: none;
    border-color: #FF500D;
  }

  .ui-web-command-center__rail-toggle {
    appearance: none;
    border: 1px solid rgba(10, 47, 92, 0.08);
    background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
    padding: 8px 10px;
    border-radius: 12px;
    cursor: pointer;
    color: #0A2F5C;
    font-weight: 800;
  }

  .ui-web-command-center__rail-toggle:hover {
    border-color: #FF500D;
    transform: translateY(-1px);
  }

  .ui-web-command-center__rail-header-actions {
    display: flex;
    gap: 8px;
    align-items: center;
  }

  .ui-web-rail-service-list__list {
    flex-direction: column;
  }

  .ui-web-segmented-tabs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding: 4px;
    scroll-snap-type: x mandatory;
  }

  .ui-web-segmented-tabs::-webkit-scrollbar {
    display: none;
  }

  .ui-web-segmented-tabs__tab {
    display: inline-flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .ui-web-segmented-tabs__tab:hover {
    border-color: rgba(255, 80, 13, 0.3);
  }

  .ui-web-segmented-tabs__tab--active {
    border-color: #FF500D;
    background: linear-gradient(180deg, #FFF4ED 0%, #FFE6D9 100%);
    box-shadow: 0 2px 12px rgba(255, 80, 13, 0.15);
    color: #0A2F5C;
  }

  .ui-web-segmented-tabs__tab {
    appearance: none;
    border: 1px solid rgba(10, 47, 92, 0.08);
    background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
    border-radius: 10px;
    padding: 8px 12px;
    min-width: 116px;
    cursor: pointer;
    transition: border-color 0.15s ease, transform 0.15s ease, box-shadow 0.15s ease;
  }

  .ui-web-segmented-tabs__tab:hover {
    transform: translateY(-1px);
    box-shadow: 0 10px 20px rgba(10, 47, 92, 0.06);
  }

  .ui-web-segmented-tabs__label {
    color: #0A2F5C;
    font-size: 13px;
  }

  @media (max-width: 900px) {
    .ui-web-command-center-root {
      padding-inline: 12px;
    }

    .ui-web-command-strip {
      border-radius: 12px;
      padding: 10px 12px;
    }
  }

  .ui-web-segmented-tabs__meta {
    font-size: 12px;
    color: #64748b;
    font-weight: 600;
  }

  .ui-web-segmented-tabs__tab--active .ui-web-segmented-tabs__meta {
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
        <header className="ui-web-command-strip" dir={direction}>
          <div className="ui-web-command-strip__identity">
            <button type="button" className="ui-web-command-strip__pill ui-web-command-strip__brand" onClick={onBrandClick}>
              {brandLabel}
            </button>
            <button type="button" className="ui-web-command-strip__pill ui-web-command-strip__alert" onClick={onAlertClick} aria-label={panelText.ui.alertCountLabel}>
              {alertCountLabel}
            </button>
          </div>

          <div className="ui-web-command-strip__filter-row">
            {filters.length > 0 ? filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                className={['ui-web-command-strip__filter-chip', filter.active ? 'ui-web-command-strip__filter-chip--active' : ''].filter(Boolean).join(' ')}
                onClick={() => onFilterSelect?.(filter.id)}
              >
                {filter.icon ? <span className="ui-web-command-strip__filter-icon">{filter.icon}</span> : null}
                <span className="ui-web-command-strip__filter-label">{filter.label}</span>
                {filter.metaLabel ? <span className="ui-web-command-strip__filter-meta">{filter.metaLabel}</span> : null}
              </button>
            )) : null}
          </div>

          <div className="ui-web-command-strip__actions">
            <button type="button" className="ui-web-command-strip__pill ui-web-command-strip__search" onClick={onSearchClick}>
              <span className="ui-web-command-strip__search-icon">⌕</span>
              <span className="ui-web-command-strip__search-placeholder">{resolvedSearchPlaceholder}</span>
            </button>
            <button type="button" className="ui-web-command-strip__pill ui-web-command-strip__refresh" onClick={onRefreshClick}>
              {resolvedRefreshLabel}
            </button>
            <button type="button" className="ui-web-command-strip__pill ui-web-command-strip__language" onClick={resolvedLanguageClick}>
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
      <nav className="ui-web-command-center__rail-nav" aria-label={railNavigationLabel}>
        {items.map((item) => {
          const className = ['ui-web-command-center__rail-item', item.active ? 'ui-web-command-center__rail-item--active' : ''].filter(Boolean).join(' ');
          const icon = (item as any).icon ?? (item.label ? item.label.charAt(0) : '•');

          if (item.href) {
            return (
              <a
                key={item.id}
                href={item.href}
                title={item.label}
                aria-label={item.label}
                aria-current={item.active ? 'page' : undefined}
                data-icon={icon}
                onClick={(event) => {
                  if (onRailItemSelect) {
                    event.preventDefault();
                  }

                  onRailItemSelect?.(item.id);
                }}
                className={className}
              >
                <span className="ui-web-command-center__rail-item-title">{item.label}</span>
                {item.description ? <span className="ui-web-command-center__rail-item-description">{item.description}</span> : null}
                {item.badge ? <span className="ui-web-command-center__rail-badge">{item.badge}</span> : null}
              </a>
            );
          }

          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
              data-icon={icon}
              onClick={() => onRailItemSelect?.(item.id)}
              className={className}
            >
              <span className="ui-web-command-center__rail-item-title">{item.label}</span>
              {item.description ? <span className="ui-web-command-center__rail-item-description">{item.description}</span> : null}
              {item.badge ? <span className="ui-web-command-center__rail-badge">{item.badge}</span> : null}
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
    const [railCollapsed, setRailCollapsed] = React.useState(false);
    const railToggleGlyph = direction === 'rtl'
      ? (railCollapsed ? '«' : '›')
      : (railCollapsed ? '»' : '‹');

    return (
      <>
        <WebCommandCenterStyles />
        <main className="ui-web-command-center-root" dir={direction} data-rail-collapsed={railCollapsed ? '1' : '0'}>
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
            <section className="ui-web-command-center__hero">
              <p className="ui-web-command-center__eyebrow">{brandLabel}</p>
              <h1 className="ui-web-command-center__title">{surfaceTitle}</h1>
              {surfaceSubtitle ? <p className="ui-web-command-center__subtitle">{surfaceSubtitle}</p> : null}
            </section>
          ) : null}

          <div className="ui-web-command-center__workspace">
            <section className="ui-web-command-center__stage">{children}</section>

            <aside
              id="ui-web-command-center-rail"
              className="ui-web-command-center__rail"
              data-collapsed={railCollapsed ? '1' : '0'}
              role="complementary"
            >
              <div className="ui-web-command-center__rail-header">
                <h2 className="ui-web-command-center__rail-title">{railTitle}</h2>
                <div className="ui-web-command-center__rail-header-actions">
                  {railStatusLabel ? <span className="ui-web-command-center__rail-status">{railStatusLabel}</span> : null}
                  <button
                    type="button"
                    className="ui-web-command-center__rail-toggle"
                    onClick={() => setRailCollapsed((s) => !s)}
                    aria-controls="ui-web-command-center-rail"
                    title={railCollapsed ? ((panelText as any)?.ui?.railExpandLabel ?? 'Expand sidebar') : ((panelText as any)?.ui?.railCollapseLabel ?? 'Collapse sidebar')}
                  >
                    {railToggleGlyph}
                  </button>
                </div>
              </div>
              {renderRailItems(railItems, resolvedRailNavigationLabel, onRailItemSelect)}
              {railSupplementary ? <div className="ui-web-command-center__rail-supplementary">{railSupplementary}</div> : null}
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
      const activeTab = container.querySelector('.ui-web-segmented-tabs__tab--active') as HTMLElement | null;
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      }
    }, [items]);

    return (
      <>
        <WebCommandCenterStyles />
        <div ref={containerRef} className="ui-web-segmented-tabs" aria-label={ariaLabel} dir={direction}>
          {items.map((item) => (
            <button
              key={item.id}
              type="button"
              className={['ui-web-segmented-tabs__tab', item.active ? 'ui-web-segmented-tabs__tab--active' : ''].filter(Boolean).join(' ')}
              onClick={() => onSelect?.(item.id)}
            >
              <span className="ui-web-segmented-tabs__label">{item.label}</span>
              {item.metaLabel ? <span className="ui-web-segmented-tabs__meta">{item.metaLabel}</span> : null}
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
        <section className="ui-web-rail-service-list">
          <h3 className="ui-web-rail-service-list__title">{title}</h3>
          <input
            className="ui-web-rail-service-list__search"
            type="search"
            value={searchValue}
            onChange={(event) => onSearchChange?.(event.target.value)}
            placeholder={searchPlaceholder}
          />
          <div className="ui-web-rail-service-list__list">
            {visibleItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => onServiceSelect?.(item.id)}
                className={['ui-web-command-center__rail-item', selectedServiceId === item.id ? 'ui-web-command-center__rail-item--active' : ''].filter(Boolean).join(' ')}
              >
                <span className="ui-web-rail-service-list__label">{item.label}</span>
                {item.status ? <span className="ui-web-rail-service-list__status">{item.status}</span> : null}
              </button>
            ))}
          </div>
        </section>
      </>
    );
  }


