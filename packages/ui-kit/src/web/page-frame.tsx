import React, { type ReactNode } from 'react';
import { useDirection } from '../providers';

const webPageFrameCss = `
.bth-web-page-frame-root {
  display: flex;
  justify-content: center;
  padding: 24px;
}

.bth-web-page-frame-root--embedded {
  padding: 0;
}

.bth-web-page-frame-content {
  width: 100%;
  max-width: 960px;
}

.bth-web-page-frame-content--narrow {
  max-width: 880px;
}

.bth-web-page-frame-content--compact {
  max-width: 920px;
}

.bth-web-page-frame-content--regular {
  max-width: 980px;
}

.bth-web-page-frame-content--wide {
  max-width: 1120px;
}

.bth-web-page-frame-content--centered {
  text-align: center;
}

.bth-web-page-frame-eyebrow {
  margin: 0;
  font-size: 12px;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  color: #c2410c;
}

.bth-web-page-frame-title-block {
  display: grid;
  gap: 8px;
  margin-bottom: 20px;
}

.bth-web-page-frame-title-block--with-eyebrow {
  margin-top: 8px;
}

.bth-web-page-frame-title {
  margin: 0;
  font-size: 32px;
  line-height: 1.1;
  color: #0f172a;
}

.bth-web-page-frame-description {
  margin: 0;
  font-size: 16px;
  line-height: 1.6;
  color: #475569;
}

.bth-web-mission-hero-card {
  display: grid;
  gap: 16px;
  padding: 24px;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.3);
  background: linear-gradient(180deg, #fff7ed 0%, #ffffff 100%);
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.bth-web-mission-hero-card--dense {
  gap: 12px;
}

.bth-web-mission-hero-card__badge-row,
.bth-web-mission-hero-card__meta-row,
.bth-web-mission-hero-card__cta-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.bth-web-mission-hero-card__eyebrow {
  margin: 0;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.6px;
  color: #ea580c;
}

.bth-web-mission-hero-card__title {
  margin: 0;
  font-size: 34px;
  line-height: 1.1;
  color: #0f172a;
}

.bth-web-mission-hero-card--dense .bth-web-mission-hero-card__title {
  font-size: 28px;
}

.bth-web-mission-hero-card__description {
  margin: 0;
  font-size: 16px;
  line-height: 1.65;
  color: #334155;
}

.bth-web-mission-hero-card__badge,
.bth-web-mission-hero-card__meta-chip {
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

.bth-web-mission-hero-card__badge {
  padding: 4px 10px;
  background: #ffedd5;
  color: #c2410c;
}

.bth-web-mission-hero-card__meta-chip {
  padding: 6px 10px;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: rgba(255, 255, 255, 0.72);
  color: #334155;
}

.bth-web-mission-hero-card__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 16px;
  border-radius: 14px;
  text-decoration: none;
  font-weight: 700;
}

.bth-web-mission-hero-card__cta--secondary {
  border: 1px solid rgba(148, 163, 184, 0.35);
  color: #0f172a;
}

.bth-web-mission-hero-card__cta--primary {
  background: #f97316;
  color: #ffffff;
}

.bth-web-section-card {
  display: grid;
  gap: 16px;
  padding: 20px;
  border-radius: 24px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: #ffffff;
}

.bth-web-section-card__header {
  display: grid;
  gap: 8px;
}

.bth-web-section-card__title {
  margin: 0;
  font-size: 22px;
  color: #0f172a;
}

.bth-web-section-card__description {
  margin: 0;
  font-size: 15px;
  line-height: 1.6;
  color: #475569;
}

.bth-web-signal-card {
  display: grid;
  gap: 10px;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid rgba(148, 163, 184, 0.24);
  background: #ffffff;
}

.bth-web-signal-card--best {
  border-color: #bbf7d0;
  background: linear-gradient(180deg, #ecfdf3 0%, #ffffff 100%);
}

.bth-web-signal-card--danger {
  border-color: #fecaca;
  background: linear-gradient(180deg, #fef2f2 0%, #ffffff 100%);
}

.bth-web-signal-card__title {
  margin: 0;
  font-size: 13px;
  color: #475569;
}

.bth-web-signal-card__value {
  margin: 0;
  font-size: 28px;
  line-height: 1.1;
  font-weight: 800;
  color: #0f172a;
}

.bth-web-signal-card__description {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: #475569;
}
`;

function WebPageFrameStyles() {
  return <style>{webPageFrameCss}</style>;
}

export type BthWebPageFrameProps = {
  title: string;
  description?: string;
  eyebrow?: string;
  centered?: boolean;
  maxWidth?: number;
  embedded?: boolean;
  showHeader?: boolean;
  children?: ReactNode;
};

export function BthWebPageFrame({
  title,
  description,
  eyebrow,
  centered = false,
  maxWidth = 960,
  embedded = false,
  showHeader = true,
  children,
}: BthWebPageFrameProps) {
  const widthClassName = maxWidth <= 880
    ? 'bth-web-page-frame-content--narrow'
    : maxWidth <= 920
      ? 'bth-web-page-frame-content--compact'
      : maxWidth < 1000
        ? 'bth-web-page-frame-content--regular'
        : 'bth-web-page-frame-content--wide';

  const contentClassName = [
    'bth-web-page-frame-content',
    centered ? 'bth-web-page-frame-content--centered' : '',
    widthClassName,
  ]
    .filter(Boolean)
    .join(' ');

  const rootClassName = [
    'bth-web-page-frame-root',
    embedded ? 'bth-web-page-frame-root--embedded' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <WebPageFrameStyles />
      <div className={rootClassName}>
        <div className={contentClassName}>
          {showHeader && eyebrow ? <p className="bth-web-page-frame-eyebrow">{eyebrow}</p> : null}
          {showHeader ? (
            <div className={["bth-web-page-frame-title-block", eyebrow ? 'bth-web-page-frame-title-block--with-eyebrow' : ''].filter(Boolean).join(' ')}>
              <h1 className="bth-web-page-frame-title">{title}</h1>
              {description ? <p className="bth-web-page-frame-description">{description}</p> : null}
            </div>
          ) : null}
          {children}
        </div>
      </div>
    </>
  );
}

export type BthWebMissionHeroCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  dense?: boolean;
  badges?: ReadonlyArray<string>;
  metaItems?: ReadonlyArray<string>;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

export function BthWebMissionHeroCard({
  eyebrow,
  title,
  description,
  dense = false,
  badges = [],
  metaItems = [],
  primaryAction,
  secondaryAction,
}: BthWebMissionHeroCardProps) {
  const { direction } = useDirection();
  const cardClassName = ['bth-web-mission-hero-card', dense ? 'bth-web-mission-hero-card--dense' : ''].filter(Boolean).join(' ');

  return (
    <>
      <WebPageFrameStyles />
      <article className={cardClassName} dir={direction}>
        {badges.length > 0 ? (
          <div className="bth-web-mission-hero-card__badge-row">
            {badges.map((badge) => (
              <span key={badge} className="bth-web-mission-hero-card__badge">
                {badge}
              </span>
            ))}
          </div>
        ) : null}

        {eyebrow ? <p className="bth-web-mission-hero-card__eyebrow">{eyebrow}</p> : null}
        <h2 className="bth-web-mission-hero-card__title">{title}</h2>
        {description ? <p className="bth-web-mission-hero-card__description">{description}</p> : null}

        {metaItems.length > 0 ? (
          <div className="bth-web-mission-hero-card__meta-row">
            {metaItems.map((item) => (
              <span key={item} className="bth-web-mission-hero-card__meta-chip">
                {item}
              </span>
            ))}
          </div>
        ) : null}

        {(primaryAction || secondaryAction) ? (
          <div className="bth-web-mission-hero-card__cta-row">
            {secondaryAction ? (
              <a className="bth-web-mission-hero-card__cta bth-web-mission-hero-card__cta--secondary" href={secondaryAction.href}>
                {secondaryAction.label}
              </a>
            ) : null}
            {primaryAction ? (
              <a className="bth-web-mission-hero-card__cta bth-web-mission-hero-card__cta--primary" href={primaryAction.href}>
                {primaryAction.label}
              </a>
            ) : null}
          </div>
        ) : null}
      </article>
    </>
  );
}

export type BthWebSectionCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function BthWebSectionCard({ title, description, children }: BthWebSectionCardProps) {
  return (
    <>
      <WebPageFrameStyles />
      <section className="bth-web-section-card">
        <div className="bth-web-section-card__header">
          <h2 className="bth-web-section-card__title">{title}</h2>
          {description ? <p className="bth-web-section-card__description">{description}</p> : null}
        </div>
        {children}
      </section>
    </>
  );
}

export type BthWebSignalCardTone = 'neutral' | 'best' | 'danger';

export type BthWebSignalCardProps = {
  title: string;
  value: string;
  description: string;
  tone?: BthWebSignalCardTone;
};

export function BthWebSignalCard({
  title,
  value,
  description,
  tone = 'neutral',
}: BthWebSignalCardProps) {
  const className = ['bth-web-signal-card', tone === 'best' ? 'bth-web-signal-card--best' : '', tone === 'danger' ? 'bth-web-signal-card--danger' : '']
    .filter(Boolean)
    .join(' ');

  return (
    <>
      <WebPageFrameStyles />
      <article className={className}>
        <p className="bth-web-signal-card__title">{title}</p>
        <p className="bth-web-signal-card__value">{value}</p>
        <p className="bth-web-signal-card__description">{description}</p>
      </article>
    </>
  );
}
