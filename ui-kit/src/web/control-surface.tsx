import React from 'react';
import { useDirection } from '../providers';

const webControlSurfaceCss = `
.ui-web-control-surface-header {
  position: relative;
  isolation: isolate;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
  padding: 18px;
  border-radius: 16px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background:
    radial-gradient(circle at top right, rgba(255, 80, 13, 0.09), transparent 24%),
    linear-gradient(135deg, rgba(10, 47, 92, 0.08) 0%, rgba(255, 80, 13, 0.055) 58%, rgba(255, 255, 255, 0.96) 100%),
    #ffffff;
  box-shadow: 0 10px 24px rgba(10, 47, 92, 0.05);
  text-align: start;
  overflow: hidden;
}

.ui-web-control-surface-header::after {
  content: '';
  position: absolute;
  inset: auto auto -22% -4%;
  width: 44%;
  height: 58%;
  background: radial-gradient(circle, rgba(10, 47, 92, 0.08) 0%, transparent 70%);
  pointer-events: none;
  z-index: -1;
}
.ui-web-control-surface-header__main {
  display: grid;
  gap: 8px;
  min-width: 0;
  flex: 1;
}
.ui-web-control-surface-header__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.ui-web-control-surface-header__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 7px 11px;
  border-radius: 999px;
  border: 1px solid rgba(10, 47, 92, 0.1);
  background: rgba(255, 255, 255, 0.9);
  color: #0A2F5C;
  font-size: 12px;
  font-weight: 800;
}
.ui-web-control-surface-header__chip--brand {
  border-color: rgba(10, 47, 92, 0.14);
  background: rgba(10, 47, 92, 0.06);
}
.ui-web-control-surface-header__chip--accent {
  border-color: rgba(255, 80, 13, 0.16);
  background: rgba(255, 80, 13, 0.08);
  color: #FF500D;
}
.ui-web-control-surface-header__title {
  margin: 0;
  color: #08284f;
  font-size: 28px;
  line-height: 1.12;
  font-weight: 900;
  letter-spacing: 0;
  max-width: 22ch;
}
.ui-web-control-surface-header__description {
  max-width: 64ch;
  color: #4a6078;
  font-size: 14px;
  line-height: 1.85;
}
.ui-web-control-surface-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
}
.ui-web-control-action-button {
  appearance: none;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  padding: 0 14px;
  border-radius: 999px;
  border: 1px solid rgba(10, 47, 92, 0.12);
  background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
  color: #0A2F5C;
  text-decoration: none;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}
.ui-web-control-action-button:hover,
.ui-web-control-action-card:hover,
.ui-web-control-disclosure-item:hover {
  transform: translateY(-1px);
}
.ui-web-control-action-button--primary {
  border-color: #FF500D;
  background: linear-gradient(135deg, #ff6a2f 0%, #FF500D 58%, #e94900 100%);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(255, 80, 13, 0.18);
}
.ui-web-control-action-button--secondary {
  border-color: rgba(10, 47, 92, 0.12);
  background: linear-gradient(180deg, #ffffff 0%, #f4f8fb 100%);
}
.ui-web-control-action-card {
  appearance: none;
  box-sizing: border-box;
  display: grid;
  gap: 8px;
  width: 100%;
  min-width: 0;
  min-height: 128px;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.98) 0%, rgba(243, 247, 251, 0.96) 100%);
  color: inherit;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
  text-align: start;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
  box-shadow: 0 6px 16px rgba(10, 47, 92, 0.04);
}
.ui-web-control-action-card--primary {
  border-color: rgba(255, 80, 13, 0.22);
  background: linear-gradient(180deg, rgba(255, 244, 237, 0.98) 0%, #ffffff 100%);
  box-shadow: 0 8px 18px rgba(255, 80, 13, 0.1);
}

.ui-web-control-action-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}
.ui-web-control-action-card__title {
  color: #0A2F5C;
  font-size: 15px;
  font-weight: 900;
  letter-spacing: 0;
}
.ui-web-control-action-card__badge,
.ui-web-control-disclosure-item__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 80, 13, 0.16);
  background: linear-gradient(180deg, rgba(255, 239, 231, 0.98) 0%, rgba(255, 226, 211, 0.94) 100%);
  color: #FF500D;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}
.ui-web-control-action-card__description {
  margin: 0;
  color: #4d637b;
  font-size: 13px;
  line-height: 1.8;
}
.ui-web-control-action-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  color: #5f7389;
  font-size: 12px;
  font-weight: 800;
}
.ui-web-control-action-card__footer-arrow {
  color: #FF500D;
  font-size: 14px;
}
.ui-web-control-disclosure-item {
  appearance: none;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: linear-gradient(180deg, rgba(247, 250, 252, 0.98) 0%, rgba(242, 246, 250, 0.94) 100%);
  color: inherit;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
  text-align: start;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
  box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.65);
}
.ui-web-control-disclosure-item__text {
  display: grid;
  gap: 4px;
  min-width: 0;
}
.ui-web-control-disclosure-item__label {
  color: #0A2F5C;
  font-size: 13px;
  font-weight: 900;
}
.ui-web-control-disclosure-item__description {
  color: #64748b;
  font-size: 12px;
  line-height: 1.7;
}

@media (max-width: 640px) {
  .ui-web-control-surface-header {
    padding: 14px;
  }

  .ui-web-control-surface-header__actions {
    width: 100%;
  }

  .ui-web-control-surface-header__actions .ui-web-control-action-button {
    width: 100%;
  }
}
.ui-web-compact-surface-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 16px;
  background-color: #FFFFFF;
  border-bottom: 1px solid rgba(10, 47, 92, 0.06);
  border-radius: 12px;
  margin-bottom: 12px;
}
.ui-web-compact-surface-header__title-block {
  display: flex;
  align-items: center;
  gap: 16px;
}
.ui-web-compact-surface-header__title {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #0A2F5C;
}
.ui-web-compact-surface-header__description {
  margin: 0;
  font-size: 13px;
  color: #64748B;
}
.ui-web-compact-surface-header__pulse {
  display: flex;
  gap: 12px;
  align-items: center;
}
.ui-web-compact-surface-header__pulse-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background-color: rgba(10, 47, 92, 0.04);
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  color: #0A2F5C;
}
.ui-web-compact-surface-header__pulse-item span:first-child {
  color: #64748B;
  font-size: 11px;
}
.ui-web-system-suggestion {
  margin-top: 8px;
  padding: 8px 10px;
  background-color: rgba(10, 47, 92, 0.03);
  border-radius: 6px;
  border: 1px solid rgba(10, 47, 92, 0.07);
  display: flex;
  flex-direction: column;
  gap: 3px;
  text-align: right;
  direction: rtl;
}
.ui-web-system-suggestion__header {
  font-size: 12px;
  font-weight: 700;
  color: #0A2F5C;
}
.ui-web-system-suggestion__reason {
  font-size: 11px;
  color: #64748B;
}
.ui-web-system-suggestion__meta {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 2px;
}
.ui-web-system-suggestion__actions {
  display: flex;
  gap: 6px;
  margin-top: 4px;
  flex-wrap: wrap;
}
.ui-web-system-suggestion__conf-high {
  font-size: 10px;
  font-weight: 700;
  color: #16A34A;
  background-color: #DCFCE7;
  padding: 1px 6px;
  border-radius: 99px;
}
.ui-web-system-suggestion__conf-medium {
  font-size: 10px;
  font-weight: 700;
  color: #D97706;
  background-color: #FEF3C7;
  padding: 1px 6px;
  border-radius: 99px;
}
.ui-web-system-suggestion__conf-low {
  font-size: 10px;
  font-weight: 700;
  color: #DC2626;
  background-color: #FEF2F2;
  padding: 1px 6px;
  border-radius: 99px;
}
.ui-web-system-suggestion__audit {
  font-size: 10px;
  font-weight: 700;
  color: #DC2626;
  background-color: #FEF2F2;
  padding: 1px 6px;
  border-radius: 99px;
}
.ui-web-system-suggestion__btn-primary {
  padding: 4px 10px;
  background-color: #FF500D;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 700;
  cursor: pointer;
}
.ui-web-system-suggestion__btn-secondary {
  padding: 4px 10px;
  background-color: #F1F5F9;
  color: #0A2F5C;
  border: none;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
}
`;

function WebControlSurfaceStyles() {
  return <style>{webControlSurfaceCss}</style>;
}

export type WebControlSurfaceActionTone = 'primary' | 'secondary';

export type WebControlSurfaceAction = {
  id?: string;
  label: string;
  href?: string;
  onAction?: () => void;
  tone?: WebControlSurfaceActionTone;
};

type RenderableControlAction = WebControlSurfaceAction & {
  className?: string;
};

function renderControlAction(action: RenderableControlAction, key: React.Key) {
  const className = [
    'ui-web-control-action-button',
    action.tone === 'primary'
      ? 'ui-web-control-action-button--primary'
      : 'ui-web-control-action-button--secondary',
    action.className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  if (action.href) {
    return (
      <a
        key={key}
        href={action.href}
        className={className}
        onClick={(event) => {
          if (action.onAction) {
            event.preventDefault();
            action.onAction();
          }
        }}
      >
        {action.label}
      </a>
    );
  }

  return (
    <button key={key} type="button" className={className} onClick={action.onAction}>
      {action.label}
    </button>
  );
}

export type WebControlActionButtonProps = WebControlSurfaceAction & {
  className?: string;
};

export function WebControlActionButton(props: WebControlActionButtonProps) {
  return (
    <>
      <WebControlSurfaceStyles />
      {renderControlAction(props, props.id ?? props.label)}
    </>
  );
}

export type WebControlSurfaceHeaderChipTone = 'neutral' | 'brand' | 'accent';

export type WebControlSurfaceHeaderChip = {
  id?: string;
  label: string;
  tone?: WebControlSurfaceHeaderChipTone;
};

export type WebControlSurfaceHeaderProps = {
  chips?: ReadonlyArray<WebControlSurfaceHeaderChip>;
  title: string;
  description?: string;
  actions?: ReadonlyArray<WebControlSurfaceAction>;
};

export function WebControlSurfaceHeader({
  chips = [],
  title,
  description,
  actions = [],
}: WebControlSurfaceHeaderProps) {
  const { direction } = useDirection();

  return (
    <>
      <WebControlSurfaceStyles />
      <section className="ui-web-control-surface-header" dir={direction}>
        <div className="ui-web-control-surface-header__main">
          {chips.length > 0 ? (
            <div className="ui-web-control-surface-header__chips">
              {chips.map((chip) => {
                const chipClassName = [
                  'ui-web-control-surface-header__chip',
                  chip.tone === 'brand' ? 'ui-web-control-surface-header__chip--brand' : '',
                  chip.tone === 'accent' ? 'ui-web-control-surface-header__chip--accent' : '',
                ]
                  .filter(Boolean)
                  .join(' ');

                return (
                  <span key={chip.id ?? chip.label} className={chipClassName}>
                    {chip.label}
                  </span>
                );
              })}
            </div>
          ) : null}

          <h1 className="ui-web-control-surface-header__title">{title}</h1>
          {description ? <p className="ui-web-control-surface-header__description">{description}</p> : null}
        </div>

        {actions.length > 0 ? (
          <div className="ui-web-control-surface-header__actions">
            {actions.map((action) => renderControlAction(action, action.id ?? action.label))}
          </div>
        ) : null}
      </section>
    </>
  );
}

export type WebControlActionCardProps = {
  id?: string;
  title: string;
  description: string;
  footerLabel: string;
  href?: string;
  badge?: string;
  tone?: WebControlSurfaceActionTone;
  onAction?: () => void;
};

export function WebControlActionCard({
  id,
  title,
  description,
  footerLabel,
  href,
  badge,
  tone = 'secondary',
  onAction,
}: WebControlActionCardProps) {
  const className = [
    'ui-web-control-action-card',
    tone === 'primary' ? 'ui-web-control-action-card--primary' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <div className="ui-web-control-action-card__top">
        <strong className="ui-web-control-action-card__title">{title}</strong>
        {badge ? <span className="ui-web-control-action-card__badge">{badge}</span> : null}
      </div>
      <p className="ui-web-control-action-card__description">{description}</p>
      <span className="ui-web-control-action-card__footer">
        <span>{footerLabel}</span>
        <span className="ui-web-control-action-card__footer-arrow">&gt;</span>
      </span>
    </>
  );

  return (
    <>
      <WebControlSurfaceStyles />
      {href ? (
        <a
          key={id ?? title}
          href={href}
          className={className}
          onClick={(event) => {
            if (onAction) {
              event.preventDefault();
              onAction();
            }
          }}
        >
          {content}
        </a>
      ) : (
        <button key={id ?? title} type="button" className={className} onClick={onAction}>
          {content}
        </button>
      )}
    </>
  );
}

export type WebControlDisclosureItemProps = {
  id?: string;
  label: string;
  description: string;
  href?: string;
  badge?: string;
  onAction?: () => void;
};

export function WebControlDisclosureItem({
  id,
  label,
  description,
  href,
  badge,
  onAction,
}: WebControlDisclosureItemProps) {
  const content = (
    <>
      <div className="ui-web-control-disclosure-item__text">
        <strong className="ui-web-control-disclosure-item__label">{label}</strong>
        <span className="ui-web-control-disclosure-item__description">{description}</span>
      </div>
      {badge ? <span className="ui-web-control-disclosure-item__badge">{badge}</span> : null}
    </>
  );

  return (
    <>
      <WebControlSurfaceStyles />
      {href ? (
        <a
          key={id ?? label}
          href={href}
          className="ui-web-control-disclosure-item"
          onClick={(event) => {
            if (onAction) {
              event.preventDefault();
              onAction();
            }
          }}
        >
          {content}
        </a>
      ) : (
        <button key={id ?? label} type="button" className="ui-web-control-disclosure-item" onClick={onAction}>
          {content}
        </button>
      )}
    </>
  );
}

export type WebCompactSurfaceHeaderProps = {
  title: string;
  description?: string;
  metrics?: ReadonlyArray<{ id: string; title: string; value: string }>;
};

export function WebCompactSurfaceHeader({ title, description, metrics = [] }: WebCompactSurfaceHeaderProps) {
  return (
    <>
      <WebControlSurfaceStyles />
      <header className="ui-web-compact-surface-header" dir="rtl">
        <div className="ui-web-compact-surface-header__title-block">
          <h1 className="ui-web-compact-surface-header__title">{title}</h1>
          {description && <p className="ui-web-compact-surface-header__description">{description}</p>}
        </div>
        <div className="ui-web-compact-surface-header__pulse">
          {metrics.map((metric) => (
            <div key={metric.id} className="ui-web-compact-surface-header__pulse-item">
              <span>{metric.title}</span>
              <span>{metric.value}</span>
            </div>
          ))}
        </div>
      </header>
    </>
  );
}

export type WebSystemSuggestionActionProps = {
  id: string;
  label: string;
  tone?: 'primary' | 'secondary';
  onAction?: () => void;
};

export type WebSystemSuggestionProps = {
  title: string;
  reason?: string;
  confidence?: 'high' | 'medium' | 'low';
  auditTag?: string;
  primaryAction?: WebSystemSuggestionActionProps;
  secondaryAction?: WebSystemSuggestionActionProps;
};

export function WebSystemSuggestion({
  title,
  reason,
  confidence,
  auditTag,
  primaryAction,
  secondaryAction,
}: WebSystemSuggestionProps) {
  return (
    <>
      <WebControlSurfaceStyles />
      <div className="ui-web-system-suggestion">
        <span className="ui-web-system-suggestion__header">{title}</span>
        {reason && <span className="ui-web-system-suggestion__reason">{reason}</span>}
        <div className="ui-web-system-suggestion__meta">
          {confidence === 'high' && <span className="ui-web-system-suggestion__conf-high">ثقة عالية</span>}
          {confidence === 'medium' && <span className="ui-web-system-suggestion__conf-medium">ثقة متوسطة</span>}
          {confidence === 'low' && <span className="ui-web-system-suggestion__conf-low">مراجعة مطلوبة</span>}
          {auditTag && <span className="ui-web-system-suggestion__audit">{auditTag}</span>}
        </div>
        {(primaryAction || secondaryAction) && (
          <div className="ui-web-system-suggestion__actions">
            {primaryAction && (
              <button
                type="button"
                className="ui-web-system-suggestion__btn-primary"
                onClick={primaryAction.onAction}
              >
                {primaryAction.label}
              </button>
            )}
            {secondaryAction && (
              <button
                type="button"
                className="ui-web-system-suggestion__btn-secondary"
                onClick={secondaryAction.onAction}
              >
                {secondaryAction.label}
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
