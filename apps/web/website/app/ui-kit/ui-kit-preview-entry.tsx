'use client';

import dynamic from 'next/dynamic';
import type { UiKitPreviewPageProps } from './ui-kit-preview-page';

const UiKitPreviewPage = dynamic(
  () => import('./ui-kit-preview-page').then((module) => module.UiKitPreviewPage),
  {
    ssr: false,
    loading: () => <p>Loading governed preview...</p>,
  }
);

export function UiKitPreviewEntry(props: UiKitPreviewPageProps) {
  return <UiKitPreviewPage {...props} />;
}