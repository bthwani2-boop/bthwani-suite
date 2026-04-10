import React from 'react';
import styles from './BthWebMissionHeroCard.module.css';

export type BthWebMissionHeroCardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  badges?: ReadonlyArray<string>;
  metaItems?: ReadonlyArray<string>;
  primaryAction?: { label: string; href: string };
  secondaryAction?: { label: string; href: string };
};

export function BthWebMissionHeroCard({
  eyebrow,
  title,
  description,
  badges = [],
  metaItems = [],
  primaryAction,
  secondaryAction,
}: BthWebMissionHeroCardProps) {
  return (
    <article className={styles.card}>
      {badges.length > 0 ? (
        <div className={styles.badgeRow}>
          {badges.map((badge) => (
            <span key={badge} className={styles.badge}>
              {badge}
            </span>
          ))}
        </div>
      ) : null}

      {eyebrow ? <p className={styles.eyebrow}>{eyebrow}</p> : null}
      <h2 className={styles.title}>{title}</h2>
      {description ? <p className={styles.description}>{description}</p> : null}

      {metaItems.length > 0 ? (
        <div className={styles.metaRow}>
          {metaItems.map((item) => (
            <span key={item} className={styles.metaChip}>
              {item}
            </span>
          ))}
        </div>
      ) : null}

      {(primaryAction || secondaryAction) ? (
        <div className={styles.ctaRow}>
          {secondaryAction ? (
            <a className={styles.secondaryCta} href={secondaryAction.href}>
              {secondaryAction.label}
            </a>
          ) : null}
          {primaryAction ? (
            <a className={styles.primaryCta} href={primaryAction.href}>
              {primaryAction.label}
            </a>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

export default BthWebMissionHeroCard;