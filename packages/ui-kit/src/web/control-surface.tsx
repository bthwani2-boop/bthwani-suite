import React from 'react';
import { useDirection } from '../providers';

const webControlSurfaceCss = `
.bth-web-control-surface-header {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 18px;
  padding: 22px;
  border-radius: 22px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background:
    linear-gradient(135deg, rgba(10, 47, 92, 0.06) 0%, rgba(255, 80, 13, 0.045) 100%),
    #ffffff;
  box-shadow: 0 18px 36px rgba(10, 47, 92, 0.06);
  text-align: start;
}

.bth-web-control-surface-header__main {
  display: grid;
  gap: 10px;
  min-width: 0;
  flex: 1;
}

.bth-web-control-surface-header__chips {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}

.bth-web-control-surface-header__chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 999px;
  border: 1px solid rgba(10, 47, 92, 0.1);
  background: rgba(255, 255, 255, 0.92);
  color: #0A2F5C;
  font-size: 12px;
  font-weight: 800;
}

.bth-web-control-surface-header__chip--brand {
  border-color: rgba(10, 47, 92, 0.14);
  background: rgba(10, 47, 92, 0.06);
}

.bth-web-control-surface-header__chip--accent {
  border-color: rgba(255, 80, 13, 0.16);
  background: rgba(255, 80, 13, 0.08);
  color: #FF500D;
}

.bth-web-control-surface-header__title {
  margin: 0;
  color: #0A2F5C;
  font-size: clamp(28px, 3vw, 38px);
  line-height: 1.08;
  font-weight: 900;
  letter-spacing: -0.03em;
}

.bth-web-control-surface-header__description {
  margin: 0;
  max-width: 62ch;
  color: #475569;
  font-size: 14px;
  line-height: 1.8;
}

.bth-web-control-surface-header__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 10px;
}

.bth-web-control-action-button {
  appearance: none;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid rgba(10, 47, 92, 0.12);
  background: #ffffff;
  color: #0A2F5C;
  text-decoration: none;
  font: inherit;
  font-weight: 800;
  cursor: pointer;
  text-align: center;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.bth-web-control-action-button:hover,
.bth-web-control-action-card:hover,
.bth-web-control-disclosure-item:hover {
  transform: translateY(-1px);
}

.bth-web-control-action-button--primary {
  border-color: #FF500D;
  background: #FF500D;
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(255, 80, 13, 0.18);
}

.bth-web-control-action-button--secondary {
  border-color: rgba(10, 47, 92, 0.12);
  background: #ffffff;
}

.bth-web-control-action-card {
  appearance: none;
  box-sizing: border-box;
  display: grid;
  gap: 10px;
  width: 100%;
  min-width: 0;
  min-height: 144px;
  padding: 14px;
  border-radius: 18px;
  border: 1px solid rgba(10, 47, 92, 0.1);
  background: linear-gradient(180deg, #ffffff 0%, rgba(10, 47, 92, 0.02) 100%);
  color: inherit;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
  text-align: start;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease, background 0.15s ease;
}

.bth-web-control-action-card--primary {
  border-color: rgba(255, 80, 13, 0.22);
  background: linear-gradient(180deg, rgba(255, 244, 237, 0.95) 0%, #ffffff 100%);
  box-shadow: 0 10px 24px rgba(255, 80, 13, 0.08);
}

.bth-web-control-action-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.bth-web-control-action-card__title {
  color: #0A2F5C;
  font-size: 16px;
  font-weight: 900;
}

.bth-web-control-action-card__badge,
.bth-web-control-disclosure-item__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 8px;
  border-radius: 999px;
  border: 1px solid rgba(255, 80, 13, 0.16);
  background: rgba(255, 80, 13, 0.08);
  color: #FF500D;
  font-size: 11px;
  font-weight: 800;
  white-space: nowrap;
}

.bth-web-control-action-card__description {
  margin: 0;
  color: #475569;
  font-size: 13px;
  line-height: 1.7;
}

.bth-web-control-action-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-top: auto;
  color: #64748b;
  font-size: 12px;
  font-weight: 700;
}

.bth-web-control-action-card__footer-arrow {
  color: #FF500D;
  font-size: 14px;
}

.bth-web-control-disclosure-item {
  appearance: none;
  box-sizing: border-box;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  width: 100%;
  min-width: 0;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid rgba(10, 47, 92, 0.08);
  background: rgba(10, 47, 92, 0.02);
  color: inherit;
  text-decoration: none;
  font: inherit;
  cursor: pointer;
  text-align: start;
  transition: transform 0.15s ease, border-color 0.15s ease, box-shadow 0.15s ease;
}

.bth-web-control-disclosure-item__text {
  display: grid;
  gap: 4px;
  min-width: 0;
}

.bth-web-control-disclosure-item__label {
  color: #0A2F5C;
  font-size: 13px;
  font-weight: 800;
}

.bth-web-control-disclosure-item__description {
  color: #64748b;
  font-size: 12px;
  line-height: 1.6;
}

@media (max-width: 640px) {
  .bth-web-control-surface-header {
    padding: 16px;
  }

  .bth-web-control-surface-header__actions {
    width: 100%;
  }

  .bth-web-control-surface-header__actions .bth-web-control-action-button {
    width: 100%;
  }
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
    'bth-web-control-action-button',
    action.tone === 'primary'
      ? 'bth-web-control-action-button--primary'
      : 'bth-web-control-action-button--secondary',
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
      <section className="bth-web-control-surface-header" dir={direction}>
        <div className="bth-web-control-surface-header__main">
          {chips.length > 0 ? (
            <div className="bth-web-control-surface-header__chips">
              {chips.map((chip) => {
                const chipClassName = [
                  'bth-web-control-surface-header__chip',
                  chip.tone === 'brand' ? 'bth-web-control-surface-header__chip--brand' : '',
                  chip.tone === 'accent' ? 'bth-web-control-surface-header__chip--accent' : '',
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

          <h1 className="bth-web-control-surface-header__title">{title}</h1>
          {description ? <p className="bth-web-control-surface-header__description">{description}</p> : null}
        </div>

        {actions.length > 0 ? (
          <div className="bth-web-control-surface-header__actions">
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
    'bth-web-control-action-card',
    tone === 'primary' ? 'bth-web-control-action-card--primary' : '',
  ]
    .filter(Boolean)
    .join(' ');

  const content = (
    <>
      <div className="bth-web-control-action-card__top">
        <strong className="bth-web-control-action-card__title">{title}</strong>
        {badge ? <span className="bth-web-control-action-card__badge">{badge}</span> : null}
      </div>
      <p className="bth-web-control-action-card__description">{description}</p>
      <span className="bth-web-control-action-card__footer">
        <span>{footerLabel}</span>
        <span className="bth-web-control-action-card__footer-arrow">&gt;</span>
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
      <div className="bth-web-control-disclosure-item__text">
        <strong className="bth-web-control-disclosure-item__label">{label}</strong>
        <span className="bth-web-control-disclosure-item__description">{description}</span>
      </div>
      {badge ? <span className="bth-web-control-disclosure-item__badge">{badge}</span> : null}
    </>
  );

  return (
    <>
      <WebControlSurfaceStyles />
      {href ? (
        <a
          key={id ?? label}
          href={href}
          className="bth-web-control-disclosure-item"
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
        <button key={id ?? label} type="button" className="bth-web-control-disclosure-item" onClick={onAction}>
          {content}
        </button>
      )}
    </>
  );
}
