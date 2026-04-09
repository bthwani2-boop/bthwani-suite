'use client';

import {
  BthButton,
  BthChip,
  BthComponentLab,
  BthDataTable,
  BthKeyValueList,
  BthSegmentedControl,
  BthStateGallery,
  BthTabs,
  BthText,
  UiKitProvider,
} from '@bthwani/ui-kit';
import { useMemo, useState } from 'react';
import styles from './ui-kit-preview.module.css';

type PreviewTheme = 'light' | 'dark' | 'high-contrast';
type PreviewSection = 'lab' | 'states' | 'proof';
type PreviewLanguage = 'ar' | 'en';
type PreviewDirection = 'rtl' | 'ltr';

export type UiKitPreviewPageProps = {
  initialTheme?: string;
  initialSection?: string;
  initialLanguage?: string;
  initialDirection?: string;
};

function resolveTheme(value?: string): PreviewTheme {
  return value === 'dark' || value === 'high-contrast' ? value : 'light';
}

function resolveSection(value?: string): PreviewSection {
  return value === 'states' || value === 'proof' ? value : 'lab';
}

function resolveLanguage(value?: string): PreviewLanguage {
  return value === 'en' ? 'en' : 'ar';
}

function resolveDirection(value?: string): PreviewDirection {
  return value === 'ltr' ? 'ltr' : 'rtl';
}

export function UiKitPreviewPage({
  initialTheme,
  initialSection,
  initialLanguage,
  initialDirection,
}: UiKitPreviewPageProps) {
  const [theme, setTheme] = useState<PreviewTheme>(resolveTheme(initialTheme));
  const [section, setSection] = useState<PreviewSection>(resolveSection(initialSection));
  const [language, setLanguage] = useState<PreviewLanguage>(resolveLanguage(initialLanguage));
  const [direction, setDirection] = useState<PreviewDirection>(resolveDirection(initialDirection));

  const proofSummary = useMemo(
    () => [
      { label: 'Authority', value: 'Single visual and interaction authority', tone: 'brand' as const },
      { label: 'Acceptance', value: 'Gates before approval, not cleanup after drift' },
      { label: 'Recovery', value: 'Complete states and clear recovery paths' },
      { label: 'Central improvement', value: 'Typography, spacing, headers, buttons, cards, states, and theme behavior improve from one place' },
    ],
    []
  );

  const gateRows = useMemo(
    () => [
      { id: 'gate-clarity', gate: 'Primary clarity', requirement: 'The main task and main action are obvious within seconds.' },
      { id: 'gate-states', gate: 'State completion', requirement: 'Loading, empty, success, error, offline, and recovery states are complete.' },
      { id: 'gate-i18n', gate: 'RTL and language parity', requirement: 'RTL/LTR and ar/en remain correct without local patches.' },
      { id: 'gate-accessibility', gate: 'Accessibility', requirement: 'The screen is accessible and remains expandable without spawning local systems.' },
    ],
    []
  );

  const previewChips = [
    	heme: ,
    section: ,
    language: ,
    direction: ,
    'route: /ui-kit',
  ];

  return (
    <UiKitProvider direction={direction} language={language} themeMode={theme}>
      <div className={styles.shell}>
        <div className={styles.metaRow}>
          {previewChips.map((chip) => (
            <div key={chip} data-bth-root="true" data-bth-theme={theme} className={styles.inlineChip}>
              <BthChip label={chip} selected tone="brand" />
            </div>
          ))}
        </div>

        <div className={styles.controlGrid}>
          <div data-bth-root="true" data-bth-theme={theme} className={styles.controlCard}>
            <div className={styles.controlStack}>
              <BthText role="titleSm">Hosted controls</BthText>
              <BthText role="bodySm" tone="muted">
                This route is the governed preview and proof surface for ui-kit. It proves that new screens inherit one family, one quality bar, and one approval path.
              </BthText>
              <BthTabs
                value={section}
                onValueChange={(nextValue) => setSection(nextValue as PreviewSection)}
                stretch
                testID="ui-kit-preview-sections"
                items={[
                  { value: 'lab', label: 'Lab' },
                  { value: 'states', label: 'States' },
                  { value: 'proof', label: 'Proof' },
                ]}
              />
              <BthSegmentedControl
                value={theme}
                onValueChange={(nextValue) => setTheme(nextValue as PreviewTheme)}
                options={[
                  { value: 'light', label: 'Light' },
                  { value: 'dark', label: 'Dark' },
                  { value: 'high-contrast', label: 'High contrast' },
                ]}
              />
              <BthSegmentedControl
                value={language}
                onValueChange={(nextValue) => setLanguage(nextValue as PreviewLanguage)}
                options={[
                  { value: 'ar', label: 'Arabic' },
                  { value: 'en', label: 'English' },
                ]}
              />
              <BthSegmentedControl
                value={direction}
                onValueChange={(nextValue) => setDirection(nextValue as PreviewDirection)}
                options={[
                  { value: 'rtl', label: 'RTL' },
                  { value: 'ltr', label: 'LTR' },
                ]}
              />
            </div>
          </div>

          <div data-bth-root="true" data-bth-theme={theme} className={styles.controlCard}>
            <div className={styles.controlStack}>
              <BthText role="titleSm">Approval law</BthText>
              <BthText role="bodyMd">
                The UI Kit must not merely enable good screens; it must make weak screens difficult to produce and impossible to approve.
              </BthText>
              <BthText role="bodySm" tone="muted">
                A polished surface is still invalid if it hides the primary task, overloads the user, breaks state recovery, or drifts from the governed family.
              </BthText>
              <BthButton
                label={section === 'proof' ? 'Proof summary active' : 'Jump to proof summary'}
                fullWidth={false}
                onPress={() => setSection('proof')}
              />
            </div>
          </div>
        </div>

        <div
          data-bth-root="true"
          data-bth-theme={theme}
          data-preview-direction={direction}
          data-preview-language={language}
          data-preview-section={section}
          data-testid="ui-kit-preview-surface"
          className={styles.previewSurface}
        >
          {section === 'lab' ? (
            <BthComponentLab />
          ) : section === 'states' ? (
            <BthStateGallery language={language} />
          ) : (
            <div className={styles.proofPanel}>
              <BthText role="titleLg">Proof Summary</BthText>
              <BthText role="bodyMd" tone="muted">
                This section translates the constitutional rules into measurable proof. No screen is approved unless it passes clarity, state completeness, identity, direction, language, accessibility, and future-scale gates.
              </BthText>
              <BthKeyValueList items={proofSummary} />
              <BthDataTable
                caption="Mandatory gates before approval"
                rows={gateRows}
                rowKey="id"
                columns={[
                  { id: 'gate', header: 'Gate', renderCell: (row) => row.gate, grow: 1 },
                  { id: 'requirement', header: 'Requirement', renderCell: (row) => row.requirement, grow: 2 },
                ]}
              />
            </div>
          )}
        </div>
      </div>
    </UiKitProvider>
  );
}
