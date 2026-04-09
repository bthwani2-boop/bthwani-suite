import { BthWebPageFrame, BthWebSectionCard } from '@bthwani/ui-kit/web';
import { UiKitPreviewEntry } from './ui-kit-preview-entry';

type SearchParams = Promise<{
  theme?: string;
  section?: string;
  language?: string;
}>;

export default async function UiKitHostedPreviewPage({ searchParams }: { searchParams: SearchParams }) {
  const resolvedSearchParams = await searchParams;

  return (
    <BthWebPageFrame
      eyebrow="BTH UI Kit"
      title="UI Kit Hosted Preview"
      description="This hosted shell renders the same governed ui-kit runtime that future screens must inherit, and it is the route used by visual and interaction proof."
      maxWidth={1240}
    >
      <BthWebSectionCard
        title="Sovereign quality rule"
        description="The hosted preview exists to prove that the system does not merely style screens; it governs clarity, behavior, proof, and identity from one place."
      >
        <UiKitPreviewEntry
          initialLanguage={resolvedSearchParams.language}
          initialSection={resolvedSearchParams.section}
          initialTheme={resolvedSearchParams.theme}
        />
      </BthWebSectionCard>
    </BthWebPageFrame>
  );
}