import React, { type ReactNode } from 'react';
import styles from './BthWebSectionCard.module.css';

export type BthWebSectionCardProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export function BthWebSectionCard({ title, description, children }: BthWebSectionCardProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>
      {children}
    </section>
  );
}