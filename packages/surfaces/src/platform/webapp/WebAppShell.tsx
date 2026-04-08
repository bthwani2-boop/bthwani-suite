import React from 'react';
import { BthWebPageFrame, BthWebSectionCard } from '@bthwani/ui-kit';
import styles from '../shared-web-shell.module.css';

export type WebAppShellProps = Record<string, never>;

const webAppOperatingPrinciples = [
  'Routes stay thin and delegate shared framing to ui-kit.',
  'Surface composition belongs here, but theme, spacing, and shell primitives do not.',
  'Future workflow screens can plug into this shell without rebuilding root behavior.',
] as const;

export function WebAppShell(_props: WebAppShellProps) {
  return (
    <BthWebPageFrame
      eyebrow="BThwani WebApp"
      title="Operational web surface with centralized UI authority"
      description="This shell is the sanctioned entrypoint for the application web surface. Shared styling decisions now stay inside ui-kit."
      centered
      maxWidth={900}
    >
      <BthWebSectionCard
        title="Operating model"
        description="Application-specific composition lives in surfaces while shared UI decisions stay upstream."
      >
        <div className={styles.stack}>
          {webAppOperatingPrinciples.map((item) => (
            <p key={item} className={styles.mutedParagraph}>
              {item}
            </p>
          ))}
        </div>
      </BthWebSectionCard>
    </BthWebPageFrame>
  );
}

export default WebAppShell;