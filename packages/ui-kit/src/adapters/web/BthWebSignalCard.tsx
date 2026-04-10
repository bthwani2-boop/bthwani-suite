import React from 'react';
import styles from './BthWebSignalCard.module.css';

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
  return (
    <article
      className={[
        styles.card,
        tone === 'best' ? styles.cardBest : '',
        tone === 'danger' ? styles.cardDanger : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <p className={styles.title}>{title}</p>
      <p className={styles.value}>{value}</p>
      <p className={styles.description}>{description}</p>
    </article>
  );
}

export default BthWebSignalCard;